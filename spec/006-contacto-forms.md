# SPEC — Sección de Contacto (Ingreso a UPAC)

## Objetivo
Crear/actualizar la sección **Contacto** enfocada en personas interesadas en ser parte del equipo **UPAC Allstars**, con contenido 100% configurable y una experiencia UX/UI alineada a la identidad visual del club.

---

## 1) Sección de contacto orientada a ingreso al equipo UPAC

### Requerimiento
La sección debe comunicar claramente cómo contactar al club para postular/consultar ingreso al equipo de cheerleader.

### Contenido esperado
- Mensaje de bienvenida al proceso de contacto.
- Información de canales oficiales.
- Llamado a la acción para completar formulario.

### Criterios de aceptación
- [ ] El enfoque textual está orientado a “quiero ser parte de UPAC”.
- [ ] Se muestran canales claros de contacto.
- [ ] Existe CTA principal hacia el formulario.

---

## 2) Datos de contacto obtenidos desde config (editable)

### Requerimiento
Todos los datos de contacto deben provenir del archivo de configuración para poder cambiarlos sin tocar componentes.

### Estructura propuesta (config)
```json
{
  "contactSection": {
    "title": "Contacto UPAC Allstars",
    "subtitle": "¿Quieres ser parte del equipo? Escríbenos y te orientamos en el proceso.",
    "channels": {
      "whatsapp": "+56 9 0000 0000",
      "email": "contacto@upacallstars.cl",
      "instagram": "https://instagram.com/upacallstars",
      "address": "Santiago, Chile"
    },
    "cta": {
      "label": "Quiero ser parte",
      "href": "#contact-form"
    }
  }
}
```

### Reglas
- No hardcodear emails, teléfonos, redes o textos.
- Si falta un canal, el componente lo oculta sin romper layout.
- Validación de campos de config al cargar.

### Criterios de aceptación
- [ ] Todos los datos se leen desde config.
- [ ] Cambios de config se reflejan tras deploy.
- [ ] Manejo de campos faltantes sin errores visuales.

---

## 3) Formulario enfocado a contacto de cheerleader

### Requerimiento
El formulario debe recoger información útil para postulantes/interesados en cheerleader.

### Campos mínimos recomendados
- Nombre completo *(required)*
- Edad *(required, numérico)*
- Correo electrónico *(required)*
- Teléfono / WhatsApp *(required)*
- Ciudad/Comuna *(optional)*
- Nivel de experiencia en cheer *(required, select: principiante/intermedio/avanzado)*
- Disponibilidad horaria *(optional)*
- Mensaje / motivación para ingresar *(required, textarea)*
- Aceptación de política de contacto/datos *(required checkbox)*

### Comportamientos
- Validación en cliente (formato email, largo mínimo de mensaje, requeridos).
- Estado `loading` durante envío.
- Estado de éxito con mensaje de confirmación.
- Estado de error con instrucciones claras.

### Criterios de aceptación
- [ ] Formulario orientado a postulantes cheerleader.
- [ ] Validaciones aplicadas correctamente.
- [ ] Feedback de éxito/error visible y comprensible.
- [ ] Accesible por teclado y lectores de pantalla.

---

## 4) Mejores prácticas UX/UI manteniendo colores institucionales

### Requerimiento
Aplicar buenas prácticas de diseño/UX en el componente de contacto manteniendo la paleta UPAC (rojo, negro, blanco, dorado y derivados).

### Guías de diseño
- Jerarquía visual clara (título, texto, canales, formulario, CTA).
- Anchos de campo cómodos + espaciado consistente.
- Labels siempre visibles (no depender solo de placeholders).
- Mensajes de error junto al campo afectado.
- Botón principal destacado y legible.
- Soporte mobile-first.

### Guías de estilo (tokens sugeridos)
- Fondo base: negro (`blackPrimary`)
- Texto principal: blanco (`whitePrimary`)
- Acento principal: rojo (`redPrimary`)
- Acento conmemorativo: dorado (`goldPrimary`)
- Bordes/superficies: derivados oscuros (`surfaceDark`, `borderSubtle`)

### Accesibilidad
- Contraste mínimo AA.
- Foco visible en todos los inputs y botones.
- `aria-invalid`, `aria-describedby` para errores.
- Navegación por teclado en orden lógico.

### Criterios de aceptación
- [ ] Diseño consistente con branding UPAC.
- [ ] Componente responsive en mobile/tablet/desktop.
- [ ] Cumple prácticas clave de usabilidad y accesibilidad.
- [ ] Mantiene coherencia cromática institucional.

---

## Requisitos técnicos transversales

- Contenido y canales centralizados en config.
- Sin hardcode de texto ni datos de contacto.
- Estructura preparada para internacionalización futura (opcional).
- Trazabilidad básica de envíos (si existe backend/API).

---

## Checklist final

- [ ] Sección Contacto enfocada a ingreso al equipo.
- [ ] Datos 100% configurables desde archivo config.
- [ ] Formulario específico para cheerleader implementado.
- [ ] UX/UI aplicado con mejores prácticas y paleta institucional.
