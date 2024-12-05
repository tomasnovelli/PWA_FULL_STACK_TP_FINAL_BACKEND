import express from 'express'
import { addNewContactController, deleteUserAccountController, getCurrentUserProfileDataController, getUsercontactListController, updateUserProfileController } from '../controllers/user.controller.js'
import { validateAddNewContactFormMiddleware, validateUpdateUserProfileMiddleware } from '../middlewares/validation.middleware.js'
import { verifyTokenMiddleware } from '../middlewares/auth.middleware.js'

const userRouter = express.Router()
userRouter.use(verifyTokenMiddleware([]))

userRouter.get('/profile/:user_id', getCurrentUserProfileDataController)
userRouter.get('/contacts/:user_id', getUsercontactListController)
userRouter.post('/contacts/:user_id/add-new-contact',validateAddNewContactFormMiddleware, addNewContactController)
userRouter.put('/update-profile/:user_id', validateUpdateUserProfileMiddleware, updateUserProfileController)
userRouter.put('/delete-user-account/:user_id', deleteUserAccountController)

export default userRouter