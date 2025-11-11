import { AuthRepositoryInterface } from "@/auth/domain/interfaces/AuthRepository.interface";
import { LoginRequestDTO } from "@/auth/application/DTOs/LoginRequestDTO";
import { ApiResponse } from "@/shared/application/ApiResponse";

export class LoginUseCase {
  constructor(private readonly authRepository: AuthRepositoryInterface) {}

  async execute(credentials: LoginRequestDTO): Promise<
    ApiResponse<{
      id: string;
      email: string;
    }>
  > {
    try {
      const result = await this.authRepository.login(credentials);

      return {
        success: true,
        message: "Login successful",
        data: result.user,
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error during login";
      return {
        success: false,
        message,
      };
    }
  }
}
