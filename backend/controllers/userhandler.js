import userModel from "../models/usermodel.js";
import bcrypt from "bcryptjs";  
import validator from "validator";
import jwt from "jsonwebtoken";

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) { 
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign(
            { id: user._id, firstname: user.firstname, lastname: user.lastname, age: user.age, contactnumber: user.contactnumber, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        const { password: pwd, ...userWithoutPassword } = user.toObject();
        res.status(200).json({ status: "success", message: "User logged in successfully", user: userWithoutPassword, token });
    }
    catch (error) {
        console.error(error);  
        res.status(500).json({ message: "Something went wrong" });
    }
}

const register = async (req, res) => {
    try {
        const { firstname, lastname, age, contactnumber, email, password } = req.body;
        console.log(req.body);
        console.log(firstname, lastname, age, contactnumber, email, password, "register");

        if (!firstname || !email || !password) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }

        const user = await userModel.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User with this email already exists", user });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid email" });
        }

        if (!validator.isMobilePhone(contactnumber, 'en-IN')) { // for India
            return res.status(400).json({ message: "Invalid contact number" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password should be at least 6 characters long" });
        }

        if (!email.endsWith('iiit.ac.in')) {
            return res.status(400).json({ message: "Email must belong to the domain iiit.ac.in" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({ firstname, lastname, contactnumber, age, email, password: hashedPassword });
        await newUser.save();

        const token = jwt.sign(
            { id: newUser._id, firstname: newUser.firstname, lastname: newUser.lastname, age: newUser.age, contactnumber: newUser.contactnumber, email: newUser.email },
            process.env.JWT_SECRET, // Use env variable here
            { expiresIn: '1h' }
        );
        
        res.status(201).json({ message: "User registered successfully", token });
    } catch (error) {
        console.error(error);  
        res.status(500).json({ message: "Something went wrong" });
    }
};

// PATCH /api/user/profile
const completeProfile = async (req, res) => {
    try {
        const { firstname, lastname, contactnumber, age } = req.body;
        const userId = req.user.id; // from JWT

        if (!firstname || !lastname || !contactnumber || !age) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }

        const user = await userModel.findByIdAndUpdate(
            userId,
            { firstname, lastname, contactnumber, age },
            { new: true }
        );

        res.status(200).json({ message: "Profile updated", user });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

const getUserByEmail = async (req, res) => {
    const { email } = req.params;
    console.log(email , "email");

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


export { login, register , getUserByEmail, completeProfile };
