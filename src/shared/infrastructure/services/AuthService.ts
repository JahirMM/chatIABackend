// import { SupabaseService } from "@/shared/infrastructure/supabase/SupabaseClient";
// import { User } from "@supabase/supabase-js";

// export class AuthService {
//   private readonly client;

//   constructor() {
//     this.client = new SupabaseService().getClient();
//   }

//   async verifyAccessToken(token: string): Promise<User | null> {
//     try {
//       const { data, error } = await this.client.auth.getUser(token);
//       if (error || !data.user) return null;
//       return data.user;
//     } catch {
//       return null;
//     }
//   }

//   async refreshSession(refreshToken: string) {
//     const { data, error } = await this.client.auth.setSession({
//       refresh_token: refreshToken,
//     });
//     if (error || !data.session) return null;
//     return data.session;
//   }
// }
