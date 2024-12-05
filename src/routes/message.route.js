import express from "express";
import { verifyTokenMiddleware } from "../middlewares/auth.middleware.js";
import { createMessageController, getConversationController } from "../controllers/message.controller.js";

const messagesRouter = express.Router();
messagesRouter.use(verifyTokenMiddleware([]))

messagesRouter.post('/send', createMessageController)
messagesRouter.get('/conversation/:receiver_id',getConversationController)

export default messagesRouter