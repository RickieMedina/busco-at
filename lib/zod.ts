import { array, boolean, literal, number, object, string } from "zod"
 
export const loginSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(4, "Password must be more than 4 characters")
    .max(32, "Password must be less than 32 characters"),
})


export const registerSchema = object({
    email: string({ required_error: "Email is required" })
      .min(1, "Email is required")
      .email("Invalid email"),
    password: string({ required_error: "Password is required" })
      .min(1, "Password is required")
      .min(4, "Password must be more than 4 characters")
      .max(32, "Password must be less than 32 characters"),
      //TODO:add name   
    name: string({ required_error: "Name is required" })
    .min(1, "Name is required")
  })

export const formRegisterSchema = object({
    nombre: string().min(2, "El nombre debe tener al menos 2 caracteres"),
    apellido: string().min(2, "El apellido debe tener al menos 2 caracteres"),
    email: string().email("Email inválido"),
    password: string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    dni: string()
    .min(8, "El DNI debe tener 8 dígitos")
    .max(8, "El DNI debe tener 8 dígitos")
    .refine((val) => /^\d+$/.test(val), {
      message: "El DNI debe contener solo números",
    }),
    fecha: string().refine((date) => new Date(date) <= new Date(), "La fecha no puede ser futura")
      .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age >= 18;
    }, "Debes ser mayor de 18 años para registrarte"),
    genero: string().min(1, "Seleccione un género"),
    telefono: string().regex(/^\d{10}$/, "El teléfono debe tener 10 dígitos"),
    pais: literal("Argentina"),
    provincia: string().min(1, "Seleccione una provincia"),
    localidad: string().min(1, "Seleccione una localidad"),
    calle: string().min(1, "Ingrese el nombre de la calle"),
    numero: string().min(1, "Ingrese el número de la calle"),
  //   imagenPerfil: z
  //     .any()
  //     .refine((files) => files?.length == 1, "La imagen es requerida")
  //     .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `El tamaño máximo es 5MB.`)
  //     .refine(
  //       (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
  //       "Solo se aceptan archivos .jpg, .jpeg, .png y .webp"
  //     ),
    rol: string().min(1, "Selecione un rol"),
  })

  //Professional
export const formProfessionalSchema = object({
  identification_type: string().min(1, 'Seleccione tipo de identificación'),
  identification_number: string().regex(/^(20|23|24|27|30|33|34)([0-9]{9}|-[0-9]{8}-[0-9])$/, 'CUIL/CUIT inválido'),
  health_care_type: string().min(1, 'El campo de atención es requerido'),
  patient_type: string().min(1, 'El tipo de paciente es requerido'),
  social_security: boolean().default(false),
  private: boolean().default(false),
  hourly_rate: string().min(1, 'El valor hora es requerido'),
  url: string().min(1, 'El archivo es requerido').optional(),
  observations: string().max(250, 'Las observaciones no pueden superar los 250 caracteres').optional()
})


  //Offer
export  const formOfferSchema = object({
    title: string().min(1, "El título es requerido"),
    description: string().min(1, "La descripción es requerida"),
    gender: string().min(1, "Seleccione un género"),
    address: object({
      pais: literal("Argentina"),
      provincia: string().min(1, "Seleccione una provincia"),
      localidad: string().min(1, "Seleccione una localidad"),
      calle: string().min(1, "Ingrese el nombre de la calle"),
      numero: string().min(1, "Ingrese el número de la calle"),
    }),
    location: object({
      latitude: number().min(-90, "Latitud inválida").max(90, "Latitud inválida").refine(
        (lat) => lat !== 0,
        {
          message: "Seleccione una ubicación en el mapa",
        }
      ),
      longitude: number().min(-180, "Longitud inválida").max(180, "Longitud inválida").refine(
        (lng) => lng !== 0,
        {
          message: "Seleccione una ubicación en el mapa",
        }
      )
    }),
    ageRange: object({
      min: number().min(18, "La edad mínima es 18"),
      max: number().max(100, "La edad máxima es 100"),
    }),
    requiresCertificate: boolean(),
    paymentType: object({
      socialSecurity: boolean(),
      private: boolean()
    }),
    diagnosis: string().min(1, "El diagnóstico es requerido"),
    additionalObservations: string(),
    schedule: array(object({
      day: string(),
      startTime: string(),
      endTime: string(),
    }))
  })

