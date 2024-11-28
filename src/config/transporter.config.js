import nodemailer from 'nodemailer'
import ENVIROMENT from './enviroment.config.js'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 465,
    secure: true,
    logger: true,
    debug: true,
    auth: {
        user: ENVIROMENT.GMAIL_EMAIL,
        pass: ENVIROMENT.GMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
})

export default transporter