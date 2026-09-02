# Sistema visual — 279studio-demos

**No hay un sistema visual único en este repo.** Cada demo de `genericas/` tiene su
**propio sistema independiente** (paleta, tipografía, layout, principios y movimiento).
Se hizo así a propósito: son mundos distintos, no variaciones de una plantilla.

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
  sin numeración, sin mayúsculas de etiqueta). No es un cuarto "mundo"; es una lista.

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

Son criterios de calidad, no tokens:
- Ningún acento en un solo borde de una tarjeta (side-tab / stripe).
- Ningún easing con rebote/elástico (overshoot); ease-out y punto.
- Nada de etiquetas en monoespaciado y mayúsculas; nada de numeración de pasos
  salvo que el contenido sea una secuencia real.
- Estados nunca solo por color (trama + texto + `aria-label`).
- `:focus-visible`, `prefers-reduced-motion`, contraste de texto AA, responsive a
  móvil, y "demo orientativa, no se envía nada" visible.

## Fuera de este repo

`../DESIGN.md` (repo `279studio`, en el directorio superior) describe el sistema
visual del **sitio de 279studio.com**, no el de estas demos. Son cosas distintas;
no las cruces.
