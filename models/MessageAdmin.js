import mongoose from "mongoose";

const adminReplySchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: { type: String, required: true },
  replyTo: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    required: true
  },
  timestamp: { type: Date, default: Date.now }
});
const AdminReply = mongoose.model("Messrep", adminReplySchema);
export default AdminReply;
