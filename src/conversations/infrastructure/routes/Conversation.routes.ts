import { ConversationController } from "@/conversations/infrastructure/controllers/Conversation.controller";
import { Router } from "express";

const ConversationRoutes: Router = Router();
const controller = new ConversationController();

ConversationRoutes.post("/messages", (req, res) => controller.insertMessage(req, res));
ConversationRoutes.get("/conversations", (req, res) => controller.getConversations(req, res))

export default ConversationRoutes;
