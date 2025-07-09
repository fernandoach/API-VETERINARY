
# 🐾 Veterinary Appointment System - API REST

Este proyecto es una API REST construida con Node.js y Express que permite a los usuarios gestionar citas veterinarias. Esta primera versión del `README` documenta únicamente las rutas relacionadas al **usuario**.

## 🔐 Autenticación
La autenticación se realiza mediante JWT, enviado como cookie segura (`HttpOnly`). El token se genera en el login y es necesario para acceder a rutas protegidas.

---

## 📦 Endpoints de Usuario

### 📌 POST `/api/user/register`
Registra un nuevo usuario.

**Body:**
```json
{
  "firstname": "Juan",
  "lastname": "Pérez",
  "gender": "M",
  "birthday": "1995-05-20",
  "dni": "12345678",
  "telephone": "987654321",
  "email": "juan@example.com",
  "password": "password123",
  "repassword": "password123"
}
```

---

### 📌 POST `/api/user/create-appointment`
Crea una nueva cita para una mascota.

🔒 Requiere autenticación por cookie.

**Body:**
```json
{
  "date": "2025-08-15",
  "startTime": "09:00",
  "reason": "Consulta general",
  "idVeterinary": "uuid-del-veterinario",
  "idPet": "uuid-de-la-mascota"
}
```

---

### 📌 PUT `/api/user/cancel-appointment`
Cancela una cita futura del usuario autenticado.

🔒 Requiere autenticación por cookie.

**Body:**
```json
{
  "idAppointment": "uuid-de-la-cita"
}
```

---

### 📌 GET `/api/user/pets`
Obtiene todas las mascotas del usuario autenticado.

🔒 Requiere autenticación por cookie.

---

### 📌 GET `/api/user/appointments`
Lista todas las citas del usuario autenticado.

🔒 Requiere autenticación por cookie.

---

### 📌 GET `/api/user/diagnostic?idAppointment=uuid`
Obtiene el diagnóstico de una cita específica.

🔒 Requiere autenticación por cookie.

---

### 📌 GET `/api/user/veterinarians`
Lista todos los veterinarios disponibles.

🔒 Requiere autenticación por cookie.

---

### 📌 GET `/api/user/appointments/week?date=YYYY-MM-DD&idVeterinary=uuid`
Obtiene las citas de 7 días a partir de una fecha específica para un veterinario.

🔒 Requiere autenticación por cookie.

**Ejemplo:**
```
/api/user/appointments/week?date=2025-10-31&idVeterinary=uuid-vet
```

---

## 🛡️ Estado del módulo de usuarios

✅ Registro  
✅ Login con cookie  
✅ Crear, cancelar y listar citas  
✅ Diagnóstico por cita  
✅ Ver mascotas  
✅ Ver veterinarios  
✅ Ver disponibilidad semanal (con filtro por veterinario)

---

## 🚀 Tecnologías usadas
- Node.js + Express
- MySQL
- JWT
- Joi (validaciones)
- cookie-parser
- date-fns

---

## 📂 Estructura del proyecto (parcial)
```
/controllers
  /userControllers
/repositories
  /userRepository
  /appointmentRepository
/middlewares
/utils
/validations
```

---

## 🧪 Autor
Miguel Fernando Aliaga Chacón  
fernandoach333@gmail.com
