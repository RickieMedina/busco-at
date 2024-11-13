'use client'

import { useState } from 'react'
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface TermsCheckboxProps {
  onCheckedChange: (checked: boolean) => void
}

export function TermsCheckbox({ onCheckedChange }: TermsCheckboxProps) {
  const [isChecked, setIsChecked] = useState(false)

  const handleChange = (checked: boolean) => {
    setIsChecked(checked)
    onCheckedChange(checked)
  }

  return (
    <div className="flex items-start space-x-3 space-y-0 rounded-md border p-4 mt-4">
      <Checkbox
        id="terms"
        checked={isChecked}
        onCheckedChange={handleChange}
      />
      <div className="grid gap-1.5 leading-none">
        <Label
          htmlFor="terms"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Acepto los términos y condiciones y las políticas de privacidad
        </Label>
        <p className="text-sm text-muted-foreground">
          He leído y acepto los{" "}
          <a 
            href="https://res.cloudinary.com/dr8wmb13g/image/upload/v1731474133/TyC_yjtzrc.pdf" 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-medium text-primary underline"
          >
            Términos y Condiciones
          </a>
          {" "}y las{" "}
          <a 
            href="https://res.cloudinary.com/dr8wmb13g/image/upload/v1731473421/politica-de-privacidad_yomrmj.pdf" 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-medium text-primary underline"
          >
            Políticas de Privacidad
          </a>
          {" "}de BuscoAT.
        </p>
      </div>
    </div>
  )
}