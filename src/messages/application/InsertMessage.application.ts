import { MessageRepositoryInterface } from "@/messages/domain/interfaces/MessageRepository.interface";
import { MessageInsertInterface } from "@/messages/domain/interfaces/MessageInsert.interface";
import { MessageInterface } from "@/messages/domain/interfaces/Message.interface";

import { ApiResponse } from "@/shared/application/ApiResponse";

export class InsertMessageUseCase {
  constructor(private readonly messageRepository: MessageRepositoryInterface) {}

  async execute(
    messageRequest: MessageInsertInterface
  ): Promise<ApiResponse<MessageInterface>> {
    try {
      const message = await this.messageRepository.insertMessage(
        messageRequest
      );
      return {
        success: true,
        message: "Message created successfully",
        data: message,
      };
    } catch (error) {
      const messageError =
        error instanceof Error
          ? error.message
          : "Unknown error creating message";
      return {
        success: false,
        message: "Failed to create message",
        error: {
          code: "MESSAGE_CREATION_FAILED",
          message: messageError,
        },
      };
    }
  }
}
