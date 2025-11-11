// import { AuthenticatedRequestInterface } from "@/shared/domain/interfaces/AuthenticatedRequestInterface";
// import { AuthService } from "@/shared/infrastructure/services/AuthService";
// import { Response, NextFunction } from "express";
// import * as cookie from "cookie";

// export class VerifyAuthMiddleware {
//   private readonly authService = new AuthService();

//   async handle(
//     req: AuthenticatedRequestInterface,
//     res: Response,
//     next: NextFunction
//   ) {
//     try {
//       const cookies = cookie.parse(req.headers.cookie || "");
//       const accessToken = cookies["sb-access-token"];
//       const refreshToken = cookies["sb-refresh-token"];

//       if (!accessToken && !refreshToken) {
//         return res
//           .status(401)
//           .json({ success: false, message: "Not authenticated" });
//       }

//       let user = null;

//       if (accessToken) {
//         user = await this.authService.verifyAccessToken(accessToken);
//       }

//       // Si el access_token expiró pero hay refresh_token
//       if (!user && refreshToken) {
//         const newSession = await this.authService.refreshSession(refreshToken);
//         if (!newSession) {
//           return res
//             .status(401)
//             .json({ success: false, message: "Session expired" });
//         }

//         // Actualizamos la cookie
//         res.setHeader(
//           "Set-Cookie",
//           cookie.serialize("sb-access-token", newSession.access_token, {
//             httpOnly: true,
//             secure: true,
//             sameSite: "strict",
//             path: "/",
//             maxAge: 60 * 60,
//           })
//         );

//         user = newSession.user;
//       }

//       if (!user) {
//         return res
//           .status(401)
//           .json({ success: false, message: "Invalid session" });
//       }

//       req.auth = { type: "supabase", user };
//       next();
//     } catch (error) {
//       console.error("Auth middleware error:", error);
//       res
//         .status(500)
//         .json({ success: false, message: "Auth verification failed" });
//     }
//   }
// }
