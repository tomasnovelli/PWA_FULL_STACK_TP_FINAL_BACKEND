import express from 'express'
import { verifyTokenMiddleware } from '../middlewares/auth.middleware.js'
import { addNewContactController, deleteUserAccountController, editUserProfileController, getUsercontactListController } from '../controllers/user.controller.js'
import { validateAddNewContactFormMiddleware } from '../middlewares/validation.middleware.js'

const userRouter = express.Router()


//obtener los contactos por id de usuario
userRouter.get('/contacts/:user_id', getUsercontactListController)

//agregar un contacto nuevo, va a tener middleware de formulario
userRouter.post('/contacts/:user_id/add-new-contact',validateAddNewContactFormMiddleware, addNewContactController)

//modificar datos de su perfil, va a tener middleware de formulario
userRouter.put('/edit-profile', editUserProfileController)

//eliminar su cuenta
userRouter.delete('/delete-user-account', deleteUserAccountController)

export default userRouter