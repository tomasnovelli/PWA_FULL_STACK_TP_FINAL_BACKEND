import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        content: {
            type: String,
            required: true
        },
        created_at: {
            type: Date,
            default: Date.now()
        },
        deletedBy: {
            type: [mongoose.Schema.Types.ObjectId],
            default: []
        }
    }
)

const Message = mongoose.model('Message', messageSchema)

export default Message