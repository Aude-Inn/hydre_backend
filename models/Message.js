import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  userId: {
    type: String, // Expéditeur
    required: true,
    index: true,
  },
  toUserId: {
    type: String, 
    required: false, 
    index: true,
  },
  text: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 500,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Message = mongoose.model("Message", messageSchema);
export default Message;
