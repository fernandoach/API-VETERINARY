
# 🐾 Sistema de gestión de citas para una veterinaria - API REST

Este proyecto es una API REST construida con Node.js y Express que permite a los usuarios gestionar citas veterinarias.

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

## Auth

<details>

<summary><strong>POST /auth/login</strong> - Login del usuario</summary>

#### Parameters

Nada

#### Request body

```json
{
  "email": "usuario@example.com",
  "password": "clave123"
}
```

#### Validaciones

- email
  - Mínimo 8, máximo 100 caracteres
  - Debe ser un correo válido de dominio: gmail.com, hotmail.com, yahoo.com
  - Ejemplo válido: usuario@gmail.com
- password
  - Entre 8 y 32 caracteres
  - Debe contener al menos una letra mayúscula y dos números
  - Ejemplo válido: MiClave12

#### Response

✅ **200 OK**

```json
{
  "role": "U"
}
```

🛑 **400 Bad Request**

```json
{
  "message": "Usuario y/o contraseña inválidos."
}
```

#### Cookies

En la respuesta se incluye la cookie `accessToken` con las siguientes características:

- `httpOnly`: `true`
- `secure`: `false` (en producción debe ser `true`)
- `sameSite`: `"Strict"`
- `maxAge`: 2 horas
  
#### Notas

- Si las credenciales son válidas, se guarda una cookie llamada `accessToken` con el token JWT.
- El valor de `role` puede ser:
  - `"U"`: Usuario
  - `"V"`: Veterinario
  - `"A"`: Administrador

</details>

<details>

<summary><strong>POST /auth/me</strong> - Obtener información del usuario autenticado</summary>

#### Parameters

Nada

#### Request body

Nada

#### Response

✅ **200 OK**

```json
{
  "idUser": "3b9a4b40-5c06-11f0-a584-0a002700000f",
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "role": "U"
}
```

🛑 **404 Bad Request**

```json
{
  "message": "Usuario no encontrado."
}
```

🛑 **400 Bad Request**

```json
{
  "message": "Error inesperado"
}
```

#### Notas

- El usuario debe estar autenticado. Se requiere la cookie `accessToken`.
- Este endpoint devuelve la información del usuario actualmente autenticado.

</details>

<details>

<summary><strong>PUT /auth/password</strong> - Cambiar contraseña del usuario autenticado</summary>

#### Parameters

Nada

#### Request body

```json
{
  "password": "NuevaClave123",
  "repassword": "NuevaClave123"
}
```

#### Validaciones

- La contraseña debe tener:
  - Entre 8 y 32 caracteres
  - Al menos una letra mayúscula
  - Al menos dos números
- Ambas contraseñas deben coincidir (password y repassword)

#### Response

✅ **200 OK**

```json
{
  "message": "Contraseña actualizada correctamente."
}
```

🛑 **400 Bad Request**

```json
{
  "message": "Las contraseñas no coinciden"
}
```

🛑 **400 Bad Request (otras validaciones)**

```json
{
  "message": "La contraseña debe contar con mínimo una letra mayuscula y dos números"
}
```

#### Notas

- El usuario debe estar autenticado. Se requiere la cookie `accessToken`.
- Este endpoint devuelve la información del usuario actualmente autenticado.

</details>


<details>

<summary><strong>DELETE /auth/logout</strong> - Cerrar sesión del usuario</summary>

#### Parameters

Nada

#### Request body

Nada

#### Response

✅ **200 OK**

```json
{
  "message": "Sesión terminada."
}
```

🛑 **400 Bad Request**

```json
{
  "message": "Error inesperado."
}
```
  
#### Notas

- El usuario debe estar autenticado. Se requiere la cookie `accessToken`.
- Esta ruta elimina la cookie accessToken para cerrar la sesión del usuario.
- La cookie se elimina con las mismas propiedades que fue definida (httpOnly, secure, sameSite).

</details>

## User

<details>

<summary><strong>POST /user/appointments</strong> - Crear una nueva cita médica</summary>

#### Parameters

Nada

#### Request body

```json
{
  "date": "2025-07-15",
  "startTime": "10:00",
  "reason": "Control general",
  "idVeterinary": "c0a80101-5c06-11f0-a584-0a002700000f",
  "idPet": "c0a80102-5c06-11f0-a584-0a002700000f"
}
```

#### Validaciones

- date:
  - Formato: yyyy-mm-dd
  - No puede ser anterior a la fecha actual
- startTime:
  - Formato: HH:MM (24h)
- reason:
  - Mínimo 5 y máximo 200 caracteres
  - Caracteres válidos: letras, números, tildes, signos básicos
