import User from "../models/user.model.js"
import UserRepositoriy from "../repositories/user.repository.js"
import ResponseBuilder from "../utils/responseBuilder/responseBuilder.js"
import { validateEmail, validateImage, validatePassword, validateUserName } from "../utils/validation.js"
import bcrypt from 'bcrypt'

const validators = {
    validateRegister: async (req, res, next) => {
        try{ 
            const {userName, email, password, profilePicture} = req.body
            
            if(!validateUserName(userName)){
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
            if(!validatePassword(password)){
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
            if(!validateImage(profilePicture)){
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
            if(!validateEmail(email)){
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
            if(existUser) {
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
    },
    validateLogin: async (req, res, next) => {
        try{
            const {email, password} = req.body
            if(!validateEmail(email)){
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
            if(!validatePassword(password)){
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
            const user = await UserRepositoriy.getUserByEmail(email)
            if(!user){
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
            if(!user.emailVerified){
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
            if(!isValidPassword){
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
}

export default validators