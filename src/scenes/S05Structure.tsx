import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, Folder, FileCode2, Coffee, Settings2, FileText, Library, Package, Terminal, RefreshCw, RotateCcw } from 'lucide-react';
import { SceneShell, Panel, Label, Kbd, SimBadge } from '../components/SceneShell';
import { Reveal } from '../components/Reveal';
import { CodeEditor } from '../components/CodeEditor';
import { BuildExplainer } from './BuildExplainer';
import { usePrint } from '../lib/mode';
import type { SceneProps } from './types';

type Sys = 'idea' | 'maven' | 'gradle';

interface TreeLine { d: number; name: string; icon: ReactNode; tint?: string; note?: string }

const I = {
  folder: <Folder size={17} />, src: <Folder size={17} />, java: <FileCode2 size={17} />, cfg: <Settings2 size={17} />,
  file: <FileText size={17} />, lib: <Library size={17} />, jdk: <Coffee size={17} />, pkg: <Package size={17} />, sh: <Terminal size={17} />,
};

const systems: Record<Sys, {
  name: string; tag: string; file: string; lang: 'xml' | 'kts';
  tree: TreeLine[]; code: string; short: string;
  facts: [string, ReactNode][];
}> = {
  idea: {
    name: 'IntelliJ', tag: 'Sistema propio del IDE', file: 'MiPrimerProyecto.iml', lang: 'xml',
    tree: [
      { d: 0, name: 'MiPrimerProyecto', icon: I.folder },
      { d: 1, name: '.idea', icon: I.cfg, tint: 'text-mute', note: 'ajustes del IDE' },
      { d: 1, name: 'out', icon: I.folder, tint: 'text-[#E5B567]', note: '.class compilados' },
      { d: 1, name: 'src', icon: I.src, tint: 'text-sky', note: 'código fuente' },
      { d: 2, name: 'es.iesantoniogala.notas', icon: I.pkg },
      { d: 3, name: 'Main.java', icon: I.java, tint: 'text-sky' },
      { d: 1, name: 'MiPrimerProyecto.iml', icon: I.file, tint: 'text-mute', note: 'definición del módulo' },
      { d: 0, name: 'External Libraries', icon: I.lib },
      { d: 1, name: '< 25 > JDK', icon: I.jdk, tint: 'text-kw' },
    ],
    code: `<?xml version="1.0" encoding="UTF-8"?>
<module type="JAVA_MODULE" version="4">
  <component name="NewModuleRootManager">
    <exclude-output />
    <content url="file://$MODULE_DIR$">
      <sourceFolder url="file://$MODULE_DIR$/src"
                    isTestSource="false" />
    </content>
    <orderEntry type="inheritedJdk" />
    <orderEntry type="sourceFolder" forTests="false" />
  </component>
</module>`,
    short: '',
    facts: [
      ['Configuración', 'Archivo .iml y carpeta .idea. Los crea y mantiene el IDE; no se editan a mano.'],
      ['Dependencias', 'Se añaden a mano: File → Project Structure → Libraries.'],
      ['Compilar', <>Build → Build Project <Kbd>⌘F9</Kbd></>],
      ['Salida', <><span className="font-mono">out/</span> con los .class</>],
      ['Ideal para', 'Ejercicios de clase sin librerías externas. Solo funciona dentro de IntelliJ.'],
    ],
  },
  maven: {
    name: 'Maven', tag: 'Apache · XML · convenciones', file: 'pom.xml', lang: 'xml',
    tree: [
      { d: 0, name: 'notas', icon: I.folder },
      { d: 1, name: 'pom.xml', icon: I.file, tint: 'text-[#E06C9F]', note: 'configuración' },
      { d: 1, name: 'src/main/java', icon: I.src, tint: 'text-sky', note: 'código' },
      { d: 2, name: 'es.iesantoniogala.notas', icon: I.pkg },
      { d: 3, name: 'Main.java', icon: I.java, tint: 'text-sky' },
      { d: 1, name: 'src/main/resources', icon: I.folder, tint: 'text-mute', note: 'recursos' },
      { d: 1, name: 'src/test/java', icon: I.src, tint: 'text-ok', note: 'tests' },
      { d: 1, name: 'target', icon: I.folder, tint: 'text-[#E5B567]', note: '.class y notas-1.0.jar' },
      { d: 0, name: 'External Libraries', icon: I.lib },
      { d: 1, name: 'Maven: junit-jupiter:5.11.4', icon: I.lib, tint: 'text-mute' },
    ],
    code: `<project>
  <modelVersion>4.0.0</modelVersion>
  <groupId>es.iesantoniogala</groupId>
  <artifactId>notas</artifactId>
  <version>1.0</version>
  <properties>
    <maven.compiler.release>21</maven.compiler.release>
  </properties>
  <dependencies>
    <dependency>
      <groupId>org.junit.jupiter</groupId>
      <artifactId>junit-jupiter</artifactId>
      <version>5.11.4</version>
      <scope>test</scope>
    </dependency>
  </dependencies>
</project>`,
    short: `<dependency>
  <groupId>org.junit.jupiter</groupId>
  <artifactId>junit-jupiter</artifactId>
  <version>5.11.4</version>
  <scope>test</scope>
</dependency>`,
    facts: [
      ['Qué es', 'Herramienta de la Apache Software Foundation que compila, prueba, empaqueta y descarga librerías.'],
      ['Idea clave', 'Convención antes que configuración: estructura de carpetas fija y un ciclo de fases: compile → test → package → install.'],
      ['Dependencias', <>Se declaran con groupId, artifactId y version. Se descargan solas de <span className="text-snow">Maven Central</span> a <span className="font-mono">~/.m2</span>.</>],
      ['Compilar', <><span className="font-mono text-snow">mvn package</span> → <span className="font-mono">target/notas-1.0.jar</span></>],
      ['Ideal para', 'Proyectos Java "clásicos" y empresariales. Muy extendido y fácil de leer.'],
    ],
  },
  gradle: {
    name: 'Gradle', tag: 'Kotlin/Groovy · tareas · rápido', file: 'build.gradle.kts', lang: 'kts',
    tree: [
      { d: 0, name: 'notas', icon: I.folder },
      { d: 1, name: 'build.gradle.kts', icon: I.file, tint: 'text-[#4FB6A8]', note: 'configuración' },
      { d: 1, name: 'settings.gradle.kts', icon: I.file, tint: 'text-[#4FB6A8]', note: 'nombre y módulos' },
      { d: 1, name: 'gradlew · gradle/wrapper', icon: I.sh, tint: 'text-mute', note: 'Gradle Wrapper' },
      { d: 1, name: 'src/main/java', icon: I.src, tint: 'text-sky', note: 'código' },
      { d: 2, name: 'es.iesantoniogala.notas', icon: I.pkg },
      { d: 3, name: 'Main.java', icon: I.java, tint: 'text-sky' },
      { d: 1, name: 'src/test/java', icon: I.src, tint: 'text-ok', note: 'tests' },
      { d: 1, name: 'build', icon: I.folder, tint: 'text-[#E5B567]', note: '.class y libs/notas.jar' },
    ],
    code: `plugins {
    java
    application
}

repositories {
    mavenCentral()
}

dependencies {
    testImplementation("org.junit.jupiter:junit-jupiter:5.11.4")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

application {
    mainClass = "es.iesantoniogala.notas.Main"
}`,
    short: `dependencies {
  testImplementation(
    "org.junit.jupiter:junit-jupiter:5.11.4")
}`,
    facts: [
      ['Qué es', 'Herramienta de compilación más moderna. La configuración es código (Kotlin o Groovy), no XML.'],
      ['Idea clave', 'Trabaja con tareas (build, test, run). Compilación incremental y caché: solo rehace lo que ha cambiado.'],
      ['Dependencias', <>Usa los mismos repositorios que Maven (Maven Central). Una línea por librería.</>],
      ['Compilar', <><span className="font-mono text-snow">./gradlew build</span> → <span className="font-mono">build/libs/notas.jar</span></>],
      ['Ideal para', 'Proyectos grandes o con mucha personalización. Es el sistema oficial de Android.'],
    ],
  },
};

