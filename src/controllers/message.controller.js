import MessageRepository from "../repositories/message.respository.js"
import ResponseBuilder from "../utils/responseBuilder/responseBuilder.js"


const createMessageController = async (req, res) => {
    try{
        const user_id = req.user._id
        const {contact_id, content} = req.content
        
        const new_message = await MessageRepository.createMessage(user_id, contact_id, content)
        const conversation = await MessageRepository.findMessagesBetweenUsers(user_id, contact_id)

        if(!user_id){
            const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(404)
            .setMessage('Not Found')
            .setPayload({
                detail: 'User not found'
            })
            .build()
            return res.status(404).json(response)
        }
        if(!conversation){
            const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(404)
            .setMessage('Not Found')
            .setPayload({
                detail: 'Conversation not found'
            })
            .build()
            return res.status(404).json(response)
        }
        if(!new_message){
            const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(500)
            .setMessage('Internal Server Error')
            .setPayload({
                detail: 'Error sending message'
            })
            .build()
            return res.status(500).json(response)
        }

        const response = new ResponseBuilder()
        .setOk(true)
        .setStatus(200)
        .setMessage('Message Sended')
        .setPayload({
            message: new_message,
            conversation: conversation
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
        res.status(500).json(response)
    }
}
const getConversationController = async (req, res) => {
    try{
        const user_id = req.user._id
        const {contact_id} = req.params
        const conversation = await MessageRepository.findMessagesBetweenUsers(user_id, contact_id)
        if(!conversation){
            const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(404)
            .setMessage('Not Found')
            .setPayload({
                detail: 'Conversation not found'
            })
            .build()
            return res.status(404).json(response)
        }
        const response = new ResponseBuilder()
        .setOk(true)
        .setStatus(200)
        .setMessage('Conversation Found')
        .setPayload({
            conversation: conversation
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
        res.status(500).json(response)
    }
}
const deleteConversationController = async (req, res) => {

    const {user_id, contact_id} = req.params

    const conversationDeleted = await MessageRepository.deleteConversationForUser(user_id, contact_id)
    if(!conversationDeleted){
        const response = new ResponseBuilder()
        .setOk(false)
        .setStatus(404)
        .setMessage('Not Found')
        .setPayload({
            detail: 'Conversation not found'
        })
        .build()
        return res.status(404).json(response)
    }
    
    const conversation = await MessageRepository.findMessagesBetweenUsers(user_id, contact_id)
    if(!conversation){
        const response = new ResponseBuilder()
        .setOk(false)
        .setStatus(404)
        .setMessage('Not Found')
        .setPayload({
            detail: 'Conversation not found'
        })
        .build()
        return res.status(404).json(response)
    }

    const response = new ResponseBuilder()
    .setOk(true)
    .setStatus(200)
    .setMessage('Conversation Deleted')
    .setPayload({
        detail: conversation
    })
    .build()
    return res.status(200).json(response)
}

export {createMessageController, getConversationController, deleteConversationController}