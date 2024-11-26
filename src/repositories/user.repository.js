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
    static async getUserContactList(user_id){
        const user = await User.findById({_id: user_id})
       /*  const userContactList = await user.contacts.find({emailVerified: true}) */    
    }
    static async addNewContact(userToFind, contact_id, nickName){
        userToFind.contacts.push({userId: contact_id, nickName: nickName})
        return await userToFind.save()
    }
}

export default UserRepositoriy