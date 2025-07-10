import Joi from 'joi'

const uuidSchema = Joi.object({
  uuid: Joi.string()
    .guid()
    .required()
    .messages({
      'string.base': 'El ID debe ser una cadena.',
      'string.guid': 'El ID debe tener formato válido.',
      'any.required': 'El ID es requerido.',
      'string.empty': 'El ID no puede estar vacío.'
    })
})

export { uuidSchema }
