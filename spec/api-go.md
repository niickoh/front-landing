Entendido. Aquí está el contenido completo para que lo copies, pegues en un archivo y lo descargues como .md:

Code
# API de Notificaciones - Especificación Técnica

## 1. Descripción General

API minimal para enviar notificaciones de mail y WhatsApp.

- **Lenguaje:** Go 1.21+
- **Puerto:** 4000
- **Autenticación:** JWT con secret `bascodelab-0317`
- **Base URL:** `http://localhost:4000`

---

## 2. Endpoints

### Mail
- `POST /mail/bienvenida`
- `POST /mail/contacto`
- `POST /mail/contacto-upac`

### WhatsApp
- `POST /whatsapp/bienvenida`
- `POST /whatsapp/contacto`
- `POST /whatsapp/contacto-upac`

### Salud
- `GET /health`

---

## 3. Request Body (Todos los endpoints)

```json
{
  "email_from": "string (obligatorio)",
  "email_to": "string (obligatorio)",
  "mensaje": "string (opcional)",
  "telefono": "string (opcional, formato: +56912345678)",
  "direccion": "string (opcional)",
  "nombres": "string (opcional)",
  "apellidos": "string (opcional)",
  "comuna": "string (opcional)"
}
```
### Campos obligatorios
email_from, email_to

### Campos opcionales 
mensaje, telefono, direccion, nombres, apellidos, comuna

## 4. Response (Exitoso)
```
HTTP 200

JSON
{
  "success": true,
  "message": "Correo enviado exitosamente",
  "data": {
    "message_id": "1234567890",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

---

## 5. Response (Error)
```
HTTP 400/401/429/500

JSON
{
  "success": false,
  "message": "Descripción del error específico",
  "data": null
}
```
---

## 6. Códigos HTTP
- Código	Significado
- 200	Exitoso
- 400	Datos inválidos
- 401	JWT inválido
- 429	Rate limit excedido
- 500	Error interno del servidor
---
## 7. Headers Requeridos
- Code
- Content-Type: application/json
- Authorization: Bearer {JWT_TOKEN}

## 8. Autenticación
- Tipo: JWT (Bearer Token)
- Secret: bascodelab-0317
- Algoritmo: HS256
- Validación: En todos los endpoints excepto /health

## 9. Integraciones
- Mailjet
- Endpoint: https://api.mailjet.com/v3.1/send
- Autenticación: Basic Auth (API Key + Secret)
- Método: POST
- Content: HTML renderizado desde template
- Variables de entorno:
- MAILJET_API_KEY
- MAILJET_API_SECRET
- MAILJET_FROM_EMAIL
- MAILJET_FROM_NAME
- Meta WhatsApp
- Endpoint: https://graph.instagram.com/v18.0/{phone_id}/messages
- Autenticación: Bearer Token
- Método: POST
- Content: Texto plano
- Variables de entorno:
- META_WHATSAPP_TOKEN
- META_WHATSAPP_PHONE_ID
---
## 10. Templates HTML
- Carpeta: templates/

### Archivos requeridos:
- bienvenida.html (para /mail/bienvenida)
- contacto.html (para /mail/contacto)
- contacto-upac.html (para /mail/contacto-upac)
- Renderización: html/template de Go

### Variables disponibles:

- Code
- {{.EmailFrom}}
- {{.EmailTo}}
- {{.Mensaje}}
- {{.Telefono}}
- {{.Direccion}}
- {{.Nombres}}
- {{.Apellidos}}
- {{.Comuna}}
---

## 11. Validaciones
- email_from
- Obligatorio
- Formato válido (RFC 5322)
- email_to
- Obligatorio
- Formato válido (RFC 5322)
- telefono (si está presente)
- Formato: +56912345678
- Mínimo 10 dígitos con código país
- Requerido para endpoints /whatsapp/*
- mensaje
- Opcional
- Sin límite de caracteres
-Validar antes de procesar cada request.
---
## 12. Rate Limiting
### Por IP:
- Límite: 100 requests/hora
- Ventana: 1 hora

### Por API Key:
- Límite: 1000 requests/hora
- Ventana: 1 hora
- Respuesta: HTTP 429 (Too Many Requests)
---

## 13. Manejo de Errores
- Todos los handlers deben tener try-catch.
- Evitar crashes. Siempre retornar JSON con estructura error.

### Tipos de errores a capturar:
- Validación de input inválido
- Fallo en autenticación JWT
- Fallo en integración Mailjet
- Fallo en integración WhatsApp
- Rate limit excedido
- Parseo JSON inválido
- Errores de conexión HTTP
---
## 14. Seguridad
- JWT validado en cada request
- CORS habilitado (Access-Control-Allow-Origin: *)
- Rate limiting activo
- Validación de todos los inputs
- Try-catch en todos los handlers
- Secret JWT: bascodelab-0317
- Timeouts en requests HTTP (10 segundos)
---
## 15. Variables de Entorno
- env
- PORT=4000
- MAILJET_API_KEY=xxx
- MAILJET_API_SECRET=xxx
- MAILJET_FROM_EMAIL=noreply@tudominio.com
- MAILJET_FROM_NAME=Tu Nombre
- META_WHATSAPP_TOKEN=xxx
- META_WHATSAPP_PHONE_ID=xxx
- JWT_SECRET=bascodelab-0317
- ENVIRONMENT=development
- LOG_LEVEL=info
- RATE_LIMIT_IP=100
- RATE_LIMIT_API_KEY=1000
- CORS_ORIGIN=*

## 16. Estructura de Carpetas
## Code
api-notificaciones/
├── main.go
├── go.mod
├── go.sum
├── .env
├── .env.example
├── Dockerfile
├── docker-compose.yml
├── config/
│   └── config.go
├── handlers/
│   ├── mail.go
│   ├── whatsapp.go
│   ├── middleware.go
│   ├── errors.go
│   └── health.go
├── services/
│   ├── mailjet.go
│   ├── whatsapp.go
│   ├── jwt.go
│   ├── validator.go
│   └── ratelimit.go
├── models/
│   └── models.go
├── templates/
│   ├── bienvenida.html
│   ├── contacto.html
│   └── contacto-upac.html
└── logs/
---
## 17. Dependencias Go
### Go
- github.com/golang-jwt/jwt/v5
- github.com/joho/godotenv
- github.com/swaggo/swag/cmd/swag
- github.com/swaggo/http-swagger/v2
---
## 18. Health Check
### Endpoint: 
GET /health

### Autenticación: 
No requerida

### Response:
```
JSON
{
  "status": "ok",
  "message": "API de notificaciones está funcionando correctamente"
}
```
---
## 19. Mejores Prácticas
- Separación de capas: handlers, services, models
- Error handling en todos los puntos críticos
- Validación de inputs antes de procesar
- Comentarios en funciones públicas
- Manejo de concurrencia con sync.Mutex
- Timeouts en requests HTTP (10 segundos)
- Cerrar recursos adecuadamente (defer)
## 20. Swagger/OpenAPI
- Documentación completa de endpoints
- Incluir ejemplos de requests/responses
- Especificar autenticación requerida
