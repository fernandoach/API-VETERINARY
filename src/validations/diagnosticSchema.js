import Joi from 'joi'

const diagnosticSchema = Joi.object({
  date: Joi.string()
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
  description: Joi.string()
    .min(5)
    .max(200)
    .pattern(/^[a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑ.,;:()'"-]+$/)
    .required()
    .messages({
      'string.base': 'La descripción debe ser una cadena.',
      'string.empty': 'La descripción no puede estar vacío.',
      'string.min': 'La descripción debe contener al menos 5 caracteres.',
      'string.max': 'La descripción no puede superar los 200 caracteres.',
      'string.pattern.base': 'La descripción contiene caracteres no permitidos.',
      'any.required': 'La descripción es requerido.'
    }),
  reason: Joi.string()
    .min(5)
    .max(200)
    .pattern(/^[a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑ.,;:()'"-]+$/)
    .required()
    .messages({
      'string.base': 'La razón debe ser una cadena.',
      'string.empty': 'La razón no puede estar vacío.',
      'string.min': 'La razón debe contener al menos 5 caracteres.',
      'string.max': 'La razón no puede superar los 200 caracteres.',
      'string.pattern.base': 'La razón contiene caracteres no permitidos.',
      'any.required': 'La razón es requerido.'
    }),
  treatment: Joi.string()
    .min(5)
    .max(500)
    .pattern(/^[a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑ.,;:()'"-]+$/)
    .required()
    .messages({
      'string.base': 'El tratamiento debe ser una cadena.',
      'string.empty': 'El tratamiento no puede estar vacío.',
      'string.min': 'El tratamiento debe contener al menos 5 caracteres.',
      'string.max': 'El tratamiento no puede superar los 500 caracteres.',
      'string.pattern.base': 'El tratamiento contiene caracteres no permitidos.',
      'any.required': 'El tratamiento es requerido.'
    })
})

export { diagnosticSchema }
