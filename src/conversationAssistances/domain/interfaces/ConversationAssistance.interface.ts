export interface ConversationAssistances {
  id: string;
  conversation_id: string;
  needs_human: boolean;
  reason: string | null;
  resolved_at: string | null;
  created_at: string;
}
