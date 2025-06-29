import multer from 'multer';
import cloudinary from '../config/cloudinary.js';

const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadImage = async (req, res) => {
  try {
    const file = req.file;
    const userId = req.user._id; // <-- You can use this if needed

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'image' },
      (error, result) => {
        if (error) {
          return res.status(500).json({ message: 'Cloudinary upload failed', error });
        }
        // You can save userId and result.secure_url to your DB if you want
        res.status(200).json({ url: result.secure_url });
      }
    );

    stream.end(file.buffer);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export { upload, uploadImage };
