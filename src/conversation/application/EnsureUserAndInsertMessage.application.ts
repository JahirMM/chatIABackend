import { MessageRepositoryInterface } from "@/messages/domain/interfaces/MessageRepository.interface";
import { UserRepositoryInterface } from "@/users/domain/interfaces/UserRepository.interface";

import { InsertMessageWithUserResponseDTO } from "@/conversation/application/DTOs/InsertMessageWithUserResponseDTO";
import { InsertMessageWithUserDTO } from "@/conversation/application/DTOs/InsertMessageWithUserDTO";

import { InsertMessageUseCase } from "@/messages/application/InsertMessage.application";
import { InsertUserUseCase } from "@/users/application/InsertUser.application";
import { ApiResponse } from "@/shared/application/ApiResponse";

export class EnsureUserAndInsertMessageUseCase {
  private readonly insertUserUseCase: InsertUserUseCase;
  private readonly insertMessageUseCase: InsertMessageUseCase;

  constructor(
    private readonly userRepository: UserRepositoryInterface,
    private readonly messageRepository: MessageRepositoryInterface
  ) {
    this.insertUserUseCase = new InsertUserUseCase(this.userRepository);
    this.insertMessageUseCase = new InsertMessageUseCase(
      this.messageRepository
    );
  }

  async execute(
    dto: InsertMessageWithUserDTO
  ): Promise<ApiResponse<InsertMessageWithUserResponseDTO>> {
    if (dto.senderType === "user") {
      // flujo 1: validar usuario por teléfono
      let user = await this.userRepository.findByPhone(dto.phone);

      let createdUser = false;
      if (!user) {
        const userResponse = await this.insertUserUseCase.execute({
          phone: dto.phone,
          name: dto.name ?? "No name",
        });

        if (!userResponse.success || !userResponse.data) {
          return {
            success: false,
            message: "Failed to create user",
            error: userResponse.error ?? {
              code: "USER_CREATION_FAILED",
              message: "Could not create user",
            },
          };
        }

        user = userResponse.data;
        createdUser = true;
      }

      const messageResponse = await this.insertMessageUseCase.execute({
        user_id: user.id,
        content: dto.content,
        sender: "user",
      });

      return {
        success: true,
        message: "Message created successfully",
        data: {
          messageId: messageResponse.data!.id,
          content: dto.content,
          timestamp: messageResponse.data!.created_at,
          sender: {
            id: user.id,
            phone: user.phone,
            name: user.name,
          },
          createdUser,
        },
      };
    }

    // flujo 2: mensaje enviado por la IA
    const messageResponse = await this.insertMessageUseCase.execute({
      user_id: dto.senderId,
      content: dto.content,
      sender: "ai",
    });

    return {
      success: true,
      message: "AI message created successfully",
      data: {
        messageId: messageResponse.data!.id,
        content: dto.content,
        timestamp: messageResponse.data!.created_at,
        sender: {
          id: dto.senderId,
          name: "AI",
        },
        createdUser: false,
      },
    };
  }
}
