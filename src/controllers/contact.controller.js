import ContactReposiroty from "../repositories/contact.repository.js"
import MessageRepository from "../repositories/message.respository.js"
import UserRepository from "../repositories/user.repository.js"
import ResponseBuilder from "../utils/responseBuilder/responseBuilder.js"

const getContactChatController = async (req, res) => {
    try {
        const { contact_id } = req.params
        const { _id } = req.user
        const user = await UserRepository.getUserById(_id)
        const userContacts = user.contacts
        const contactSaved = userContacts.find(contact => contact.userId.toString() === contact_id)
        const contactSearchedById = await UserRepository.getUserById(contact_id)
        if (!contactSearchedById) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(404)
                .setMessage('Not Found')
                .setPayload({
                    detail: 'Contact not found'
                })
                .build()
            return res.status(404).json(response)
        }
        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(200)
            .setMessage('Contact found')
            .setPayload({
                contact: {
                    contactId: contactSearchedById._id.toString(),
                    nickName: contactSaved.nickName,
                    userName: contactSearchedById.userName,
                    email: contactSearchedById.email,
                    profilePicture: contactSearchedById.profilePicture
                }
            })
            .build()
        return res.status(200).json(response)
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
const deleteContactController = (req, res) => {
    try {
        const { contact_id } = req.params
        const { _id } = req.user
        if (!contact_id || !_id) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Missing Reciever Id')
                .setPayload({
                    detail: 'Missing Reciever Id'
                })
                .build()
            return res.status(400).json(response)
        }
        const contactListupdated = ContactReposiroty.deleteContactFromContactListById(_id, contact_id)
        if (!contactListupdated) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(404)
                .setMessage('Not Found')
                .setPayload({
                    detail: 'Contact not found'
                })
                .build()
            return res.status(404).json(response)
        }
        const deleteConversationRecord = MessageRepository.deleteConversationRecord(_id, contact_id)
        if (!deleteConversationRecord) {
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
            .setMessage('Contact deleted')
            .setPayload({
                detail: contactListupdated
            })
            .build()
        return res.status(200).json(response)
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

export { 
    getContactChatController, 
    deleteContactController 
}
