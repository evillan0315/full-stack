import { u as me, c as we, t as B, i as te, a as ye, b as $e, S as Re, g as Se } from "./index-Cms_7iYX.js";
function N() {
  return {
    async: !1,
    breaks: !1,
    extensions: null,
    gfm: !0,
    hooks: null,
    pedantic: !1,
    renderer: null,
    silent: !1,
    tokenizer: null,
    walkTokens: null
  };
}
var R = N();
function ae(r) {
  R = r;
}
var _ = { exec: () => null };
function g(r, e = "") {
  let t = typeof r == "string" ? r : r.source;
  const s = {
    replace: (n, i) => {
      let l = typeof i == "string" ? i : i.source;
      return l = l.replace(b.caret, "$1"), t = t.replace(n, l), s;
    },
    getRegex: () => new RegExp(t, e)
  };
  return s;
}
var b = {
  codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm,
  outputLinkReplace: /\\([\[\]])/g,
  indentCodeCompensation: /^(\s+)(?:```)/,
  beginningSpace: /^\s+/,
  endingHash: /#$/,
  startingSpaceChar: /^ /,
  endingSpaceChar: / $/,
  nonSpaceChar: /[^ ]/,
  newLineCharGlobal: /\n/g,
  tabCharGlobal: /\t/g,
  multipleSpaceGlobal: /\s+/g,
  blankLine: /^[ \t]*$/,
  doubleBlankLine: /\n[ \t]*\n[ \t]*$/,
  blockquoteStart: /^ {0,3}>/,
  blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g,
  blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm,
  listReplaceTabs: /^\t+/,
  listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g,
  listIsTask: /^\[[ xX]\] /,
  listReplaceTask: /^\[[ xX]\] +/,
  anyLine: /\n.*\n/,
  hrefBrackets: /^<(.*)>$/,
  tableDelimiter: /[:|]/,
  tableAlignChars: /^\||\| *$/g,
  tableRowBlankLine: /\n[ \t]*$/,
  tableAlignRight: /^ *-+: *$/,
  tableAlignCenter: /^ *:-+: *$/,
  tableAlignLeft: /^ *:-+ *$/,
  startATag: /^<a /i,
  endATag: /^<\/a>/i,
  startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i,
  endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i,
  startAngleBracket: /^</,
  endAngleBracket: />$/,
  pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/,
  unicodeAlphaNumeric: /[\p{L}\p{N}]/u,
  escapeTest: /[&<>"']/,
  escapeReplace: /[&<>"']/g,
  escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,
  escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,
  unescapeTest: /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig,
  caret: /(^|[^\[])\^/g,
  percentDecode: /%25/g,
  findPipe: /\|/g,
  splitPipe: / \|/,
  slashPipe: /\\\|/g,
  carriageReturn: /\r\n|\r/g,
  spaceLine: /^ +$/gm,
  notSpaceStart: /^\S*/,
  endingNewline: /\n$/,
  listItemRegex: (r) => new RegExp(`^( {0,3}${r})((?:[	 ][^\\n]*)?(?:\\n|$))`),
  nextBulletRegex: (r) => new RegExp(`^ {0,${Math.min(3, r - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),
  hrRegex: (r) => new RegExp(`^ {0,${Math.min(3, r - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),
  fencesBeginRegex: (r) => new RegExp(`^ {0,${Math.min(3, r - 1)}}(?:\`\`\`|~~~)`),
  headingBeginRegex: (r) => new RegExp(`^ {0,${Math.min(3, r - 1)}}#`),
  htmlBeginRegex: (r) => new RegExp(`^ {0,${Math.min(3, r - 1)}}<(?:[a-z].*>|!--)`, "i")
}, Te = /^(?:[ \t]*(?:\n|$))+/, ve = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, _e = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, z = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, ze = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, j = /(?:[*+-]|\d{1,9}[.)])/, oe = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, ce = g(oe).replace(/bull/g, j).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), Ae = g(oe).replace(/bull/g, j).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), H = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, Le = /^[^\n]+/, Q = /(?!\s*\])(?:\\.|[^\[\]\\])+/, Ce = g(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", Q).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), Pe = g(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, j).getRegex(), E = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", F = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, Ie = g(
  "^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))",
  "i"
).replace("comment", F).replace("tag", E).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), he = g(H).replace("hr", z).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", E).getRegex(), Be = g(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", he).getRegex(), U = {
  blockquote: Be,
  code: ve,
  def: Ce,
  fences: _e,
  heading: ze,
  hr: z,
  html: Ie,
  lheading: ce,
  list: Pe,
  newline: Te,
  paragraph: he,
  table: _,
  text: Le
}, ne = g(
  "^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)"
).replace("hr", z).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", E).getRegex(), Ee = {
  ...U,
  lheading: Ae,
  table: ne,
  paragraph: g(H).replace("hr", z).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", ne).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", E).getRegex()
}, qe = {
  ...U,
  html: g(
    `^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`
  ).replace("comment", F).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
  heading: /^(#{1,6})(.*)(?:\n+|$)/,
  fences: _,
  // fences not supported
  lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
  paragraph: g(H).replace("hr", z).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", ce).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex()
}, De = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, Ze = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, pe = /^( {2,}|\\)\n(?!\s*$)/, Me = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, q = /[\p{P}\p{S}]/u, X = /[\s\p{P}\p{S}]/u, ue = /[^\s\p{P}\p{S}]/u, Ge = g(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, X).getRegex(), ge = /(?!~)[\p{P}\p{S}]/u, Oe = /(?!~)[\s\p{P}\p{S}]/u, Ne = /(?:[^\s\p{P}\p{S}]|~)/u, je = /\[[^[\]]*?\]\((?:\\.|[^\\\(\)]|\((?:\\.|[^\\\(\)])*\))*\)|`[^`]*?`|<[^<>]*?>/g, fe = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, He = g(fe, "u").replace(/punct/g, q).getRegex(), Qe = g(fe, "u").replace(/punct/g, ge).getRegex(), ke = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", Fe = g(ke, "gu").replace(/notPunctSpace/g, ue).replace(/punctSpace/g, X).replace(/punct/g, q).getRegex(), Ue = g(ke, "gu").replace(/notPunctSpace/g, Ne).replace(/punctSpace/g, Oe).replace(/punct/g, ge).getRegex(), Xe = g(
  "^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)",
  "gu"
).replace(/notPunctSpace/g, ue).replace(/punctSpace/g, X).replace(/punct/g, q).getRegex(), We = g(/\\(punct)/, "gu").replace(/punct/g, q).getRegex(), Je = g(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), Ke = g(F).replace("(?:-->|$)", "-->").getRegex(), Ve = g(
  "^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>"
).replace("comment", Ke).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), C = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/, Ye = g(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label", C).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), de = g(/^!?\[(label)\]\[(ref)\]/).replace("label", C).replace("ref", Q).getRegex(), be = g(/^!?\[(ref)\](?:\[\])?/).replace("ref", Q).getRegex(), et = g("reflink|nolink(?!\\()", "g").replace("reflink", de).replace("nolink", be).getRegex(), W = {
  _backpedal: _,
  // only used for GFM url
  anyPunctuation: We,
  autolink: Je,
  blockSkip: je,
  br: pe,
  code: Ze,
  del: _,
  emStrongLDelim: He,
  emStrongRDelimAst: Fe,
  emStrongRDelimUnd: Xe,
  escape: De,
  link: Ye,
  nolink: be,
  punctuation: Ge,
  reflink: de,
  reflinkSearch: et,
  tag: Ve,
  text: Me,
  url: _
}, tt = {
  ...W,
  link: g(/^!?\[(label)\]\((.*?)\)/).replace("label", C).getRegex(),
  reflink: g(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", C).getRegex()
}, M = {
  ...W,
  emStrongRDelimAst: Ue,
  emStrongLDelim: Qe,
  url: g(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/, "i").replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),
  _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
  del: /^(~~?)(?=[^\s~])((?:\\.|[^\\])*?(?:\\.|[^\s~\\]))\1(?=[^~]|$)/,
  text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
}, nt = {
  ...M,
  br: g(pe).replace("{2,}", "*").getRegex(),
  text: g(M.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
}, A = {
  normal: U,
  gfm: Ee,
  pedantic: qe
}, T = {
  normal: W,
  gfm: M,
  breaks: nt,
  pedantic: tt
}, rt = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
}, re = (r) => rt[r];
function m(r, e) {
  if (e) {
    if (b.escapeTest.test(r))
      return r.replace(b.escapeReplace, re);
  } else if (b.escapeTestNoEncode.test(r))
    return r.replace(b.escapeReplaceNoEncode, re);
  return r;
}
function se(r) {
  try {
    r = encodeURI(r).replace(b.percentDecode, "%");
  } catch {
    return null;
  }
  return r;
}
function ie(r, e) {
  const t = r.replace(b.findPipe, (i, l, a) => {
    let c = !1, o = l;
    for (; --o >= 0 && a[o] === "\\"; ) c = !c;
    return c ? "|" : " |";
  }), s = t.split(b.splitPipe);
  let n = 0;
  if (s[0].trim() || s.shift(), s.length > 0 && !s.at(-1)?.trim() && s.pop(), e)
    if (s.length > e)
      s.splice(e);
    else
      for (; s.length < e; ) s.push("");
  for (; n < s.length; n++)
    s[n] = s[n].trim().replace(b.slashPipe, "|");
  return s;
}
function v(r, e, t) {
  const s = r.length;
  if (s === 0)
    return "";
  let n = 0;
  for (; n < s && r.charAt(s - n - 1) === e; )
    n++;
  return r.slice(0, s - n);
}
function st(r, e) {
  if (r.indexOf(e[1]) === -1)
    return -1;
  let t = 0;
  for (let s = 0; s < r.length; s++)
    if (r[s] === "\\")
      s++;
    else if (r[s] === e[0])
      t++;
    else if (r[s] === e[1] && (t--, t < 0))
      return s;
  return t > 0 ? -2 : -1;
}
function le(r, e, t, s, n) {
  const i = e.href, l = e.title || null, a = r[1].replace(n.other.outputLinkReplace, "$1");
  s.state.inLink = !0;
  const c = {
    type: r[0].charAt(0) === "!" ? "image" : "link",
    raw: t,
    href: i,
    title: l,
    text: a,
    tokens: s.inlineTokens(a)
  };
  return s.state.inLink = !1, c;
}
function it(r, e, t) {
  const s = r.match(t.other.indentCodeCompensation);
  if (s === null)
    return e;
  const n = s[1];
  return e.split(`
