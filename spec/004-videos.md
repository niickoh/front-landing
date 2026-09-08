# SPEC — Módulo de Videos, Header y Colaboradores (UPAC)

## Objetivo
Definir el nuevo comportamiento de videos (YouTube), ajustes de header con logo e imágenes de colaboradores configurables para mantener flexibilidad sin tocar componentes.

---

## 1) Videos como array de links de YouTube

### Requerimiento
La fuente de videos será un **array de links de YouTube** proveniente de configuración.

### Estructura propuesta (config)
```json
{
  "videos": {
    "events": [
      {
        "id": "campeonato-1",
        "title": "Campeonato 1",
        "thumbnail": "/assets/events/campeonato-1.jpg",
        "youtubeLinks": [
          "https://www.youtube.com/watch?v=VIDEO_ID_1",
          "https://youtu.be/VIDEO_ID_2"
        ]
      }
    ]
  }
}
```

### Reglas
- Aceptar formatos `youtube.com/watch?v=` y `youtu.be/`.
- Convertir links a `videoId` internamente para embebido.
- Ignorar o marcar links inválidos sin romper la UI.

### Criterios de aceptación
- [ ] Videos renderizados desde config.
- [ ] No hay URLs hardcodeadas en componentes.
- [ ] Manejo seguro de links inválidos.

---

## 2) Video principal desde YouTube con duración/segmento configurado

### Requerimiento
El video principal (Hero) será de YouTube y debe reproducirse por una cantidad de segundos definida.

### Estructura propuesta (config)
```json
{
  "hero": {
    "youtubeUrl": "https://www.youtube.com/watch?v=HERO_VIDEO_ID",
    "startSeconds": 15,
    "playSeconds": 30,
    "autoplay": true,
    "muted": true,
    "loop": true
  }
}
```

### Comportamiento
- Obtener `videoId` desde `youtubeUrl`.
- Iniciar en `startSeconds`.
- Reproducir `playSeconds`.
- Si `loop=true`, reiniciar en `startSeconds` al terminar tramo.
- Fallback visual si no carga.

### Criterios de aceptación
- [ ] Hero usa YouTube como fuente principal.
- [ ] El tramo de reproducción respeta segundos configurados.
- [ ] Fallback activo ante error.

---

## 3) Header con imagen de logo

### Requerimiento
El header incluirá una **imagen de logo** configurada por archivo.

### Estructura propuesta (config)
```json
{
  "header": {
    "logo": {
      "src": "/assets/branding/upac-logo.png",
      "alt": "UPAC Allstars Logo",
      "href": "/"
    }
  }
}
```

### Reglas
- Logo clickeable a inicio (`href` configurable).
- Soporte variantes futuras (oscuro/claro) sin cambiar componente.

### Criterios de aceptación
- [ ] Header muestra logo desde config.
- [ ] Texto alternativo (`alt`) definido.
- [ ] Navegación al home funcional.

---

## 4) “Quiénes somos”: reemplazo de iniciales por imagen de colaborador (desde config)

### Requerimiento
En “Quiénes somos”, reemplazar initials/avatar textual por imagen de cada colaborador, configurable.

### Estructura propuesta (config)
```json
{
  "about": {
    "collaborators": [
      {
        "id": "colab-1",
        "name": "Nombre Apellido",
        "role": "Coach",
        "photo": "/assets/collaborators/nombre-apellido.jpg"
      }
    ]
  }
}
```

### Reglas
- Si falta imagen, usar placeholder institucional.
- Orden y datos vienen 100% desde config.
- Permitir actualización de fotos sin tocar código.

### Criterios de aceptación
- [ ] No se muestran initials.
- [ ] Se muestran imágenes por colaborador.
- [ ] Cambios en config se reflejan al desplegar.

---

## 5) Sección Videos agrupada por evento (cards → detalle con array YouTube)

### Requerimiento
Los videos se agrupan por **evento/campeonato**.  
La vista inicial muestra cards (ej: “Campeonato 1”).  
Al hacer click en una card, se abre listado/reproductor con los videos de ese evento (YouTube).

### Flujo funcional
1. Render de cards por `videos.events`.
2. Click en card `event.id`.
3. Navegar a detalle/modal del evento.
4. Cargar `youtubeLinks` asociados.
5. Reproducir/mostrar galería embed YouTube.

### Estructura mínima por evento
- `id`
- `title`
- `thumbnail` (opcional recomendado)
- `youtubeLinks[]`

### Criterios de aceptación
- [ ] Vista principal de eventos en formato card.
- [ ] Click en evento carga solo sus videos.
- [ ] Videos del detalle provienen del array YouTube de ese evento.
- [ ] Estado vacío por evento sin videos.

---

## Requisitos técnicos transversales

- Todo configurable desde archivo central.
- Sin hardcode de textos, imágenes o URLs de video.
- Validación de schema para:
  - `youtubeUrl`
  - `youtubeLinks[]`
  - imágenes (`logo`, `photo`, `thumbnail`)
- Performance:
  - lazy-load en embeds
  - thumbnails previos a reproducción
- Accesibilidad:
  - `alt` en imágenes
  - foco visible en cards/botones
  - labels en controles interactivos

---

## Checklist de entrega

- [ ] Estructura de config actualizada con `hero`, `header.logo`, `about.collaborators`, `videos.events`.
- [ ] Hero YouTube con control de segundos implementado.
- [ ] Header con logo funcional.
- [ ] “Quiénes somos” usando imágenes de colaboradores.
- [ ] Videos agrupados por campeonato/evento con navegación por card.
- [ ] Estados vacíos y errores controlados.
