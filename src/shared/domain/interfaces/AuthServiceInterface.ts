import { User } from "@supabase/supabase-js";

export interface AuthServiceInterface {
  verifySupabaseToken(token: string): Promise<User | null>;
  verifyInternalApiKey(token: string): boolean;
  verifyRequestToken(
    token: string
  ): Promise<{ type: "internal" } | { type: "supabase"; user: User } | null>;
}
