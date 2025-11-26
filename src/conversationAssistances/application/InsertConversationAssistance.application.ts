import { ApiResponse } from "../../shared/application/ApiResponse";
import { ConversationRepositoryInterface } from "../../conversations/domain/interfaces/ConversationRepository.interface";
import { FindConversationByIdUseCase } from "../../conversations/application/FindConversationById.application";
import { ConversationAssistancesRepositoryInterface } from "../domain/interfaces/ConversationAssistanceRepository.interface";
import { InsertConversationAssistances } from "../domain/interfaces/InsertConversationAssistance.interface";

export class InsertConversationAssistanceUseCase {
  constructor(
    private readonly conversationAssistanceRepository: ConversationAssistancesRepositoryInterface,
    private readonly conversationRepository: ConversationRepositoryInterface,
    private readonly findConversationByIdUseCase: FindConversationByIdUseCase
  ) {}

  async execute(
    conversationAssistanceRequest: InsertConversationAssistances
  ): Promise<ApiResponse<InsertConversationAssistances>> {
    try {
      const conversationAssistance =
        await this.conversationAssistanceRepository.insertAssistancesForConversation(
          conversationAssistanceRequest
        );

      // Obtener la conversación para no perder su categoría actual
      const conversationResult = await this.findConversationByIdUseCase.execute(
        conversationAssistanceRequest.conversation_id
      );

      if (!conversationResult.success || !conversationResult.data) {
        // No debería pasar, pero si falla, la asistencia ya se creó.
        // Podríamos agregar un rollback aquí si fuera crítico.
      }

      // Si la categoría es null (ej. conversación nueva), la asignamos a 'new'.
      const newCategory = conversationResult.data?.category ?? "new";

      console.log(
        `[InsertConversationAssistance] Updating conversation ${conversationAssistanceRequest.conversation_id} with category: ${newCategory}, alerts: true`
      );
      // Marcar la conversación para que aparezca en la bandeja de alertas
      await this.conversationRepository.updateCategoryAndAlerts(
        conversationAssistanceRequest.conversation_id,
        newCategory, // Mantenemos la categoría actual o la establecemos a 'new'
        true
      );

      return {
        success: true,
        message: "Conversation assistance created successfully",
        data: conversationAssistance,
      };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unknown error creating conversation assistance";
      return {
        success: false,
        message: "Failed to create conversation assistance",
        error: {
          code: "CONVERSATION_ASSISTANCE_CREATION_FAILED",
          message,
        },
      };
    }
  }
}
