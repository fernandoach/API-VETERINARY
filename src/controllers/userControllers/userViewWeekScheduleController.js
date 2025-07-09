import { addWeeks } from 'date-fns'
import { getWeekScheduleByDate } from '../../repositories/appointmentRepository/getWeekScheduleByDate.js'
import { dateIdVeterinarySchema } from '../../validations/dateIdVeterinarySchema.js'

async function userViewWeekScheduleController (req, res) {
  try {
    // Obtener fecha y idVeterinario
    const { date, idVeterinary } = req.query
    if (!date) return res.status(400).json({ message: 'La fecha es requerida. ' })
    if (!idVeterinary) return res.status(400).json({ message: 'El veterinario es requerido. ' })

    // Validar formato de la fecha
    await dateIdVeterinarySchema.validateAsync({ date, idVeterinary })

    // Calcular semana que incluya el dia espcificado
    const startDate = new Date(date)
    const endDate = addWeeks(startDate, 1)

    // obtener startTime y endTime de todas las citas entre esas fechas
    const weekSchedule = await getWeekScheduleByDate(startDate, endDate, idVeterinary)
    // Retornar la lista en formato JSON
    return res.status(200).json({ weekSchedule })
  } catch (error) {
    console.error('Error al obtener horario semanal:', error)

    const message =
      error?.details?.[0]?.message ||
      (error instanceof Error ? error.message : 'Error inesperado al obtener el horario semanal.')

    return res.status(400).json({ message })
  }
}

export { userViewWeekScheduleController }
