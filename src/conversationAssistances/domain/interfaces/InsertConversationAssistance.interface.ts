export interface InsertConversationAssistances {
  conversation_id: string;
  needs_human: boolean;
  reason: string | null;
}
