import express from 'express';
import authRoutes from './authRoute.js'
import conversationRoutes from './conversationRoute.js'

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/conversation', conversationRoutes);
export default router;