`).map((i) => {
    const l = i.match(t.other.beginningSpace);
    if (l === null)
      return i;
    const [a] = l;
    return a.length >= n.length ? i.slice(n.length) : i;
  }).join(`
`);
}
var P = class {
  options;
  rules;
  // set by the lexer
  lexer;
  // set by the lexer
  constructor(r) {
    this.options = r || R;
  }
  space(r) {
    const e = this.rules.block.newline.exec(r);
    if (e && e[0].length > 0)
      return {
        type: "space",
        raw: e[0]
      };
  }
  code(r) {
    const e = this.rules.block.code.exec(r);
    if (e) {
      const t = e[0].replace(this.rules.other.codeRemoveIndent, "");
      return {
        type: "code",
        raw: e[0],
        codeBlockStyle: "indented",
        text: this.options.pedantic ? t : v(t, `
`)
      };
    }
  }
  fences(r) {
    const e = this.rules.block.fences.exec(r);
    if (e) {
      const t = e[0], s = it(t, e[3] || "", this.rules);
      return {
        type: "code",
        raw: t,
        lang: e[2] ? e[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : e[2],
        text: s
      };
    }
  }
  heading(r) {
    const e = this.rules.block.heading.exec(r);
    if (e) {
      let t = e[2].trim();
      if (this.rules.other.endingHash.test(t)) {
        const s = v(t, "#");
        (this.options.pedantic || !s || this.rules.other.endingSpaceChar.test(s)) && (t = s.trim());
      }
      return {
        type: "heading",
        raw: e[0],
        depth: e[1].length,
        text: t,
        tokens: this.lexer.inline(t)
      };
    }
  }
  hr(r) {
    const e = this.rules.block.hr.exec(r);
    if (e)
      return {
        type: "hr",
        raw: v(e[0], `
`)
      };
  }
  blockquote(r) {
    const e = this.rules.block.blockquote.exec(r);
    if (e) {
      let t = v(e[0], `
`).split(`
`), s = "", n = "";
      const i = [];
      for (; t.length > 0; ) {
        let l = !1;
        const a = [];
        let c;
        for (c = 0; c < t.length; c++)
          if (this.rules.other.blockquoteStart.test(t[c]))
            a.push(t[c]), l = !0;
          else if (!l)
            a.push(t[c]);
          else
            break;
        t = t.slice(c);
        const o = a.join(`
`), h = o.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        s = s ? `${s}
${o}` : o, n = n ? `${n}
${h}` : h;
        const f = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(h, i, !0), this.lexer.state.top = f, t.length === 0)
          break;
        const p = i.at(-1);
        if (p?.type === "code")
          break;
        if (p?.type === "blockquote") {
          const d = p, k = d.raw + `
