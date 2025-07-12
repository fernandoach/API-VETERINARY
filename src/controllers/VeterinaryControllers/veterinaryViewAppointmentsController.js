import { addMonths } from 'date-fns'
import { getAppointmentsByIdVeterinary } from '../../repositories/appointmentRepository/getAppointmentsByIdVeterinary.js'
import { getAuthIdUser } from '../../utils/getAuthIdUser.js'
import { dateMonthYearSchema } from '../../validations/dateMonthYearSchema.js'

async function veterinaryViewAppointmentsController (req, res) {
  try {
    // Obtener mes y año
    const { month, year } = req.query

    // Validar mes y año
    await dateMonthYearSchema.validateAsync({ month, year })

    // Obtener inicio de mes (>=) y fin de mes (<)
    const startDate = new Date(year, Number(month) - 1, 1)
    const endDate = addMonths(startDate, 1)

    // Obtener id de veterinario
    const idVeterinary = await getAuthIdUser(req)

    // Obtener citas
    const appointments = await getAppointmentsByIdVeterinary(idVeterinary, startDate, endDate)

    // Validar si no tiene citas en el rango
    if (appointments.length === 0) return res.status(200).send({ appointments: [] })

    return res.status(200).json({ appointments })
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message })
    }

    return res.status(400).json(error.details[0].message ? { message: error.details[0].message } : { message: 'Error inesperado.' })
  }
}

export { veterinaryViewAppointmentsController }
