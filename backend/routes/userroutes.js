import express from 'express';
import { login, register, getUserByEmail } from '../controllers/userhandler.js';
import User from '../models/usermodel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; // <-- Add this import
import CAS from 'cas-authentication';
import auth from '../middleware/auth.js';

const userRouter = express.Router();
const cas = new CAS({
  cas_url: process.env.CAS_URL,
  service_url: process.env.SERVICE_URL,
  cas_version: '3.0'
});

userRouter.post('/login', login);
userRouter.post('/register', register);

userRouter.get('/email/:email', getUserByEmail);

// UPDATED CAS LOGIN ROUTE
userRouter.get('/cas-login', cas.bounce, async (req, res) => {
    const casUser = req.session && req.session['cas_user'];
    if (casUser) {
        const email = casUser;
        let user = await User.findOne({ email });
        const frontendUrl = 'http://localhost:5173';
        if (!user) {
            // Redirect to registration page with email as query param
            return res.redirect(`${frontendUrl}/register?email=${encodeURIComponent(email)}`);
        }
        // User exists, proceed as before
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '10m' }
        );
        return res.redirect(`${frontendUrl}/login?token=${token}`);
    } else {
        res.status(401).json({ message: 'CAS authentication failed' });
    }
});

userRouter.get('/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId); 
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

userRouter.put('/:userId', async (req, res) => {
    const { userId } = req.params;
    const { firstName, lastName, email, contactNumber, password, confirmPassword, age } = req.body;
    console.log(req.body);
    if (password && password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    try {
        const user = await User.findById(userId); 
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.firstname = firstName || user.firstname;
        user.lastname = lastName || user.lastname;
        user.email = email || user.email;
        user.contactnumber = contactNumber || user.contactnumber;
        user.age = age || user.age;

        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        const updatedUser = await user.save(); 
        res.status(201).json(updatedUser); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

userRouter.post('/register-details', async (req, res) => {
    const { email, firstname, lastname, contactnumber } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
        user = new User({ email, firstname, lastname, contactnumber });
    } else {
        // Update the existing user with new details
        user.firstname = firstname;
        user.lastname = lastname;
        user.contactnumber = contactnumber;
    }
    await user.save();
    return res.json({ success: true, user });
});

userRouter.get('/profile', auth, async (req, res) => {
    res.json(req.user);
});


export default userRouter;

