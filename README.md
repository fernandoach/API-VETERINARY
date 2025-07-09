
# 🐾 Veterinary Appointment System - API REST

Este proyecto es una API REST construida con Node.js y Express que permite a los usuarios gestionar citas veterinarias. Esta primera versión del `README` documenta únicamente las rutas relacionadas al **usuario**.

---

## 🔐 Autenticación
La autenticación se realiza mediante JWT, enviado como cookie segura (`HttpOnly`). El token se genera en el login y es necesario para acceder a rutas protegidas.

## 🛠️ Tecnologías

- Express.js
- JWT (Autenticación)
- MySQL (Base de datos)
- Joi (Validación de entradas)
- date-fns (Manejo de fechas)

---

## 🧑 Registro de Usuario

### `POST /user`

Registra un nuevo usuario.

**Body JSON:**

```json
{
  "firstname": "Juan",
  "lastname": "Pérez",
  "gender": "M",
  "birthday": "2000-01-01",
  "dni": "12345678",
  "telephone": "987654321",
  "email": "juan@example.com",
  "password": "123456",
  "repassword": "123456"
}
```

---

## 📅 Appointments

### `POST /user/appointments`

Crea una nueva cita médica. Requiere autenticación.

**Body JSON:**

```json
{
  "date": "2025-08-01",
  "startTime": "10:00",
  "reason": "Consulta general",
  "idVeterinary": "uuid",
  "idPet": "uuid"
}
```

### `DELETE /user/appointments/:idAppointment`

Cancela una cita. Requiere autenticación.

### `GET /user/appointments`

Obtiene todas las citas del usuario autenticado.

### `GET /user/appointments/week?date=2025-08-01&idVeterinary=123123123`

Devuelve la agenda semanal de citas a partir de la fecha proporcionada. Requiere autenticación.

---

## 🩺 Diagnóstico

### `GET /user/appointments/:id/diagnostic`

Devuelve el diagnóstico asociado a una cita específica. Requiere autenticación.

---

## 🐾 Mascotas

### `GET /user/pets`

Devuelve las mascotas del usuario autenticado.

---

## 👨‍⚕️ Veterinarios

### `GET /user/veterinarians`

Devuelve el listado de veterinarios disponibles.

---

## ✍️ Autor

Fernz