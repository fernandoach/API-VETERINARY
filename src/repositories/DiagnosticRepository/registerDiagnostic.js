import { createConnection } from '../../config/databaseConnection.js'

async function registerDiagnostic (date, description, reason, treatment, idAppointment) {
  let connection

  try {
    connection = await createConnection()

    const sql = `
      INSERT INTO Diagnostic (
        idDiagnostic,
        date,
        description,
        reason,
        treatment,
        idAppointment
      ) VALUES (UUID(), ?, ?, ?, ?, ?);
    `

    const [result] = await connection.execute(sql, [
      date,
      description,
      reason,
      treatment,
      idAppointment
    ])

    return result
  } catch (error) {
    switch (error.code) {
      case 'ER_DUP_ENTRY':
        throw new Error('Ya existe un registro duplicado (diagnóstico con ID repetido).')
      case 'ER_NO_SUCH_TABLE':
        throw new Error('La tabla "Diagnostic" no existe en la base de datos.')
      case 'ER_NO_REFERENCED_ROW_2':
        throw new Error('LA cita no existen.')
      default:
        throw new Error('No se pudo registrar el diagnóstico.')
    }
  } finally {
    if (connection) await connection.release()
  }
}

export { registerDiagnostic }
