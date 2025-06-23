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
import CAS from 'cas-authentication';
import paymentRouter from './routes/paymentrouter.js';
import session from 'express-session';

//App Config
const app = express();
const port = process.env.PORT || 4000;

// CAS configuration (replace with your IIIT CAS server URL)
const cas = new CAS({
  cas_url: process.env.CAS_URL,
  service_url: process.env.SERVICE_URL,
  cas_version: '3.0'
});

// Use environment variables for API keys
const API_KEY = process.env.GOOGLE_GENAI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

//Middlewares
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
connectDb();

app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // set to true if using HTTPS
}));

app.use(cas.bounce);

//API Endpoints
app.get('/', (req, res) => res.status(404).send('Hello World'));
app.use('/api/user', userRoutes);
app.use('/api/product', productRouter);
app.use('/api/cart', router);
app.use('/api/order', orderRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/payment', paymentRouter);

app.post('/generate-text', async (req, res) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const { prompt } = req.body;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ generatedText: text });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/verify-recaptcha', async (req, res) => {
    const { captchaToken } = req.body;

    if (!captchaToken) {
        return res.status(400).json({ success: false, message: 'Captcha token is missing' });
    }

    try {
        const url = `https://www.google.com/recaptcha/api/siteverify`;
        const response = await axios.post(url, null, {
            params: {
                secret: RECAPTCHA_SECRET_KEY,
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

// Example: Protect a route with CAS
app.get('/cas-protected', cas.bounce, (req, res) => {
  // After successful CAS login, user info is in req.session[cas.session_name]
  res.json({
    message: 'You are authenticated via CAS!',
    user: req.session[cas.session_name]
  });
});

app.listen(port, () => console.log(`Listening on localhost: ${port}`));



