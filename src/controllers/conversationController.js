import createHttpError from "http-errors";
import logger from "../configs/logger.js";
import {
  doesConversationExist,
  createConversation,
  populateConversation,
  getUserConversations,
} from "../services/conversation.service.js";
import { findUser } from "../services/user.service.js";

export const createOpenConversation = async (req, res, next) => {
  try {
    const senderId = req.user.userId;
    const { receiverId } = req.body;
    if (!receiverId) {
      logger.error("Please provide the user Id you want to connect with");
      throw createHttpError.BadGateway("Whoops! Something went wrong!");
    }

    const existedConvo = await doesConversationExist(senderId, receiverId);
    if (existedConvo) {
      res.json(existedConvo);
    } else {
      let receiverUser = await findUser(receiverId);
      let convoData = {
        name: receiverUser.name,
        picture: receiverUser.picture,
        isGroup: false,
        users: [senderId, receiverId],
      };
      const newConvo = await createConversation(convoData);
      const populatedConvo = await populateConversation(
        newConvo._id,
        "users",
        "-password"
      );
      res.status(200).json(populatedConvo);
    }
  } catch (err) {
    next(err);
  }
};

export const getConversations = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const conversations = await getUserConversations(userId);
    res.status(200).json(conversations);
  } catch (err) {
    next(err);
  }
};
