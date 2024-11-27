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
        const verificationUrl = `${ENVIROMENT.URL_FRONT}/email-verify/${verificationToken}`
        await sendEmail({
            to: email,
            subject: 'Email Verification',
            html: `
                <h1>Verify Your Email</h1>
                <p>Hello ${userName}! we are very happy that you have joined, before you start chatting we need to verify your account by clicking on the following link </p>
                <a href=${verificationUrl}>Click here to verify!</a>
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
        console.log(verification_token)
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
        await UserRepositoriy.setEmailVerify(user)
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
        const {userName, email, _id, profilePicture} = req.user
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
                email,
                profilePicture
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

const forgotPasswordController = async (req, res) => {
    try{
        const {email, userName} = req.user
        const reset_token = jwt.sign({email}, ENVIROMENT.JWT_SECRET, {expiresIn: '1h'})
        const resetUrl = `${ENVIROMENT.URL_FRONT}/reset-password/${reset_token}`
        await sendEmail({
            to: email,
            subject: 'Password Reset',
            html: `
                <div>
                    <h1>Password Reset</h1>
                    <p>Hello ${userName}! you have requested to reset your password, please click the link below to reset your password</p>
                    <a href=${resetUrl}>Click here to reset your password!</a>
                </div>    
            `
        })
        const response = new ResponseBuilder()
        .setOk(true)
        .setStatus(200)
        .setMessage('Email sent')
        .setPayload({
            detail: 'Email sent with instructions to reset the user password'
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

const resetPasswordController = async (req, res) => {

    const { password } = req.body
    const {reset_token} = req.params

    const decoded = jwt.verify(reset_token, ENVIROMENT.JWT_SECRET)
    if(!decoded){
        const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(400)
            .setMessage('Reset token not valid')
            .setPayload({
                detail: 'Reset token not valid'
            })
            .build()
        return res.status(400).json(response)
    }
    const {email} = decoded
    const user = await UserRepositoriy.getUserByEmail(email)
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
    const hashedPassword = await bcrypt.hash(password, 10)
    user.password = hashedPassword
    await UserRepositoriy.saveUser(user)
    const response = new ResponseBuilder()
        .setOk(true)
        .setStatus(200)
        .setMessage('Password reset')
        .setPayload({
            detail: 'The password has been reset succesfully'
        })
        .build()
    return res.status(200).json(response)

}

export {
    registrationController, 
    verifyMailValidationTokenController,
    loginController,
    forgotPasswordController,
    resetPasswordController
}