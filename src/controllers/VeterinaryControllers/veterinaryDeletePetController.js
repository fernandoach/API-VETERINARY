import { deletePetForIdPet } from '../../repositories/petRepository/deletePetForIdPet.js'
import { verifyPetExistByIdPet } from '../../repositories/petRepository/verifyPetExistByIdPet.js'
import { uuidSchema } from '../../validations/uuidSchema.js'

async function veterinaryDeletePetController (req, res) {
  try {
    const idPet = req.params.idPet

    if (!idPet) {
      return res.status(400).send({ message: 'Debe especificar la mascota a eliminar.' })
    }

    await uuidSchema.validateAsync({ uuid: idPet })

    await verifyPetExistByIdPet(idPet)

    await deletePetForIdPet(idPet)

    return res.send({ message: 'Mascota eliminada correctamente.' })
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

export { veterinaryDeletePetController }
