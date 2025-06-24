import express from 'express';
import { completeProfile, getUserByEmail } from '../controllers/userhandler.js';
import User from '../models/usermodel.js';
import jwt from 'jsonwebtoken';
import CAS from 'cas-authentication';
import auth from '../middleware/auth.js';
import fetch from 'node-fetch'; // If not installed, run: npm install node-fetch

const userRouter = express.Router();

// ✅ CAS setup (only ONE route needed)
const cas = new CAS({
  cas_url: process.env.CAS_URL,
  service_url: process.env.SERVICE_URL, // Must be http://localhost:4000/api/user/cas-login
  cas_version: '3.0'
});

// PATCH: Complete user profile after CAS login
userRouter.patch('/profile', auth, completeProfile);

// GET: Get user by email (optional)
userRouter.get('/get/:email', getUserByEmail);

// GET: Get logged-in user profile
userRouter.get('/profile', auth, async (req, res) => {
  res.json(req.user);
});

// POST: CAS validation
userRouter.post('/cas-validate', async (req, res) => {
  const { ticket, service } = req.body;
  if (!ticket || !service) {
    return res.status(401).json({ success: false, message: "Missing ticket or service URL" });
  }

  try {
    const casValidationUrl = `https://login.iiit.ac.in/cas/validate?ticket=${ticket}&service=${service}`;
    const response = await fetch(casValidationUrl);
    const casData = await response.text();

    if (casData.startsWith("yes")) {
      const [, username] = casData.split("\n");
      let user = await User.findOne({ email: username });
      let isNewUser = false;
      if (!user) {
        user = await User.create({ email: username });
        isNewUser = true;
      }

      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      res.json({ success: true, token, user: { email: user.email }, isNewUser });
    } else {
      res.status(401).json({ success: false, message: "Invalid CAS ticket" });
    }
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
