import express from 'express'
import { forgotPasswordController, loginController, registrationController, resetPasswordController, verifyMailValidationTokenController } from '../controllers/auth.controller.js'
import { validateForgotPasswordForm, validateLogin, validateRegister } from '../middlewares/validation.middleware.js'

const authRouter = express.Router()

authRouter.post('/registration', validateRegister, registrationController)
authRouter.get('/verify/:verification_token', verifyMailValidationTokenController)
authRouter.post('/login', validateLogin, loginController)
authRouter.post('/forgot-password', validateForgotPasswordForm, forgotPasswordController)
authRouter.put('/reset-password/:reset_token', resetPasswordController)



export default authRouter