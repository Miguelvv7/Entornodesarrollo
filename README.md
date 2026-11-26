# IntelliJ IDEA — Beyond the Code

Presentación interactiva para la **Actividad 2.3 · Análisis de un Entorno Integrado de Desarrollo (IDE)**
del módulo Entornos de Desarrollo (1.º DAM · IES Antonio Gala).

16 escenas a pantalla completa (16:9), con grabaciones reales de IntelliJ, modo presentador con notas y temporizador, y exportación automática a PDF.

## Arrancar

Necesitas Node.js 18 o superior.

```bash
npm install
npm run dev          # abre http://localhost:5173
```

## Controles durante la exposición

| Tecla | Acción |
|---|---|
| → · espacio · AvPág | Siguiente escena |
| ← · RePág | Escena anterior |
| F | Pantalla completa |
| S | Índice de secciones |
| N | Notas del presentador + temporizador de 10 min |
| Esc | Cerrar paneles, zonas o capturas ampliadas |
| F8 | Siguiente paso en la escena de depuración |

Los controles se ocultan solos a los 2,6 s sin mover el ratón.
Desde el panel de notas puedes abrir la **vista del presentador en otra ventana** (se sincroniza con la presentación): pon la presentación en el proyector y las notas en tu pantalla.

## Añadir las capturas reales

1. Haz las capturas en IntelliJ IDEA.
2. Guárdalas en `public/screenshots/` con el nombre exacto que indica `src/data/screenshots.ts`
   (también aparece en cada placeholder de la web).
3. Recarga la página: la captura sustituye al placeholder automáticamente.

| Identificador | Archivo | Escena | Estado |
|---|---|---|---|
| CAPTURA_REAL_INTERFAZ | interfaz.png | 04 | ✅ |
| (menús reales) | menus/*.png | 04 | ✅ |
| CAPTURA_REAL_VENTANAS | ventanas.png | 04 | ✅ |
| CAPTURA_REAL_PROYECTO | proyecto.png | 05 | ✅ |
| CAPTURA_REAL_CONFIGURACION | configuracion.png | 06 | ✅ |
| CAPTURA_REAL_BIENVENIDA | bienvenida.png | 06 | ✅ |
| CAPTURA_REAL_PLUGINS | plugins.png | 07 | ✅ |
| CAPTURA_REAL_ACTUALIZACIONES | actualizaciones.png | 07 | ✅ |
| CAPTURA_REAL_BYTECODE | bytecode.png | 08 | ✅ |
| CAPTURA_REAL_NUEVO_PROYECTO | nuevo-proyecto.png | 09 | ✅ |
| CAPTURA_REAL_CONFIGURACION_PROYECTO | configuracion-proyecto.png | 09 | ✅ |
| CAPTURA_REAL_MAIN | main.png | 09 | ✅ |
| CAPTURA_REAL_CODIGO | codigo.png | 10 | ✅ |
| CAPTURA_REAL_EJECUCION | ejecucion.png | 10 | ✅ |
| CAPTURA_REAL_DEBUG | debug.png | 11 | ✅ |
| CAPTURA_REAL_IA_DIFF · IA_RESPUESTA | ia-diff.png · ia-respuesta.png | 12 | ✅ |

Al añadir `interfaz.png`, ajusta las zonas interactivas de la escena 04 en `src/data/interfaceZones.ts`
(son porcentajes sobre la imagen).

Para que el programa de las escenas 10 y 11 coincida con las capturas, usad en IntelliJ el mismo código que aparece en la web
(`src/scenes/S10Run.tsx` y `src/scenes/S11Debug.tsx`).

## Vídeos

Las grabaciones reales están en `public/videos/` (crear-proyecto, ejecutar, depurar e ia). Se abren con el botón "Ver nuestra grabación" de las escenas 09–11 y se reproducen dentro de la escena 12. En el PDF se sustituyen por fotogramas.

## Contenido editable

Todo está en `src/data/content.ts`:

- `meta.authors`: autores de la presentación.
- `scenes[].notes`: notas del presentador de cada escena.
- `verdict`: la valoración personal (escena 14). Mientras esté vacía, la escena muestra las preguntas guía y la etiqueta "Pendiente de redactar".
- `sources`: webgrafía.

## Exportar el PDF de entrega

```bash
npx playwright install chromium   # solo la primera vez
npm run pdf
```

Genera `exports/IntelliJ-IDEA-Beyond-the-Code.pdf`: 16 páginas horizontales 1920×1080, una por escena,
con las capturas, la versión estática de cada simulación, la webgrafía completa y sin controles ni notas.
La vista de impresión también se puede abrir en `http://localhost:5173/?print`.

## Estructura

```
src/
  data/         contenido, capturas y zonas de la interfaz (lo que se edita)
  scenes/       las 16 escenas
  components/   lienzo 16:9, editor de código, capturas, controles
  hooks/        navegación y temporizador
  PrintView.tsx vista estática para el PDF
scripts/export-pdf.mjs   exportación con Playwright
public/screenshots/      capturas reales
```

Tecnologías: React, TypeScript, Vite, Tailwind CSS, Framer Motion y Lucide.
