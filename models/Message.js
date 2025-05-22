import mongoose from "mongoose";

const userMessageSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  deleted: { type: Boolean, default: false },
});
const UserMessage = mongoose.model("Message", userMessageSchema);
export default UserMessage