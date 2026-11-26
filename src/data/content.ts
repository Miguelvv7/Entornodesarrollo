/**
 * CONTENIDO EDITABLE DE LA PRESENTACIÓN
 * -------------------------------------
 * Todo el texto "académico" (autores, notas del presentador, valoración,
 * webgrafía) se edita aquí sin tocar los componentes.
 */

export const meta = {
  title: 'IntelliJ IDEA',
  tagline: 'Beyond the code',
  subtitle: 'Descubre el entorno donde las ideas se convierten en código.',
  authors: ['Miguel Victorio Villalón', 'Luis Miguel Castel Osuna', 'Daniel Castro Martín'],
  course: '1.º DAM · Entornos de Desarrollo',
  activity: 'Actividad 2.3 · Análisis de un Entorno Integrado de Desarrollo',
  school: 'IES Antonio Gala · Palma del Río',
  year: 'Curso 2026/27',
};

/** "A, B y C" */
export const authorsText = (a: string[] = meta.authors) => (a.length < 2 ? a.join('') : `${a.slice(0, -1).join(', ')} y ${a[a.length - 1]}`);

export type SectionId = 'intro' | 'ide' | 'tools' | 'action' | 'verdict';

export const sections: Record<SectionId, string> = {
  intro: 'Introducción',
  ide: 'El IDE',
  tools: 'Personalización',
  action: 'En acción',
  verdict: 'Veredicto',
};

export interface SceneMeta {
  key: string;
  code: string; // título corto en inglés (identidad visual)
  title: string; // título en español
  section: SectionId;
  /** segundos orientativos para la exposición */
  seconds: number;
  notes: string[];
  /** preguntas que puede hacer la profesora, con respuesta corta (solo en el panel de notas) */
  qa?: { q: string; a: string }[];
  /** si existe, al avanzar se muestra una segunda pantalla con nuestra grabación real */
  video?: { file: string; title: string; speed?: string; chapters: { t: number; label: string }[] };
}

