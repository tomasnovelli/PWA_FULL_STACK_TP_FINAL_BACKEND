import transporter from "../config/transporter.config.js"


const sendEmail = async (options) => {
    try{
        await transporter.sendMail(options)
        console.log('email sended')
    }
    catch(error){
        console.erro('error al enviar mail:', error)
        throw error
    }
}

export {sendEmail}