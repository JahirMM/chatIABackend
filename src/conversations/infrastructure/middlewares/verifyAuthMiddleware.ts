import { AuthService } from "@/shared/infrastructure/services/AuthService";
import { Request, Response, NextFunction } from "express";

export class VerifyAuthMiddleware {
  private readonly authService = new AuthService();

  async handle(req: Request, res: Response, next: NextFunction) {
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

    // API Key interna (para backend autorizado)
    if (token === process.env.INTERNAL_API_KEY) {
      (req as any).auth = { type: "internal" };
      return next();
    }

    // 2️oken Supabase (para usuarios autenticados)
    const user = await this.authService.verifyToken(token);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired Supabase token",
        error: {
          code: "INVALID_SUPABASE_TOKEN",
          message: "Invalid or expired Supabase token",
        },
      });
    }

    (req as any).auth = { type: "supabase", user };
    next();
  }
}
