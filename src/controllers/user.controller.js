import UserRepositoriy from "../repositories/user.repository.js"
import ResponseBuilder from "../utils/responseBuilder/responseBuilder.js"

const getUsercontactListController = async (req, res) => {
    try {
        const { user_id } = req.params
        //validacion falta token
        const contactList = await UserRepositoriy.getUserContactList(user_id)
        //validacion usuario no encontrado
        /* console.log(contactList) */
        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(200)
            .setMessage('Contact List obtained')
            .setPayload({
                contactList: contactList
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
        const { nickName, email } = req.contact
        const contactToSave = await UserRepositoriy.getUserByEmail(email)
        if (!contactToSave) {
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
        const contact_id = contactToSave._id
        if (contact_id == user_id) {
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
        await UserRepositoriy.addNewContact(user_id, contact_id, nickName)
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
const editUserProfileController = (req, res) => {

}
const deleteUserAccountController = (req, res) => {

}

export {
    getUsercontactListController,
    addNewContactController,
    editUserProfileController,
    deleteUserAccountController
}