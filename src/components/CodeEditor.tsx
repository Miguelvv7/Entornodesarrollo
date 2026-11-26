import type { ReactNode } from 'react';
import { tokenizeLine, tokenColor, type TokenType } from '../lib/java';

const lightColor: Record<TokenType, string> = {
  kw: 'text-[#0033B3]',
  type: 'text-[#1F2328]',
  str: 'text-[#067D17]',
  num: 'text-[#1750EB]',
  cmt: 'text-[#8C8C8C] italic',
  fn: 'text-[#00627A]',
  ann: 'text-[#9E880D]',
  plain: 'text-[#1F2328]',
};

export function HighlightedLine({ text, light = false }: { text: string; light?: boolean }) {
  const map = light ? lightColor : tokenColor;
  return (
    <>
      {tokenizeLine(text).map((tk, i) => (
        <span key={i} className={map[tk.t]}>{tk.v}</span>
      ))}
    </>
  );
}

interface Props {
  code: string;
  fileName?: string;
  fontSize?: number;
  lineNumbers?: boolean;
  light?: boolean;
  activeLine?: number;
  breakpoints?: number[];
  /** Permite sustituir el contenido de una línea (subrayados, renombrados...) */
  decorate?: (lineNo: number, text: string) => ReactNode | null | undefined;
  toolbar?: ReactNode;
  overlay?: ReactNode;
  className?: string;
  bodyClassName?: string;
}

/** Editor de código con aspecto de IntelliJ IDEA (tema oscuro "New UI" como referencia). */
export function CodeEditor({
  code, fileName = 'Main.java', fontSize = 24, lineNumbers = true, light = false,
  activeLine, breakpoints = [], decorate, toolbar, overlay, className = '', bodyClassName = '',
}: Props) {
  const lines = code.replace(/\n$/, '').split('\n');
  const lh = Math.round(fontSize * 1.62);
  return (
    <div
      className={`flex flex-col overflow-hidden rounded-[20px] border shadow-[0_40px_120px_-40px_rgba(0,0,0,0.8)] transition-colors duration-300 ${
        light ? 'border-black/10 bg-white' : 'border-line2 bg-[#1E1F22]'
      } ${className}`}
    >
      <div className={`flex h-[58px] shrink-0 items-center gap-4 border-b px-5 ${light ? 'border-black/10 bg-[#F7F8FA]' : 'border-line bg-[#2B2D30]'}`}>
        <div className="flex gap-2">
          <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
          <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
          <span className="h-3 w-3 rounded-full bg-[#28C840]" />
        </div>
        <div className={`ml-3 flex h-full items-center gap-2.5 border-b-2 border-sky px-3 font-mono text-[17px] ${light ? 'text-[#1F2328]' : 'text-snow/90'}`}>
          <span className="grid h-5 w-5 place-items-center rounded-full bg-sky/90 text-[11px] font-bold text-ink">C</span>
          {fileName}
        </div>
        <div className="ml-auto flex items-center gap-3">{toolbar}</div>
      </div>
      <div className={`relative min-h-0 flex-1 overflow-hidden py-5 font-mono ${bodyClassName}`} style={{ fontSize, lineHeight: `${lh}px` }}>
        {lines.map((text, i) => {
          const n = i + 1;
          const active = activeLine === n;
          const bp = breakpoints.includes(n);
          return (
            <div
              key={i}
              className={`relative flex whitespace-pre pr-6 transition-colors duration-200 ${
                active ? (light ? 'bg-[#EDF3FF]' : 'bg-[#2E436E]/70') : ''
              }`}
            >
              {lineNumbers && (
                <span
                  className={`relative w-[3.4em] shrink-0 select-none pr-[1.1em] text-right tnum ${light ? 'text-[#AEB3C2]' : 'text-[#4B5059]'} ${active ? (light ? 'text-[#1F2328]' : 'text-snow/70') : ''}`}
                >
                  {bp ? (
                    <span className="absolute right-[0.85em] top-1/2 h-[0.62em] w-[0.62em] -translate-y-1/2 rounded-full bg-err shadow-[0_0_12px_rgba(247,84,100,0.6)]" />
                  ) : (
                    n
                  )}
                </span>
              )}
              {!lineNumbers && <span className="w-[1.1em] shrink-0" />}
              <span className="min-w-0">{decorate?.(n, text) ?? <HighlightedLine text={text} light={light} />}</span>
            </div>
          );
        })}
        {overlay}
      </div>
    </div>
  );
}
