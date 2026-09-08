# Spec 001 — Landing Page Básica

## Contexto

Primera iteración de `front-landing`: una landing page básica, responsiva y moderna que sirve
como base para futuras iteraciones (spec driven development).

## Stack

- **Angular 20** (standalone components, sin NgModules)
- **Tailwind CSS 4** como sistema de estilos principal (responsividad incluida)
- **PrimeNG 20.4.0** (versión no-LTS, para evitar el banner de LTS) + `@primeuix/themes` (Aura)
- Sin tests por ahora; se agregarán en iteraciones posteriores

## Requisitos funcionales

### RF-01: Estructura de la página

- Header fijo con navegación.
- Hero con imagen principal de fondo (`public/hero-bg.png`) a pantalla completa.
- Al menos 3 secciones de contenido en el inicio:
  1. Características (`features`)
  2. Servicios (`services-section`)
  3. Llamado a la acción (`cta-section`)
- Footer con navegación, datos de contacto y año dinámico.

### RF-02: Navegación (header)

| Ítem          | Comportamiento                                    |
| ------------- | ------------------------------------------------- |
| Inicio        | Navega a `/` (inicio)                             |
| Quiénes Somos | Navega a `/quienes-somos` (componente propio)     |
| Contacto      | Navega a `/contacto` (componente propio)          |

Menú colapsable (hamburguesa) en móvil, con estado manejado por signals.

### RF-03: Arquitectura

Arquitectura simple, organizada en:

```
src/app/
├── core/         # Layout global (header, footer)
├── services/     # Servicios inyectables (notification, contact)
└── components/   # Páginas y secciones (home, quienes-somos, contacto)
```

### RF-04: Lazy loading

Todas las rutas usan `loadComponent` para carga diferida:
`/`, `/quienes-somos`, `/contacto`. Ruta comodín `**` redirige a `/`.

### RF-05: Signals

- Estado local de componentes con `signal` / `computed` (menú móvil, diálogo, formularios).
- Formularios manejados 100% con signals (sin `ngModel` de two-way binding salvo en `p-select`,
  donde el valor se sincroniza de vuelta al signal del formulario).

### RF-06: Validaciones de formularios

Formulario de contacto (mínimas):

| Campo  | Validaciones                                  |
| ------ | --------------------------------------------- |
| nombre | requerido, mínimo 3 caracteres                |
| email  | requerido, formato de correo válido           |
| asunto | requerido (selección)                         |
| mensaje| requerido, mínimo 10 caracteres               |

Los errores se muestran con `p-message` al tocar el campo o al intentar enviar.
Diálogo de suscripción (CTA): email requerido con formato válido.

### RF-07: Notificaciones, modales y alertas

- `NotificationService` encapsula `MessageService` de PrimeNG (`success`, `info`, `warn`, `error`).
- Toast global (`<p-toast>`) montado en el componente raíz.
- Modal de suscripción con `p-dialog` en la sección CTA.
- Estilos dominados por Tailwind; PrimeNG aporta el comportamiento.

### RF-08: Paleta de colores

| Rol        | Color                                   |
| ---------- | --------------------------------------- |
| Principal  | Rojo (`#dc2626`, oscuro `#991b1b`)      |
| Base       | Negro (`#0a0a0a`) y blanco (`#fafafa`)  |
| Secundario | Azul (`#2563eb`) y grises (Tailwind)    |

Definida en `src/styles.scss` vía `@theme` de Tailwind 4
(`primary`, `primary-dark`, `primary-light`, `secondary`, `dark`, `light`, `surface`).

## Criterios de aceptación

- [x] `npm run build` compila en producción sin errores.
- [x] Rutas con lazy loading generan chunks separados.
- [x] Layout responsivo (móvil / tablet / escritorio) con utilidades Tailwind.
- [x] Formularios validan y notifican éxito/error.
- [x] Sin banner de PrimeNG LTS (versión 20.4.0).

## Fuera de alcance (futuros specs)

- Tests unitarios / e2e.
- Backend real para el envío del formulario (hoy se almacena en memoria vía `ContactService`).
- i18n, modo oscuro, animaciones avanzadas.
