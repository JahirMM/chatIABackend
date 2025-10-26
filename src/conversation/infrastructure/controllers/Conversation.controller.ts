import { EnsureUserAndInsertMessageUseCase } from "@/conversation/application/EnsureUserAndInsertMessage.application";

import { InsertMessageWithUserDTO } from "@/conversation/application/DTOs/InsertMessageWithUserDTO";

import { MessageRepository } from "@/messages/infrastructure/repositories/Message.repository";
import { UserRepository } from "@/users/infrastructure/repositories/User.repository";

import { Request, Response } from "express";

export class ConversationController {
  private readonly insertMessageUseCase: EnsureUserAndInsertMessageUseCase;

  constructor() {
    const userRepository = new UserRepository();
    const messageRepository = new MessageRepository();
    this.insertMessageUseCase = new EnsureUserAndInsertMessageUseCase(
      userRepository,
      messageRepository
    );
  }

  async insertMessage(req: Request, res: Response): Promise<void> {
    try {
      const { senderType, phone, name, senderId, content } = req.body;

      if (!content || typeof content !== "string") {
        res.status(400).json({
          success: false,
          message: "Content is required and must be a string.",
          error: { code: "INVALID_CONTENT", message: "Missing content field" },
        });
        return;
      }

      let obj: InsertMessageWithUserDTO | undefined;

      if (senderType === "user") {
        if (!phone) {
          res.status(400).json({
            success: false,
            message: "Phone is required for user messages.",
            error: { code: "MISSING_PHONE", message: "Missing phone field" },
          });
          return;
        }

        obj = { senderType, phone, name, content };
      } else if (senderType === "ai") {
        if (!senderId) {
          res.status(400).json({
            success: false,
            message: "senderId is required for AI messages.",
            error: { code: "MISSING_SENDER_ID", message: "Missing senderId" },
          });
          return;
        }

        obj = { senderType, senderId, content };
      } else {
        res.status(400).json({
          success: false,
          message: "Invalid senderType. Must be 'user' or 'ai'.",
          error: {
            code: "INVALID_SENDER_TYPE",
            message: "senderType must be 'user' or 'ai'",
          },
        });
        return;
      }

      const useCaseResult = await this.insertMessageUseCase.execute(obj);

      if (!useCaseResult.success) {
        res.status(400).json(useCaseResult);
        return;
      }

      res.status(200).json(useCaseResult);
      return;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown server error";

      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: {
          code: "SERVER_ERROR",
          message,
        },
      });
      return;
    }
  }
}