` + t.join(`
`), x = this.blockquote(k);
          i[i.length - 1] = x, s = s.substring(0, s.length - d.raw.length) + x.raw, n = n.substring(0, n.length - d.text.length) + x.text;
          break;
        } else if (p?.type === "list") {
          const d = p, k = d.raw + `
` + t.join(`
`), x = this.list(k);
          i[i.length - 1] = x, s = s.substring(0, s.length - p.raw.length) + x.raw, n = n.substring(0, n.length - d.raw.length) + x.raw, t = k.substring(i.at(-1).raw.length).split(`
`);
          continue;
        }
      }
      return {
        type: "blockquote",
        raw: s,
        tokens: i,
        text: n
      };
    }
  }
  list(r) {
    let e = this.rules.block.list.exec(r);
    if (e) {
      let t = e[1].trim();
      const s = t.length > 1, n = {
        type: "list",
        raw: "",
        ordered: s,
        start: s ? +t.slice(0, -1) : "",
        loose: !1,
        items: []
      };
      t = s ? `\\d{1,9}\\${t.slice(-1)}` : `\\${t}`, this.options.pedantic && (t = s ? t : "[*+-]");
      const i = this.rules.other.listItemRegex(t);
      let l = !1;
      for (; r; ) {
        let c = !1, o = "", h = "";
        if (!(e = i.exec(r)) || this.rules.block.hr.test(r))
          break;
        o = e[0], r = r.substring(o.length);
        let f = e[2].split(`
`, 1)[0].replace(this.rules.other.listReplaceTabs, (D) => " ".repeat(3 * D.length)), p = r.split(`
`, 1)[0], d = !f.trim(), k = 0;
        if (this.options.pedantic ? (k = 2, h = f.trimStart()) : d ? k = e[1].length + 1 : (k = e[2].search(this.rules.other.nonSpaceChar), k = k > 4 ? 1 : k, h = f.slice(k), k += e[1].length), d && this.rules.other.blankLine.test(p) && (o += p + `
`, r = r.substring(p.length + 1), c = !0), !c) {
          const D = this.rules.other.nextBulletRegex(k), V = this.rules.other.hrRegex(k), Y = this.rules.other.fencesBeginRegex(k), ee = this.rules.other.headingBeginRegex(k), xe = this.rules.other.htmlBeginRegex(k);
          for (; r; ) {
            const Z = r.split(`
`, 1)[0];
            let S;
            if (p = Z, this.options.pedantic ? (p = p.replace(this.rules.other.listReplaceNesting, "  "), S = p) : S = p.replace(this.rules.other.tabCharGlobal, "    "), Y.test(p) || ee.test(p) || xe.test(p) || D.test(p) || V.test(p))
              break;
            if (S.search(this.rules.other.nonSpaceChar) >= k || !p.trim())
              h += `
` + S.slice(k);
            else {
              if (d || f.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || Y.test(f) || ee.test(f) || V.test(f))
                break;
              h += `
` + p;
            }
            !d && !p.trim() && (d = !0), o += Z + `
`, r = r.substring(Z.length + 1), f = S.slice(k);
          }
        }
        n.loose || (l ? n.loose = !0 : this.rules.other.doubleBlankLine.test(o) && (l = !0));
        let x = null, K;
        this.options.gfm && (x = this.rules.other.listIsTask.exec(h), x && (K = x[0] !== "[ ] ", h = h.replace(this.rules.other.listReplaceTask, ""))), n.items.push({
          type: "list_item",
          raw: o,
          task: !!x,
          checked: K,
          loose: !1,
          text: h,
          tokens: []
        }), n.raw += o;
      }
      const a = n.items.at(-1);
      if (a)
        a.raw = a.raw.trimEnd(), a.text = a.text.trimEnd();
      else
        return;
      n.raw = n.raw.trimEnd();
      for (let c = 0; c < n.items.length; c++)
        if (this.lexer.state.top = !1, n.items[c].tokens = this.lexer.blockTokens(n.items[c].text, []), !n.loose) {
          const o = n.items[c].tokens.filter((f) => f.type === "space"), h = o.length > 0 && o.some((f) => this.rules.other.anyLine.test(f.raw));
          n.loose = h;
        }
      if (n.loose)
        for (let c = 0; c < n.items.length; c++)
          n.items[c].loose = !0;
      return n;
    }
  }
  html(r) {
    const e = this.rules.block.html.exec(r);
    if (e)
      return {
        type: "html",
        block: !0,
        raw: e[0],
        pre: e[1] === "pre" || e[1] === "script" || e[1] === "style",
        text: e[0]
      };
  }
  def(r) {
    const e = this.rules.block.def.exec(r);
    if (e) {
      const t = e[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "), s = e[2] ? e[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", n = e[3] ? e[3].substring(1, e[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : e[3];
      return {
        type: "def",
        tag: t,
        raw: e[0],
        href: s,
        title: n
      };
    }
  }
  table(r) {
    const e = this.rules.block.table.exec(r);
    if (!e || !this.rules.other.tableDelimiter.test(e[2]))
      return;
    const t = ie(e[1]), s = e[2].replace(this.rules.other.tableAlignChars, "").split("|"), n = e[3]?.trim() ? e[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], i = {
      type: "table",
      raw: e[0],
      header: [],
      align: [],
      rows: []
    };
    if (t.length === s.length) {
      for (const l of s)
        this.rules.other.tableAlignRight.test(l) ? i.align.push("right") : this.rules.other.tableAlignCenter.test(l) ? i.align.push("center") : this.rules.other.tableAlignLeft.test(l) ? i.align.push("left") : i.align.push(null);
      for (let l = 0; l < t.length; l++)
        i.header.push({
          text: t[l],
          tokens: this.lexer.inline(t[l]),
          header: !0,
          align: i.align[l]
        });
      for (const l of n)
        i.rows.push(ie(l, i.header.length).map((a, c) => ({
          text: a,
          tokens: this.lexer.inline(a),
          header: !1,
          align: i.align[c]
        })));
      return i;
    }
  }
  lheading(r) {
    const e = this.rules.block.lheading.exec(r);
    if (e)
      return {
        type: "heading",
        raw: e[0],
        depth: e[2].charAt(0) === "=" ? 1 : 2,
        text: e[1],
        tokens: this.lexer.inline(e[1])
      };
  }
  paragraph(r) {
    const e = this.rules.block.paragraph.exec(r);
    if (e) {
      const t = e[1].charAt(e[1].length - 1) === `