- idVeterinary y idPet:
  - Deben tener formato UUID válido
- Reglas adicionales:
  - La fecha y hora deben estar al menos 2 horas en el futuro
  - No se puede reservar si el horario ya está ocupado
  - La mascota debe pertenecer al usuario autenticado

#### Response

✅ **200 OK**

```json
{
  "message": "Cita registrada para: 2025-07-15 de 10:00 a 11:00"
}
```

🛑 **400 Bad Request**

```json
{
  "message": "No puede reservar en una fecha pasada o con menos de 2 horas de anticipación."
}
```

🛑 **400 Bad Request (otras validaciones)**

```json
{
  "message": "Horario con el veterinario seleccionado no disponible."
}
```

🛑 **400 Bad Request (otras validaciones)**
```json
{
  "message": "Mascota o veterinario no existentes."
}
```


#### Notas

- El usuario debe estar autenticado. Se requiere la cookie `accessToken`.
- Las citas duran exactamente 1 hora.
- El estado inicial de la cita es "P" (pendiente).
- Solo puede crear citas en horarios no ocupados. 

</details>

<details>

<summary><strong>DELETE /user/appointments/:idAppointment</strong> - Cancelar una cita médica</summary>

#### Parameters

- `idAppointment` (path param): ID de la cita a cancelar

#### Request body

Nada

#### Validaciones

- La cita debe pertenecer al usuario autenticado.
- No se puede cancelar:
  - Si es el mismo día de la cita
  - Si la fecha ya pasó

#### Response

✅ **200 OK**

```json
{
  "message": "Cita cancelada con éxito."
}
```

🛑 **400 Bad Request - Mismo día de la cita**

```json
{
  "message": "No puede cancelar el mismo día de la cita."
}
```

🛑 **400 Bad Request - Fecha pasada**

```json
{
  "message": "No puede cancelar una cita de fecha pasada."
}
```

🛑 **400 Bad Request - Ya cancelada**
```json
{
  "message": "La cita ya fue cancelada previamente."
}
```

🛑 **404 Not Found**
```json
{
  "message": "Cita no encontrada o no pertenece al usuario."
}
```


#### Notas

- El usuario debe estar autenticado. Se requiere la cookie `accessToken`.
- El sistema verifica que la cita sea propiedad del usuario.
- Esta operación solo cancela la cita, no la elimina de la base de datos.

</details>

<details>

<summary><strong>GET /user/appointments</strong> - Obtener todas las citas del usuario autenticado</summary>

#### Parameters

Nada

#### Request body

Nada

#### Response

✅ **200 OK**

```json
{
  "appointments": [
    {
      "idAppointment": "a1b2c3d4-1234-5678-9012-abcdef123456",
      "date": "2025-07-15",
      "startTime": "10:00",
      "endTime": "11:00",
      "reason": "Control general",
      "state": "P",
      "idPet": "aabbccdd-eeee-ffff-aaaa-bbbbccccdddd",
      "idVeterinary": "99887766-5544-3322-1100-aabbccddeeff"
    }
    // ...
  ]
}
```

🛑 **400 Bad Request**

```json
{
  "message": "Error inesperado"
}
```

#### Notas

- El usuario debe estar autenticado. Se requiere la cookie `accessToken`.
- Devuelve todas las citas que le pertenecen al usuario autenticado, incluyendo futuras y pasadas, ordenadas desde la más antigua.
- El campo state puede tener valores como:
  - P: Pendiente
  - C: Completado
  - X: Cancelado

</details>

<details>

<summary><strong>/user/appointments/week?date=?&idVeterinary=?</strong> - Obtener horario semanal de un veterinario</summary>

#### Parameters

- `date`: Fecha de inicio de la semana (formato `yyyy-mm-dd`)
- `idVeterinary`: ID del veterinario (UUID)

#### Request body

Nada

#### Validaciones

- date:
  - Obligatorio
  - Formato: yyyy-mm-dd
  - No puede ser una fecha pasada
- idVeterinary:
  - Obligatorio
  - Debe tener formato UUID

#### Response

✅ **200 OK**

```json
{
  "weekSchedule": [
    {
      "date": "2025-07-15",
      "startTime": "10:00:00",
      "endTime": "11:00:00"
    },
    {
      "date": "2025-07-15",
      "startTime": "11:00:00",
      "endTime": "12:00:00"
    }
    // ...
  ]
}
```

🛑 **400 Bad Request - fecha o veterinario inválido o pasado**

```json
{
  "message": "La fecha es requerida."
}
```

