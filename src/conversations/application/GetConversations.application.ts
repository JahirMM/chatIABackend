import { ConversationRepositoryInterface } from "@/conversations/domain/interfaces/ConversationRepository.interface";
import { ConversationInterface } from "@/conversations/domain/interfaces/Conversation.interface";
import { ApiResponse } from "@/shared/application/ApiResponse";

export class GetConversationsUseCase {
  constructor(
    private readonly conversationRepository: ConversationRepositoryInterface
  ) {}

  async execute(): Promise<ApiResponse<ConversationInterface[]>> {
    const conversations = await this.conversationRepository.getConversations();
    if (conversations.length === 0) {
      return {
        success: false,
        message: "No conversations found",
        data: [],
      };
    }

    return {
      success: true,
      message: "Conversations fetched successfully",
      data: conversations,
    };
  }
}
