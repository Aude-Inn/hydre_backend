import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  text: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 500
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const Message = mongoose.model("Message", messageSchema);
export default Message;