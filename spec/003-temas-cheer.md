## 6. Temática visual UPAC Allstars (25 aniversario) — NUEVO SPEC

### Referencia base
- https://upac-d4a6c.firebaseapp.com/home

### Dirección visual propuesta
Identidad competitiva y conmemorativa (25 años):
- Base dominante oscura (negro) con alto contraste.
- Acentos rojos para energía/deporte.
- Acentos dorados para aniversario (premium/conmemorativo).
- Uso visual de **panteras negras** en recursos gráficos (logos, isotipos, marcas de agua, separadores).

### Paleta propuesta (v2)
> Eliminar cualquier uso de morado/rosado.

#### Colores núcleo
- `blackPrimary`: `#0B0B0F`
- `blackSecondary`: `#1A1A1F`
- `whitePrimary`: `#F8F9FA`
- `whitePure`: `#FFFFFF`
- `redPrimary`: `#C1121F`
- `redSecondary`: `#8D0B15`
- `goldPrimary`: `#D4AF37`
- `goldSecondary`: `#B08D2F`

#### Derivados / soporte
- `surfaceDark`: `#141419`
- `surfaceAlt`: `#202028`
- `borderSubtle`: `#2C2C36`
- `textPrimary`: `#F8F9FA`
- `textSecondary`: `#D6D6DC`
- `success`: `#22A06B`
- `warningGold`: `#E6C15A`

### Aplicación por componente

- **Header**
  - Fondo: `blackPrimary`
  - Texto: `whitePrimary`
  - Hover/activo: `redPrimary`
  - Línea superior o detalle aniversario: `goldPrimary`

- **Hero**
  - Fondo: imagen/video con overlay negro (`blackPrimary` al 60–75%)
  - Título: `whitePure`
  - Subtítulo: `textSecondary`
  - CTA principal: `redPrimary` (hover `redSecondary`)
  - CTA secundario / conmemorativo: borde o acento `goldPrimary`

- **Sección Videos**
  - Tarjetas: `surfaceDark`
  - Bordes: `borderSubtle`
  - Estado activo/reproducir: `redPrimary`
  - Etiquetas “25 años” o destacadas: `goldPrimary` + texto `blackPrimary`

- **Badges y elementos aniversario**
  - Paleta principal: `goldPrimary`, `goldSecondary`, `whitePure`
  - Evitar gradientes morados/rosados.
  - Se permite degradado dorado sutil (oro claro → oro oscuro).

- **Logos y recursos de panteras negras**
  - Priorizar versiones monocromáticas negras/blancas según contraste.
  - Aplicar sello “25 años” dorado en piezas conmemorativas.
  - Mantener área de seguridad y legibilidad sobre fondos con video.

### Reglas de diseño obligatorias
1. Quedan prohibidos morado, fucsia, rosado y derivados en UI final.
2. Colores oficiales permitidos: **rojo, negro, blanco, dorado** y derivados directos.
3. Los elementos de pantera negra deben integrarse en hero, separadores o fondos de sección sin afectar legibilidad.
4. La temática 25 aniversario debe estar presente en al menos:
   - Hero
   - Header
   - Sección de Videos

### Criterios de aceptación
- [ ] UI alineada a identidad UPAC: competitiva, elegante y conmemorativa.
- [ ] No existen tokens morados/rosados en tema ni componentes.
- [ ] Contraste AA mínimo en textos principales.
- [ ] Uso consistente de rojo/negro/blanco/dorado en toda la app.
- [ ] Presencia visual de panteras negras en branding de secciones clave.

---

## 7. Requisitos no funcionales (nuevo spec)

- Responsive (mobile-first).
- Rendimiento optimizado en hero con video:
  - compresión de assets
  - lazy-load cuando aplique
- Accesibilidad:
  - foco visible
  - labels/controles accesibles en video
  - contraste adecuado (AA mínimo)
- Manejo de estados vacíos:
  - lista de videos sin contenido
  - fallback visual consistente con branding.
