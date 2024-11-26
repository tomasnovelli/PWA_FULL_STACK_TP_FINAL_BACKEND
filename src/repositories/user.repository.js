import User from "../models/user.model.js"
import mongoose from "mongoose"
class UserRepositoriy {
    static async getUserById(id){
        const existUser = await User.findOne({_id: id})
        return existUser
    }
    static async getUserByEmail(email){
        const existUser = await User.findOne({email})
        return existUser
    }
    static async saveUser (user){
        const newUser = new User(user)
        return await newUser.save()
    }
    static async setEmailVerify(user){
        user.emailVerified = true
        return await user.save()
    }
    static async addNewContact(userToFind, contact_id, nickName){
        userToFind.contacts.push({userId: contact_id, nickName: nickName})
        return await userToFind.save()
    }
    static async getUsersAddedToContactListById(userIds){
        const users = await User.find({_id: {$in: userIds}, emailVerified: true}).select('userName email profilePicture emailVerified')
        return users
    }
}

export default UserRepositoriy