import type { NextAuthConfig } from "next-auth"
import  Credentials  from "next-auth/providers/credentials"
import { loginSchema } from "./lib/zod";
import { db } from "./lib/db";
import bcrypt from "bcryptjs";
 

export default {
    providers: [
        Credentials({
          authorize: async (credentials) => {
           
            const {data, success} = loginSchema.safeParse(credentials);
            
            if(!success) { throw new Error("Invalid credentials")};

              const user = await db.users.findFirst({
                where: {
                  email: data.email, 
                },
              });
            
              if (!user || !user.password_hash) {
                throw new Error("No user found");
              }
             
              const isValid = await bcrypt.compare(data.password, user.password_hash);
              
              if (!isValid) {
                throw new Error("Incorrect password");
              }

            return user;
  
          },
        }),
      ],
} satisfies NextAuthConfig