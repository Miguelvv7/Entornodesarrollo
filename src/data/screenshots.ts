/**
 * CAPTURAS REALES DE INTELLIJ IDEA
 * ---------------------------------
 * Cada captura vive en  public/screenshots/<archivo>.
 * Para añadir una: guarda la imagen con EXACTAMENTE el nombre de `file`
 * dentro de public/screenshots/ y recarga la web. Si el archivo no existe,
 * se muestra un placeholder con el identificador y el texto "Captura pendiente".
 *
 * No hace falta tocar ninguna escena: todas leen de aquí.
 * Formato recomendado: PNG, 16:9 o 16:10, a la resolución nativa de tu pantalla.
 */

export interface Screenshot {
  /** Identificador estable (coincide con el hueco del guion, p. ej. CAPTURA_REAL_INTERFAZ) */
  id: ScreenshotId;
  /** Nombre del archivo dentro de public/screenshots/ */
  file: string;
  title: string;
  description: string;
}

export type ScreenshotId =
  | 'CAPTURA_REAL_INTERFAZ'
  | 'CAPTURA_REAL_PROYECTO'
  | 'CAPTURA_REAL_CONFIGURACION'
  | 'CAPTURA_REAL_PLUGINS'
  | 'CAPTURA_REAL_ACTUALIZACIONES'
  | 'CAPTURA_REAL_JDK'
  | 'CAPTURA_REAL_NUEVO_PROYECTO'
  | 'CAPTURA_REAL_CONFIGURACION_PROYECTO'
  | 'CAPTURA_REAL_MAIN'
  | 'CAPTURA_REAL_CODIGO'
  | 'CAPTURA_REAL_EJECUCION'
  | 'CAPTURA_REAL_DEBUG'
  | 'CAPTURA_REAL_BYTECODE'
  | 'CAPTURA_REAL_VENTANAS'
  | 'CAPTURA_REAL_BIENVENIDA'
  | 'CAPTURA_REAL_IA_DIFF'
  | 'CAPTURA_REAL_IA_RESPUESTA';

