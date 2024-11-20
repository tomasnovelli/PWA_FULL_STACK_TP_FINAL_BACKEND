import express from "express";
import ENVIROMENT from "./src/config/enviroment.config.js";
import statusRouter from "./src/routes/status.route.js";


const app = express()
const PORT = ENVIROMENT.PORT
app.use(express.json({limit: '5mb'}))


app.use('/api/status', statusRouter)


app.listen(PORT, ()=>{
    console.log(`Server Listened at port http://localhost:${PORT}`)
})



