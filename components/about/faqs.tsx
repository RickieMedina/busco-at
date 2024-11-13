'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "¿Qué es BuscoAT?",
    answer: "BuscoAT es una plataforma que conecta Acompañantes Terapéuticos con personas que necesitan sus servicios. Facilitamos la búsqueda de oportunidades laborales para profesionales AT y simplificamos el proceso de contratación para familias e instituciones."
  },
  {
    question: "¿Cómo puedo publicar una oferta de trabajo?",
    answer: "Para publicar una oferta de trabajo, primero debes registrarte como empleador. Una vez que hayas iniciado sesión, ve a tu perfil y haz clic en 'Mis ofertas'. En la solapa 'Registrar oferta de trabajo' Completa el formulario con los detalles del trabajo y estarás registrando tu oferta."
  },
  {
    question: "¿Cómo me registro como Acompañante Terapéutico?",
    answer: "Para registrarte como AT, haz clic en 'Iniciar sesión' y crear cuenta nueva, al momento de completar el formulario encontras la opción profesional. Completa el formulario con tus datos personales y profesionales, y sube los documentos requeridos para verificar tus credenciales."
  },
  {
    question: "¿El servicio tiene algún costo?",
    answer: "El registro y la búsqueda de ofertas son gratuitos para los Acompañantes Terapéuticos y empleadores. Para los empleadores, ofrecemos la posibilidad de realizar una colaboración cuando realicen una conexión exitosa con su AT"
  },
  {
    question: "¿Cómo se verifica la autenticidad de las ofertas y los perfiles?",
    answer: "Nuestro equipo revisa manualmente todas las ofertas de trabajo y los perfiles de AT. Además, requerimos documentación que respalde las credenciales profesionales de los AT y verificamos la información de contacto de los empleadores."
  },
   {
    question: "¿Cuáles son los terminos y condiciones de uso?",
    answer: (
        <>
          Puedes leer los términos y condiciones de uso de BuscoAT en el siguiente enlace:{" "}
          <a href="https://res.cloudinary.com/dr8wmb13g/image/upload/v1731474133/TyC_yjtzrc.pdf" target="_blank" rel="noopener noreferrer">
            <b>Términos y Condiciones</b>
          </a>
        </>
      ),
   },
   {
    question: "¿Cuáles son las políticas de privacidad?",
    answer: (
        <>
          Puedes leer las políticas de privacidad de BuscoAT en el siguiente enlace:{" "}
          <a href="https://res.cloudinary.com/dr8wmb13g/image/upload/v1731473421/politica-de-privacidad_yomrmj.pdf" target="_blank" rel="noopener noreferrer">
            <b>Políticas de Privacidad</b>
          </a>
        </>
      ),
   }
]

export function FAQModal() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default"
                size={'default'}
        >Preguntas Frecuentes - TyC
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Preguntas Frecuentes</DialogTitle>
          <DialogDescription>
            Encuentra respuestas a las preguntas más comunes sobre BuscoAT.
          </DialogDescription>
        </DialogHeader>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </DialogContent>
    </Dialog>
  )
}