import Joi from 'joi'

const dateIdVeterinarySchema = Joi.object({
  date: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .custom((value, helpers) => {
      const [year, month, day] = value.split('-').map(Number)
      const selectedDate = new Date(year, month - 1, day)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (selectedDate < today) {
        return helpers.error('any.custom', { message: 'La fecha no puede ser anterior a hoy' })
      }
      return value
    })
    .messages({
      'string.base': 'La fecha debe ser una cadena en formato yyyy-mm-dd',
      'string.pattern.base': 'La fecha debe tener el formato yyyy-mm-dd',
      'any.custom': '{{#message}}',
      'any.required': 'La fecha es requerida',
      'string.empty': 'La fecha no puede estar vacía.'
    }),
  idVeterinary: Joi.string()
    .guid()
    .required()
    .messages({
      'string.base': 'El ID del veterinario debe ser una cadena.',
      'string.guid': 'El ID del veterinario debe tener formato válido.',
      'any.required': 'El ID del veterinario es requerido.',
      'string.empty': 'El veterinario no puede estar vacío.'
    })
})

export { dateIdVeterinarySchema }
