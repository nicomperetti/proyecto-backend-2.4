# Plataforma de Eventos e Inscripciones — Pre-entrega 4

API REST con Node.js, Express, MongoDB/Mongoose, bcrypt, JWT y **Passport.js**. Esta entrega refactoriza la autenticación de la Pre-entrega 3: conserva rutas, respuestas y cookies, pero centraliza registro, login y usuario actual mediante estrategias Passport.

## Instalación y ejecución

Requiere Node.js y MongoDB.

```bash
npm install
cp .env.example .env
npm run dev
```

Para producción: `npm start`. Configurá `.env` localmente; **no subir `.env`, `node_modules` ni credenciales**.

## Variables de entorno

| Variable | Obligatoria | Descripción |
|---|---|---|
| `PORT` | No | Puerto HTTP (por defecto `8080`) |
| `MONGO_URL` | Sí para conectar | URI de MongoDB |
| `JWT_SECRET` | Sí | Secreto para firmar/verificar JWT |
| `JWT_EXPIRES_IN` | No | Duración del JWT (por defecto `1h`) |
| `NODE_ENV` | No | `development` o `production`; en producción la cookie usa `secure: true` |
| `BCRYPT_SALT_ROUNDS` | No | Rondas bcrypt, entre 10 y 15 (por defecto `10`) |

## Arquitectura de autenticación

- `src/app.js`: configura Express, cookies y `passport.initialize()`.
- `src/config/passport.config.js`: registra las estrategias `register`, `login` y `current`. Las estrategias no están mezcladas con `app.js`.
- `src/routes/sessions.router.js`: delega en `passport.authenticate(...)`.
- `src/controllers/sessions.controller.js`: arma las respuestas; luego de login genera el JWT y establece la cookie `currentUser` HTTP Only. Passport **no** genera el JWT.
- `src/services/sessions.service.js`: lógica de dominio reutilizada por las estrategias de registro y login.

El registro valida campos y email, normaliza email/nombres, aplica bcrypt, verifica unicidad y deja el rol público por defecto (`user`). El login devuelve un error genérico para credenciales inválidas. `current` lee y valida el JWT desde la cookie y expone únicamente `{ id, email, role }`.

La estructura permite agregar estrategias OAuth como Google o GitHub en `passport.config.js` sin modificar `app.js`; también facilita sumar autorización por roles y protección de rutas en futuras iteraciones.

## Rutas

| Método | Ruta | Descripción | Autenticación |
|---|---|---|---|
| GET | `/api/health` | Estado del servidor | No |
| GET | `/api/events` | Lista inicial de eventos | No |
| POST | `/api/sessions/register` | Registra usuario | Passport `register` |
| POST | `/api/sessions/login` | Autentica y establece cookie JWT | Passport `login` |
| GET | `/api/sessions/current` | Devuelve usuario autenticado | Passport `current` |
| POST | `/api/sessions/logout` | Elimina cookie | No |

### Contrato de la API (se conserva de M3)

**Registro** — `POST /api/sessions/register`

```json
{"first_name":"Ana","last_name":"Pérez","email":"Ana@Mail.com ","password":"Secreta123"}
```

Respuesta `201`:

```json
{"status":"success","payload":{"id":"665f2a...","first_name":"Ana","last_name":"Pérez","email":"ana@mail.com","role":"user"}}
```

El rol enviado por el cliente se ignora. Password nunca se devuelve.

**Login** — `POST /api/sessions/login`

```json
{"email":"ana@mail.com","password":"Secreta123"}
```

Respuesta `200`:

```json
{"status":"success","message":"Login correcto"}
```

Establece `currentUser` con `httpOnly: true`, `sameSite: lax`, `maxAge: 3600000` y `secure: true` solo en producción. Credenciales inválidas responden siempre `401`:

```json
{"status":"error","message":"Credenciales inválidas"}
```

**Current** — `GET /api/sessions/current`

Con cookie válida, respuesta `200`:

```json
{"status":"success","payload":{"id":"665f2a...","email":"ana@mail.com","role":"user"}}
```

Sin cookie, token manipulado o expirado: `401`:

```json
{"status":"error","message":"No autenticado"}
```

**Logout** — `POST /api/sessions/logout`

```json
{"status":"success","message":"Sesión cerrada"}
```

## Pruebas manuales con curl

```bash
# Registro
curl -i -X POST http://localhost:8080/api/sessions/register -H "Content-Type: application/json" -d '{"first_name":"Ana","last_name":"Pérez","email":"Ana@Mail.com ","password":"Secreta123"}'

# Login y guardar cookie
curl -i -c cookies.txt -X POST http://localhost:8080/api/sessions/login -H "Content-Type: application/json" -d '{"email":"ana@mail.com","password":"Secreta123"}'

# Current (200)
curl -i -b cookies.txt http://localhost:8080/api/sessions/current

# Logout
curl -i -b cookies.txt -c cookies.txt -X POST http://localhost:8080/api/sessions/logout

# Current (401)
curl -i -b cookies.txt http://localhost:8080/api/sessions/current
```

## Checklist previo a la entrega

- [ ] Registro exitoso; email normalizado y rol `user`.
- [ ] Registro con email duplicado: `409`.
- [ ] Campos inválidos: `400`.
- [ ] Login correcto: `200` y cookie `currentUser` HTTP Only.
- [ ] Email inexistente, password incorrecta o campos de login inválidos: mismo `401` genérico.
- [ ] `/current` con cookie válida: `200`, solo `{ id, email, role }`.
- [ ] `/current` sin cookie, token manipulado o expirado: `401`.
- [ ] Logout y luego `/current`: `401`.

## Estructura relevante

```text
src/
├── app.js
├── server.js
├── config/
│   ├── db.js
│   ├── env.config.js
│   └── passport.config.js
├── routes/
│   ├── events.router.js
│   └── sessions.router.js
├── controllers/
│   ├── events.controller.js
│   └── sessions.controller.js
├── services/sessions.service.js
├── repositories/users.repository.js
├── dao/users.dao.js
├── models/User.js
└── utils/{hash.js,jwt.js,app-error.js}
```
