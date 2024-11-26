import express from 'express'
import { addNewContactController, deleteUserAccountController, getUsercontactListController, updateUserProfileController } from '../controllers/user.controller.js'
import { validateAddNewContactFormMiddleware } from '../middlewares/validation.middleware.js'
import { verifyTokenMiddleware } from '../middlewares/auth.middleware.js'

const userRouter = express.Router()
userRouter.use(verifyTokenMiddleware)

userRouter.get('/contacts/:user_id', getUsercontactListController)
userRouter.post('/contacts/:user_id/add-new-contact',validateAddNewContactFormMiddleware, addNewContactController)

//actualizar perfil
userRouter.put('/update-profile', updateUserProfileController)

//eliminar su cuenta
userRouter.delete('/delete-user-account', deleteUserAccountController)

export default userRouter