import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    participants: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            nickname:{
                type: String
            }
        }
    ]
})

const Conversation = mongoose.model('Conversation', conversationSchema)

export default Conversation