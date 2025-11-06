import { AuthenticatedRequestInterface } from "@/shared/domain/interfaces/AuthenticatedRequestInterface";
import { AuthService } from "@/shared/infrastructure/services/AuthService";
import { Response, NextFunction } from "express";

export class VerifyAuthMiddleware {
  private readonly authService = new AuthService();

  async handle(
    req: AuthenticatedRequestInterface,
    res: Response,
    next: NextFunction
  ) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Missing Authorization header",
        error: {
          code: "MISSING_AUTH_HEADER",
          message: "Authorization header required",
        },
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Invalid Authorization format. Use 'Bearer <token>'.",
        error: {
          code: "INVALID_AUTH_FORMAT",
          message: "Invalid Bearer token format",
        },
      });
    }

    const auth = await this.authService.verifyRequestToken(token);

    if (!auth) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired authentication",
        error: {
          code: "INVALID_AUTH_TOKEN",
          message: "Invalid or expired authentication token",
        },
      });
    }

    req.auth = auth;
    next();
  }
}