` ? e[1].slice(0, -1) : e[1];
      return {
        type: "paragraph",
        raw: e[0],
        text: t,
        tokens: this.lexer.inline(t)
      };
    }
  }
  text(r) {
    const e = this.rules.block.text.exec(r);
    if (e)
      return {
        type: "text",
        raw: e[0],
        text: e[0],
        tokens: this.lexer.inline(e[0])
      };
  }
  escape(r) {
    const e = this.rules.inline.escape.exec(r);
    if (e)
      return {
        type: "escape",
        raw: e[0],
        text: e[1]
      };
  }
  tag(r) {
    const e = this.rules.inline.tag.exec(r);
    if (e)
      return !this.lexer.state.inLink && this.rules.other.startATag.test(e[0]) ? this.lexer.state.inLink = !0 : this.lexer.state.inLink && this.rules.other.endATag.test(e[0]) && (this.lexer.state.inLink = !1), !this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(e[0]) ? this.lexer.state.inRawBlock = !0 : this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(e[0]) && (this.lexer.state.inRawBlock = !1), {
        type: "html",
        raw: e[0],
        inLink: this.lexer.state.inLink,
        inRawBlock: this.lexer.state.inRawBlock,
        block: !1,
        text: e[0]
      };
  }
  link(r) {
    const e = this.rules.inline.link.exec(r);
    if (e) {
      const t = e[2].trim();
      if (!this.options.pedantic && this.rules.other.startAngleBracket.test(t)) {
        if (!this.rules.other.endAngleBracket.test(t))
          return;
        const i = v(t.slice(0, -1), "\\");
        if ((t.length - i.length) % 2 === 0)
          return;
      } else {
        const i = st(e[2], "()");
        if (i === -2)
          return;
        if (i > -1) {
          const a = (e[0].indexOf("!") === 0 ? 5 : 4) + e[1].length + i;
          e[2] = e[2].substring(0, i), e[0] = e[0].substring(0, a).trim(), e[3] = "";
        }
      }
      let s = e[2], n = "";
      if (this.options.pedantic) {
        const i = this.rules.other.pedanticHrefTitle.exec(s);
        i && (s = i[1], n = i[3]);
      } else
        n = e[3] ? e[3].slice(1, -1) : "";
      return s = s.trim(), this.rules.other.startAngleBracket.test(s) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(t) ? s = s.slice(1) : s = s.slice(1, -1)), le(e, {
        href: s && s.replace(this.rules.inline.anyPunctuation, "$1"),
        title: n && n.replace(this.rules.inline.anyPunctuation, "$1")
      }, e[0], this.lexer, this.rules);
    }
  }
  reflink(r, e) {
    let t;
    if ((t = this.rules.inline.reflink.exec(r)) || (t = this.rules.inline.nolink.exec(r))) {
      const s = (t[2] || t[1]).replace(this.rules.other.multipleSpaceGlobal, " "), n = e[s.toLowerCase()];
      if (!n) {
        const i = t[0].charAt(0);
        return {
          type: "text",
          raw: i,
          text: i
        };
      }
      return le(t, n, t[0], this.lexer, this.rules);
    }
  }
  emStrong(r, e, t = "") {
    let s = this.rules.inline.emStrongLDelim.exec(r);
    if (!s || s[3] && t.match(this.rules.other.unicodeAlphaNumeric)) return;
    if (!(s[1] || s[2] || "") || !t || this.rules.inline.punctuation.exec(t)) {
      const i = [...s[0]].length - 1;
      let l, a, c = i, o = 0;
      const h = s[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (h.lastIndex = 0, e = e.slice(-1 * r.length + i); (s = h.exec(e)) != null; ) {
        if (l = s[1] || s[2] || s[3] || s[4] || s[5] || s[6], !l) continue;
        if (a = [...l].length, s[3] || s[4]) {
          c += a;
          continue;
        } else if ((s[5] || s[6]) && i % 3 && !((i + a) % 3)) {
          o += a;
          continue;
        }
        if (c -= a, c > 0) continue;
        a = Math.min(a, a + c + o);
        const f = [...s[0]][0].length, p = r.slice(0, i + s.index + f + a);
        if (Math.min(i, a) % 2) {
          const k = p.slice(1, -1);
          return {
            type: "em",
            raw: p,
            text: k,
            tokens: this.lexer.inlineTokens(k)
          };
        }
        const d = p.slice(2, -2);
        return {
          type: "strong",
          raw: p,
          text: d,
          tokens: this.lexer.inlineTokens(d)
        };
      }
    }
  }
  codespan(r) {
    const e = this.rules.inline.code.exec(r);
    if (e) {
      let t = e[2].replace(this.rules.other.newLineCharGlobal, " ");
      const s = this.rules.other.nonSpaceChar.test(t), n = this.rules.other.startingSpaceChar.test(t) && this.rules.other.endingSpaceChar.test(t);
      return s && n && (t = t.substring(1, t.length - 1)), {
        type: "codespan",
        raw: e[0],
        text: t
      };
    }
  }
  br(r) {
    const e = this.rules.inline.br.exec(r);
    if (e)
      return {
        type: "br",
        raw: e[0]
      };
  }
  del(r) {
    const e = this.rules.inline.del.exec(r);
    if (e)
      return {
        type: "del",
        raw: e[0],
        text: e[2],
        tokens: this.lexer.inlineTokens(e[2])
      };
  }
  autolink(r) {
    const e = this.rules.inline.autolink.exec(r);
    if (e) {
      let t, s;
      return e[2] === "@" ? (t = e[1], s = "mailto:" + t) : (t = e[1], s = t), {
        type: "link",
        raw: e[0],
        text: t,
        href: s,
        tokens: [
          {
            type: "text",
            raw: t,
            text: t
          }
        ]
      };
    }
  }
  url(r) {
    let e;
    if (e = this.rules.inline.url.exec(r)) {
      let t, s;
      if (e[2] === "@")
        t = e[0], s = "mailto:" + t;
      else {
        let n;
        do
          n = e[0], e[0] = this.rules.inline._backpedal.exec(e[0])?.[0] ?? "";
        while (n !== e[0]);
        t = e[0], e[1] === "www." ? s = "http://" + e[0] : s = e[0];
      }
      return {
        type: "link",
        raw: e[0],
        text: t,
        href: s,
        tokens: [
          {
            type: "text",
            raw: t,
            text: t
          }
        ]
      };
    }
  }
  inlineText(r) {
    const e = this.rules.inline.text.exec(r);
    if (e) {
      const t = this.lexer.state.inRawBlock;
      return {
        type: "text",
        raw: e[0],
        text: e[0],
        escaped: t
      };
    }
  }
}, w = class G {
  tokens;
  options;
  state;
  tokenizer;
  inlineQueue;
  constructor(e) {
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || R, this.options.tokenizer = this.options.tokenizer || new P(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = {
      inLink: !1,
      inRawBlock: !1,
      top: !0
    };
    const t = {
      other: b,
      block: A.normal,
      inline: T.normal
    };
    this.options.pedantic ? (t.block = A.pedantic, t.inline = T.pedantic) : this.options.gfm && (t.block = A.gfm, this.options.breaks ? t.inline = T.breaks : t.inline = T.gfm), this.tokenizer.rules = t;
  }
  /**
   * Expose Rules
   */
  static get rules() {
    return {
      block: A,
      inline: T
    };
  }
  /**
   * Static Lex Method
   */
  static lex(e, t) {
    return new G(t).lex(e);
  }
  /**
   * Static Lex Inline Method
   */
  static lexInline(e, t) {
    return new G(t).inlineTokens(e);
  }
  /**
   * Preprocessing
   */
  lex(e) {
    e = e.replace(b.carriageReturn, `
