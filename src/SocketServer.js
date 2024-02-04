//not an actual server but you get the point. Maybe I should rename it SocketService instead
let onlineUsers = [];
export default function (socket, io) {
    //user joins or opens the conversation
    socket.on('join', (user) => {
        socket.join(user);
        if (!onlineUsers.some((u) => u.userId === user)) {
          onlineUsers.push({userId: user, socketId: socket.id});
        }
        io.emit('getOnlineUsers', onlineUsers);
    });

    //socket disconnect
    socket.on('disconnect', () => {
        onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
        io.emit('getOnlineUsers', onlineUsers);
    })

    //Joins a conversation room
    socket.on('join conversation', (conversation) => {
        socket.join(conversation);

    })

    //Send and receive message
    socket.on('send message', (message) => {
        let conversation = message.conversation;
        if (!conversation.users) return;
        conversation.users.forEach((user) => {
            if (user._id === message.sender._id) return;
            socket.in(user._id).emit('message received', message);
        })
    });

    socket.on('typing', (conversation) => {
        socket.in(conversation).emit('typing');
    })
    
    socket.on('stop typing', (conversation) => {
        socket.in(conversation).emit('stop typing');
    })
}