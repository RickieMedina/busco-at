import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import {db} from "@/lib/db"
import authConfig from "@/auth.config"


export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  ...authConfig,
  session: {strategy: "jwt"},
  callbacks:{
    //add information to the jwt
    jwt({token, user}) {
      if(user){
        token.role = user.role;
      }
      return token;
    },
    // add information to show in the cliente
    session({session, token}) {
      if(session){
        session.user.role = token.role;
      }
      return session;
    }
  },
})