import { DefaultSession } from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      user_id?: string;
      role?: string;
      profile_completed?: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    user_id?: string;
    role?: string;
    profile_completed?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user_id?: string;
    role?: string;
    profile_completed?: boolean;
  }
}