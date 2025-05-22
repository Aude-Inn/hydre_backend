import mongoose from "mongoose";

const adminReplySchema = new mongoose.Schema({
  toUserId: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  deleted: { type: Boolean, default: false },
});
const AdminReply = mongoose.model("Messrep", adminReplySchema);