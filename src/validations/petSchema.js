import Joi from 'joi'

const petSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(50)
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/)
    .required()
    .messages({
      'string.base': 'El nombre debe ser una cadena de caracteres',
      'string.empty': 'El nombre no puede estar vacio',
      'string.min': 'El nombre debe contener minimo 5 caracteres',
      'string.max': 'El nombre solo puede contener máximo 50 caracteres',
      'string.pattern.base': 'El nombre solo puede contener letras',
      'any.required': 'El nombre es requerido'
    }),
  species: Joi.string()
    .min(3)
    .max(50)
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/)
    .required()
    .messages({
      'string.base': 'La especie debe ser una cadena de caracteres',
      'string.empty': 'La especie no puede estar vacio',
      'string.min': 'La especie debe contener minimo 3 caracteres',
      'string.max': 'La especie solo puede contener máximo 50 caracteres',
      'string.pattern.base': 'La especie solo puede contener letras',
      'any.required': 'La especie es requerido'
    }),
  race: Joi.string()
    .min(3)
    .max(50)
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/)
    .required()
    .messages({
      'string.base': 'La raza debe ser una cadena de caracteres',
      'string.empty': 'La raza no puede estar vacio',
      'string.min': 'La raza debe contener minimo 3 caracteres',
      'string.max': 'La raza solo puede contener máximo 50 caracteres',
      'string.pattern.base': 'La raza solo puede contener letras',
      'any.required': 'La raza es requerido'
    }),
  gender: Joi.string()
    .min(1)
    .max(1)
    .required()
    .pattern(/^[MH]$/)
    .messages({
      'string.base': 'El género de ser una cadena de caracteres',
      'string.empty': 'El género no puede estar vacio',
      'string.min': 'El género debe contener minimo 1 caracter',
      'string.max': 'El género solo puede contener máximo 1 caracter',
      'string.pattern.base': 'El género solo puede ser Macho (M) o Hembra (H)',
      'any.required': 'El género es requerido'
    }),
  weight: Joi.number()
    .min(0.1)
    .max(200)
    .required()
    .messages({
      'number.base': 'El peso debe ser un número',
      'number.min': 'El peso debe ser mayor a 0',
      'number.max': 'El peso no puede ser mayor a 200',
      'any.required': 'El peso es requerido'
    }),
  birthday: Joi.date()
    .required()
    .messages({
      'any.required': 'La fecha de nacimiento es requerida',
      'date.base': 'La fecha de nacimiento debe ser una fecha valida'
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
      'string.pattern.base': 'El dni solo puede contener 8 numeros',
      'any.required': 'El dni es requerido'
    })
})

export { petSchema }
