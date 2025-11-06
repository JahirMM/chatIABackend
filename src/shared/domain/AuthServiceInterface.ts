export interface AuthServiceInterface {
  verifyToken(token: string): Promise<any | null>;
}
