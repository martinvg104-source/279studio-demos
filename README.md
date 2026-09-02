# 279studio-demos

Galería de demos para enviar a leads. Un solo despliegue estático en Vercel.

## Estructura

```
279studio-demos/
├── index.html            Landing minimalista: lista las demos genéricas
├── vercel.json           Estático, cleanUrls, noindex
├── genericas/            Demos de catálogo, sin datos de cliente real
│   ├── academia/         Academia Ejemplo — reserva de clases + lista de espera
│   ├── clinica/          Fisioterapia Ejemplo — agenda de citas + ficha paciente
│   └── taller/           Taller Ejemplo — cita + estimación + aviso coche listo
└── clientes/             Demos 1:1 a medida (ver clientes/README.md)
```

## Técnico

- HTML/CSS/JS vanilla. Sin backend, sin build, sin dependencias.
- Cada demo es **autocontenida** (`index.html` + `styles.css` + `app.js` propios).
  No se comparte CSS/JS entre carpetas: personalizar una no rompe las demás.
- Sistema visual: 279studio "Manual de Sistema" (ver `../DESIGN.md`).
  Fuentes vía Google Fonts con fallback; el resto funciona offline.
- Nada se guarda ni se envía: los formularios son simulados.

## Rutas públicas

- `/` — galería
- `/genericas/academia`
- `/genericas/clinica`
- `/genericas/taller`
- `/clientes/<nombre>` — cuando se cree

## Despliegue

Deploy directo de archivos a Vercel (sin repositorio). Primero a `preview`,
luego a `production` una vez revisado.
