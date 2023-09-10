import mongoose from 'mongoose';

const messagesCollection = "Messages";
const schema = new mongoose.Schema({
    user: String,
    message: String
});

const messageModel = mongoose.model(messagesCollection,schema);
export default messageModel;