`), this.blockTokens(e, this.tokens);
    for (let t = 0; t < this.inlineQueue.length; t++) {
      const s = this.inlineQueue[t];
      this.inlineTokens(s.src, s.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(e, t = [], s = !1) {
    for (this.options.pedantic && (e = e.replace(b.tabCharGlobal, "    ").replace(b.spaceLine, "")); e; ) {
      let n;
      if (this.options.extensions?.block?.some((l) => (n = l.call({ lexer: this }, e, t)) ? (e = e.substring(n.raw.length), t.push(n), !0) : !1))
        continue;
      if (n = this.tokenizer.space(e)) {
        e = e.substring(n.raw.length);
        const l = t.at(-1);
        n.raw.length === 1 && l !== void 0 ? l.raw += `
` : t.push(n);
        continue;
      }
      if (n = this.tokenizer.code(e)) {
        e = e.substring(n.raw.length);
        const l = t.at(-1);
        l?.type === "paragraph" || l?.type === "text" ? (l.raw += `
` + n.raw, l.text += `
` + n.text, this.inlineQueue.at(-1).src = l.text) : t.push(n);
        continue;
      }
      if (n = this.tokenizer.fences(e)) {
        e = e.substring(n.raw.length), t.push(n);
        continue;
      }
      if (n = this.tokenizer.heading(e)) {
        e = e.substring(n.raw.length), t.push(n);
        continue;
      }
      if (n = this.tokenizer.hr(e)) {
        e = e.substring(n.raw.length), t.push(n);
        continue;
      }
      if (n = this.tokenizer.blockquote(e)) {
        e = e.substring(n.raw.length), t.push(n);
        continue;
      }
      if (n = this.tokenizer.list(e)) {
        e = e.substring(n.raw.length), t.push(n);
        continue;
      }
      if (n = this.tokenizer.html(e)) {
        e = e.substring(n.raw.length), t.push(n);
        continue;
      }
      if (n = this.tokenizer.def(e)) {
        e = e.substring(n.raw.length);
        const l = t.at(-1);
        l?.type === "paragraph" || l?.type === "text" ? (l.raw += `
` + n.raw, l.text += `
` + n.raw, this.inlineQueue.at(-1).src = l.text) : this.tokens.links[n.tag] || (this.tokens.links[n.tag] = {
          href: n.href,
          title: n.title
        });
        continue;
      }
      if (n = this.tokenizer.table(e)) {
        e = e.substring(n.raw.length), t.push(n);
        continue;
      }
      if (n = this.tokenizer.lheading(e)) {
        e = e.substring(n.raw.length), t.push(n);
        continue;
      }
      let i = e;
      if (this.options.extensions?.startBlock) {
        let l = 1 / 0;
        const a = e.slice(1);
        let c;
        this.options.extensions.startBlock.forEach((o) => {
          c = o.call({ lexer: this }, a), typeof c == "number" && c >= 0 && (l = Math.min(l, c));
        }), l < 1 / 0 && l >= 0 && (i = e.substring(0, l + 1));
      }
      if (this.state.top && (n = this.tokenizer.paragraph(i))) {
        const l = t.at(-1);
        s && l?.type === "paragraph" ? (l.raw += `
` + n.raw, l.text += `
` + n.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = l.text) : t.push(n), s = i.length !== e.length, e = e.substring(n.raw.length);
        continue;
      }
      if (n = this.tokenizer.text(e)) {
        e = e.substring(n.raw.length);
        const l = t.at(-1);
        l?.type === "text" ? (l.raw += `
` + n.raw, l.text += `
` + n.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = l.text) : t.push(n);
        continue;
      }
      if (e) {
        const l = "Infinite loop on byte: " + e.charCodeAt(0);
        if (this.options.silent) {
          console.error(l);
          break;
        } else
          throw new Error(l);
      }
    }
    return this.state.top = !0, t;
  }
  inline(e, t = []) {
    return this.inlineQueue.push({ src: e, tokens: t }), t;
  }
  /**
   * Lexing/Compiling
   */
  inlineTokens(e, t = []) {
    let s = e, n = null;
    if (this.tokens.links) {
      const a = Object.keys(this.tokens.links);
      if (a.length > 0)
        for (; (n = this.tokenizer.rules.inline.reflinkSearch.exec(s)) != null; )
          a.includes(n[0].slice(n[0].lastIndexOf("[") + 1, -1)) && (s = s.slice(0, n.index) + "[" + "a".repeat(n[0].length - 2) + "]" + s.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
    }
    for (; (n = this.tokenizer.rules.inline.anyPunctuation.exec(s)) != null; )
      s = s.slice(0, n.index) + "++" + s.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
    for (; (n = this.tokenizer.rules.inline.blockSkip.exec(s)) != null; )
      s = s.slice(0, n.index) + "[" + "a".repeat(n[0].length - 2) + "]" + s.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    let i = !1, l = "";
    for (; e; ) {
      i || (l = ""), i = !1;
      let a;
      if (this.options.extensions?.inline?.some((o) => (a = o.call({ lexer: this }, e, t)) ? (e = e.substring(a.raw.length), t.push(a), !0) : !1))
        continue;
      if (a = this.tokenizer.escape(e)) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      if (a = this.tokenizer.tag(e)) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      if (a = this.tokenizer.link(e)) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      if (a = this.tokenizer.reflink(e, this.tokens.links)) {
        e = e.substring(a.raw.length);
        const o = t.at(-1);
        a.type === "text" && o?.type === "text" ? (o.raw += a.raw, o.text += a.text) : t.push(a);
        continue;
      }
      if (a = this.tokenizer.emStrong(e, s, l)) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      if (a = this.tokenizer.codespan(e)) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      if (a = this.tokenizer.br(e)) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      if (a = this.tokenizer.del(e)) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      if (a = this.tokenizer.autolink(e)) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      if (!this.state.inLink && (a = this.tokenizer.url(e))) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      let c = e;
      if (this.options.extensions?.startInline) {
        let o = 1 / 0;
        const h = e.slice(1);
        let f;
        this.options.extensions.startInline.forEach((p) => {
          f = p.call({ lexer: this }, h), typeof f == "number" && f >= 0 && (o = Math.min(o, f));
        }), o < 1 / 0 && o >= 0 && (c = e.substring(0, o + 1));
      }
      if (a = this.tokenizer.inlineText(c)) {
        e = e.substring(a.raw.length), a.raw.slice(-1) !== "_" && (l = a.raw.slice(-1)), i = !0;
        const o = t.at(-1);
        o?.type === "text" ? (o.raw += a.raw, o.text += a.text) : t.push(a);
        continue;
      }
      if (e) {
        const o = "Infinite loop on byte: " + e.charCodeAt(0);
        if (this.options.silent) {
          console.error(o);
          break;
        } else
          throw new Error(o);
      }
    }
    return t;
  }
}, I = class {
  options;
  parser;
  // set by the parser
  constructor(r) {
    this.options = r || R;
  }
  space(r) {
    return "";
  }
  code({ text: r, lang: e, escaped: t }) {
    const s = (e || "").match(b.notSpaceStart)?.[0], n = r.replace(b.endingNewline, "") + `
