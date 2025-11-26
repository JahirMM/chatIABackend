import { ApiResponse } from "../../shared/application/ApiResponse";
import { ConversationInterface } from "../domain/interfaces/Conversation.interface";
import { ConversationRepositoryInterface } from "../domain/interfaces/ConversationRepository.interface";

export class FindConversationByIdUseCase {
  constructor(
    private readonly conversationRepository: ConversationRepositoryInterface
  ) {}

  async execute(id: string): Promise<ApiResponse<ConversationInterface>> {
    try {
      const conversation: ConversationInterface | null =
        await this.conversationRepository.findById(id);

      if (conversation) {
        return {
          success: true,
          message: "Conversation fetched successfully",
          data: conversation,
        };
      }

      return {
        success: false,
        message: `No conversation found with id: ${id}`,
        data: null,
        error: { code: "NOT_FOUND", message: "Conversation not found" },
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return {
        success: false,
        message: "Failed to fetch conversation",
        error: { code: "FETCH_FAILED", message },
      };
    }
  }
}
