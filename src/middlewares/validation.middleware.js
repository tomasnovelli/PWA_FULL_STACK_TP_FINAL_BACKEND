import User from "../models/user.model.js"
import userRepository from "../repositories/user.repository.js"
import ResponseBuilder from "../utils/responseBuilder/responseBuilder.js"
import { validateEmail, validatePassword, validateUserName } from "../utils/validation.js"
import bcrypt from 'bcrypt'

export const validateRegisterFormMiddleware = async (req, res, next) => {
    try {
        const { userName, email, password, profilePicture } = req.body

        if (!validateUserName(userName)) {
            const Response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Username not valid')
                .setPayload({
                    detail: 'Username must be 3 - 20 characters, cant be empty, numbers & special characters arent allowed'
                })
                .build()
            return res.status(400).json(Response)
        }
        if (!validatePassword(password)) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Password not valid')
                .setPayload({
                    detail: 'Password must be at least 8 characters and must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number'
                })
                .build()
            return res.status(400).json(response)
        }
        if (Buffer.byteLength(profilePicture, 'base64') > 2 * 1024 * 1024) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Image not valid')
                .setPayload({
                    detail: 'Image must be less than 2MB'
                })
                .build()
            return res.status(400).json(response)
        }
        if (!validateEmail(email)) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Email not valid')
                .setPayload({
                    detail: 'Email not valid'
                })
                .build()
            return res.status(400).json(response)
        }
        const existUser = await User.findOne({ email: email })
        if (existUser) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Bad Request')
                .setPayload({
                    detail: 'User already exist'
                })
                .build()
            return res.json(response)
        }
        return next()
    }
    catch (error) {
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
export const validateLoginFormMiddleware = async (req, res, next) => {
    try {
        const { email, password } = req.body
        if (!validateEmail(email)) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Email not valid')
                .setPayload({
                    detail: 'You have to write a valid email, ej: pepe@gmail.com'
                })
                .build()
            return res.status(400).json(response)
        }
        const user = await userRepository.getUserByEmail(email)
        if (!user) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(404)
                .setMessage('Not Found')
                .setPayload({
                    detail: 'User not found'
                })
                .build()
            return res.status(400).json(response)
        }
        if (!validatePassword(password)) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Password not valid')
                .setPayload({
                    detail: 'Wrong password, try again or if you forgot it, reset your password'
                })
                .build()
            return res.status(400).json(response)
        }
        if (!user.emailVerified) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(403)
                .setMessage('Forbidden access')
                .setPayload({
                    detail: 'the email is not verified, please do it to continue'
                })
                .build()
            return res.json(response)
        }
        const isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(401)
                .setMessage('Unauthorized')
                .setPayload({
                    detail: 'Incorrect password'
                })
                .build()
            return res.status(401).json(response)
        }
        req.user = user
        return next()
    }
    catch (error) {
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
export const validateForgotPasswordFormMiddleware = async (req, res, next) => {
    try {
        const { email } = req.body
        if (!validateEmail(email)) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Email not valid')
                .setPayload({
                    detail: 'You have to write a valid email, ej: pepe@gmail.com'
                })
                .build()
            return res.status(400).json(response)
        }
        const user = await userRepository.getUserByEmail(email)
        if (!user) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(404)
                .setMessage('Not Found')
                .setPayload({
                    detail: 'User not found'
                })
                .build()
            return res.status(400).json(response)
        }
        req.user = user
        return next()
    }
    catch (error) {
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
export const validateResetPasswordFormMiddleware = async (req, res, next) => {
    try {
        const { password } = req.body
        const { reset_token } = req.params
        if (!reset_token) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Missing Token')
                .setPayload({
                    detail: 'There is no reset token on this request'
                })
                .build()
            return res.json(response)
        }
        if (!validatePassword(password)) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Password not valid')
                .setPayload({
                    detail: 'Password must be at least 8 characters and must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number'
                })
                .build()
            return res.status(400).json(response)
        }
        return next()
    }
    catch (error) {
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
export const validateAddNewContactFormMiddleware = async (req, res, next) => {
    try {
        const { nickName, email } = req.body
        if (!validateUserName(nickName)) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Nickname not valid')
                .setPayload({
                    detail: 'Nickname must be 3 - 20 characters, cant be empty, numbers & special characters arent allowed'
                })
                .build()
            return res.status(400).json(response)
        }
        if (!validateEmail(email)) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Email not valid')
                .setPayload({
                    detail: 'You have to write a valid email, ej: pepe@gmail.com'
                })
                .build()
            return res.status(400).json(response)
        }
        req.contact = { nickName, email }
        return next()
    }
    catch (error) {
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

export const validateUpdateUserProfileMiddleware = async (req, res, next) => {
    try {
        const { user_id } = req.params
        const { userName, actualPassword, password, profilePicture } = req.body
        if (!user_id) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Missing User Id')
                .setPayload({
                    detail: 'There is no user id on this request'
                })
                .build()
            return res.status(400).json(response)
        }
        if (!validateUserName(userName)) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Username not valid')
                .setPayload({
                    detail: 'Username must be 3 - 20 characters, cant be empty, numbers & special characters arent allowed'
                })
                .build()
            return res.status(400).json(response)
        }
        if (Buffer.byteLength(profilePicture, 'base64') > 2 * 1024 * 1024) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Profile Picture not valid')
                .setPayload({
                    detail: 'Profile Picture must be less than 2MB'
                })
                .build()
            return res.status(400).json(response)
        }
        if (actualPassword.trim() === '' && password.trim() === '') {
            req.user = { userName, profilePicture, user_id }
            return next()
        }
        else if (!validatePassword(actualPassword)) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Actual Password not valid')
                .setPayload({
                    detail: 'Password must be at least 8 characters and must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number'
                })
                .build()
            return res.status(400).json(response)
        }
        else if (!validatePassword(password)) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Password not valid')
                .setPayload({
                    detail: 'Password must be at least 8 characters and must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number'
                })
                .build()
            return res.status(400).json(response)
        } else {
            const user = await userRepository.getUserById(user_id)
            const isValidPassword = await bcrypt.compare(actualPassword, user.password)
            if (!isValidPassword) {
                const response = new ResponseBuilder()
                    .setOk(false)
                    .setStatus(400)
                    .setMessage('Bad Request')
                    .setPayload({
                        detail: 'Password doesnt match with your actual password, try again'
                    })
                    .build()
                return res.status(400).json(response)
            }
            const hashedPassword = await bcrypt.hash(password, 10)
            req.user = { userName, hashedPassword, profilePicture, user_id }
            return next()
        }
    }
    catch (error) {
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


