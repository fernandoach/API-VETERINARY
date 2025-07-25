import { getPetsByIdUser } from '../../repositories/petRepository/getPetsByIdUser.js'
import { validateExistUser } from '../../repositories/userRepository/validateExistUser.js'

async function veterinaryViewPetsController (req, res) {
  try {
    const idUser = req.params.idUser
    console.log(idUser)

    const validateUser = await validateExistUser(idUser)
    if (validateUser === false) {
      return res.status(400).send({ message: 'El usuario no existe.' })
    }

    const myPets = await getPetsByIdUser(idUser)

    if (myPets.length === 0) return res.status(200).send({ pets: [] })

    return res.send({ pets: myPets })
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message })
    }

    return res.status(400).json(error.details[0].message ? { message: error.details[0].message } : { message: 'Error inesperado.' })
  }
}

export { veterinaryViewPetsController }
