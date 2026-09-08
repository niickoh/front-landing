# SPEC — Inicio: “Nuestros Equipos”, Servicios y “Hablemos” (UPAC)

## Objetivo
Actualizar la página de inicio para destacar los equipos del club, mejorar el mensaje institucional en “Servicios” y reforzar conversión en “Hablemos”.

---

## 1) Reemplazo de sección “Características” por “Nuestros Equipos”

### Requerimiento
En la sección de inicio donde actualmente aparece **“Características”**, cambiar el título y enfoque a **“Nuestros Equipos”**.

### Criterios de aceptación
- [ ] El título visible cambia de “Características” a “Nuestros Equipos”.
- [ ] El contenido de esa sección deja de responder a features genéricas y pasa a representar equipos del club.

---

## 2) Cards personalizadas para equipos (nombre + logo)

### Requerimiento
Mostrar los equipos en cards personalizadas para destacar identidad del club.

### Contenido obligatorio por card
- Nombre del equipo
- Logo del equipo

### Reglas UI
- Layout responsive (grid).
- Tarjeta con estilo institucional UPAC (negro/rojo/blanco/dorado).
- Hover/estado activo sutil para interacción.

### Criterios de aceptación
- [ ] Cada card muestra nombre + logo.
- [ ] Todas las cards mantienen estilo consistente.
- [ ] Correcto comportamiento responsive en mobile/tablet/desktop.

---

## 3) Lista de equipos desde archivo de configuración

### Requerimiento
La lista de equipos debe venir desde config y cada nombre debe terminar con **“Panthers”**.

### Base indicada
`Silver, Infinity, Cherry, Galaxy, Aurora, New Stars, etc.`

### Regla de nomenclatura
A cada nombre se le agrega `Panthers` al final.

### Resultado esperado (ejemplos)
- Silver Panthers
- Infinity Panthers
- Cherry Panthers
- Galaxy Panthers
- Aurora Panthers
- New Stars Panthers

### Estructura propuesta (config)
```json
{
  "teamsSection": {
    "title": "Nuestros Equipos",
    "teams": [
      { "id": "silver", "baseName": "Silver", "displayName": "Silver Panthers", "logo": "/assets/teams/silver.png" },
      { "id": "infinity", "baseName": "Infinity", "displayName": "Infinity Panthers", "logo": "/assets/teams/infinity.png" },
      { "id": "cherry", "baseName": "Cherry", "displayName": "Cherry Panthers", "logo": "/assets/teams/cherry.png" },
      { "id": "galaxy", "baseName": "Galaxy", "displayName": "Galaxy Panthers", "logo": "/assets/teams/galaxy.png" },
      { "id": "aurora", "baseName": "Aurora", "displayName": "Aurora Panthers", "logo": "/assets/teams/aurora.png" },
      { "id": "new-stars", "baseName": "New Stars", "displayName": "New Stars Panthers", "logo": "/assets/teams/new-stars.png" }
    ]
  }
}
```

### Criterios de aceptación
- [ ] Los equipos se renderizan desde config (sin hardcode).
- [ ] Todos los nombres visibles incluyen sufijo “Panthers”.
- [ ] Logos configurables por equipo.

---

## 4) Actualización de contenido en sección “Servicios”

### Requerimiento
Reescribir la sección “Servicios” para comunicar que son un equipo humano que trabaja bien, con enfoque en cheerleading, buenas prácticas y manejo de equipos.

### Copy guía (editable por config)
**Título sugerido:** `Nuestro enfoque`

**Texto sugerido:**
> Somos un equipo de personas que trabaja de manera comprometida, organizada y colaborativa para formar atletas integrales en el cheerleading.  
> Promovemos buenas prácticas de entrenamiento, seguridad en cada rutina, disciplina, respeto y trabajo en equipo.  
> Nuestro objetivo es potenciar el rendimiento deportivo y personal, fortaleciendo la confianza, la técnica y el liderazgo dentro y fuera de la pista.

### Criterios de aceptación
- [ ] Mensaje institucional alineado a cheerleader + buenas prácticas.
- [ ] Tono profesional, cercano y motivador.
- [ ] Texto editable desde config.

---

## 5) Actualización de sección “Hablemos” con mensaje motivador

### Requerimiento
En “Hablemos”, incluir un mensaje motivador que invite a entrar al club y contactar.

### Copy guía (editable por config)
**Título sugerido:** `¿Listo para ser parte de UPAC Allstars?`

**Texto sugerido:**
> Súmate a una comunidad con historia, pasión y alto nivel competitivo.  
> En UPAC Allstars encontrarás formación, compañerismo y desafíos que te harán crecer en cada entrenamiento.  
> Escríbenos y da el primer paso para convertirte en parte de la familia Panthers.

**CTA sugerido:** `Quiero unirme`

### Criterios de aceptación
- [ ] Mensaje claramente motivador y orientado a conversión.
- [ ] Botón/CTA visible y coherente con la acción de contacto.
- [ ] Contenido configurable sin tocar componentes.

---

## Requisitos transversales

- Todo el contenido (títulos, textos, equipos, logos, CTA) debe salir de config.
- Mantener consistencia visual con temática UPAC (rojo/negro/blanco/dorado).
- Accesibilidad:
  - `alt` en logos
  - contraste AA mínimo
  - foco visible en elementos interactivos
- Manejo de estados vacíos:
  - sección equipos sin logos
  - sección equipos sin datos

---

## Checklist final

- [ ] “Características” reemplazado por “Nuestros Equipos”.
- [ ] Cards personalizadas con nombre y logo implementadas.
- [ ] Lista de equipos desde config con sufijo “Panthers”.
- [ ] “Servicios” actualizado con enfoque humano + cheer + buenas prácticas.
- [ ] “Hablemos” actualizado con mensaje motivador + CTA.
