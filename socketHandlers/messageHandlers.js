import Message from "../models/Message.js";



const messageHandlers = (io, socket) => {
  socket.on('getMessages', async () => {
    try {
      const messages = await Message.find().sort({ timestamp: -1 });
      socket.emit('messages', messages);
    } catch (error) {
      console.error('Erreur récupération messages :', error);
      socket.emit('error', 'Impossible de récupérer les messages');
    }
  });
};

export default messageHandlers;