export const scenes: SceneMeta[] = [
  {
    key: 'beginning', code: 'The Beginning', title: 'Portada', section: 'intro', seconds: 20,
    notes: [
      'Saludo y presentación: somos Miguel, Daniel y Luis Miguel y vamos a analizar IntelliJ IDEA.',
      'En vez de diapositivas hemos hecho una web: así podemos enseñar el IDE "en movimiento".',
      'Pulsar "Comenzar experiencia".',
    ],
  },
  {
    key: 'meet', code: 'Meet IntelliJ', title: '¿Qué es IntelliJ IDEA?', section: 'intro', seconds: 45,
    notes: [
      'Es un IDE pensado sobre todo para Java y Kotlin, desarrollado por JetBrains desde 2001.',
      'Licencia: desde la versión 2025.3 es un único producto. Hay un núcleo gratuito y una suscripción Ultimate para las funciones avanzadas.',
      'Nosotros usamos la licencia educativa gratuita (la conseguimos con GitHub Student Developer Pack).',
      'Funciona en Windows, macOS y Linux.',
    ],
  },
  {
    key: 'smart-editor', code: 'The Smart Editor', title: 'Un editor que entiende el código', section: 'ide', seconds: 40,
    notes: [
      'Lo que más lo diferencia: analiza el código mientras escribimos.',
      'Pulsar Autocompletado: sugiere métodos según el tipo de la variable.',
      'Pulsar Errores: subraya el fallo antes de compilar y propone arreglo con ⌥↩.',
      'Pulsar Refactorizar: renombra una variable en todos los sitios a la vez (⇧F6).',
      'Aclarar que es una simulación hecha en la web.',
    ],
  },
  {
    key: 'inside', code: 'Inside the IDE', title: 'La interfaz por dentro', section: 'ide', seconds: 50,
    notes: [
      'Es nuestra propia ventana de IntelliJ con el proyecto bateria10 (de Eclipse) abierto.',
      'Pestaña Zonas: barra superior, Run/Debug, ventanas de herramientas, proyecto, editor y barra de estado.',
      'Curiosidad: abrimos un .class y IntelliJ lo descompila (bytecode 65.0 = Java 21).',
      'Pestaña Menús: enseñar File, Code, Refactor y Run con las capturas reales.',
    ],
  },
  {
    key: 'structure', code: 'Project Structure', title: 'Gestión de proyectos (punto extra)', section: 'ide', seconds: 80,
    notes: [
      'PUNTO EXTRA: no lo hemos dado en clase, pero IntelliJ pregunta el "Build system" al crear un proyecto.',
      'Problema: librerías de otros (JUnit), que compile igual en cualquier ordenador e IDE, y repetir siempre compilar → probar → empaquetar.',
      'Idea: es una receta. Escribimos los ingredientes (librerías) y la herramienta los consigue y cocina el programa siempre igual.',
      'Maven: pom.xml (XML). Añadir JUnit → cargar cambios (baja de Maven Central) → compilar: compile, test, package → .jar en target.',
      'Gradle: Kotlin, una línea por librería. Compilar dos veces → UP-TO-DATE, menos de 1 s. Oficial de Android.',
      'IntelliJ propio: librerías a mano y solo funciona en IntelliJ. Para clase vale; en un proyecto real, Maven o Gradle. IntelliJ ya los trae.',
    ],
    qa: [
      { q: '¿Qué es un sistema de compilación?', a: 'Una herramienta que automatiza compilar, pasar los tests, empaquetar en .jar y descargar librerías. Así el proyecto se construye igual en cualquier ordenador, aunque no tenga el IDE.' },
      { q: '¿Diferencia principal entre Maven y Gradle?', a: 'Maven se configura con XML y sigue fases fijas: es más rígido pero muy fácil de leer. Gradle se configura con código (Kotlin o Groovy) y funciona por tareas: es más flexible y normalmente más rápido gracias a la compilación incremental y la caché.' },
      { q: '¿Qué es una dependencia?', a: 'Una librería externa que usa el proyecto, por ejemplo JUnit para los tests. Se declara con groupId, artifactId y version y la herramienta la descarga sola de Maven Central (Maven la guarda en ~/.m2).' },
      { q: '¿Qué significan groupId, artifactId y version?', a: 'groupId es la organización, normalmente el dominio al revés (es.iesantoniogala); artifactId es el nombre del proyecto o librería; version, su versión. Juntos identifican la librería de forma única.' },
      { q: '¿Qué es <scope>test</scope> o testImplementation?', a: 'Que la librería solo se usa para compilar y ejecutar los tests. No se incluye en el programa final.' },
      { q: '¿Qué es el ciclo de vida de Maven?', a: 'Una secuencia de fases: validate, compile, test, package, verify, install y deploy. Al pedir una fase se ejecutan todas las anteriores: "mvn package" compila, pasa los tests y genera el .jar.' },
      { q: '¿Qué es gradlew (Gradle Wrapper)?', a: 'Un script que va dentro del proyecto y descarga la versión exacta de Gradle que necesita. Cualquiera puede compilar sin instalar Gradle y todos usan la misma versión.' },
      { q: '¿Hay que instalar Maven o Gradle aparte?', a: 'En IntelliJ no: trae Maven integrado y Gradle se obtiene con el wrapper. Fuera del IDE sí habría que instalar Maven para usar el comando mvn.' },
      { q: '¿Por qué src/main/java y src/test/java?', a: 'Es la estructura estándar de Maven, que Gradle también usa: separa el código de los tests y cualquier herramienta o IDE sabe dónde está cada cosa.' },
      { q: '¿Qué son las carpetas target y build?', a: 'Las carpetas de salida de Maven y Gradle: contienen los .class y el .jar. Se generan al compilar, así que no se suben a Git.' },
      { q: '¿Y si abro el proyecto en Eclipse o NetBeans?', a: 'Un proyecto Maven o Gradle se abre en cualquier IDE porque la configuración no depende de él (Eclipse usa los plugins m2e y Buildship). Un proyecto con el sistema propio de IntelliJ (.iml) solo se abre bien en IntelliJ.' },
      { q: '¿Cuál usaríais vosotros?', a: 'Para los ejercicios de clase, el sistema propio porque no usamos librerías. Para un proyecto real con librerías, Maven por sencillez, o Gradle si fuera una app Android.' },
      { q: '¿Qué es un .jar?', a: 'Un archivo comprimido con los .class y los recursos del programa, listo para distribuirlo. Si indica la clase principal se ejecuta con java -jar.' },
      { q: '¿Y Ant?', a: 'Una herramienta de compilación anterior, también de Apache. Hoy se usa poco; NetBeans todavía la soporta.' },
    ],
  },
  {
    key: 'customize', code: 'Make It Yours', title: 'Personalización', section: 'tools', seconds: 35,
    notes: [
      'Nuestra configuración real: tema Islands Dark y keymap IntelliJ (macOS), visible en la pantalla de bienvenida.',
      'Cambiar el tema, el tamaño de fuente, los números de línea y la indentación en la demo.',
      'Autoguardado: IntelliJ guarda solo, no hay que pulsar Guardar.',
      'Formatear código con ⌥⌘L y mapas de atajos configurables (incluso con los de Eclipse).',
    ],
  },
  {
    key: 'plugins', code: 'Power Up', title: 'Plugins y actualizaciones', section: 'tools', seconds: 35,
    notes: [
      'Los plugins se instalan desde Settings → Plugins, con el JetBrains Marketplace integrado.',
      'Demo: instalar y desinstalar un plugin (simulado).',
      'Actualizaciones: en nuestro IDE ya salía "Update 6 Plugins…" en el menú del engranaje.',
      'Comparar con la práctica de Eclipse, donde usamos el Eclipse Marketplace.',
    ],
  },
  {
    key: 'hood', code: 'Under the Hood', title: 'JDK y herramientas de desarrollo', section: 'tools', seconds: 35,
    notes: [
      'IntelliJ no "es" Java: necesita un JDK.',
      'Recorrer el diagrama: escribimos .java, el compilador javac lo convierte en bytecode (.class) y la JVM lo ejecuta.',
      'JDK = herramientas para programar (incluye compilador y JVM). JVM = la máquina que ejecuta.',
      'Prueba real: al abrir ej223.class, IntelliJ indica "bytecode version 65.0 (Java 21)".',
    ],
  },
  {
    key: 'first-project', code: 'First Project', title: 'Creación de un proyecto', section: 'action',
    video: { file: 'crear-proyecto.mp4', title: 'Así creamos PrimerProyecto', speed: '×1,6', chapters: [
      { t: 0, label: 'Pantalla de bienvenida → New → Project…' },
      { t: 2.9, label: 'Asistente New Project: elegimos Java' },
      { t: 7.1, label: 'Nombre, build system IntelliJ y JDK 21' },
      { t: 11.2, label: 'Create: se abre el proyecto' },
      { t: 16.2, label: 'src → New → Package' },
      { t: 29.1, label: 'Paquete → New → Java Class: Main' },
      { t: 42.5, label: 'Clase Main creada' },
    ] }, seconds: 35,
    notes: [
      'Paso 1: File → New → Project y elegimos Java.',
      'Paso 2: nombre, ubicación, sistema de compilación y JDK.',
      'Paso 3: creamos la clase Main dentro de src.',
    ],
  },
  {
    key: 'run', code: 'Hit Run', title: 'Desarrollo y ejecución', section: 'action',
    video: { file: 'ejecutar.mp4', title: 'Así lo escribimos y ejecutamos', speed: '×1,25', chapters: [
      { t: 0, label: 'El programa con el do-while' },
      { t: 2.3, label: 'Escribimos sout y lo autocompleta a System.out.println' },
      { t: 11.6, label: 'Autocompleta también la variable suma' },
      { t: 13.9, label: 'Pulsamos Run ▶' },
      { t: 16.2, label: 'Consola: Vuelta 1, 2, 3 y suma = 6' },
    ] }, seconds: 45,
    notes: [
      'Programa sencillo con lo que hemos dado: un do-while que da 3 vueltas, muestra cada vuelta y suma el contador.',
      'Pulsar Run: así se ve la consola de IntelliJ. La animación reproduce la salida real del programa.',
      'Atajo para ejecutar en macOS: ⌃R.',
    ],
  },
  {
    key: 'debug', code: 'Debug Mode', title: 'Depuración', section: 'action',
    video: { file: 'depurar.mp4', title: 'Así lo depuramos', chapters: [
      { t: 0, label: 'Ejecución normal terminada' },
      { t: 1.9, label: 'Clic en el margen: breakpoint en la línea 10' },
      { t: 4.5, label: 'Pulsamos Debug 🐞' },
      { t: 7.1, label: 'Se para: contador = 1 y suma = 0 en Threads & Variables' },
    ] }, seconds: 55,
    notes: [
      'Un breakpoint es un punto donde el programa se para para poder mirar las variables.',
      'Ir pulsando "Siguiente paso" (F8) y ver cómo cambian contador y suma en cada vuelta del do-while.',
      'Relacionarlo con las herramientas CASE: el IDE ayuda a desarrollar, probar (debugger, JUnit) y documentar (Javadoc).',
      'Es lo mismo que hicimos en Eclipse con la clase intercambiador.',
    ],
  },
  {
    key: 'ai', code: 'Code with AI', title: 'Programar con IA', section: 'action', seconds: 45,
    notes: [
      'IntelliJ permite abrir sesiones de agentes de IA dentro del editor (botón New Session).',
      'En el vídeo: el ej250 no compila porque falta el bucle. Le pedimos con nuestras palabras que lo corrija.',
      'Ir pulsando los pasos de la derecha: lee el proyecto, propone el cambio en verde, lo compila, lo prueba y lo explica.',
      'Mensaje clave: la IA propone y nosotros revisamos. Si aceptamos sin entender, no aprendemos.',
    ],
    qa: [
      { q: '¿Usar IA no es hacer trampa?', a: 'Depende de cómo se use. Si solo copiamos, no aprendemos. Aquí la usamos como un compañero que explica: leemos el cambio, lo entendemos y lo probamos nosotros.' },
      { q: '¿Qué es un agente de IA?', a: 'Un asistente que no solo responde: puede leer los archivos del proyecto, proponer cambios, ejecutar comandos (compilar, probar) y explicar lo que ha hecho.' },
      { q: '¿Viene incluido en IntelliJ?', a: 'IntelliJ tiene integración con asistentes de IA, el suyo propio de JetBrains y otros agentes externos. Nosotros usamos Claude Code, que necesita su propia cuenta.' },
      { q: '¿Se puede equivocar?', a: 'Sí. Por eso el IDE enseña el cambio antes y después, y conviene compilar y probar. En el vídeo el agente prueba los dos casos del enunciado.' },
    ],
  },
  {
    key: 'battle', code: 'The IDE Battle', title: 'Comparativa', section: 'verdict', seconds: 40,
    notes: [
      'Comparamos con Eclipse y Apache NetBeans, los otros dos grandes IDE de Java.',
      'Los tres son buenos para Java; cambian la licencia, el ecosistema de plugins y la forma de trabajar.',
      'Seleccionar cada tarjeta para resaltar su columna.',
    ],
  },
  {
    key: 'good-bad', code: 'The Good & The Bad', title: 'Ventajas e inconvenientes', section: 'verdict', seconds: 30,
    notes: [
      'Ventajas: análisis del código, refactorización y herramientas integradas.',
      'Inconvenientes: consume más memoria y las funciones avanzadas son de pago fuera del ámbito educativo.',
      'Recomendado para: Java/Kotlin, backend, Android (Android Studio se basa en IntelliJ) y estudiantes.',
    ],
  },
  {
    key: 'verdict', code: 'My Verdict', title: 'Valoración personal', section: 'verdict', seconds: 35,
    notes: [
      'Luis Miguel: lo cómodo (autocompletado e interfaz).',
      'Daniel: lo que mejoraríamos (memoria, demasiadas opciones, partes de pago).',
      'Miguel: frente a Eclipse y la conclusión.',
    ],
  },
  {
    key: 'end', code: 'The End', title: 'Cierre y webgrafía', section: 'verdict', seconds: 15,
    notes: [
      'Frase final y agradecimiento.',
      'La webgrafía está desplegable aquí y completa en el PDF.',
      'Turno de preguntas.',
    ],
  },
];

