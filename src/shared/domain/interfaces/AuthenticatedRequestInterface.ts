import { User } from "@supabase/supabase-js";
import { Request } from "express";

export interface AuthenticatedRequestInterface extends Request {
  auth?: { type: "internal" } | { type: "supabase"; user: User };
}
