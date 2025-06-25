import express from 'express';
import { completeProfile, getUserByEmail } from '../controllers/userhandler.js';
import User from '../models/usermodel.js';
import jwt from 'jsonwebtoken';
import CAS from 'cas-authentication';
import auth from '../middleware/auth.js';
import fetch from 'node-fetch'; // If not installed, run: npm install node-fetch
import xml2js from 'xml2js'; // npm install xml2js

const userRouter = express.Router();

// ✅ CAS setup (only ONE route needed)
const cas = new CAS({
  cas_url: process.env.CAS_URL,
  service_url: process.env.SERVICE_URL, // Must be http://localhost:4000/api/user/cas-login
  cas_version: '3.0'
});

// PATCH: Complete user profile after CAS login
userRouter.put('/profile', auth, completeProfile);

// GET: Get user by email (optional)
userRouter.get('/get/:email', getUserByEmail);

// GET: Get logged-in user profile
userRouter.get('/profile', auth, async (req, res) => {
  console.log(req.user); // Debug: log the user object to backend console
  res.json(req.user);
});

// POST: CAS validation
userRouter.post('/cas-validate', async (req, res) => {
  const { ticket, service } = req.body;
  if (!ticket || !service) {
    return res.status(401).json({ success: false, message: "Missing ticket or service URL" });
  }

  try {
    // Use CAS 2.0 protocol for better info
    const casValidationUrl = `https://login.iiit.ac.in/cas/serviceValidate?ticket=${ticket}&service=${service}`;
    const response = await fetch(casValidationUrl);
    const casData = await response.text();

    // Parse XML response
    xml2js.parseString(casData, async (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, message: "CAS XML parse error" });
      }
      const success = result['cas:serviceResponse'] && result['cas:serviceResponse']['cas:authenticationSuccess'];
      if (success) {
        const username = result['cas:serviceResponse']['cas:authenticationSuccess'][0]['cas:user'][0];
        // If your CAS server provides email as an attribute, extract it here
        // Otherwise, use username as email
        let email = username;
        // Optionally: check for attributes
        const attrs = result['cas:serviceResponse']['cas:authenticationSuccess'][0]['cas:attributes'];
        if (attrs && attrs[0] && attrs[0]['cas:email']) {
          email = attrs[0]['cas:email'][0];
        }

        let user = await User.findOneAndUpdate(
          { email },
          { $setOnInsert: { email } },
          { new: true, upsert: true }
        );
        let isNewUser = !user.firstname && !user.lastname && !user.contactnumber;

        const token = jwt.sign(
          { id: user._id, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
        );
        res.json({ success: true, token, user: { email: user.email }, isNewUser });
      } else {
        res.status(401).json({ success: false, message: "Invalid CAS ticket" });
      }
    });
  } catch (error) {
    console.error("CAS validation error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// POST: Register user details
userRouter.post('/register-details', async (req, res) => {
  const { email, firstname, lastname, contactnumber } = req.body;
  if (!email || !firstname || !lastname || !contactnumber) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const user = await User.findOneAndUpdate(
      { email },
      { firstname, lastname, contactnumber },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET: Get user by email
userRouter.get('/email/:email', async (req, res) => {
  const { email } = req.params;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default userRouter;
