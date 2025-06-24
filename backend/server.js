import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDb from './config/mongodb.js';
import userRoutes from './routes/userroutes.js';
import productRouter from './routes/productrouter.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import router from './controllers/carthandler.js';
import orderRouter from './routes/orderrouter.js';
import axios from 'axios';
import uploadRouter from './routes/uploadrouter.js';
import paymentRouter from './routes/paymentrouter.js';
import session from 'express-session';
import productModel from './models/productmodel.js'; // Make sure this import is present
import escapeStringRegexp from 'escape-string-regexp'; // Add this at the top (npm i escape-string-regexp)
import pluralize from 'pluralize'; // npm install pluralize
import Fuse from 'fuse.js'; // <-- Add this at the top with your other imports

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.urlencoded({ extended: true }));

// DB Connection
connectDb();

// Sessions
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

// Routers
app.use('/api/user', userRoutes);       // includes CAS route /api/user/cas-login
app.use('/api/product', productRouter);
app.use('/api/cart', router);
app.use('/api/order', orderRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/payment', paymentRouter);

// Gemini Text Generation
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY);
app.post('/api/generate-text', async (req, res) => {
  try {
    // Accept history (array) or prompt (string)
    const history = req.body.history || [];
    let prompt = req.body.prompt || '';
    prompt = prompt.trim();
    const promptLower = prompt.toLowerCase();

    // 1. Instant responses for greetings and common phrases
    if (/^(hi|hello|hey|good morning|good evening|good night)[\s!,.]*$/i.test(promptLower)) {
      return res.json({
        generatedText: "👋 Hi there! Welcome to the IIIT community buy & sell platform. How can I help you today? You can ask about buying, selling, posting a product, or anything related to the platform."
      });
    }
    if (/^(thanks|thank you|ty)[\s!,.]*$/i.test(promptLower)) {
      return res.json({
        generatedText: "You're welcome! 😊 If you have any more questions about buying, selling, or using the platform, just ask."
      });
    }
    if (/^(bye|goodbye|see you|cya)[\s!,.]*$/i.test(promptLower)) {
      return res.json({
        generatedText: "Goodbye! 👋 If you need help with buying or selling in the future, just open this chat again."
      });
    }

    const platformHelp = {
      buy: `To <b>buy</b> products, search for the item and click "Buy" on the product page.`,
      sell: `To <b>sell</b> a product, go to "Post Product" and fill in the details.`,
      post: `To <b>post</b> a product, go to "Post Product" and fill in the details.`,
      orders: `To view or manage your <b>orders</b>, go to "My Orders" in your profile.`,
      "my orders": `To view or manage your <b>orders</b>, go to "My Orders" in your profile.`,
      profile: `To view or edit your <b>profile</b>, click the user icon at the top right.`,
      cart: `To view your <b>cart</b>, use the cart icon at the top.`,
      wishlist: `To view your <b>wishlist</b>, use the wishlist icon at the top.`,
      account: `To manage your <b>account</b>, go to your profile settings.`,
      settings: `To change <b>settings</b>, go to your profile and select "Settings".`,
      logout: `To <b>logout</b>, click the user icon and select "Logout".`,
      login: `To <b>login</b>, click the user icon and sign in with your IIIT credentials.`,
      "sign in": `To <b>sign in</b>, click the user icon and enter your IIIT credentials.`,
      "sign out": `To <b>sign out</b>, click the user icon and select "Logout".`,
      help: `You can ask me about buying, selling, posting products, searching, orders, or platform usage!`,
      support: `For support, contact the platform admin or ask your question here.`,
    };

    const matchedKey = Object.keys(platformHelp).find(
      key => key === promptLower
    );

    if (matchedKey) {
      return res.json({
        generatedText: platformHelp[matchedKey]
      });
    }

    // Avoid product search for follow-ups like "yes", "ok", etc.
    const followUps = ['yes', 'ok', 'okay', 'sure', 'tell me more', 'more', 'go on', 'continue'];
    const wordCount = prompt.split(/\s+/).length;
    const isLikelyProductSearch =
      wordCount <= 2 &&
      prompt.length > 1 &&
      prompt.length < 50 &&
      /^[a-zA-Z0-9\s\-']+$/.test(prompt) &&
      !/[?!.]$/.test(prompt) &&
      !followUps.includes(promptLower) &&
      !Object.keys(platformHelp).includes(promptLower);

    if (isLikelyProductSearch) {
      const searchTerms = [
        promptLower,
        pluralize.singular(promptLower),
        pluralize.plural(promptLower)
      ];
      const regexes = searchTerms.map(term => new RegExp(`\\b${escapeStringRegexp(term)}`, 'i'));

      let products = await productModel.find({
        $or: [
          ...regexes.map(regex => ({ name: { $regex: regex } })),
          ...regexes.map(regex => ({ description: { $regex: regex } }))
        ]
      }).limit(5);

      // Fuzzy search fallback if no products found
      if (products.length === 0) {
        const allProducts = await productModel.find({}, 'name description price');
        const fuse = new Fuse(allProducts, {
          keys: ['name', 'description'],
          threshold: 0.4, // Lower = stricter, higher = fuzzier
        });
        const fuzzyResults = fuse.search(promptLower).slice(0, 5).map(r => r.item);
        products = fuzzyResults;
      }

      if (products.length > 0) {
        const productList = products.map(
          p => `• <b>${p.name}</b> (Rs. ${p.price})`
        ).join('<br/>');
        return res.json({
          generatedText: `Here are some products matching "<b>${prompt}</b>":<br/>${productList}<br/><br/>Want to know more about a product or how to buy/sell? Just ask!`
        });
      } else {
        return res.json({
          generatedText: `Sorry, no products matching "<b>${prompt}</b>" were found.<br/><br/>You can try searching with a different name, or ask me how to post a product, search for items, or manage your orders!`
        });
      }
    }

    // Use conversation history for Gemini
    let geminiPrompt = `
You are an assistant for the IIIT community buy & sell platform.
- If the user asks about buying, selling, posting products, searching, orders, or platform usage, answer helpfully and concisely.
- If the user types random text, nonsense, or off-topic questions, politely redirect them to platform-related topics and suggest what they can ask.
- If the user greets, respond warmly and offer help with platform features.
- Never answer questions unrelated to the platform (like general knowledge, jokes, etc).
- If the user seems lost, suggest they can ask about buying, selling, posting, searching, or managing orders.
`;

    if (history && Array.isArray(history) && history.length > 0) {
      geminiPrompt += '\n\nConversation so far:\n';
      history.forEach(msg => {
        geminiPrompt += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
      });
      geminiPrompt += `User: ${prompt}\n`;
    } else {
      geminiPrompt += `\nUser: ${prompt}\n`;
    }

    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });
    const result = await model.generateContent(geminiPrompt);
    const response = await result.response;
    const text = response.text();

    res.json({ generatedText: text || "Sorry, I couldn't generate a response. Please ask about buying, selling, or using the platform." });
  } catch (error) {
    console.error('Error in /generate-text:', error);
    res.status(500).json({ error: error.message });
  }
});

// Recaptcha Verification
app.post('/verify-recaptcha', async (req, res) => {
  const { captchaToken } = req.body;

  if (!captchaToken) {
    return res.status(400).json({ success: false, message: 'Captcha token is missing' });
  }

  try {
    const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
      params: {
        secret: process.env.RECAPTCHA_SECRET_KEY,
        response: captchaToken,
      },
    });

    const data = response.data;

    if (data.success) {
      res.status(200).json({ success: true, message: 'Captcha verified successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Captcha verification failed', errors: data['error-codes'] });
    }
  } catch (error) {
    console.error('Error verifying captcha:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Default route
app.get('/', (req, res) => res.status(404).send('Hello World'));

// Start server
app.listen(port, () => console.log(`✅ Server running at http://localhost:${port}`));
