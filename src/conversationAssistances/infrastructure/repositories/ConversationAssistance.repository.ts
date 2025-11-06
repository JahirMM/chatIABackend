import { ConversationAssistancesRepositoryInterface } from "@/conversationAssistances/domain/interfaces/ConversationAssistanceRepository.interface";
import { InsertConversationAssistances } from "@/conversationAssistances/domain/interfaces/InsertConversationAssistance.interface";
import { ConversationAssistances } from "@/conversationAssistances/domain/interfaces/ConversationAssistance.interface";
import { SupabaseService } from "@/shared/infrastructure/supabase/SupabaseClient";

export class ConversationAssistanceRepository
  implements ConversationAssistancesRepositoryInterface
{
  private readonly client = new SupabaseService().getClient();

  constructor() {
    this.client = new SupabaseService().getClient();
  }

  async insertAssistancesForConversation(
    conversationAssistance: InsertConversationAssistances
  ): Promise<ConversationAssistances> {
    const { data, error } = await this.client
      .from("conversation_assistances")
      .insert(conversationAssistance)
      .select()
      .single();

    if (error) {
      throw new Error(
        `Error inserting conversation assistance: ${error.message}`
      );
    }

    return data;
  }
}
