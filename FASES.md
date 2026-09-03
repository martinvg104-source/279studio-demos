# FASES — elevación de las demos (galería + framing)

Plan aprobado en sesión previa; no había doc en el repo y se perdía entre sesiones.
Este archivo es la fuente de verdad del plan. Para el sistema visual de cada demo,
ver `DESIGN.md`.

---

## CTA — Opción 1 (aprobada)

**Banda de cabecera + banda de remate** (antes del pie) en cada pieza. **No** botón
flotante, **no** pop-up, **no** banner agresivo.

Contenido de las bandas:

- Logo 279studio — placeholder marcado `LOGO PLACEHOLDER`, mismo trato que el logo
  del cliente en las demos (se sustituye por el logotipo real más adelante).
- Enlace a `https://279studio.com`.
- Llamada a la acción. Copy de partida: **"¿Quieres esto para tu negocio?"**
  (ajustable; la intención no).

Tono: **suave**. Cada banda respeta la piel de su pieza (papel de cuaderno en
academia, sala de fisio en clínica, orden de trabajo en taller, neutro en la
galería) sin romper la identidad ya construida. Sin relleno sólido de alto
contraste tipo botón SaaS: la acción es un enlace fuerte con flecha, sobre
superficie tranquila y filete de 1px.

---

## Componente de framing — `.studio-strip`

Patrón **estructural**, no CSS compartido (regla de `DESIGN.md`: cada demo es
autocontenida). Cada pieza replica esta estructura en su propio `styles.css` con
sus tokens de color y tipografía. Implementación de referencia: `index.html`
(galería), skin neutro.

Estructura:

- `.studio-strip` — banda a todo el ancho. Modificadores `--head` y `--foot`.
- `.studio-strip--head` — va **debajo** de la cabecera del cliente. Wordmark
  279studio (izquierda) + micro-nota "Demo orientativa · nada se envía" (derecha).
  Fondo: el tono de superficie más sutil de la pieza. Filete inferior 1px en el
  color de línea de la pieza. Padding vertical `var(--s-2)`–`var(--s-3)`.
- `.studio-strip--foot` — va **antes** del `<footer>`. Pregunta CTA + una línea de
  apoyo + enlace "Hablar con 279studio →". Fondo: superficie tranquila de la pieza,
  filete superior 1px. Sin tarjeta, sin esquinas redondeadas marcadas, sin botón
  sólido.
- Tipografía y color: los de la pieza. Espaciado: escala común de múltiplos de 4.
- Accesible: `:focus-visible`, contraste de texto AA, respeta `prefers-reduced-motion`.
- Responsive: en móvil las dos zonas de cada banda se apilan.

---

## Fase 0 — criterio común no-visual · CERRADA

- Escala de espaciado: múltiplos de 4 (4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96).
  Ya presente en las 3 demos y en la galería.
- Patrón de cabecera (marca del cliente a la izquierda, dato de contexto a la
  derecha) y de pie (nota "demo · no se envía nada" + enlace a 279studio).
  Ya presente en las 3 demos.
- Componente de framing reutilizable `.studio-strip`: definido arriba.
- `favicon.svg` de la raíz + `theme-color` + `og:title` / `og:description` por
  página. Ya presente en las 4 páginas.
- Rutas de assets absolutas desde la raíz (`/genericas/<demo>/styles.css`, `app.js`)
  + `trailingSlash: true` en `vercel.json`. Fix del commit `adf2a55` — antes las
  demos se servían sin CSS en producción.

## Fase 1 — galería (`index.html`) · EN CURSO

Elevar a nivel premium; hoy parece un archivo suelto. **No** se rehace desde cero.

- Base que se conserva: wordmark 279studio, lista de 3 demos (motivo SVG + sector +
  nombre + qué resuelve), remate CTA.
- Aplicar CTA Opción 1: banda de cabecera + banda de remate, tono neutro, suave.
- Mismo rigor que en las 3 demos: sujeto real (el índice / hoja de contactos de un
  estudio), sin tells genéricos — nada de etiquetas en mono o mayúsculas con
  tracking, nada de tarjeta redondeada + botón sólido, iconos con presencia y no de
  relleno tipo placeholder.
- Revisión anti-tell antes de dar por bueno cualquier cambio visual.
- La galería sigue siendo neutra y con fuente de sistema: **no** es un cuarto mundo
  visual, es una lista.

## Fases 2-4 — framing por demo · PENDIENTES

Aplicar `.studio-strip` a cada demo individual, adaptado a su tono, para que abrir
`/genericas/<demo>` directo (sin pasar por la galería) se vea igual de "pieza de
279studio": su propia banda de cabecera + remate con CTA al final.

- Fase 2 — academia
- Fase 3 — clínica
- Fase 4 — taller

## Fase 5 — cierre · PENDIENTE

Revisión conjunta de las 4 páginas, capturas de navegador real, QA responsive y de
accesibilidad.

---

## Regla de verificación

Capturas de **navegador real** (no headless) antes de pasar de una fase a la
siguiente.
