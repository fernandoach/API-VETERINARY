import Joi from 'joi'

const userSchema = Joi.object({
  firstname: Joi.string()
    .min(3)
    .max(50)
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/)
    .required()
    .messages({
      'string.base': 'El nombre debe ser una cadena de caracteres',
      'string.empty': 'El nombre no puede estar vacio',
      'string.min': 'El nombre debe contener minimo 3 caracteres',
      'string.max': 'El nombre solo puede contener máximo 50 caracteres',
      'string.pattern.base': 'El nombre solo puede contener letras',
      'any.required': 'El nombre es requerido'
    }),
  lastname: Joi.string()
    .min(3)
    .max(50)
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/)
    .required()
    .messages({
      'string.base': 'El apellido debe ser una cadena de caracteres',
      'string.empty': 'El apellido no puede estar vacio',
      'string.min': 'El apellido debe contener minimo 3 caracteres',
      'string.max': 'El apellido solo puede contener máximo 50 caracteres',
      'string.pattern.base': 'El apellido solo puede contener letras',
      'any.required': 'El apellido es requerido'
    }),
  gender: Joi.string()
    .min(1)
    .max(1)
    .required()
    .pattern(/^[MFO]$/)
    .messages({
      'string.base': 'El género de ser una cadena de caracteres',
      'string.empty': 'El género no puede estar vacio',
      'string.min': 'El género debe contener minimo 1 caracter',
      'string.max': 'El género solo puede contener máximo 1 caracter',
      'string.pattern.base': 'El género solo puede ser M o F u O',
      'any.required': 'El género es requerido'
    }),
  birthday: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .custom((value, helpers) => {
      const date = new Date(value)
      if (isNaN(date.getTime())) {
        return helpers.error('any.invalid')
      }
      return value
    })
    .messages({
      'string.pattern.base': 'El formato de la fecha debe ser YYYY-MM-DD',
      'any.invalid': 'La fecha no es válida',
      'any.required': 'La fecha de nacimiento es requerida'
    }),
  dni: Joi.string()
    .min(3)
    .max(50)
    .pattern(/^\d{8}$/)
    .required()
    .messages({
      'string.base': 'El dni debe ser cadena de caracteres',
      'string.empty': 'El dni no puede estar vacio',
      'string.min': 'El dni debe contener minimo 8 caracteres',
      'string.max': 'El dni solo puede contener máximo 8 caracteres',
      'string.pattern.base': 'El dni solo puede contener numeros',
      'any.required': 'El dni es requerido'
    }),
  telephone: Joi.string()
    .required()
    .min(8)
    .max(100)
    .pattern(/^9\d{8}$/)
    .messages({
      'string.base': 'El télefono de ser una cadena de caracteres',
      'string.empty': 'El télefono no puede estar vacio',
      'string.min': 'El télefono debe contener minimo 9 caracteres',
      'string.max': 'El télefono solo puede contener máximo 9 caracteres',
      'string.pattern.base': 'Ingrese un télefono válido (empieza por 9)',
      'any.required': 'El télefono es requerido'
    }),
  email: Joi.string()
    .required()
    .min(8)
    .max(100)
    .pattern(/^[a-zA-Z0-9._%+-áéíóúÁÉÍÓÚñÑ]+@(gmail\.com|hotmail\.com|yahoo\.com)$/)
    .messages({
      'string.base': 'El correo de ser una cadena de caracteres',
      'string.empty': 'El correo no puede estar vacio',
      'string.min': 'El correo debe contener minimo 8 caracteres',
      'string.max': 'El correo solo puede contener máximo 100 caracteres',
      'string.pattern.base': 'Ingrese un correo válido (gmail, hotmail, yahoo) (.com)',
      'any.required': 'El correo es requerido'
    }),
  password: Joi.string()
    .min(8)
    .max(32)
    .pattern(/^(?=(.*[A-Z]))(?=(.*\d.*\d)).+$/)
    .messages({
      'string.base': 'La contraseña de ser una cadena de caracteres',
      'string.empty': 'La contraseña no puede estar vacia',
      'string.min': 'La contraseña debe contener minimo 8 caracteres',
      'string.max': 'La contraseña solo puede contener máximo 32 caracteres',
      'string.pattern.base': 'La contraseña debe contar con mínimo una letra mayuscula y dos números',
      'any.required': 'La contraseña es requerida'
    }),
  repassword: Joi.any()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Las contraseñas no coiciden',
      'any.required': 'Repetir contraseña es requerido'
    })
})

export { userSchema }
