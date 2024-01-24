import createHttpError from "http-errors";
import { MessageModel } from "../models/index.js"

export const createMessage = async (data) => {
    let newMessage = await MessageModel.create(data);
    if (!newMessage) 
        throw createHttpError.BadRequest('Oops.. something went wrong!');
    return newMessage;
}

export const populateMessage = async (msgId) => {
    let msg = await MessageModel.findById(msgId).populate({
        path: 'sender',
        select: 'name picture',
        model: 'UserModel'
    }).populate({
        path: 'conversation',
        select: 'name isGroup users',
        model: 'ConversationModel',
        populate: {
            path: 'users',
            select: 'name email picture status',
            model: 'UserModel'
        }
    });
    if (!msg) throw createHttpError.BadRequest('Oops something went wrong!');
    return msg;
}

export const getConvoMessages = async (convoId) => {
    const messages = await MessageModel.find({conversation: convoId})
    .populate('sender', 'name picture email status')
    .populate('conversation');
    if (!messages) {
        throw createHttpError.BadRequest('Ooops! something went wrong!');
    }
    return messages;
}