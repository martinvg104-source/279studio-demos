# clientes/

Demos 1:1 hechas a medida para un prospect real. Una carpeta por cliente.

## Cómo añadir un cliente

1. Duplica la demo genérica del nicho que toque, p. ej.:
   ```
   cp -r genericas/academia clientes/<nombre-cliente>
   ```
2. En `clientes/<nombre-cliente>/`, edita **solo** `index.html`, `styles.css` y `app.js`
   de esa carpeta. Cada demo es autocontenida: cambiar una no afecta a las demás.
3. Sustituye los datos de ejemplo por los reales del cliente: nombre del negocio,
   logotipo (marcado como `<!-- LOGO PLACEHOLDER -->`), horarios, servicios,
   textos y datos de contacto ya validados.
4. La ruta pública queda como `/clientes/<nombre-cliente>`.

## Reglas

- No inventar precios, datos de contacto ni textos legales que no estén validados.
- Mantener el pie de página discreto de 279studio.
- No enlazar estas demos desde el `index.html` de la galería salvo que se pida:
  las demos de cliente se comparten por enlace directo.
