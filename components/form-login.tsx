"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent,CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { loginAction } from "@/actions/auth-action"
import { useRouter } from "next/navigation"

const formSchema = z.object({
  email: z.string().email({
    message: "Por favor ingrese un correo electrónico válido.",
  }),
  password: z.string().min(6, {
    message: "La contraseña debe tener al menos 6 caracteres.",
  }),
})

export default function LoginForm() {
  
  const [error, setError] = useState<string | null>(null);//Error handling
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {

    setIsLoading(true)
    setError(null)
    const response = await loginAction(values);
        if(response.error) {
            setError(response.error);
            setIsLoading(false);
            return;
        }
        else{
            router.push("/dashboard");
        }     
  }

  return (
    <Card className="w-[350px]">
      <CardHeader className="flex justify-center items-center">
        <CardTitle className="text-2xl font-bold">Iniciar sesión</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="micorreo@ejemplo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>
            {error && <FormMessage> {error}</FormMessage>}
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          ¿Aún no estás registrado?{" "}
          <Link href="/registro" className="text-primary hover:underline">
            Crear cuenta
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}