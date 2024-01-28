import express from 'express';
import trimRequest from 'trim-request';
import { searchUsers } from '../controllers/userController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').get(trimRequest.all, authMiddleware, searchUsers);


export default router;