/**
 * VALORACIÓN PERSONAL (escena 14)
 * Escribidla después de probar IntelliJ IDEA. Mientras un campo esté vacío,
 * la escena muestra la pregunta guía y la etiqueta "Pendiente de redactar".
 */
export const verdict = {
  comfortable: 'El autocompletado: con escribir «sout» ya sale el System.out.println y va sugiriendo el código mientras escribimos. Y la interfaz, más limpia y ordenada que la de Eclipse.',
  improve: 'Consume bastante memoria y tiene tantas opciones que al principio cuesta encontrar las cosas. Además, algunas funciones son de pago, aunque con la licencia de estudiante las tenemos gratis.',
  vsEclipse: 'Nos quedamos con IntelliJ: es más completo y es el que más se usa en las empresas, así que aprenderlo ahora nos sirve para el futuro.',
  conclusion: 'Se lo recomendaríamos a cualquier compañero de DAM, con un aviso: hay que dedicarle un rato a conocerlo y necesita un ordenador con algo de memoria.',
};

export interface Source {
  title: string;
  publisher: string;
  url: string;
}

export const sources: Source[] = [
  { title: 'IntelliJ IDEA — página oficial', publisher: 'JetBrains', url: 'https://www.jetbrains.com/idea/' },
  { title: 'IntelliJ IDEA overview (documentación)', publisher: 'JetBrains', url: 'https://www.jetbrains.com/help/idea/discover-intellij-idea.html' },
  { title: 'IntelliJ IDEA as a unified product', publisher: 'JetBrains', url: 'https://www.jetbrains.com/help/idea/intellij-idea-single-distribution.html' },
  { title: 'IntelliJ IDEA moves to the unified distribution', publisher: 'JetBrains Blog', url: 'https://blog.jetbrains.com/idea/2025/07/intellij-idea-moves-to-the-unified-distribution/' },
  { title: 'Install IntelliJ IDEA — requisitos del sistema', publisher: 'JetBrains', url: 'https://www.jetbrains.com/help/idea/installation-guide.html' },
  { title: 'Free Educational Licenses', publisher: 'JetBrains', url: 'https://www.jetbrains.com/community/education/' },
  { title: 'JetBrains Marketplace', publisher: 'JetBrains', url: 'https://plugins.jetbrains.com/' },
  { title: 'intellij-community (código fuente, Apache 2.0)', publisher: 'GitHub', url: 'https://github.com/JetBrains/intellij-community' },
  { title: 'GitHub Student Developer Pack', publisher: 'GitHub Education', url: 'https://education.github.com/pack' },
  { title: 'Java — documentación y descargas', publisher: 'Oracle / dev.java', url: 'https://dev.java/' },
  { title: 'Eclipse IDE', publisher: 'Eclipse Foundation', url: 'https://eclipseide.org/' },
  { title: 'Eclipse Public License 2.0', publisher: 'Eclipse Foundation', url: 'https://www.eclipse.org/legal/epl-2.0/' },
  { title: 'Apache NetBeans', publisher: 'Apache Software Foundation', url: 'https://netbeans.apache.org/' },
  { title: 'IntelliJ IDEA', publisher: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/IntelliJ_IDEA' },
];
