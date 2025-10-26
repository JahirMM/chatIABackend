import { UserRepositoryInterface } from "@/users/domain/interfaces/UserRepository.interface";
import { UserInsertInterface } from "@/users/domain/interfaces/UserCreate.interface";
import { UserInterface } from "@/users/domain/interfaces/User.interface";

import { SupabaseService } from "@/shared/infrastructure/supabase/SupabaseClient";

export class UserRepository implements UserRepositoryInterface {
  private readonly client = new SupabaseService().getClient();

  constructor() {
    this.client = new SupabaseService().getClient();
  }

  async getUsers(): Promise<UserInterface[]> {
    const { data, error } = await this.client.from("users").select("*");

    if (error) {
      throw new Error(`Error fetching users: ${error.message}`);
    }

    return data ?? [];
  }

  async insertUser(user: UserInsertInterface): Promise<UserInterface> {
    const { data, error } = await this.client
      .from("users")
      .insert(user)
      .select()
      .single();

    if (error) {
      throw new Error(`Error inserting user: ${error.message}`);
    }

    if (!data) {
      throw new Error("Insert succeeded but no user was returned");
    }

    return data;
  }
}
