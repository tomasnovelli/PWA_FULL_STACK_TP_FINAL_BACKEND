import User from "../models/user.model.js"
import userRepository from "../repositories/user.repository.js"
import ResponseBuilder from "../utils/responseBuilder/responseBuilder.js"

export const getCurrentUserProfileDataController = async (req, res) => {
    try{
        const { user_id } = req.params
        console.log(user_id)
        const user = await userRepository.getUserById(user_id)
        if (!user) {
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
        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(200)
            .setMessage('User obtained')
            .setPayload({
                user:{
                    id: user._id,
                    userName: user.userName,
                    email: user.email,
                    profilePicture: user.profilePicture
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
const getUsercontactListController = async (req, res) => {
    try {
        const { user_id } = req.params
        const user = await userRepository.getUserById(user_id)
        if (!user) {
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
        const users = await userRepository.getUsersAddedToContactListById(userIds)
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
        const existContact = await userRepository.getUserById(user_id)
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
        const contactToSave = await userRepository.getUserByEmail(email)
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
        const userToFind = await userRepository.getUserById(user_id)
        const existsContact = userToFind.contacts.find(contact => contact.userId.toString() === contact_id)
        if (existsContact) {
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
        await userRepository.addNewContact(userToFind, contact_id, nickName)
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
const updateUserProfileController = async (req, res) => {
    try {
        const { userName, profilePicture, user_id, hashedPassword } = req.user
        const userUpdatedData = {
            userName,
            password: hashedPassword,
            profilePicture
        }
        const userToUpdate = await userRepository.updateUserProfile(user_id, userUpdatedData)
        if (!userToUpdate) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(404)
                .setMessage('Bad Request')
                .setPayload({
                    detail: 'We Couldnt update your profile'
                })
                .build()
            return res.status(404).json(response)
        }
        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(200)
            .setMessage('Profile Updated')
            .setPayload({
                message: 'Profile Updated',
                detail: {
                    id: userToUpdate._id,
                    userName: userToUpdate.userName,
                    email: userToUpdate.email,
                    profilePicture: userToUpdate.profilePicture
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
const deleteUserAccountController = async (req, res) => {
    try {
        const { user_id } = req.params
        const deletedUser = await userRepository.deleteUserById(user_id)
        if (!deletedUser) {
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
        const updateDeteledUser = await User.updateMany(
            { contacts: deletedUser._id },
            { $pull: { contacts: deletedUser._id } }
        )
        if(!updateDeteledUser) {
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
        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(200)
            .setMessage('User deleted')
            .setPayload({
                detail: 'User deleted'
            })
            .build()
        return res.status(200).json(response)
    }

    catch (error) {
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
    getUsercontactListController,
    addNewContactController,
    updateUserProfileController,
    deleteUserAccountController
}