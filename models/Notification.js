import mongoose from 'mongoose';

// Notf Schema
const notificationSchema = new mongoose.Schema({
  name: { type: String, required: true },        
  timestamp: { type: Date, default: Date.now },    
});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;