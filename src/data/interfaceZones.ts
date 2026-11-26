/**
 * Zonas interactivas de la escena 04 sobre public/screenshots/interfaz.png
 * (nuestra captura real del proyecto bateria10).
 * Coordenadas en % de la imagen: x, y, ancho, alto.
 * `detail` = captura adicional que se muestra al seleccionar la zona.
 */
import type { ScreenshotId } from './screenshots';

export interface Zone {
  id: string;
  title: string;
  text: string;
  shortcut?: string;
  detail?: ScreenshotId;
  rect: { x: number; y: number; w: number; h: number };
}

export const interfaceZones: Zone[] = [
  {
    id: 'toolbar',
    title: 'Barra superior',
    text: 'Selector de proyecto (bateria10), control de versiones con Git, búsqueda global y el menú de ajustes del engranaje.',
    shortcut: '⇧⇧ buscar en todo',
    rect: { x: 0, y: 0, w: 61.2, h: 4.6 },
  },
  {
    id: 'run',
    title: 'Ejecutar y depurar',
    text: 'Configuración de ejecución ("Current File") con los botones Run y Debug. Aquí salen en gris porque un .class compilado no se puede ejecutar.',
    shortcut: '⌃R ejecutar · ⌃D depurar',
    rect: { x: 61.4, y: 0, w: 14.4, h: 4.6 },
  },
  {
    id: 'tools',
    title: 'Ventanas de herramientas',
    text: 'Barra lateral de iconos: proyecto, estructura, terminal, problemas, Git… Desde aquí se abren la consola Run y el depurador Debug cuando se ejecuta un programa.',
    shortcut: '⌘1 proyecto · ⌘4 Run · ⌘5 Debug',
    detail: 'CAPTURA_REAL_VENTANAS',
    rect: { x: 0, y: 4.6, w: 2.8, h: 92 },
  },
  {
    id: 'project',
    title: 'Explorador de proyectos',
    text: 'Árbol del proyecto. Nuestro bateria10 se creó con Eclipse (por eso tiene .settings) e IntelliJ lo abre directamente.',
    shortcut: '⌘1',
    rect: { x: 2.9, y: 4.8, w: 27.6, h: 91.6 },
  },
  {
    id: 'editor',
    title: 'Editor central',
    text: 'Pestañas de archivos y código con colores. Al abrir ej223.class, IntelliJ lo descompila y avisa: bytecode versión 65.0, es decir, Java 21.',
    shortcut: '⌘E archivos recientes',
    rect: { x: 30.8, y: 4.8, w: 66.5, h: 91.6 },
  },
  {
    id: 'status',
    title: 'Barra de estado',
    text: 'Ruta del archivo (bateria10 › bin › ej223.class) y datos del editor: posición 6:27 (línea:columna), saltos de línea LF, codificación UTF-8 e indentación de 4 espacios.',
    rect: { x: 0, y: 96.6, w: 100, h: 3.4 },
  },
];
