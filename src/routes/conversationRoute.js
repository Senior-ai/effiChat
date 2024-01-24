import express from 'express'
import trimRequest from 'trim-request'
import authMiddleware from '../middlewares/authMiddleware.js'
import {createOpenConversation, getConversations} from '../controllers/conversationController.js'
const router = express.Router();

router.route('/').post(trimRequest.all,authMiddleware, createOpenConversation)
router.route('/').get(trimRequest.all,authMiddleware, getConversations)
export default router