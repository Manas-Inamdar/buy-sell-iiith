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
// Optionally, for fuzzy search: import Fuse from 'fuse.js'; (npm i fuse.js)

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
    let { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.json({ generatedText: "Please enter a valid search or question." });
    }
    prompt = prompt.trim();

    // List of common greetings/stopwords to ignore as product searches
    const stopwords = [
      "hi", "hello", "hey", "ok", "okay", "thanks", "thank you", "yo", "sup", "good morning", "good evening", "good night", "bye"
    ];
    const promptLower = prompt.toLowerCase();

    // Only treat as product search if it's not a stopword/greeting and not a question
    const isProductSearch = (
      prompt.length > 1 &&
      prompt.length < 50 &&
      !/[?]/.test(prompt) &&
      prompt.split(' ').length <= 5 &&
      !stopwords.includes(promptLower)
    );

    if (isProductSearch) {
      // Sanitize for regex
      const searchTerm = escapeStringRegexp(promptLower);

      // Match only at the start of words (case-insensitive)
      const regex = new RegExp(`\\b${searchTerm}`, 'i');

      // Search products by name or description
      const products = await productModel.find({
        $or: [
          { name: { $regex: regex } },
          { description: { $regex: regex } }
        ]
      }).limit(5);

      if (products.length > 0) {
        const productList = products.map(
          p => `• ${p.name} (Rs. ${p.price})`
        ).join('<br/>');
        return res.json({
          generatedText: `Here are some products matching "<b>${prompt}</b>":<br/>${productList}`
        });
      } else {
        // If no product found, respond rationally and redirect to buy/sell chat
        return res.json({
          generatedText: `Sorry, no products matching "<b>${prompt}</b>" were found.<br/><br/>If you need help with buying or selling, feel free to ask me about how to post a product, search for items, or manage your orders!`
        });
      }
    }

    // Otherwise, use Gemini as usual
    const instruction = "You are an assistant for an IIIT community buy & sell platform. Only answer questions related to buying, selling, products, orders, and platform usage. If asked anything else, politely refuse and redirect to platform topics.";
    const fullPrompt = instruction + "\nUser: " + prompt;

    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    res.json({ generatedText: text || "Sorry, I couldn't generate a response." });
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
