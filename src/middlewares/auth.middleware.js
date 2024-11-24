import ENVIROMENT from "../config/enviroment.config.js"
import ResponseBuilder from "../utils/responseBuilder/responseBuilder.js"
import jwt from 'jsonwebtoken'

export const verifyTokenMiddleware = (roles_permitidos = []) => {
    return (req, res, next) =>{
        try{
            const auth_header = req.headers['authorization']
            if(!auth_header){
                const response = new ResponseBuilder()
                .setOk(false)
                .setMessage('Unauthorized')
                .setStatus(401)
                .setPayload({
                    detail: 'You are unauthorized to access this resource, you must provide a valid verification token on this request'
                })
                .build()
                return res.status(401).json(response)
            }
            const access_token = auth_header.split(' ')[1]
            if(!access_token){
                const response = new ResponseBuilder()
                .setOk(false)
                .setMessage('Unauthorized')
                .setStatus(401)
                .setPayload({
                    detail: 'You are unauthorized to access this resource, you must provide a valid verification token on this request'
                })
                .build()
                return res.status(401).json(response)
            }
            const decoded = jwt.verify(access_token, ENVIROMENT.JWT_SECRET)
            req.user = decoded
            if(roles_permitidos.length && !roles_permitidos.includes(req.user.role)){
                const response = new ResponseBuilder()
                .setOk(false)
                .setMessage('Restricted Access')
                .setStatus(403)
                .setPayload({
                    detail: 'You are not authorized to access this resource'
                })
                .build()
                return res.status(403).json(response)
            }
            return next()
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
}

export const verifiApiKeyMiddleware = (req, res, next) => {
    try{
        const apiKeyHeader = req.headers['x-api-key']
    if(!apiKeyHeader){
        const response = new ResponseBuilder()
        .setOk(false)
        .setMessage('Unauthorized')
        .setStatus(401)
        .setPayload({
            detail: 'You are unauthorized to access this resource, you must provide a valid api-key on this request'
        })
        .build()
        return res.status(401).json(response)
    }
    if(apiKeyHeader !== ENVIROMENT.API_KEY_INTERN){
        const response = new ResponseBuilder()
        .setOk(false)
        .setMessage('Unauthorized')
        .setStatus(401)
        .setPayload({
            detail: 'You are unauthorized to access this resource, you must provide a valid api-key on this request'
        })
        .build()
        return res.status(401).json(response)
    }
    next()
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