import mongoose from "mongoose";
import Message from "../models/messages.model.js";

class MessageRepository {
    static async createMessage(user_id, contact_id, content) {
        const newMessage = new Message({
            author: user_id,
            receiver: contact_id,
            content: content
        })
        await newMessage.save()
        return newMessage
    }
    static async findMessagesBetweenUsers(user_id, receiver_id) {
        const messages = await Message.find({
            $or: [
                { author: user_id, receiver: receiver_id },
                { author: receiver_id, receiver: user_id }
            ]
        })
        return messages
    }
}


export default MessageRepository