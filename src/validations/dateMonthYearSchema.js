import Joi from 'joi'

const dateMonthYearSchema = Joi.object({
  month: Joi.number()
    .integer()
    .min(1)
    .max(12)
    .required()
    .messages({
      'number.base': 'El mes debe ser un número.',
      'number.integer': 'El mes debe ser un número entero.',
      'number.min': 'El mes debe ser mayor o igual a 1.',
      'number.max': 'El mes no puede ser mayor a 12.',
      'any.required': 'El mes es requerido.'
    }),
  year: Joi.number()
    .integer()
    .min(2000)
    .max(new Date().getFullYear() + 10)
    .required()
    .messages({
      'number.base': 'El año debe ser un número.',
      'number.integer': 'El año debe ser un número entero.',
      'number.min': 'El año no puede ser menor a 2000.',
      'number.max': `El año no puede ser mayor a ${new Date().getFullYear() + 10}.`,
      'any.required': 'El año es requerido.'
    })
})

export { dateMonthYearSchema }
