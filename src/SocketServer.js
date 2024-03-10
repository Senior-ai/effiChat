import logger from "./configs/logger.js";
//not an actual server but you get the point. Maybe I should rename it SocketService instead
let onlineUsers = [];
export default function (socket, io) {
  //user joins or opens the conversation
  socket.on("join", (user) => {
    logger.info("User joined", user);
    socket.join(user);
    if (!onlineUsers.some((u) => u.userId === user)) {
      onlineUsers.push({ userId: user, socketId: socket.id });
    }
    io.emit("getOnlineUsers", onlineUsers);
    // Send socket id
    io.emit("setupSocket", socket.id);
  });

  //socket disconnect
  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    io.emit("getOnlineUsers", onlineUsers);
  });

  //Joins a conversation room
  socket.on("join conversation", (conversation) => {
    socket.join(conversation);
  });

  //Send and receive message
  socket.on("send message", (message) => {
    let conversation = message?.conversation;
    console.log(message);
    if (!conversation.users) return;
    conversation.users.forEach((user) => {
      if (user._id === message.sender._id) return;
      socket.in(user._id).emit("message received", message);
    });
  });

  socket.on("typing", (conversation) => {
    socket.in(conversation).emit("typing", conversation);
  });

  socket.on("stop typing", (conversation) => {
    socket.in(conversation).emit("stop typing", conversation);
  });

  //Call
  socket.on("callUser", (data) => {
    let userId = data.userToCall;
    let userSocketId = onlineUsers.find((user) => user.userId === userId);
    io.to(userSocketId?.socketId).emit("callUser", {
      signal: data.signal,
      from: data.from,
      name: data.name,
      picture: data.picture,
    });
  });

  //Answer call
  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });
}
