import { SupabaseService } from "@/shared/infrastructure/supabase/SupabaseClient";
import { AuthServiceInterface } from "@/shared/domain/interfaces/AuthServiceInterface";
import { User } from "@supabase/supabase-js";

export class AuthService implements AuthServiceInterface {
  private readonly client;

  constructor() {
    this.client = new SupabaseService().getClient();
  }

  /**
   * Valida un token Supabase JWT y devuelve el usuario si es válido.
   */
  async verifySupabaseToken(token: string): Promise<User | null> {
    try {
      const { data, error } = await this.client.auth.getUser(token);
      if (error || !data.user) return null;
      return data.user;
    } catch (err) {
      console.error("AuthService.verifySupabaseToken error:", err);
      return null;
    }
  }

  /**
   * Valida si un token coincide con la clave interna del backend autorizado.
   */
  verifyInternalApiKey(token: string): boolean {
    return token === process.env.INTERNAL_API_KEY;
  }

  /**
   * Detecta el tipo de autenticación y devuelve los datos correspondientes.
   */
  async verifyRequestToken(
    token: string
  ): Promise<{ type: "internal" } | { type: "supabase"; user: User } | null> {
    // 1️⃣ Verificar API Key interna
    if (this.verifyInternalApiKey(token)) {
      return { type: "internal" };
    }

    // 2️⃣ Verificar token Supabase
    const user = await this.verifySupabaseToken(token);
    if (user) {
      return { type: "supabase", user };
    }

    // ❌ Ninguno válido
    return null;
  }
}
