# SPEC - Cambios UI/UX y Configuración (UPAC)

## Objetivo
Definir los cambios funcionales y visuales para la nueva iteración del sitio/app, asegurando que el contenido sea configurable, que el header evolucione con un nuevo componente de videos y que la temática visual se alinee con una inspiración tipo **UPAC Allstars**.

---

## 1) Externalización de textos a archivo de configuración
### Requerimiento
Todos los textos visibles en la aplicación deben residir en un archivo de configuración.

### Alcance
- Mover textos de:
  - Header / navegación
  - Hero principal
  - Secciones informativas
  - Botones / CTAs
  - Footer
- Evitar hardcode de textos dentro de componentes.

### Criterios de aceptación
- Existe un archivo de configuración centralizado (ej: `content.config.json`, `content.ts`, etc.).
- La app consume esos valores en runtime/build según arquitectura.
- Al modificar valores del archivo de configuración y desplegar, **el comportamiento/contenido cambia sin tocar los componentes**.
- El proceso de deploy sincroniza automáticamente el archivo de configuración con la app publicada.

---

## 2) Hero principal: imagen o video
### Requerimiento
La sección principal (hero) debe soportar como recurso principal:
- una **imagen**, o
- un **video**.

### Criterios de aceptación
- El hero acepta un tipo de medio configurable (`image | video`).
- Si es imagen: renderiza imagen principal.
- Si es video: renderiza video principal (autoplay/muted/loop según definición posterior).
- Existe fallback por si el medio no carga (estado seguro).

---

## 3) Tipografía principal: Montserrat
### Requerimiento
Usar **Montserrat** como fuente principal del sitio/app.

### Criterios de aceptación
- Montserrat aplicada globalmente como `font-family` primaria.
- Mantener fallback fonts seguras (ej. sans-serif).
- Verificar consistencia visual en header, hero, secciones y botones.

---

## 4) Header: reemplazar “Contacto” por “Videos” (componente)
### Requerimiento
En el header, reemplazar el ítem/sección **“Contacto”** por **“Videos”**.

### Alcance funcional
- “Videos” será un componente propio.
- Este componente contendrá videos relacionados a ciertos temas/cosas (detalle funcional pendiente para próxima iteración).

### Criterios de aceptación
- Ya no existe “Contacto” en esa posición del header.
- Existe “Videos” apuntando/renderizando su componente.
- El componente queda preparado para ampliar catálogo/listado de videos más adelante.

---

## 5) Rama de trabajo
### Requerimiento
Este cambio debe realizarse en una nueva rama:

`feature/upac`

### Criterios de aceptación
- Todo el desarrollo y commits de esta iteración ocurren sobre `feature/upac`.
- No mezclar cambios directamente en rama principal.

---

## 6) Investigación temática “UPAC Allstars” y adaptación visual inicial
### Requerimiento
Una vez en `feature/upac`, investigar referencias públicas de **UPAC Allstars** y aplicar una temática visual parecida (con libertad creativa inicial).

### Alcance
- Definir una primera propuesta de:
  - paleta de color
  - estilo de secciones
  - estilo de botones/cards
  - tono visual general

### Criterios de aceptación
- Se documenta una inspiración visual basada en la investigación.
- La UI refleja una temática similar en esta primera versión.
- El enfoque queda sujeto a ajustes posteriores.

---

## Notas
- Este documento define el **alcance inicial**.
- Los detalles finos del componente “Videos” y ajustes de branding se profundizarán en siguientes iteraciones.
