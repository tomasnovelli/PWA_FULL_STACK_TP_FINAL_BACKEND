import nodemailer from 'nodemailer'
import ENVIROMENT from './enviroment.config.js'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: ENVIROMENT.GMAIL_EMAIL,
        pass: ENVIROMENT.GMAIL_PASS
    }
})

export default transporter