import express from 'express'
import { forgotPasswordController, loginController, registrationController, resetPasswordController, verifyMailValidationTokenController } from '../controllers/auth.controller.js'
import {validateForgotPasswordFormMiddleware, validateLoginFormMiddleware, validateRegisterFormMiddleware, validateResetPasswordFormMiddleware } from '../middlewares/validation.middleware.js'

const authRouter = express.Router()

authRouter.post('/registration', validateRegisterFormMiddleware, registrationController)
authRouter.get('/verify/:verification_token', verifyMailValidationTokenController)
authRouter.post('/login', validateLoginFormMiddleware, loginController)
authRouter.post('/forgot-password', validateForgotPasswordFormMiddleware, forgotPasswordController)
authRouter.put('/reset-password/:reset_token', validateResetPasswordFormMiddleware, resetPasswordController)


export default authRouter