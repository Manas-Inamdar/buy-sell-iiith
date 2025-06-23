import express from 'express';
import { upload, uploadImage } from '../controllers/uploadhandler.js';

const router = express.Router();

router.post('/image', upload.single('image'), uploadImage);

export default router;