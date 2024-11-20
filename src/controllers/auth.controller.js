import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import ENVIROMENT from '../config/enviroment.config.js'
import User from '../models/user.model.js'
import UserRepositoriy from '../repositories/user.repository.js'
import ResponseBuilder from '../utils/responseBuilder/responseBuilder.js'

const registrationController = async (req, res) =>{
    try{
        const {userName, email, password, image} = req.body
        const hashedPassword = await bcrypt.hash(password, 10)
        const verificationToken = jwt.sign(
            {email: email}, 
            ENVIROMENT.JWT_SECRET, 
            {expiresIn: '1d'}
        )
        const newUserToRegister = new User(
            {
                userName,
                password: hashedPassword,
                email,
                image,
                verificationToken
            }
        )
        UserRepositoriy.saveUser(newUserToRegister)
        const response = new ResponseBuilder()
        .setOk(true)
        .setStatus(200)
        .setMessage('User Registered')
        .setPayload(
            {
                data: {
                    userName: newUserToRegister.userName,
                    email: newUserToRegister.email,
                    image: newUserToRegister.image
                }
            }
        )
        .build()
        return res.status(200).json(response)
    }
    catch(error){
        const response = new ResponseBuilder()
        .setOk(false)
        .setStatus(500)
        .setMessage('Internal Server Error')
        .setPayload({
            detail: error.message
        })
        .build()
        return res.status(500).json(response)
    }
}

export {registrationController}