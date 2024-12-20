import dotenv from 'dotenv'

dotenv.config()

const ENVIROMENT = {
    URL_BACK: process.env.URL_BACK,
    URL_FRONT: process.env.URL_FRONT,
    PORT: process.env.PORT,
    DB_URL: process.env.DB_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    GMAIL_PASS: process.env.GMAIL_PASS,
    GMAIL_EMAIL: process.env.GMAIL_EMAIL,
    API_KEY_INTERN: process.env.API_KEY_INTERN
}

export default ENVIROMENT