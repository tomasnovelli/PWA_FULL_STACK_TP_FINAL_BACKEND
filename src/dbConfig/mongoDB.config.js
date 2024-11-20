import mongoose from 'mongoose'
import ENVIROMENT from '../config/enviroment.config.js'

mongoose.connect(ENVIROMENT.DB_URL)
.then(
    ()=>{
        console.log('Connection succeded with MONGO_DB')
    }
)
.catch(
    (error)=>{
        console.log('Connection failed with MONGO_DB', error)
    }
)

export default mongoose