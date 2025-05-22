const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  userId: String,
  text: String,
  timestamp: Date,
});

const Message = mongoose.model('Message', messageSchema);

export default Message;
