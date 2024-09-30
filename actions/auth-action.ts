'use server';

import { loginSchema, registerSchema } from '@/lib/zod';
import { signIn } from '@/auth';
import { z } from 'zod';
import { AuthError } from 'next-auth';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export const loginAction = async (value: z.infer<typeof loginSchema>) => {
    
    try {
        await signIn('credentials', {
            email: value.email,
            password: value.password,
            redirect: false
        })
        return {success: true}
    } catch (error) {
        if(error instanceof AuthError){
            return {error: error.cause?.err?.message}
        }
        return {error: 'Error 500'}
    }
}


export const registerAction = async (value: z.infer<typeof registerSchema>) => {
        
        try {
           
            const {data, success} = registerSchema.safeParse(value);
            
            if(!success) {
                return {error: 'Invalid data'}
            }

            const user= await db.users.findFirst({
                where: {
                    email: data.email
                }
            });

            if(user){
                return {error: 'User already exists'}
            }

            const passwordHash = await bcrypt.hash(data.password, 10);

            await db.users.create({
                data: {
                    email: data.email,
                    password_hash: passwordHash,
                    name: data.name
                }
            })
            
            await signIn('credentials', {
                email: data.email,
                password: data.password,
                redirect: false
            })

            return {success: true}

        } catch (error) {
            if(error instanceof AuthError){
                return {error: error.cause?.err?.message}
            }
            return {error: 'Error 500'}
        }
}