`;
    return s ? '<pre><code class="language-' + m(s) + '">' + (t ? n : m(n, !0)) + `</code></pre>
` : "<pre><code>" + (t ? n : m(n, !0)) + `</code></pre>
`;
  }
  blockquote({ tokens: r }) {
    return `<blockquote>
${this.parser.parse(r)}</blockquote>
`;
  }
  html({ text: r }) {
    return r;
  }
  heading({ tokens: r, depth: e }) {
    return `<h${e}>${this.parser.parseInline(r)}</h${e}>
`;
  }
  hr(r) {
    return `<hr>
`;
  }
  list(r) {
    const e = r.ordered, t = r.start;
    let s = "";
    for (let l = 0; l < r.items.length; l++) {
      const a = r.items[l];
      s += this.listitem(a);
    }
    const n = e ? "ol" : "ul", i = e && t !== 1 ? ' start="' + t + '"' : "";
    return "<" + n + i + `>
` + s + "</" + n + `>
`;
  }
  listitem(r) {
    let e = "";
    if (r.task) {
      const t = this.checkbox({ checked: !!r.checked });
      r.loose ? r.tokens[0]?.type === "paragraph" ? (r.tokens[0].text = t + " " + r.tokens[0].text, r.tokens[0].tokens && r.tokens[0].tokens.length > 0 && r.tokens[0].tokens[0].type === "text" && (r.tokens[0].tokens[0].text = t + " " + m(r.tokens[0].tokens[0].text), r.tokens[0].tokens[0].escaped = !0)) : r.tokens.unshift({
        type: "text",
        raw: t + " ",
        text: t + " ",
        escaped: !0
      }) : e += t + " ";
    }
    return e += this.parser.parse(r.tokens, !!r.loose), `<li>${e}</li>
`;
  }
  checkbox({ checked: r }) {
    return "<input " + (r ? 'checked="" ' : "") + 'disabled="" type="checkbox">';
  }
  paragraph({ tokens: r }) {
    return `<p>${this.parser.parseInline(r)}</p>
`;
  }
  table(r) {
    let e = "", t = "";
    for (let n = 0; n < r.header.length; n++)
      t += this.tablecell(r.header[n]);
    e += this.tablerow({ text: t });
    let s = "";
    for (let n = 0; n < r.rows.length; n++) {
      const i = r.rows[n];
      t = "";
      for (let l = 0; l < i.length; l++)
        t += this.tablecell(i[l]);
      s += this.tablerow({ text: t });
    }
    return s && (s = `<tbody>${s}</tbody>`), `<table>
<thead>
` + e + `</thead>
` + s + `</table>
`;
  }
  tablerow({ text: r }) {
    return `<tr>
${r}</tr>
`;
  }
  tablecell(r) {
    const e = this.parser.parseInline(r.tokens), t = r.header ? "th" : "td";
    return (r.align ? `<${t} align="${r.align}">` : `<${t}>`) + e + `</${t}>
`;
  }
  /**
   * span level renderer
   */
  strong({ tokens: r }) {
    return `<strong>${this.parser.parseInline(r)}</strong>`;
  }
  em({ tokens: r }) {
    return `<em>${this.parser.parseInline(r)}</em>`;
  }
  codespan({ text: r }) {
    return `<code>${m(r, !0)}</code>`;
  }
  br(r) {
    return "<br>";
  }
  del({ tokens: r }) {
    return `<del>${this.parser.parseInline(r)}</del>`;
  }
  link({ href: r, title: e, tokens: t }) {
    const s = this.parser.parseInline(t), n = se(r);
    if (n === null)
      return s;
    r = n;
    let i = '<a href="' + r + '"';
    return e && (i += ' title="' + m(e) + '"'), i += ">" + s + "</a>", i;
  }
  image({ href: r, title: e, text: t, tokens: s }) {
    s && (t = this.parser.parseInline(s, this.parser.textRenderer));
    const n = se(r);
    if (n === null)
      return m(t);
    r = n;
    let i = `<img src="${r}" alt="${t}"`;
    return e && (i += ` title="${m(e)}"`), i += ">", i;
  }
  text(r) {
    return "tokens" in r && r.tokens ? this.parser.parseInline(r.tokens) : "escaped" in r && r.escaped ? r.text : m(r.text);
  }
}, J = class {
  // no need for block level renderers
  strong({ text: r }) {
    return r;
  }
  em({ text: r }) {
    return r;
  }
  codespan({ text: r }) {
    return r;
  }
  del({ text: r }) {
    return r;
  }
  html({ text: r }) {
    return r;
  }
  text({ text: r }) {
    return r;
  }
  link({ text: r }) {
    return "" + r;
  }
  image({ text: r }) {
    return "" + r;
  }
  br() {
    return "";
  }
}, y = class O {
  options;
  renderer;
  textRenderer;
  constructor(e) {
    this.options = e || R, this.options.renderer = this.options.renderer || new I(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new J();
  }
  /**
   * Static Parse Method
   */
  static parse(e, t) {
    return new O(t).parse(e);
  }
  /**
   * Static Parse Inline Method
   */
  static parseInline(e, t) {
    return new O(t).parseInline(e);
  }
  /**
   * Parse Loop
   */
  parse(e, t = !0) {
    let s = "";
    for (let n = 0; n < e.length; n++) {
      const i = e[n];
      if (this.options.extensions?.renderers?.[i.type]) {
        const a = i, c = this.options.extensions.renderers[a.type].call({ parser: this }, a);
        if (c !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "paragraph", "text"].includes(a.type)) {
          s += c || "";
          continue;
        }
      }
      const l = i;
      switch (l.type) {
        case "space": {
          s += this.renderer.space(l);
          continue;
        }
        case "hr": {
          s += this.renderer.hr(l);
          continue;
        }
        case "heading": {
          s += this.renderer.heading(l);
          continue;
        }
        case "code": {
          s += this.renderer.code(l);
          continue;
        }
        case "table": {
          s += this.renderer.table(l);
          continue;
        }
        case "blockquote": {
          s += this.renderer.blockquote(l);
          continue;
        }
        case "list": {
          s += this.renderer.list(l);
          continue;
        }
        case "html": {
          s += this.renderer.html(l);
          continue;
        }
        case "paragraph": {
          s += this.renderer.paragraph(l);
          continue;
        }
        case "text": {
          let a = l, c = this.renderer.text(a);
          for (; n + 1 < e.length && e[n + 1].type === "text"; )
            a = e[++n], c += `
