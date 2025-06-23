import mongoose from 'mongoose';

const dbURI = process.env.MONGODB_URI; // Use environment variable

const connectDb = async () => {
    mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log('Connected to MongoDB!'))
        .catch(err => console.log('Error connecting to MongoDB:', err));
}
export default connectDb;
