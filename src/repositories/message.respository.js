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
            ],
            deletedBy: { $ne: user_id }
        })
        return messages
    }
    static async deleteConversationForUser(user_id, receiver_id){
        const result = await Message.updateMany(
            {
                $or: [
                    { author: user_id, receiver: receiver_id },
                    { author: receiver_id, receiver: user_id }
                ]
            },
            {$addToSet: {deletedBy: user_id}}
        )
        return result
    }
    static async deleteConversationRecord(user_id, receiver_id){
        const result = await Message.deleteMany(
            {
                $or: [
                    { author: user_id, receiver: receiver_id },
                    { author: receiver_id, receiver: user_id }
                ]
            }
        )
        return result
    }
    static async getLastMessage(user_id, contact_id) {
        const lastMessage = await Message.findOne({
            $or: [
                { author: user_id, receiver: contact_id },
                { author: contact_id, receiver: user_id }
            ],
            deletedBy: { $ne: user_id }
        })
        .sort({ created_at: -1 })
        .limit(1)
        return lastMessage
    }
}


export default MessageRepository