` + this.renderer.text(a);
          t ? s += this.renderer.paragraph({
            type: "paragraph",
            raw: c,
            text: c,
            tokens: [{ type: "text", raw: c, text: c, escaped: !0 }]
          }) : s += c;
          continue;
        }
        default: {
          const a = 'Token with "' + l.type + '" type was not found.';
          if (this.options.silent)
            return console.error(a), "";
          throw new Error(a);
        }
      }
    }
    return s;
  }
  /**
   * Parse Inline Tokens
   */
  parseInline(e, t = this.renderer) {
    let s = "";
    for (let n = 0; n < e.length; n++) {
      const i = e[n];
      if (this.options.extensions?.renderers?.[i.type]) {
        const a = this.options.extensions.renderers[i.type].call({ parser: this }, i);
        if (a !== !1 || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(i.type)) {
          s += a || "";
          continue;
        }
      }
      const l = i;
      switch (l.type) {
        case "escape": {
          s += t.text(l);
          break;
        }
        case "html": {
          s += t.html(l);
          break;
        }
        case "link": {
          s += t.link(l);
          break;
        }
        case "image": {
          s += t.image(l);
          break;
        }
        case "strong": {
          s += t.strong(l);
          break;
        }
        case "em": {
          s += t.em(l);
          break;
        }
        case "codespan": {
          s += t.codespan(l);
          break;
        }
        case "br": {
          s += t.br(l);
          break;
        }
        case "del": {
          s += t.del(l);
          break;
        }
        case "text": {
          s += t.text(l);
          break;
        }
        default: {
          const a = 'Token with "' + l.type + '" type was not found.';
          if (this.options.silent)
            return console.error(a), "";
          throw new Error(a);
        }
      }
    }
    return s;
  }
}, L = class {
  options;
  block;
  constructor(r) {
    this.options = r || R;
  }
  static passThroughHooks = /* @__PURE__ */ new Set([
    "preprocess",
    "postprocess",
    "processAllTokens"
  ]);
  /**
   * Process markdown before marked
   */
  preprocess(r) {
    return r;
  }
  /**
   * Process HTML after marked is finished
   */
  postprocess(r) {
    return r;
  }
  /**
   * Process all tokens before walk tokens
   */
  processAllTokens(r) {
    return r;
  }
  /**
   * Provide function to tokenize markdown
   */
  provideLexer() {
    return this.block ? w.lex : w.lexInline;
  }
  /**
   * Provide function to parse tokens
   */
  provideParser() {
    return this.block ? y.parse : y.parseInline;
  }
}, lt = class {
  defaults = N();
  options = this.setOptions;
  parse = this.parseMarkdown(!0);
  parseInline = this.parseMarkdown(!1);
  Parser = y;
  Renderer = I;
  TextRenderer = J;
  Lexer = w;
  Tokenizer = P;
  Hooks = L;
  constructor(...r) {
    this.use(...r);
  }
  /**
   * Run callback for every token
   */
  walkTokens(r, e) {
    let t = [];
    for (const s of r)
      switch (t = t.concat(e.call(this, s)), s.type) {
        case "table": {
          const n = s;
          for (const i of n.header)
            t = t.concat(this.walkTokens(i.tokens, e));
          for (const i of n.rows)
            for (const l of i)
              t = t.concat(this.walkTokens(l.tokens, e));
          break;
        }
        case "list": {
          const n = s;
          t = t.concat(this.walkTokens(n.items, e));
          break;
        }
        default: {
          const n = s;
          this.defaults.extensions?.childTokens?.[n.type] ? this.defaults.extensions.childTokens[n.type].forEach((i) => {
            const l = n[i].flat(1 / 0);
            t = t.concat(this.walkTokens(l, e));
          }) : n.tokens && (t = t.concat(this.walkTokens(n.tokens, e)));
        }
      }
    return t;
  }
  use(...r) {
    const e = this.defaults.extensions || { renderers: {}, childTokens: {} };
    return r.forEach((t) => {
      const s = { ...t };
      if (s.async = this.defaults.async || s.async || !1, t.extensions && (t.extensions.forEach((n) => {
        if (!n.name)
          throw new Error("extension name required");
        if ("renderer" in n) {
          const i = e.renderers[n.name];
          i ? e.renderers[n.name] = function(...l) {
            let a = n.renderer.apply(this, l);
            return a === !1 && (a = i.apply(this, l)), a;
          } : e.renderers[n.name] = n.renderer;
        }
        if ("tokenizer" in n) {
          if (!n.level || n.level !== "block" && n.level !== "inline")
            throw new Error("extension level must be 'block' or 'inline'");
          const i = e[n.level];
          i ? i.unshift(n.tokenizer) : e[n.level] = [n.tokenizer], n.start && (n.level === "block" ? e.startBlock ? e.startBlock.push(n.start) : e.startBlock = [n.start] : n.level === "inline" && (e.startInline ? e.startInline.push(n.start) : e.startInline = [n.start]));
        }
        "childTokens" in n && n.childTokens && (e.childTokens[n.name] = n.childTokens);
      }), s.extensions = e), t.renderer) {
        const n = this.defaults.renderer || new I(this.defaults);
        for (const i in t.renderer) {
          if (!(i in n))
            throw new Error(`renderer '${i}' does not exist`);
          if (["options", "parser"].includes(i))
            continue;
          const l = i, a = t.renderer[l], c = n[l];
          n[l] = (...o) => {
            let h = a.apply(n, o);
            return h === !1 && (h = c.apply(n, o)), h || "";
          };
        }
        s.renderer = n;
      }
      if (t.tokenizer) {
        const n = this.defaults.tokenizer || new P(this.defaults);
        for (const i in t.tokenizer) {
          if (!(i in n))
            throw new Error(`tokenizer '${i}' does not exist`);
          if (["options", "rules", "lexer"].includes(i))
            continue;
          const l = i, a = t.tokenizer[l], c = n[l];
          n[l] = (...o) => {
            let h = a.apply(n, o);
            return h === !1 && (h = c.apply(n, o)), h;
          };
        }
        s.tokenizer = n;
      }
      if (t.hooks) {
        const n = this.defaults.hooks || new L();
        for (const i in t.hooks) {
          if (!(i in n))
            throw new Error(`hook '${i}' does not exist`);
          if (["options", "block"].includes(i))
            continue;
          const l = i, a = t.hooks[l], c = n[l];
          L.passThroughHooks.has(i) ? n[l] = (o) => {
            if (this.defaults.async)
              return Promise.resolve(a.call(n, o)).then((f) => c.call(n, f));
            const h = a.call(n, o);
            return c.call(n, h);
          } : n[l] = (...o) => {
            let h = a.apply(n, o);
            return h === !1 && (h = c.apply(n, o)), h;
          };
        }
        s.hooks = n;
      }
      if (t.walkTokens) {
        const n = this.defaults.walkTokens, i = t.walkTokens;
        s.walkTokens = function(l) {
          let a = [];
          return a.push(i.call(this, l)), n && (a = a.concat(n.call(this, l))), a;
        };
      }
      this.defaults = { ...this.defaults, ...s };
    }), this;
  }
  setOptions(r) {
    return this.defaults = { ...this.defaults, ...r }, this;
  }
  lexer(r, e) {
    return w.lex(r, e ?? this.defaults);
  }
  parser(r, e) {
    return y.parse(r, e ?? this.defaults);
  }
  parseMarkdown(r) {
    return (t, s) => {
      const n = { ...s }, i = { ...this.defaults, ...n }, l = this.onError(!!i.silent, !!i.async);
      if (this.defaults.async === !0 && n.async === !1)
        return l(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof t > "u" || t === null)
        return l(new Error("marked(): input parameter is undefined or null"));
      if (typeof t != "string")
        return l(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(t) + ", string expected"));
      i.hooks && (i.hooks.options = i, i.hooks.block = r);
      const a = i.hooks ? i.hooks.provideLexer() : r ? w.lex : w.lexInline, c = i.hooks ? i.hooks.provideParser() : r ? y.parse : y.parseInline;
      if (i.async)
        return Promise.resolve(i.hooks ? i.hooks.preprocess(t) : t).then((o) => a(o, i)).then((o) => i.hooks ? i.hooks.processAllTokens(o) : o).then((o) => i.walkTokens ? Promise.all(this.walkTokens(o, i.walkTokens)).then(() => o) : o).then((o) => c(o, i)).then((o) => i.hooks ? i.hooks.postprocess(o) : o).catch(l);
      try {
        i.hooks && (t = i.hooks.preprocess(t));
        let o = a(t, i);
        i.hooks && (o = i.hooks.processAllTokens(o)), i.walkTokens && this.walkTokens(o, i.walkTokens);
        let h = c(o, i);
        return i.hooks && (h = i.hooks.postprocess(h)), h;
      } catch (o) {
        return l(o);
      }
    };
  }
  onError(r, e) {
    return (t) => {
      if (t.message += `
