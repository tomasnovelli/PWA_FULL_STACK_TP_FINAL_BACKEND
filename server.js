import express from "express";
import ENVIROMENT from "./src/config/enviroment.config.js";
import configDB from './src/dbConfig/mongoDB.config.js';
import statusRouter from "./src/routes/status.route.js";
import authRouter from "./src/routes/auth.route.js";
import cors from 'cors'


const app = express()
const PORT = ENVIROMENT.PORT
const URL_BACK = ENVIROMENT.URL_BACK

app.use(express.json({limit: '5mb'}))
app.use(cors())

app.use('/api/status', statusRouter)
app.use('/api/auth', authRouter)

app.listen(PORT, ()=>{
    console.log(`Server Listened at port ${URL_BACK}${PORT}`)
})



