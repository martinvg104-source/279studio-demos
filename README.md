# 279studio-demos

Galería de demos para enviar a leads. Un solo despliegue estático en Vercel.

## Estructura

```
279studio-demos/
├── index.html            Landing minimalista: lista las demos genéricas
├── DESIGN.md             Por qué cada demo se ve distinta — LEER antes de tocar CSS
├── vercel.json           Estático, cleanUrls, noindex
├── genericas/            Demos de catálogo, sin datos de cliente real
│   ├── academia/         "El horario de la academia" sobre papel de cuadrícula
│   ├── clinica/          "La hoja de admisión de fisio": silueta del cuerpo + sesiones
│   └── taller/           "La orden de trabajo que suma" piezas + mano de obra
└── clientes/             Demos 1:1 a medida (ver clientes/README.md)
```

## Técnico

- HTML/CSS/JS vanilla. Sin backend, sin build, sin dependencias.
- Cada demo es **autocontenida** (`index.html` + `styles.css` + `app.js` propios).
  No se comparte CSS/JS entre carpetas: personalizar una no rompe las demás.
- **Cada demo tiene su propio sistema visual independiente** (paleta, tipografía,
  principios). No hay un sistema único compartido — ver `DESIGN.md`. No unifiques
  paletas ni fuentes entre carpetas.
- Fuentes vía Google Fonts con fallback; el resto funciona offline.
- Nada se guarda ni se envía: los formularios son simulados. Sin pricing de 279studio.

## Rutas públicas

- `/` — galería
- `/genericas/academia`
- `/genericas/clinica`
- `/genericas/taller`
- `/clientes/<nombre>` — cuando se cree

## Despliegue

Repo conectado a Vercel por Git (`martinvg104-source/279studio-demos`, rama `main`).
Cada push a `main` genera un preview; se promociona a producción una vez revisado.
