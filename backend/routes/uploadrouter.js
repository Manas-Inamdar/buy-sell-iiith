import express from 'express';
import { upload, uploadImage } from '../controllers/uploadhandler.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/image', auth, upload.single('image'), uploadImage);

export default router;