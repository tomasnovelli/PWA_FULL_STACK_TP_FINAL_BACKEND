import express from 'express'
import { registrationController } from '../controllers/auth.controller.js'

const authRouter = express.Router()

authRouter.post('/registration', registrationController)
/*
authRouter.get('/verify/:verification_token', verifyMailValidationTokenController)
authRouter.post('/login', loginController)
authRouter.post('/forgot-password', forgotPasswordController)
authRouter.put('/reset-password/:reset_token', resetTokenController) */



export default authRouter