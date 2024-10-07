import { DefaultSession } from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      role?: string;
      profile_completed?: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    role?: string;
    profile_completed?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    profile_completed?: boolean;
  }
}