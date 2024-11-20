import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profilePicture:{
        type: String
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String,
        required: true
    },
    registeredAt: {
        type: Date,
        default: Date.now
    },
    contacts: [
        {
            userId:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            nickname: {
                type: String,
            }
        }
    ]
})

const User = mongoose.model('User', userSchema)

export default User