/**
 * Barra de menús real de IntelliJ IDEA en macOS (escena 04, pestaña "Menús").
 * Cada imagen es un recorte de nuestras capturas: public/screenshots/menus/<id>.png
 * Las opciones grises están desactivadas porque el archivo abierto era un .class de solo lectura.
 */
export interface MenuInfo {
  id: string;
  label: string;
  summary: string;
  highlights: { item: string; key?: string }[];
  /** tamaño del recorte en píxeles */
  w: number;
  h: number;
}

export const menus: MenuInfo[] = [
  {
    id: 'file', w: 480, h: 1104, label: 'File',
    summary: 'Proyectos y configuración general: crear, abrir, cerrar, estructura del proyecto y plugins.',
    highlights: [{ item: 'New / Open… / Close Project' }, { item: 'Project Structure…', key: '⌘;' }, { item: 'Plugins…' }, { item: 'Local History' }],
  },
  {
    id: 'edit', w: 700, h: 1482, label: 'Edit',
    summary: 'Edición del texto: deshacer, copiar y pegar, buscar y selección múltiple.',
    highlights: [{ item: 'Undo / Redo', key: '⌘Z · ⇧⌘Z' }, { item: 'Find · Find Usages' }, { item: 'Duplicate Line or Selection', key: '⌘D' }, { item: 'Macros · Bookmarks' }],
  },
  {
    id: 'view', w: 548, h: 838, label: 'View',
    summary: 'Qué se ve en pantalla: ventanas de herramientas, apariencia y archivos recientes.',
    highlights: [{ item: 'Tool Windows · Appearance' }, { item: 'Quick Definition', key: '⌥Espacio' }, { item: 'Show Bytecode' }, { item: 'Recent Files', key: '⌘E' }],
  },
  {
    id: 'navigate', w: 514, h: 1458, label: 'Navigate',
    summary: 'Moverse por el código: buscar clases, archivos y símbolos, o saltar a declaraciones.',
    highlights: [{ item: 'Search Everywhere' }, { item: 'Class… · File…', key: '⌘O · ⇧⌘O' }, { item: 'Declaration or Usages', key: '⌘B' }, { item: 'Call Hierarchy', key: '⌃⌥H' }],
  },
  {
    id: 'code', w: 672, h: 1602, label: 'Code',
    summary: 'Ayudas para escribir código: generar métodos, completar, inspeccionar, comentar y formatear.',
    highlights: [{ item: 'Generate…', key: '⌘N' }, { item: 'Inspect Code… · Code Cleanup…' }, { item: 'Reformat Code', key: '⌥⌘L' }, { item: 'Optimize Imports', key: '⌃⌥O' }],
  },
  {
    id: 'refactor', w: 520, h: 342, label: 'Refactor',
    summary: 'Cambiar la estructura del código sin romperlo.',
    highlights: [{ item: 'Refactor This…', key: '⌃T' }, { item: 'Rename…', key: '⇧F6' }, { item: 'Copy…', key: 'F5' }, { item: 'Migrate Packages and Classes' }],
  },
  {
    id: 'build', w: 398, h: 412, label: 'Build',
    summary: 'Compilar: el proyecto completo, un módulo o volver a compilar desde cero.',
    highlights: [{ item: 'Build Project', key: '⌘F9' }, { item: 'Rebuild Project' }, { item: 'Build Artifacts…' }],
  },
  {
    id: 'run', w: 608, h: 1106, label: 'Run',
    summary: 'Ejecutar, depurar, tests y cobertura. Las primeras opciones salen en gris porque el archivo abierto no es ejecutable.',
    highlights: [{ item: 'Run… · Debug…', key: '⌃⌥R · ⌃⌥D' }, { item: 'Toggle Breakpoint · View Breakpoints…', key: '⇧⌘F8' }, { item: 'Manage Coverage Reports…', key: '⌥⌘F6' }, { item: 'Attach Profiler to Process…' }],
  },
  {
    id: 'tools', w: 580, h: 776, label: 'Tools',
    summary: 'Herramientas extra: documentación, cliente HTTP, análisis de seguridad, asistente de IA y despliegue.',
    highlights: [{ item: 'Generate Javadoc…' }, { item: 'HTTP Client · Security Analysis' }, { item: 'Ask Agent with Context' }, { item: 'Deployment · Start SSH Session…' }],
  },
];

export const menuSrc = (id: string) => `${import.meta.env.BASE_URL}screenshots/menus/${id}.png`;
