import UserRepository from "../repositories/user.repository.js"
import ResponseBuilder from "../utils/responseBuilder/responseBuilder.js"


const getContactChatController = async (req, res) => {
    const { contact_id } = req.params
    const {_id} = req.user
    const user = await UserRepository.getUserById(_id)
    const userContacts = user.contacts
    const contactSaved = userContacts.find(contact => contact.userId.toString() === contact_id)

    const contactSearchedById = await UserRepository.getUserById(contact_id)
    if(!contactSearchedById) {
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
const deleteContactController = (req, res) => {
    const { contact_id } = req.params

}


export {getContactChatController, deleteContactController}
