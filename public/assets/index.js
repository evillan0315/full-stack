const Zt = (n, e) => n === e, Fe = Symbol("solid-proxy"), en = typeof Proxy == "function", tn = Symbol("solid-track"), Ee = {
  equals: Zt
};
let _t = Rt;
const ee = 1, Ae = 2, vt = {
  owned: null,
  cleanups: null,
  context: null,
  owner: null
};
var v = null;
let Pe = null, nn = null, S = null, I = null, Q = null, Ce = 0;
function le(n, e) {
  const t = S, s = v, r = n.length === 0, i = e === void 0 ? s : e, a = r ? vt : {
    owned: null,
    cleanups: null,
    context: i ? i.context : null,
    owner: i
  }, o = r ? n : () => n(() => V(() => he(a)));
  v = a, S = null;
  try {
    return te(o, !0);
  } finally {
    S = t, v = s;
  }
}
function L(n, e) {
  e = e ? Object.assign({}, Ee, e) : Ee;
  const t = {
    value: n,
    observers: null,
    observerSlots: null,
    comparator: e.equals || void 0
  }, s = (r) => (typeof r == "function" && (r = r(t.value)), Ct(t, r));
  return [St.bind(t), s];
}
function J(n, e, t) {
  const s = et(n, e, !1, ee);
  fe(s);
}
function Et(n, e, t) {
  _t = un;
  const s = et(n, e, !1, ee);
  s.user = !0, Q ? Q.push(s) : fe(s);
}
function N(n, e, t) {
  t = t ? Object.assign({}, Ee, t) : Ee;
  const s = et(n, e, !0, 0);
  return s.observers = null, s.observerSlots = null, s.comparator = t.equals || void 0, fe(s), St.bind(s);
}
function sn(n) {
  return te(n, !1);
}
function V(n) {
  if (S === null) return n();
  const e = S;
  S = null;
  try {
    return n();
  } finally {
    S = e;
  }
}
function Ge(n, e, t) {
  const s = Array.isArray(n);
  let r, i = t && t.defer;
  return (a) => {
    let o;
    if (s) {
      o = Array(n.length);
      for (let u = 0; u < n.length; u++) o[u] = n[u]();
    } else o = n();
    if (i)
      return i = !1, a;
    const c = V(() => e(o, r, a));
    return r = o, c;
  };
}
function rn(n) {
  Et(() => V(n));
}
function Re(n) {
  return v === null || (v.cleanups === null ? v.cleanups = [n] : v.cleanups.push(n)), n;
}
function At() {
  return v;
}
function xt(n, e) {
  const t = v, s = S;
  v = n, S = null;
  try {
    return te(e, !0);
  } catch (r) {
    tt(r);
  } finally {
    v = t, S = s;
  }
}
function on(n) {
  const e = S, t = v;
  return Promise.resolve().then(() => {
    S = e, v = t;
    let s;
    return te(n, !1), S = v = null, s ? s.done : void 0;
  });
}
const [sr, rr] = /* @__PURE__ */ L(!1);
function kt(n, e) {
  const t = Symbol("context");
  return {
    id: t,
    Provider: fn(t),
    defaultValue: n
  };
}
function an(n) {
  let e;
  return v && v.context && (e = v.context[n.id]) !== void 0 ? e : n.defaultValue;
}
function Ze(n) {
  const e = N(n), t = N(() => Ve(e()));
  return t.toArray = () => {
    const s = t();
    return Array.isArray(s) ? s : s != null ? [s] : [];
  }, t;
}
function St() {
  if (this.sources && this.state)
    if (this.state === ee) fe(this);
    else {
      const n = I;
      I = null, te(() => ke(this), !1), I = n;
    }
  if (S) {
    const n = this.observers ? this.observers.length : 0;
    S.sources ? (S.sources.push(this), S.sourceSlots.push(n)) : (S.sources = [this], S.sourceSlots = [n]), this.observers ? (this.observers.push(S), this.observerSlots.push(S.sources.length - 1)) : (this.observers = [S], this.observerSlots = [S.sources.length - 1]);
  }
  return this.value;
}
function Ct(n, e, t) {
  let s = n.value;
  return (!n.comparator || !n.comparator(s, e)) && (n.value = e, n.observers && n.observers.length && te(() => {
    for (let r = 0; r < n.observers.length; r += 1) {
      const i = n.observers[r], a = Pe && Pe.running;
      a && Pe.disposed.has(i), (a ? !i.tState : !i.state) && (i.pure ? I.push(i) : Q.push(i), i.observers && Tt(i)), a || (i.state = ee);
    }
    if (I.length > 1e6)
      throw I = [], new Error();
  }, !1)), e;
}
function fe(n) {
  if (!n.fn) return;
  he(n);
  const e = Ce;
  cn(
    n,
    n.value,
    e
  );
}
function cn(n, e, t) {
  let s;
  const r = v, i = S;
  S = v = n;
  try {
    s = n.fn(e);
  } catch (a) {
    return n.pure && (n.state = ee, n.owned && n.owned.forEach(he), n.owned = null), n.updatedAt = t + 1, tt(a);
  } finally {
    S = i, v = r;
  }
  (!n.updatedAt || n.updatedAt <= t) && (n.updatedAt != null && "observers" in n ? Ct(n, s) : n.value = s, n.updatedAt = t);
}
function et(n, e, t, s = ee, r) {
  const i = {
    fn: n,
    state: s,
    updatedAt: null,
    owned: null,
    sources: null,
    sourceSlots: null,
    cleanups: null,
    value: e,
    owner: v,
    context: v ? v.context : null,
    pure: t
  };
  return v === null || v !== vt && (v.owned ? v.owned.push(i) : v.owned = [i]), i;
}
function xe(n) {
  if (n.state === 0) return;
  if (n.state === Ae) return ke(n);
  if (n.suspense && V(n.suspense.inFallback)) return n.suspense.effects.push(n);
  const e = [n];
  for (; (n = n.owner) && (!n.updatedAt || n.updatedAt < Ce); )
    n.state && e.push(n);
  for (let t = e.length - 1; t >= 0; t--)
    if (n = e[t], n.state === ee)
      fe(n);
    else if (n.state === Ae) {
      const s = I;
      I = null, te(() => ke(n, e[0]), !1), I = s;
    }
}
function te(n, e) {
  if (I) return n();
  let t = !1;
  e || (I = []), Q ? t = !0 : Q = [], Ce++;
  try {
    const s = n();
    return ln(t), s;
  } catch (s) {
    t || (Q = null), I = null, tt(s);
  }
}
function ln(n) {
  if (I && (Rt(I), I = null), n) return;
  const e = Q;
  Q = null, e.length && te(() => _t(e), !1);
}
function Rt(n) {
  for (let e = 0; e < n.length; e++) xe(n[e]);
}
function un(n) {
  let e, t = 0;
  for (e = 0; e < n.length; e++) {
    const s = n[e];
    s.user ? n[t++] = s : xe(s);
  }
  for (e = 0; e < t; e++) xe(n[e]);
}
function ke(n, e) {
  n.state = 0;
  for (let t = 0; t < n.sources.length; t += 1) {
    const s = n.sources[t];
    if (s.sources) {
      const r = s.state;
      r === ee ? s !== e && (!s.updatedAt || s.updatedAt < Ce) && xe(s) : r === Ae && ke(s, e);
    }
  }
}
function Tt(n) {
  for (let e = 0; e < n.observers.length; e += 1) {
    const t = n.observers[e];
    t.state || (t.state = Ae, t.pure ? I.push(t) : Q.push(t), t.observers && Tt(t));
  }
}
function he(n) {
  let e;
  if (n.sources)
    for (; n.sources.length; ) {
      const t = n.sources.pop(), s = n.sourceSlots.pop(), r = t.observers;
      if (r && r.length) {
        const i = r.pop(), a = t.observerSlots.pop();
        s < r.length && (i.sourceSlots[a] = s, r[s] = i, t.observerSlots[s] = a);
      }
    }
  if (n.tOwned) {
    for (e = n.tOwned.length - 1; e >= 0; e--) he(n.tOwned[e]);
    delete n.tOwned;
  }
  if (n.owned) {
    for (e = n.owned.length - 1; e >= 0; e--) he(n.owned[e]);
    n.owned = null;
  }
  if (n.cleanups) {
    for (e = n.cleanups.length - 1; e >= 0; e--) n.cleanups[e]();
    n.cleanups = null;
  }
  n.state = 0;
}
function hn(n) {
  return n instanceof Error ? n : new Error(typeof n == "string" ? n : "Unknown error", {
    cause: n
  });
}
function tt(n, e = v) {
  throw hn(n);
}
function Ve(n) {
  if (typeof n == "function" && !n.length) return Ve(n());
  if (Array.isArray(n)) {
    const e = [];
    for (let t = 0; t < n.length; t++) {
      const s = Ve(n[t]);
      Array.isArray(s) ? e.push.apply(e, s) : e.push(s);
    }
    return e;
  }
  return n;
}
function fn(n, e) {
  return function(s) {
    let r;
    return J(
      () => r = V(() => (v.context = {
        ...v.context,
        [n]: s.value
      }, Ze(() => s.children))),
      void 0
    ), r;
  };
}
const dn = Symbol("fallback");
function ct(n) {
  for (let e = 0; e < n.length; e++) n[e]();
}
function pn(n, e, t = {}) {
  let s = [], r = [], i = [], a = 0, o = e.length > 1 ? [] : null;
  return Re(() => ct(i)), () => {
    let c = n() || [], u = c.length, h, l;
    return c[tn], V(() => {
      let g, k, f, p, A, m, x, T, $;
      if (u === 0)
        a !== 0 && (ct(i), i = [], s = [], r = [], a = 0, o && (o = [])), t.fallback && (s = [dn], r[0] = le((z) => (i[0] = z, t.fallback())), a = 1);
      else if (a === 0) {
        for (r = new Array(u), l = 0; l < u; l++)
          s[l] = c[l], r[l] = le(d);
        a = u;
      } else {
        for (f = new Array(u), p = new Array(u), o && (A = new Array(u)), m = 0, x = Math.min(a, u); m < x && s[m] === c[m]; m++) ;
        for (x = a - 1, T = u - 1; x >= m && T >= m && s[x] === c[T]; x--, T--)
          f[T] = r[x], p[T] = i[x], o && (A[T] = o[x]);
        for (g = /* @__PURE__ */ new Map(), k = new Array(T + 1), l = T; l >= m; l--)
          $ = c[l], h = g.get($), k[l] = h === void 0 ? -1 : h, g.set($, l);
        for (h = m; h <= x; h++)
          $ = s[h], l = g.get($), l !== void 0 && l !== -1 ? (f[l] = r[h], p[l] = i[h], o && (A[l] = o[h]), l = k[l], g.set($, l)) : i[h]();
        for (l = m; l < u; l++)
          l in f ? (r[l] = f[l], i[l] = p[l], o && (o[l] = A[l], o[l](l))) : r[l] = le(d);
        r = r.slice(0, a = u), s = c.slice(0);
      }
      return r;
    });
    function d(g) {
      if (i[l] = g, o) {
        const [k, f] = L(l);
        return o[l] = f, e(c[l], k);
      }
      return e(c[l]);
    }
  };
}
function U(n, e) {
  return V(() => n(e || {}));
}
function pe() {
  return !0;
}
const gn = {
  get(n, e, t) {
    return e === Fe ? t : n.get(e);
  },
  has(n, e) {
    return e === Fe ? !0 : n.has(e);
  },
  set: pe,
  deleteProperty: pe,
  getOwnPropertyDescriptor(n, e) {
    return {
      configurable: !0,
      enumerable: !0,
      get() {
        return n.get(e);
      },
      set: pe,
      deleteProperty: pe
    };
  },
  ownKeys(n) {
    return n.keys();
  }
};
function Le(n) {
  return (n = typeof n == "function" ? n() : n) ? n : {};
}
function mn() {
  for (let n = 0, e = this.length; n < e; ++n) {
    const t = this[n]();
    if (t !== void 0) return t;
  }
}
function yn(...n) {
  let e = !1;
  for (let a = 0; a < n.length; a++) {
    const o = n[a];
    e = e || !!o && Fe in o, n[a] = typeof o == "function" ? (e = !0, N(o)) : o;
  }
  if (en && e)
    return new Proxy(
      {
        get(a) {
          for (let o = n.length - 1; o >= 0; o--) {
            const c = Le(n[o])[a];
            if (c !== void 0) return c;
          }
        },
        has(a) {
          for (let o = n.length - 1; o >= 0; o--)
            if (a in Le(n[o])) return !0;
          return !1;
        },
        keys() {
          const a = [];
          for (let o = 0; o < n.length; o++)
            a.push(...Object.keys(Le(n[o])));
          return [...new Set(a)];
        }
      },
      gn
    );
  const t = {}, s = /* @__PURE__ */ Object.create(null);
  for (let a = n.length - 1; a >= 0; a--) {
    const o = n[a];
    if (!o) continue;
    const c = Object.getOwnPropertyNames(o);
    for (let u = c.length - 1; u >= 0; u--) {
      const h = c[u];
      if (h === "__proto__" || h === "constructor") continue;
      const l = Object.getOwnPropertyDescriptor(o, h);
      if (!s[h])
        s[h] = l.get ? {
          enumerable: !0,
          configurable: !0,
          get: mn.bind(t[h] = [l.get.bind(o)])
        } : l.value !== void 0 ? l : void 0;
      else {
        const d = t[h];
        d && (l.get ? d.push(l.get.bind(o)) : l.value !== void 0 && d.push(() => l.value));
      }
    }
  }
  const r = {}, i = Object.keys(s);
  for (let a = i.length - 1; a >= 0; a--) {
    const o = i[a], c = s[o];
    c && c.get ? Object.defineProperty(r, o, c) : r[o] = c ? c.value : void 0;
  }
  return r;
}
const wn = (n) => `Stale read from <${n}>.`;
function lt(n) {
  const e = "fallback" in n && {
    fallback: () => n.fallback
  };
  return N(pn(() => n.each, n.children, e || void 0));
}
function Ot(n) {
  const e = n.keyed, t = N(() => n.when, void 0, void 0), s = e ? t : N(t, void 0, {
    equals: (r, i) => !r == !i
  });
  return N(
    () => {
      const r = s();
      if (r) {
        const i = n.children;
        return typeof i == "function" && i.length > 0 ? V(
          () => i(
            e ? r : () => {
              if (!V(s)) throw wn("Show");
              return t();
            }
          )
        ) : i;
      }
      return n.fallback;
    },
    void 0,
    void 0
  );
}
const He = (n) => N(() => n());
function bn(n, e, t) {
  let s = t.length, r = e.length, i = s, a = 0, o = 0, c = e[r - 1].nextSibling, u = null;
  for (; a < r || o < i; ) {
    if (e[a] === t[o]) {
      a++, o++;
      continue;
    }
    for (; e[r - 1] === t[i - 1]; )
      r--, i--;
    if (r === a) {
      const h = i < s ? o ? t[o - 1].nextSibling : t[i - o] : c;
      for (; o < i; ) n.insertBefore(t[o++], h);
    } else if (i === o)
      for (; a < r; )
        (!u || !u.has(e[a])) && e[a].remove(), a++;
    else if (e[a] === t[i - 1] && t[o] === e[r - 1]) {
      const h = e[--r].nextSibling;
      n.insertBefore(t[o++], e[a++].nextSibling), n.insertBefore(t[--i], h), e[r] = t[i];
    } else {
      if (!u) {
        u = /* @__PURE__ */ new Map();
        let l = o;
        for (; l < i; ) u.set(t[l], l++);
      }
      const h = u.get(e[a]);
      if (h != null)
        if (o < h && h < i) {
          let l = a, d = 1, g;
          for (; ++l < r && l < i && !((g = u.get(e[l])) == null || g !== h + d); )
            d++;
          if (d > h - o) {
            const k = e[a];
            for (; o < h; ) n.insertBefore(t[o++], k);
          } else n.replaceChild(t[o++], e[a++]);
        } else a++;
      else e[a++].remove();
    }
  }
}
const ut = "_$DX_DELEGATE";
function _n(n, e, t, s = {}) {
  let r;
  return le((i) => {
    r = i, e === document ? n() : G(e, n(), e.firstChild ? null : void 0, t);
  }, s.owner), () => {
    r(), e.textContent = "";
  };
}
function W(n, e, t, s) {
  let r;
  const i = () => {
    const o = document.createElement("template");
    return o.innerHTML = n, o.content.firstChild;
  }, a = () => (r || (r = i())).cloneNode(!0);
  return a.cloneNode = a, a;
}
function Bt(n, e = window.document) {
  const t = e[ut] || (e[ut] = /* @__PURE__ */ new Set());
  for (let s = 0, r = n.length; s < r; s++) {
    const i = n[s];
    t.has(i) || (t.add(i), e.addEventListener(i, vn));
  }
}
function ht(n, e, t) {
  t == null ? n.removeAttribute(e) : n.setAttribute(e, t);
}
function Ne(n, e) {
  e == null ? n.removeAttribute("class") : n.className = e;
}
function ft(n, e, t) {
  return V(() => n(e, t));
}
function G(n, e, t, s) {
  if (t !== void 0 && !s && (s = []), typeof e != "function") return Se(n, e, s, t);
  J((r) => Se(n, e(), r, t), s);
}
function vn(n) {
  let e = n.target;
  const t = `$$${n.type}`, s = n.target, r = n.currentTarget, i = (c) => Object.defineProperty(n, "target", {
    configurable: !0,
    value: c
  }), a = () => {
    const c = e[t];
    if (c && !e.disabled) {
      const u = e[`${t}Data`];
      if (u !== void 0 ? c.call(e, u, n) : c.call(e, n), n.cancelBubble) return;
    }
    return e.host && typeof e.host != "string" && !e.host._$host && e.contains(n.target) && i(e.host), !0;
  }, o = () => {
    for (; a() && (e = e._$host || e.parentNode || e.host); ) ;
  };
  if (Object.defineProperty(n, "currentTarget", {
    configurable: !0,
    get() {
      return e || document;
    }
  }), n.composedPath) {
    const c = n.composedPath();
    i(c[0]);
    for (let u = 0; u < c.length - 2 && (e = c[u], !!a()); u++) {
      if (e._$host) {
        e = e._$host, o();
        break;
      }
      if (e.parentNode === r)
        break;
    }
  } else o();
  i(s);
}
function Se(n, e, t, s, r) {
  for (; typeof t == "function"; ) t = t();
  if (e === t) return t;
  const i = typeof e, a = s !== void 0;
  if (n = a && t[0] && t[0].parentNode || n, i === "string" || i === "number") {
    if (i === "number" && (e = e.toString(), e === t))
      return t;
    if (a) {
      let o = t[0];
      o && o.nodeType === 3 ? o.data !== e && (o.data = e) : o = document.createTextNode(e), t = ie(n, t, s, o);
    } else
      t !== "" && typeof t == "string" ? t = n.firstChild.data = e : t = n.textContent = e;
  } else if (e == null || i === "boolean")
    t = ie(n, t, s);
  else {
    if (i === "function")
      return J(() => {
        let o = e();
        for (; typeof o == "function"; ) o = o();
        t = Se(n, o, t, s);
      }), () => t;
    if (Array.isArray(e)) {
      const o = [], c = t && Array.isArray(t);
      if (We(o, e, t, r))
        return J(() => t = Se(n, o, t, s, !0)), () => t;
      if (o.length === 0) {
        if (t = ie(n, t, s), a) return t;
      } else c ? t.length === 0 ? dt(n, o, s) : bn(n, t, o) : (t && ie(n), dt(n, o));
      t = o;
    } else if (e.nodeType) {
      if (Array.isArray(t)) {
        if (a) return t = ie(n, t, s, e);
        ie(n, t, null, e);
      } else t == null || t === "" || !n.firstChild ? n.appendChild(e) : n.replaceChild(e, n.firstChild);
      t = e;
    }
  }
  return t;
}
function We(n, e, t, s) {
  let r = !1;
  for (let i = 0, a = e.length; i < a; i++) {
    let o = e[i], c = t && t[n.length], u;
    if (!(o == null || o === !0 || o === !1)) if ((u = typeof o) == "object" && o.nodeType)
      n.push(o);
    else if (Array.isArray(o))
      r = We(n, o, c) || r;
    else if (u === "function")
      if (s) {
        for (; typeof o == "function"; ) o = o();
        r = We(
          n,
          Array.isArray(o) ? o : [o],
          Array.isArray(c) ? c : [c]
        ) || r;
      } else
        n.push(o), r = !0;
    else {
      const h = String(o);
      c && c.nodeType === 3 && c.data === h ? n.push(c) : n.push(document.createTextNode(h));
    }
  }
  return r;
}
function dt(n, e, t = null) {
  for (let s = 0, r = e.length; s < r; s++) n.insertBefore(e[s], t);
}
function ie(n, e, t, s) {
  if (t === void 0) return n.textContent = "";
  const r = s || document.createTextNode("");
  if (e.length) {
    let i = !1;
    for (let a = e.length - 1; a >= 0; a--) {
      const o = e[a];
      if (r !== o) {
        const c = o.parentNode === n;
        !i && !a ? c ? n.replaceChild(r, o) : n.insertBefore(r, t) : c && o.remove();
      } else i = !0;
    }
  } else n.insertBefore(r, t);
  return [r];
}
const En = !1;
function Pt() {
  let n = /* @__PURE__ */ new Set();
  function e(r) {
    return n.add(r), () => n.delete(r);
  }
  let t = !1;
  function s(r, i) {
    if (t)
      return !(t = !1);
    const a = {
      to: r,
      options: i,
      defaultPrevented: !1,
      preventDefault: () => a.defaultPrevented = !0
    };
    for (const o of n)
      o.listener({
        ...a,
        from: o.location,
        retry: (c) => {
          c && (t = !0), o.navigate(r, { ...i, resolve: !1 });
        }
      });
    return !a.defaultPrevented;
  }
  return {
    subscribe: e,
    confirm: s
  };
}
let Ke;
function nt() {
  (!window.history.state || window.history.state._depth == null) && window.history.replaceState({ ...window.history.state, _depth: window.history.length - 1 }, ""), Ke = window.history.state._depth;
}
nt();
function An(n) {
  return {
    ...n,
    _depth: window.history.state && window.history.state._depth
  };
}
function xn(n, e) {
  let t = !1;
  return () => {
    const s = Ke;
    nt();
    const r = s == null ? null : Ke - s;
    if (t) {
      t = !1;
      return;
    }
    r && e(r) ? (t = !0, window.history.go(-r)) : n();
  };
}
const kn = /^(?:[a-z0-9]+:)?\/\//i, Sn = /^\/+|(\/)\/+$/g, Lt = "http://sr";
function ue(n, e = !1) {
  const t = n.replace(Sn, "$1");
  return t ? e || /^[?#]/.test(t) ? t : "/" + t : "";
}
function ye(n, e, t) {
  if (kn.test(e))
    return;
  const s = ue(n), r = t && ue(t);
  let i = "";
  return !r || e.startsWith("/") ? i = s : r.toLowerCase().indexOf(s.toLowerCase()) !== 0 ? i = s + r : i = r, (i || "/") + ue(e, !i);
}
function Cn(n, e) {
  return ue(n).replace(/\/*(\*.*)?$/g, "") + ue(e);
}
function Nt(n) {
  const e = {};
  return n.searchParams.forEach((t, s) => {
    s in e ? Array.isArray(e[s]) ? e[s].push(t) : e[s] = [e[s], t] : e[s] = t;
  }), e;
}
function Rn(n, e, t) {
  const [s, r] = n.split("/*", 2), i = s.split("/").filter(Boolean), a = i.length;
  return (o) => {
    const c = o.split("/").filter(Boolean), u = c.length - a;
    if (u < 0 || u > 0 && r === void 0 && !e)
      return null;
    const h = {
      path: a ? "" : "/",
      params: {}
    }, l = (d) => t === void 0 ? void 0 : t[d];
    for (let d = 0; d < a; d++) {
      const g = i[d], k = g[0] === ":", f = k ? c[d] : c[d].toLowerCase(), p = k ? g.slice(1) : g.toLowerCase();
      if (k && $e(f, l(p)))
        h.params[p] = f;
      else if (k || !$e(f, p))
        return null;
      h.path += `/${f}`;
    }
    if (r) {
      const d = u ? c.slice(-u).join("/") : "";
      if ($e(d, l(r)))
        h.params[r] = d;
      else
        return null;
    }
    return h;
  };
}
function $e(n, e) {
  const t = (s) => s === n;
  return e === void 0 ? !0 : typeof e == "string" ? t(e) : typeof e == "function" ? e(n) : Array.isArray(e) ? e.some(t) : e instanceof RegExp ? e.test(n) : !1;
}
function Tn(n) {
  const [e, t] = n.pattern.split("/*", 2), s = e.split("/").filter(Boolean);
  return s.reduce((r, i) => r + (i.startsWith(":") ? 2 : 3), s.length - (t === void 0 ? 0 : 1));
}
function $t(n) {
  const e = /* @__PURE__ */ new Map(), t = At();
  return new Proxy({}, {
    get(s, r) {
      return e.has(r) || xt(t, () => e.set(r, N(() => n()[r]))), e.get(r)();
    },
    getOwnPropertyDescriptor() {
      return {
        enumerable: !0,
        configurable: !0
      };
    },
    ownKeys() {
      return Reflect.ownKeys(n());
    }
  });
}
function Dt(n) {
  let e = /(\/?\:[^\/]+)\?/.exec(n);
  if (!e)
    return [n];
  let t = n.slice(0, e.index), s = n.slice(e.index + e[0].length);
  const r = [t, t += e[1]];
  for (; e = /^(\/\:[^\/]+)\?/.exec(s); )
    r.push(t += e[1]), s = s.slice(e[0].length);
  return Dt(s).reduce((i, a) => [...i, ...r.map((o) => o + a)], []);
}
const On = 100, Bn = kt(), qt = kt();
function Pn(n, e = "") {
  const { component: t, preload: s, load: r, children: i, info: a } = n, o = !i || Array.isArray(i) && !i.length, c = {
    key: n,
    component: t,
    preload: s || r,
    info: a
  };
  return It(n.path).reduce((u, h) => {
    for (const l of Dt(h)) {
      const d = Cn(e, l);
      let g = o ? d : d.split("/*", 1)[0];
      g = g.split("/").map((k) => k.startsWith(":") || k.startsWith("*") ? k : encodeURIComponent(k)).join("/"), u.push({
        ...c,
        originalPath: h,
        pattern: g,
        matcher: Rn(g, !o, n.matchFilters)
      });
    }
    return u;
  }, []);
}
function Ln(n, e = 0) {
  return {
    routes: n,
    score: Tn(n[n.length - 1]) * 1e4 - e,
    matcher(t) {
      const s = [];
      for (let r = n.length - 1; r >= 0; r--) {
        const i = n[r], a = i.matcher(t);
        if (!a)
          return null;
        s.unshift({
          ...a,
          route: i
        });
      }
      return s;
    }
  };
}
function It(n) {
  return Array.isArray(n) ? n : [n];
}
function Ut(n, e = "", t = [], s = []) {
  const r = It(n);
  for (let i = 0, a = r.length; i < a; i++) {
    const o = r[i];
    if (o && typeof o == "object") {
      o.hasOwnProperty("path") || (o.path = "");
      const c = Pn(o, e);
      for (const u of c) {
        t.push(u);
        const h = Array.isArray(o.children) && o.children.length === 0;
        if (o.children && !h)
          Ut(o.children, u.pattern, t, s);
        else {
          const l = Ln([...t], s.length);
          s.push(l);
        }
        t.pop();
      }
    }
  }
  return t.length ? s : s.sort((i, a) => a.score - i.score);
}
function De(n, e) {
  for (let t = 0, s = n.length; t < s; t++) {
    const r = n[t].matcher(e);
    if (r)
      return r;
  }
  return [];
}
function Nn(n, e, t) {
  const s = new URL(Lt), r = N((h) => {
    const l = n();
    try {
      return new URL(l, s);
    } catch {
      return console.error(`Invalid path ${l}`), h;
    }
  }, s, {
    equals: (h, l) => h.href === l.href
  }), i = N(() => r().pathname), a = N(() => r().search, !0), o = N(() => r().hash), c = () => "", u = Ge(a, () => Nt(r()));
  return {
    get pathname() {
      return i();
    },
    get search() {
      return a();
    },
    get hash() {
      return o();
    },
    get state() {
      return e();
    },
    get key() {
      return c();
    },
    query: t ? t(u) : $t(u)
  };
}
let ne;
function $n() {
  return ne;
}
function Dn(n, e, t, s = {}) {
  const { signal: [r, i], utils: a = {} } = n, o = a.parsePath || ((w) => w), c = a.renderPath || ((w) => w), u = a.beforeLeave || Pt(), h = ye("", s.base || "");
  if (h === void 0)
    throw new Error(`${h} is not a valid base path`);
  h && !r().value && i({ value: h, replace: !0, scroll: !1 });
  const [l, d] = L(!1);
  let g;
  const k = (w, b) => {
    b.value === f() && b.state === A() || (g === void 0 && d(!0), ne = w, g = b, on(() => {
      g === b && (p(g.value), m(g.state), $[1]((P) => P.filter((X) => X.pending)));
    }).finally(() => {
      g === b && sn(() => {
        ne = void 0, w === "navigate" && y(g), d(!1), g = void 0;
      });
    }));
  }, [f, p] = L(r().value), [A, m] = L(r().state), x = Nn(f, A, a.queryWrapper), T = [], $ = L([]), z = N(() => typeof s.transformUrl == "function" ? De(e(), s.transformUrl(x.pathname)) : De(e(), x.pathname)), se = () => {
    const w = z(), b = {};
    for (let P = 0; P < w.length; P++)
      Object.assign(b, w[P].params);
    return b;
  }, K = a.paramsWrapper ? a.paramsWrapper(se, e) : $t(se), de = {
    pattern: h,
    path: () => h,
    outlet: () => null,
    resolvePath(w) {
      return ye(h, w);
    }
  };
  return J(Ge(r, (w) => k("native", w), { defer: !0 })), {
    base: de,
    location: x,
    params: K,
    isRouting: l,
    renderPath: c,
    parsePath: o,
    navigatorFactory: E,
    matches: z,
    beforeLeave: u,
    preloadRoute: M,
    singleFlight: s.singleFlight === void 0 ? !0 : s.singleFlight,
    submissions: $
  };
  function Be(w, b, P) {
    V(() => {
      if (typeof b == "number") {
        b && (a.go ? a.go(b) : console.warn("Router integration does not support relative routing"));
        return;
      }
      const X = !b || b[0] === "?", { replace: R, resolve: O, scroll: D, state: C } = {
        replace: !1,
        resolve: !X,
        scroll: !0,
        ...P
      }, q = O ? w.resolvePath(b) : ye(X && x.pathname || "", b);
      if (q === void 0)
        throw new Error(`Path '${b}' is not a routable path`);
      if (T.length >= On)
        throw new Error("Too many redirects");
      const re = f();
      (q !== re || C !== A()) && (En || u.confirm(q, P) && (T.push({ value: re, replace: R, scroll: D, state: A() }), k("navigate", {
        value: q,
        state: C
      })));
    });
  }
  function E(w) {
    return w = w || an(qt) || de, (b, P) => Be(w, b, P);
  }
  function y(w) {
    const b = T[0];
    b && (i({
      ...w,
      replace: b.replace,
      scroll: b.scroll
    }), T.length = 0);
  }
  function M(w, b) {
    const P = De(e(), w.pathname), X = ne;
    ne = "preload";
    for (let R in P) {
      const { route: O, params: D } = P[R];
      O.component && O.component.preload && O.component.preload();
      const { preload: C } = O;
      b && C && xt(t(), () => C({
        params: D,
        location: {
          pathname: w.pathname,
          search: w.search,
          hash: w.hash,
          query: Nt(w),
          state: null,
          key: ""
        },
        intent: "preload"
      }));
    }
    ne = X;
  }
}
function qn(n, e, t, s) {
  const { base: r, location: i, params: a } = n, { pattern: o, component: c, preload: u } = s().route, h = N(() => s().path);
  c && c.preload && c.preload();
  const l = u ? u({ params: a, location: i, intent: ne || "initial" }) : void 0;
  return {
    parent: e,
    pattern: o,
    path: h,
    outlet: () => c ? U(c, {
      params: a,
      location: i,
      data: l,
      get children() {
        return t();
      }
    }) : t(),
    resolvePath(g) {
      return ye(r.path(), g, h());
    }
  };
}
const In = (n) => (e) => {
  const {
    base: t
  } = e, s = Ze(() => e.children), r = N(() => Ut(s(), e.base || ""));
  let i;
  const a = Dn(n, r, () => i, {
    base: t,
    singleFlight: e.singleFlight,
    transformUrl: e.transformUrl
  });
  return n.create && n.create(a), U(Bn.Provider, {
    value: a,
    get children() {
      return U(Un, {
        routerState: a,
        get root() {
          return e.root;
        },
        get preload() {
          return e.rootPreload || e.rootLoad;
        },
        get children() {
          return [He(() => (i = At()) && null), U(Mn, {
            routerState: a,
            get branches() {
              return r();
            }
          })];
        }
      });
    }
  });
};
function Un(n) {
  const e = n.routerState.location, t = n.routerState.params, s = N(() => n.preload && V(() => {
    n.preload({
      params: t,
      location: e,
      intent: $n() || "initial"
    });
  }));
  return U(Ot, {
    get when() {
      return n.root;
    },
    keyed: !0,
    get fallback() {
      return n.children;
    },
    children: (r) => U(r, {
      params: t,
      location: e,
      get data() {
        return s();
      },
      get children() {
        return n.children;
      }
    })
  });
}
function Mn(n) {
  const e = [];
  let t;
  const s = N(Ge(n.routerState.matches, (r, i, a) => {
    let o = i && r.length === i.length;
    const c = [];
    for (let u = 0, h = r.length; u < h; u++) {
      const l = i && i[u], d = r[u];
      a && l && d.route.key === l.route.key ? c[u] = a[u] : (o = !1, e[u] && e[u](), le((g) => {
        e[u] = g, c[u] = qn(n.routerState, c[u - 1] || n.routerState.base, pt(() => s()[u + 1]), () => n.routerState.matches()[u]);
      }));
    }
    return e.splice(r.length).forEach((u) => u()), a && o ? a : (t = c[0], c);
  }));
  return pt(() => s() && t)();
}
const pt = (n) => () => U(Ot, {
  get when() {
    return n();
  },
  keyed: !0,
  children: (e) => U(qt.Provider, {
    value: e,
    get children() {
      return e.outlet();
    }
  })
}), qe = (n) => {
  const e = Ze(() => n.children);
  return yn(n, {
    get children() {
      return e();
    }
  });
};
function Fn([n, e], t, s) {
  return [n, s ? (r) => e(s(r)) : e];
}
function Vn(n) {
  let e = !1;
  const t = (r) => typeof r == "string" ? { value: r } : r, s = Fn(L(t(n.get()), {
    equals: (r, i) => r.value === i.value && r.state === i.state
  }), void 0, (r) => (!e && n.set(r), r));
  return n.init && Re(n.init((r = n.get()) => {
    e = !0, s[1](t(r)), e = !1;
  })), In({
    signal: s,
    create: n.create,
    utils: n.utils
  });
}
function Hn(n, e, t) {
  return n.addEventListener(e, t), () => n.removeEventListener(e, t);
}
function Wn(n, e) {
  const t = n && document.getElementById(n);
  t ? t.scrollIntoView() : e && window.scrollTo(0, 0);
}
const Kn = /* @__PURE__ */ new Map();
function jn(n = !0, e = !1, t = "/_server", s) {
  return (r) => {
    const i = r.base.path(), a = r.navigatorFactory(r.base);
    let o, c;
    function u(f) {
      return f.namespaceURI === "http://www.w3.org/2000/svg";
    }
    function h(f) {
      if (f.defaultPrevented || f.button !== 0 || f.metaKey || f.altKey || f.ctrlKey || f.shiftKey)
        return;
      const p = f.composedPath().find((z) => z instanceof Node && z.nodeName.toUpperCase() === "A");
      if (!p || e && !p.hasAttribute("link"))
        return;
      const A = u(p), m = A ? p.href.baseVal : p.href;
      if ((A ? p.target.baseVal : p.target) || !m && !p.hasAttribute("state"))
        return;
      const T = (p.getAttribute("rel") || "").split(/\s+/);
      if (p.hasAttribute("download") || T && T.includes("external"))
        return;
      const $ = A ? new URL(m, document.baseURI) : new URL(m);
      if (!($.origin !== window.location.origin || i && $.pathname && !$.pathname.toLowerCase().startsWith(i.toLowerCase())))
        return [p, $];
    }
    function l(f) {
      const p = h(f);
      if (!p)
        return;
      const [A, m] = p, x = r.parsePath(m.pathname + m.search + m.hash), T = A.getAttribute("state");
      f.preventDefault(), a(x, {
        resolve: !1,
        replace: A.hasAttribute("replace"),
        scroll: !A.hasAttribute("noscroll"),
        state: T ? JSON.parse(T) : void 0
      });
    }
    function d(f) {
      const p = h(f);
      if (!p)
        return;
      const [A, m] = p;
      s && (m.pathname = s(m.pathname)), r.preloadRoute(m, A.getAttribute("preload") !== "false");
    }
    function g(f) {
      clearTimeout(o);
      const p = h(f);
      if (!p)
        return c = null;
      const [A, m] = p;
      c !== A && (s && (m.pathname = s(m.pathname)), o = setTimeout(() => {
        r.preloadRoute(m, A.getAttribute("preload") !== "false"), c = A;
      }, 20));
    }
    function k(f) {
      if (f.defaultPrevented)
        return;
      let p = f.submitter && f.submitter.hasAttribute("formaction") ? f.submitter.getAttribute("formaction") : f.target.getAttribute("action");
      if (!p)
        return;
      if (!p.startsWith("https://action/")) {
        const m = new URL(p, Lt);
        if (p = r.parsePath(m.pathname + m.search), !p.startsWith(t))
          return;
      }
      if (f.target.method.toUpperCase() !== "POST")
        throw new Error("Only POST forms are supported for Actions");
      const A = Kn.get(p);
      if (A) {
        f.preventDefault();
        const m = new FormData(f.target, f.submitter);
        A.call({ r, f: f.target }, f.target.enctype === "multipart/form-data" ? m : new URLSearchParams(m));
      }
    }
    Bt(["click", "submit"]), document.addEventListener("click", l), n && (document.addEventListener("mousemove", g, { passive: !0 }), document.addEventListener("focusin", d, { passive: !0 }), document.addEventListener("touchstart", d, { passive: !0 })), document.addEventListener("submit", k), Re(() => {
      document.removeEventListener("click", l), n && (document.removeEventListener("mousemove", g), document.removeEventListener("focusin", d), document.removeEventListener("touchstart", d)), document.removeEventListener("submit", k);
    });
  };
}
function Yn(n) {
  const e = () => {
    const s = window.location.pathname.replace(/^\/+/, "/") + window.location.search, r = window.history.state && window.history.state._depth && Object.keys(window.history.state).length === 1 ? void 0 : window.history.state;
    return {
      value: s + window.location.hash,
      state: r
    };
  }, t = Pt();
  return Vn({
    get: e,
    set({ value: s, replace: r, scroll: i, state: a }) {
      r ? window.history.replaceState(An(a), "", s) : window.history.pushState(a, "", s), Wn(decodeURIComponent(window.location.hash.slice(1)), i), nt();
    },
    init: (s) => Hn(window, "popstate", xn(s, (r) => {
      if (r && r < 0)
        return !t.confirm(r);
      {
        const i = e();
        return !t.confirm(i.value, { state: i.state });
      }
    })),
    create: jn(n.preload, n.explicitLinks, n.actionBase, n.transformUrl),
    utils: {
      go: (s) => window.history.go(s),
      beforeLeave: t
    }
  })(n);
}
const Y = /* @__PURE__ */ Object.create(null);
Y.open = "0";
Y.close = "1";
Y.ping = "2";
Y.pong = "3";
Y.message = "4";
Y.upgrade = "5";
Y.noop = "6";
const we = /* @__PURE__ */ Object.create(null);
Object.keys(Y).forEach((n) => {
  we[Y[n]] = n;
});
const je = { type: "error", data: "parser error" }, Mt = typeof Blob == "function" || typeof Blob < "u" && Object.prototype.toString.call(Blob) === "[object BlobConstructor]", Ft = typeof ArrayBuffer == "function", Vt = (n) => typeof ArrayBuffer.isView == "function" ? ArrayBuffer.isView(n) : n && n.buffer instanceof ArrayBuffer, st = ({ type: n, data: e }, t, s) => Mt && e instanceof Blob ? t ? s(e) : gt(e, s) : Ft && (e instanceof ArrayBuffer || Vt(e)) ? t ? s(e) : gt(new Blob([e]), s) : s(Y[n] + (e || "")), gt = (n, e) => {
  const t = new FileReader();
  return t.onload = function() {
    const s = t.result.split(",")[1];
    e("b" + (s || ""));
  }, t.readAsDataURL(n);
};
function mt(n) {
  return n instanceof Uint8Array ? n : n instanceof ArrayBuffer ? new Uint8Array(n) : new Uint8Array(n.buffer, n.byteOffset, n.byteLength);
}
let Ie;
function zn(n, e) {
  if (Mt && n.data instanceof Blob)
    return n.data.arrayBuffer().then(mt).then(e);
  if (Ft && (n.data instanceof ArrayBuffer || Vt(n.data)))
    return e(mt(n.data));
  st(n, !1, (t) => {
    Ie || (Ie = new TextEncoder()), e(Ie.encode(t));
  });
}
const yt = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", ce = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (let n = 0; n < yt.length; n++)
  ce[yt.charCodeAt(n)] = n;
const Xn = (n) => {
  let e = n.length * 0.75, t = n.length, s, r = 0, i, a, o, c;
  n[n.length - 1] === "=" && (e--, n[n.length - 2] === "=" && e--);
  const u = new ArrayBuffer(e), h = new Uint8Array(u);
  for (s = 0; s < t; s += 4)
    i = ce[n.charCodeAt(s)], a = ce[n.charCodeAt(s + 1)], o = ce[n.charCodeAt(s + 2)], c = ce[n.charCodeAt(s + 3)], h[r++] = i << 2 | a >> 4, h[r++] = (a & 15) << 4 | o >> 2, h[r++] = (o & 3) << 6 | c & 63;
  return u;
}, Jn = typeof ArrayBuffer == "function", rt = (n, e) => {
  if (typeof n != "string")
    return {
      type: "message",
      data: Ht(n, e)
    };
  const t = n.charAt(0);
  return t === "b" ? {
    type: "message",
    data: Qn(n.substring(1), e)
  } : we[t] ? n.length > 1 ? {
    type: we[t],
    data: n.substring(1)
  } : {
    type: we[t]
  } : je;
}, Qn = (n, e) => {
  if (Jn) {
    const t = Xn(n);
    return Ht(t, e);
  } else
    return { base64: !0, data: n };
}, Ht = (n, e) => {
  switch (e) {
    case "blob":
      return n instanceof Blob ? n : new Blob([n]);
    case "arraybuffer":
    default:
      return n instanceof ArrayBuffer ? n : n.buffer;
  }
}, Wt = "", Gn = (n, e) => {
  const t = n.length, s = new Array(t);
  let r = 0;
  n.forEach((i, a) => {
    st(i, !1, (o) => {
      s[a] = o, ++r === t && e(s.join(Wt));
    });
  });
}, Zn = (n, e) => {
  const t = n.split(Wt), s = [];
  for (let r = 0; r < t.length; r++) {
    const i = rt(t[r], e);
    if (s.push(i), i.type === "error")
      break;
  }
  return s;
};
function es() {
  return new TransformStream({
    transform(n, e) {
      zn(n, (t) => {
        const s = t.length;
        let r;
        if (s < 126)
          r = new Uint8Array(1), new DataView(r.buffer).setUint8(0, s);
        else if (s < 65536) {
          r = new Uint8Array(3);
          const i = new DataView(r.buffer);
          i.setUint8(0, 126), i.setUint16(1, s);
        } else {
          r = new Uint8Array(9);
          const i = new DataView(r.buffer);
          i.setUint8(0, 127), i.setBigUint64(1, BigInt(s));
        }
        n.data && typeof n.data != "string" && (r[0] |= 128), e.enqueue(r), e.enqueue(t);
      });
    }
  });
}
let Ue;
function ge(n) {
  return n.reduce((e, t) => e + t.length, 0);
}
function me(n, e) {
  if (n[0].length === e)
    return n.shift();
  const t = new Uint8Array(e);
  let s = 0;
  for (let r = 0; r < e; r++)
    t[r] = n[0][s++], s === n[0].length && (n.shift(), s = 0);
  return n.length && s < n[0].length && (n[0] = n[0].slice(s)), t;
}
function ts(n, e) {
  Ue || (Ue = new TextDecoder());
  const t = [];
  let s = 0, r = -1, i = !1;
  return new TransformStream({
    transform(a, o) {
      for (t.push(a); ; ) {
        if (s === 0) {
          if (ge(t) < 1)
            break;
          const c = me(t, 1);
          i = (c[0] & 128) === 128, r = c[0] & 127, r < 126 ? s = 3 : r === 126 ? s = 1 : s = 2;
        } else if (s === 1) {
          if (ge(t) < 2)
            break;
          const c = me(t, 2);
          r = new DataView(c.buffer, c.byteOffset, c.length).getUint16(0), s = 3;
        } else if (s === 2) {
          if (ge(t) < 8)
            break;
          const c = me(t, 8), u = new DataView(c.buffer, c.byteOffset, c.length), h = u.getUint32(0);
          if (h > Math.pow(2, 21) - 1) {
            o.enqueue(je);
            break;
          }
          r = h * Math.pow(2, 32) + u.getUint32(4), s = 3;
        } else {
          if (ge(t) < r)
            break;
          const c = me(t, r);
          o.enqueue(rt(i ? c : Ue.decode(c), e)), s = 0;
        }
        if (r === 0 || r > n) {
          o.enqueue(je);
          break;
        }
      }
    }
  });
}
const Kt = 4;
function B(n) {
  if (n) return ns(n);
}
function ns(n) {
  for (var e in B.prototype)
    n[e] = B.prototype[e];
  return n;
}
B.prototype.on = B.prototype.addEventListener = function(n, e) {
  return this._callbacks = this._callbacks || {}, (this._callbacks["$" + n] = this._callbacks["$" + n] || []).push(e), this;
};
B.prototype.once = function(n, e) {
  function t() {
    this.off(n, t), e.apply(this, arguments);
  }
  return t.fn = e, this.on(n, t), this;
};
B.prototype.off = B.prototype.removeListener = B.prototype.removeAllListeners = B.prototype.removeEventListener = function(n, e) {
  if (this._callbacks = this._callbacks || {}, arguments.length == 0)
    return this._callbacks = {}, this;
  var t = this._callbacks["$" + n];
  if (!t) return this;
  if (arguments.length == 1)
    return delete this._callbacks["$" + n], this;
  for (var s, r = 0; r < t.length; r++)
    if (s = t[r], s === e || s.fn === e) {
      t.splice(r, 1);
      break;
    }
  return t.length === 0 && delete this._callbacks["$" + n], this;
};
B.prototype.emit = function(n) {
  this._callbacks = this._callbacks || {};
  for (var e = new Array(arguments.length - 1), t = this._callbacks["$" + n], s = 1; s < arguments.length; s++)
    e[s - 1] = arguments[s];
  if (t) {
    t = t.slice(0);
    for (var s = 0, r = t.length; s < r; ++s)
      t[s].apply(this, e);
  }
  return this;
};
B.prototype.emitReserved = B.prototype.emit;
B.prototype.listeners = function(n) {
  return this._callbacks = this._callbacks || {}, this._callbacks["$" + n] || [];
};
B.prototype.hasListeners = function(n) {
  return !!this.listeners(n).length;
};
const Te = typeof Promise == "function" && typeof Promise.resolve == "function" ? (e) => Promise.resolve().then(e) : (e, t) => t(e, 0), F = typeof self < "u" ? self : typeof window < "u" ? window : Function("return this")(), ss = "arraybuffer";
function jt(n, ...e) {
  return e.reduce((t, s) => (n.hasOwnProperty(s) && (t[s] = n[s]), t), {});
}
const rs = F.setTimeout, is = F.clearTimeout;
function Oe(n, e) {
  e.useNativeTimers ? (n.setTimeoutFn = rs.bind(F), n.clearTimeoutFn = is.bind(F)) : (n.setTimeoutFn = F.setTimeout.bind(F), n.clearTimeoutFn = F.clearTimeout.bind(F));
}
const os = 1.33;
function as(n) {
  return typeof n == "string" ? cs(n) : Math.ceil((n.byteLength || n.size) * os);
}
function cs(n) {
  let e = 0, t = 0;
  for (let s = 0, r = n.length; s < r; s++)
    e = n.charCodeAt(s), e < 128 ? t += 1 : e < 2048 ? t += 2 : e < 55296 || e >= 57344 ? t += 3 : (s++, t += 4);
  return t;
}
function Yt() {
  return Date.now().toString(36).substring(3) + Math.random().toString(36).substring(2, 5);
}
function ls(n) {
  let e = "";
  for (let t in n)
    n.hasOwnProperty(t) && (e.length && (e += "&"), e += encodeURIComponent(t) + "=" + encodeURIComponent(n[t]));
  return e;
}
function us(n) {
  let e = {}, t = n.split("&");
  for (let s = 0, r = t.length; s < r; s++) {
    let i = t[s].split("=");
    e[decodeURIComponent(i[0])] = decodeURIComponent(i[1]);
  }
  return e;
}
class hs extends Error {
  constructor(e, t, s) {
    super(e), this.description = t, this.context = s, this.type = "TransportError";
  }
}
class it extends B {
  /**
   * Transport abstract constructor.
   *
   * @param {Object} opts - options
   * @protected
   */
  constructor(e) {
    super(), this.writable = !1, Oe(this, e), this.opts = e, this.query = e.query, this.socket = e.socket, this.supportsBinary = !e.forceBase64;
  }
  /**
   * Emits an error.
   *
   * @param {String} reason
   * @param description
   * @param context - the error context
   * @return {Transport} for chaining
   * @protected
   */
  onError(e, t, s) {
    return super.emitReserved("error", new hs(e, t, s)), this;
  }
  /**
   * Opens the transport.
   */
  open() {
    return this.readyState = "opening", this.doOpen(), this;
  }
  /**
   * Closes the transport.
   */
  close() {
    return (this.readyState === "opening" || this.readyState === "open") && (this.doClose(), this.onClose()), this;
  }
  /**
   * Sends multiple packets.
   *
   * @param {Array} packets
   */
  send(e) {
    this.readyState === "open" && this.write(e);
  }
  /**
   * Called upon open
   *
   * @protected
   */
  onOpen() {
    this.readyState = "open", this.writable = !0, super.emitReserved("open");
  }
  /**
   * Called with data.
   *
   * @param {String} data
   * @protected
   */
  onData(e) {
    const t = rt(e, this.socket.binaryType);
    this.onPacket(t);
  }
  /**
   * Called with a decoded packet.
   *
   * @protected
   */
  onPacket(e) {
    super.emitReserved("packet", e);
  }
  /**
   * Called upon close.
   *
   * @protected
   */
  onClose(e) {
    this.readyState = "closed", super.emitReserved("close", e);
  }
  /**
   * Pauses the transport, in order not to lose packets during an upgrade.
   *
   * @param onPause
   */
  pause(e) {
  }
  createUri(e, t = {}) {
    return e + "://" + this._hostname() + this._port() + this.opts.path + this._query(t);
  }
  _hostname() {
    const e = this.opts.hostname;
    return e.indexOf(":") === -1 ? e : "[" + e + "]";
  }
  _port() {
    return this.opts.port && (this.opts.secure && +(this.opts.port !== 443) || !this.opts.secure && Number(this.opts.port) !== 80) ? ":" + this.opts.port : "";
  }
  _query(e) {
    const t = ls(e);
    return t.length ? "?" + t : "";
  }
}
class fs extends it {
  constructor() {
    super(...arguments), this._polling = !1;
  }
  get name() {
    return "polling";
  }
  /**
   * Opens the socket (triggers polling). We write a PING message to determine
   * when the transport is open.
   *
   * @protected
   */
  doOpen() {
    this._poll();
  }
  /**
   * Pauses polling.
   *
   * @param {Function} onPause - callback upon buffers are flushed and transport is paused
   * @package
   */
  pause(e) {
    this.readyState = "pausing";
    const t = () => {
      this.readyState = "paused", e();
    };
    if (this._polling || !this.writable) {
      let s = 0;
      this._polling && (s++, this.once("pollComplete", function() {
        --s || t();
      })), this.writable || (s++, this.once("drain", function() {
        --s || t();
      }));
    } else
      t();
  }
  /**
   * Starts polling cycle.
   *
   * @private
   */
  _poll() {
    this._polling = !0, this.doPoll(), this.emitReserved("poll");
  }
  /**
   * Overloads onData to detect payloads.
   *
   * @protected
   */
  onData(e) {
    const t = (s) => {
      if (this.readyState === "opening" && s.type === "open" && this.onOpen(), s.type === "close")
        return this.onClose({ description: "transport closed by the server" }), !1;
      this.onPacket(s);
    };
    Zn(e, this.socket.binaryType).forEach(t), this.readyState !== "closed" && (this._polling = !1, this.emitReserved("pollComplete"), this.readyState === "open" && this._poll());
  }
  /**
   * For polling, send a close packet.
   *
   * @protected
   */
  doClose() {
    const e = () => {
      this.write([{ type: "close" }]);
    };
    this.readyState === "open" ? e() : this.once("open", e);
  }
  /**
   * Writes a packets payload.
   *
   * @param {Array} packets - data packets
   * @protected
   */
  write(e) {
    this.writable = !1, Gn(e, (t) => {
      this.doWrite(t, () => {
        this.writable = !0, this.emitReserved("drain");
      });
    });
  }
  /**
   * Generates uri for connection.
   *
   * @private
   */
  uri() {
    const e = this.opts.secure ? "https" : "http", t = this.query || {};
    return this.opts.timestampRequests !== !1 && (t[this.opts.timestampParam] = Yt()), !this.supportsBinary && !t.sid && (t.b64 = 1), this.createUri(e, t);
  }
}
let zt = !1;
try {
  zt = typeof XMLHttpRequest < "u" && "withCredentials" in new XMLHttpRequest();
} catch {
}
const ds = zt;
function ps() {
}
class gs extends fs {
  /**
   * XHR Polling constructor.
   *
   * @param {Object} opts
   * @package
   */
  constructor(e) {
    if (super(e), typeof location < "u") {
      const t = location.protocol === "https:";
      let s = location.port;
      s || (s = t ? "443" : "80"), this.xd = typeof location < "u" && e.hostname !== location.hostname || s !== e.port;
    }
  }
  /**
   * Sends data.
   *
   * @param {String} data to send.
   * @param {Function} called upon flush.
   * @private
   */
  doWrite(e, t) {
    const s = this.request({
      method: "POST",
      data: e
    });
    s.on("success", t), s.on("error", (r, i) => {
      this.onError("xhr post error", r, i);
    });
  }
  /**
   * Starts a poll cycle.
   *
   * @private
   */
  doPoll() {
    const e = this.request();
    e.on("data", this.onData.bind(this)), e.on("error", (t, s) => {
      this.onError("xhr poll error", t, s);
    }), this.pollXhr = e;
  }
}
class j extends B {
  /**
   * Request constructor
   *
   * @param {Object} options
   * @package
   */
  constructor(e, t, s) {
    super(), this.createRequest = e, Oe(this, s), this._opts = s, this._method = s.method || "GET", this._uri = t, this._data = s.data !== void 0 ? s.data : null, this._create();
  }
  /**
   * Creates the XHR object and sends the request.
   *
   * @private
   */
  _create() {
    var e;
    const t = jt(this._opts, "agent", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "autoUnref");
    t.xdomain = !!this._opts.xd;
    const s = this._xhr = this.createRequest(t);
    try {
      s.open(this._method, this._uri, !0);
      try {
        if (this._opts.extraHeaders) {
          s.setDisableHeaderCheck && s.setDisableHeaderCheck(!0);
          for (let r in this._opts.extraHeaders)
            this._opts.extraHeaders.hasOwnProperty(r) && s.setRequestHeader(r, this._opts.extraHeaders[r]);
        }
      } catch {
      }
      if (this._method === "POST")
        try {
          s.setRequestHeader("Content-type", "text/plain;charset=UTF-8");
        } catch {
        }
      try {
        s.setRequestHeader("Accept", "*/*");
      } catch {
      }
      (e = this._opts.cookieJar) === null || e === void 0 || e.addCookies(s), "withCredentials" in s && (s.withCredentials = this._opts.withCredentials), this._opts.requestTimeout && (s.timeout = this._opts.requestTimeout), s.onreadystatechange = () => {
        var r;
        s.readyState === 3 && ((r = this._opts.cookieJar) === null || r === void 0 || r.parseCookies(
          // @ts-ignore
          s.getResponseHeader("set-cookie")
        )), s.readyState === 4 && (s.status === 200 || s.status === 1223 ? this._onLoad() : this.setTimeoutFn(() => {
          this._onError(typeof s.status == "number" ? s.status : 0);
        }, 0));
      }, s.send(this._data);
    } catch (r) {
      this.setTimeoutFn(() => {
        this._onError(r);
      }, 0);
      return;
    }
    typeof document < "u" && (this._index = j.requestsCount++, j.requests[this._index] = this);
  }
  /**
   * Called upon error.
   *
   * @private
   */
  _onError(e) {
    this.emitReserved("error", e, this._xhr), this._cleanup(!0);
  }
  /**
   * Cleans up house.
   *
   * @private
   */
  _cleanup(e) {
    if (!(typeof this._xhr > "u" || this._xhr === null)) {
      if (this._xhr.onreadystatechange = ps, e)
        try {
          this._xhr.abort();
        } catch {
        }
      typeof document < "u" && delete j.requests[this._index], this._xhr = null;
    }
  }
  /**
   * Called upon load.
   *
   * @private
   */
  _onLoad() {
    const e = this._xhr.responseText;
    e !== null && (this.emitReserved("data", e), this.emitReserved("success"), this._cleanup());
  }
  /**
   * Aborts the request.
   *
   * @package
   */
  abort() {
    this._cleanup();
  }
}
j.requestsCount = 0;
j.requests = {};
if (typeof document < "u") {
  if (typeof attachEvent == "function")
    attachEvent("onunload", wt);
  else if (typeof addEventListener == "function") {
    const n = "onpagehide" in F ? "pagehide" : "unload";
    addEventListener(n, wt, !1);
  }
}
function wt() {
  for (let n in j.requests)
    j.requests.hasOwnProperty(n) && j.requests[n].abort();
}
const ms = function() {
  const n = Xt({
    xdomain: !1
  });
  return n && n.responseType !== null;
}();
class ys extends gs {
  constructor(e) {
    super(e);
    const t = e && e.forceBase64;
    this.supportsBinary = ms && !t;
  }
  request(e = {}) {
    return Object.assign(e, { xd: this.xd }, this.opts), new j(Xt, this.uri(), e);
  }
}
function Xt(n) {
  const e = n.xdomain;
  try {
    if (typeof XMLHttpRequest < "u" && (!e || ds))
      return new XMLHttpRequest();
  } catch {
  }
  if (!e)
    try {
      return new F[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP");
    } catch {
    }
}
const Jt = typeof navigator < "u" && typeof navigator.product == "string" && navigator.product.toLowerCase() === "reactnative";
class ws extends it {
  get name() {
    return "websocket";
  }
  doOpen() {
    const e = this.uri(), t = this.opts.protocols, s = Jt ? {} : jt(this.opts, "agent", "perMessageDeflate", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "localAddress", "protocolVersion", "origin", "maxPayload", "family", "checkServerIdentity");
    this.opts.extraHeaders && (s.headers = this.opts.extraHeaders);
    try {
      this.ws = this.createSocket(e, t, s);
    } catch (r) {
      return this.emitReserved("error", r);
    }
    this.ws.binaryType = this.socket.binaryType, this.addEventListeners();
  }
  /**
   * Adds event listeners to the socket
   *
   * @private
   */
  addEventListeners() {
    this.ws.onopen = () => {
      this.opts.autoUnref && this.ws._socket.unref(), this.onOpen();
    }, this.ws.onclose = (e) => this.onClose({
      description: "websocket connection closed",
      context: e
    }), this.ws.onmessage = (e) => this.onData(e.data), this.ws.onerror = (e) => this.onError("websocket error", e);
  }
  write(e) {
    this.writable = !1;
    for (let t = 0; t < e.length; t++) {
      const s = e[t], r = t === e.length - 1;
      st(s, this.supportsBinary, (i) => {
        try {
          this.doWrite(s, i);
        } catch {
        }
        r && Te(() => {
          this.writable = !0, this.emitReserved("drain");
        }, this.setTimeoutFn);
      });
    }
  }
  doClose() {
    typeof this.ws < "u" && (this.ws.onerror = () => {
    }, this.ws.close(), this.ws = null);
  }
  /**
   * Generates uri for connection.
   *
   * @private
   */
  uri() {
    const e = this.opts.secure ? "wss" : "ws", t = this.query || {};
    return this.opts.timestampRequests && (t[this.opts.timestampParam] = Yt()), this.supportsBinary || (t.b64 = 1), this.createUri(e, t);
  }
}
const Me = F.WebSocket || F.MozWebSocket;
class bs extends ws {
  createSocket(e, t, s) {
    return Jt ? new Me(e, t, s) : t ? new Me(e, t) : new Me(e);
  }
  doWrite(e, t) {
    this.ws.send(t);
  }
}
class _s extends it {
  get name() {
    return "webtransport";
  }
  doOpen() {
    try {
      this._transport = new WebTransport(this.createUri("https"), this.opts.transportOptions[this.name]);
    } catch (e) {
      return this.emitReserved("error", e);
    }
    this._transport.closed.then(() => {
      this.onClose();
    }).catch((e) => {
      this.onError("webtransport error", e);
    }), this._transport.ready.then(() => {
      this._transport.createBidirectionalStream().then((e) => {
        const t = ts(Number.MAX_SAFE_INTEGER, this.socket.binaryType), s = e.readable.pipeThrough(t).getReader(), r = es();
        r.readable.pipeTo(e.writable), this._writer = r.writable.getWriter();
        const i = () => {
          s.read().then(({ done: o, value: c }) => {
            o || (this.onPacket(c), i());
          }).catch((o) => {
          });
        };
        i();
        const a = { type: "open" };
        this.query.sid && (a.data = `{"sid":"${this.query.sid}"}`), this._writer.write(a).then(() => this.onOpen());
      });
    });
  }
  write(e) {
    this.writable = !1;
    for (let t = 0; t < e.length; t++) {
      const s = e[t], r = t === e.length - 1;
      this._writer.write(s).then(() => {
        r && Te(() => {
          this.writable = !0, this.emitReserved("drain");
        }, this.setTimeoutFn);
      });
    }
  }
  doClose() {
    var e;
    (e = this._transport) === null || e === void 0 || e.close();
  }
}
const vs = {
  websocket: bs,
  webtransport: _s,
  polling: ys
}, Es = /^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/, As = [
  "source",
  "protocol",
  "authority",
  "userInfo",
  "user",
  "password",
  "host",
  "port",
  "relative",
  "path",
  "directory",
  "file",
  "query",
  "anchor"
];
function Ye(n) {
  if (n.length > 8e3)
    throw "URI too long";
  const e = n, t = n.indexOf("["), s = n.indexOf("]");
  t != -1 && s != -1 && (n = n.substring(0, t) + n.substring(t, s).replace(/:/g, ";") + n.substring(s, n.length));
  let r = Es.exec(n || ""), i = {}, a = 14;
  for (; a--; )
    i[As[a]] = r[a] || "";
  return t != -1 && s != -1 && (i.source = e, i.host = i.host.substring(1, i.host.length - 1).replace(/;/g, ":"), i.authority = i.authority.replace("[", "").replace("]", "").replace(/;/g, ":"), i.ipv6uri = !0), i.pathNames = xs(i, i.path), i.queryKey = ks(i, i.query), i;
}
function xs(n, e) {
  const t = /\/{2,9}/g, s = e.replace(t, "/").split("/");
  return (e.slice(0, 1) == "/" || e.length === 0) && s.splice(0, 1), e.slice(-1) == "/" && s.splice(s.length - 1, 1), s;
}
function ks(n, e) {
  const t = {};
  return e.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function(s, r, i) {
    r && (t[r] = i);
  }), t;
}
const ze = typeof addEventListener == "function" && typeof removeEventListener == "function", be = [];
ze && addEventListener("offline", () => {
  be.forEach((n) => n());
}, !1);
class Z extends B {
  /**
   * Socket constructor.
   *
   * @param {String|Object} uri - uri or options
   * @param {Object} opts - options
   */
  constructor(e, t) {
    if (super(), this.binaryType = ss, this.writeBuffer = [], this._prevBufferLen = 0, this._pingInterval = -1, this._pingTimeout = -1, this._maxPayload = -1, this._pingTimeoutTime = 1 / 0, e && typeof e == "object" && (t = e, e = null), e) {
      const s = Ye(e);
      t.hostname = s.host, t.secure = s.protocol === "https" || s.protocol === "wss", t.port = s.port, s.query && (t.query = s.query);
    } else t.host && (t.hostname = Ye(t.host).host);
    Oe(this, t), this.secure = t.secure != null ? t.secure : typeof location < "u" && location.protocol === "https:", t.hostname && !t.port && (t.port = this.secure ? "443" : "80"), this.hostname = t.hostname || (typeof location < "u" ? location.hostname : "localhost"), this.port = t.port || (typeof location < "u" && location.port ? location.port : this.secure ? "443" : "80"), this.transports = [], this._transportsByName = {}, t.transports.forEach((s) => {
      const r = s.prototype.name;
      this.transports.push(r), this._transportsByName[r] = s;
    }), this.opts = Object.assign({
      path: "/engine.io",
      agent: !1,
      withCredentials: !1,
      upgrade: !0,
      timestampParam: "t",
      rememberUpgrade: !1,
      addTrailingSlash: !0,
      rejectUnauthorized: !0,
      perMessageDeflate: {
        threshold: 1024
      },
      transportOptions: {},
      closeOnBeforeunload: !1
    }, t), this.opts.path = this.opts.path.replace(/\/$/, "") + (this.opts.addTrailingSlash ? "/" : ""), typeof this.opts.query == "string" && (this.opts.query = us(this.opts.query)), ze && (this.opts.closeOnBeforeunload && (this._beforeunloadEventListener = () => {
      this.transport && (this.transport.removeAllListeners(), this.transport.close());
    }, addEventListener("beforeunload", this._beforeunloadEventListener, !1)), this.hostname !== "localhost" && (this._offlineEventListener = () => {
      this._onClose("transport close", {
        description: "network connection lost"
      });
    }, be.push(this._offlineEventListener))), this.opts.withCredentials && (this._cookieJar = void 0), this._open();
  }
  /**
   * Creates transport of the given type.
   *
   * @param {String} name - transport name
   * @return {Transport}
   * @private
   */
  createTransport(e) {
    const t = Object.assign({}, this.opts.query);
    t.EIO = Kt, t.transport = e, this.id && (t.sid = this.id);
    const s = Object.assign({}, this.opts, {
      query: t,
      socket: this,
      hostname: this.hostname,
      secure: this.secure,
      port: this.port
    }, this.opts.transportOptions[e]);
    return new this._transportsByName[e](s);
  }
  /**
   * Initializes transport to use and starts probe.
   *
   * @private
   */
  _open() {
    if (this.transports.length === 0) {
      this.setTimeoutFn(() => {
        this.emitReserved("error", "No transports available");
      }, 0);
      return;
    }
    const e = this.opts.rememberUpgrade && Z.priorWebsocketSuccess && this.transports.indexOf("websocket") !== -1 ? "websocket" : this.transports[0];
    this.readyState = "opening";
    const t = this.createTransport(e);
    t.open(), this.setTransport(t);
  }
  /**
   * Sets the current transport. Disables the existing one (if any).
   *
   * @private
   */
  setTransport(e) {
    this.transport && this.transport.removeAllListeners(), this.transport = e, e.on("drain", this._onDrain.bind(this)).on("packet", this._onPacket.bind(this)).on("error", this._onError.bind(this)).on("close", (t) => this._onClose("transport close", t));
  }
  /**
   * Called when connection is deemed open.
   *
   * @private
   */
  onOpen() {
    this.readyState = "open", Z.priorWebsocketSuccess = this.transport.name === "websocket", this.emitReserved("open"), this.flush();
  }
  /**
   * Handles a packet.
   *
   * @private
   */
  _onPacket(e) {
    if (this.readyState === "opening" || this.readyState === "open" || this.readyState === "closing")
      switch (this.emitReserved("packet", e), this.emitReserved("heartbeat"), e.type) {
        case "open":
          this.onHandshake(JSON.parse(e.data));
          break;
        case "ping":
          this._sendPacket("pong"), this.emitReserved("ping"), this.emitReserved("pong"), this._resetPingTimeout();
          break;
        case "error":
          const t = new Error("server error");
          t.code = e.data, this._onError(t);
          break;
        case "message":
          this.emitReserved("data", e.data), this.emitReserved("message", e.data);
          break;
      }
  }
  /**
   * Called upon handshake completion.
   *
   * @param {Object} data - handshake obj
   * @private
   */
  onHandshake(e) {
    this.emitReserved("handshake", e), this.id = e.sid, this.transport.query.sid = e.sid, this._pingInterval = e.pingInterval, this._pingTimeout = e.pingTimeout, this._maxPayload = e.maxPayload, this.onOpen(), this.readyState !== "closed" && this._resetPingTimeout();
  }
  /**
   * Sets and resets ping timeout timer based on server pings.
   *
   * @private
   */
  _resetPingTimeout() {
    this.clearTimeoutFn(this._pingTimeoutTimer);
    const e = this._pingInterval + this._pingTimeout;
    this._pingTimeoutTime = Date.now() + e, this._pingTimeoutTimer = this.setTimeoutFn(() => {
      this._onClose("ping timeout");
    }, e), this.opts.autoUnref && this._pingTimeoutTimer.unref();
  }
  /**
   * Called on `drain` event
   *
   * @private
   */
  _onDrain() {
    this.writeBuffer.splice(0, this._prevBufferLen), this._prevBufferLen = 0, this.writeBuffer.length === 0 ? this.emitReserved("drain") : this.flush();
  }
  /**
   * Flush write buffers.
   *
   * @private
   */
  flush() {
    if (this.readyState !== "closed" && this.transport.writable && !this.upgrading && this.writeBuffer.length) {
      const e = this._getWritablePackets();
      this.transport.send(e), this._prevBufferLen = e.length, this.emitReserved("flush");
    }
  }
  /**
   * Ensure the encoded size of the writeBuffer is below the maxPayload value sent by the server (only for HTTP
   * long-polling)
   *
   * @private
   */
  _getWritablePackets() {
    if (!(this._maxPayload && this.transport.name === "polling" && this.writeBuffer.length > 1))
      return this.writeBuffer;
    let t = 1;
    for (let s = 0; s < this.writeBuffer.length; s++) {
      const r = this.writeBuffer[s].data;
      if (r && (t += as(r)), s > 0 && t > this._maxPayload)
        return this.writeBuffer.slice(0, s);
      t += 2;
    }
    return this.writeBuffer;
  }
  /**
   * Checks whether the heartbeat timer has expired but the socket has not yet been notified.
   *
   * Note: this method is private for now because it does not really fit the WebSocket API, but if we put it in the
   * `write()` method then the message would not be buffered by the Socket.IO client.
   *
   * @return {boolean}
   * @private
   */
  /* private */
  _hasPingExpired() {
    if (!this._pingTimeoutTime)
      return !0;
    const e = Date.now() > this._pingTimeoutTime;
    return e && (this._pingTimeoutTime = 0, Te(() => {
      this._onClose("ping timeout");
    }, this.setTimeoutFn)), e;
  }
  /**
   * Sends a message.
   *
   * @param {String} msg - message.
   * @param {Object} options.
   * @param {Function} fn - callback function.
   * @return {Socket} for chaining.
   */
  write(e, t, s) {
    return this._sendPacket("message", e, t, s), this;
  }
  /**
   * Sends a message. Alias of {@link Socket#write}.
   *
   * @param {String} msg - message.
   * @param {Object} options.
   * @param {Function} fn - callback function.
   * @return {Socket} for chaining.
   */
  send(e, t, s) {
    return this._sendPacket("message", e, t, s), this;
  }
  /**
   * Sends a packet.
   *
   * @param {String} type: packet type.
   * @param {String} data.
   * @param {Object} options.
   * @param {Function} fn - callback function.
   * @private
   */
  _sendPacket(e, t, s, r) {
    if (typeof t == "function" && (r = t, t = void 0), typeof s == "function" && (r = s, s = null), this.readyState === "closing" || this.readyState === "closed")
      return;
    s = s || {}, s.compress = s.compress !== !1;
    const i = {
      type: e,
      data: t,
      options: s
    };
    this.emitReserved("packetCreate", i), this.writeBuffer.push(i), r && this.once("flush", r), this.flush();
  }
  /**
   * Closes the connection.
   */
  close() {
    const e = () => {
      this._onClose("forced close"), this.transport.close();
    }, t = () => {
      this.off("upgrade", t), this.off("upgradeError", t), e();
    }, s = () => {
      this.once("upgrade", t), this.once("upgradeError", t);
    };
    return (this.readyState === "opening" || this.readyState === "open") && (this.readyState = "closing", this.writeBuffer.length ? this.once("drain", () => {
      this.upgrading ? s() : e();
    }) : this.upgrading ? s() : e()), this;
  }
  /**
   * Called upon transport error
   *
   * @private
   */
  _onError(e) {
    if (Z.priorWebsocketSuccess = !1, this.opts.tryAllTransports && this.transports.length > 1 && this.readyState === "opening")
      return this.transports.shift(), this._open();
    this.emitReserved("error", e), this._onClose("transport error", e);
  }
  /**
   * Called upon transport close.
   *
   * @private
   */
  _onClose(e, t) {
    if (this.readyState === "opening" || this.readyState === "open" || this.readyState === "closing") {
      if (this.clearTimeoutFn(this._pingTimeoutTimer), this.transport.removeAllListeners("close"), this.transport.close(), this.transport.removeAllListeners(), ze && (this._beforeunloadEventListener && removeEventListener("beforeunload", this._beforeunloadEventListener, !1), this._offlineEventListener)) {
        const s = be.indexOf(this._offlineEventListener);
        s !== -1 && be.splice(s, 1);
      }
      this.readyState = "closed", this.id = null, this.emitReserved("close", e, t), this.writeBuffer = [], this._prevBufferLen = 0;
    }
  }
}
Z.protocol = Kt;
class Ss extends Z {
  constructor() {
    super(...arguments), this._upgrades = [];
  }
  onOpen() {
    if (super.onOpen(), this.readyState === "open" && this.opts.upgrade)
      for (let e = 0; e < this._upgrades.length; e++)
        this._probe(this._upgrades[e]);
  }
  /**
   * Probes a transport.
   *
   * @param {String} name - transport name
   * @private
   */
  _probe(e) {
    let t = this.createTransport(e), s = !1;
    Z.priorWebsocketSuccess = !1;
    const r = () => {
      s || (t.send([{ type: "ping", data: "probe" }]), t.once("packet", (l) => {
        if (!s)
          if (l.type === "pong" && l.data === "probe") {
            if (this.upgrading = !0, this.emitReserved("upgrading", t), !t)
              return;
            Z.priorWebsocketSuccess = t.name === "websocket", this.transport.pause(() => {
              s || this.readyState !== "closed" && (h(), this.setTransport(t), t.send([{ type: "upgrade" }]), this.emitReserved("upgrade", t), t = null, this.upgrading = !1, this.flush());
            });
          } else {
            const d = new Error("probe error");
            d.transport = t.name, this.emitReserved("upgradeError", d);
          }
      }));
    };
    function i() {
      s || (s = !0, h(), t.close(), t = null);
    }
    const a = (l) => {
      const d = new Error("probe error: " + l);
      d.transport = t.name, i(), this.emitReserved("upgradeError", d);
    };
    function o() {
      a("transport closed");
    }
    function c() {
      a("socket closed");
    }
    function u(l) {
      t && l.name !== t.name && i();
    }
    const h = () => {
      t.removeListener("open", r), t.removeListener("error", a), t.removeListener("close", o), this.off("close", c), this.off("upgrading", u);
    };
    t.once("open", r), t.once("error", a), t.once("close", o), this.once("close", c), this.once("upgrading", u), this._upgrades.indexOf("webtransport") !== -1 && e !== "webtransport" ? this.setTimeoutFn(() => {
      s || t.open();
    }, 200) : t.open();
  }
  onHandshake(e) {
    this._upgrades = this._filterUpgrades(e.upgrades), super.onHandshake(e);
  }
  /**
   * Filters upgrades, returning only those matching client transports.
   *
   * @param {Array} upgrades - server upgrades
   * @private
   */
  _filterUpgrades(e) {
    const t = [];
    for (let s = 0; s < e.length; s++)
      ~this.transports.indexOf(e[s]) && t.push(e[s]);
    return t;
  }
}
let Cs = class extends Ss {
  constructor(e, t = {}) {
    const s = typeof e == "object" ? e : t;
    (!s.transports || s.transports && typeof s.transports[0] == "string") && (s.transports = (s.transports || ["polling", "websocket", "webtransport"]).map((r) => vs[r]).filter((r) => !!r)), super(e, s);
  }
};
function Rs(n, e = "", t) {
  let s = n;
  t = t || typeof location < "u" && location, n == null && (n = t.protocol + "//" + t.host), typeof n == "string" && (n.charAt(0) === "/" && (n.charAt(1) === "/" ? n = t.protocol + n : n = t.host + n), /^(https?|wss?):\/\//.test(n) || (typeof t < "u" ? n = t.protocol + "//" + n : n = "https://" + n), s = Ye(n)), s.port || (/^(http|ws)$/.test(s.protocol) ? s.port = "80" : /^(http|ws)s$/.test(s.protocol) && (s.port = "443")), s.path = s.path || "/";
  const i = s.host.indexOf(":") !== -1 ? "[" + s.host + "]" : s.host;
  return s.id = s.protocol + "://" + i + ":" + s.port + e, s.href = s.protocol + "://" + i + (t && t.port === s.port ? "" : ":" + s.port), s;
}
const Ts = typeof ArrayBuffer == "function", Os = (n) => typeof ArrayBuffer.isView == "function" ? ArrayBuffer.isView(n) : n.buffer instanceof ArrayBuffer, Qt = Object.prototype.toString, Bs = typeof Blob == "function" || typeof Blob < "u" && Qt.call(Blob) === "[object BlobConstructor]", Ps = typeof File == "function" || typeof File < "u" && Qt.call(File) === "[object FileConstructor]";
function ot(n) {
  return Ts && (n instanceof ArrayBuffer || Os(n)) || Bs && n instanceof Blob || Ps && n instanceof File;
}
function _e(n, e) {
  if (!n || typeof n != "object")
    return !1;
  if (Array.isArray(n)) {
    for (let t = 0, s = n.length; t < s; t++)
      if (_e(n[t]))
        return !0;
    return !1;
  }
  if (ot(n))
    return !0;
  if (n.toJSON && typeof n.toJSON == "function" && arguments.length === 1)
    return _e(n.toJSON(), !0);
  for (const t in n)
    if (Object.prototype.hasOwnProperty.call(n, t) && _e(n[t]))
      return !0;
  return !1;
}
function Ls(n) {
  const e = [], t = n.data, s = n;
  return s.data = Xe(t, e), s.attachments = e.length, { packet: s, buffers: e };
}
function Xe(n, e) {
  if (!n)
    return n;
  if (ot(n)) {
    const t = { _placeholder: !0, num: e.length };
    return e.push(n), t;
  } else if (Array.isArray(n)) {
    const t = new Array(n.length);
    for (let s = 0; s < n.length; s++)
      t[s] = Xe(n[s], e);
    return t;
  } else if (typeof n == "object" && !(n instanceof Date)) {
    const t = {};
    for (const s in n)
      Object.prototype.hasOwnProperty.call(n, s) && (t[s] = Xe(n[s], e));
    return t;
  }
  return n;
}
function Ns(n, e) {
  return n.data = Je(n.data, e), delete n.attachments, n;
}
function Je(n, e) {
  if (!n)
    return n;
  if (n && n._placeholder === !0) {
    if (typeof n.num == "number" && n.num >= 0 && n.num < e.length)
      return e[n.num];
    throw new Error("illegal attachments");
  } else if (Array.isArray(n))
    for (let t = 0; t < n.length; t++)
      n[t] = Je(n[t], e);
  else if (typeof n == "object")
    for (const t in n)
      Object.prototype.hasOwnProperty.call(n, t) && (n[t] = Je(n[t], e));
  return n;
}
const $s = [
  "connect",
  "connect_error",
  "disconnect",
  "disconnecting",
  "newListener",
  "removeListener"
  // used by the Node.js EventEmitter
], Ds = 5;
var _;
(function(n) {
  n[n.CONNECT = 0] = "CONNECT", n[n.DISCONNECT = 1] = "DISCONNECT", n[n.EVENT = 2] = "EVENT", n[n.ACK = 3] = "ACK", n[n.CONNECT_ERROR = 4] = "CONNECT_ERROR", n[n.BINARY_EVENT = 5] = "BINARY_EVENT", n[n.BINARY_ACK = 6] = "BINARY_ACK";
})(_ || (_ = {}));
class qs {
  /**
   * Encoder constructor
   *
   * @param {function} replacer - custom replacer to pass down to JSON.parse
   */
  constructor(e) {
    this.replacer = e;
  }
  /**
   * Encode a packet as a single string if non-binary, or as a
   * buffer sequence, depending on packet type.
   *
   * @param {Object} obj - packet object
   */
  encode(e) {
    return (e.type === _.EVENT || e.type === _.ACK) && _e(e) ? this.encodeAsBinary({
      type: e.type === _.EVENT ? _.BINARY_EVENT : _.BINARY_ACK,
      nsp: e.nsp,
      data: e.data,
      id: e.id
    }) : [this.encodeAsString(e)];
  }
  /**
   * Encode packet as string.
   */
  encodeAsString(e) {
    let t = "" + e.type;
    return (e.type === _.BINARY_EVENT || e.type === _.BINARY_ACK) && (t += e.attachments + "-"), e.nsp && e.nsp !== "/" && (t += e.nsp + ","), e.id != null && (t += e.id), e.data != null && (t += JSON.stringify(e.data, this.replacer)), t;
  }
  /**
   * Encode packet as 'buffer sequence' by removing blobs, and
   * deconstructing packet into object with placeholders and
   * a list of buffers.
   */
  encodeAsBinary(e) {
    const t = Ls(e), s = this.encodeAsString(t.packet), r = t.buffers;
    return r.unshift(s), r;
  }
}
function bt(n) {
  return Object.prototype.toString.call(n) === "[object Object]";
}
class at extends B {
  /**
   * Decoder constructor
   *
   * @param {function} reviver - custom reviver to pass down to JSON.stringify
   */
  constructor(e) {
    super(), this.reviver = e;
  }
  /**
   * Decodes an encoded packet string into packet JSON.
   *
   * @param {String} obj - encoded packet
   */
  add(e) {
    let t;
    if (typeof e == "string") {
      if (this.reconstructor)
        throw new Error("got plaintext data when reconstructing a packet");
      t = this.decodeString(e);
      const s = t.type === _.BINARY_EVENT;
      s || t.type === _.BINARY_ACK ? (t.type = s ? _.EVENT : _.ACK, this.reconstructor = new Is(t), t.attachments === 0 && super.emitReserved("decoded", t)) : super.emitReserved("decoded", t);
    } else if (ot(e) || e.base64)
      if (this.reconstructor)
        t = this.reconstructor.takeBinaryData(e), t && (this.reconstructor = null, super.emitReserved("decoded", t));
      else
        throw new Error("got binary data when not reconstructing a packet");
    else
      throw new Error("Unknown type: " + e);
  }
  /**
   * Decode a packet String (JSON data)
   *
   * @param {String} str
   * @return {Object} packet
   */
  decodeString(e) {
    let t = 0;
    const s = {
      type: Number(e.charAt(0))
    };
    if (_[s.type] === void 0)
      throw new Error("unknown packet type " + s.type);
    if (s.type === _.BINARY_EVENT || s.type === _.BINARY_ACK) {
      const i = t + 1;
      for (; e.charAt(++t) !== "-" && t != e.length; )
        ;
      const a = e.substring(i, t);
      if (a != Number(a) || e.charAt(t) !== "-")
        throw new Error("Illegal attachments");
      s.attachments = Number(a);
    }
    if (e.charAt(t + 1) === "/") {
      const i = t + 1;
      for (; ++t && !(e.charAt(t) === "," || t === e.length); )
        ;
      s.nsp = e.substring(i, t);
    } else
      s.nsp = "/";
    const r = e.charAt(t + 1);
    if (r !== "" && Number(r) == r) {
      const i = t + 1;
      for (; ++t; ) {
        const a = e.charAt(t);
        if (a == null || Number(a) != a) {
          --t;
          break;
        }
        if (t === e.length)
          break;
      }
      s.id = Number(e.substring(i, t + 1));
    }
    if (e.charAt(++t)) {
      const i = this.tryParse(e.substr(t));
      if (at.isPayloadValid(s.type, i))
        s.data = i;
      else
        throw new Error("invalid payload");
    }
    return s;
  }
  tryParse(e) {
    try {
      return JSON.parse(e, this.reviver);
    } catch {
      return !1;
    }
  }
  static isPayloadValid(e, t) {
    switch (e) {
      case _.CONNECT:
        return bt(t);
      case _.DISCONNECT:
        return t === void 0;
      case _.CONNECT_ERROR:
        return typeof t == "string" || bt(t);
      case _.EVENT:
      case _.BINARY_EVENT:
        return Array.isArray(t) && (typeof t[0] == "number" || typeof t[0] == "string" && $s.indexOf(t[0]) === -1);
      case _.ACK:
      case _.BINARY_ACK:
        return Array.isArray(t);
    }
  }
  /**
   * Deallocates a parser's resources
   */
  destroy() {
    this.reconstructor && (this.reconstructor.finishedReconstruction(), this.reconstructor = null);
  }
}
class Is {
  constructor(e) {
    this.packet = e, this.buffers = [], this.reconPack = e;
  }
  /**
   * Method to be called when binary data received from connection
   * after a BINARY_EVENT packet.
   *
   * @param {Buffer | ArrayBuffer} binData - the raw binary data received
   * @return {null | Object} returns null if more binary data is expected or
   *   a reconstructed packet object if all buffers have been received.
   */
  takeBinaryData(e) {
    if (this.buffers.push(e), this.buffers.length === this.reconPack.attachments) {
      const t = Ns(this.reconPack, this.buffers);
      return this.finishedReconstruction(), t;
    }
    return null;
  }
  /**
   * Cleans up binary packet reconstruction variables.
   */
  finishedReconstruction() {
    this.reconPack = null, this.buffers = [];
  }
}
const Us = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Decoder: at,
  Encoder: qs,
  get PacketType() {
    return _;
  },
  protocol: Ds
}, Symbol.toStringTag, { value: "Module" }));
function H(n, e, t) {
  return n.on(e, t), function() {
    n.off(e, t);
  };
}
const Ms = Object.freeze({
  connect: 1,
  connect_error: 1,
  disconnect: 1,
  disconnecting: 1,
  // EventEmitter reserved events: https://nodejs.org/api/events.html#events_event_newlistener
  newListener: 1,
  removeListener: 1
});
class Gt extends B {
  /**
   * `Socket` constructor.
   */
  constructor(e, t, s) {
    super(), this.connected = !1, this.recovered = !1, this.receiveBuffer = [], this.sendBuffer = [], this._queue = [], this._queueSeq = 0, this.ids = 0, this.acks = {}, this.flags = {}, this.io = e, this.nsp = t, s && s.auth && (this.auth = s.auth), this._opts = Object.assign({}, s), this.io._autoConnect && this.open();
  }
  /**
   * Whether the socket is currently disconnected
   *
   * @example
   * const socket = io();
   *
   * socket.on("connect", () => {
   *   console.log(socket.disconnected); // false
   * });
   *
   * socket.on("disconnect", () => {
   *   console.log(socket.disconnected); // true
   * });
   */
  get disconnected() {
    return !this.connected;
  }
  /**
   * Subscribe to open, close and packet events
   *
   * @private
   */
  subEvents() {
    if (this.subs)
      return;
    const e = this.io;
    this.subs = [
      H(e, "open", this.onopen.bind(this)),
      H(e, "packet", this.onpacket.bind(this)),
      H(e, "error", this.onerror.bind(this)),
      H(e, "close", this.onclose.bind(this))
    ];
  }
  /**
   * Whether the Socket will try to reconnect when its Manager connects or reconnects.
   *
   * @example
   * const socket = io();
   *
   * console.log(socket.active); // true
   *
   * socket.on("disconnect", (reason) => {
   *   if (reason === "io server disconnect") {
   *     // the disconnection was initiated by the server, you need to manually reconnect
   *     console.log(socket.active); // false
   *   }
   *   // else the socket will automatically try to reconnect
   *   console.log(socket.active); // true
   * });
   */
  get active() {
    return !!this.subs;
  }
  /**
   * "Opens" the socket.
   *
   * @example
   * const socket = io({
   *   autoConnect: false
   * });
   *
   * socket.connect();
   */
  connect() {
    return this.connected ? this : (this.subEvents(), this.io._reconnecting || this.io.open(), this.io._readyState === "open" && this.onopen(), this);
  }
  /**
   * Alias for {@link connect()}.
   */
  open() {
    return this.connect();
  }
  /**
   * Sends a `message` event.
   *
   * This method mimics the WebSocket.send() method.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/send
   *
   * @example
   * socket.send("hello");
   *
   * // this is equivalent to
   * socket.emit("message", "hello");
   *
   * @return self
   */
  send(...e) {
    return e.unshift("message"), this.emit.apply(this, e), this;
  }
  /**
   * Override `emit`.
   * If the event is in `events`, it's emitted normally.
   *
   * @example
   * socket.emit("hello", "world");
   *
   * // all serializable datastructures are supported (no need to call JSON.stringify)
   * socket.emit("hello", 1, "2", { 3: ["4"], 5: Uint8Array.from([6]) });
   *
   * // with an acknowledgement from the server
   * socket.emit("hello", "world", (val) => {
   *   // ...
   * });
   *
   * @return self
   */
  emit(e, ...t) {
    var s, r, i;
    if (Ms.hasOwnProperty(e))
      throw new Error('"' + e.toString() + '" is a reserved event name');
    if (t.unshift(e), this._opts.retries && !this.flags.fromQueue && !this.flags.volatile)
      return this._addToQueue(t), this;
    const a = {
      type: _.EVENT,
      data: t
    };
    if (a.options = {}, a.options.compress = this.flags.compress !== !1, typeof t[t.length - 1] == "function") {
      const h = this.ids++, l = t.pop();
      this._registerAckCallback(h, l), a.id = h;
    }
    const o = (r = (s = this.io.engine) === null || s === void 0 ? void 0 : s.transport) === null || r === void 0 ? void 0 : r.writable, c = this.connected && !(!((i = this.io.engine) === null || i === void 0) && i._hasPingExpired());
    return this.flags.volatile && !o || (c ? (this.notifyOutgoingListeners(a), this.packet(a)) : this.sendBuffer.push(a)), this.flags = {}, this;
  }
  /**
   * @private
   */
  _registerAckCallback(e, t) {
    var s;
    const r = (s = this.flags.timeout) !== null && s !== void 0 ? s : this._opts.ackTimeout;
    if (r === void 0) {
      this.acks[e] = t;
      return;
    }
    const i = this.io.setTimeoutFn(() => {
      delete this.acks[e];
      for (let o = 0; o < this.sendBuffer.length; o++)
        this.sendBuffer[o].id === e && this.sendBuffer.splice(o, 1);
      t.call(this, new Error("operation has timed out"));
    }, r), a = (...o) => {
      this.io.clearTimeoutFn(i), t.apply(this, o);
    };
    a.withError = !0, this.acks[e] = a;
  }
  /**
   * Emits an event and waits for an acknowledgement
   *
   * @example
   * // without timeout
   * const response = await socket.emitWithAck("hello", "world");
   *
   * // with a specific timeout
   * try {
   *   const response = await socket.timeout(1000).emitWithAck("hello", "world");
   * } catch (err) {
   *   // the server did not acknowledge the event in the given delay
   * }
   *
   * @return a Promise that will be fulfilled when the server acknowledges the event
   */
  emitWithAck(e, ...t) {
    return new Promise((s, r) => {
      const i = (a, o) => a ? r(a) : s(o);
      i.withError = !0, t.push(i), this.emit(e, ...t);
    });
  }
  /**
   * Add the packet to the queue.
   * @param args
   * @private
   */
  _addToQueue(e) {
    let t;
    typeof e[e.length - 1] == "function" && (t = e.pop());
    const s = {
      id: this._queueSeq++,
      tryCount: 0,
      pending: !1,
      args: e,
      flags: Object.assign({ fromQueue: !0 }, this.flags)
    };
    e.push((r, ...i) => s !== this._queue[0] ? void 0 : (r !== null ? s.tryCount > this._opts.retries && (this._queue.shift(), t && t(r)) : (this._queue.shift(), t && t(null, ...i)), s.pending = !1, this._drainQueue())), this._queue.push(s), this._drainQueue();
  }
  /**
   * Send the first packet of the queue, and wait for an acknowledgement from the server.
   * @param force - whether to resend a packet that has not been acknowledged yet
   *
   * @private
   */
  _drainQueue(e = !1) {
    if (!this.connected || this._queue.length === 0)
      return;
    const t = this._queue[0];
    t.pending && !e || (t.pending = !0, t.tryCount++, this.flags = t.flags, this.emit.apply(this, t.args));
  }
  /**
   * Sends a packet.
   *
   * @param packet
   * @private
   */
  packet(e) {
    e.nsp = this.nsp, this.io._packet(e);
  }
  /**
   * Called upon engine `open`.
   *
   * @private
   */
  onopen() {
    typeof this.auth == "function" ? this.auth((e) => {
      this._sendConnectPacket(e);
    }) : this._sendConnectPacket(this.auth);
  }
  /**
   * Sends a CONNECT packet to initiate the Socket.IO session.
   *
   * @param data
   * @private
   */
  _sendConnectPacket(e) {
    this.packet({
      type: _.CONNECT,
      data: this._pid ? Object.assign({ pid: this._pid, offset: this._lastOffset }, e) : e
    });
  }
  /**
   * Called upon engine or manager `error`.
   *
   * @param err
   * @private
   */
  onerror(e) {
    this.connected || this.emitReserved("connect_error", e);
  }
  /**
   * Called upon engine `close`.
   *
   * @param reason
   * @param description
   * @private
   */
  onclose(e, t) {
    this.connected = !1, delete this.id, this.emitReserved("disconnect", e, t), this._clearAcks();
  }
  /**
   * Clears the acknowledgement handlers upon disconnection, since the client will never receive an acknowledgement from
   * the server.
   *
   * @private
   */
  _clearAcks() {
    Object.keys(this.acks).forEach((e) => {
      if (!this.sendBuffer.some((s) => String(s.id) === e)) {
        const s = this.acks[e];
        delete this.acks[e], s.withError && s.call(this, new Error("socket has been disconnected"));
      }
    });
  }
  /**
   * Called with socket packet.
   *
   * @param packet
   * @private
   */
  onpacket(e) {
    if (e.nsp === this.nsp)
      switch (e.type) {
        case _.CONNECT:
          e.data && e.data.sid ? this.onconnect(e.data.sid, e.data.pid) : this.emitReserved("connect_error", new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));
          break;
        case _.EVENT:
        case _.BINARY_EVENT:
          this.onevent(e);
          break;
        case _.ACK:
        case _.BINARY_ACK:
          this.onack(e);
          break;
        case _.DISCONNECT:
          this.ondisconnect();
          break;
        case _.CONNECT_ERROR:
          this.destroy();
          const s = new Error(e.data.message);
          s.data = e.data.data, this.emitReserved("connect_error", s);
          break;
      }
  }
  /**
   * Called upon a server event.
   *
   * @param packet
   * @private
   */
  onevent(e) {
    const t = e.data || [];
    e.id != null && t.push(this.ack(e.id)), this.connected ? this.emitEvent(t) : this.receiveBuffer.push(Object.freeze(t));
  }
  emitEvent(e) {
    if (this._anyListeners && this._anyListeners.length) {
      const t = this._anyListeners.slice();
      for (const s of t)
        s.apply(this, e);
    }
    super.emit.apply(this, e), this._pid && e.length && typeof e[e.length - 1] == "string" && (this._lastOffset = e[e.length - 1]);
  }
  /**
   * Produces an ack callback to emit with an event.
   *
   * @private
   */
  ack(e) {
    const t = this;
    let s = !1;
    return function(...r) {
      s || (s = !0, t.packet({
        type: _.ACK,
        id: e,
        data: r
      }));
    };
  }
  /**
   * Called upon a server acknowledgement.
   *
   * @param packet
   * @private
   */
  onack(e) {
    const t = this.acks[e.id];
    typeof t == "function" && (delete this.acks[e.id], t.withError && e.data.unshift(null), t.apply(this, e.data));
  }
  /**
   * Called upon server connect.
   *
   * @private
   */
  onconnect(e, t) {
    this.id = e, this.recovered = t && this._pid === t, this._pid = t, this.connected = !0, this.emitBuffered(), this.emitReserved("connect"), this._drainQueue(!0);
  }
  /**
   * Emit buffered events (received and emitted).
   *
   * @private
   */
  emitBuffered() {
    this.receiveBuffer.forEach((e) => this.emitEvent(e)), this.receiveBuffer = [], this.sendBuffer.forEach((e) => {
      this.notifyOutgoingListeners(e), this.packet(e);
    }), this.sendBuffer = [];
  }
  /**
   * Called upon server disconnect.
   *
   * @private
   */
  ondisconnect() {
    this.destroy(), this.onclose("io server disconnect");
  }
  /**
   * Called upon forced client/server side disconnections,
   * this method ensures the manager stops tracking us and
   * that reconnections don't get triggered for this.
   *
   * @private
   */
  destroy() {
    this.subs && (this.subs.forEach((e) => e()), this.subs = void 0), this.io._destroy(this);
  }
  /**
   * Disconnects the socket manually. In that case, the socket will not try to reconnect.
   *
   * If this is the last active Socket instance of the {@link Manager}, the low-level connection will be closed.
   *
   * @example
   * const socket = io();
   *
   * socket.on("disconnect", (reason) => {
   *   // console.log(reason); prints "io client disconnect"
   * });
   *
   * socket.disconnect();
   *
   * @return self
   */
  disconnect() {
    return this.connected && this.packet({ type: _.DISCONNECT }), this.destroy(), this.connected && this.onclose("io client disconnect"), this;
  }
  /**
   * Alias for {@link disconnect()}.
   *
   * @return self
   */
  close() {
    return this.disconnect();
  }
  /**
   * Sets the compress flag.
   *
   * @example
   * socket.compress(false).emit("hello");
   *
   * @param compress - if `true`, compresses the sending data
   * @return self
   */
  compress(e) {
    return this.flags.compress = e, this;
  }
  /**
   * Sets a modifier for a subsequent event emission that the event message will be dropped when this socket is not
   * ready to send messages.
   *
   * @example
   * socket.volatile.emit("hello"); // the server may or may not receive it
   *
   * @returns self
   */
  get volatile() {
    return this.flags.volatile = !0, this;
  }
  /**
   * Sets a modifier for a subsequent event emission that the callback will be called with an error when the
   * given number of milliseconds have elapsed without an acknowledgement from the server:
   *
   * @example
   * socket.timeout(5000).emit("my-event", (err) => {
   *   if (err) {
   *     // the server did not acknowledge the event in the given delay
   *   }
   * });
   *
   * @returns self
   */
  timeout(e) {
    return this.flags.timeout = e, this;
  }
  /**
   * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
   * callback.
   *
   * @example
   * socket.onAny((event, ...args) => {
   *   console.log(`got ${event}`);
   * });
   *
   * @param listener
   */
  onAny(e) {
    return this._anyListeners = this._anyListeners || [], this._anyListeners.push(e), this;
  }
  /**
   * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
   * callback. The listener is added to the beginning of the listeners array.
   *
   * @example
   * socket.prependAny((event, ...args) => {
   *   console.log(`got event ${event}`);
   * });
   *
   * @param listener
   */
  prependAny(e) {
    return this._anyListeners = this._anyListeners || [], this._anyListeners.unshift(e), this;
  }
  /**
   * Removes the listener that will be fired when any event is emitted.
   *
   * @example
   * const catchAllListener = (event, ...args) => {
   *   console.log(`got event ${event}`);
   * }
   *
   * socket.onAny(catchAllListener);
   *
   * // remove a specific listener
   * socket.offAny(catchAllListener);
   *
   * // or remove all listeners
   * socket.offAny();
   *
   * @param listener
   */
  offAny(e) {
    if (!this._anyListeners)
      return this;
    if (e) {
      const t = this._anyListeners;
      for (let s = 0; s < t.length; s++)
        if (e === t[s])
          return t.splice(s, 1), this;
    } else
      this._anyListeners = [];
    return this;
  }
  /**
   * Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
   * e.g. to remove listeners.
   */
  listenersAny() {
    return this._anyListeners || [];
  }
  /**
   * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
   * callback.
   *
   * Note: acknowledgements sent to the server are not included.
   *
   * @example
   * socket.onAnyOutgoing((event, ...args) => {
   *   console.log(`sent event ${event}`);
   * });
   *
   * @param listener
   */
  onAnyOutgoing(e) {
    return this._anyOutgoingListeners = this._anyOutgoingListeners || [], this._anyOutgoingListeners.push(e), this;
  }
  /**
   * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
   * callback. The listener is added to the beginning of the listeners array.
   *
   * Note: acknowledgements sent to the server are not included.
   *
   * @example
   * socket.prependAnyOutgoing((event, ...args) => {
   *   console.log(`sent event ${event}`);
   * });
   *
   * @param listener
   */
  prependAnyOutgoing(e) {
    return this._anyOutgoingListeners = this._anyOutgoingListeners || [], this._anyOutgoingListeners.unshift(e), this;
  }
  /**
   * Removes the listener that will be fired when any event is emitted.
   *
   * @example
   * const catchAllListener = (event, ...args) => {
   *   console.log(`sent event ${event}`);
   * }
   *
   * socket.onAnyOutgoing(catchAllListener);
   *
   * // remove a specific listener
   * socket.offAnyOutgoing(catchAllListener);
   *
   * // or remove all listeners
   * socket.offAnyOutgoing();
   *
   * @param [listener] - the catch-all listener (optional)
   */
  offAnyOutgoing(e) {
    if (!this._anyOutgoingListeners)
      return this;
    if (e) {
      const t = this._anyOutgoingListeners;
      for (let s = 0; s < t.length; s++)
        if (e === t[s])
          return t.splice(s, 1), this;
    } else
      this._anyOutgoingListeners = [];
    return this;
  }
  /**
   * Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
   * e.g. to remove listeners.
   */
  listenersAnyOutgoing() {
    return this._anyOutgoingListeners || [];
  }
  /**
   * Notify the listeners for each packet sent
   *
   * @param packet
   *
   * @private
   */
  notifyOutgoingListeners(e) {
    if (this._anyOutgoingListeners && this._anyOutgoingListeners.length) {
      const t = this._anyOutgoingListeners.slice();
      for (const s of t)
        s.apply(this, e.data);
    }
  }
}
function oe(n) {
  n = n || {}, this.ms = n.min || 100, this.max = n.max || 1e4, this.factor = n.factor || 2, this.jitter = n.jitter > 0 && n.jitter <= 1 ? n.jitter : 0, this.attempts = 0;
}
oe.prototype.duration = function() {
  var n = this.ms * Math.pow(this.factor, this.attempts++);
  if (this.jitter) {
    var e = Math.random(), t = Math.floor(e * this.jitter * n);
    n = (Math.floor(e * 10) & 1) == 0 ? n - t : n + t;
  }
  return Math.min(n, this.max) | 0;
};
oe.prototype.reset = function() {
  this.attempts = 0;
};
oe.prototype.setMin = function(n) {
  this.ms = n;
};
oe.prototype.setMax = function(n) {
  this.max = n;
};
oe.prototype.setJitter = function(n) {
  this.jitter = n;
};
class Qe extends B {
  constructor(e, t) {
    var s;
    super(), this.nsps = {}, this.subs = [], e && typeof e == "object" && (t = e, e = void 0), t = t || {}, t.path = t.path || "/socket.io", this.opts = t, Oe(this, t), this.reconnection(t.reconnection !== !1), this.reconnectionAttempts(t.reconnectionAttempts || 1 / 0), this.reconnectionDelay(t.reconnectionDelay || 1e3), this.reconnectionDelayMax(t.reconnectionDelayMax || 5e3), this.randomizationFactor((s = t.randomizationFactor) !== null && s !== void 0 ? s : 0.5), this.backoff = new oe({
      min: this.reconnectionDelay(),
      max: this.reconnectionDelayMax(),
      jitter: this.randomizationFactor()
    }), this.timeout(t.timeout == null ? 2e4 : t.timeout), this._readyState = "closed", this.uri = e;
    const r = t.parser || Us;
    this.encoder = new r.Encoder(), this.decoder = new r.Decoder(), this._autoConnect = t.autoConnect !== !1, this._autoConnect && this.open();
  }
  reconnection(e) {
    return arguments.length ? (this._reconnection = !!e, e || (this.skipReconnect = !0), this) : this._reconnection;
  }
  reconnectionAttempts(e) {
    return e === void 0 ? this._reconnectionAttempts : (this._reconnectionAttempts = e, this);
  }
  reconnectionDelay(e) {
    var t;
    return e === void 0 ? this._reconnectionDelay : (this._reconnectionDelay = e, (t = this.backoff) === null || t === void 0 || t.setMin(e), this);
  }
  randomizationFactor(e) {
    var t;
    return e === void 0 ? this._randomizationFactor : (this._randomizationFactor = e, (t = this.backoff) === null || t === void 0 || t.setJitter(e), this);
  }
  reconnectionDelayMax(e) {
    var t;
    return e === void 0 ? this._reconnectionDelayMax : (this._reconnectionDelayMax = e, (t = this.backoff) === null || t === void 0 || t.setMax(e), this);
  }
  timeout(e) {
    return arguments.length ? (this._timeout = e, this) : this._timeout;
  }
  /**
   * Starts trying to reconnect if reconnection is enabled and we have not
   * started reconnecting yet
   *
   * @private
   */
  maybeReconnectOnOpen() {
    !this._reconnecting && this._reconnection && this.backoff.attempts === 0 && this.reconnect();
  }
  /**
   * Sets the current transport `socket`.
   *
   * @param {Function} fn - optional, callback
   * @return self
   * @public
   */
  open(e) {
    if (~this._readyState.indexOf("open"))
      return this;
    this.engine = new Cs(this.uri, this.opts);
    const t = this.engine, s = this;
    this._readyState = "opening", this.skipReconnect = !1;
    const r = H(t, "open", function() {
      s.onopen(), e && e();
    }), i = (o) => {
      this.cleanup(), this._readyState = "closed", this.emitReserved("error", o), e ? e(o) : this.maybeReconnectOnOpen();
    }, a = H(t, "error", i);
    if (this._timeout !== !1) {
      const o = this._timeout, c = this.setTimeoutFn(() => {
        r(), i(new Error("timeout")), t.close();
      }, o);
      this.opts.autoUnref && c.unref(), this.subs.push(() => {
        this.clearTimeoutFn(c);
      });
    }
    return this.subs.push(r), this.subs.push(a), this;
  }
  /**
   * Alias for open()
   *
   * @return self
   * @public
   */
  connect(e) {
    return this.open(e);
  }
  /**
   * Called upon transport open.
   *
   * @private
   */
  onopen() {
    this.cleanup(), this._readyState = "open", this.emitReserved("open");
    const e = this.engine;
    this.subs.push(
      H(e, "ping", this.onping.bind(this)),
      H(e, "data", this.ondata.bind(this)),
      H(e, "error", this.onerror.bind(this)),
      H(e, "close", this.onclose.bind(this)),
      // @ts-ignore
      H(this.decoder, "decoded", this.ondecoded.bind(this))
    );
  }
  /**
   * Called upon a ping.
   *
   * @private
   */
  onping() {
    this.emitReserved("ping");
  }
  /**
   * Called with data.
   *
   * @private
   */
  ondata(e) {
    try {
      this.decoder.add(e);
    } catch (t) {
      this.onclose("parse error", t);
    }
  }
  /**
   * Called when parser fully decodes a packet.
   *
   * @private
   */
  ondecoded(e) {
    Te(() => {
      this.emitReserved("packet", e);
    }, this.setTimeoutFn);
  }
  /**
   * Called upon socket error.
   *
   * @private
   */
  onerror(e) {
    this.emitReserved("error", e);
  }
  /**
   * Creates a new socket for the given `nsp`.
   *
   * @return {Socket}
   * @public
   */
  socket(e, t) {
    let s = this.nsps[e];
    return s ? this._autoConnect && !s.active && s.connect() : (s = new Gt(this, e, t), this.nsps[e] = s), s;
  }
  /**
   * Called upon a socket close.
   *
   * @param socket
   * @private
   */
  _destroy(e) {
    const t = Object.keys(this.nsps);
    for (const s of t)
      if (this.nsps[s].active)
        return;
    this._close();
  }
  /**
   * Writes a packet.
   *
   * @param packet
   * @private
   */
  _packet(e) {
    const t = this.encoder.encode(e);
    for (let s = 0; s < t.length; s++)
      this.engine.write(t[s], e.options);
  }
  /**
   * Clean up transport subscriptions and packet buffer.
   *
   * @private
   */
  cleanup() {
    this.subs.forEach((e) => e()), this.subs.length = 0, this.decoder.destroy();
  }
  /**
   * Close the current socket.
   *
   * @private
   */
  _close() {
    this.skipReconnect = !0, this._reconnecting = !1, this.onclose("forced close");
  }
  /**
   * Alias for close()
   *
   * @private
   */
  disconnect() {
    return this._close();
  }
  /**
   * Called when:
   *
   * - the low-level engine is closed
   * - the parser encountered a badly formatted packet
   * - all sockets are disconnected
   *
   * @private
   */
  onclose(e, t) {
    var s;
    this.cleanup(), (s = this.engine) === null || s === void 0 || s.close(), this.backoff.reset(), this._readyState = "closed", this.emitReserved("close", e, t), this._reconnection && !this.skipReconnect && this.reconnect();
  }
  /**
   * Attempt a reconnection.
   *
   * @private
   */
  reconnect() {
    if (this._reconnecting || this.skipReconnect)
      return this;
    const e = this;
    if (this.backoff.attempts >= this._reconnectionAttempts)
      this.backoff.reset(), this.emitReserved("reconnect_failed"), this._reconnecting = !1;
    else {
      const t = this.backoff.duration();
      this._reconnecting = !0;
      const s = this.setTimeoutFn(() => {
        e.skipReconnect || (this.emitReserved("reconnect_attempt", e.backoff.attempts), !e.skipReconnect && e.open((r) => {
          r ? (e._reconnecting = !1, e.reconnect(), this.emitReserved("reconnect_error", r)) : e.onreconnect();
        }));
      }, t);
      this.opts.autoUnref && s.unref(), this.subs.push(() => {
        this.clearTimeoutFn(s);
      });
    }
  }
  /**
   * Called upon successful reconnect.
   *
   * @private
   */
  onreconnect() {
    const e = this.backoff.attempts;
    this._reconnecting = !1, this.backoff.reset(), this.emitReserved("reconnect", e);
  }
}
const ae = {};
function ve(n, e) {
  typeof n == "object" && (e = n, n = void 0), e = e || {};
  const t = Rs(n, e.path || "/socket.io"), s = t.source, r = t.id, i = t.path, a = ae[r] && i in ae[r].nsps, o = e.forceNew || e["force new connection"] || e.multiplex === !1 || a;
  let c;
  return o ? c = new Qe(s, e) : (ae[r] || (ae[r] = new Qe(s, e)), c = ae[r]), t.query && !e.query && (e.query = t.queryKey), c.socket(t.path, e);
}
Object.assign(ve, {
  Manager: Qe,
  Socket: Gt,
  io: ve,
  connect: ve
});
var Fs = /* @__PURE__ */ W('<div class="flex h-screen flex-col bg-white dark:bg-neutral-900 dark:text-white pt-10"><div class="flex-1 overflow-auto scroll-smooth px-4 py-2 text-sm"><div id=outputMessage class="my-2 px-4 py-2"><pre class="font-normal whitespace-pre-wrap"></pre></div></div><div class="relative flex items-center justify-between gap-2 pb-4"><span>$</span><input type=text autofocus>'), Vs = /* @__PURE__ */ W("<pre>"), Hs = /* @__PURE__ */ W('<div class="z-10 rounded-md border border-neutral-600 bg-neutral-900 text-sm text-white shadow-lg"><div class="flex flex-col text-left">'), Ws = /* @__PURE__ */ W('<button class="flex items-center gap-2 px-4 py-2 text-left text-neutral-100 hover:bg-neutral-800">'), Ks = /* @__PURE__ */ W('<svg xmlns=http://www.w3.org/2000/svg width=24 height=24 viewBox="0 0 24 24"><path fill=#fff d="m20.713 8.128l-.246.566a.506.506 0 0 1-.934 0l-.246-.566a4.36 4.36 0 0 0-2.22-2.25l-.759-.339a.53.53 0 0 1 0-.963l.717-.319a4.37 4.37 0 0 0 2.251-2.326l.253-.611a.506.506 0 0 1 .942 0l.253.61a4.37 4.37 0 0 0 2.25 2.327l.718.32a.53.53 0 0 1 0 .962l-.76.338a4.36 4.36 0 0 0-2.219 2.251M12 4a8 8 0 1 0 7.944 7.045l1.986-.236Q22 11.396 22 12c0 5.523-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2c.861 0 1.699.11 2.498.315L14 4.252A8 8 0 0 0 12 4m1 7h3l-5 7v-5H8l5-7z">'), js = /* @__PURE__ */ W('<svg xmlns=http://www.w3.org/2000/svg width=24 height=24 viewBox="0 0 24 24"><path fill=none stroke=#fff d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2M7 7h10M7 12h10M7 17h6">'), Ys = /* @__PURE__ */ W('<svg xmlns=http://www.w3.org/2000/svg width=24 height=24 viewBox="0 0 512 512"><path fill=#fff fill-rule=evenodd d="M256 42.667C138.18 42.667 42.667 138.179 42.667 256c0 117.82 95.513 213.334 213.333 213.334c117.822 0 213.334-95.513 213.334-213.334S373.822 42.667 256 42.667m0 384c-94.105 0-170.666-76.561-170.666-170.667S161.894 85.334 256 85.334c94.107 0 170.667 76.56 170.667 170.666S350.107 426.667 256 426.667m26.714-256c0 15.468-11.262 26.667-26.497 26.667c-15.851 0-26.837-11.2-26.837-26.963c0-15.15 11.283-26.37 26.837-26.37c15.235 0 26.497 11.22 26.497 26.666m-48 64h42.666v128h-42.666z">'), zs = /* @__PURE__ */ W('<svg xmlns=http://www.w3.org/2000/svg width=24 height=24 viewBox="0 0 24 24"><path fill=#fff d="M4 21h9.62a4 4 0 0 0 3.037-1.397l5.102-5.952a1 1 0 0 0-.442-1.6l-1.968-.656a3.04 3.04 0 0 0-2.823.503l-3.185 2.547l-.617-1.235A3.98 3.98 0 0 0 9.146 11H4c-1.103 0-2 .897-2 2v6c0 1.103.897 2 2 2m0-8h5.146c.763 0 1.448.423 1.789 1.105l.447.895H7v2h6.014a1 1 0 0 0 .442-.11l.003-.001l.004-.002h.003l.002-.001h.004l.001-.001c.009.003.003-.001.003-.001c.01 0 .002-.001.002-.001h.001l.002-.001l.003-.001l.002-.001l.002-.001l.003-.001l.002-.001c.003 0 .001-.001.002-.001l.003-.002l.002-.001l.002-.001l.003-.001l.002-.001h.001l.002-.001h.001l.002-.001l.002-.001c.009-.001.003-.001.003-.001l.002-.001a1 1 0 0 0 .11-.078l4.146-3.317c.262-.208.623-.273.94-.167l.557.186l-4.133 4.823a2.03 2.03 0 0 1-1.52.688H4zM16 2h-.017c-.163.002-1.006.039-1.983.705c-.951-.648-1.774-.7-1.968-.704L12.002 2h-.004c-.801 0-1.555.313-2.119.878C9.313 3.445 9 4.198 9 5s.313 1.555.861 2.104l3.414 3.586a1.006 1.006 0 0 0 1.45-.001l3.396-3.568C18.688 6.555 19 5.802 19 5s-.313-1.555-.878-2.121A2.98 2.98 0 0 0 16.002 2zm1 3c0 .267-.104.518-.311.725L14 8.55l-2.707-2.843C11.104 5.518 11 5.267 11 5s.104-.518.294-.708A.98.98 0 0 1 11.979 4c.025.001.502.032 1.067.485q.121.098.247.222l.707.707l.707-.707q.126-.124.247-.222c.529-.425.976-.478 1.052-.484a1 1 0 0 1 .701.292c.189.189.293.44.293.707">');
function Xs() {
  const [n, e] = L([]), [t, s] = L(null), [r, i] = L(""), [a, o] = L("/home/your-username"), [c, u] = L(""), [h, l] = L("Disconnected"), [d, g] = L(!1), [k, f] = L({
    x: 0,
    y: 0
  }), [p, A] = L([]);
  let m, x;
  x && (x.disabled = !0);
  const T = ["Switch to AI", "Documentation", "Donate", "About"], $ = (E) => {
    A(T.filter((y) => y.toLowerCase().includes(E.toLowerCase().slice(1))));
  }, z = (E) => {
    const y = E.currentTarget.value;
    if (i(y), y.startsWith("/")) {
      const M = E.currentTarget.getBoundingClientRect();
      f({
        x: M.left,
        y: M.bottom
      }), g(!0), $(y);
    } else
      g(!1);
  }, se = () => {
    m && (m.scrollTop = m.scrollHeight);
  }, K = (E, y) => {
    if (E === "outputMessage" || E === "error" && y === "Authentication required") {
      const w = document.getElementById("outputMessage");
      w && (w.innerHTML = `<pre class="${E === "error" ? "text-red-500" : "text-yellow-500"} font-light whitespace-pre-wrap">${y}</pre>`);
      return;
    }
    const M = n()[n().length - 1];
    M && M.content === y || (e((w) => [...w, {
      type: E,
      content: y
    }]), se());
  }, de = () => {
    r() && (K("message", "Processing..."), t()?.emit("exec", r()), i(""));
  };
  rn(() => {
    se();
    const E = ve("http://localhost:5000/terminal", {
      transports: ["websocket"],
      withCredentials: !0
    });
    s(E), E.on("connect", () => {
      l("Connected"), x && (x.disabled = !1);
    }), E.on("connect_error", (y) => {
      console.error("Connection Error:", y.message), x && (x.disabled = !0), l("Disconnected");
    }), E.on("osinfo", (y) => {
      u(y.homedir);
    }), E.on("outputMessage", (y) => {
      K("outputMessage", y);
    }), E.on("output", (y) => K("message", y)), E.on("cwdInfo", (y) => K("message", y)), E.on("error", (y) => K("error", `${y}`)), E.on("close", (y) => K("message", `
${y}
`)), E.on("prompt", ({
      cwd: y,
      command: M
    }) => {
      let w = y;
      const b = c();
      if (b && y.startsWith(b))
        w = y.replace(b, "~");
      else {
        const P = y.split("/");
        w = P[P.length - 1] || "/";
      }
      o(w), K("command", `${y} $ ${M}`);
    }), Re(() => E.disconnect());
  });
  const Be = (E) => {
    i(""), g(!1), K("message", `Selected: ${E}`);
  };
  return Et(se), (() => {
    var E = Fs(), y = E.firstChild;
    y.firstChild;
    var M = y.nextSibling, w = M.firstChild, b = w.nextSibling, P = m;
    typeof P == "function" ? ft(P, y) : m = y, y.style.setProperty("scroll-behavior", "smooth"), G(y, U(lt, {
      get each() {
        return n();
      },
      children: (R) => (() => {
        var O = Vs();
        return G(O, (() => {
          var D = He(() => R.type === "command");
          return () => D() ? `${a()} $ ${R.content.split(" $ ")[1]}` : R.content;
        })()), J((D) => {
          var C = R.type === "command" ? "font-bold whitespace-pre-wrap text-yellow-400" : R.type === "error" ? "whitespace-pre-wrap text-red-400" : "whitespace-pre-wrap", q = R.type === "command" ? R.content.split(" $ ")[0] : "";
          return C !== D.e && Ne(O, D.e = C), q !== D.t && ht(O, "title", D.t = q), D;
        }, {
          e: void 0,
          t: void 0
        }), O;
      })()
    }), null), G(E, (() => {
      var R = He(() => !!(d() && p().length > 0));
      return () => R() && (() => {
        var O = Hs(), D = O.firstChild;
        return O.style.setProperty("width", "200px"), G(D, U(lt, {
          get each() {
            return p();
          },
          children: (C) => (() => {
            var q = Ws();
            return q.$$click = () => Be(C), G(q, C === "Switch to AI" ? Ks() : C === "Documentation" ? js() : C === "About" ? Ys() : C === "Donate" ? zs() : null, null), G(q, C, null), q;
          })()
        })), J((C) => {
          var q = `${k().x}px`, re = `${k().y + 4}px`;
          return q !== C.e && ((C.e = q) != null ? O.style.setProperty("left", q) : O.style.removeProperty("left")), re !== C.t && ((C.t = re) != null ? O.style.setProperty("top", re) : O.style.removeProperty("top")), C;
        }, {
          e: void 0,
          t: void 0
        }), O;
      })();
    })(), M), b.$$keydown = (R) => {
      R.key === "Enter" && (de(), g(!1));
    }, b.$$input = z;
    var X = x;
    return typeof X == "function" ? ft(X, b) : x = b, J((R) => {
      var O = `ml-4 ${h() === "Connected" ? "text-green-400" : "text-red-400"}`, D = `flex-1 dark:bg-netural-950 ${h() === "Connected" ? "text-green-400" : "text-red-400"} rounded-md px-1 text-sm focus:outline-none focus:ring-0`, C = `${h() === "Connected" ? "Type a command..." : h()}`;
      return O !== R.e && Ne(w, R.e = O), D !== R.t && Ne(b, R.t = D), C !== R.a && ht(b, "placeholder", R.a = C), R;
    }, {
      e: void 0,
      t: void 0,
      a: void 0
    }), J(() => b.value = r()), E;
  })();
}
Bt(["input", "keydown", "click"]);
var Js = /* @__PURE__ */ W('<div class="flex min-h-screen items-center justify-center">');
function Qs() {
  const [n, e] = L("");
  return Js();
}
var Gs = /* @__PURE__ */ W('<div class="flex min-h-screen items-center justify-center">');
function Zs() {
  const [n, e] = L("");
  return Gs();
}
var er = /* @__PURE__ */ W('<div class="relative flex h-full flex-col bg-white dark:bg-neutral-900 font-sans text-slate-900 dark:text-slate-50">');
const tr = () => (() => {
  var n = er();
  return G(n, U(Yn, {
    get children() {
      return [U(qe, {
        path: "/terminal",
        component: Xs
      }), U(qe, {
        path: "/dashboard",
        component: Qs
      }), U(qe, {
        path: "/",
        component: Zs
      })];
    }
  })), n;
})(), nr = document.getElementById("root");
_n(() => U(tr, {}), nr);
