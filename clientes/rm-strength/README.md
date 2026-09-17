# clientes/rm-strength

Demo comercial 1:1 para **RM Strength** (Mera–Serantes, Oleiros): app de reservas de
entrenamiento personal, no una landing de marketing. Misma arquitectura que la demo de
Compostela Judo Club (`../compostela-judo`), adaptada a un centro de entrenamiento
personal: reservas de sesiones (individual, grupo reducido, equipo, readaptación de
lesiones), objetivo/nivel/restricciones médicas del cliente, panel de administrador con
calendario, CRM ligero de clientes y accesos, avisos y automatizaciones visuales.

Proyecto standalone: pensado para desplegarse como su propio proyecto en Vercel (rutas
de assets relativas a esta carpeta, no anidadas bajo `/clientes/rm-strength/`).

## Cómo arrancar

HTML/CSS/JS vanilla, sin build. Necesita un servidor estático — no funciona abriendo
`index.html` con `file://`.

Desde esta carpeta:

```
python -m http.server 8080
```

Abrir `http://localhost:8080/`. Navegación interna por hash.

Alumno/cliente: `#/inicio`, `#/reservar`, `#/mis-reservas`, `#/actividades`, `#/horarios`
(accesible desde Servicios), `#/avisos`, `#/perfil`.

Club (admin): `#/resumen`, `#/admin-reservas`, `#/admin-calendario`, `#/admin-alumnos`
(incluye la pestaña "Gestionar accesos"), `#/admin-grupos`, `#/admin-avisos`,
`#/admin-automatizaciones`, `#/admin-config`.

## Acceso de demostración

- **Cliente:** `cliente` / `cliente`.
- **Centro (admin):** `admin` / `admin`.

Botones de autorrelleno en la propia pantalla de login. Sin autenticación real.

## Qué es simulado

Igual que en `../compostela-judo`: todo el estado vive en memoria del navegador (se
pierde al recargar), no hay backend ni base de datos, y cada acción muestra un toast de
confirmación simulada en vez de hacer nada real. Ver el README de esa carpeta para el
detalle completo — la lógica y las garantías son las mismas, solo cambia el contenido de
negocio.

## Adaptaciones respecto a la plantilla de Compostela Judo Club

- Roles: "alumno" → "cliente" en todo el texto visible (rutas y nombres internos de
  variables se mantienen, son invisibles para quien usa la demo).
- Actividades → tipos de sesión: Entrenamiento individual, Grupo reducido,
  Entrenamiento de equipo, Readaptación de lesiones.
- El paso 2 del wizard ("Grupo o nivel") pasa a representar el **nivel de experiencia**
  (Principiante / Intermedio / Avanzado) en vez de un grupo por edad.
- El formulario de reserva añade **objetivo principal** (pérdida de grasa, ganancia
  muscular, rehabilitación, rendimiento, salud general) y **restricciones médicas**, en
  vez de nivel de judo y nombre de tutor.
- Las fichas de cliente (admin) sustituyen el cinturón por **objetivo / estado**
  (p. ej. "en proceso de pérdida de grasa", "fase de rehabilitación").
- Categoría de avisos "competición" eliminada (no aplica); se mantienen general,
  horarios, pagos y actividades.
- Automatizaciones incluye una entrada adicional (inactiva) de "Check-in de progreso"
  como base para futuros recordatorios de sesión/check-in — solo representada
  visualmente, sin lógica real, lista para activarse el día que se implemente.

## Datos de negocio usados

- Nombre: RM Strength — Centro de Entrenamiento Personal.
- Dirección: Praza da Bahía, 4, bajo, Mera – Serantes, 15173 Oleiros (A Coruña).
- Teléfono: 698 120 236.
- Instagram: instagram.com/rm_strength_.

Horarios, plazas y nombres de clientes son inventados para la demo; el centro debe
validarlos antes de publicar cualquier versión real.

## Archivos

- `index.html` — app shell (login, sidebar, topbar, bottom nav).
- `styles.css` — mismo sistema visual que Compostela Judo Club (sin cambios de marca).
- `data.js` — datos de negocio de RM Strength (actividades, niveles, horario, clientes,
  accesos, calendario admin, reservas admin, avisos). Editar aquí cuando el centro
  valide datos reales.
- `app.js` — router, wizard de reserva y renderizado de todas las vistas, adaptado con
  el vocabulario de RM Strength (cliente/sesión/objetivo en vez de
  alumno/clase/cinturón).
- `favicon.svg`, `vercel.json` — copiados para que la carpeta sea desplegable como
  proyecto Vercel independiente (Root Directory = `clientes/rm-strength`).