Please report this to https://github.com/markedjs/marked.`, r) {
        const s = "<p>An error occurred:</p><pre>" + m(t.message + "", !0) + "</pre>";
        return e ? Promise.resolve(s) : s;
      }
      if (e)
        return Promise.reject(t);
      throw t;
    };
  }
}, $ = new lt();
function u(r, e) {
  return $.parse(r, e);
}
u.options = u.setOptions = function(r) {
  return $.setOptions(r), u.defaults = $.defaults, ae(u.defaults), u;
};
u.getDefaults = N;
u.defaults = R;
u.use = function(...r) {
  return $.use(...r), u.defaults = $.defaults, ae(u.defaults), u;
};
u.walkTokens = function(r, e) {
  return $.walkTokens(r, e);
};
u.parseInline = $.parseInline;
u.Parser = y;
u.parser = y.parse;
u.Renderer = I;
u.TextRenderer = J;
u.Lexer = w;
u.lexer = w.lex;
u.Tokenizer = P;
u.Hooks = L;
u.parse = u;
u.options;
u.setOptions;
u.use;
u.walkTokens;
u.parseInline;
y.parse;
w.lex;
var at = /* @__PURE__ */ B('<main class="p-6 max-w-3xl mx-auto">'), ot = /* @__PURE__ */ B("<p>Loading..."), ct = /* @__PURE__ */ B('<h1 class="text-3xl mb-4">'), ht = /* @__PURE__ */ B("<article class=prose>");
async function pt(r) {
  const e = r.join("/");
  try {
    const a = await fetch(`https://board-api.duckdns.org/docs/${e}`);
    if (a.ok) {
      const c = await a.text(), o = c.match(/^# (.+)$/m), h = o ? o[1] : e, f = c.replace(/^# .+$/m, "").trim(), p = await u.parse(f);
      return {
        title: h,
        body: p
      };
    }
  } catch (a) {
    console.warn("External fetch failed:", a);
  }
  const t = Se(e), s = t?.match(/^# (.+)$/m), n = s ? s[1] : e, i = t?.replace(/^# .+$/m, "").trim() || "", l = await u.parse(i);
  return {
    title: n,
    body: l
  };
}
function gt() {
  const r = me(), [e] = we(() => typeof r.slug == "string" ? r.slug.split("/") : [], pt);
  return (() => {
    var t = at();
    return te(t, ye(Re, {
      get when() {
        return e();
      },
      get fallback() {
        return ot();
      },
      children: (s) => [(() => {
        var n = ct();
        return te(n, () => s().title), n;
      })(), (() => {
        var n = ht();
        return $e(() => n.innerHTML = s().body), n;
      })()]
    })), t;
  })();
}
export {
  gt as default
};
