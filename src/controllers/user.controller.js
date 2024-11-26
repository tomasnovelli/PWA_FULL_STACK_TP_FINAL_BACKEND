import User from "../models/user.model.js"
import UserRepositoriy from "../repositories/user.repository.js"
import ResponseBuilder from "../utils/responseBuilder/responseBuilder.js"

const getUsercontactListController = async (req, res) => {
    try {
        const { user_id } = req.params
        const user = await UserRepositoriy.getUserById(user_id)
        if(!user){
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
        const contacts = user.contacts
        const userIds = contacts.map(contact => contact.userId)
        const users = await UserRepositoriy.getUsersAddedToContactListById(userIds)
        const contactList = contacts.map(contact => {
            const user = users.find(user => user._id.toString() === contact.userId.toString())
            return {
                contactId: contact.userId.toString(),
                nickName: contact.nickName,
                userName: user?.userName,
                email: user?.email,
                profilePicture: user?.profilePicture
            }
        })
        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(200)
            .setMessage('Contact List obtained')
            .setPayload({
                contacts: contactList
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
const addNewContactController = async (req, res) => {
    try {
        const { user_id } = req.params
        const existContact = await UserRepositoriy.getUserById(user_id)
        if (!existContact) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(404)
                .setMessage('Not Found')
                .setPayload({
                    detail: 'User not found, you arent registred'
                })
                .build()
            return res.status(404).json(response)
        }
        const { nickName, email } = req.contact
        const contactToSave = await UserRepositoriy.getUserByEmail(email)
        if(!contactToSave){
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
        if (contactToSave.emailVerified === false) {
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
        const contact_id = contactToSave._id.toString()
        if (contact_id === user_id) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Bad Request')
                .setPayload({
                    detail: 'You Cant Add Yourself'
                })
                .build()
            return res.status(400).json(response)
        }
        const userToFind = await UserRepositoriy.getUserById(user_id)
        const existsContact = userToFind.contacts.find(contact => contact.userId.toString() === contact_id)
        if(existsContact){
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Bad Request')
                .setPayload({
                    detail: 'Contact already exist on your contact list'
                })
                .build()
            return res.status(400).json(response)
        }
        await UserRepositoriy.addNewContact(userToFind, contact_id, nickName)
        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(200)
            .setMessage('Contact saved')
            .setPayload({
                detail: {
                    message: 'Contact saved',
                    contact: {
                        _id: contact_id,
                        nickName: contactToSave.nickName,
                        phoneNumber: contactToSave.phoneCountryId + contactToSave.phoneNumber,
                        email: contactToSave.email
                    }
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
        res.status(500).json(response)
    }

}
const updateUserProfileController = (req, res) => {

}
const deleteUserAccountController = (req, res) => {

}

export {
    getUsercontactListController,
    addNewContactController,
    updateUserProfileController,
    deleteUserAccountController
}