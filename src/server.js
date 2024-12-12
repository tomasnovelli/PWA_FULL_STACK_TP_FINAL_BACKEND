import express from "express";
import ENVIROMENT from "./config/enviroment.config.js";
import configDB from './dbConfig/mongoDB.config.js';
import statusRouter from "./routes/status.route.js";
import authRouter from "./routes/auth.route.js";
import cors from 'cors'
import { verifiApiKeyMiddleware } from "./middlewares/auth.middleware.js";
import userRouter from "./routes/user.route.js";
import contactRouter from "./routes/contact.route.js";
import messagesRouter from "./routes/message.route.js";


const app = express()
const PORT = ENVIROMENT.PORT
const URL_BACK = ENVIROMENT.URL_BACK

app.use(cors())
app.use(express.json({limit: '5mb'}))
app.use(verifiApiKeyMiddleware)

app.use('/api/status', statusRouter)
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/contact', contactRouter)
app.use('/api/messages', messagesRouter)

app.listen(PORT, ()=>{
    console.log(`Server Listened at port ${URL_BACK}${PORT}`)
})



