import express from 'express';
import authRoutes from './authRoute.js'
import conversationRoutes from './conversationRoute.js'
import messageRoutes from './messageRoute.js' 
import userRoutes from './userRoute.js'
const router = express.Router();

router.use('/auth', authRoutes);
router.use('/conversation', conversationRoutes);
router.use('/message', messageRoutes);
router.use('/user', userRoutes)
export default router;