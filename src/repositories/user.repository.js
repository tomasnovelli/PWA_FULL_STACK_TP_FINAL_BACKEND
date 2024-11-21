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

    static async setEmailVerify(value, user_id){
        const user = await UserRepositoriy.obtenerPorEmail(user_id)
        user.emailVerified = value
        return await UserRepositoriy.guardarUsuario(user)
    }
}

export default UserRepositoriy