export const screenshots: Record<ScreenshotId, Screenshot> = {
  CAPTURA_REAL_INTERFAZ: {
    id: 'CAPTURA_REAL_INTERFAZ',
    file: 'interfaz.png',
    title: 'Nuestra ventana de IntelliJ IDEA (proyecto bateria10)',
    description: 'Ventana completa con un proyecto abierto: barra superior, ventanas de herramientas, árbol del proyecto, editor y barra de estado.',
  },
  CAPTURA_REAL_PROYECTO: {
    id: 'CAPTURA_REAL_PROYECTO',
    file: 'proyecto.png',
    title: 'Proyecto real: bateria10 (creado en Eclipse) abierto en IntelliJ',
    description: 'Panel Project con la carpeta .settings de Eclipse y bin con las clases compiladas.',
  },
  CAPTURA_REAL_CONFIGURACION: {
    id: 'CAPTURA_REAL_CONFIGURACION',
    file: 'configuracion.png',
    title: 'Menú de ajustes (⚙): Settings, Theme, Keymap…',
    description: 'Menú del engranaje de la barra superior con Settings, Backup and Sync, Theme, Keymap y View Mode.',
  },
  CAPTURA_REAL_PLUGINS: {
    id: 'CAPTURA_REAL_PLUGINS',
    file: 'plugins.png',
    title: 'Settings → Plugins en nuestro IntelliJ',
    description: 'Plugins incluidos (Bundled) y sugeridos con su botón Install: Spring Debugger, Kotlin Multiplatform, Key Promoter X, IdeaVim…',
  },
  CAPTURA_REAL_ACTUALIZACIONES: {
    id: 'CAPTURA_REAL_ACTUALIZACIONES',
    file: 'actualizaciones.png',
    title: 'Aviso real: "Update 6 Plugins…"',
    description: 'El menú del engranaje avisa de que hay 6 plugins con actualización disponible.',
  },
  CAPTURA_REAL_JDK: {
    id: 'CAPTURA_REAL_JDK',
    file: 'jdk.png',
    title: 'JDK del proyecto',
    description: 'File → Project Structure → Project, con el SDK seleccionado.',
  },
  CAPTURA_REAL_NUEVO_PROYECTO: {
    id: 'CAPTURA_REAL_NUEVO_PROYECTO',
    file: 'nuevo-proyecto.png',
    title: 'Paso 1 · Asistente New Project con Java seleccionado',
    description: 'Asistente de nuevo proyecto: tipo Java, generadores (Maven Archetype, Spring Boot, JavaFX…) y opciones.',
  },
  CAPTURA_REAL_CONFIGURACION_PROYECTO: {
    id: 'CAPTURA_REAL_CONFIGURACION_PROYECTO',
    file: 'configuracion-proyecto.png',
    title: 'Paso 2 · PrimerProyecto, build system IntelliJ y JDK 21',
    description: 'Nombre PrimerProyecto, ubicación ~/Desktop, Build system IntelliJ y JDK 21 (Azul Zulu).',
  },
  CAPTURA_REAL_MAIN: {
    id: 'CAPTURA_REAL_MAIN',
    file: 'main.png',
    title: 'Paso 3 · Clase Main creada en el paquete',
    description: 'Clase Main creada dentro de src y abierta en el editor.',
  },
  CAPTURA_REAL_CODIGO: {
    id: 'CAPTURA_REAL_CODIGO',
    file: 'codigo.png',
    title: 'Escribiendo con el autocompletado de IntelliJ',
    description: 'El programa de la escena 10 escrito en el editor de IntelliJ IDEA.',
  },
  CAPTURA_REAL_EJECUCION: {
    id: 'CAPTURA_REAL_EJECUCION',
    file: 'ejecucion.png',
    title: 'Consola Run: Vuelta 1-3 y suma = 6',
    description: 'Ventana Run con la salida del programa y "Process finished with exit code 0".',
  },
  CAPTURA_REAL_DEBUG: {
    id: 'CAPTURA_REAL_DEBUG',
    file: 'debug.png',
    title: 'Parado en el breakpoint: contador = 1, suma = 0',
    description: 'Programa detenido en un breakpoint, con el panel Debug mostrando las variables.',
  },
  CAPTURA_REAL_BYTECODE: {
    id: 'CAPTURA_REAL_BYTECODE',
    file: 'bytecode.png',
    title: 'Bytecode real: "bytecode version 65.0 (Java 21)"',
    description: 'IntelliJ abre un .class compilado y lo descompila para poder leerlo.',
  },
  CAPTURA_REAL_VENTANAS: {
    id: 'CAPTURA_REAL_VENTANAS',
    file: 'ventanas.png',
    title: 'Ventanas de herramientas (⌘0, ⌘3, ⌘4, ⌘5…)',
    description: 'Lista de ventanas de herramientas: Commit, Find, Run, Debug, Coverage, Profiler, TODO…',
  },
  CAPTURA_REAL_BIENVENIDA: {
    id: 'CAPTURA_REAL_BIENVENIDA',
    file: 'bienvenida.png',
    title: 'Pantalla de bienvenida: tema y keymap activos',
    description: 'Barra inferior de la pantalla de bienvenida con Plugins, Theme: Islands Dark y Keymap: IntelliJ (macOS).',
  },
  CAPTURA_REAL_IA_DIFF: {
    id: 'CAPTURA_REAL_IA_DIFF',
    file: 'ia-diff.png',
    title: 'El agente propone el cambio (en verde) y lo compila',
    description: 'Sesión de IA dentro de IntelliJ corrigiendo ej250.java: muestra las líneas añadidas y prueba el programa.',
  },
  CAPTURA_REAL_IA_RESPUESTA: {
    id: 'CAPTURA_REAL_IA_RESPUESTA',
    file: 'ia-respuesta.png',
    title: 'Explicación del arreglo paso a paso',
    description: 'El agente explica qué faltaba (el bucle while) y cómo funciona la solución.',
  },
};

export const screenshotSrc = (id: ScreenshotId) =>
  `${import.meta.env.BASE_URL}screenshots/${screenshots[id].file}`;
