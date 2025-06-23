import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    firstname: {
        type: String,
    },
    lastname: {
        type: String,
    },
    cartdata: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: { type: Number, default: 1 },
            // add other fields if needed
        }
    ],
}, { minimize: false });

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;