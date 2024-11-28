import User from "../models/user.model.js"
import mongoose from "mongoose"
class UserRepository {
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
    static async updateUserProfile(user_id, userUpdatedData){
        const userToUpdate = await User.findOneAndUpdate({_id: user_id}, userUpdatedData, {new: true})
        return userToUpdate
    }
    static async deleteUserById(user_id){
        const userToDelete = await User.findByIdAndDelete({_id: user_id})
        return userToDelete
    }
}

export default UserRepository