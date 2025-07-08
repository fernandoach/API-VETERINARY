import { compareAsc } from 'date-fns'
import { petSchema } from '../../validations/petSchema.js'
import { getIdUserForDni } from '../../repositories/userRepository/getIdUserForDni.js'
import { registerPet } from '../../repositories/petRepository/registerPet.js'

async function veterinaryCreatePetController (req, res) {
  try {
    // Extraer datos del cuerpo de la solicitud
    const { name, species, race, gender, weight, birthday, dni } = req.body

    // Validar formato y requisitos de los datos usando Joi
    await petSchema.validateAsync({ name, species, race, gender, weight, birthday, dni })

    // Verificar que la fecha de nacimiento no sea futura
    const compareDate = compareAsc(new Date(birthday), new Date())
    if (compareDate === 1) {
      return res.status(400).send({ message: 'La fecha de nacimiento no puede ser una fecha posterior a hoy' })
    }

    // Buscar el ID del propietario mediante el DNI
    const idOwner = await getIdUserForDni(dni)
    if (idOwner === -1) {
      return res.status(400).send({ message: 'El DNI debe ser válido' })
    }

    // Registrar la mascota asociada al usuario encontrado
    const insertResult = await registerPet(name, species, race, gender, weight, birthday, idOwner)

    // Verificar si el registro fue exitoso
    return insertResult
      ? res.send({ message: 'Registrado con éxito' })
      : res.status(400).send({ message: 'No se pudo registrar la mascota.' })
  } catch (error) {
    // Manejo de errores de validación y errores inesperados
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message })
    }
    return res.status(400).json(
      error.details?.[0]?.message
        ? { message: error.details[0].message }
        : { message: 'Error inesperado' }
    )
  }
}

export { veterinaryCreatePetController }
