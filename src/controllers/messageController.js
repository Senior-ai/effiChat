import logger from "../configs/logger.js";
import {populateMessage, createMessage, getConvoMessages} from './../services/message.service.js';
import {updateLatestMessage} from './../services/conversation.service.js'
export const sendMessage = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const {message, convoId, files} = req.body;
        if (!convoId || (!files && !message)) {
            logger.error('Please provide a conversationId and msg body');
            return res.sendStatus(400);
        }
        const msgData = {
            sender: userId,
            message,
            conversation: convoId,
            files: files || [] 
        };
        let newMessage = await createMessage(msgData);
        let populatedMessage = await populateMessage(newMessage._id);
        await updateLatestMessage(convoId, newMessage);
        res.json(populatedMessage);
    } catch (err) {
        next(err);
    }
}

export const getMessages = async (req, res, next) => {
    try {
        const convoId = req.params.convoId;
        if (!convoId) {
            logger.error('Please add a conversation id in params');
            res.sendStatus(400);
        }
        const messages = await getConvoMessages(convoId);
        res.json(messages);
    } catch (err) {
        next(err);
    }
 }