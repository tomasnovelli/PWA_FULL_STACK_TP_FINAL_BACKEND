import User from "../models/user.model.js"
import ResponseBuilder from "../utils/responseBuilder/responseBuilder.js"

const validators = {
    validateRegister: async (req, res, next) => {
        try{ 
            const {userName, email, password, profilePicture} = req.body
            if(/* userName.trim() === '' && */  userName.length < 4 ){
                const Response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Username not valid')
                .setPayload({
                    detail: 'Username must be 4 - 20 characters, cant be empty, numbers & special characters arent allowed'
                })
                .build()
                return res.status(400).json(Response)
            }
            if(!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}/gm.test(password)){
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
            if(!profilePicture && !isNaN(profilePicture) && Buffer.byteLength(profilePicture, 'base64') > 2 * 1024 * 1024){
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
            if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email)){
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
    }
}

export default validators