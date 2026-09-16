# Sistema visual — 279studio-demos

**No hay un sistema visual único en este repo.** Cada demo de `genericas/` tiene su
**propio sistema independiente** (paleta, tipografía, layout, principios y movimiento).
Se hizo así a propósito: son mundos distintos, no variaciones de una plantilla.

> El plan de elevación (galería + framing 279studio por fases, y el CTA "Opción 1"
> aprobado) vive en [`FASES.md`](FASES.md). El componente de framing `.studio-strip`
> se define ahí y se replica —sin CSS compartido— en cada pieza.

## Por qué

La primera versión compartía un sistema único ("Manual de Sistema": fondo grafito
casi negro + un solo ámbar de acento, etiquetas en monoespaciado y mayúsculas,
numeración `00 / X`, sellos rotados). El resultado eran tres demos idénticas
cambiando el color de acento — el patrón exacto que se lee como diseño genérico /
"de IA". Se sustituyó dando a cada demo el mundo visual de **su negocio real**.

## Reglas al tocar este repo

- **No compartas CSS ni JS entre `genericas/academia`, `genericas/clinica` y
  `genericas/taller`.** Cada carpeta es autocontenida: `index.html` + `styles.css`
  + `app.js` propios. Personalizar una no debe tocar las otras.
- **No unifiques las paletas ni las tipografías.** Si algo "se parece" entre dos
  demos, es coincidencia, no un token compartido que haya que extraer.
- Los `clientes/` que se creen se duplican de la genérica del nicho y se editan
  solo dentro de su carpeta (ver `clientes/README.md`).
- `index.html` (la galería) es deliberadamente neutro y mínimo (fuente de sistema,
  sin numeración). No es un cuarto "mundo"; es una lista. Sí lleva la marca 279studio
  (wordmark provisional marcado como `LOGO PLACEHOLDER` en cabecera y pie) y un bloque
  de CTA a 279studio.com al final: la galería es la única página con identidad de
  estudio; las demos siguen mostrando la marca del cliente en su cabecera.

## Lo esencial de cada demo

### genericas/academia — "El horario de la academia"
- **Sujeto:** academia de idiomas / refuerzo. Artefacto central: el horario semanal
  pegado en la puerta, sobre papel de cuadrícula.
- **Color:** blanco de cuaderno `#FCFCFB` + cuadrícula azul `#D3E0F2` + verde
  encerado `#26402F` (acción y casilla elegida) + azul estilográfica `#14315C`
  (enlaces, etiquetas). El rojo apagado `#D98A86` solo es la raya de margen del
  cuaderno y el borde de error nativo — nunca lleva texto.
- **Tipografía:** Zilla Slab (titulares, slab de hoja impresa) + Hanken Grotesk
  (cuerpo). `tabular-nums` para las horas. Sin monospace.
- **Interacción:** reservas tocando una casilla de la rejilla día × hora; se
  "colorea" en verde con un check a mano. "Completa" = trama a lápiz + texto.
- **Principio:** el horario es la interfaz; marcas de profesor, no badges.

### genericas/clinica — "La hoja de admisión de fisio"
- **Sujeto:** centro de fisioterapia. Artefacto central: la hoja de admisión con
  la silueta del cuerpo y el plan de sesiones.
- **Color:** avena cálido `#F4F1E8` + canto de madera `#C9A876` + petrol
  `#12494E` (acción y estructura) + coral de kinesio tape `#DF6B4F` (zona marcada
  y cita elegida — **solo relleno/forma, nunca texto**). Verde sabio `#7BA894`
  solo como trazo gráfico (arco de movilidad). Rojo `#C6584B` solo error/aviso.
- **Tipografía:** Bricolage Grotesque (titulares, con carácter) + Public Sans
  (formulario). `tabular-nums` para grados y sesiones. Sin monospace.
- **Interacción:** marcas en una silueta frente/espalda dónde te molesta, eliges
  hueco con un terapeuta, y un track ilustrativo muestra la recuperación sesión a
  sesión (dolor que baja + arco de movilidad que se abre).
- **Principio:** el cuerpo primero; sala de fisio, no hospital.

### genericas/taller — "La orden de trabajo que suma"
- **Sujeto:** taller mecánico. Artefacto central: la orden de trabajo (OT) que se
  rellena y hace la cuenta.
- **Color:** hormigón cálido `#E7E5DF` + acero `#F3F2EF` + tinta negra de
  formulario `#1C1B18` + **un amarillo de seguridad `#F0A500`** (acción, servicio
  marcado, banda del total). Azul de mono `#3E4C59` para matrícula/km/enlaces.
  Rojo `#B23A2E` solo para la línea "ITV caduca".
- **Tipografía:** Saira Semi Condensed (rótulos, técnica y condensada) + Barlow
  (formulario). `tabular-nums` para km, códigos y precios. Sin monospace.
