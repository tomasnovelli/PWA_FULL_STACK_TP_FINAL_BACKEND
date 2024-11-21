import express from 'express'
import { loginController, registrationController, verifyMailValidationTokenController } from '../controllers/auth.controller.js'
import validators from '../middlewares/validation.middleware.js'

const authRouter = express.Router()
const {validateRegister, validateLogin} = validators

authRouter.post('/registration', validateRegister, registrationController)
authRouter.get('/verify/:verification_token', verifyMailValidationTokenController)
authRouter.post('/login', validateLogin, loginController)
/*


authRouter.post('/forgot-password', forgotPasswordController)
authRouter.put('/reset-password/:reset_token', resetTokenController) */



export default authRouter