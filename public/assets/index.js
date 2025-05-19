const fe = (e, t) => e === t, N = Symbol("solid-proxy"), Q = typeof Proxy == "function", T = {
  equals: fe
};
let ue = le;
const v = 1, j = 2, Z = {
  owned: null,
  cleanups: null,
  context: null,
  owner: null
};
var h = null;
let U = null, de = null, d = null, b = null, x = null, D = 0;
function he(e, t) {
  const n = d, s = h, r = e.length === 0, o = t === void 0 ? s : t, l = r ? Z : {
    owned: null,
    cleanups: null,
    context: o ? o.context : null,
    owner: o
  }, i = r ? e : () => e(() => O(() => C(l)));
  h = l, d = null;
  try {
    return k(i, !0);
  } finally {
    d = n, h = s;
  }
}
function ge(e, t) {
  t = t ? Object.assign({}, T, t) : T;
  const n = {
    value: e,
    observers: null,
    observerSlots: null,
    comparator: t.equals || void 0
  }, s = (r) => (typeof r == "function" && (r = r(n.value)), se(n, r));
  return [ne.bind(n), s];
}
function p(e, t, n) {
  const s = ie(e, t, !1, v);
  I(s);
}
function $(e, t, n) {
  n = n ? Object.assign({}, T, n) : T;
  const s = ie(e, t, !0, 0);
  return s.observers = null, s.observerSlots = null, s.comparator = n.equals || void 0, I(s), ne.bind(s);
}
function O(e) {
  if (d === null) return e();
  const t = d;
  d = null;
  try {
    return e();
  } finally {
    d = t;
  }
}
function ee(e, t) {
  const n = Symbol("context");
  return {
    id: n,
    Provider: xe(n),
    defaultValue: e
  };
}
function te(e) {
  let t;
  return h && h.context && (t = h.context[e.id]) !== void 0 ? t : e.defaultValue;
}
function be(e) {
  const t = $(e), n = $(() => H(t()));
  return n.toArray = () => {
    const s = n();
    return Array.isArray(s) ? s : s != null ? [s] : [];
  }, n;
}
function ne() {
  if (this.sources && this.state)
    if (this.state === v) I(this);
    else {
      const e = b;
      b = null, k(() => L(this), !1), b = e;
    }
  if (d) {
    const e = this.observers ? this.observers.length : 0;
    d.sources ? (d.sources.push(this), d.sourceSlots.push(e)) : (d.sources = [this], d.sourceSlots = [e]), this.observers ? (this.observers.push(d), this.observerSlots.push(d.sources.length - 1)) : (this.observers = [d], this.observerSlots = [d.sources.length - 1]);
  }
  return this.value;
}
function se(e, t, n) {
  let s = e.value;
  return (!e.comparator || !e.comparator(s, t)) && (e.value = t, e.observers && e.observers.length && k(() => {
    for (let r = 0; r < e.observers.length; r += 1) {
      const o = e.observers[r], l = U && U.running;
      l && U.disposed.has(o), (l ? !o.tState : !o.state) && (o.pure ? b.push(o) : x.push(o), o.observers && oe(o)), l || (o.state = v);
    }
    if (b.length > 1e6)
      throw b = [], new Error();
  }, !1)), t;
}
function I(e) {
  if (!e.fn) return;
  C(e);
  const t = D;
  ye(
    e,
    e.value,
    t
  );
}
function ye(e, t, n) {
  let s;
  const r = h, o = d;
  d = h = e;
  try {
    s = e.fn(t);
  } catch (l) {
    return e.pure && (e.state = v, e.owned && e.owned.forEach(C), e.owned = null), e.updatedAt = n + 1, ce(l);
  } finally {
    d = o, h = r;
  }
  (!e.updatedAt || e.updatedAt <= n) && (e.updatedAt != null && "observers" in e ? se(e, s) : e.value = s, e.updatedAt = n);
}
function ie(e, t, n, s = v, r) {
  const o = {
    fn: e,
    state: s,
    updatedAt: null,
    owned: null,
    sources: null,
    sourceSlots: null,
    cleanups: null,
    value: t,
    owner: h,
    context: h ? h.context : null,
    pure: n
  };
  return h === null || h !== Z && (h.owned ? h.owned.push(o) : h.owned = [o]), o;
}
function re(e) {
  if (e.state === 0) return;
  if (e.state === j) return L(e);
  if (e.suspense && O(e.suspense.inFallback)) return e.suspense.effects.push(e);
  const t = [e];
  for (; (e = e.owner) && (!e.updatedAt || e.updatedAt < D); )
    e.state && t.push(e);
  for (let n = t.length - 1; n >= 0; n--)
    if (e = t[n], e.state === v)
      I(e);
    else if (e.state === j) {
      const s = b;
      b = null, k(() => L(e, t[0]), !1), b = s;
    }
}
function k(e, t) {
  if (b) return e();
  let n = !1;
  t || (b = []), x ? n = !0 : x = [], D++;
  try {
    const s = e();
    return me(n), s;
  } catch (s) {
    n || (x = null), b = null, ce(s);
  }
}
function me(e) {
  if (b && (le(b), b = null), e) return;
  const t = x;
  x = null, t.length && k(() => ue(t), !1);
}
function le(e) {
  for (let t = 0; t < e.length; t++) re(e[t]);
}
function L(e, t) {
  e.state = 0;
  for (let n = 0; n < e.sources.length; n += 1) {
    const s = e.sources[n];
    if (s.sources) {
      const r = s.state;
      r === v ? s !== t && (!s.updatedAt || s.updatedAt < D) && re(s) : r === j && L(s, t);
    }
  }
}
function oe(e) {
  for (let t = 0; t < e.observers.length; t += 1) {
    const n = e.observers[t];
    n.state || (n.state = j, n.pure ? b.push(n) : x.push(n), n.observers && oe(n));
  }
}
function C(e) {
  let t;
  if (e.sources)
    for (; e.sources.length; ) {
      const n = e.sources.pop(), s = e.sourceSlots.pop(), r = n.observers;
      if (r && r.length) {
        const o = r.pop(), l = n.observerSlots.pop();
        s < r.length && (o.sourceSlots[l] = s, r[s] = o, n.observerSlots[s] = l);
      }
    }
  if (e.tOwned) {
    for (t = e.tOwned.length - 1; t >= 0; t--) C(e.tOwned[t]);
    delete e.tOwned;
  }
  if (e.owned) {
    for (t = e.owned.length - 1; t >= 0; t--) C(e.owned[t]);
    e.owned = null;
  }
  if (e.cleanups) {
    for (t = e.cleanups.length - 1; t >= 0; t--) e.cleanups[t]();
    e.cleanups = null;
  }
  e.state = 0;
}
function we(e) {
  return e instanceof Error ? e : new Error(typeof e == "string" ? e : "Unknown error", {
    cause: e
  });
}
function ce(e, t = h) {
  throw we(e);
}
function H(e) {
  if (typeof e == "function" && !e.length) return H(e());
  if (Array.isArray(e)) {
    const t = [];
    for (let n = 0; n < e.length; n++) {
      const s = H(e[n]);
      Array.isArray(s) ? t.push.apply(t, s) : t.push(s);
    }
    return t;
  }
  return e;
}
function xe(e, t) {
  return function(s) {
    let r;
    return p(
      () => r = O(() => (h.context = {
        ...h.context,
        [e]: s.value
      }, be(() => s.children))),
      void 0
    ), r;
  };
}
function y(e, t) {
  return O(() => e(t || {}));
}
function P() {
  return !0;
}
const F = {
  get(e, t, n) {
    return t === N ? n : e.get(t);
  },
  has(e, t) {
    return t === N ? !0 : e.has(t);
  },
  set: P,
  deleteProperty: P,
  getOwnPropertyDescriptor(e, t) {
    return {
      configurable: !0,
      enumerable: !0,
      get() {
        return e.get(t);
      },
      set: P,
      deleteProperty: P
    };
  },
  ownKeys(e) {
    return e.keys();
  }
};
function V(e) {
  return (e = typeof e == "function" ? e() : e) ? e : {};
}
function pe() {
  for (let e = 0, t = this.length; e < t; ++e) {
    const n = this[e]();
    if (n !== void 0) return n;
  }
}
function G(...e) {
  let t = !1;
  for (let l = 0; l < e.length; l++) {
    const i = e[l];
    t = t || !!i && N in i, e[l] = typeof i == "function" ? (t = !0, $(i)) : i;
  }
  if (Q && t)
    return new Proxy(
      {
        get(l) {
          for (let i = e.length - 1; i >= 0; i--) {
            const c = V(e[i])[l];
            if (c !== void 0) return c;
          }
        },
        has(l) {
          for (let i = e.length - 1; i >= 0; i--)
            if (l in V(e[i])) return !0;
          return !1;
        },
        keys() {
          const l = [];
          for (let i = 0; i < e.length; i++)
            l.push(...Object.keys(V(e[i])));
          return [...new Set(l)];
        }
      },
      F
    );
  const n = {}, s = /* @__PURE__ */ Object.create(null);
  for (let l = e.length - 1; l >= 0; l--) {
    const i = e[l];
    if (!i) continue;
    const c = Object.getOwnPropertyNames(i);
    for (let a = c.length - 1; a >= 0; a--) {
      const f = c[a];
      if (f === "__proto__" || f === "constructor") continue;
      const g = Object.getOwnPropertyDescriptor(i, f);
      if (!s[f])
        s[f] = g.get ? {
          enumerable: !0,
          configurable: !0,
          get: pe.bind(n[f] = [g.get.bind(i)])
        } : g.value !== void 0 ? g : void 0;
      else {
        const u = n[f];
        u && (g.get ? u.push(g.get.bind(i)) : g.value !== void 0 && u.push(() => g.value));
      }
    }
  }
  const r = {}, o = Object.keys(s);
  for (let l = o.length - 1; l >= 0; l--) {
    const i = o[l], c = s[i];
    c && c.get ? Object.defineProperty(r, i, c) : r[i] = c ? c.value : void 0;
  }
  return r;
}
function ve(e, ...t) {
  if (Q && N in e) {
    const r = new Set(t.length > 1 ? t.flat() : t[0]), o = t.map((l) => new Proxy(
      {
        get(i) {
          return l.includes(i) ? e[i] : void 0;
        },
        has(i) {
          return l.includes(i) && i in e;
        },
        keys() {
          return l.filter((i) => i in e);
        }
      },
      F
    ));
    return o.push(
      new Proxy(
        {
          get(l) {
            return r.has(l) ? void 0 : e[l];
          },
          has(l) {
            return r.has(l) ? !1 : l in e;
          },
          keys() {
            return Object.keys(e).filter((l) => !r.has(l));
          }
        },
        F
      )
    ), o;
  }
  const n = {}, s = t.map(() => ({}));
  for (const r of Object.getOwnPropertyNames(e)) {
    const o = Object.getOwnPropertyDescriptor(e, r), l = !o.get && !o.set && o.enumerable && o.writable && o.configurable;
    let i = !1, c = 0;
    for (const a of t)
      a.includes(r) && (i = !0, l ? s[c][r] = o.value : Object.defineProperty(s[c], r, o)), ++c;
    i || (l ? n[r] = o.value : Object.defineProperty(n, r, o));
  }
  return [...s, n];
}
const _e = [
  "allowfullscreen",
  "async",
  "autofocus",
  "autoplay",
  "checked",
  "controls",
  "default",
  "disabled",
  "formnovalidate",
  "hidden",
  "indeterminate",
  "inert",
  "ismap",
  "loop",
  "multiple",
  "muted",
  "nomodule",
  "novalidate",
  "open",
  "playsinline",
  "readonly",
  "required",
  "reversed",
  "seamless",
  "selected"
], Ae = /* @__PURE__ */ new Set([
  "className",
  "value",
  "readOnly",
  "noValidate",
  "formNoValidate",
  "isMap",
  "noModule",
  "playsInline",
  ..._e
]), $e = /* @__PURE__ */ new Set([
  "innerHTML",
  "textContent",
  "innerText",
  "children"
]), Ce = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(null), {
  className: "class",
  htmlFor: "for"
}), Se = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(null), {
  class: "className",
  novalidate: {
    $: "noValidate",
    FORM: 1
  },
  formnovalidate: {
    $: "formNoValidate",
    BUTTON: 1,
    INPUT: 1
  },
  ismap: {
    $: "isMap",
    IMG: 1
  },
  nomodule: {
    $: "noModule",
    SCRIPT: 1
  },
  playsinline: {
    $: "playsInline",
    VIDEO: 1
  },
  readonly: {
    $: "readOnly",
    INPUT: 1,
    TEXTAREA: 1
  }
});
function Oe(e, t) {
  const n = Se[e];
  return typeof n == "object" ? n[t] ? n.$ : void 0 : n;
}
const ke = /* @__PURE__ */ new Set([
  "beforeinput",
  "click",
  "dblclick",
  "contextmenu",
  "focusin",
  "focusout",
  "input",
  "keydown",
  "keyup",
  "mousedown",
  "mousemove",
  "mouseout",
  "mouseover",
  "mouseup",
  "pointerdown",
  "pointermove",
  "pointerout",
  "pointerover",
  "pointerup",
  "touchend",
  "touchmove",
  "touchstart"
]), Pe = {
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace"
};
function Ee(e, t, n) {
  let s = n.length, r = t.length, o = s, l = 0, i = 0, c = t[r - 1].nextSibling, a = null;
  for (; l < r || i < o; ) {
    if (t[l] === n[i]) {
      l++, i++;
      continue;
    }
    for (; t[r - 1] === n[o - 1]; )
      r--, o--;
    if (r === l) {
      const f = o < s ? i ? n[i - 1].nextSibling : n[o - i] : c;
      for (; i < o; ) e.insertBefore(n[i++], f);
    } else if (o === i)
      for (; l < r; )
        (!a || !a.has(t[l])) && t[l].remove(), l++;
    else if (t[l] === n[o - 1] && n[i] === t[r - 1]) {
      const f = t[--r].nextSibling;
      e.insertBefore(n[i++], t[l++].nextSibling), e.insertBefore(n[--o], f), t[r] = n[o];
    } else {
      if (!a) {
        a = /* @__PURE__ */ new Map();
        let g = i;
        for (; g < o; ) a.set(n[g], g++);
      }
      const f = a.get(t[l]);
      if (f != null)
        if (i < f && f < o) {
          let g = l, u = 1, w;
          for (; ++g < r && g < o && !((w = a.get(t[g])) == null || w !== f + u); )
            u++;
          if (u > f - i) {
            const M = t[l];
            for (; i < f; ) e.insertBefore(n[i++], M);
          } else e.replaceChild(n[i++], t[l++]);
        } else l++;
      else t[l++].remove();
    }
  }
}
const X = "_$DX_DELEGATE";
function Ne(e, t, n, s = {}) {
  let r;
  return he((o) => {
    r = o, t === document ? e() : m(t, e(), t.firstChild ? null : void 0, n);
  }, s.owner), () => {
    r(), t.textContent = "";
  };
}
function _(e, t, n, s) {
  let r;
  const o = () => {
    const i = document.createElement("template");
    return i.innerHTML = e, i.content.firstChild;
  }, l = () => (r || (r = o())).cloneNode(!0);
  return l.cloneNode = l, l;
}
function Te(e, t = window.document) {
  const n = t[X] || (t[X] = /* @__PURE__ */ new Set());
  for (let s = 0, r = e.length; s < r; s++) {
    const o = e[s];
    n.has(o) || (n.add(o), t.addEventListener(o, Ve));
  }
}
function K(e, t, n) {
  n == null ? e.removeAttribute(t) : e.setAttribute(t, n);
}
function je(e, t, n, s) {
  s == null ? e.removeAttributeNS(t, n) : e.setAttributeNS(t, n, s);
}
function Le(e, t, n) {
  n ? e.setAttribute(t, "") : e.removeAttribute(t);
}
function ae(e, t) {
  t == null ? e.removeAttribute("class") : e.className = t;
}
function De(e, t, n, s) {
  if (s)
    Array.isArray(n) ? (e[`$$${t}`] = n[0], e[`$$${t}Data`] = n[1]) : e[`$$${t}`] = n;
  else if (Array.isArray(n)) {
    const r = n[0];
    e.addEventListener(t, n[0] = (o) => r.call(e, n[1], o));
  } else e.addEventListener(t, n, typeof n != "function" && n);
}
function Ie(e, t, n = {}) {
  const s = Object.keys(t || {}), r = Object.keys(n);
  let o, l;
  for (o = 0, l = r.length; o < l; o++) {
    const i = r[o];
    !i || i === "undefined" || t[i] || (z(e, i, !1), delete n[i]);
  }
  for (o = 0, l = s.length; o < l; o++) {
    const i = s[o], c = !!t[i];
    !i || i === "undefined" || n[i] === c || !c || (z(e, i, !0), n[i] = c);
  }
  return n;
}
function Re(e, t, n) {
  if (!t) return n ? K(e, "style") : t;
  const s = e.style;
  if (typeof t == "string") return s.cssText = t;
  typeof n == "string" && (s.cssText = n = void 0), n || (n = {}), t || (t = {});
  let r, o;
  for (o in n)
    t[o] == null && s.removeProperty(o), delete n[o];
  for (o in t)
    r = t[o], r !== n[o] && (s.setProperty(o, r), n[o] = r);
  return n;
}
function R(e, t = {}, n, s) {
  const r = {};
  return s || p(
    () => r.children = S(e, t.children, r.children)
  ), p(() => typeof t.ref == "function" && Be(t.ref, e)), p(() => Me(e, t, n, !0, r, !0)), r;
}
function Be(e, t, n) {
  return O(() => e(t, n));
}
function m(e, t, n, s) {
  if (n !== void 0 && !s && (s = []), typeof t != "function") return S(e, t, s, n);
  p((r) => S(e, t(), r, n), s);
}
function Me(e, t, n, s, r = {}, o = !1) {
  t || (t = {});
  for (const l in r)
    if (!(l in t)) {
      if (l === "children") continue;
      r[l] = W(e, l, null, r[l], n, o, t);
    }
  for (const l in t) {
    if (l === "children")
      continue;
    const i = t[l];
    r[l] = W(e, l, i, r[l], n, o, t);
  }
}
function Ue(e) {
  return e.toLowerCase().replace(/-([a-z])/g, (t, n) => n.toUpperCase());
}
function z(e, t, n) {
  const s = t.trim().split(/\s+/);
  for (let r = 0, o = s.length; r < o; r++)
    e.classList.toggle(s[r], n);
}
function W(e, t, n, s, r, o, l) {
  let i, c, a, f, g;
  if (t === "style") return Re(e, n, s);
  if (t === "classList") return Ie(e, n, s);
  if (n === s) return s;
  if (t === "ref")
    o || n(e);
  else if (t.slice(0, 3) === "on:") {
    const u = t.slice(3);
    s && e.removeEventListener(u, s, typeof s != "function" && s), n && e.addEventListener(u, n, typeof n != "function" && n);
  } else if (t.slice(0, 10) === "oncapture:") {
    const u = t.slice(10);
    s && e.removeEventListener(u, s, !0), n && e.addEventListener(u, n, !0);
  } else if (t.slice(0, 2) === "on") {
    const u = t.slice(2).toLowerCase(), w = ke.has(u);
    if (!w && s) {
      const M = Array.isArray(s) ? s[0] : s;
      e.removeEventListener(u, M);
    }
    (w || n) && (De(e, u, n, w), w && Te([u]));
  } else if (t.slice(0, 5) === "attr:")
    K(e, t.slice(5), n);
  else if (t.slice(0, 5) === "bool:")
    Le(e, t.slice(5), n);
  else if ((g = t.slice(0, 5) === "prop:") || (a = $e.has(t)) || !r && ((f = Oe(t, e.tagName)) || (c = Ae.has(t))) || (i = e.nodeName.includes("-") || "is" in l))
    g && (t = t.slice(5), c = !0), t === "class" || t === "className" ? ae(e, n) : i && !c && !a ? e[Ue(t)] = n : e[f || t] = n;
  else {
    const u = r && t.indexOf(":") > -1 && Pe[t.split(":")[0]];
    u ? je(e, u, t, n) : K(e, Ce[t] || t, n);
  }
  return n;
}
function Ve(e) {
  let t = e.target;
  const n = `$$${e.type}`, s = e.target, r = e.currentTarget, o = (c) => Object.defineProperty(e, "target", {
    configurable: !0,
    value: c
  }), l = () => {
    const c = t[n];
    if (c && !t.disabled) {
      const a = t[`${n}Data`];
      if (a !== void 0 ? c.call(t, a, e) : c.call(t, e), e.cancelBubble) return;
    }
    return t.host && typeof t.host != "string" && !t.host._$host && t.contains(e.target) && o(t.host), !0;
  }, i = () => {
    for (; l() && (t = t._$host || t.parentNode || t.host); ) ;
  };
  if (Object.defineProperty(e, "currentTarget", {
    configurable: !0,
    get() {
      return t || document;
    }
  }), e.composedPath) {
    const c = e.composedPath();
    o(c[0]);
    for (let a = 0; a < c.length - 2 && (t = c[a], !!l()); a++) {
      if (t._$host) {
        t = t._$host, i();
        break;
      }
      if (t.parentNode === r)
        break;
    }
  } else i();
  o(s);
}
function S(e, t, n, s, r) {
  for (; typeof n == "function"; ) n = n();
  if (t === n) return n;
  const o = typeof t, l = s !== void 0;
  if (e = l && n[0] && n[0].parentNode || e, o === "string" || o === "number") {
    if (o === "number" && (t = t.toString(), t === n))
      return n;
    if (l) {
      let i = n[0];
      i && i.nodeType === 3 ? i.data !== t && (i.data = t) : i = document.createTextNode(t), n = A(e, n, s, i);
    } else
      n !== "" && typeof n == "string" ? n = e.firstChild.data = t : n = e.textContent = t;
  } else if (t == null || o === "boolean")
    n = A(e, n, s);
  else {
    if (o === "function")
      return p(() => {
        let i = t();
        for (; typeof i == "function"; ) i = i();
        n = S(e, i, n, s);
      }), () => n;
    if (Array.isArray(t)) {
      const i = [], c = n && Array.isArray(n);
      if (q(i, t, n, r))
        return p(() => n = S(e, i, n, s, !0)), () => n;
      if (i.length === 0) {
        if (n = A(e, n, s), l) return n;
      } else c ? n.length === 0 ? Y(e, i, s) : Ee(e, n, i) : (n && A(e), Y(e, i));
      n = i;
    } else if (t.nodeType) {
      if (Array.isArray(n)) {
        if (l) return n = A(e, n, s, t);
        A(e, n, null, t);
      } else n == null || n === "" || !e.firstChild ? e.appendChild(t) : e.replaceChild(t, e.firstChild);
      n = t;
    }
  }
  return n;
}
function q(e, t, n, s) {
  let r = !1;
  for (let o = 0, l = t.length; o < l; o++) {
    let i = t[o], c = n && n[e.length], a;
    if (!(i == null || i === !0 || i === !1)) if ((a = typeof i) == "object" && i.nodeType)
      e.push(i);
    else if (Array.isArray(i))
      r = q(e, i, c) || r;
    else if (a === "function")
      if (s) {
        for (; typeof i == "function"; ) i = i();
        r = q(
          e,
          Array.isArray(i) ? i : [i],
          Array.isArray(c) ? c : [c]
        ) || r;
      } else
        e.push(i), r = !0;
    else {
      const f = String(i);
      c && c.nodeType === 3 && c.data === f ? e.push(c) : e.push(document.createTextNode(f));
    }
  }
  return r;
}
function Y(e, t, n = null) {
  for (let s = 0, r = t.length; s < r; s++) e.insertBefore(t[s], n);
}
function A(e, t, n, s) {
  if (n === void 0) return e.textContent = "";
  const r = s || document.createTextNode("");
  if (t.length) {
    let o = !1;
    for (let l = t.length - 1; l >= 0; l--) {
      const i = t[l];
      if (r !== i) {
        const c = i.parentNode === e;
        !o && !l ? c ? e.replaceChild(r, i) : e.insertBefore(r, n) : c && i.remove();
      } else o = !0;
    }
  } else e.insertBefore(r, n);
  return [r];
}
const He = /^\/+|(\/)\/+$/g;
function J(e, t = !1) {
  const n = e.replace(He, "$1");
  return n ? t || /^[?#]/.test(n) ? n : "/" + n : "";
}
function Fe(e, t) {
  if (e == null)
    throw new Error(t);
  return e;
}
const Ke = ee(), qe = ee(), B = () => Fe(te(Ke), "<A> and 'use' router primitives can be only used inside a Route."), Ge = () => te(qe) || B().base, Xe = (e) => {
  const t = Ge();
  return $(() => t.resolvePath(e()));
}, ze = (e) => {
  const t = B();
  return $(() => {
    const n = e();
    return n !== void 0 ? t.renderPath(n) : n;
  });
}, We = () => B().navigatorFactory(), Ye = () => B().location;
var Je = /* @__PURE__ */ _("<a>");
function E(e) {
  e = G({
    inactiveClass: "inactive",
    activeClass: "active"
  }, e);
  const [, t] = ve(e, ["href", "state", "class", "activeClass", "inactiveClass", "end"]), n = Xe(() => e.href), s = ze(n), r = Ye(), o = $(() => {
    const l = n();
    if (l === void 0) return [!1, !1];
    const i = J(l.split(/[?#]/, 1)[0]).toLowerCase(), c = decodeURI(J(r.pathname).toLowerCase());
    return [e.end ? i === c : c.startsWith(i + "/") || c === i, i === c];
  });
  return (() => {
    var l = Je();
    return R(l, G(t, {
      get href() {
        return s() || e.href;
      },
      get state() {
        return JSON.stringify(e.state);
      },
      get classList() {
        return {
          ...e.class && {
            [e.class]: !0
          },
          [e.inactiveClass]: !o()[0],
          [e.activeClass]: o()[0],
          ...t.classList
        };
      },
      link: "",
      get "aria-current"() {
        return o()[1] ? "page" : void 0;
      }
    }), !1, !1), l;
  })();
}
var Qe = /* @__PURE__ */ _('<button type=button><span class="absolute top-1/2 left-1/2 size-11 -translate-1/2 pointer-fine:hidden">');
function Ze(e) {
  const {
    class: t,
    children: n,
    ...s
  } = e;
  return (() => {
    var r = Qe();
    return r.firstChild, ae(r, `relative inline-grid size-7 place-items-center rounded-md text-gray-950 hover:bg-gray-950/5 dark:text-white dark:hover:bg-white/10 ${t || ""}`), R(r, s, !1, !0), m(r, n, null), r;
  })();
}
var et = /* @__PURE__ */ _("<svg>"), tt = /* @__PURE__ */ _('<svg viewBox="0 0 20 20"><path d=...>'), nt = /* @__PURE__ */ _('<svg viewBox="0 0 16 16"fill=currentColor class=size-4><path d=...>'), st = /* @__PURE__ */ _('<div class="bg-white dark:bg-gray-950"><div class="flex h-14 items-center justify-between gap-8 px-4 sm:px-6"><div class="flex items-center gap-4"></div><div class="flex items-center gap-6 max-md:hidden"><a href="/plus?ref=top"class="group relative px-1.5 text-sm/6 text-sky-800 dark:text-sky-300"><span class="absolute inset-0 border ... bg-sky-400/10 group-hover:bg-sky-400/15"></span>Plus</a><a href=https://github.com/tailwindlabs/tailwindcss aria-label="GitHub repository"></a></div><div class="flex items-center gap-2.5 md:hidden">');
function it(e) {
  return (() => {
    var t = et();
    return R(t, e, !0, !1), t;
  })();
}
function rt(e) {
  return (() => {
    var t = tt();
    return R(t, e, !0, !0), t;
  })();
}
function lt() {
  const [e, t] = ge(!1), n = We();
  return (() => {
    var s = st(), r = s.firstChild, o = r.firstChild, l = o.nextSibling, i = l.firstChild, c = i.nextSibling, a = l.nextSibling;
    return m(o, y(E, {
      href: "/",
      class: "shrink-0",
      "aria-label": "Home",
      onContextMenu: (f) => {
        f.preventDefault(), n("/brand");
      },
      get children() {
        return y(it, {
          class: "h-5 text-black dark:text-white"
        });
      }
    })), m(l, y(E, {
      href: "/docs",
      class: "text-sm/6 text-gray-950 dark:text-white",
      children: "Docs"
    }), i), m(l, y(E, {
      href: "/blog",
      class: "text-sm/6 text-gray-950 dark:text-white",
      children: "Blog"
    }), i), m(l, y(E, {
      href: "/showcase",
      class: "text-sm/6 text-gray-950 dark:text-white",
      children: "Showcase"
    }), i), m(c, y(rt, {
      class: "size-5 fill-black/40 dark:fill-gray-400"
    })), m(a, y(Ze, {
      "aria-label": "Navigation",
      onClick: () => t(!e()),
      get children() {
        return nt();
      }
    })), s;
  })();
}
var ot = /* @__PURE__ */ _('<div class="max-w-screen overflow-x-hidden"><div class="fixed inset-x-0 top-0 z-10 border-b border-black/5 dark:border-white/10"></div><div class="grid min-h-dvh grid-cols-1 grid-rows-[1fr_1px_auto_1px_auto] justify-center pt-14.25 [--gutter-width:2.5rem] md:-mx-4 md:grid-cols-[var(--gutter-width)_minmax(0,var(--breakpoint-2xl))_var(--gutter-width)] lg:mx-0"><div class="col-start-1 row-span-full row-start-1 hidden border-x border-x-[--pattern-fg] bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed [--pattern-fg:var(--color-black)]/5 md:block dark:[--pattern-fg:var(--color-white)]/10"></div><div class="grid gap-24 pb-24 text-gray-950 sm:gap-40 md:pb-40 dark:text-white"></div><div class="row-span-full row-start-1 hidden border-x border-x-[--pattern-fg] bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed [--pattern-fg:var(--color-black)]/5 md:col-start-3 md:block dark:[--pattern-fg:var(--color-white)]/10"></div><div class="col-start-1 row-start-5 grid md:col-start-2"></div></div><div class=fixed! aria-hidden=true><input type=text tabindex=-1>');
function ct() {
  return (() => {
    var e = ot(), t = e.firstChild, n = t.nextSibling, s = n.nextSibling;
    return s.firstChild, m(t, y(lt, {})), e;
  })();
}
function at() {
  return y(ct, {});
}
const ft = document.getElementById("app");
Ne(() => y(at, {}), ft);