/* Resaltado simple de XML y Kotlin DSL */
function XmlLine({ text }: { text: string }) {
  const parts = text.split(/(<\/?[\w.:-]+|\/?>|"[^"]*"|[\w.-]+=)/g);
  return (
    <>
      {parts.map((p, i) =>
        /^<\/?[\w.:-]+$/.test(p) || /^\/?>$/.test(p) ? <span key={i} className="text-kw">{p}</span>
        : /^"/.test(p) ? <span key={i} className="text-str">{p}</span>
        : /=$/.test(p) ? <span key={i} className="text-[#BABABA]">{p}</span>
        : <span key={i} className="text-snow/90">{p}</span>,
      )}
    </>
  );
}
function KtsLine({ text }: { text: string }) {
  const parts = text.split(/("[^"]*"|\b(?:plugins|repositories|dependencies|application|java|testImplementation|testRuntimeOnly|implementation|mavenCentral|mainClass)\b)/g);
  return (
    <>
      {parts.map((p, i) =>
        /^"/.test(p) ? <span key={i} className="text-str">{p}</span>
        : /^(plugins|repositories|dependencies|application)$/.test(p) ? <span key={i} className="text-fn">{p}</span>
        : /^(java|testImplementation|testRuntimeOnly|implementation|mavenCentral|mainClass)$/.test(p) ? <span key={i} className="text-kw">{p}</span>
        : <span key={i} className="text-snow/90">{p}</span>,
      )}
    </>
  );
}

function Tree({ lines, size = 19 }: { lines: TreeLine[]; size?: number }) {
  return (
    <div className="grid gap-[3px] font-mono" style={{ fontSize: size }}>
      {lines.map((l, i) => (
        <div key={i} className="flex items-center gap-2 whitespace-nowrap" style={{ paddingLeft: l.d * 22 }}>
          <ChevronRight size={13} className={`shrink-0 text-mute ${i < lines.length - 1 && lines[i + 1].d > l.d ? 'rotate-90' : 'opacity-0'}`} />
          <span className={`shrink-0 ${l.tint ?? 'text-mute'}`}>{l.icon}</span>
          <span className="truncate text-snow/90">{l.name}</span>
          {l.note && <span className="ml-1 truncate font-sans text-[0.78em] text-mute/80">— {l.note}</span>}
        </div>
      ))}
    </div>
  );
}

const purpose: Record<Sys, { what: string; use: string }> = {
  maven: {
    what: 'Un ayudante que prepara el proyecto por nosotros. Apuntamos en una lista (el pom.xml) lo que necesitamos y él lo descarga y monta el programa.',
    use: 'Para usar código hecho por otros sin buscarlo a mano, y para que el proyecto funcione igual en el ordenador de cualquier compañero.',
  },
  gradle: {
    what: 'Otro ayudante que hace lo mismo que Maven, pero más moderno. La lista se escribe más corta.',
    use: 'Es más rápido: se acuerda de lo que ya hizo y no lo repite. Es el que usan todas las apps de Android.',
  },
  idea: {
    what: 'Sin ayudante: el propio IntelliJ compila el programa cuando le damos al botón, como hacemos siempre en clase.',
    use: 'Para ejercicios sencillos como los nuestros. Si necesitamos algo de fuera, hay que añadirlo a mano, y el proyecto solo va bien en IntelliJ.',
  },
};


export function S05Structure({ index }: SceneProps) {
  const print = usePrint();
  const [view, setView] = useState<'explain' | 'lab'>('explain');
  const pill = <div className="absolute -top-[104px] right-0 rounded-full border border-[#E5B567]/50 bg-[#E5B567]/10 px-5 py-2 font-mono text-[17px] uppercase tracking-[0.14em] text-[#E5B567]">★ Punto extra · no visto en clase</div>;
  const title = <><span className="text-lilac">Maven</span>, <span className="text-lilac">Gradle</span>… o IntelliJ.</>;

  if (print) {
    return (
      <SceneShell index={index} glow="bl" title={title}>
        {pill}
        <BuildExplainer still />
      </SceneShell>
    );
  }

  return (
    <SceneShell index={index} glow="bl" title={title}>
      {pill}
      <div className="absolute -top-[46px] right-0 flex gap-2 rounded-2xl border border-line bg-surface/70 p-1.5" role="tablist" aria-label="Vista">
        {([['explain', '1 · Qué es cada uno'], ['lab', '2 · Pruébalo']] as const).map(([k, l]) => (
          <button key={k} role="tab" aria-selected={view === k} onClick={() => setView(k)}
            className={`rounded-xl px-4 py-1.5 text-[16px] transition ${view === k ? 'bg-violet/25 text-snow' : 'text-mute hover:text-snow'}`}>{l}</button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={view} className="h-full" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
          {view === 'explain' ? <BuildExplainer /> : <BuildLab />}
        </motion.div>
      </AnimatePresence>
    </SceneShell>
  );
}

/* ------------------------------------------------------------------ */
/*  Laboratorio interactivo: añadir una librería y compilar            */
/* ------------------------------------------------------------------ */

type Line = { t: string; c?: 'ok' | 'mute' | 'cmd' | 'warn' | 'snow' };
interface LabState { dep: boolean; synced: boolean; builds: number }

const baseCode: Record<Sys, string> = {
  maven: `<project>
  <modelVersion>4.0.0</modelVersion>
  <groupId>es.iesantoniogala</groupId>
  <artifactId>notas</artifactId>
  <version>1.0</version>
  <properties>
    <maven.compiler.release>21</maven.compiler.release>
  </properties>
  <dependencies>
  </dependencies>
</project>`,
  gradle: `plugins {
    java
    application
}

repositories {
    mavenCentral()
}

dependencies {
}

application {
    mainClass = "es.iesantoniogala.notas.Main"
}`,
  idea: systems.idea.code,
};
const depLines: Record<Sys, { after: number; lines: string[] }> = {
  maven: { after: 9, lines: ['    <dependency>', '      <groupId>org.junit.jupiter</groupId>', '      <artifactId>junit-jupiter</artifactId>', '      <version>5.11.4</version>', '      <scope>test</scope>', '    </dependency>'] },
  gradle: { after: 10, lines: ['    testImplementation("org.junit.jupiter:junit-jupiter:5.11.4")'] },
  idea: { after: 9, lines: ['    <orderEntry type="library" name="junit.jupiter" level="project" />'] },
};

function codeFor(sys: Sys, dep: boolean) {
  const lines = baseCode[sys].split('\n');
  if (!dep) return { code: lines.join('\n'), added: [] as number[] };
  const { after, lines: add } = depLines[sys];
  const out = [...lines.slice(0, after), ...add, ...lines.slice(after)];
  return { code: out.join('\n'), added: add.map((_, i) => after + 1 + i) };
}

const phases: Record<Sys, string[]> = {
  maven: ['compile', 'test', 'package'],
  gradle: ['compileJava', 'test', 'jar', 'build'],
  idea: ['Build Project'],
};

function buildOutput(sys: Sys, st: LabState): { lines: Line[]; phase: number[] } {
  const tests = st.dep && st.synced;
  const again = st.builds > 0;
  if (sys === 'maven') return {
    lines: [
      { t: '$ mvn package', c: 'cmd' },
      { t: '[INFO] Building notas 1.0' },
      { t: again ? '[INFO] --- compiler:compile ---  Nothing to compile - all classes are up to date' : '[INFO] --- compiler:compile ---  Compiling 1 source file to target/classes' },
      { t: tests ? '[INFO] --- surefire:test ---  Tests run: 1, Failures: 0, Errors: 0' : '[INFO] --- surefire:test ---  No tests to run.' },
      { t: '[INFO] --- jar:jar ---  Building jar: target/notas-1.0.jar' },
      { t: '[INFO] BUILD SUCCESS', c: 'ok' },
      { t: again ? '[INFO] Total time:  1.6 s   (los tests se vuelven a ejecutar)' : '[INFO] Total time:  2.4 s', c: 'mute' },
    ],
    phase: [2, 3, 4],
  };
  if (sys === 'gradle') {
    const u = again ? ' UP-TO-DATE' : '';
    return {
      lines: [
        { t: '$ ./gradlew build', c: 'cmd' },
        { t: `> Task :compileJava${u}` },
        { t: tests ? `> Task :test${u}` : '> Task :test NO-SOURCE' },
        { t: `> Task :jar${u}` },
        { t: `> Task :build${u}` },
        { t: again ? 'BUILD SUCCESSFUL in 480ms' : 'BUILD SUCCESSFUL in 3s', c: 'ok' },
        { t: again ? 'Nada ha cambiado: Gradle se salta todas las tareas' : `${tests ? 4 : 3} actionable tasks: ${tests ? 4 : 3} executed`, c: 'mute' },
      ],
      phase: [1, 2, 3, 4],
    };
  }
  return {
    lines: [
      { t: 'Build → Build Project (⌘F9)', c: 'cmd' },
      { t: again ? 'Comprobando cambios… ninguno' : 'Compilando 1 archivo .java con javac (JDK 21)…' },
      { t: again ? 'Build completed successfully in 0 s' : 'Build completed successfully in 1 s', c: 'ok' },
      { t: 'Clases en out/production/MiPrimerProyecto', c: 'mute' },
    ],
    phase: [2],
  };
}

function syncOutput(sys: Sys): Line[] {
  if (sys === 'idea') return [
    { t: 'Sin gestor de dependencias: se añade a mano', c: 'warn' },
    { t: 'File → Project Structure → Libraries → + → From Maven…' },
    { t: 'Buscar: org.junit.jupiter:junit-jupiter:5.11.4 → OK' },
    { t: 'Librería añadida al módulo (.iml)', c: 'ok' },
  ];
  return [
    { t: sys === 'maven' ? 'Load Maven Changes (⇧⌘I)' : 'Load Gradle Changes (⇧⌘I)', c: 'cmd' },
    { t: 'Downloading from central: https://repo.maven.apache.org/maven2/' },
    { t: '  org/junit/jupiter/junit-jupiter/5.11.4/junit-jupiter-5.11.4.jar' },
    { t: '  + junit-jupiter-api, junit-jupiter-engine… (dependencias de la librería)' },
    { t: sys === 'maven' ? 'Guardado en ~/.m2/repository' : 'Guardado en ~/.gradle/caches', c: 'mute' },
    { t: 'Sincronizado', c: 'ok' },
  ];
}

function treeFor(sys: Sys, st: LabState): TreeLine[] {
  const t = systems[sys].tree.filter((l) => !['target', 'build', 'out'].includes(l.name) && !l.name.startsWith('Maven:'));
  const outName = sys === 'maven' ? 'target' : sys === 'gradle' ? 'build' : 'out';
  const outNote = sys === 'maven' ? 'notas-1.0.jar' : sys === 'gradle' ? 'libs/notas.jar' : '.class compilados';
  const res = [...t];
  if (st.builds > 0) {
    const at = sys === 'idea' ? 2 : res.findIndex((l) => l.name === 'src/test/java') + 1;
    res.splice(at, 0, { d: 1, name: outName, icon: I.folder, tint: 'text-[#E5B567]', note: `nuevo · ${outNote}` });
  }
  if (sys === 'gradle' && !res.some((l) => l.name === 'External Libraries')) res.push({ d: 0, name: 'External Libraries', icon: I.lib });
  if (st.synced) res.push({ d: 1, name: sys === 'idea' ? 'junit.jupiter' : `${sys === 'maven' ? 'Maven' : 'Gradle'}: junit-jupiter:5.11.4`, icon: I.lib, tint: 'text-ok', note: 'nueva' });
  return res;
}

const lineColor: Record<NonNullable<Line['c']>, string> = { ok: 'text-ok', mute: 'text-mute', cmd: 'text-sky', warn: 'text-[#E5B567]', snow: 'text-snow' };

function BuildLab() {
  const [sys, setSys] = useState<Sys>('maven');
  const [lab, setLab] = useState<Record<Sys, LabState>>({ maven: { dep: false, synced: false, builds: 0 }, gradle: { dep: false, synced: false, builds: 0 }, idea: { dep: false, synced: false, builds: 0 } });
  const [term, setTerm] = useState<Line[]>([]);
  const [lit, setLit] = useState<number>(-1);
  const [busy, setBusy] = useState(false);
  const timers = useRef<number[]>([]);
  const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  useEffect(() => clear, []);

  const st = lab[sys];
  const { code, added } = codeFor(sys, st.dep);
  const pending = st.dep && !st.synced;

  const play = (lines: Line[], phaseAt: number[] = [], after?: () => void) => {
    clear(); setBusy(true); setTerm([]); setLit(-1);
    lines.forEach((l, i) => timers.current.push(window.setTimeout(() => {
      setTerm((x) => [...x, l]);
      const p = phaseAt.indexOf(i);
      if (p >= 0) setLit(p);
      if (i === lines.length - 1) { setBusy(false); after?.(); }
    }, 260 + i * 330)));
  };

  const switchSys = (k: Sys) => { clear(); setBusy(false); setSys(k); setTerm([]); setLit(-1); };
  const addDep = () => {
    setLab((x) => ({ ...x, [sys]: { ...x[sys], dep: true } }));
    if (sys === 'idea') play(syncOutput('idea'), [], () => setLab((x) => ({ ...x, idea: { ...x.idea, synced: true } })));
    else { clear(); setTerm([{ t: `Archivo modificado: ${systems[sys].file}`, c: 'warn' }, { t: 'IntelliJ ofrece cargar los cambios (botón flotante del editor)', c: 'mute' }]); }
  };
  const sync = () => play(syncOutput(sys), [], () => setLab((x) => ({ ...x, [sys]: { ...x[sys], synced: true } })));
  const build = () => {
    const { lines, phase } = buildOutput(sys, st);
    play(lines, phase, () => setLab((x) => ({ ...x, [sys]: { ...x[sys], builds: x[sys].builds + 1 } })));
  };
  const reset = () => { clear(); setBusy(false); setLab((x) => ({ ...x, [sys]: { dep: false, synced: false, builds: 0 } })); setTerm([]); setLit(-1); };

  const tip = !st.dep ? 'Paso 1: añade la librería JUnit al proyecto.'
    : pending ? 'Paso 2: carga los cambios para que descargue la librería.'
    : st.builds === 0 ? 'Paso 3: compila el proyecto.'
    : sys === 'gradle' && st.builds === 1 ? 'Compila otra vez: verás que Gradle se salta lo que no ha cambiado.'
    : sys === 'maven' && st.builds === 1 ? 'Compila otra vez y compáralo con Gradle: Maven repite los tests.'
    : 'Prueba ahora con otro sistema de compilación.';

  const facts: Record<Sys, [string, string][]> = {
    idea: [['Configuración', '.iml + .idea'], ['Librerías', 'a mano'], ['Salida', 'out/'], ['Ideal para', 'ejercicios de clase']],
    maven: [['Configuración', 'pom.xml (XML)'], ['Librerías', 'Maven Central'], ['Salida', 'target/'], ['Ideal para', 'Java clásico y empresa']],
    gradle: [['Configuración', 'build.gradle.kts'], ['Librerías', 'Maven Central'], ['Salida', 'build/'], ['Ideal para', 'proyectos grandes y Android']],
  };

  return (
    <div className="flex h-full flex-col gap-4">
      <Reveal delay={0.1} className="flex items-center gap-3">
        <div className="flex gap-3" role="tablist" aria-label="Sistema de compilación">
          {(['maven', 'gradle', 'idea'] as Sys[]).map((k) => (
            <button key={k} role="tab" aria-selected={sys === k} onClick={() => switchSys(k)}
              className={`rounded-2xl border px-5 py-2.5 text-left transition ${sys === k ? 'border-lilac/50 bg-violet/[0.12]' : 'border-line bg-surface/60 hover:border-line2'}`}>
              <div className="text-[22px] font-semibold">{systems[k].name}</div>
              <div className="text-[14px] text-mute">{systems[k].tag}</div>
            </button>
          ))}
        </div>
        <div className="ml-3 flex flex-wrap gap-2">
          {facts[sys].map(([k, v]) => (
            <span key={k} className="rounded-lg border border-line bg-surface/60 px-3 py-1.5 text-[15px]"><span className="text-mute">{k}: </span><span className="text-snow/90">{v}</span></span>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.13}>
        <AnimatePresence mode="wait">
          <motion.div key={sys} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }}
            className="grid grid-cols-2 gap-5 rounded-2xl border border-line bg-surface/60 px-6 py-3.5 text-[18px] leading-snug">
            <div><span className="mr-2 font-mono text-[14px] uppercase tracking-[0.14em] text-lilac">Qué es</span><span className="text-snow/90">{purpose[sys].what}</span></div>
            <div><span className="mr-2 font-mono text-[14px] uppercase tracking-[0.14em] text-sky">Para qué sirve</span><span className="text-snow/90">{purpose[sys].use}</span></div>
          </motion.div>
        </AnimatePresence>
      </Reveal>

      <Reveal delay={0.16} className="grid min-h-0 flex-1 grid-cols-[400px_1fr_600px] gap-5">
        <Panel className="min-h-0 overflow-hidden p-5">
          <Label className="mb-3">Project</Label>
          <Tree lines={treeFor(sys, st)} size={16} />
        </Panel>

        <div className="relative min-h-0">
          <CodeEditor
            code={code}
            fileName={systems[sys].file}
            fontSize={sys === 'maven' && st.dep ? 14 : 15}
            className="h-full"
            decorate={(n, t) => (
              <span className={added.includes(n) ? 'rounded-sm bg-ok/15 outline outline-1 outline-ok/30' : ''}>
                {systems[sys].lang === 'xml' ? <XmlLine text={t} /> : <KtsLine text={t} />}
              </span>
            )}
          />
          <AnimatePresence>
            {pending && (
              <motion.button
                onClick={sync}
                className="absolute right-5 top-[76px] flex items-center gap-2 rounded-xl border border-sky/50 bg-[#2B2D30] px-4 py-2.5 text-[16px] text-snow shadow-2xl hover:bg-[#35373b]"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              >
                <RefreshCw size={17} className="text-sky" /> Load {sys === 'maven' ? 'Maven' : 'Gradle'} Changes <Kbd>⇧⌘I</Kbd>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <div className="flex min-h-0 flex-col gap-3">
          <div className="grid grid-cols-3 gap-2">
            <button onClick={addDep} disabled={st.dep || busy} className="rounded-xl border border-lilac/40 bg-violet/15 px-3 py-3 text-[16px] font-medium text-snow transition hover:bg-violet/25 disabled:opacity-35">1 · Añadir JUnit</button>
            <button onClick={sync} disabled={!pending || busy} className="rounded-xl border border-sky/40 bg-sky/10 px-3 py-3 text-[16px] font-medium text-snow transition hover:bg-sky/20 disabled:opacity-35">2 · Cargar cambios</button>
            <button onClick={build} disabled={busy} className="rounded-xl border border-ok/40 bg-ok/10 px-3 py-3 text-[16px] font-medium text-snow transition hover:bg-ok/20 disabled:opacity-35">3 · Compilar</button>
          </div>
          <div className="flex items-center gap-2">
            {phases[sys].map((p, i) => (
              <span key={p} className="flex items-center gap-2">
                <span className={`rounded-lg px-3 py-1 font-mono text-[14px] transition ${i <= lit ? (st.builds > 0 && sys === 'gradle' ? 'bg-white/[0.08] text-mute' : 'bg-ok/20 text-ok') : 'bg-white/[0.04] text-mute/60'}`}>{p}</span>
                {i < phases[sys].length - 1 && <span className="text-mute/40">→</span>}
              </span>
            ))}
            <button onClick={reset} className="ml-auto grid h-8 w-8 place-items-center rounded-lg border border-line text-mute hover:text-snow" aria-label="Reiniciar"><RotateCcw size={14} /></button>
          </div>
          <div className="min-h-0 flex-1 overflow-hidden rounded-[18px] border border-line2 bg-[#1E1F22]">
            <div className="flex h-[40px] items-center gap-2 border-b border-line bg-[#2B2D30] px-4 font-mono text-[13px] text-mute"><Terminal size={14} /> {sys === 'idea' ? 'Build' : 'Terminal'} <span className="ml-auto"><SimBadge>Salida resumida</SimBadge></span></div>
            <div className="p-4 font-mono text-[14px] leading-[1.6]">
              {term.length === 0 && <div className="text-mute/70">Sigue los pasos 1 → 2 → 3.</div>}
              {term.map((l, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} className={`break-words ${l.c ? lineColor[l.c] : 'text-snow/85'}`}>{l.t}</motion.div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-[#E5B567]/30 bg-[#E5B567]/[0.06] px-4 py-2.5 text-[16px] text-snow/85">{tip}</div>
        </div>
      </Reveal>
    </div>
  );
}