```json
{
  "message": "La fecha no puede ser anterior a hoy"
}
```
```json
{
  "message": "El ID del veterinario debe tener formato válido."
}
```

🛑 **400 Bad Request - error general**

```json
{
  "message": "Error inesperado al obtener el horario semanal."
}
```

#### Notas

- El usuario debe estar autenticado. Se requiere la cookie `accessToken`.
- Este endpoint permite visualizar la disponibilidad semanal del veterinario desde una fecha específica.
- El sistema retorna únicamente citas pendientes y completadas `(state = 'P' || 'C')`.
- El horario está ordenado por fecha y hora de inicio.

</details>

<details>

<summary><strong>GET /appointments/:idAppointment/diagnostic</strong> - Obtener diagnóstico asociado a una cita</summary>

#### Parameters

- `idAppointment` (path param): ID de la cita para consultar el diagnóstico

#### Request body

Nada

#### Validaciones

- idAppointment:
  - Obligatorio
  - Debe tener formato UUID

#### Response

✅ **200 OK**

```json
{
  "idDiagnostic": "c5d83e2c-0c0a-4bfa-9db0-d7a3e5a0c123",
  "date": "2025-07-09",
  "description": "Inflamación moderada en oído izquierdo",
  "reason": "Revisión por molestias",
  "treatment": "Aplicar gotas otológicas cada 12 horas por 7 días",
  "idAppointment": "a1b2c3d4-1234-5678-9012-abcdef123456"
}
```

🛑 **400 Bad Request**

```json
{
  "message": "ID de la cita es requerido."
}
```

🛑 **403 Forbidden**

```json
{
  "message": "Sin autorización."
}
```

🛑 **404 Not Found – diagnóstico no registrado aún**

```json
{
  "message": "Aún no hay diagnostico para la cita."
}
```

🛑 **404 Not Found – cita no encontrada o ajena**

```json
{
  "message": "Sin autorización."
}
```

#### Notas

- El usuario debe estar autenticado. Se requiere la cookie `accessToken`.
- Esta ruta retorna el diagnóstico relacionado a una cita si:
  - La cita le pertenece al usuario autenticado.
  - La cita ya tiene diagnóstico registrado.
- Si no hay diagnóstico aún, se retorna 404 con mensaje claro.
- Esta ruta no retorna una lista, sino el primer (y único) diagnóstico de la cita.

</details>

<details>

<summary><strong>GET /user/pets</strong> - Obtener todas las mascotas del usuario autenticado</summary>

#### Parameters

Nada

#### Request body

Nada

#### Response

✅ **200 OK**

```json
{
  "pets": [
    {
      "idPet": "aabbccdd-eeee-ffff-aaaa-bbbbccccdddd",
      "name": "Max",
      "species": "Perro",
      "race": "Labrador",
      "gender": "M",
      "weight": 22.5,
      "birthday": "2021-05-10",
      "idUser": "99887766-5544-3322-1100-aabbccddeeff"
    }
    // ...
  ]
}
```

🛑 **400 Bad Request**

```json
{
  "message": "Error inesperado"
}
```

#### Notas

- El usuario debe estar autenticado. Se requiere la cookie `accessToken`.
- Este endpoint devuelve todas las mascotas que le pertenecen al usuario autenticado.
- Los resultados están ordenados alfabéticamente por el nombre de la mascota.
- El campo `gender` puede ser `'M'` (Macho) o `'H'` (Hembra).

</details>

<details>

<summary><strong>GET /user/veterinarians</strong> - Obtener lista de veterinarios disponibles</summary>

#### Parameters

Nada

#### Request body

Nada

#### Response

✅ **200 OK**

```json
{
  "veterinarians": [
    {
      "firstname": "Lucía",
      "lastname": "Mendoza",
      "gender": "H",
      "birthday": "1990-03-15",
      "email": "lucia.mendoza@gmail.com"
    },
    {
      "firstname": "Carlos",
      "lastname": "Rojas",
      "gender": "M",
      "birthday": "1985-11-22",
      "email": "carlos.rojas@hotmail.com"
    }
    // ...
  ]
}
```

🛑 **400 Bad Request**

```json
{
  "message": "Error inesperado al obtener la lista de veterinarios."
}
```

#### Notas

- El usuario debe estar autenticado. Se requiere la cookie `accessToken`.
- Este endpoint devuelve una lista con los datos públicos de todos los usuarios con rol de veterinario (`'V'`).
- Los resultados están ordenados alfabéticamente por nombre (`firstname`).
- La fecha de nacimiento (`birthday`) está en formato `yyyy-mm-dd`.

</details>

---

## ✍️ Autor

Fernz