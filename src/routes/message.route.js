import express from "express";
import { verifyTokenMiddleware } from "../middlewares/auth.middleware.js";
import { createMessageController, deleteConversationController, getConversationController } from "../controllers/message.controller.js";
import { validateMessageMiddleware } from "../middlewares/validation.middleware.js";

const messagesRouter = express.Router();
messagesRouter.use(verifyTokenMiddleware([]))

messagesRouter.post('/send/:contact_id', validateMessageMiddleware, createMessageController)
messagesRouter.get('/conversation/:contact_id',getConversationController)
messagesRouter.put('/delete-conversation/:user_id/:contact_id', deleteConversationController)

export default messagesRouter