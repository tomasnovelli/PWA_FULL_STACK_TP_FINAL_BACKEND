import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import ENVIROMENT from '../config/enviroment.config.js'
import UserRepositoriy from '../repositories/user.repository.js'
import ResponseBuilder from '../utils/responseBuilder/responseBuilder.js'
import { sendEmail } from '../utils/mail.util.js'

const registrationController = async (req, res) => {
    try{
        const {userName, email, password, profilePicture} = req.body
        const hashedPassword = await bcrypt.hash(password, 10)
        const verificationToken = jwt.sign(
            {email: email}, 
            ENVIROMENT.JWT_SECRET, 
            {expiresIn: '1d'}
        )
        const url_verification = `${ENVIROMENT.URL_BACK}${ENVIROMENT.PORT}/api/auth/verify/${verificationToken}`
        await sendEmail({
            to: email,
            subject: 'Email Verification',
            html: `
                <h1>Verify Your Email</h1>
                <p>Hello ${userName}! we are very happy that you have joined, before you start chatting we need to verify your account by clicking on the following link </p>
                <a href=${url_verification}>Click here to verify!</a>
            `
        })
        const newUserToRegister = 
            {
                userName,
                password: hashedPassword,
                email,
                profilePicture,
                verificationToken
            }
        
        await UserRepositoriy.saveUser(newUserToRegister)
        const response = new ResponseBuilder()
        .setOk(true)
        .setStatus(200)
        .setMessage('User Registered')
        .setPayload(
            {
                data: {
                    userName: newUserToRegister.userName,
                    email: newUserToRegister.email
                }
            }
        )
        .build()
        return res.status(200).json(response)
    }
    catch(error){
        console.error(error.message)
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
const verifyMailValidationTokenController = async (req, res) => {
    try{
        const {verification_token} = req.params
        if(!verification_token){
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Missing Token')
                .setPayload({
                    detail: 'There is no verification token on this request'
                })
                .build()
            return res.json(response)
        }
        const decoded = jwt.verify(verification_token, ENVIROMENT.JWT_SECRET)
        const user = await UserRepositoriy.getUserByEmail(decoded.email)
        if(!user){
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(404)
                .setMessage('User Not Found')
                .setPayload({
                    detail: 'The user isnt registred'
                })
                .build()
            return res.json(response)
        }
        if(user.emailVerified){
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('User already verified')
                .setPayload({
                    detail: 'User already verified'
                })
                .build()
            return res.json(response)
        }
        user.emailVerified = true
        await UserRepositoriy.saveUser(user)
        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(200)
            .setMessage('Email verified')
            .setPayload({
                detail: 'The Email has been verified'
            })
            .build()
        return res.status(200).json(response)
    }
    catch(error){
        console.error(error.message)
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
const loginController = async (req, res) => {
    try{
        const {userName, email, _id} = req.user
        const token = jwt.sign({email, _id}, ENVIROMENT.JWT_SECRET, {expiresIn: '1d'})
        const response = new ResponseBuilder()
        .setOk(true)
        .setStatus(200)
        .setMessage('User logged in')
        .setPayload({
            token,
            user: {
                id: _id,
                userName,
                email
            }
        })
        .build()
        return res.status(200).json(response)
    }
    catch(error){
        console.error(error.message)
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

export {
    registrationController, 
    verifyMailValidationTokenController,
    loginController
}