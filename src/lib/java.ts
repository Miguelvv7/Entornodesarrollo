/** Resaltado mínimo de Java (sin dependencias). Suficiente para fragmentos didácticos. */
export type TokenType = 'kw' | 'type' | 'str' | 'num' | 'cmt' | 'fn' | 'ann' | 'plain';
export interface Token { t: TokenType; v: string }

const KEYWORDS = new Set([
  'public','private','protected','class','static','void','int','double','boolean','char','long','float',
  'new','return','for','while','if','else','import','package','final','this','true','false','null',
  'extends','implements','interface','enum','try','catch','throw','throws','var',
]);

const RE = /(\/\/.*$)|("(?:[^"\\]|\\.)*")|(@\w+)|(\b\d+(?:\.\d+)?\b)|(\b[A-Za-z_]\w*\b)|(\s+)|(.)/g;

export function tokenizeLine(line: string): Token[] {
  const out: Token[] = [];
  let m: RegExpExecArray | null;
  RE.lastIndex = 0;
  while ((m = RE.exec(line))) {
    const [full, cmt, str, ann, num, word] = m;
    if (cmt) out.push({ t: 'cmt', v: full });
    else if (str) out.push({ t: 'str', v: full });
    else if (ann) out.push({ t: 'ann', v: full });
    else if (num) out.push({ t: 'num', v: full });
    else if (word) {
      const rest = line.slice(RE.lastIndex);
      if (KEYWORDS.has(word)) out.push({ t: 'kw', v: word });
      else if (/^[A-Z]/.test(word)) out.push({ t: 'type', v: word });
      else if (/^\s*\(/.test(rest)) out.push({ t: 'fn', v: word });
      else out.push({ t: 'plain', v: word });
    } else out.push({ t: 'plain', v: full });
  }
  return out;
}

export const tokenColor: Record<TokenType, string> = {
  kw: 'text-kw',
  type: 'text-snow/90',
  str: 'text-str',
  num: 'text-num',
  cmt: 'text-cmt italic',
  fn: 'text-fn',
  ann: 'text-[#B3AE60]',
  plain: 'text-snow/85',
};
