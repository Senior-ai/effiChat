import createHttpError from "http-errors";
import { ConversationModel, UserModel } from "../models/index.js";

export const doesConversationExist = async (senderId, receiverId) => {
  let convos = await ConversationModel.find({
    isGroup: false,
    $and: [
      { users: { $elemMatch: { $eq: senderId } } },
      { users: { $elemMatch: { $eq: receiverId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  if (!convos) throw createHttpError.BadRequest('Whoops! Something went wrong!');
  
  //populate message model - keep that in mind for future purposes
  convos = await UserModel.populate(convos, {
    path: 'latestMessage.sender',
    select: 'name email picture status'
  })

  return convos[0];
};

export const createConversation = async (data) => {
    const newConvo = await ConversationModel.create(data);
    if (!newConvo) throw createHttpError.BadRequest('Whoops! Something went wrong!');
    return newConvo;
}

export const populateConversation = async (id, fieldToPopulate, fieldToRemove) => {
    const populatedConvo = await ConversationModel.findOne({_id: id})
    .populate(fieldToPopulate, fieldToRemove); 
    if (!populatedConvo) 
        throw createHttpError.BadRequest('Oops.. population went wrong.. ')
    return populatedConvo;
}

export const getUserConversations = async(userId) => {
    let conversations;
    await ConversationModel.find({users: {$elemMatch: {$eq: userId} } })
    .populate('users', '-password')
    .populate('admin', '-password')
    .populate('latestMessage').sort({updatedAt:-1})
    .then(async (results) => {
        results = await UserModel.populate(results, {
            path: 'latestMessage.sender',
            select: 'name email picture status'
        });
        conversations = results;
    }).catch((err) => {
        throw createHttpError.BadRequest('Something went wrong with finding conversations')
    });
    return conversations
}