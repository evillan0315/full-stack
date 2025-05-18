let j = I;
const y = 1, E = 2, L = {
  owned: null,
  cleanups: null,
  context: null,
  owner: null
};
var c = null;
let T = null, k = null, p = null, h = null, g = null, S = 0;
function G(e, t) {
  const n = p, l = c, o = e.length === 0, i = t === void 0 ? l : t, f = o ? L : {
    owned: null,
    cleanups: null,
    context: i ? i.context : null,
    owner: i
  }, s = o ? e : () => e(() => _(() => A(f)));
  c = f, p = null;
  try {
    return C(s, !0);
  } finally {
    p = n, c = l;
  }
}
function m(e, t, n) {
  const l = F(e, t, !1, y);
  O(l);
}
function _(e) {
  if (p === null) return e();
  const t = p;
  p = null;
  try {
    return e();
  } finally {
    p = t;
  }
}
function H(e, t, n) {
  let l = e.value;
  return (!e.comparator || !e.comparator(l, t)) && (e.value = t, e.observers && e.observers.length && C(() => {
    for (let o = 0; o < e.observers.length; o += 1) {
      const i = e.observers[o], f = T && T.running;
      f && T.disposed.has(i), (f ? !i.tState : !i.state) && (i.pure ? h.push(i) : g.push(i), i.observers && P(i)), f || (i.state = y);
    }
    if (h.length > 1e6)
      throw h = [], new Error();
  }, !1)), t;
}
function O(e) {
  if (!e.fn) return;
  A(e);
  const t = S;
  R(
    e,
    e.value,
    t
  );
}
function R(e, t, n) {
  let l;
  const o = c, i = p;
  p = c = e;
  try {
    l = e.fn(t);
  } catch (f) {
    return e.pure && (e.state = y, e.owned && e.owned.forEach(A), e.owned = null), e.updatedAt = n + 1, M(f);
  } finally {
    p = i, c = o;
  }
  (!e.updatedAt || e.updatedAt <= n) && (e.updatedAt != null && "observers" in e ? H(e, l) : e.value = l, e.updatedAt = n);
}
function F(e, t, n, l = y, o) {
  const i = {
    fn: e,
    state: l,
    updatedAt: null,
    owned: null,
    sources: null,
    sourceSlots: null,
    cleanups: null,
    value: t,
    owner: c,
    context: c ? c.context : null,
    pure: n
  };
  return c === null || c !== L && (c.owned ? c.owned.push(i) : c.owned = [i]), i;
}
function U(e) {
  if (e.state === 0) return;
  if (e.state === E) return $(e);
  if (e.suspense && _(e.suspense.inFallback)) return e.suspense.effects.push(e);
  const t = [e];
  for (; (e = e.owner) && (!e.updatedAt || e.updatedAt < S); )
    e.state && t.push(e);
  for (let n = t.length - 1; n >= 0; n--)
    if (e = t[n], e.state === y)
      O(e);
    else if (e.state === E) {
      const l = h;
      h = null, C(() => $(e, t[0]), !1), h = l;
    }
}
function C(e, t) {
  if (h) return e();
  let n = !1;
  t || (h = []), g ? n = !0 : g = [], S++;
  try {
    const l = e();
    return J(n), l;
  } catch (l) {
    n || (g = null), h = null, M(l);
  }
}
function J(e) {
  if (h && (I(h), h = null), e) return;
  const t = g;
  g = null, t.length && C(() => j(t), !1);
}
function I(e) {
  for (let t = 0; t < e.length; t++) U(e[t]);
}
function $(e, t) {
  e.state = 0;
  for (let n = 0; n < e.sources.length; n += 1) {
    const l = e.sources[n];
    if (l.sources) {
      const o = l.state;
      o === y ? l !== t && (!l.updatedAt || l.updatedAt < S) && U(l) : o === E && $(l, t);
    }
  }
}
function P(e) {
  for (let t = 0; t < e.observers.length; t += 1) {
    const n = e.observers[t];
    n.state || (n.state = E, n.pure ? h.push(n) : g.push(n), n.observers && P(n));
  }
}
function A(e) {
  let t;
  if (e.sources)
    for (; e.sources.length; ) {
      const n = e.sources.pop(), l = e.sourceSlots.pop(), o = n.observers;
      if (o && o.length) {
        const i = o.pop(), f = n.observerSlots.pop();
        l < o.length && (i.sourceSlots[f] = l, o[l] = i, n.observerSlots[l] = f);
      }
    }
  if (e.tOwned) {
    for (t = e.tOwned.length - 1; t >= 0; t--) A(e.tOwned[t]);
    delete e.tOwned;
  }
  if (e.owned) {
    for (t = e.owned.length - 1; t >= 0; t--) A(e.owned[t]);
    e.owned = null;
  }
  if (e.cleanups) {
    for (t = e.cleanups.length - 1; t >= 0; t--) e.cleanups[t]();
    e.cleanups = null;
  }
  e.state = 0;
}
function Q(e) {
  return e instanceof Error ? e : new Error(typeof e == "string" ? e : "Unknown error", {
    cause: e
  });
}
function M(e, t = c) {
  throw Q(e);
}
function W(e, t) {
  return _(() => e(t || {}));
}
function X(e, t, n) {
  let l = n.length, o = t.length, i = l, f = 0, s = 0, r = t[o - 1].nextSibling, u = null;
  for (; f < o || s < i; ) {
    if (t[f] === n[s]) {
      f++, s++;
      continue;
    }
    for (; t[o - 1] === n[i - 1]; )
      o--, i--;
    if (o === f) {
      const a = i < l ? s ? n[s - 1].nextSibling : n[i - s] : r;
      for (; s < i; ) e.insertBefore(n[s++], a);
    } else if (i === s)
      for (; f < o; )
        (!u || !u.has(t[f])) && t[f].remove(), f++;
    else if (t[f] === n[i - 1] && n[s] === t[o - 1]) {
      const a = t[--o].nextSibling;
      e.insertBefore(n[s++], t[f++].nextSibling), e.insertBefore(n[--i], a), t[o] = n[i];
    } else {
      if (!u) {
        u = /* @__PURE__ */ new Map();
        let d = s;
        for (; d < i; ) u.set(n[d], d++);
      }
      const a = u.get(t[f]);
      if (a != null)
        if (s < a && a < i) {
          let d = f, x = 1, B;
          for (; ++d < o && d < i && !((B = u.get(t[d])) == null || B !== a + x); )
            x++;
          if (x > a - s) {
            const V = t[f];
            for (; s < a; ) e.insertBefore(n[s++], V);
          } else e.replaceChild(n[s++], t[f++]);
        } else f++;
      else t[f++].remove();
    }
  }
}
const D = "_$DX_DELEGATE";
function q(e, t, n, l = {}) {
  let o;
  return G((i) => {
    o = i, t === document ? e() : Z(t, e(), t.firstChild ? null : void 0, n);
  }, l.owner), () => {
    o(), t.textContent = "";
  };
}
function K(e, t, n, l) {
  let o;
  const i = () => {
    const s = document.createElement("template");
    return s.innerHTML = e, s.content.firstChild;
  }, f = () => (o || (o = i())).cloneNode(!0);
  return f.cloneNode = f, f;
}
function Y(e, t = window.document) {
  const n = t[D] || (t[D] = /* @__PURE__ */ new Set());
  for (let l = 0, o = e.length; l < o; l++) {
    const i = e[l];
    n.has(i) || (n.add(i), t.addEventListener(i, z));
  }
}
function Z(e, t, n, l) {
  if (n !== void 0 && !l && (l = []), typeof t != "function") return b(e, t, l, n);
  m((o) => b(e, t(), o, n), l);
}
function z(e) {
  let t = e.target;
  const n = `$$${e.type}`, l = e.target, o = e.currentTarget, i = (r) => Object.defineProperty(e, "target", {
    configurable: !0,
    value: r
  }), f = () => {
    const r = t[n];
    if (r && !t.disabled) {
      const u = t[`${n}Data`];
      if (u !== void 0 ? r.call(t, u, e) : r.call(t, e), e.cancelBubble) return;
    }
    return t.host && typeof t.host != "string" && !t.host._$host && t.contains(e.target) && i(t.host), !0;
  }, s = () => {
    for (; f() && (t = t._$host || t.parentNode || t.host); ) ;
  };
  if (Object.defineProperty(e, "currentTarget", {
    configurable: !0,
    get() {
      return t || document;
    }
  }), e.composedPath) {
    const r = e.composedPath();
    i(r[0]);
    for (let u = 0; u < r.length - 2 && (t = r[u], !!f()); u++) {
      if (t._$host) {
        t = t._$host, s();
        break;
      }
      if (t.parentNode === o)
        break;
    }
  } else s();
  i(l);
}
function b(e, t, n, l, o) {
  for (; typeof n == "function"; ) n = n();
  if (t === n) return n;
  const i = typeof t, f = l !== void 0;
  if (e = f && n[0] && n[0].parentNode || e, i === "string" || i === "number") {
    if (i === "number" && (t = t.toString(), t === n))
      return n;
    if (f) {
      let s = n[0];
      s && s.nodeType === 3 ? s.data !== t && (s.data = t) : s = document.createTextNode(t), n = w(e, n, l, s);
    } else
      n !== "" && typeof n == "string" ? n = e.firstChild.data = t : n = e.textContent = t;
  } else if (t == null || i === "boolean")
    n = w(e, n, l);
  else {
    if (i === "function")
      return m(() => {
        let s = t();
        for (; typeof s == "function"; ) s = s();
        n = b(e, s, n, l);
      }), () => n;
    if (Array.isArray(t)) {
      const s = [], r = n && Array.isArray(n);
      if (N(s, t, n, o))
        return m(() => n = b(e, s, n, l, !0)), () => n;
      if (s.length === 0) {
        if (n = w(e, n, l), f) return n;
      } else r ? n.length === 0 ? v(e, s, l) : X(e, n, s) : (n && w(e), v(e, s));
      n = s;
    } else if (t.nodeType) {
      if (Array.isArray(n)) {
        if (f) return n = w(e, n, l, t);
        w(e, n, null, t);
      } else n == null || n === "" || !e.firstChild ? e.appendChild(t) : e.replaceChild(t, e.firstChild);
      n = t;
    }
  }
  return n;
}
function N(e, t, n, l) {
  let o = !1;
  for (let i = 0, f = t.length; i < f; i++) {
    let s = t[i], r = n && n[e.length], u;
    if (!(s == null || s === !0 || s === !1)) if ((u = typeof s) == "object" && s.nodeType)
      e.push(s);
    else if (Array.isArray(s))
      o = N(e, s, r) || o;
    else if (u === "function")
      if (l) {
        for (; typeof s == "function"; ) s = s();
        o = N(
          e,
          Array.isArray(s) ? s : [s],
          Array.isArray(r) ? r : [r]
        ) || o;
      } else
        e.push(s), o = !0;
    else {
      const a = String(s);
      r && r.nodeType === 3 && r.data === a ? e.push(r) : e.push(document.createTextNode(a));
    }
  }
  return o;
}
function v(e, t, n = null) {
  for (let l = 0, o = t.length; l < o; l++) e.insertBefore(t[l], n);
}
function w(e, t, n, l) {
  if (n === void 0) return e.textContent = "";
  const o = l || document.createTextNode("");
  if (t.length) {
    let i = !1;
    for (let f = t.length - 1; f >= 0; f--) {
      const s = t[f];
      if (o !== s) {
        const r = s.parentNode === e;
        !i && !f ? r ? e.replaceChild(o, s) : e.insertBefore(o, n) : r && s.remove();
      } else i = !0;
    }
  } else e.insertBefore(o, n);
  return [o];
}
var ee = /* @__PURE__ */ K("<button>Click Me");
const te = () => (() => {
  var e = ee();
  return e.$$click = () => alert("Hello from SolidJS!"), e;
})();
q(() => W(te, {}), document.getElementById("solid-root"));
Y(["click"]);
