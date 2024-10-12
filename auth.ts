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
        token.user_id = user.user_id;
        token.role = user.role;
        token.profile_completed = user.profile_completed;
      }
      return token;
    },
    // add information to show in the client
    session({session, token}) {
      if(session){
        session.user.user_id = token.user_id;
        session.user.role = token.role;
        session.user.profile_completed = token.profile_completed;
      }
      return session;
    }
  },
})