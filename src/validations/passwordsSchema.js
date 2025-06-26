import Joi from 'joi'

const passwordSchema = Joi.object({
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

export { passwordSchema }
