import { editPetForIdPet } from '../../repositories/petRepository/editPetForIdPet.js'
import { getIdUserForDni } from '../../repositories/userRepository/getIdUserForDni.js'
import { petSchema } from '../../validations/petSchema.js'

async function veterinaryEditPetController (req, res) {
  try {
    // Extraer los datos de la mascota del cuerpo de la solicitud
    const idPet = req.params.idPet
    if (!idPet) return res.status(400).send({ message: 'La mascota no existe.' })
    const { name, species, race, gender, weight, birthday, dni } = req.body

    // Validar datos de la mascota usando Joi
    await petSchema.validateAsync({ name, species, race, gender, weight, birthday, dni })

    // Obtener el ID del dueño de la mascota usando su DNI
    const idUser = await getIdUserForDni(dni)
    if (!idUser) return res.status(400).send({ message: 'El usuario no existe.' })

    // TODO: validar que no sean los mismos datos para evitar edición innecesaria

    // Intentar editar la mascota con los nuevos datos
    const queryResult = await editPetForIdPet(idPet, name, species, race, gender, weight, birthday, idUser)

    // Verificar si la actualización se realizó correctamente
    if (!queryResult) {
      return res.status(400).send({ message: 'No se pudo editar la mascota.' })
    }

    // Respuesta exitosa
    return res.send({ message: 'Información de mascota editada correctamente.' })
  } catch (error) {
    // Manejo de errores de validación o del servidor
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message })
    }
    return res.status(400).json(
      error.details?.[0]?.message
        ? { message: error.details[0].message }
        : { message: 'Error inesperado. ' }
    )
  }
}

export { veterinaryEditPetController }
