import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  buyer: {
    type: String,
    required: true, 
  },
  seller: {
    type: String,
    required: true,
  },
  items:{
    type: Array,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed'],
    default: 'Pending',
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const Order = mongoose.models.order || mongoose.model('order', orderSchema);

export default Order;