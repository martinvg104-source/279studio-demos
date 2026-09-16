# clientes/compostela-judo

Demo comercial 1:1 para **Centro Deportivo Compostela Judo Club** (Os Tilos, Teo): una
**app de reservas**, no una landing de marketing. Dos accesos simulados —alumno/familia y
administrador del club— sobre una única app-shell (sidebar en escritorio, bottom nav en
móvil), con reservas, horarios, avisos, gestión de alumnos y accesos, calendario de clases,
asistencia y automatizaciones representadas visualmente.

## Cómo arrancar

HTML/CSS/JS vanilla, sin build. Los assets usan rutas absolutas
(`/clientes/compostela-judo/...`), así que necesita un servidor estático — no funciona
abriendo `index.html` con `file://`.

Desde la raíz de `279studio-demos/`:

```
python -m http.server 8080
```

Abrir `http://localhost:8080/clientes/compostela-judo/`. La navegación es interna (router
por hash).

Alumno: `#/inicio`, `#/reservar`, `#/mis-reservas`, `#/actividades`, `#/horarios` (accesible
desde Actividades), `#/avisos`, `#/perfil`.

Club (admin): `#/resumen`, `#/admin-reservas`, `#/admin-calendario`, `#/admin-alumnos`
(incluye la pestaña "Gestionar accesos"), `#/admin-grupos`, `#/admin-avisos`,
`#/admin-automatizaciones`, `#/admin-config`.

## Acceso de demostración

La app pide login antes de entrar. Son credenciales fijas, solo para separar las dos
vistas del producto — no hay autenticación real. La pantalla de login incluye botones para
rellenar cada credencial automáticamente.

- **Alumno:** `alumno` / `alumno` — ve Inicio, Reservar, Mis reservas, Actividades, Avisos
  y Perfil (Horarios se abre desde Actividades).
- **Club (admin):** `admin` / `admin` — ve Resumen, Reservas, Calendario, Alumnos, Grupos y
  actividades, Avisos, Automatizaciones y Configuración. No tiene acceso a las vistas de
  alumno.

Cada rol solo puede navegar a sus propias rutas (si se fuerza la URL a una ruta del otro
rol, la app redirige a la vista por defecto de ese rol).

En producción (Vercel) la ruta pública es `/clientes/compostela-judo/`, según el
`vercel.json` de la raíz del repo (`cleanUrls`, `trailingSlash`).

## Qué se puede probar

- **Alumno:** reservar una clase (wizard de 7 pasos), ver/cancelar/solicitar cambio de
  reservas, buscar y filtrar actividades, consultar horarios, leer y marcar avisos como
  leídos (bandeja con no leídos/leídos y filtro por categoría), editar el perfil.
- **Admin:** confirmar/cancelar/reservar, cambiar de grupo y registrar (no) asistencia
  sobre reservas; crear/editar/eliminar clases y pasar lista desde el calendario
  (día/semana/mes); ver fichas de alumnos con historial, notas internas y avisos
  recibidos, añadir alumnos y marcarlos activo/inactivo; **gestionar accesos** (crear,
  bloquear/reactivar, restablecer contraseña e invitar, todo simulado); crear
  actividades y grupos y activar/desactivar grupos; **crear y publicar avisos** —al
  publicarse aparecen al momento en la bandeja de avisos del alumno (compruébalo
  cerrando sesión y entrando como `alumno`); activar/desactivar automatizaciones
  visuales; editar los datos de contacto del club.

## Qué es simulado

- Todo el estado vive en memoria del navegador (variables JS en `data.js`/`app.js`): se
  pierde al recargar la página. No hay backend, base de datos ni API real.
- El login es solo una pantalla de demostración: dos pares fijos correo/contraseña
  (`admin`/`admin`, `alumno`/`alumno`) definidos en `data.js`, sin autenticación real.
- El wizard de reserva, "Mis reservas", las reservas del panel admin, los alumnos, los
  accesos, las clases del calendario y los avisos parten de datos precargados en
  `data.js`. Crear/editar/eliminar cualquiera de ellos solo modifica el estado en memoria
  de esta pestaña y muestra un toast de confirmación simulada — nunca se envía nada ni se
  notifica a nadie de verdad.
- Los interruptores de "Automatizaciones" son visuales: no activan ni desactivan nada
  real.
- Los horarios (calendario del alumno y del admin, franjas del wizard) son orientativos;
  solo el horario de judo infantil (mié/vie 19:30–20:30) y judo adultos (lun/mié/vie
  20:30–22:00) usa como referencia horarios públicos antiguos del club, marcados en la
  interfaz como orientativos.

## Qué habría que conectar en una versión real

- Wizard de reserva, "Mis reservas" y reservas del panel admin → base de datos real (p.
  ej. Supabase) en vez de estado en memoria, con persistencia entre sesiones.
- Login y "Gestionar accesos" → autenticación real por familia/alumno, con invitaciones y
  restablecimiento de contraseña de verdad.
- Avisos, confirmaciones, recordatorios 24h y seguimiento (automatizaciones) →
  WhatsApp/email vía Twilio o un flujo de n8n, disparado por eventos reales.
- Calendario y horarios → sincronización con la agenda real del club en vez de `data.js`.
- Panel de administrador → datos reales de alumnos, ocupación, asistencia y solicitudes,
  con autenticación de equipo separada de la cuenta de alumno/familia.

## Qué debe validar el club antes de publicar

- Horarios actuales exactos y plazas reales por grupo (todo lo mostrado es orientativo).
- Precios/cuotas (esta demo no muestra precios; si se añaden, deben marcarse como
  ejemplo hasta que el club los confirme).
- Nombres y estructura real de los grupos por edad/nivel.
- Textos sobre filosofía del club, para que los revise alguien del club antes de
  publicarlos como oficiales.
- Cualquier resultado deportivo, cinturón/nivel o dato de alumno mostrado con nombre
  propio (los alumnos, accesos y avisos de esta demo son ficticios).

## Archivos

- `index.html` — app shell (login, sidebar, topbar, bottom nav, contenedor de vistas).
- `styles.css` — sistema visual de la app.
- `data.js` — configuración central de datos mock (club, navegación, actividades, grupos,
  horario, reservas, perfil, alumnos, accesos, clases del calendario admin, reservas
  admin, avisos, automatizaciones). Editar aquí cuando el club valide datos.
- `app.js` — router por hash, wizard de reserva y renderizado de todas las vistas de
  alumno y del panel de administrador.
- Ver `../../DESIGN.md` para el sistema visual de esta demo.
