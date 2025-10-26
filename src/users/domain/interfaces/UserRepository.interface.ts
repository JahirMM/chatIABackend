import { UserInsertInterface } from "@/users/domain/interfaces/UserCreate.interface";
import { UserInterface } from "@/users/domain/interfaces/User.interface";

export interface UserRepositoryInterface {
  getUsers(): Promise<UserInterface[]>;
  insertUser(user: UserInsertInterface): Promise<UserInterface>;
}