- **Interacción:** marcas los trabajos de un checklist y la estimación se
  construye línea a línea (piezas + mano de obra, subtotal, total orientativo);
  luego eliges hueco de entrada. El nº de OT aparece solo al confirmar.
- **Principio:** la OT es la interfaz; marcos completos, nunca acentos a un lado;
  el énfasis del total es una banda horizontal, no una franja lateral.

## Reflejos comunes (lo único que sí comparten)

Son criterios de calidad, no tokens. **No hay CSS compartido**: cada demo replica el
criterio en su propio archivo, con sus colores y su tipografía.

- Escala de espaciado común (múltiplos de 4: 4/8/12/16/24/32/48/64/96) para que el
  ritmo vertical sea coherente entre demos aunque cambie la piel.
- Patrón de cabecera (marca del cliente a la izquierda, dato de contexto a la derecha)
  y de pie (nota "demo · no se envía nada" + enlace a 279studio) repetido en las tres.
- Todas las páginas: `favicon.svg` de la raíz, `theme-color` con el color de marca de
  esa demo, y `og:title` / `og:description` propios (para que el enlace se vea bien al
  compartirlo por WhatsApp o email).

Además:
- Ningún acento en un solo borde de una tarjeta (side-tab / stripe).
- Ningún easing con rebote/elástico (overshoot); ease-out y punto.
- Nada de etiquetas en monoespaciado y mayúsculas; nada de numeración de pasos
  salvo que el contenido sea una secuencia real.
- Estados nunca solo por color (trama + texto + `aria-label`).
- `:focus-visible`, `prefers-reduced-motion`, contraste de texto AA, responsive a
  móvil, y "demo orientativa, no se envía nada" visible.

## clientes/compostela-judo — app-shell de reservas del club

Demo 1:1 para Centro Deportivo Compostela Judo Club (ver `clientes/compostela-judo/README.md`).
No es una `genericas/`, pero sigue la misma regla: mundo visual propio, autocontenido,
sin CSS/JS compartido con el resto del repo. **Reemplaza** una versión anterior de esta
demo que era una landing editorial de marketing ("la ficha de cinturón sobre el
tatami") — el cliente pidió en su lugar una web-app con sistema de reservas como
núcleo, así que el sujeto y la interacción cambiaron por completo.

- **Sujeto:** no es una landing, es el "app shell" del club con dos roles simulados —
  sidebar en escritorio, bottom nav en móvil, router por hash vanilla. Alumno: Inicio,
  Reservar, Mis reservas, Actividades, Avisos, Perfil (Horarios es una vista más,
  accesible desde Actividades). Administrador: Resumen, Reservas, Calendario, Alumnos
  (incluye gestión de accesos), Grupos y actividades, Avisos y comunicaciones,
  Automatizaciones, Configuración. El artefacto central es el wizard de reserva de 7
  pasos con una barra de progreso simple (sin el motivo de cinturón como protagonista);
  el cinturón sobrevive solo como chip de nivel en Perfil y en fichas de alumno.
- **Color:** fondo gris muy suave `#f2f4f7`, tarjetas blancas con sombra sutil sobre
  estructura azul marino/carbón `#0f172a` (sidebar, cabeceras de tarjeta oscuras) y
  acción naranja cálida `#ea670f`. Estados con color semántico (pendiente ámbar,
  confirmada/éxito verde, completada azul info, cancelada rojo) siempre con texto, no
  solo color. Chips de cinturón (`#f4f1ea` `#e8c547` `#ec9a35` `#4c8c5a` `#2c5fa8`
  `#7b5230` `#1a1a1a`) solo en Perfil.
- **Tipografía:** Manrope (una sola familia, titulares y cuerpo) — deliberadamente más
  "producto/app" que editorial, para no competir visualmente con la navegación
  persistente. No se usa en ninguna `genericas/` ni en la versión anterior de esta
  carpeta.
- **Interacción:** reserva como vista de primer nivel (no modal) con wizard de 7 pasos
  y calendario mensual propio (sin librería); "Horarios" con alternancia semana/mes y
  detalle de clase; avisos publicados desde el admin aparecen al instante en la bandeja
  del alumno (con contador de no leídos en el nav); panel de administrador con tablas
  de fila + acciones (confirmar/cancelar/asistencia), modales de creación/edición
  (clases, alumnos, accesos, avisos, actividades/grupos) y automatizaciones con
  interruptores visuales — todo simulado vía toast, nada persiste ni se envía.
- **Principio:** se siente como la aplicación semanal del club, no como una página que
  se lee una vez; información corta, acciones grandes, navegación siempre visible.

## Fuera de este repo

`../DESIGN.md` (repo `279studio`, en el directorio superior) describe el sistema
visual del **sitio de 279studio.com**, no el de estas demos. Son cosas distintas;
no las cruces.
