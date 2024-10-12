'use server';

import { loginSchema, registerSchema } from '@/lib/zod';
import { signIn } from '@/auth';
import { z } from 'zod';
import { AuthError } from 'next-auth';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';

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

const MAX_FILE_SIZE = 5000000
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

const formSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  apellido: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  dni: z.string().regex(/^\d{8}$/, "El DNI debe tener 8 dígitos"),
  fecha: z.string().refine((date) => new Date(date) <= new Date(), "La fecha no puede ser futura"),
  genero: z.string().min(1, "Seleccione un género"),
  telefono: z.string().regex(/^\d{10}$/, "El teléfono debe tener 10 dígitos"),
  pais: z.literal("Argentina"),
  provincia: z.string().min(1, "Seleccione una provincia"),
  localidad: z.string().min(1, "Seleccione una localidad"),
  calle: z.string().min(1, "Ingrese el nombre de la calle"),
  numero: z.string().min(1, "Ingrese el número de la calle"),
  //imagenPerfilUrl: z.string(),
  rol: z.string().min(1, "Selecione un rol"),
})

export const registerAction = async (value: z.infer<typeof formSchema>) => {
        
        try {
           
            const {data, success} = formSchema.safeParse(value);
            console.log('data', data)
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
            //TODO:validate identification_type, gender and role, birth_date
            const passwordHash = await bcrypt.hash(data.password, 10);
            
            //const address: string = `${data.calle} ${data.numero}, ${data.localidad}, ${data.provincia}, ${data.pais}`
            const address: string = `${data.calle} ${data.numero}`

            const rol : Role = Object.values(Role).find((r) => r === data.rol) as Role
            //Agregar imagenes.. 
            await db.users.create({
                data: {
                    name: data.nombre,
                    last_name: data.apellido,
                    email: data.email,
                    password_hash: passwordHash,
                    identification_type: 1, //DNI
                    identification_number: data.dni,
                    birth_date: new Date(data.fecha),
                    gender: 1,// TODO: add get gender-validate
                    phone: data.telefono,
                    address: address,
                    latitude:null,  //TODO: add impmentations
                    longitude:null, //TODO: add impmentations
                    image: null, //TODO: add impmentations
                    role: rol,
                    created_at: new Date(),
                    updated_at: new Date(),
                    is_active: true
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
