
# 🐾 Sistema de gestión de citas para una veterinaria - API REST

Este proyecto es una API REST construida con Node.js y Express que permite a los usuarios gestionar citas veterinarias.

## ENDPOINTS

### Auth

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

### Usuario

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

### Veterinario

<details>

<summary><strong>POST /veterinary/appointments</strong> - Registrar una nueva cita</summary>

#### Parameters

Nada

#### Request body

```json
{
  "date": "2025-07-10",
  "startTime": "10:00",
  "reason": "Vacunación anual",
  "idPet": "a1b2c3d4-1234-5678-9012-abcdef123456"
}
```

#### Validaciones

- date:
  - Obligatorio
  - Formato yyyy-mm-dd
  - No puede ser fecha pasada
- startTime:
  - Obligatorio
  - Formato HH:mm
- reason:
  - Obligatorio
  - 5 a 200 caracteres
  - Solo caracteres alfanuméricos y algunos signos de puntuación
- idPet:
  - Obligatorio
  - UUID válido
- Solo se permite crear citas con al menos 2 horas de anticipación
- Se verifica que no exista otra cita en la misma franja horaria con el mismo veterinario
- Solo usuarios con rol veterinario ('V') pueden acceder a esta ruta.

#### Response

✅ **200 OK**

```json
{
  "message": "Cita registrada para el 2025-07-10 de 10:00 a 11:00"
}
```

🛑 **400 Bad Request – fecha inválida o pasada**

```json
{
  "message": "No puede reservar en una fecha pasada o con menos de 2 horas de anticipación."
}
```

🛑 **400 Bad Request – horario ocupado**

```json
{
  "message": "Horario con el veterinario seleccionado no disponible."
}
```

🛑 **400 Bad Request – error de validación**

```json
{
  "message": "La fecha debe tener el formato yyyy-mm-dd"
}
```

#### Notas

- El veterinario debe estar autenticado. Se requiere la cookie `accessToken`.
- La cita se agenda por una hora desde la hora de inicio.
- El ID del veterinario se infiere automáticamente desde el token JWT.
- El campo state siempre se registra como 'P' (pendiente).
- El sistema previene que dos citas se superpongan en el mismo horario para el mismo veterinario.

</details>

<details>

<summary><strong>DELETE /veterinary/appointments/:idAppointment</strong> - Cancelar cita</summary>

#### Parameters

- idAppointment: ID de la cita a cancelar (uuid)

#### Request body

Nada

#### Validaciones

- idAppointment:
  - Obligatorio
  - Debe tener formato UUID
- La cita debe pertenecer al veterinario autenticado
- No se puede cancelar:
  - Si la cita es el mismo día
  - Si la cita ya ocurrió
  - Si la cita ya fue cancelada o completada
- Solo usuarios con rol veterinario ('V') pueden acceder a esta ruta.


#### Response

✅ **200 OK**

```json
{
  "message": "Cita cancelada con éxito."
}
```

🛑 **400 Bad Request – mismo día o cita pasada**

```json
{
  "message": "No puede cancelar el mismo día de la cita."
}
```

🛑 **400 Bad Request – cita ya cancelada o completada**

```json
{
  "message": "La cita ya está cancelada o fue completada."
}
```

🛑 **400 Bad Request – id no proporcionado**

```json
{
  "message": "ID de cita no proporcionado."
}
```

🛑 **403 Forbidden – cita no pertenece al veterinario**

```json
{
  "message": "No tienes permiso para cancelar esta cita."
}
```

🛑 **404 Not Found – cita no existe**

```json
{
  "message": "No se encontró la cita."
}
```

#### Notas

- El veterinario debe estar autenticado. Se requiere la cookie `accessToken`.
- Esta operación no elimina la cita, solo cambia su estado a cancelado.
- Las citas solo pueden ser canceladas si:
  - Pertenecen al veterinario autenticado.
  - No son del mismo día ni pasadas.
- No es posible cancelar citas ya completadas.

</details>

<details>

<summary><strong>PUT /veterinary/appointments/:idAppointment</strong> – Editar cita</summary>

#### Parameters

- idAppointment: ID de la cita a cancelar (uuid)

#### Request body

