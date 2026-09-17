# clientes/area-marcial

Demo comercial 1:1 para **Área Marcial** (Área Central, Santiago de Compostela): a
diferencia de `../compostela-judo` y `../rm-strength`, esta demo incluye una **web
pública completa** (marketing + captación de leads) delante de la misma app-shell de
alumno/admin. Mismo patrón que las otras dos: HTML/CSS/JS vanilla, sin backend, sin base
de datos real — todo el estado vive en memoria del navegador de esta pestaña.

Proyecto standalone: pensado para desplegarse como su propio proyecto en Vercel (rutas
de assets relativas a esta carpeta).

## Cómo arrancar

```
python -m http.server 8080
```

Abrir `http://localhost:8080/`. La web pública es la página de inicio; desde su cabecera
se accede al login/registro y, tras entrar, a la app privada (alumno o admin) sin salir
del mismo sistema visual.

Rutas internas de la app (tras iniciar sesión), por hash: `#/inicio`, `#/reservar`,
`#/mis-reservas`, `#/actividades`, `#/horarios` (desde Actividades), `#/avisos`,
`#/perfil` (alumno); `#/resumen`, `#/admin-reservas`, `#/admin-calendario`,
`#/admin-alumnos`, `#/admin-grupos`, `#/admin-solicitudes`, `#/admin-avisos`,
`#/admin-automatizaciones`, `#/admin-config` (admin).

## Credenciales de demostración

- **Alumno:** `alumno` / `alumno`.
- **Academia (admin):** `admin` / `admin`.
- **Registro:** el formulario "Crear cuenta" de la web pública da de alta una cuenta de
  alumno nueva en memoria (usuario = la parte del email antes de la `@`). Se pierde al
  recargar la página, como todo lo demás en esta demo.

Botones de autorrelleno en la pantalla de login para las dos cuentas fijas.

## Qué se puede probar

- **Web pública:** Inicio con CTAs, Disciplinas (Judo, Aikido, Aikido Iwama, Aikido
  Aiki-kai y tres programas marcados "bajo consulta"), Para quién es, Filosofía,
  Horarios (con filtros), formulario de Clase de prueba, Contacto (con enlaces de
  llamada/WhatsApp reales apuntando al teléfono público) y FAQ.
- **Solicitar clase de prueba** desde la web pública sin iniciar sesión: la solicitud
  aparece al instante en el panel admin → Solicitudes, con su propio pipeline de estados
  (nueva → contactada → pendiente de confirmación → confirmada → realizada → convertida
  en alumno → cerrada).
- **Alumno:** wizard de reserva de 7 pasos, Mis reservas, Disciplinas, Avisos (con
  contador de no leídos), Perfil — arquitectura idéntica a `../compostela-judo`.
- **Admin:** Resumen, Reservas, Calendario de clases (crear/editar/eliminar/pasar
  lista), Alumnos + Gestionar accesos, Disciplinas y grupos, **Solicitudes de clase de
  prueba** (sección nueva de esta demo), Avisos (publicar y verlo aparecer al instante
  en el panel de alumno), Automatizaciones visuales, Configuración de datos públicos.
- **Menú de usuario** (icono circular en la topbar de la app privada): Mi panel, Mi
  perfil, Mis reservas, Cerrar sesión — cerrar sesión devuelve a la web pública, no a
  una pantalla de login aislada.

## Qué es simulado

Igual que en las otras dos demos del repo: no hay backend, base de datos ni
autenticación real. El registro público solo añade una entrada en memoria a
`LOGIN_USERS`/`STUDENTS`; el formulario de contacto y el de clase de prueba no envían
nada a ningún servidor. Cada acción del panel admin muestra un toast de confirmación
simulada. Los horarios, plazas, alumnos y solicitudes son datos de ejemplo.

## Datos de negocio usados (públicos)

- Nombre: Área Marcial.
- Dirección: C. Cial. Área Central, Local 28A, 15707 Santiago de Compostela, A Coruña
  (planta alta, local 28A, esquina amarilla).
- Teléfono: 637 235 156.
- Instagram: instagram.com/area_marcial_santiago.
- Horario público orientativo: lunes a viernes, 18:00–21:00.
- Edad mínima anunciada: 4 años.
- Disciplinas confirmadas: Judo, Aikido, Aikido Iwama, Aikido Aiki-kai (programa GTMA).
- Programas de iniciación, adultos, y formación/competición: mencionados pero sin datos
  públicos suficientes — se muestran marcados como **"Programa disponible bajo
  consulta"**, nunca como confirmados.

No se han inventado precios, profesores, grados/títulos ni horarios específicos por
grupo: donde falta información pública, el texto dice "Consulta horarios y
disponibilidad" o equivalente.

## Qué habría que conectar en una versión real

- Registro/login y "Gestionar accesos" → autenticación real (o el proveedor que elija
  279studio) en vez de `LOGIN_USERS` en memoria.
- Formulario de clase de prueba y formulario de contacto → CRM real / email / WhatsApp
  (Twilio, n8n) en vez de un array en memoria.
- Reservas, calendario y asistencia → base de datos real con persistencia entre
  sesiones.
- Horarios y disciplinas → contenido validado y editado por la academia, sustituyendo
  los datos de ejemplo de `data.js`.
- Mapa de contacto → integración real de Google Maps con la ubicación de Área Central.

## Qué debe validar la academia antes de publicar

- Horarios reales por disciplina y grupo (todo lo mostrado es orientativo).
- Estructura real de grupos/niveles por edad.
- Si los tres "programas bajo consulta" (iniciación, adultos, formación/competición)
  deben presentarse como oferta propia o eliminarse de la web.
- Precios/cuotas (esta demo no muestra ninguno).
- Cualquier nombre, cinturón/grado o dato de alumno mostrado (los alumnos, accesos,
  solicitudes y avisos de esta demo son ficticios).

## Archivos

- `index.html` — web pública + login/registro + app shell de alumno/admin, todo en un
  único documento (visibilidad alternada por JS, no rutas de servidor).
- `styles.css` — sistema visual propio de Área Marcial (carbón cálido + carmesí +
  papel de arroz, tipografía Oswald/Inter), sin compartir tokens con las otras demos.
- `data.js` — datos de negocio, disciplinas, horario, alumnos, accesos, calendario
  admin, reservas admin, solicitudes de clase de prueba, avisos y FAQ.
- `app.js` — router, web pública, wizard de reserva y todas las vistas de alumno y
  panel de administración (incluida la gestión de solicitudes, nueva en esta demo).
- `favicon.svg`, `vercel.json` — para desplegar esta carpeta como proyecto Vercel
  independiente (Root Directory = `clientes/area-marcial`).
