# SPEC — Mejoras en “Quiénes Somos”, Valores y Footer (UPAC)

## Objetivo
Optimizar la experiencia de la sección **“Quiénes Somos”** con mejores prácticas UX/UI, mayor personalización visual del equipo humano, animaciones cuidadas y contenido coherente con cheerleading/UPAC Allstars.  
Todos los datos deben mantenerse centralizados en archivo de configuración.

---

## 1) Mejoras UX/UI en “Quiénes Somos” manteniendo paleta institucional

### Requerimiento
Aplicar mejores prácticas de diseño y estilo UX/UI en el componente “Quiénes Somos”, respetando colores oficiales (rojo, negro, blanco, dorado y derivados).

### Guías UX/UI
- Jerarquía visual clara:
  - Título
  - Subtítulo
  - Bloque descriptivo
  - Equipo de personas
- Mejor legibilidad:
  - Ancho de línea óptimo en párrafos
  - Espaciados verticales consistentes
  - Contraste AA mínimo
- Diseño responsive:
  - Mobile-first
  - Reorganización de columnas en tablet/desktop
- Microinteracciones suaves:
  - Hover y foco visibles
  - Transiciones de 150–250ms

### Criterios de aceptación
- [ ] Componente con estructura visual más clara y moderna.
- [ ] Se conserva identidad cromática institucional.
- [ ] Se mejora legibilidad y navegación en todos los breakpoints.

---

## 2) Personalización + animaciones en bloque de entrenadores/personas/colaboradores

### Requerimiento
En la sección donde se muestra el equipo humano, incorporar mayor personalización y animaciones al presentar cada perfil (entrenador/persona/colaborador).

### Contenido mínimo por perfil (desde config)
- Nombre
- Rol (ej. Head Coach, Assistant Coach, Staff)
- Foto
- Descripción breve (1–2 líneas)
- Especialidad o categoría (opcional)
- Redes/contacto (opcional)

### Personalización visual
- Card con identidad UPAC (bordes, sombras y acentos institucionales).
- Estado destacado para perfiles principales.
- Opcional: badge “25 años” o “Staff oficial”.

### Animaciones recomendadas
- Entrada al viewport (fade + slide suave).
- Hover en card (elevación ligera + acento borde).
- Aparición escalonada en grilla (stagger).
- Respeto a `prefers-reduced-motion`.

### Criterios de aceptación
- [ ] Cada colaborador se muestra con card personalizada.
- [ ] Animaciones fluidas, no invasivas y consistentes.
- [ ] Accesibilidad considerada (reduced motion, foco, contraste).

---

## 3) Adaptar “Nuestros Valores” al cheerleading y UPAC Allstars (sin rediseñar estructura)

### Requerimiento
Mantener el diseño actual de la sección “Nuestros Valores”, pero adaptar el contenido a valores coherentes con cheer y la cultura UPAC.

### Línea editorial sugerida
- Disciplina
- Trabajo en equipo
- Respeto
- Seguridad en entrenamiento
- Compromiso
- Superación
- Pasión deportiva
- Compañerismo/familia

### Ejemplos de textos (editables desde config)
- **Disciplina:** Entrenamos con constancia y enfoque para mejorar cada rutina.
- **Seguridad:** Priorizamos técnica y prevención para un progreso responsable.
- **Trabajo en equipo:** Crecemos juntos, confiando en cada integrante.
- **Pasión:** Vivimos el cheer con energía, entrega y orgullo UPAC.

### Criterios de aceptación
- [ ] Se mantiene el layout original de la sección.
- [ ] Se actualiza únicamente contenido para coherencia cheer/UPAC.
- [ ] Mensaje final consistente con el resto del sitio.

---

## 4) Datos centralizados en archivo de configuración

### Requerimiento
Recordatorio obligatorio: todos los datos de estas secciones deben provenir de config.

### Estructura propuesta (config)
```json
{
  "aboutSection": {
    "title": "Quiénes Somos",
    "subtitle": "Historia, equipo y propósito",
    "description": "..."
  },
  "teamSection": {
    "title": "Nuestro Equipo",
    "members": [
      {
        "id": "coach-1",
        "name": "Nombre Apellido",
        "role": "Head Coach",
        "photo": "/assets/team/coach-1.jpg",
        "bio": "Entrenadora con experiencia en...",
        "specialty": "Stunts"
      }
    ]
  },
  "valuesSection": {
    "title": "Nuestros Valores",
    "items": [
      { "id": "disciplina", "title": "Disciplina", "description": "..." },
      { "id": "equipo", "title": "Trabajo en equipo", "description": "..." }
    ]
  },
  "footer": {
    "slogan": "Amor, familia y pasión"
  }
}
```

### Criterios de aceptación
- [ ] Sin textos hardcodeados en componentes.
- [ ] Cambios de config reflejados tras despliegue.
- [ ] Manejo de faltantes sin romper UI.

---

## 5) Footer: aplicar mejoras de coherencia + slogan definido

### Requerimiento
Aplicar también las mejoras de consistencia UX/UI en footer y actualizar slogan a:

**“Amor, familia y pasión”**

### Alcance
- Mantener estilo institucional del sitio.
- Mejorar jerarquía de contenido del footer (marca, links, contacto/redes si aplica).
- Reforzar cierre emocional con slogan indicado.

### Criterios de aceptación
- [ ] Footer visualmente consistente con el resto de la página.
- [ ] Slogan actualizado exactamente a: **Amor, familia y pasión**.
- [ ] Datos del footer configurables desde archivo config.

---

## Requisitos no funcionales

- Responsive completo.
- Accesibilidad AA (contraste, foco visible, semántica).
- Animaciones optimizadas (sin afectar rendimiento).
- Compatibilidad cross-browser moderna.

---

## Checklist final

- [ ] “Quiénes Somos” mejorado con prácticas UX/UI.
- [ ] Bloque de equipo con personalización + animaciones.
- [ ] “Nuestros Valores” adaptado a cheer/UPAC sin cambiar estructura visual.
- [ ] Datos gestionados desde config.
- [ ] Footer alineado + slogan “Amor, familia y pasión”.
