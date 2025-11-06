import { SupabaseService } from "@/shared/infrastructure/supabase/SupabaseClient";
import { AuthServiceInterface } from "@/shared/domain/AuthServiceInterface";

export class AuthService implements AuthServiceInterface {
  private readonly client;

  constructor() {
    this.client = new SupabaseService().getClient();
  }

  async verifyToken(token: string): Promise<any | null> {
    try {
      const { data, error } = await this.client.auth.getUser(token);
      if (error || !data.user) return null;
      return data.user;
    } catch (err) {
      console.error("AuthService.verifyToken error:", err);
      return null;
    }
  }
}
