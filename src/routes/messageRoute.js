import express from "express";
import trimRequest from "trim-request";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  sendMessage,
  getMessages,
  generateMessage,
} from "../controllers/messageController.js";

const router = express.Router();

router.route("/").post(trimRequest.all, authMiddleware, sendMessage);
router.route("/:convoId").get(trimRequest.all, authMiddleware, getMessages);
router
  .route("/generateMessage")
  .post(trimRequest.all, authMiddleware, generateMessage);

export default router;
