import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      isVerified: boolean;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    isVerified: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    isVerified: boolean;
  }
}
