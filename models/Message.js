import mongoose from "mongoose";

const userMessageSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  text: { type: String, required: true },
  replyTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', default: null },
  resolved: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now }
});
const UserMessage = mongoose.model("Message", userMessageSchema);
export default UserMessage;
