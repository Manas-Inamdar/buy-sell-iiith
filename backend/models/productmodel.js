import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type:String,
        required:true
    },
    subCategory: {
        type: String,
        required: true
    },
    sizes: {
        type: Array,
        // required: true
    },
    quantity: {
        type: Number,
        // required: true
    },
    seller_email: {
        type: String,
        required: true
    },
    buyer_email: {
        type: String,
        // required: true
    }
    // rating and reviewsCount removed
}, { minimize: false });

const productModel = mongoose.models.Product || mongoose.model('Product', productSchema);

export default productModel;