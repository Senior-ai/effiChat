import createHttpError from "http-errors";
import { MessageModel } from "../models/index.js";

const AI_API = process.env.AI_API || "";

export const createMessage = async (data) => {
  let newMessage = await MessageModel.create(data);
  if (!newMessage)
    throw createHttpError.BadRequest("Oops.. something went wrong!");
  return newMessage;
};

export const generateAIResponse = async (message) => {
  //TODO - Check how to implement it correctly
  let newRequest = message.trim("/generate");
  const newMessage = "";
  AI_API !== "" ? (newMessage = await fetch(AI_API, newRequest)) : "";
};

export const populateMessage = async (msgId) => {
  let msg = await MessageModel.findById(msgId)
    .populate({
      path: "sender",
      select: "name picture",
      model: "UserModel",
    })
    .populate({
      path: "conversation",
      select: "name picture isGroup users",
      model: "ConversationModel",
      populate: {
        path: "users",
        select: "name email picture status",
        model: "UserModel",
      },
    });
  if (!msg) throw createHttpError.BadRequest("Oops something went wrong!");
  return msg;
};

export const getConvoMessages = async (convoId) => {
  const messages = await MessageModel.find({ conversation: convoId })
    .populate("sender", "name picture email status")
    .populate("conversation");
  if (!messages) {
    throw createHttpError.BadRequest("Ooops! something went wrong!");
  }
  return messages;
};