```json
{
  "date": "2025-07-15",
  "startTime": "15:00",
  "reason": "Control general anual",
  "state": "P",
  "idPet": "abcd1234-ab12-cd34-ef56-abcdef123456"
}
```

#### Validaciones

- idAppointment:
  - Obligatorio en la URL
  - Debe tener formato UUID válido
- date:
  - Requerido
  - Formato yyyy-mm-dd
  - No puede ser una fecha pasada
- startTime:
  - Requerido
  - Formato HH:MM en 24h
- reason:
  - Requerido
  - Entre 5 y 200 caracteres
  - Solo caracteres válidos
- state:
  - Opcional
  - Uno de: "P" (pendiente), "C" (completado), "X" (cancelado)
- idPet:
  - Requerido
  - Formato UUID válido
- La nueva fecha y hora no pueden ser iguales a la original.
- El nuevo horario no debe estar ocupado.
- Solo usuarios con rol veterinario ('V') pueden acceder a esta ruta.

#### Response

✅ **200 OK**

```json
{
  "message": "Cita editada correctamente."
}
```

🛑 **400 Bad Request – ID no proporcionado**

```json
{
  "message": "ID de cita no proporcionado."
}
```

🛑 **400 Bad Request – sin autorización**

```json
{
  "message": "Sin autorización."
}
```

🛑 **400 Bad Request – cita no modificada**

```json
{
  "message": "No se pudo modificar la cita."
}
```

🛑 **400 Bad Request – misma hora**

```json
{
  "message": "La fecha y hora deben ser diferentes al valor original."
}
```

🛑 **400 Bad Request – horario no disponible**

```json
{
  "message": "Horario con el veterinario seleccionado no disponible."
}
```

🛑 **400 Bad Request – error de validación**

```json
{
  "message": "La fecha debe tener el formato yyyy-mm-dd"
}
```

#### Notas

- Solo los veterinarios autenticados pueden modificar citas.
- Se requiere la cookie `accessToken` con un token válido.
- Pueden editarse citas que ocurran el mismo día o en fechas futuras, pero no aquellas de días anteriores.
- La edición solo se ejecuta si todos los datos son válidos y no hay conflicto de horario.

</details>

<details>

<summary><strong>GET /veterinary/appointments</strong> - Ver citas agendadas del veterinario por mes</summary>

#### Parameters

- month (requerido): número de mes (1–12)
- year (requerido): número de año (desde 2000 hasta el actual +10)

#### Request body

Nada

### Validaciones

- El parámetro month:
  - Es obligatorio
  - Debe ser un número entero
  - Debe estar entre 1 y 12
  - Si no cumple, retorna mensaje como: "El mes debe ser un número."
- El parámetro year:
  - Es obligatorio
  - Debe ser un número entero
  - No puede ser menor a 2000
  - No puede ser mayor a AÑO_ACTUAL + 10
  - Si no cumple, retorna mensaje como: "El año no puede ser menor a 2000."
- Solo usuarios con rol veterinario ('V') pueden acceder a esta ruta.
- Se requiere autenticación mediante cookie `accessToken`.

#### Response

✅ **200 OK**

```json
{
  "appointments": [
    {
      "idAppointment": "abcd1234-ab12-cd34-ef56-abcdef123456",
      "date": "2025-07-14",
      "startTime": "14:00",
      "endTime": "15:00",
      "reason": "Vacunación anual",
      "name": "Luna",
      "species": "Perro",
      "race": "Labrador",
      "state": "P"
    },
    // ...
  ]
}
```
✅ **200 OK (sin citas)**

```json
{
  "appointments": []
}
```

🛑 **400 Bad Request – Parámetro inválido**

```json
{
  "message": "El mes debe ser un número."
}
```
🛑 **403 Forbidden**

```json
{
  "message": "Sin autorización."
}
```

#### Notas

- Solo veterinarios autenticados pueden acceder.
- Se requiere la cookie `accessToken` con un token válido.
- Devuelve las citas programadas que no están canceladas (state <> 'X') para el mes y año especificado.
- El resultado está ordenado por fecha y hora de inicio ascendente.

</details>

---

## ✍️ Autor

Fernz