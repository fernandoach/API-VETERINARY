import Joi from 'joi'

const appointmentSchema = Joi.object({
  date: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .custom((value, helpers) => {
      const [year, month, day] = value.split('-').map(Number)
      const selectedDate = new Date(year, month - 1, day)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (selectedDate < today) {
        return helpers.error('date.min')
      }
      return value
    })
    .messages({
      'string.base': 'La fecha debe ser una cadena en formato yyyy-mm-dd',
      'string.pattern.base': 'La fecha debe tener el formato yyyy-mm-dd',
      'date.min': 'La fecha no puede ser anterior a hoy',
      'any.required': 'La fecha es requerida'
    }),
  startTime: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/) // Formato HH:MM
    .required()
    .messages({
      'string.base': 'La hora de inicio debe ser una cadena.',
      'string.pattern.base': 'La hora de inicio debe tener el formato HH:MM',
      'any.required': 'La hora de inicio es requerida.'
    }),
  reason: Joi.string()
    .min(5)
    .max(200)
    .pattern(/^[a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑ.,;:()'"-]+$/)
    .required()
    .messages({
      'string.base': 'El motivo debe ser una cadena.',
      'string.empty': 'El motivo no puede estar vacío.',
      'string.min': 'El motivo debe contener al menos 5 caracteres.',
      'string.max': 'El motivo no puede superar los 200 caracteres.',
      'string.pattern.base': 'El motivo contiene caracteres no permitidos.',
      'any.required': 'El motivo es requerido.'
    }),
  state: Joi.string()
    .valid('P', 'C', 'X')
    .default('p')
    .messages({
      'string.base': 'El estado debe ser una cadena.',
      'any.only': 'El estado debe ser P (pendiente), C (completado) o X (cancelado).'
    }),
  idVeterinary: Joi.string()
    .guid()
    .required()
    .messages({
      'string.base': 'El ID del veterinario debe ser una cadena.',
      'string.guid': 'El ID del veterinario debe tener formato válido.',
      'any.required': 'El ID del veterinario es requerido.'
    }),
  idPet: Joi.string()
    .guid()
    .required()
    .messages({
      'string.base': 'El ID de la mascota debe ser una cadena de texto.',
      'string.guid': 'El ID de la mascota debe tener formato válido.',
      'any.required': 'El ID de la mascota es requerido.'
    })
})

export { appointmentSchema }
