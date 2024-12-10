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
        return newUser.save()
    }
    static async setEmailVerify(user){
        user.emailVerified = true
        return user.save()
    }
    static async addNewContact(userToFind, contact_id, nickName, contactState){
        userToFind.contacts.push({userId: contact_id, nickName: nickName, active: contactState})
        return userToFind.save()
    }
    static async getUsersAddedToContactListById(userIds){
        const users = await User.find({_id: {$in: userIds}, emailVerified: true, active: true}).select('userName email profilePicture emailVerified')
        return users
    }
    static async updateUserProfile(user_id, userUpdatedData){
        const userToUpdate = await User.findOneAndUpdate({_id: user_id}, userUpdatedData, {new: true})
        return userToUpdate
    }
    static async deleteUserById(user_id){
        const userToDelete = await User.findByIdAndUpdate({_id: user_id}, {active: false, emailVerified: false}, {new: true})
        await User.updateMany(
            {},
            {$pull: {contacts: {userId: user_id}}}
        )
        return userToDelete
    }
    static updateContactStatus = async (deletedUserId) => {
            const result = await User.updateMany(
                {'contacts.userId': deletedUserId},
                {$set: {'contacts.$.active': false}},
                {arrayFilters: [{'element.userId': deletedUserId}]}
            )
            return result
    }

}

export default UserRepository