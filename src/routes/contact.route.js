import express from 'express'
import { verifyTokenMiddleware } from '../middlewares/auth.middleware.js'
import { deleteContactController, getContactChatController } from '../controllers/contact.controller.js'


const contactRouter = express.Router()
contactRouter.use(verifyTokenMiddleware([]))

contactRouter.get('/chat/:contact_id', getContactChatController)
contactRouter.delete('/delete-contact/:contact_id', deleteContactController)

export default contactRouter