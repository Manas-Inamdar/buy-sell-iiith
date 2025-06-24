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
app.post('/generate-text', async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const { prompt } = req.body;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ generatedText: text });
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
