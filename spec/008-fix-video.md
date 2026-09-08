# SPEC — Mejora UX/UI Sección Videos + Hero Video (UPAC)

## Objetivo
Optimizar la sección de videos y el hero principal con mejores prácticas UX/UI, manteniendo la identidad visual UPAC (rojo, negro, blanco, dorado), mejorando legibilidad, navegación y experiencia de reproducción.

---

## 1) Mejores prácticas UX/UI en sección de videos (manteniendo colores)

### Requerimiento
Aplicar mejoras de diseño y usabilidad en el componente de videos sin salir de la paleta institucional.

### Guías UX/UI
- Jerarquía visual clara:
  - título de sección
  - subtítulo de apoyo
  - cards de eventos/videos
- Espaciado consistente entre cards y bloques.
- Tipografía Montserrat consistente.
- Estados visuales:
  - normal / hover / focus / active
- Feedback de interacción:
  - carga de thumbnails
  - estado vacío
  - error de carga de video

### Estilo (tokens)
- Fondo base: negro (`blackPrimary`, `blackSecondary`)
- Superficies: `surfaceDark`, `surfaceAlt`
- Texto: `whitePrimary`, `textSecondary`
- Acento principal: `redPrimary`
- Acento aniversario/destacado: `goldPrimary`

### Criterios de aceptación
- [ ] Sección de videos visualmente consistente con branding UPAC.
- [ ] Mejora clara de legibilidad y navegación.
- [ ] Estados de interacción implementados.

---

## 2) Card/contenedor de videos con scroll al superar límite visible

### Requerimiento
Cuando el contenido de videos supere el alto estándar de visualización, el contenedor debe permitir scroll interno.

### Comportamiento esperado
- Alto máximo definido para contenedor de lista/grilla.
- `overflow-y: auto` en desktop y mobile.
- Scroll estilizado acorde al tema (si el framework lo permite).
- Mantener encabezado del bloque visible (opcional sticky interno).

### Criterios de aceptación
- [ ] El contenido no rompe el layout general de la página.
- [ ] Scroll interno aparece cuando se excede el límite.
- [ ] Experiencia usable en mouse, touch y teclado.

---

## 3) Metadata mínima por video: tag de título + descripción corta

### Requerimiento
Cada video debe mostrar al menos:
- Título (tag/label visible)
- Descripción breve

### Estructura propuesta (config)
```json
{
  "videos": {
    "events": [
      {
        "id": "campeonato-1",
        "title": "Campeonato 1",
        "youtubeLinks": [
          {
            "url": "https://www.youtube.com/watch?v=VIDEO_ID_1",
            "title": "Rutina final senior",
            "description": "Presentación oficial en final nacional."
          }
        ]
      }
    ]
  }
}
```

### Reglas
- No renderizar cards “vacías” sin metadata.
- Si falta descripción, usar fallback corto institucional.
- Texto truncado con ellipsis en cards para mantener orden visual.

### Criterios de aceptación
- [ ] Todos los videos renderizados muestran título.
- [ ] Todos los videos tienen descripción visible o fallback.
- [ ] Diseño se mantiene limpio con textos largos.

---

## 4) Título de sección de videos alineado a UPAC y cheer

### Requerimiento
Actualizar el título de la sección por uno coherente con UPAC y cheerleading.

### Opciones sugeridas
- **“Rutinas y Campeonatos UPAC”** (recomendada)
- “UPAC en Acción”
- “Momentos Allstars”
- “Nuestra Pista, Nuestra Historia”

### Criterio de aceptación
- [ ] El título final refleja identidad UPAC + contexto cheer.

---

## 5) Ajustes de hero principal (video YouTube)

### Requerimiento
- Reducir nivel de oscurecimiento del overlay en inicio.
- Ocultar controles visibles de YouTube (play/stop) si es técnicamente posible.
- Si no es posible ocultarlos completamente, mantener mejor opción disponible y documentar alternativas.

### Comportamiento esperado
- Overlay oscuro más suave para destacar imagen/rutina.
- Reproducción embebida optimizada para estética limpia.
- Mantener legibilidad de título/CTA.

### Nota técnica importante (YouTube)
En embeds de YouTube, el nivel de control visual depende de políticas actuales de YouTube API/embed y puede no eliminarse al 100%.

### Criterios de aceptación
- [ ] Overlay del hero ajustado (menos oscuro).
- [ ] Se aplica configuración máxima posible para minimizar controles visibles.
- [ ] Se entrega lista de alternativas si no se puede ocultar totalmente.

---

## Opciones si no se pueden ocultar completamente controles de YouTube

1. **Modo “thumbnail + botón personalizado”**
   - Mostrar portada del video con botón propio.
   - Abrir modal al click (YouTube embed).
   - Ventaja: interfaz inicial limpia.

2. **Autoplay muted + controles mínimos**
   - Configurar embed para reducir distracciones.
   - Aceptar branding/elementos inevitables de YouTube.

3. **Video self-hosted para hero**
   - Usar archivo propio para hero (sin UI YouTube).
   - Mantener YouTube en sección de videos/eventos.
   - Ventaja: control visual total en inicio.

4. **Iframe API + capa visual personalizada**
   - Integración avanzada con API JS.
   - Mayor control de comportamiento, no total del branding YouTube.

---

## Requisitos no funcionales

- Responsive (mobile-first).
- Performance:
  - lazy-load en iframes
  - thumbnails optimizados
  - evitar múltiples reproducciones simultáneas
- Accesibilidad:
  - foco visible
  - navegación por teclado
  - labels/aria en controles
  - contraste AA

---

## Checklist final

- [ ] UX/UI mejorado en sección videos manteniendo paleta institucional.
- [ ] Contenedor/card con scroll interno al superar límite visual.
- [ ] Video con título y descripción mínima.
- [ ] Título de sección actualizado a enfoque UPAC/cheer.
- [ ] Hero con overlay menos oscuro + intento de ocultar controles YouTube.
- [ ] Alternativas documentadas si limitación técnica de YouTube impide ocultación total.
