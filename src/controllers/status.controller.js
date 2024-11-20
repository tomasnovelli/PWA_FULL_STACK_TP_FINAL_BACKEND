import ResponseBuilder from "../utils/responseBuilder/responseBuilder.js"

const getPingController = (req, res) =>{
    try{
        const response = new ResponseBuilder()
        .setOk(true)
        .setStatus(200)
        .setMessage('succeded')
        .setPayload({
            detail: 'Pong'
        })
        .build()
        res.status(200).json(response)
    }
    catch(error){
        const response = new ResponseBuilder()
        .setOk(false)
        .setStatus(500)
        .setMessage('Internal Server Error')
        .setPayload({
            detail: error.message
        })
        .build()
        res.status(500).json(response)
    }
}

export default getPingController