const I = {
  context: void 0,
  registry: void 0,
  effects: void 0,
  done: !1,
  getContextId() {
    return Yn(this.context.count);
  },
  getNextContextId() {
    return Yn(this.context.count++);
  }
};
function Yn(e) {
  const t = String(e), n = t.length - 1;
  return I.context.id + (n ? String.fromCharCode(96 + n) : "") + t;
}
function tt(e) {
  I.context = e;
}
const zs = !1, Qs = (e, t) => e === t, Ct = Symbol("solid-proxy"), Mr = typeof Proxy == "function", Js = Symbol("solid-track"), Ot = {
  equals: Qs
};
let Nr = Ur;
const we = 1, ot = 2, Fr = {
  owned: null,
  cleanups: null,
  context: null,
  owner: null
}, Gt = {};
var M = null;
let x = null, Gs = null, Q = null, ue = null, ae = null, Dt = 0;
function Me(e, t) {
  const n = Q, r = M, s = e.length === 0, o = t === void 0 ? r : t, i = s ? Fr : {
    owned: null,
    cleanups: null,
    context: o ? o.context : null,
    owner: o
  }, c = s ? e : () => e(() => ce(() => Be(i)));
  M = i, Q = null;
  try {
    return pe(c, !0);
  } finally {
    Q = n, M = r;
  }
}
function $(e, t) {
  t = t ? Object.assign({}, Ot, t) : Ot;
  const n = {
    value: e,
    observers: null,
    observerSlots: null,
    comparator: t.equals || void 0
  }, r = (s) => (typeof s == "function" && (x && x.running && x.sources.has(n) ? s = s(n.tValue) : s = s(n.value)), jr(n, s));
  return [qr.bind(n), r];
}
function Tt(e, t, n) {
  const r = Ut(e, t, !0, we);
  Qe(r);
}
function oe(e, t, n) {
  const r = Ut(e, t, !1, we);
  Qe(r);
}
function Te(e, t, n) {
  Nr = ro;
  const r = Ut(e, t, !1, we), s = Fe && De(Fe);
  s && (r.suspense = s), r.user = !0, ae ? ae.push(r) : Qe(r);
}
function Y(e, t, n) {
  n = n ? Object.assign({}, Ot, n) : Ot;
  const r = Ut(e, t, !0, 0);
  return r.observers = null, r.observerSlots = null, r.comparator = n.equals || void 0, Qe(r), qr.bind(r);
}
function Ys(e) {
  return e && typeof e == "object" && "then" in e;
}
function Xs(e, t, n) {
  let r, s, o;
  typeof t == "function" ? (r = e, s = t, o = {}) : (r = !0, s = e, o = t || {});
  let i = null, c = Gt, l = null, u = !1, f = !1, a = "initialValue" in o, d = typeof r == "function" && Y(r);
  const h = /* @__PURE__ */ new Set(), [b, m] = (o.storage || $)(o.initialValue), [g, E] = $(void 0), [w, _] = $(void 0, {
    equals: !1
  }), [S, B] = $(a ? "ready" : "unresolved");
  I.context && (l = I.getNextContextId(), o.ssrLoadFrom === "initial" ? c = o.initialValue : I.load && I.has(l) && (c = I.load(l)));
  function A(k, p, R, T) {
    return i === k && (i = null, T !== void 0 && (a = !0), (k === c || p === c) && o.onHydrated && queueMicrotask(
      () => o.onHydrated(T, {
        value: p
      })
    ), c = Gt, x && k && u ? (x.promises.delete(k), u = !1, pe(() => {
      x.running = !0, j(p, R);
    }, !1)) : j(p, R)), p;
  }
  function j(k, p) {
    pe(() => {
      p === void 0 && m(() => k), B(p !== void 0 ? "errored" : a ? "ready" : "unresolved"), E(p);
      for (const R of h.keys()) R.decrement();
      h.clear();
    }, !1);
  }
  function H() {
    const k = Fe && De(Fe), p = b(), R = g();
    if (R !== void 0 && !i) throw R;
    return Q && !Q.user && k && Tt(() => {
      w(), i && (k.resolved && x && u ? x.promises.add(i) : h.has(k) || (k.increment(), h.add(k)));
    }), p;
  }
  function J(k = !0) {
    if (k !== !1 && f) return;
    f = !1;
    const p = d ? d() : r;
    if (u = x && x.running, p == null || p === !1) {
      A(i, ce(b));
      return;
    }
    x && i && x.promises.delete(i);
    const R = c !== Gt ? c : ce(
      () => s(p, {
        value: b(),
        refetching: k
      })
    );
    return Ys(R) ? (i = R, "value" in R ? (R.status === "success" ? A(i, R.value, void 0, p) : A(i, void 0, fn(R.value), p), R) : (f = !0, queueMicrotask(() => f = !1), pe(() => {
      B(a ? "refreshing" : "pending"), _();
    }, !1), R.then(
      (T) => A(R, T, void 0, p),
      (T) => A(R, void 0, fn(T), p)
    ))) : (A(i, R, void 0, p), R);
  }
  Object.defineProperties(H, {
    state: {
      get: () => S()
    },
    error: {
      get: () => g()
    },
    loading: {
      get() {
        const k = S();
        return k === "pending" || k === "refreshing";
      }
    },
    latest: {
      get() {
        if (!a) return H();
        const k = g();
        if (k && !i) throw k;
        return b();
      }
    }
  });
  let G = M;
  return d ? Tt(() => (G = M, J(!1))) : J(!1), [
    H,
    {
      refetch: (k) => Rn(G, () => J(k)),
      mutate: m
    }
  ];
}
function Dr(e) {
  return pe(e, !1);
}
function ce(e) {
  if (Q === null) return e();
  const t = Q;
  Q = null;
  try {
    return e();
  } finally {
    Q = t;
  }
}
function We(e, t, n) {
  const r = Array.isArray(e);
  let s, o = n && n.defer;
  return (i) => {
    let c;
    if (r) {
      c = Array(e.length);
      for (let u = 0; u < e.length; u++) c[u] = e[u]();
    } else c = e();
    if (o)
      return o = !1, i;
    const l = ce(() => t(c, s, i));
    return s = c, l;
  };
}
function Ln(e) {
  Te(() => ce(e));
}
function xe(e) {
  return M === null || (M.cleanups === null ? M.cleanups = [e] : M.cleanups.push(e)), e;
}
function qt() {
  return M;
}
function Rn(e, t) {
  const n = M, r = Q;
  M = e, Q = null;
  try {
    return pe(t, !0);
  } catch (s) {
    In(s);
  } finally {
    M = n, Q = r;
  }
}
function Zs(e) {
  if (x && x.running)
    return e(), x.done;
  const t = Q, n = M;
  return Promise.resolve().then(() => {
    Q = t, M = n;
    let r;
    return Fe && (r = x || (x = {
      sources: /* @__PURE__ */ new Set(),
      effects: [],
      promises: /* @__PURE__ */ new Set(),
      disposed: /* @__PURE__ */ new Set(),
      queue: /* @__PURE__ */ new Set(),
      running: !0
    }), r.done || (r.done = new Promise((s) => r.resolve = s)), r.running = !0), pe(e, !1), Q = M = null, r ? r.done : void 0;
  });
}
const [Na, Xn] = /* @__PURE__ */ $(!1);
function eo(e) {
  ae.push.apply(ae, e), e.length = 0;
}
function ut(e, t) {
  const n = Symbol("context");
  return {
    id: n,
    Provider: so(n),
    defaultValue: e
  };
}
function De(e) {
  let t;
  return M && M.context && (t = M.context[e.id]) !== void 0 ? t : e.defaultValue;
}
function jt(e) {
  const t = Y(e), n = Y(() => dn(t()));
  return n.toArray = () => {
    const r = n();
    return Array.isArray(r) ? r : r != null ? [r] : [];
  }, n;
}
let Fe;
function to() {
  return Fe || (Fe = ut());
}
function qr() {
  const e = x && x.running;
  if (this.sources && (e ? this.tState : this.state))
    if ((e ? this.tState : this.state) === we) Qe(this);
    else {
      const t = ue;
      ue = null, pe(() => Pt(this), !1), ue = t;
    }
  if (Q) {
    const t = this.observers ? this.observers.length : 0;
    Q.sources ? (Q.sources.push(this), Q.sourceSlots.push(t)) : (Q.sources = [this], Q.sourceSlots = [t]), this.observers ? (this.observers.push(Q), this.observerSlots.push(Q.sources.length - 1)) : (this.observers = [Q], this.observerSlots = [Q.sources.length - 1]);
  }
  return e && x.sources.has(this) ? this.tValue : this.value;
}
function jr(e, t, n) {
  let r = x && x.running && x.sources.has(e) ? e.tValue : e.value;
  if (!e.comparator || !e.comparator(r, t)) {
    if (x) {
      const s = x.running;
      (s || !n && x.sources.has(e)) && (x.sources.add(e), e.tValue = t), s || (e.value = t);
    } else e.value = t;
    e.observers && e.observers.length && pe(() => {
      for (let s = 0; s < e.observers.length; s += 1) {
        const o = e.observers[s], i = x && x.running;
        i && x.disposed.has(o) || ((i ? !o.tState : !o.state) && (o.pure ? ue.push(o) : ae.push(o), o.observers && Vr(o)), i ? o.tState = we : o.state = we);
      }
      if (ue.length > 1e6)
        throw ue = [], new Error();
    }, !1);
  }
  return t;
}
function Qe(e) {
  if (!e.fn) return;
  Be(e);
  const t = Dt;
  Zn(
    e,
    x && x.running && x.sources.has(e) ? e.tValue : e.value,
    t
  ), x && !x.running && x.sources.has(e) && queueMicrotask(() => {
    pe(() => {
      x && (x.running = !0), Q = M = e, Zn(e, e.tValue, t), Q = M = null;
    }, !1);
  });
}
function Zn(e, t, n) {
  let r;
  const s = M, o = Q;
  Q = M = e;
  try {
    r = e.fn(t);
  } catch (i) {
    return e.pure && (x && x.running ? (e.tState = we, e.tOwned && e.tOwned.forEach(Be), e.tOwned = void 0) : (e.state = we, e.owned && e.owned.forEach(Be), e.owned = null)), e.updatedAt = n + 1, In(i);
  } finally {
    Q = o, M = s;
  }
  (!e.updatedAt || e.updatedAt <= n) && (e.updatedAt != null && "observers" in e ? jr(e, r, !0) : x && x.running && e.pure ? (x.sources.add(e), e.tValue = r) : e.value = r, e.updatedAt = n);
}
function Ut(e, t, n, r = we, s) {
  const o = {
    fn: e,
    state: r,
    updatedAt: null,
    owned: null,
    sources: null,
    sourceSlots: null,
    cleanups: null,
    value: t,
    owner: M,
    context: M ? M.context : null,
    pure: n
  };
  return x && x.running && (o.state = 0, o.tState = r), M === null || M !== Fr && (x && x.running && M.pure ? M.tOwned ? M.tOwned.push(o) : M.tOwned = [o] : M.owned ? M.owned.push(o) : M.owned = [o]), o;
}
function Bt(e) {
  const t = x && x.running;
  if ((t ? e.tState : e.state) === 0) return;
  if ((t ? e.tState : e.state) === ot) return Pt(e);
  if (e.suspense && ce(e.suspense.inFallback)) return e.suspense.effects.push(e);
  const n = [e];
  for (; (e = e.owner) && (!e.updatedAt || e.updatedAt < Dt); ) {
    if (t && x.disposed.has(e)) return;
    (t ? e.tState : e.state) && n.push(e);
  }
  for (let r = n.length - 1; r >= 0; r--) {
    if (e = n[r], t) {
      let s = e, o = n[r + 1];
      for (; (s = s.owner) && s !== o; )
        if (x.disposed.has(s)) return;
    }
    if ((t ? e.tState : e.state) === we)
      Qe(e);
    else if ((t ? e.tState : e.state) === ot) {
      const s = ue;
      ue = null, pe(() => Pt(e, n[0]), !1), ue = s;
    }
  }
}
function pe(e, t) {
  if (ue) return e();
  let n = !1;
  t || (ue = []), ae ? n = !0 : ae = [], Dt++;
  try {
    const r = e();
    return no(n), r;
  } catch (r) {
    n || (ae = null), ue = null, In(r);
  }
}
function no(e) {
  if (ue && (Ur(ue), ue = null), e) return;
  let t;
  if (x) {
    if (!x.promises.size && !x.queue.size) {
      const r = x.sources, s = x.disposed;
      ae.push.apply(ae, x.effects), t = x.resolve;
      for (const o of ae)
        "tState" in o && (o.state = o.tState), delete o.tState;
      x = null, pe(() => {
        for (const o of s) Be(o);
        for (const o of r) {
          if (o.value = o.tValue, o.owned)
            for (let i = 0, c = o.owned.length; i < c; i++) Be(o.owned[i]);
          o.tOwned && (o.owned = o.tOwned), delete o.tValue, delete o.tOwned, o.tState = 0;
        }
        Xn(!1);
      }, !1);
    } else if (x.running) {
      x.running = !1, x.effects.push.apply(x.effects, ae), ae = null, Xn(!0);
      return;
    }
  }
  const n = ae;
  ae = null, n.length && pe(() => Nr(n), !1), t && t();
}
function Ur(e) {
  for (let t = 0; t < e.length; t++) Bt(e[t]);
}
function ro(e) {
  let t, n = 0;
  for (t = 0; t < e.length; t++) {
    const r = e[t];
    r.user ? e[n++] = r : Bt(r);
  }
  if (I.context) {
    if (I.count) {
      I.effects || (I.effects = []), I.effects.push(...e.slice(0, n));
      return;
    }
    tt();
  }
  for (I.effects && (I.done || !I.count) && (e = [...I.effects, ...e], n += I.effects.length, delete I.effects), t = 0; t < n; t++) Bt(e[t]);
}
function Pt(e, t) {
  const n = x && x.running;
  n ? e.tState = 0 : e.state = 0;
  for (let r = 0; r < e.sources.length; r += 1) {
    const s = e.sources[r];
    if (s.sources) {
      const o = n ? s.tState : s.state;
      o === we ? s !== t && (!s.updatedAt || s.updatedAt < Dt) && Bt(s) : o === ot && Pt(s, t);
    }
  }
}
function Vr(e) {
  const t = x && x.running;
  for (let n = 0; n < e.observers.length; n += 1) {
    const r = e.observers[n];
    (t ? !r.tState : !r.state) && (t ? r.tState = ot : r.state = ot, r.pure ? ue.push(r) : ae.push(r), r.observers && Vr(r));
  }
}
function Be(e) {
  let t;
  if (e.sources)
    for (; e.sources.length; ) {
      const n = e.sources.pop(), r = e.sourceSlots.pop(), s = n.observers;
      if (s && s.length) {
        const o = s.pop(), i = n.observerSlots.pop();
        r < s.length && (o.sourceSlots[i] = r, s[r] = o, n.observerSlots[r] = i);
      }
    }
  if (e.tOwned) {
    for (t = e.tOwned.length - 1; t >= 0; t--) Be(e.tOwned[t]);
    delete e.tOwned;
  }
  if (x && x.running && e.pure)
    Kr(e, !0);
  else if (e.owned) {
    for (t = e.owned.length - 1; t >= 0; t--) Be(e.owned[t]);
    e.owned = null;
  }
  if (e.cleanups) {
    for (t = e.cleanups.length - 1; t >= 0; t--) e.cleanups[t]();
    e.cleanups = null;
  }
  x && x.running ? e.tState = 0 : e.state = 0;
}
function Kr(e, t) {
  if (t || (e.tState = 0, x.disposed.add(e)), e.owned)
    for (let n = 0; n < e.owned.length; n++) Kr(e.owned[n]);
}
function fn(e) {
  return e instanceof Error ? e : new Error(typeof e == "string" ? e : "Unknown error", {
    cause: e
  });
}
function In(e, t = M) {
  throw fn(e);
}
function dn(e) {
  if (typeof e == "function" && !e.length) return dn(e());
  if (Array.isArray(e)) {
    const t = [];
    for (let n = 0; n < e.length; n++) {
      const r = dn(e[n]);
      Array.isArray(r) ? t.push.apply(t, r) : t.push(r);
    }
    return t;
  }
  return e;
}
function so(e, t) {
  return function(r) {
    let s;
    return oe(
      () => s = ce(() => (M.context = {
        ...M.context,
        [e]: r.value
      }, jt(() => r.children))),
      void 0
    ), s;
  };
}
const oo = Symbol("fallback");
function er(e) {
  for (let t = 0; t < e.length; t++) e[t]();
}
function io(e, t, n = {}) {
  let r = [], s = [], o = [], i = 0, c = t.length > 1 ? [] : null;
  return xe(() => er(o)), () => {
    let l = e() || [], u = l.length, f, a;
    return l[Js], ce(() => {
      let h, b, m, g, E, w, _, S, B;
      if (u === 0)
        i !== 0 && (er(o), o = [], r = [], s = [], i = 0, c && (c = [])), n.fallback && (r = [oo], s[0] = Me((A) => (o[0] = A, n.fallback())), i = 1);
      else if (i === 0) {
        for (s = new Array(u), a = 0; a < u; a++)
          r[a] = l[a], s[a] = Me(d);
        i = u;
      } else {
        for (m = new Array(u), g = new Array(u), c && (E = new Array(u)), w = 0, _ = Math.min(i, u); w < _ && r[w] === l[w]; w++) ;
        for (_ = i - 1, S = u - 1; _ >= w && S >= w && r[_] === l[S]; _--, S--)
          m[S] = s[_], g[S] = o[_], c && (E[S] = c[_]);
        for (h = /* @__PURE__ */ new Map(), b = new Array(S + 1), a = S; a >= w; a--)
          B = l[a], f = h.get(B), b[a] = f === void 0 ? -1 : f, h.set(B, a);
        for (f = w; f <= _; f++)
          B = r[f], a = h.get(B), a !== void 0 && a !== -1 ? (m[a] = s[f], g[a] = o[f], c && (E[a] = c[f]), a = b[a], h.set(B, a)) : o[f]();
        for (a = w; a < u; a++)
          a in m ? (s[a] = m[a], o[a] = g[a], c && (c[a] = E[a], c[a](a))) : s[a] = Me(d);
        s = s.slice(0, i = u), r = l.slice(0);
      }
      return s;
    });
    function d(h) {
      if (o[a] = h, c) {
        const [b, m] = $(a);
        return c[a] = m, t(l[a], b);
      }
      return t(l[a]);
    }
  };
}
function C(e, t) {
  return ce(() => e(t || {}));
}
function mt() {
  return !0;
}
const hn = {
  get(e, t, n) {
    return t === Ct ? n : e.get(t);
  },
  has(e, t) {
    return t === Ct ? !0 : e.has(t);
  },
  set: mt,
  deleteProperty: mt,
  getOwnPropertyDescriptor(e, t) {
    return {
      configurable: !0,
      enumerable: !0,
      get() {
        return e.get(t);
      },
      set: mt,
      deleteProperty: mt
    };
  },
  ownKeys(e) {
    return e.keys();
  }
};
function Yt(e) {
  return (e = typeof e == "function" ? e() : e) ? e : {};
}
function co() {
  for (let e = 0, t = this.length; e < t; ++e) {
    const n = this[e]();
    if (n !== void 0) return n;
  }
}
function it(...e) {
  let t = !1;
  for (let i = 0; i < e.length; i++) {
    const c = e[i];
    t = t || !!c && Ct in c, e[i] = typeof c == "function" ? (t = !0, Y(c)) : c;
  }
  if (Mr && t)
    return new Proxy(
      {
        get(i) {
          for (let c = e.length - 1; c >= 0; c--) {
            const l = Yt(e[c])[i];
            if (l !== void 0) return l;
          }
        },
        has(i) {
          for (let c = e.length - 1; c >= 0; c--)
            if (i in Yt(e[c])) return !0;
          return !1;
        },
        keys() {
          const i = [];
          for (let c = 0; c < e.length; c++)
            i.push(...Object.keys(Yt(e[c])));
          return [...new Set(i)];
        }
      },
      hn
    );
  const n = {}, r = /* @__PURE__ */ Object.create(null);
  for (let i = e.length - 1; i >= 0; i--) {
    const c = e[i];
    if (!c) continue;
    const l = Object.getOwnPropertyNames(c);
    for (let u = l.length - 1; u >= 0; u--) {
      const f = l[u];
      if (f === "__proto__" || f === "constructor") continue;
      const a = Object.getOwnPropertyDescriptor(c, f);
      if (!r[f])
        r[f] = a.get ? {
          enumerable: !0,
          configurable: !0,
          get: co.bind(n[f] = [a.get.bind(c)])
        } : a.value !== void 0 ? a : void 0;
      else {
        const d = n[f];
        d && (a.get ? d.push(a.get.bind(c)) : a.value !== void 0 && d.push(() => a.value));
      }
    }
  }
  const s = {}, o = Object.keys(r);
  for (let i = o.length - 1; i >= 0; i--) {
    const c = o[i], l = r[c];
    l && l.get ? Object.defineProperty(s, c, l) : s[c] = l ? l.value : void 0;
  }
  return s;
}
function Wr(e, ...t) {
  if (Mr && Ct in e) {
    const s = new Set(t.length > 1 ? t.flat() : t[0]), o = t.map((i) => new Proxy(
      {
        get(c) {
          return i.includes(c) ? e[c] : void 0;
        },
        has(c) {
          return i.includes(c) && c in e;
        },
        keys() {
          return i.filter((c) => c in e);
        }
      },
      hn
    ));
    return o.push(
      new Proxy(
        {
          get(i) {
            return s.has(i) ? void 0 : e[i];
          },
          has(i) {
            return s.has(i) ? !1 : i in e;
          },
          keys() {
            return Object.keys(e).filter((i) => !s.has(i));
          }
        },
        hn
      )
    ), o;
  }
  const n = {}, r = t.map(() => ({}));
  for (const s of Object.getOwnPropertyNames(e)) {
    const o = Object.getOwnPropertyDescriptor(e, s), i = !o.get && !o.set && o.enumerable && o.writable && o.configurable;
    let c = !1, l = 0;
    for (const u of t)
      u.includes(s) && (c = !0, i ? r[l][s] = o.value : Object.defineProperty(r[l], s, o)), ++l;
    c || (i ? n[s] = o.value : Object.defineProperty(n, s, o));
  }
  return [...r, n];
}
let lo = 0;
function ao() {
  return I.context ? I.getNextContextId() : `cl-${lo++}`;
}
const uo = (e) => `Stale read from <${e}>.`;
function tr(e) {
  const t = "fallback" in e && {
    fallback: () => e.fallback
  };
  return Y(io(() => e.each, e.children, t || void 0));
}
function $e(e) {
  const t = e.keyed, n = Y(() => e.when, void 0, void 0), r = t ? n : Y(n, void 0, {
    equals: (s, o) => !s == !o
  });
  return Y(
    () => {
      const s = r();
      if (s) {
        const o = e.children;
        return typeof o == "function" && o.length > 0 ? ce(
          () => o(
            t ? s : () => {
              if (!ce(r)) throw uo("Show");
              return n();
            }
          )
        ) : o;
      }
      return e.fallback;
    },
    void 0,
    void 0
  );
}
const fo = /* @__PURE__ */ ut();
function ho(e) {
  let t = 0, n, r, s, o, i;
  const [c, l] = $(!1), u = to(), f = {
    increment: () => {
      ++t === 1 && l(!0);
    },
    decrement: () => {
      --t === 0 && l(!1);
    },
    inFallback: c,
    effects: [],
    resolved: !1
  }, a = qt();
  if (I.context && I.load) {
    const b = I.getContextId();
    let m = I.load(b);
    if (m && (typeof m != "object" || m.status !== "success" ? s = m : I.gather(b)), s && s !== "$$f") {
      const [g, E] = $(void 0, {
        equals: !1
      });
      o = g, s.then(
        () => {
          if (I.done) return E();
          I.gather(b), tt(r), E(), tt();
        },
        (w) => {
          i = w, E();
        }
      );
    }
  }
  const d = De(fo);
  d && (n = d.register(f.inFallback));
  let h;
  return xe(() => h && h()), C(u.Provider, {
    value: f,
    get children() {
      return Y(() => {
        if (i) throw i;
        if (r = I.context, o)
          return o(), o = void 0;
        r && s === "$$f" && tt();
        const b = Y(() => e.children);
        return Y((m) => {
          const g = f.inFallback(), { showContent: E = !0, showFallback: w = !0 } = n ? n() : {};
          if ((!g || s && s !== "$$f") && E)
            return f.resolved = !0, h && h(), h = r = s = void 0, eo(f.effects), b();
          if (w)
            return h ? m : Me((_) => (h = _, r && (tt({
              id: r.id + "F",
              count: 0
            }), r = void 0), e.fallback), a);
        });
      });
    }
  });
}
const po = [
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
], mo = /* @__PURE__ */ new Set([
  "className",
  "value",
  "readOnly",
  "noValidate",
  "formNoValidate",
  "isMap",
  "noModule",
  "playsInline",
  ...po
]), go = /* @__PURE__ */ new Set([
  "innerHTML",
  "textContent",
  "innerText",
  "children"
]), yo = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(null), {
  className: "class",
  htmlFor: "for"
}), bo = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(null), {
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
function vo(e, t) {
  const n = bo[e];
  return typeof n == "object" ? n[t] ? n.$ : void 0 : n;
}
const wo = /* @__PURE__ */ new Set([
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
]), Eo = {
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace"
}, Lt = (e) => Y(() => e());
function xo(e, t, n) {
  let r = n.length, s = t.length, o = r, i = 0, c = 0, l = t[s - 1].nextSibling, u = null;
  for (; i < s || c < o; ) {
    if (t[i] === n[c]) {
      i++, c++;
      continue;
    }
    for (; t[s - 1] === n[o - 1]; )
      s--, o--;
    if (s === i) {
      const f = o < r ? c ? n[c - 1].nextSibling : n[o - c] : l;
      for (; c < o; ) e.insertBefore(n[c++], f);
    } else if (o === c)
      for (; i < s; )
        (!u || !u.has(t[i])) && t[i].remove(), i++;
    else if (t[i] === n[o - 1] && n[c] === t[s - 1]) {
      const f = t[--s].nextSibling;
      e.insertBefore(n[c++], t[i++].nextSibling), e.insertBefore(n[--o], f), t[s] = n[o];
    } else {
      if (!u) {
        u = /* @__PURE__ */ new Map();
        let a = c;
        for (; a < o; ) u.set(n[a], a++);
      }
      const f = u.get(t[i]);
      if (f != null)
        if (c < f && f < o) {
          let a = i, d = 1, h;
          for (; ++a < s && a < o && !((h = u.get(t[a])) == null || h !== f + d); )
            d++;
          if (d > f - c) {
            const b = t[i];
            for (; c < f; ) e.insertBefore(n[c++], b);
          } else e.replaceChild(n[c++], t[i++]);
        } else i++;
      else t[i++].remove();
    }
  }
}
const nr = "_$DX_DELEGATE";
function _o(e, t, n, r = {}) {
  let s;
  return Me((o) => {
    s = o, t === document ? e() : K(t, e(), t.firstChild ? null : void 0, n);
  }, r.owner), () => {
    s(), t.textContent = "";
  };
}
function F(e, t, n, r) {
  let s;
  const o = () => {
    const c = r ? document.createElementNS("http://www.w3.org/1998/Math/MathML", "template") : document.createElement("template");
    return c.innerHTML = e, n ? c.content.firstChild.firstChild : r ? c.firstChild : c.content.firstChild;
  }, i = t ? () => ce(() => document.importNode(s || (s = o()), !0)) : () => (s || (s = o())).cloneNode(!0);
  return i.cloneNode = i, i;
}
function Pe(e, t = window.document) {
  const n = t[nr] || (t[nr] = /* @__PURE__ */ new Set());
  for (let r = 0, s = e.length; r < s; r++) {
    const o = e[r];
    n.has(o) || (n.add(o), t.addEventListener(o, To));
  }
}
function te(e, t, n) {
  Je(e) || (n == null ? e.removeAttribute(t) : e.setAttribute(t, n));
}
function ko(e, t, n, r) {
  Je(e) || (r == null ? e.removeAttributeNS(t, n) : e.setAttributeNS(t, n, r));
}
function So(e, t, n) {
  Je(e) || (n ? e.setAttribute(t, "") : e.removeAttribute(t));
}
function He(e, t) {
  Je(e) || (t == null ? e.removeAttribute("class") : e.className = t);
}
function Ve(e, t, n, r) {
  if (r)
    Array.isArray(n) ? (e[`$$${t}`] = n[0], e[`$$${t}Data`] = n[1]) : e[`$$${t}`] = n;
  else if (Array.isArray(n)) {
    const s = n[0];
    e.addEventListener(t, n[0] = (o) => s.call(e, n[1], o));
  } else e.addEventListener(t, n, typeof n != "function" && n);
}
function Rt(e, t, n = {}) {
  const r = Object.keys(t || {}), s = Object.keys(n);
  let o, i;
  for (o = 0, i = s.length; o < i; o++) {
    const c = s[o];
    !c || c === "undefined" || t[c] || (rr(e, c, !1), delete n[c]);
  }
  for (o = 0, i = r.length; o < i; o++) {
    const c = r[o], l = !!t[c];
    !c || c === "undefined" || n[c] === l || !l || (rr(e, c, !0), n[c] = l);
  }
  return n;
}
function Ao(e, t, n) {
  if (!t) return n ? te(e, "style") : t;
  const r = e.style;
  if (typeof t == "string") return r.cssText = t;
  typeof n == "string" && (r.cssText = n = void 0), n || (n = {}), t || (t = {});
  let s, o;
  for (o in n)
    t[o] == null && r.removeProperty(o), delete n[o];
  for (o in t)
    s = t[o], s !== n[o] && (r.setProperty(o, s), n[o] = s);
  return n;
}
function $n(e, t = {}, n, r) {
  const s = {};
  return r || oe(
    () => s.children = ct(e, t.children, s.children)
  ), oe(() => typeof t.ref == "function" && ke(t.ref, e)), oe(() => Co(e, t, n, !0, s, !0)), s;
}
function ke(e, t, n) {
  return ce(() => e(t, n));
}
function K(e, t, n, r) {
  if (n !== void 0 && !r && (r = []), typeof t != "function") return ct(e, t, r, n);
  oe((s) => ct(e, t(), s, n), r);
}
function Co(e, t, n, r, s = {}, o = !1) {
  t || (t = {});
  for (const i in s)
    if (!(i in t)) {
      if (i === "children") continue;
      s[i] = sr(e, i, null, s[i], n, o, t);
    }
  for (const i in t) {
    if (i === "children")
      continue;
    const c = t[i];
    s[i] = sr(e, i, c, s[i], n, o, t);
  }
}
function Je(e) {
  return !!I.context && !I.done && (!e || e.isConnected);
}
function Oo(e) {
  return e.toLowerCase().replace(/-([a-z])/g, (t, n) => n.toUpperCase());
}
function rr(e, t, n) {
  const r = t.trim().split(/\s+/);
  for (let s = 0, o = r.length; s < o; s++)
    e.classList.toggle(r[s], n);
}
function sr(e, t, n, r, s, o, i) {
  let c, l, u, f, a;
  if (t === "style") return Ao(e, n, r);
  if (t === "classList") return Rt(e, n, r);
  if (n === r) return r;
  if (t === "ref")
    o || n(e);
  else if (t.slice(0, 3) === "on:") {
    const d = t.slice(3);
    r && e.removeEventListener(d, r, typeof r != "function" && r), n && e.addEventListener(d, n, typeof n != "function" && n);
  } else if (t.slice(0, 10) === "oncapture:") {
    const d = t.slice(10);
    r && e.removeEventListener(d, r, !0), n && e.addEventListener(d, n, !0);
  } else if (t.slice(0, 2) === "on") {
    const d = t.slice(2).toLowerCase(), h = wo.has(d);
    if (!h && r) {
      const b = Array.isArray(r) ? r[0] : r;
      e.removeEventListener(d, b);
    }
    (h || n) && (Ve(e, d, n, h), h && Pe([d]));
  } else if (t.slice(0, 5) === "attr:")
    te(e, t.slice(5), n);
  else if (t.slice(0, 5) === "bool:")
    So(e, t.slice(5), n);
  else if ((a = t.slice(0, 5) === "prop:") || (u = go.has(t)) || !s && ((f = vo(t, e.tagName)) || (l = mo.has(t))) || (c = e.nodeName.includes("-") || "is" in i)) {
    if (a)
      t = t.slice(5), l = !0;
    else if (Je(e)) return n;
    t === "class" || t === "className" ? He(e, n) : c && !l && !u ? e[Oo(t)] = n : e[f || t] = n;
  } else {
    const d = s && t.indexOf(":") > -1 && Eo[t.split(":")[0]];
    d ? ko(e, d, t, n) : te(e, yo[t] || t, n);
  }
  return n;
}
function To(e) {
  if (I.registry && I.events && I.events.find(([l, u]) => u === e))
    return;
  let t = e.target;
  const n = `$$${e.type}`, r = e.target, s = e.currentTarget, o = (l) => Object.defineProperty(e, "target", {
    configurable: !0,
    value: l
  }), i = () => {
    const l = t[n];
    if (l && !t.disabled) {
      const u = t[`${n}Data`];
      if (u !== void 0 ? l.call(t, u, e) : l.call(t, e), e.cancelBubble) return;
    }
    return t.host && typeof t.host != "string" && !t.host._$host && t.contains(e.target) && o(t.host), !0;
  }, c = () => {
    for (; i() && (t = t._$host || t.parentNode || t.host); ) ;
  };
  if (Object.defineProperty(e, "currentTarget", {
    configurable: !0,
    get() {
      return t || document;
    }
  }), I.registry && !I.done && (I.done = _$HY.done = !0), e.composedPath) {
    const l = e.composedPath();
    o(l[0]);
    for (let u = 0; u < l.length - 2 && (t = l[u], !!i()); u++) {
      if (t._$host) {
        t = t._$host, c();
        break;
      }
      if (t.parentNode === s)
        break;
    }
  } else c();
  o(r);
}
function ct(e, t, n, r, s) {
  const o = Je(e);
  if (o) {
    !n && (n = [...e.childNodes]);
    let l = [];
    for (let u = 0; u < n.length; u++) {
      const f = n[u];
      f.nodeType === 8 && f.data.slice(0, 2) === "!$" ? f.remove() : l.push(f);
    }
    n = l;
  }
  for (; typeof n == "function"; ) n = n();
  if (t === n) return n;
  const i = typeof t, c = r !== void 0;
  if (e = c && n[0] && n[0].parentNode || e, i === "string" || i === "number") {
    if (o || i === "number" && (t = t.toString(), t === n))
      return n;
    if (c) {
      let l = n[0];
      l && l.nodeType === 3 ? l.data !== t && (l.data = t) : l = document.createTextNode(t), n = je(e, n, r, l);
    } else
      n !== "" && typeof n == "string" ? n = e.firstChild.data = t : n = e.textContent = t;
  } else if (t == null || i === "boolean") {
    if (o) return n;
    n = je(e, n, r);
  } else {
    if (i === "function")
      return oe(() => {
        let l = t();
        for (; typeof l == "function"; ) l = l();
        n = ct(e, l, n, r);
      }), () => n;
    if (Array.isArray(t)) {
      const l = [], u = n && Array.isArray(n);
      if (pn(l, t, n, s))
        return oe(() => n = ct(e, l, n, r, !0)), () => n;
      if (o) {
        if (!l.length) return n;
        if (r === void 0) return n = [...e.childNodes];
        let f = l[0];
        if (f.parentNode !== e) return n;
        const a = [f];
        for (; (f = f.nextSibling) !== r; ) a.push(f);
        return n = a;
      }
      if (l.length === 0) {
        if (n = je(e, n, r), c) return n;
      } else u ? n.length === 0 ? or(e, l, r) : xo(e, n, l) : (n && je(e), or(e, l));
      n = l;
    } else if (t.nodeType) {
      if (o && t.parentNode) return n = c ? [t] : t;
      if (Array.isArray(n)) {
        if (c) return n = je(e, n, r, t);
        je(e, n, null, t);
      } else n == null || n === "" || !e.firstChild ? e.appendChild(t) : e.replaceChild(t, e.firstChild);
      n = t;
    }
  }
  return n;
}
function pn(e, t, n, r) {
  let s = !1;
  for (let o = 0, i = t.length; o < i; o++) {
    let c = t[o], l = n && n[e.length], u;
    if (!(c == null || c === !0 || c === !1)) if ((u = typeof c) == "object" && c.nodeType)
      e.push(c);
    else if (Array.isArray(c))
      s = pn(e, c, l) || s;
    else if (u === "function")
      if (r) {
        for (; typeof c == "function"; ) c = c();
        s = pn(
          e,
          Array.isArray(c) ? c : [c],
          Array.isArray(l) ? l : [l]
        ) || s;
      } else
        e.push(c), s = !0;
    else {
      const f = String(c);
      l && l.nodeType === 3 && l.data === f ? e.push(l) : e.push(document.createTextNode(f));
    }
  }
  return s;
}
function or(e, t, n = null) {
  for (let r = 0, s = t.length; r < s; r++) e.insertBefore(t[r], n);
}
function je(e, t, n, r) {
  if (n === void 0) return e.textContent = "";
  const s = r || document.createTextNode("");
  if (t.length) {
    let o = !1;
    for (let i = t.length - 1; i >= 0; i--) {
      const c = t[i];
      if (s !== c) {
        const l = c.parentNode === e;
        !o && !i ? l ? e.replaceChild(s, c) : e.insertBefore(s, n) : l && c.remove();
      } else o = !0;
    }
  } else e.insertBefore(s, n);
  return [s];
}
const Hr = !1;
function zr() {
  let e = /* @__PURE__ */ new Set();
  function t(s) {
    return e.add(s), () => e.delete(s);
  }
  let n = !1;
  function r(s, o) {
    if (n)
      return !(n = !1);
    const i = {
      to: s,
      options: o,
      defaultPrevented: !1,
      preventDefault: () => i.defaultPrevented = !0
    };
    for (const c of e)
      c.listener({
        ...i,
        from: c.location,
        retry: (l) => {
          l && (n = !0), c.navigate(s, { ...o, resolve: !1 });
        }
      });
    return !i.defaultPrevented;
  }
  return {
    subscribe: t,
    confirm: r
  };
}
let mn;
function Mn() {
  (!window.history.state || window.history.state._depth == null) && window.history.replaceState({ ...window.history.state, _depth: window.history.length - 1 }, ""), mn = window.history.state._depth;
}
Mn();
function Bo(e) {
  return {
    ...e,
    _depth: window.history.state && window.history.state._depth
  };
}
function Po(e, t) {
  let n = !1;
  return () => {
    const r = mn;
    Mn();
    const s = r == null ? null : mn - r;
    if (n) {
      n = !1;
      return;
    }
    s && t(s) ? (n = !0, window.history.go(-s)) : e();
  };
}
const Lo = /^(?:[a-z0-9]+:)?\/\//i, Ro = /^\/+|(\/)\/+$/g, Qr = "http://sr";
function Ne(e, t = !1) {
  const n = e.replace(Ro, "$1");
  return n ? t || /^[?#]/.test(n) ? n : "/" + n : "";
}
function vt(e, t, n) {
  if (Lo.test(t))
    return;
  const r = Ne(e), s = n && Ne(n);
  let o = "";
  return !s || t.startsWith("/") ? o = r : s.toLowerCase().indexOf(r.toLowerCase()) !== 0 ? o = r + s : o = s, (o || "/") + Ne(t, !o);
}
function Io(e, t) {
  if (e == null)
    throw new Error(t);
  return e;
}
function $o(e, t) {
  return Ne(e).replace(/\/*(\*.*)?$/g, "") + Ne(t);
}
function Jr(e) {
  const t = {};
  return e.searchParams.forEach((n, r) => {
    r in t ? Array.isArray(t[r]) ? t[r].push(n) : t[r] = [t[r], n] : t[r] = n;
  }), t;
}
function Mo(e, t, n) {
  const [r, s] = e.split("/*", 2), o = r.split("/").filter(Boolean), i = o.length;
  return (c) => {
    const l = c.split("/").filter(Boolean), u = l.length - i;
    if (u < 0 || u > 0 && s === void 0 && !t)
      return null;
    const f = {
      path: i ? "" : "/",
      params: {}
    }, a = (d) => n === void 0 ? void 0 : n[d];
    for (let d = 0; d < i; d++) {
      const h = o[d], b = h[0] === ":", m = b ? l[d] : l[d].toLowerCase(), g = b ? h.slice(1) : h.toLowerCase();
      if (b && Xt(m, a(g)))
        f.params[g] = m;
      else if (b || !Xt(m, g))
        return null;
      f.path += `/${m}`;
    }
    if (s) {
      const d = u ? l.slice(-u).join("/") : "";
      if (Xt(d, a(s)))
        f.params[s] = d;
      else
        return null;
    }
    return f;
  };
}
function Xt(e, t) {
  const n = (r) => r === e;
  return t === void 0 ? !0 : typeof t == "string" ? n(t) : typeof t == "function" ? t(e) : Array.isArray(t) ? t.some(n) : t instanceof RegExp ? t.test(e) : !1;
}
function No(e) {
  const [t, n] = e.pattern.split("/*", 2), r = t.split("/").filter(Boolean);
  return r.reduce((s, o) => s + (o.startsWith(":") ? 2 : 3), r.length - (n === void 0 ? 0 : 1));
}
function Gr(e) {
  const t = /* @__PURE__ */ new Map(), n = qt();
  return new Proxy({}, {
    get(r, s) {
      return t.has(s) || Rn(n, () => t.set(s, Y(() => e()[s]))), t.get(s)();
    },
    getOwnPropertyDescriptor() {
      return {
        enumerable: !0,
        configurable: !0
      };
    },
    ownKeys() {
      return Reflect.ownKeys(e());
    }
  });
}
function Fo(e, t) {
  const n = new URLSearchParams(e);
  Object.entries(t).forEach(([s, o]) => {
    o == null || o === "" || o instanceof Array && !o.length ? n.delete(s) : o instanceof Array ? (n.delete(s), o.forEach((i) => {
      n.append(s, String(i));
    })) : n.set(s, String(o));
  });
  const r = n.toString();
  return r ? `?${r}` : "";
}
function Yr(e) {
  let t = /(\/?\:[^\/]+)\?/.exec(e);
  if (!t)
    return [e];
  let n = e.slice(0, t.index), r = e.slice(t.index + t[0].length);
  const s = [n, n += t[1]];
  for (; t = /^(\/\:[^\/]+)\?/.exec(r); )
    s.push(n += t[1]), r = r.slice(t[0].length);
  return Yr(r).reduce((o, i) => [...o, ...s.map((c) => c + i)], []);
}
const Do = 100, Xr = ut(), Nn = ut(), ft = () => Io(De(Xr), "<A> and 'use' router primitives can be only used inside a Route."), qo = () => De(Nn) || ft().base, jo = (e) => {
  const t = qo();
  return Y(() => t.resolvePath(e()));
}, Uo = (e) => {
  const t = ft();
  return Y(() => {
    const n = e();
    return n !== void 0 ? t.renderPath(n) : n;
  });
}, Ae = () => ft().navigatorFactory(), dt = () => ft().location, Fn = () => ft().params, Vo = () => {
  const e = dt(), t = Ae(), n = (r, s) => {
    const o = ce(() => Fo(e.search, r) + e.hash);
    t(o, {
      scroll: !1,
      resolve: !1,
      ...s
    });
  };
  return [e.query, n];
};
function Ko(e, t = "") {
  const { component: n, preload: r, load: s, children: o, info: i } = e, c = !o || Array.isArray(o) && !o.length, l = {
    key: e,
    component: n,
    preload: r || s,
    info: i
  };
  return Zr(e.path).reduce((u, f) => {
    for (const a of Yr(f)) {
      const d = $o(t, a);
      let h = c ? d : d.split("/*", 1)[0];
      h = h.split("/").map((b) => b.startsWith(":") || b.startsWith("*") ? b : encodeURIComponent(b)).join("/"), u.push({
        ...l,
        originalPath: f,
        pattern: h,
        matcher: Mo(h, !c, e.matchFilters)
      });
    }
    return u;
  }, []);
}
function Wo(e, t = 0) {
  return {
    routes: e,
    score: No(e[e.length - 1]) * 1e4 - t,
    matcher(n) {
      const r = [];
      for (let s = e.length - 1; s >= 0; s--) {
        const o = e[s], i = o.matcher(n);
        if (!i)
          return null;
        r.unshift({
          ...i,
          route: o
        });
      }
      return r;
    }
  };
}
function Zr(e) {
  return Array.isArray(e) ? e : [e];
}
function es(e, t = "", n = [], r = []) {
  const s = Zr(e);
  for (let o = 0, i = s.length; o < i; o++) {
    const c = s[o];
    if (c && typeof c == "object") {
      c.hasOwnProperty("path") || (c.path = "");
      const l = Ko(c, t);
      for (const u of l) {
        n.push(u);
        const f = Array.isArray(c.children) && c.children.length === 0;
        if (c.children && !f)
          es(c.children, u.pattern, n, r);
        else {
          const a = Wo([...n], r.length);
          r.push(a);
        }
        n.pop();
      }
    }
  }
  return n.length ? r : r.sort((o, i) => i.score - o.score);
}
function Zt(e, t) {
  for (let n = 0, r = e.length; n < r; n++) {
    const s = e[n].matcher(t);
    if (s)
      return s;
  }
  return [];
}
function Ho(e, t, n) {
  const r = new URL(Qr), s = Y((f) => {
    const a = e();
    try {
      return new URL(a, r);
    } catch {
      return console.error(`Invalid path ${a}`), f;
    }
  }, r, {
    equals: (f, a) => f.href === a.href
  }), o = Y(() => s().pathname), i = Y(() => s().search, !0), c = Y(() => s().hash), l = () => "", u = We(i, () => Jr(s()));
  return {
    get pathname() {
      return o();
    },
    get search() {
      return i();
    },
    get hash() {
      return c();
    },
    get state() {
      return t();
    },
    get key() {
      return l();
    },
    query: n ? n(u) : Gr(u)
  };
}
let Ie;
function zo() {
  return Ie;
}
function Qo(e, t, n, r = {}) {
  const { signal: [s, o], utils: i = {} } = e, c = i.parsePath || ((T) => T), l = i.renderPath || ((T) => T), u = i.beforeLeave || zr(), f = vt("", r.base || "");
  if (f === void 0)
    throw new Error(`${f} is not a valid base path`);
  f && !s().value && o({ value: f, replace: !0, scroll: !1 });
  const [a, d] = $(!1);
  let h;
  const b = (T, L) => {
    L.value === m() && L.state === E() || (h === void 0 && d(!0), Ie = T, h = L, Zs(() => {
      h === L && (g(h.value), w(h.state), B[1]((X) => X.filter((ie) => ie.pending)));
    }).finally(() => {
      h === L && Dr(() => {
        Ie = void 0, T === "navigate" && p(h), d(!1), h = void 0;
      });
    }));
  }, [m, g] = $(s().value), [E, w] = $(s().state), _ = Ho(m, E, i.queryWrapper), S = [], B = $([]), A = Y(() => typeof r.transformUrl == "function" ? Zt(t(), r.transformUrl(_.pathname)) : Zt(t(), _.pathname)), j = () => {
    const T = A(), L = {};
    for (let X = 0; X < T.length; X++)
      Object.assign(L, T[X].params);
    return L;
  }, H = i.paramsWrapper ? i.paramsWrapper(j, t) : Gr(j), J = {
    pattern: f,
    path: () => f,
    outlet: () => null,
    resolvePath(T) {
      return vt(f, T);
    }
  };
  return oe(We(s, (T) => b("native", T), { defer: !0 })), {
    base: J,
    location: _,
    params: H,
    isRouting: a,
    renderPath: l,
    parsePath: c,
    navigatorFactory: k,
    matches: A,
    beforeLeave: u,
    preloadRoute: R,
    singleFlight: r.singleFlight === void 0 ? !0 : r.singleFlight,
    submissions: B
  };
  function G(T, L, X) {
    ce(() => {
      if (typeof L == "number") {
        L && (i.go ? i.go(L) : console.warn("Router integration does not support relative routing"));
        return;
      }
      const ie = !L || L[0] === "?", { replace: D, resolve: W, scroll: ee, state: N } = {
        replace: !1,
        resolve: !ie,
        scroll: !0,
        ...X
      }, y = W ? T.resolvePath(L) : vt(ie && _.pathname || "", L);
      if (y === void 0)
        throw new Error(`Path '${L}' is not a routable path`);
      if (S.length >= Do)
        throw new Error("Too many redirects");
      const P = m();
      (y !== P || N !== E()) && (Hr || u.confirm(y, X) && (S.push({ value: P, replace: D, scroll: ee, state: E() }), b("navigate", {
        value: y,
        state: N
      })));
    });
  }
  function k(T) {
    return T = T || De(Nn) || J, (L, X) => G(T, L, X);
  }
  function p(T) {
    const L = S[0];
    L && (o({
      ...T,
      replace: L.replace,
      scroll: L.scroll
    }), S.length = 0);
  }
  function R(T, L) {
    const X = Zt(t(), T.pathname), ie = Ie;
    Ie = "preload";
    for (let D in X) {
      const { route: W, params: ee } = X[D];
      W.component && W.component.preload && W.component.preload();
      const { preload: N } = W;
      L && N && Rn(n(), () => N({
        params: ee,
        location: {
          pathname: T.pathname,
          search: T.search,
          hash: T.hash,
          query: Jr(T),
          state: null,
          key: ""
        },
        intent: "preload"
      }));
    }
    Ie = ie;
  }
}
function Jo(e, t, n, r) {
  const { base: s, location: o, params: i } = e, { pattern: c, component: l, preload: u } = r().route, f = Y(() => r().path);
  l && l.preload && l.preload();
  const a = u ? u({ params: i, location: o, intent: Ie || "initial" }) : void 0;
  return {
    parent: t,
    pattern: c,
    path: f,
    outlet: () => l ? C(l, {
      params: i,
      location: o,
      data: a,
      get children() {
        return n();
      }
    }) : n(),
    resolvePath(h) {
      return vt(s.path(), h, f());
    }
  };
}
const Go = (e) => (t) => {
  const {
    base: n
  } = t, r = jt(() => t.children), s = Y(() => es(r(), t.base || ""));
  let o;
  const i = Qo(e, s, () => o, {
    base: n,
    singleFlight: t.singleFlight,
    transformUrl: t.transformUrl
  });
  return e.create && e.create(i), C(Xr.Provider, {
    value: i,
    get children() {
      return C(Yo, {
        routerState: i,
        get root() {
          return t.root;
        },
        get preload() {
          return t.rootPreload || t.rootLoad;
        },
        get children() {
          return [Lt(() => (o = qt()) && null), C(Xo, {
            routerState: i,
            get branches() {
              return s();
            }
          })];
        }
      });
    }
  });
};
function Yo(e) {
  const t = e.routerState.location, n = e.routerState.params, r = Y(() => e.preload && ce(() => {
    e.preload({
      params: n,
      location: t,
      intent: zo() || "initial"
    });
  }));
  return C($e, {
    get when() {
      return e.root;
    },
    keyed: !0,
    get fallback() {
      return e.children;
    },
    children: (s) => C(s, {
      params: n,
      location: t,
      get data() {
        return r();
      },
      get children() {
        return e.children;
      }
    })
  });
}
function Xo(e) {
  const t = [];
  let n;
  const r = Y(We(e.routerState.matches, (s, o, i) => {
    let c = o && s.length === o.length;
    const l = [];
    for (let u = 0, f = s.length; u < f; u++) {
      const a = o && o[u], d = s[u];
      i && a && d.route.key === a.route.key ? l[u] = i[u] : (c = !1, t[u] && t[u](), Me((h) => {
        t[u] = h, l[u] = Jo(e.routerState, l[u - 1] || e.routerState.base, ir(() => r()[u + 1]), () => e.routerState.matches()[u]);
      }));
    }
    return t.splice(s.length).forEach((u) => u()), i && c ? i : (n = l[0], l);
  }));
  return ir(() => r() && n)();
}
const ir = (e) => () => C($e, {
  get when() {
    return e();
  },
  keyed: !0,
  children: (t) => C(Nn.Provider, {
    value: t,
    get children() {
      return t.outlet();
    }
  })
}), gt = (e) => {
  const t = jt(() => e.children);
  return it(e, {
    get children() {
      return t();
    }
  });
};
function Zo([e, t], n, r) {
  return [e, r ? (s) => t(r(s)) : t];
}
function ei(e) {
  let t = !1;
  const n = (s) => typeof s == "string" ? { value: s } : s, r = Zo($(n(e.get()), {
    equals: (s, o) => s.value === o.value && s.state === o.state
  }), void 0, (s) => (!t && e.set(s), I.registry && !I.done && (I.done = !0), s));
  return e.init && xe(e.init((s = e.get()) => {
    t = !0, r[1](n(s)), t = !1;
  })), Go({
    signal: r,
    create: e.create,
    utils: e.utils
  });
}
function ti(e, t, n) {
  return e.addEventListener(t, n), () => e.removeEventListener(t, n);
}
function ni(e, t) {
  const n = e && document.getElementById(e);
  n ? n.scrollIntoView() : t && window.scrollTo(0, 0);
}
const ri = /* @__PURE__ */ new Map();
function si(e = !0, t = !1, n = "/_server", r) {
  return (s) => {
    const o = s.base.path(), i = s.navigatorFactory(s.base);
    let c, l;
    function u(m) {
      return m.namespaceURI === "http://www.w3.org/2000/svg";
    }
    function f(m) {
      if (m.defaultPrevented || m.button !== 0 || m.metaKey || m.altKey || m.ctrlKey || m.shiftKey)
        return;
      const g = m.composedPath().find((A) => A instanceof Node && A.nodeName.toUpperCase() === "A");
      if (!g || t && !g.hasAttribute("link"))
        return;
      const E = u(g), w = E ? g.href.baseVal : g.href;
      if ((E ? g.target.baseVal : g.target) || !w && !g.hasAttribute("state"))
        return;
      const S = (g.getAttribute("rel") || "").split(/\s+/);
      if (g.hasAttribute("download") || S && S.includes("external"))
        return;
      const B = E ? new URL(w, document.baseURI) : new URL(w);
      if (!(B.origin !== window.location.origin || o && B.pathname && !B.pathname.toLowerCase().startsWith(o.toLowerCase())))
        return [g, B];
    }
    function a(m) {
      const g = f(m);
      if (!g)
        return;
      const [E, w] = g, _ = s.parsePath(w.pathname + w.search + w.hash), S = E.getAttribute("state");
      m.preventDefault(), i(_, {
        resolve: !1,
        replace: E.hasAttribute("replace"),
        scroll: !E.hasAttribute("noscroll"),
        state: S ? JSON.parse(S) : void 0
      });
    }
    function d(m) {
      const g = f(m);
      if (!g)
        return;
      const [E, w] = g;
      r && (w.pathname = r(w.pathname)), s.preloadRoute(w, E.getAttribute("preload") !== "false");
    }
    function h(m) {
      clearTimeout(c);
      const g = f(m);
      if (!g)
        return l = null;
      const [E, w] = g;
      l !== E && (r && (w.pathname = r(w.pathname)), c = setTimeout(() => {
        s.preloadRoute(w, E.getAttribute("preload") !== "false"), l = E;
      }, 20));
    }
    function b(m) {
      if (m.defaultPrevented)
        return;
      let g = m.submitter && m.submitter.hasAttribute("formaction") ? m.submitter.getAttribute("formaction") : m.target.getAttribute("action");
      if (!g)
        return;
      if (!g.startsWith("https://action/")) {
        const w = new URL(g, Qr);
        if (g = s.parsePath(w.pathname + w.search), !g.startsWith(n))
          return;
      }
      if (m.target.method.toUpperCase() !== "POST")
        throw new Error("Only POST forms are supported for Actions");
      const E = ri.get(g);
      if (E) {
        m.preventDefault();
        const w = new FormData(m.target, m.submitter);
        E.call({ r: s, f: m.target }, m.target.enctype === "multipart/form-data" ? w : new URLSearchParams(w));
      }
    }
    Pe(["click", "submit"]), document.addEventListener("click", a), e && (document.addEventListener("mousemove", h, { passive: !0 }), document.addEventListener("focusin", d, { passive: !0 }), document.addEventListener("touchstart", d, { passive: !0 })), document.addEventListener("submit", b), xe(() => {
      document.removeEventListener("click", a), e && (document.removeEventListener("mousemove", h), document.removeEventListener("focusin", d), document.removeEventListener("touchstart", d)), document.removeEventListener("submit", b);
    });
  };
}
function oi(e) {
  const t = () => {
    const r = window.location.pathname.replace(/^\/+/, "/") + window.location.search, s = window.history.state && window.history.state._depth && Object.keys(window.history.state).length === 1 ? void 0 : window.history.state;
    return {
      value: r + window.location.hash,
      state: s
    };
  }, n = zr();
  return ei({
    get: t,
    set({ value: r, replace: s, scroll: o, state: i }) {
      s ? window.history.replaceState(Bo(i), "", r) : window.history.pushState(i, "", r), ni(decodeURIComponent(window.location.hash.slice(1)), o), Mn();
    },
    init: (r) => ti(window, "popstate", Po(r, (s) => {
      if (s && s < 0)
        return !n.confirm(s);
      {
        const o = t();
        return !n.confirm(o.value, { state: o.state });
      }
    })),
    create: si(e.preload, e.explicitLinks, e.actionBase, e.transformUrl),
    utils: {
      go: (r) => window.history.go(r),
      beforeLeave: n
    }
  })(e);
}
var ii = /* @__PURE__ */ F("<a>");
function en(e) {
  e = it({
    inactiveClass: "inactive",
    activeClass: "active"
  }, e);
  const [, t] = Wr(e, ["href", "state", "class", "activeClass", "inactiveClass", "end"]), n = jo(() => e.href), r = Uo(n), s = dt(), o = Y(() => {
    const i = n();
    if (i === void 0) return [!1, !1];
    const c = Ne(i.split(/[?#]/, 1)[0]).toLowerCase(), l = decodeURI(Ne(s.pathname).toLowerCase());
    return [e.end ? c === l : l.startsWith(c + "/") || l === c, c === l];
  });
  return (() => {
    var i = ii();
    return $n(i, it(t, {
      get href() {
        return r() || e.href;
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
    }), !1, !1), i;
  })();
}
const ci = () => {
  if (typeof window < "u") {
    if (window.localStorage) {
      const t = window.localStorage.getItem("dark");
      if (typeof t == "string")
        return t === "true";
    }
    if (window.matchMedia("(prefers-color-scheme: dark)").matches)
      return !0;
  }
  return !1;
}, ts = ut(), ze = "http://localhost:5000/api", li = (e) => {
  Ae();
  const [t, n] = $(localStorage.getItem("token") || ""), [r, s] = $([]), [o, i] = $(ci()), [c] = Xs(t, async (a) => {
    const d = localStorage.getItem("user");
    if (d)
      return JSON.parse(d);
    const h = await fetch(`${ze}/auth/me`, {
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include"
    });
    if (!h.ok)
      return h.status === 401 && (localStorage.removeItem("token"), localStorage.removeItem("user")), {
        email: "",
        name: "",
        image: ""
      };
    const b = await h.json();
    return localStorage.setItem("user", JSON.stringify(b)), b;
  }), l = async () => {
    try {
      const a = await fetch(`${ze}/file/list?directory=./&recursive=true`, {
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      });
      if (!a.ok)
        return a.status === 401 && localStorage.removeItem("token"), {};
      if (a.ok) {
        const d = await a.json();
        s(d);
      }
    } catch (a) {
      console.error("Failed to fetch files:", a);
    }
  };
  l();
  let [u, f] = $();
  return C(ts.Provider, {
    value: {
      get token() {
        return t();
      },
      set token(a) {
        n(a), localStorage.setItem("token", a);
      },
      user: c,
      tabs() {
        const a = u();
        return a ? a() : void 0;
      },
      setTabs(a) {
        f(() => a);
      },
      dark: o,
      toggleDark() {
        let a = !o();
        document.body.classList.toggle("dark", a), i(a), localStorage.setItem("dark", String(a));
      },
      files: r,
      refreshFiles: l
    },
    get children() {
      return e.children;
    }
  });
}, qe = () => De(ts);
var ai = /* @__PURE__ */ F('<div class="flex h-screen flex-col overflow-hidden"><main class=flex-1><div class="grid grid-cols-1 grid-rows-[1fr_1px_auto_1px_auto] justify-center [--gutter-width:2.5rem] md:-mx-4 md:grid-cols-[var(--gutter-width)_minmax(0,var(--breakpoint-2xl))_var(--gutter-width)] lg:mx-0"><div class="col-start-1 row-span-full row-start-1 hidden border-x border-x-[--pattern-fg] border-neutral-200 dark:border-neutral-800 bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed [--pattern-fg:var(--color-black)]/5 md:block dark:[--pattern-fg:var(--color-white)]/10"></div><div class></div><div class="row-span-full row-start-1 hidden border-x border-x-[--pattern-fg] border-neutral-200 dark:border-neutral-800 bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed [--pattern-fg:var(--color-black)]/5 md:col-start-3 md:block dark:[--pattern-fg:var(--color-white)]/10">');
const tn = (e) => (Fn(), Ae(), dt(), qe(), (() => {
  var t = ai(), n = t.firstChild, r = n.firstChild, s = r.firstChild, o = s.nextSibling;
  return K(o, () => e.children), t;
})()), _e = /* @__PURE__ */ Object.create(null);
_e.open = "0";
_e.close = "1";
_e.ping = "2";
_e.pong = "3";
_e.message = "4";
_e.upgrade = "5";
_e.noop = "6";
const wt = /* @__PURE__ */ Object.create(null);
Object.keys(_e).forEach((e) => {
  wt[_e[e]] = e;
});
const gn = { type: "error", data: "parser error" }, ns = typeof Blob == "function" || typeof Blob < "u" && Object.prototype.toString.call(Blob) === "[object BlobConstructor]", rs = typeof ArrayBuffer == "function", ss = (e) => typeof ArrayBuffer.isView == "function" ? ArrayBuffer.isView(e) : e && e.buffer instanceof ArrayBuffer, Dn = ({ type: e, data: t }, n, r) => ns && t instanceof Blob ? n ? r(t) : cr(t, r) : rs && (t instanceof ArrayBuffer || ss(t)) ? n ? r(t) : cr(new Blob([t]), r) : r(_e[e] + (t || "")), cr = (e, t) => {
  const n = new FileReader();
  return n.onload = function() {
    const r = n.result.split(",")[1];
    t("b" + (r || ""));
  }, n.readAsDataURL(e);
};
function lr(e) {
  return e instanceof Uint8Array ? e : e instanceof ArrayBuffer ? new Uint8Array(e) : new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
}
let nn;
function ui(e, t) {
  if (ns && e.data instanceof Blob)
    return e.data.arrayBuffer().then(lr).then(t);
  if (rs && (e.data instanceof ArrayBuffer || ss(e.data)))
    return t(lr(e.data));
  Dn(e, !1, (n) => {
    nn || (nn = new TextEncoder()), t(nn.encode(n));
  });
}
const ar = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", nt = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (let e = 0; e < ar.length; e++)
  nt[ar.charCodeAt(e)] = e;
const fi = (e) => {
  let t = e.length * 0.75, n = e.length, r, s = 0, o, i, c, l;
  e[e.length - 1] === "=" && (t--, e[e.length - 2] === "=" && t--);
  const u = new ArrayBuffer(t), f = new Uint8Array(u);
  for (r = 0; r < n; r += 4)
    o = nt[e.charCodeAt(r)], i = nt[e.charCodeAt(r + 1)], c = nt[e.charCodeAt(r + 2)], l = nt[e.charCodeAt(r + 3)], f[s++] = o << 2 | i >> 4, f[s++] = (i & 15) << 4 | c >> 2, f[s++] = (c & 3) << 6 | l & 63;
  return u;
}, di = typeof ArrayBuffer == "function", qn = (e, t) => {
  if (typeof e != "string")
    return {
      type: "message",
      data: os(e, t)
    };
  const n = e.charAt(0);
  return n === "b" ? {
    type: "message",
    data: hi(e.substring(1), t)
  } : wt[n] ? e.length > 1 ? {
    type: wt[n],
    data: e.substring(1)
  } : {
    type: wt[n]
  } : gn;
}, hi = (e, t) => {
  if (di) {
    const n = fi(e);
    return os(n, t);
  } else
    return { base64: !0, data: e };
}, os = (e, t) => {
  switch (t) {
    case "blob":
      return e instanceof Blob ? e : new Blob([e]);
    case "arraybuffer":
    default:
      return e instanceof ArrayBuffer ? e : e.buffer;
  }
}, is = "", pi = (e, t) => {
  const n = e.length, r = new Array(n);
  let s = 0;
  e.forEach((o, i) => {
    Dn(o, !1, (c) => {
      r[i] = c, ++s === n && t(r.join(is));
    });
  });
}, mi = (e, t) => {
  const n = e.split(is), r = [];
  for (let s = 0; s < n.length; s++) {
    const o = qn(n[s], t);
    if (r.push(o), o.type === "error")
      break;
  }
  return r;
};
function gi() {
  return new TransformStream({
    transform(e, t) {
      ui(e, (n) => {
        const r = n.length;
        let s;
        if (r < 126)
          s = new Uint8Array(1), new DataView(s.buffer).setUint8(0, r);
        else if (r < 65536) {
          s = new Uint8Array(3);
          const o = new DataView(s.buffer);
          o.setUint8(0, 126), o.setUint16(1, r);
        } else {
          s = new Uint8Array(9);
          const o = new DataView(s.buffer);
          o.setUint8(0, 127), o.setBigUint64(1, BigInt(r));
        }
        e.data && typeof e.data != "string" && (s[0] |= 128), t.enqueue(s), t.enqueue(n);
      });
    }
  });
}
let rn;
function yt(e) {
  return e.reduce((t, n) => t + n.length, 0);
}
function bt(e, t) {
  if (e[0].length === t)
    return e.shift();
  const n = new Uint8Array(t);
  let r = 0;
  for (let s = 0; s < t; s++)
    n[s] = e[0][r++], r === e[0].length && (e.shift(), r = 0);
  return e.length && r < e[0].length && (e[0] = e[0].slice(r)), n;
}
function yi(e, t) {
  rn || (rn = new TextDecoder());
  const n = [];
  let r = 0, s = -1, o = !1;
  return new TransformStream({
    transform(i, c) {
      for (n.push(i); ; ) {
        if (r === 0) {
          if (yt(n) < 1)
            break;
          const l = bt(n, 1);
          o = (l[0] & 128) === 128, s = l[0] & 127, s < 126 ? r = 3 : s === 126 ? r = 1 : r = 2;
        } else if (r === 1) {
          if (yt(n) < 2)
            break;
          const l = bt(n, 2);
          s = new DataView(l.buffer, l.byteOffset, l.length).getUint16(0), r = 3;
        } else if (r === 2) {
          if (yt(n) < 8)
            break;
          const l = bt(n, 8), u = new DataView(l.buffer, l.byteOffset, l.length), f = u.getUint32(0);
          if (f > Math.pow(2, 21) - 1) {
            c.enqueue(gn);
            break;
          }
          s = f * Math.pow(2, 32) + u.getUint32(4), r = 3;
        } else {
          if (yt(n) < s)
            break;
          const l = bt(n, s);
          c.enqueue(qn(o ? l : rn.decode(l), t)), r = 0;
        }
        if (s === 0 || s > e) {
          c.enqueue(gn);
          break;
        }
      }
    }
  });
}
const cs = 4;
function re(e) {
  if (e) return bi(e);
}
function bi(e) {
  for (var t in re.prototype)
    e[t] = re.prototype[t];
  return e;
}
re.prototype.on = re.prototype.addEventListener = function(e, t) {
  return this._callbacks = this._callbacks || {}, (this._callbacks["$" + e] = this._callbacks["$" + e] || []).push(t), this;
};
re.prototype.once = function(e, t) {
  function n() {
    this.off(e, n), t.apply(this, arguments);
  }
  return n.fn = t, this.on(e, n), this;
};
re.prototype.off = re.prototype.removeListener = re.prototype.removeAllListeners = re.prototype.removeEventListener = function(e, t) {
  if (this._callbacks = this._callbacks || {}, arguments.length == 0)
    return this._callbacks = {}, this;
  var n = this._callbacks["$" + e];
  if (!n) return this;
  if (arguments.length == 1)
    return delete this._callbacks["$" + e], this;
  for (var r, s = 0; s < n.length; s++)
    if (r = n[s], r === t || r.fn === t) {
      n.splice(s, 1);
      break;
    }
  return n.length === 0 && delete this._callbacks["$" + e], this;
};
re.prototype.emit = function(e) {
  this._callbacks = this._callbacks || {};
  for (var t = new Array(arguments.length - 1), n = this._callbacks["$" + e], r = 1; r < arguments.length; r++)
    t[r - 1] = arguments[r];
  if (n) {
    n = n.slice(0);
    for (var r = 0, s = n.length; r < s; ++r)
      n[r].apply(this, t);
  }
  return this;
};
re.prototype.emitReserved = re.prototype.emit;
re.prototype.listeners = function(e) {
  return this._callbacks = this._callbacks || {}, this._callbacks["$" + e] || [];
};
re.prototype.hasListeners = function(e) {
  return !!this.listeners(e).length;
};
const Vt = typeof Promise == "function" && typeof Promise.resolve == "function" ? (t) => Promise.resolve().then(t) : (t, n) => n(t, 0), me = typeof self < "u" ? self : typeof window < "u" ? window : Function("return this")(), vi = "arraybuffer";
function ls(e, ...t) {
  return t.reduce((n, r) => (e.hasOwnProperty(r) && (n[r] = e[r]), n), {});
}
const wi = me.setTimeout, Ei = me.clearTimeout;
function Kt(e, t) {
  t.useNativeTimers ? (e.setTimeoutFn = wi.bind(me), e.clearTimeoutFn = Ei.bind(me)) : (e.setTimeoutFn = me.setTimeout.bind(me), e.clearTimeoutFn = me.clearTimeout.bind(me));
}
const xi = 1.33;
function _i(e) {
  return typeof e == "string" ? ki(e) : Math.ceil((e.byteLength || e.size) * xi);
}
function ki(e) {
  let t = 0, n = 0;
  for (let r = 0, s = e.length; r < s; r++)
    t = e.charCodeAt(r), t < 128 ? n += 1 : t < 2048 ? n += 2 : t < 55296 || t >= 57344 ? n += 3 : (r++, n += 4);
  return n;
}
function as() {
  return Date.now().toString(36).substring(3) + Math.random().toString(36).substring(2, 5);
}
function Si(e) {
  let t = "";
  for (let n in e)
    e.hasOwnProperty(n) && (t.length && (t += "&"), t += encodeURIComponent(n) + "=" + encodeURIComponent(e[n]));
  return t;
}
function Ai(e) {
  let t = {}, n = e.split("&");
  for (let r = 0, s = n.length; r < s; r++) {
    let o = n[r].split("=");
    t[decodeURIComponent(o[0])] = decodeURIComponent(o[1]);
  }
  return t;
}
class Ci extends Error {
  constructor(t, n, r) {
    super(t), this.description = n, this.context = r, this.type = "TransportError";
  }
}
class jn extends re {
  /**
   * Transport abstract constructor.
   *
   * @param {Object} opts - options
   * @protected
   */
  constructor(t) {
    super(), this.writable = !1, Kt(this, t), this.opts = t, this.query = t.query, this.socket = t.socket, this.supportsBinary = !t.forceBase64;
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
  onError(t, n, r) {
    return super.emitReserved("error", new Ci(t, n, r)), this;
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
  send(t) {
    this.readyState === "open" && this.write(t);
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
  onData(t) {
    const n = qn(t, this.socket.binaryType);
    this.onPacket(n);
  }
  /**
   * Called with a decoded packet.
   *
   * @protected
   */
  onPacket(t) {
    super.emitReserved("packet", t);
  }
  /**
   * Called upon close.
   *
   * @protected
   */
  onClose(t) {
    this.readyState = "closed", super.emitReserved("close", t);
  }
  /**
   * Pauses the transport, in order not to lose packets during an upgrade.
   *
   * @param onPause
   */
  pause(t) {
  }
  createUri(t, n = {}) {
    return t + "://" + this._hostname() + this._port() + this.opts.path + this._query(n);
  }
  _hostname() {
    const t = this.opts.hostname;
    return t.indexOf(":") === -1 ? t : "[" + t + "]";
  }
  _port() {
    return this.opts.port && (this.opts.secure && +(this.opts.port !== 443) || !this.opts.secure && Number(this.opts.port) !== 80) ? ":" + this.opts.port : "";
  }
  _query(t) {
    const n = Si(t);
    return n.length ? "?" + n : "";
  }
}
class Oi extends jn {
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
  pause(t) {
    this.readyState = "pausing";
    const n = () => {
      this.readyState = "paused", t();
    };
    if (this._polling || !this.writable) {
      let r = 0;
      this._polling && (r++, this.once("pollComplete", function() {
        --r || n();
      })), this.writable || (r++, this.once("drain", function() {
        --r || n();
      }));
    } else
      n();
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
  onData(t) {
    const n = (r) => {
      if (this.readyState === "opening" && r.type === "open" && this.onOpen(), r.type === "close")
        return this.onClose({ description: "transport closed by the server" }), !1;
      this.onPacket(r);
    };
    mi(t, this.socket.binaryType).forEach(n), this.readyState !== "closed" && (this._polling = !1, this.emitReserved("pollComplete"), this.readyState === "open" && this._poll());
  }
  /**
   * For polling, send a close packet.
   *
   * @protected
   */
  doClose() {
    const t = () => {
      this.write([{ type: "close" }]);
    };
    this.readyState === "open" ? t() : this.once("open", t);
  }
  /**
   * Writes a packets payload.
   *
   * @param {Array} packets - data packets
   * @protected
   */
  write(t) {
    this.writable = !1, pi(t, (n) => {
      this.doWrite(n, () => {
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
    const t = this.opts.secure ? "https" : "http", n = this.query || {};
    return this.opts.timestampRequests !== !1 && (n[this.opts.timestampParam] = as()), !this.supportsBinary && !n.sid && (n.b64 = 1), this.createUri(t, n);
  }
}
let us = !1;
try {
  us = typeof XMLHttpRequest < "u" && "withCredentials" in new XMLHttpRequest();
} catch {
}
const Ti = us;
function Bi() {
}
class Pi extends Oi {
  /**
   * XHR Polling constructor.
   *
   * @param {Object} opts
   * @package
   */
  constructor(t) {
    if (super(t), typeof location < "u") {
      const n = location.protocol === "https:";
      let r = location.port;
      r || (r = n ? "443" : "80"), this.xd = typeof location < "u" && t.hostname !== location.hostname || r !== t.port;
    }
  }
  /**
   * Sends data.
   *
   * @param {String} data to send.
   * @param {Function} called upon flush.
   * @private
   */
  doWrite(t, n) {
    const r = this.request({
      method: "POST",
      data: t
    });
    r.on("success", n), r.on("error", (s, o) => {
      this.onError("xhr post error", s, o);
    });
  }
  /**
   * Starts a poll cycle.
   *
   * @private
   */
  doPoll() {
    const t = this.request();
    t.on("data", this.onData.bind(this)), t.on("error", (n, r) => {
      this.onError("xhr poll error", n, r);
    }), this.pollXhr = t;
  }
}
class Ee extends re {
  /**
   * Request constructor
   *
   * @param {Object} options
   * @package
   */
  constructor(t, n, r) {
    super(), this.createRequest = t, Kt(this, r), this._opts = r, this._method = r.method || "GET", this._uri = n, this._data = r.data !== void 0 ? r.data : null, this._create();
  }
  /**
   * Creates the XHR object and sends the request.
   *
   * @private
   */
  _create() {
    var t;
    const n = ls(this._opts, "agent", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "autoUnref");
    n.xdomain = !!this._opts.xd;
    const r = this._xhr = this.createRequest(n);
    try {
      r.open(this._method, this._uri, !0);
      try {
        if (this._opts.extraHeaders) {
          r.setDisableHeaderCheck && r.setDisableHeaderCheck(!0);
          for (let s in this._opts.extraHeaders)
            this._opts.extraHeaders.hasOwnProperty(s) && r.setRequestHeader(s, this._opts.extraHeaders[s]);
        }
      } catch {
      }
      if (this._method === "POST")
        try {
          r.setRequestHeader("Content-type", "text/plain;charset=UTF-8");
        } catch {
        }
      try {
        r.setRequestHeader("Accept", "*/*");
      } catch {
      }
      (t = this._opts.cookieJar) === null || t === void 0 || t.addCookies(r), "withCredentials" in r && (r.withCredentials = this._opts.withCredentials), this._opts.requestTimeout && (r.timeout = this._opts.requestTimeout), r.onreadystatechange = () => {
        var s;
        r.readyState === 3 && ((s = this._opts.cookieJar) === null || s === void 0 || s.parseCookies(
          // @ts-ignore
          r.getResponseHeader("set-cookie")
        )), r.readyState === 4 && (r.status === 200 || r.status === 1223 ? this._onLoad() : this.setTimeoutFn(() => {
          this._onError(typeof r.status == "number" ? r.status : 0);
        }, 0));
      }, r.send(this._data);
    } catch (s) {
      this.setTimeoutFn(() => {
        this._onError(s);
      }, 0);
      return;
    }
    typeof document < "u" && (this._index = Ee.requestsCount++, Ee.requests[this._index] = this);
  }
  /**
   * Called upon error.
   *
   * @private
   */
  _onError(t) {
    this.emitReserved("error", t, this._xhr), this._cleanup(!0);
  }
  /**
   * Cleans up house.
   *
   * @private
   */
  _cleanup(t) {
    if (!(typeof this._xhr > "u" || this._xhr === null)) {
      if (this._xhr.onreadystatechange = Bi, t)
        try {
          this._xhr.abort();
        } catch {
        }
      typeof document < "u" && delete Ee.requests[this._index], this._xhr = null;
    }
  }
  /**
   * Called upon load.
   *
   * @private
   */
  _onLoad() {
    const t = this._xhr.responseText;
    t !== null && (this.emitReserved("data", t), this.emitReserved("success"), this._cleanup());
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
Ee.requestsCount = 0;
Ee.requests = {};
if (typeof document < "u") {
  if (typeof attachEvent == "function")
    attachEvent("onunload", ur);
  else if (typeof addEventListener == "function") {
    const e = "onpagehide" in me ? "pagehide" : "unload";
    addEventListener(e, ur, !1);
  }
}
function ur() {
  for (let e in Ee.requests)
    Ee.requests.hasOwnProperty(e) && Ee.requests[e].abort();
}
const Li = function() {
  const e = fs({
    xdomain: !1
  });
  return e && e.responseType !== null;
}();
class Ri extends Pi {
  constructor(t) {
    super(t);
    const n = t && t.forceBase64;
    this.supportsBinary = Li && !n;
  }
  request(t = {}) {
    return Object.assign(t, { xd: this.xd }, this.opts), new Ee(fs, this.uri(), t);
  }
}
function fs(e) {
  const t = e.xdomain;
  try {
    if (typeof XMLHttpRequest < "u" && (!t || Ti))
      return new XMLHttpRequest();
  } catch {
  }
  if (!t)
    try {
      return new me[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP");
    } catch {
    }
}
const ds = typeof navigator < "u" && typeof navigator.product == "string" && navigator.product.toLowerCase() === "reactnative";
class Ii extends jn {
  get name() {
    return "websocket";
  }
  doOpen() {
    const t = this.uri(), n = this.opts.protocols, r = ds ? {} : ls(this.opts, "agent", "perMessageDeflate", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "localAddress", "protocolVersion", "origin", "maxPayload", "family", "checkServerIdentity");
    this.opts.extraHeaders && (r.headers = this.opts.extraHeaders);
    try {
      this.ws = this.createSocket(t, n, r);
    } catch (s) {
      return this.emitReserved("error", s);
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
    }, this.ws.onclose = (t) => this.onClose({
      description: "websocket connection closed",
      context: t
    }), this.ws.onmessage = (t) => this.onData(t.data), this.ws.onerror = (t) => this.onError("websocket error", t);
  }
  write(t) {
    this.writable = !1;
    for (let n = 0; n < t.length; n++) {
      const r = t[n], s = n === t.length - 1;
      Dn(r, this.supportsBinary, (o) => {
        try {
          this.doWrite(r, o);
        } catch {
        }
        s && Vt(() => {
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
    const t = this.opts.secure ? "wss" : "ws", n = this.query || {};
    return this.opts.timestampRequests && (n[this.opts.timestampParam] = as()), this.supportsBinary || (n.b64 = 1), this.createUri(t, n);
  }
}
const sn = me.WebSocket || me.MozWebSocket;
class $i extends Ii {
  createSocket(t, n, r) {
    return ds ? new sn(t, n, r) : n ? new sn(t, n) : new sn(t);
  }
  doWrite(t, n) {
    this.ws.send(n);
  }
}
class Mi extends jn {
  get name() {
    return "webtransport";
  }
  doOpen() {
    try {
      this._transport = new WebTransport(this.createUri("https"), this.opts.transportOptions[this.name]);
    } catch (t) {
      return this.emitReserved("error", t);
    }
    this._transport.closed.then(() => {
      this.onClose();
    }).catch((t) => {
      this.onError("webtransport error", t);
    }), this._transport.ready.then(() => {
      this._transport.createBidirectionalStream().then((t) => {
        const n = yi(Number.MAX_SAFE_INTEGER, this.socket.binaryType), r = t.readable.pipeThrough(n).getReader(), s = gi();
        s.readable.pipeTo(t.writable), this._writer = s.writable.getWriter();
        const o = () => {
          r.read().then(({ done: c, value: l }) => {
            c || (this.onPacket(l), o());
          }).catch((c) => {
          });
        };
        o();
        const i = { type: "open" };
        this.query.sid && (i.data = `{"sid":"${this.query.sid}"}`), this._writer.write(i).then(() => this.onOpen());
      });
    });
  }
  write(t) {
    this.writable = !1;
    for (let n = 0; n < t.length; n++) {
      const r = t[n], s = n === t.length - 1;
      this._writer.write(r).then(() => {
        s && Vt(() => {
          this.writable = !0, this.emitReserved("drain");
        }, this.setTimeoutFn);
      });
    }
  }
  doClose() {
    var t;
    (t = this._transport) === null || t === void 0 || t.close();
  }
}
const Ni = {
  websocket: $i,
  webtransport: Mi,
  polling: Ri
}, Fi = /^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/, Di = [
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
function yn(e) {
  if (e.length > 8e3)
    throw "URI too long";
  const t = e, n = e.indexOf("["), r = e.indexOf("]");
  n != -1 && r != -1 && (e = e.substring(0, n) + e.substring(n, r).replace(/:/g, ";") + e.substring(r, e.length));
  let s = Fi.exec(e || ""), o = {}, i = 14;
  for (; i--; )
    o[Di[i]] = s[i] || "";
  return n != -1 && r != -1 && (o.source = t, o.host = o.host.substring(1, o.host.length - 1).replace(/;/g, ":"), o.authority = o.authority.replace("[", "").replace("]", "").replace(/;/g, ":"), o.ipv6uri = !0), o.pathNames = qi(o, o.path), o.queryKey = ji(o, o.query), o;
}
function qi(e, t) {
  const n = /\/{2,9}/g, r = t.replace(n, "/").split("/");
  return (t.slice(0, 1) == "/" || t.length === 0) && r.splice(0, 1), t.slice(-1) == "/" && r.splice(r.length - 1, 1), r;
}
function ji(e, t) {
  const n = {};
  return t.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function(r, s, o) {
    s && (n[s] = o);
  }), n;
}
const bn = typeof addEventListener == "function" && typeof removeEventListener == "function", Et = [];
bn && addEventListener("offline", () => {
  Et.forEach((e) => e());
}, !1);
class Oe extends re {
  /**
   * Socket constructor.
   *
   * @param {String|Object} uri - uri or options
   * @param {Object} opts - options
   */
  constructor(t, n) {
    if (super(), this.binaryType = vi, this.writeBuffer = [], this._prevBufferLen = 0, this._pingInterval = -1, this._pingTimeout = -1, this._maxPayload = -1, this._pingTimeoutTime = 1 / 0, t && typeof t == "object" && (n = t, t = null), t) {
      const r = yn(t);
      n.hostname = r.host, n.secure = r.protocol === "https" || r.protocol === "wss", n.port = r.port, r.query && (n.query = r.query);
    } else n.host && (n.hostname = yn(n.host).host);
    Kt(this, n), this.secure = n.secure != null ? n.secure : typeof location < "u" && location.protocol === "https:", n.hostname && !n.port && (n.port = this.secure ? "443" : "80"), this.hostname = n.hostname || (typeof location < "u" ? location.hostname : "localhost"), this.port = n.port || (typeof location < "u" && location.port ? location.port : this.secure ? "443" : "80"), this.transports = [], this._transportsByName = {}, n.transports.forEach((r) => {
      const s = r.prototype.name;
      this.transports.push(s), this._transportsByName[s] = r;
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
    }, n), this.opts.path = this.opts.path.replace(/\/$/, "") + (this.opts.addTrailingSlash ? "/" : ""), typeof this.opts.query == "string" && (this.opts.query = Ai(this.opts.query)), bn && (this.opts.closeOnBeforeunload && (this._beforeunloadEventListener = () => {
      this.transport && (this.transport.removeAllListeners(), this.transport.close());
    }, addEventListener("beforeunload", this._beforeunloadEventListener, !1)), this.hostname !== "localhost" && (this._offlineEventListener = () => {
      this._onClose("transport close", {
        description: "network connection lost"
      });
    }, Et.push(this._offlineEventListener))), this.opts.withCredentials && (this._cookieJar = void 0), this._open();
  }
  /**
   * Creates transport of the given type.
   *
   * @param {String} name - transport name
   * @return {Transport}
   * @private
   */
  createTransport(t) {
    const n = Object.assign({}, this.opts.query);
    n.EIO = cs, n.transport = t, this.id && (n.sid = this.id);
    const r = Object.assign({}, this.opts, {
      query: n,
      socket: this,
      hostname: this.hostname,
      secure: this.secure,
      port: this.port
    }, this.opts.transportOptions[t]);
    return new this._transportsByName[t](r);
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
    const t = this.opts.rememberUpgrade && Oe.priorWebsocketSuccess && this.transports.indexOf("websocket") !== -1 ? "websocket" : this.transports[0];
    this.readyState = "opening";
    const n = this.createTransport(t);
    n.open(), this.setTransport(n);
  }
  /**
   * Sets the current transport. Disables the existing one (if any).
   *
   * @private
   */
  setTransport(t) {
    this.transport && this.transport.removeAllListeners(), this.transport = t, t.on("drain", this._onDrain.bind(this)).on("packet", this._onPacket.bind(this)).on("error", this._onError.bind(this)).on("close", (n) => this._onClose("transport close", n));
  }
  /**
   * Called when connection is deemed open.
   *
   * @private
   */
  onOpen() {
    this.readyState = "open", Oe.priorWebsocketSuccess = this.transport.name === "websocket", this.emitReserved("open"), this.flush();
  }
  /**
   * Handles a packet.
   *
   * @private
   */
  _onPacket(t) {
    if (this.readyState === "opening" || this.readyState === "open" || this.readyState === "closing")
      switch (this.emitReserved("packet", t), this.emitReserved("heartbeat"), t.type) {
        case "open":
          this.onHandshake(JSON.parse(t.data));
          break;
        case "ping":
          this._sendPacket("pong"), this.emitReserved("ping"), this.emitReserved("pong"), this._resetPingTimeout();
          break;
        case "error":
          const n = new Error("server error");
          n.code = t.data, this._onError(n);
          break;
        case "message":
          this.emitReserved("data", t.data), this.emitReserved("message", t.data);
          break;
      }
  }
  /**
   * Called upon handshake completion.
   *
   * @param {Object} data - handshake obj
   * @private
   */
  onHandshake(t) {
    this.emitReserved("handshake", t), this.id = t.sid, this.transport.query.sid = t.sid, this._pingInterval = t.pingInterval, this._pingTimeout = t.pingTimeout, this._maxPayload = t.maxPayload, this.onOpen(), this.readyState !== "closed" && this._resetPingTimeout();
  }
  /**
   * Sets and resets ping timeout timer based on server pings.
   *
   * @private
   */
  _resetPingTimeout() {
    this.clearTimeoutFn(this._pingTimeoutTimer);
    const t = this._pingInterval + this._pingTimeout;
    this._pingTimeoutTime = Date.now() + t, this._pingTimeoutTimer = this.setTimeoutFn(() => {
      this._onClose("ping timeout");
    }, t), this.opts.autoUnref && this._pingTimeoutTimer.unref();
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
      const t = this._getWritablePackets();
      this.transport.send(t), this._prevBufferLen = t.length, this.emitReserved("flush");
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
    let n = 1;
    for (let r = 0; r < this.writeBuffer.length; r++) {
      const s = this.writeBuffer[r].data;
      if (s && (n += _i(s)), r > 0 && n > this._maxPayload)
        return this.writeBuffer.slice(0, r);
      n += 2;
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
    const t = Date.now() > this._pingTimeoutTime;
    return t && (this._pingTimeoutTime = 0, Vt(() => {
      this._onClose("ping timeout");
    }, this.setTimeoutFn)), t;
  }
  /**
   * Sends a message.
   *
   * @param {String} msg - message.
   * @param {Object} options.
   * @param {Function} fn - callback function.
   * @return {Socket} for chaining.
   */
  write(t, n, r) {
    return this._sendPacket("message", t, n, r), this;
  }
  /**
   * Sends a message. Alias of {@link Socket#write}.
   *
   * @param {String} msg - message.
   * @param {Object} options.
   * @param {Function} fn - callback function.
   * @return {Socket} for chaining.
   */
  send(t, n, r) {
    return this._sendPacket("message", t, n, r), this;
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
  _sendPacket(t, n, r, s) {
    if (typeof n == "function" && (s = n, n = void 0), typeof r == "function" && (s = r, r = null), this.readyState === "closing" || this.readyState === "closed")
      return;
    r = r || {}, r.compress = r.compress !== !1;
    const o = {
      type: t,
      data: n,
      options: r
    };
    this.emitReserved("packetCreate", o), this.writeBuffer.push(o), s && this.once("flush", s), this.flush();
  }
  /**
   * Closes the connection.
   */
  close() {
    const t = () => {
      this._onClose("forced close"), this.transport.close();
    }, n = () => {
      this.off("upgrade", n), this.off("upgradeError", n), t();
    }, r = () => {
      this.once("upgrade", n), this.once("upgradeError", n);
    };
    return (this.readyState === "opening" || this.readyState === "open") && (this.readyState = "closing", this.writeBuffer.length ? this.once("drain", () => {
      this.upgrading ? r() : t();
    }) : this.upgrading ? r() : t()), this;
  }
  /**
   * Called upon transport error
   *
   * @private
   */
  _onError(t) {
    if (Oe.priorWebsocketSuccess = !1, this.opts.tryAllTransports && this.transports.length > 1 && this.readyState === "opening")
      return this.transports.shift(), this._open();
    this.emitReserved("error", t), this._onClose("transport error", t);
  }
  /**
   * Called upon transport close.
   *
   * @private
   */
  _onClose(t, n) {
    if (this.readyState === "opening" || this.readyState === "open" || this.readyState === "closing") {
      if (this.clearTimeoutFn(this._pingTimeoutTimer), this.transport.removeAllListeners("close"), this.transport.close(), this.transport.removeAllListeners(), bn && (this._beforeunloadEventListener && removeEventListener("beforeunload", this._beforeunloadEventListener, !1), this._offlineEventListener)) {
        const r = Et.indexOf(this._offlineEventListener);
        r !== -1 && Et.splice(r, 1);
      }
      this.readyState = "closed", this.id = null, this.emitReserved("close", t, n), this.writeBuffer = [], this._prevBufferLen = 0;
    }
  }
}
Oe.protocol = cs;
class Ui extends Oe {
  constructor() {
    super(...arguments), this._upgrades = [];
  }
  onOpen() {
    if (super.onOpen(), this.readyState === "open" && this.opts.upgrade)
      for (let t = 0; t < this._upgrades.length; t++)
        this._probe(this._upgrades[t]);
  }
  /**
   * Probes a transport.
   *
   * @param {String} name - transport name
   * @private
   */
  _probe(t) {
    let n = this.createTransport(t), r = !1;
    Oe.priorWebsocketSuccess = !1;
    const s = () => {
      r || (n.send([{ type: "ping", data: "probe" }]), n.once("packet", (a) => {
        if (!r)
          if (a.type === "pong" && a.data === "probe") {
            if (this.upgrading = !0, this.emitReserved("upgrading", n), !n)
              return;
            Oe.priorWebsocketSuccess = n.name === "websocket", this.transport.pause(() => {
              r || this.readyState !== "closed" && (f(), this.setTransport(n), n.send([{ type: "upgrade" }]), this.emitReserved("upgrade", n), n = null, this.upgrading = !1, this.flush());
            });
          } else {
            const d = new Error("probe error");
            d.transport = n.name, this.emitReserved("upgradeError", d);
          }
      }));
    };
    function o() {
      r || (r = !0, f(), n.close(), n = null);
    }
    const i = (a) => {
      const d = new Error("probe error: " + a);
      d.transport = n.name, o(), this.emitReserved("upgradeError", d);
    };
    function c() {
      i("transport closed");
    }
    function l() {
      i("socket closed");
    }
    function u(a) {
      n && a.name !== n.name && o();
    }
    const f = () => {
      n.removeListener("open", s), n.removeListener("error", i), n.removeListener("close", c), this.off("close", l), this.off("upgrading", u);
    };
    n.once("open", s), n.once("error", i), n.once("close", c), this.once("close", l), this.once("upgrading", u), this._upgrades.indexOf("webtransport") !== -1 && t !== "webtransport" ? this.setTimeoutFn(() => {
      r || n.open();
    }, 200) : n.open();
  }
  onHandshake(t) {
    this._upgrades = this._filterUpgrades(t.upgrades), super.onHandshake(t);
  }
  /**
   * Filters upgrades, returning only those matching client transports.
   *
   * @param {Array} upgrades - server upgrades
   * @private
   */
  _filterUpgrades(t) {
    const n = [];
    for (let r = 0; r < t.length; r++)
      ~this.transports.indexOf(t[r]) && n.push(t[r]);
    return n;
  }
}
let Vi = class extends Ui {
  constructor(t, n = {}) {
    const r = typeof t == "object" ? t : n;
    (!r.transports || r.transports && typeof r.transports[0] == "string") && (r.transports = (r.transports || ["polling", "websocket", "webtransport"]).map((s) => Ni[s]).filter((s) => !!s)), super(t, r);
  }
};
function Ki(e, t = "", n) {
  let r = e;
  n = n || typeof location < "u" && location, e == null && (e = n.protocol + "//" + n.host), typeof e == "string" && (e.charAt(0) === "/" && (e.charAt(1) === "/" ? e = n.protocol + e : e = n.host + e), /^(https?|wss?):\/\//.test(e) || (typeof n < "u" ? e = n.protocol + "//" + e : e = "https://" + e), r = yn(e)), r.port || (/^(http|ws)$/.test(r.protocol) ? r.port = "80" : /^(http|ws)s$/.test(r.protocol) && (r.port = "443")), r.path = r.path || "/";
  const o = r.host.indexOf(":") !== -1 ? "[" + r.host + "]" : r.host;
  return r.id = r.protocol + "://" + o + ":" + r.port + t, r.href = r.protocol + "://" + o + (n && n.port === r.port ? "" : ":" + r.port), r;
}
const Wi = typeof ArrayBuffer == "function", Hi = (e) => typeof ArrayBuffer.isView == "function" ? ArrayBuffer.isView(e) : e.buffer instanceof ArrayBuffer, hs = Object.prototype.toString, zi = typeof Blob == "function" || typeof Blob < "u" && hs.call(Blob) === "[object BlobConstructor]", Qi = typeof File == "function" || typeof File < "u" && hs.call(File) === "[object FileConstructor]";
function Un(e) {
  return Wi && (e instanceof ArrayBuffer || Hi(e)) || zi && e instanceof Blob || Qi && e instanceof File;
}
function xt(e, t) {
  if (!e || typeof e != "object")
    return !1;
  if (Array.isArray(e)) {
    for (let n = 0, r = e.length; n < r; n++)
      if (xt(e[n]))
        return !0;
    return !1;
  }
  if (Un(e))
    return !0;
  if (e.toJSON && typeof e.toJSON == "function" && arguments.length === 1)
    return xt(e.toJSON(), !0);
  for (const n in e)
    if (Object.prototype.hasOwnProperty.call(e, n) && xt(e[n]))
      return !0;
  return !1;
}
function Ji(e) {
  const t = [], n = e.data, r = e;
  return r.data = vn(n, t), r.attachments = t.length, { packet: r, buffers: t };
}
function vn(e, t) {
  if (!e)
    return e;
  if (Un(e)) {
    const n = { _placeholder: !0, num: t.length };
    return t.push(e), n;
  } else if (Array.isArray(e)) {
    const n = new Array(e.length);
    for (let r = 0; r < e.length; r++)
      n[r] = vn(e[r], t);
    return n;
  } else if (typeof e == "object" && !(e instanceof Date)) {
    const n = {};
    for (const r in e)
      Object.prototype.hasOwnProperty.call(e, r) && (n[r] = vn(e[r], t));
    return n;
  }
  return e;
}
function Gi(e, t) {
  return e.data = wn(e.data, t), delete e.attachments, e;
}
function wn(e, t) {
  if (!e)
    return e;
  if (e && e._placeholder === !0) {
    if (typeof e.num == "number" && e.num >= 0 && e.num < t.length)
      return t[e.num];
    throw new Error("illegal attachments");
  } else if (Array.isArray(e))
    for (let n = 0; n < e.length; n++)
      e[n] = wn(e[n], t);
  else if (typeof e == "object")
    for (const n in e)
      Object.prototype.hasOwnProperty.call(e, n) && (e[n] = wn(e[n], t));
  return e;
}
const Yi = [
  "connect",
  "connect_error",
  "disconnect",
  "disconnecting",
  "newListener",
  "removeListener"
  // used by the Node.js EventEmitter
], Xi = 5;
var U;
(function(e) {
  e[e.CONNECT = 0] = "CONNECT", e[e.DISCONNECT = 1] = "DISCONNECT", e[e.EVENT = 2] = "EVENT", e[e.ACK = 3] = "ACK", e[e.CONNECT_ERROR = 4] = "CONNECT_ERROR", e[e.BINARY_EVENT = 5] = "BINARY_EVENT", e[e.BINARY_ACK = 6] = "BINARY_ACK";
})(U || (U = {}));
class Zi {
  /**
   * Encoder constructor
   *
   * @param {function} replacer - custom replacer to pass down to JSON.parse
   */
  constructor(t) {
    this.replacer = t;
  }
  /**
   * Encode a packet as a single string if non-binary, or as a
   * buffer sequence, depending on packet type.
   *
   * @param {Object} obj - packet object
   */
  encode(t) {
    return (t.type === U.EVENT || t.type === U.ACK) && xt(t) ? this.encodeAsBinary({
      type: t.type === U.EVENT ? U.BINARY_EVENT : U.BINARY_ACK,
      nsp: t.nsp,
      data: t.data,
      id: t.id
    }) : [this.encodeAsString(t)];
  }
  /**
   * Encode packet as string.
   */
  encodeAsString(t) {
    let n = "" + t.type;
    return (t.type === U.BINARY_EVENT || t.type === U.BINARY_ACK) && (n += t.attachments + "-"), t.nsp && t.nsp !== "/" && (n += t.nsp + ","), t.id != null && (n += t.id), t.data != null && (n += JSON.stringify(t.data, this.replacer)), n;
  }
  /**
   * Encode packet as 'buffer sequence' by removing blobs, and
   * deconstructing packet into object with placeholders and
   * a list of buffers.
   */
  encodeAsBinary(t) {
    const n = Ji(t), r = this.encodeAsString(n.packet), s = n.buffers;
    return s.unshift(r), s;
  }
}
function fr(e) {
  return Object.prototype.toString.call(e) === "[object Object]";
}
class Vn extends re {
  /**
   * Decoder constructor
   *
   * @param {function} reviver - custom reviver to pass down to JSON.stringify
   */
  constructor(t) {
    super(), this.reviver = t;
  }
  /**
   * Decodes an encoded packet string into packet JSON.
   *
   * @param {String} obj - encoded packet
   */
  add(t) {
    let n;
    if (typeof t == "string") {
      if (this.reconstructor)
        throw new Error("got plaintext data when reconstructing a packet");
      n = this.decodeString(t);
      const r = n.type === U.BINARY_EVENT;
      r || n.type === U.BINARY_ACK ? (n.type = r ? U.EVENT : U.ACK, this.reconstructor = new ec(n), n.attachments === 0 && super.emitReserved("decoded", n)) : super.emitReserved("decoded", n);
    } else if (Un(t) || t.base64)
      if (this.reconstructor)
        n = this.reconstructor.takeBinaryData(t), n && (this.reconstructor = null, super.emitReserved("decoded", n));
      else
        throw new Error("got binary data when not reconstructing a packet");
    else
      throw new Error("Unknown type: " + t);
  }
  /**
   * Decode a packet String (JSON data)
   *
   * @param {String} str
   * @return {Object} packet
   */
  decodeString(t) {
    let n = 0;
    const r = {
      type: Number(t.charAt(0))
    };
    if (U[r.type] === void 0)
      throw new Error("unknown packet type " + r.type);
    if (r.type === U.BINARY_EVENT || r.type === U.BINARY_ACK) {
      const o = n + 1;
      for (; t.charAt(++n) !== "-" && n != t.length; )
        ;
      const i = t.substring(o, n);
      if (i != Number(i) || t.charAt(n) !== "-")
        throw new Error("Illegal attachments");
      r.attachments = Number(i);
    }
    if (t.charAt(n + 1) === "/") {
      const o = n + 1;
      for (; ++n && !(t.charAt(n) === "," || n === t.length); )
        ;
      r.nsp = t.substring(o, n);
    } else
      r.nsp = "/";
    const s = t.charAt(n + 1);
    if (s !== "" && Number(s) == s) {
      const o = n + 1;
      for (; ++n; ) {
        const i = t.charAt(n);
        if (i == null || Number(i) != i) {
          --n;
          break;
        }
        if (n === t.length)
          break;
      }
      r.id = Number(t.substring(o, n + 1));
    }
    if (t.charAt(++n)) {
      const o = this.tryParse(t.substr(n));
      if (Vn.isPayloadValid(r.type, o))
        r.data = o;
      else
        throw new Error("invalid payload");
    }
    return r;
  }
  tryParse(t) {
    try {
      return JSON.parse(t, this.reviver);
    } catch {
      return !1;
    }
  }
  static isPayloadValid(t, n) {
    switch (t) {
      case U.CONNECT:
        return fr(n);
      case U.DISCONNECT:
        return n === void 0;
      case U.CONNECT_ERROR:
        return typeof n == "string" || fr(n);
      case U.EVENT:
      case U.BINARY_EVENT:
        return Array.isArray(n) && (typeof n[0] == "number" || typeof n[0] == "string" && Yi.indexOf(n[0]) === -1);
      case U.ACK:
      case U.BINARY_ACK:
        return Array.isArray(n);
    }
  }
  /**
   * Deallocates a parser's resources
   */
  destroy() {
    this.reconstructor && (this.reconstructor.finishedReconstruction(), this.reconstructor = null);
  }
}
class ec {
  constructor(t) {
    this.packet = t, this.buffers = [], this.reconPack = t;
  }
  /**
   * Method to be called when binary data received from connection
   * after a BINARY_EVENT packet.
   *
   * @param {Buffer | ArrayBuffer} binData - the raw binary data received
   * @return {null | Object} returns null if more binary data is expected or
   *   a reconstructed packet object if all buffers have been received.
   */
  takeBinaryData(t) {
    if (this.buffers.push(t), this.buffers.length === this.reconPack.attachments) {
      const n = Gi(this.reconPack, this.buffers);
      return this.finishedReconstruction(), n;
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
const tc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Decoder: Vn,
  Encoder: Zi,
  get PacketType() {
    return U;
  },
  protocol: Xi
}, Symbol.toStringTag, { value: "Module" }));
function be(e, t, n) {
  return e.on(t, n), function() {
    e.off(t, n);
  };
}
const nc = Object.freeze({
  connect: 1,
  connect_error: 1,
  disconnect: 1,
  disconnecting: 1,
  // EventEmitter reserved events: https://nodejs.org/api/events.html#events_event_newlistener
  newListener: 1,
  removeListener: 1
});
class ps extends re {
  /**
   * `Socket` constructor.
   */
  constructor(t, n, r) {
    super(), this.connected = !1, this.recovered = !1, this.receiveBuffer = [], this.sendBuffer = [], this._queue = [], this._queueSeq = 0, this.ids = 0, this.acks = {}, this.flags = {}, this.io = t, this.nsp = n, r && r.auth && (this.auth = r.auth), this._opts = Object.assign({}, r), this.io._autoConnect && this.open();
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
    const t = this.io;
    this.subs = [
      be(t, "open", this.onopen.bind(this)),
      be(t, "packet", this.onpacket.bind(this)),
      be(t, "error", this.onerror.bind(this)),
      be(t, "close", this.onclose.bind(this))
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
  send(...t) {
    return t.unshift("message"), this.emit.apply(this, t), this;
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
  emit(t, ...n) {
    var r, s, o;
    if (nc.hasOwnProperty(t))
      throw new Error('"' + t.toString() + '" is a reserved event name');
    if (n.unshift(t), this._opts.retries && !this.flags.fromQueue && !this.flags.volatile)
      return this._addToQueue(n), this;
    const i = {
      type: U.EVENT,
      data: n
    };
    if (i.options = {}, i.options.compress = this.flags.compress !== !1, typeof n[n.length - 1] == "function") {
      const f = this.ids++, a = n.pop();
      this._registerAckCallback(f, a), i.id = f;
    }
    const c = (s = (r = this.io.engine) === null || r === void 0 ? void 0 : r.transport) === null || s === void 0 ? void 0 : s.writable, l = this.connected && !(!((o = this.io.engine) === null || o === void 0) && o._hasPingExpired());
    return this.flags.volatile && !c || (l ? (this.notifyOutgoingListeners(i), this.packet(i)) : this.sendBuffer.push(i)), this.flags = {}, this;
  }
  /**
   * @private
   */
  _registerAckCallback(t, n) {
    var r;
    const s = (r = this.flags.timeout) !== null && r !== void 0 ? r : this._opts.ackTimeout;
    if (s === void 0) {
      this.acks[t] = n;
      return;
    }
    const o = this.io.setTimeoutFn(() => {
      delete this.acks[t];
      for (let c = 0; c < this.sendBuffer.length; c++)
        this.sendBuffer[c].id === t && this.sendBuffer.splice(c, 1);
      n.call(this, new Error("operation has timed out"));
    }, s), i = (...c) => {
      this.io.clearTimeoutFn(o), n.apply(this, c);
    };
    i.withError = !0, this.acks[t] = i;
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
  emitWithAck(t, ...n) {
    return new Promise((r, s) => {
      const o = (i, c) => i ? s(i) : r(c);
      o.withError = !0, n.push(o), this.emit(t, ...n);
    });
  }
  /**
   * Add the packet to the queue.
   * @param args
   * @private
   */
  _addToQueue(t) {
    let n;
    typeof t[t.length - 1] == "function" && (n = t.pop());
    const r = {
      id: this._queueSeq++,
      tryCount: 0,
      pending: !1,
      args: t,
      flags: Object.assign({ fromQueue: !0 }, this.flags)
    };
    t.push((s, ...o) => r !== this._queue[0] ? void 0 : (s !== null ? r.tryCount > this._opts.retries && (this._queue.shift(), n && n(s)) : (this._queue.shift(), n && n(null, ...o)), r.pending = !1, this._drainQueue())), this._queue.push(r), this._drainQueue();
  }
  /**
   * Send the first packet of the queue, and wait for an acknowledgement from the server.
   * @param force - whether to resend a packet that has not been acknowledged yet
   *
   * @private
   */
  _drainQueue(t = !1) {
    if (!this.connected || this._queue.length === 0)
      return;
    const n = this._queue[0];
    n.pending && !t || (n.pending = !0, n.tryCount++, this.flags = n.flags, this.emit.apply(this, n.args));
  }
  /**
   * Sends a packet.
   *
   * @param packet
   * @private
   */
  packet(t) {
    t.nsp = this.nsp, this.io._packet(t);
  }
  /**
   * Called upon engine `open`.
   *
   * @private
   */
  onopen() {
    typeof this.auth == "function" ? this.auth((t) => {
      this._sendConnectPacket(t);
    }) : this._sendConnectPacket(this.auth);
  }
  /**
   * Sends a CONNECT packet to initiate the Socket.IO session.
   *
   * @param data
   * @private
   */
  _sendConnectPacket(t) {
    this.packet({
      type: U.CONNECT,
      data: this._pid ? Object.assign({ pid: this._pid, offset: this._lastOffset }, t) : t
    });
  }
  /**
   * Called upon engine or manager `error`.
   *
   * @param err
   * @private
   */
  onerror(t) {
    this.connected || this.emitReserved("connect_error", t);
  }
  /**
   * Called upon engine `close`.
   *
   * @param reason
   * @param description
   * @private
   */
  onclose(t, n) {
    this.connected = !1, delete this.id, this.emitReserved("disconnect", t, n), this._clearAcks();
  }
  /**
   * Clears the acknowledgement handlers upon disconnection, since the client will never receive an acknowledgement from
   * the server.
   *
   * @private
   */
  _clearAcks() {
    Object.keys(this.acks).forEach((t) => {
      if (!this.sendBuffer.some((r) => String(r.id) === t)) {
        const r = this.acks[t];
        delete this.acks[t], r.withError && r.call(this, new Error("socket has been disconnected"));
      }
    });
  }
  /**
   * Called with socket packet.
   *
   * @param packet
   * @private
   */
  onpacket(t) {
    if (t.nsp === this.nsp)
      switch (t.type) {
        case U.CONNECT:
          t.data && t.data.sid ? this.onconnect(t.data.sid, t.data.pid) : this.emitReserved("connect_error", new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));
          break;
        case U.EVENT:
        case U.BINARY_EVENT:
          this.onevent(t);
          break;
        case U.ACK:
        case U.BINARY_ACK:
          this.onack(t);
          break;
        case U.DISCONNECT:
          this.ondisconnect();
          break;
        case U.CONNECT_ERROR:
          this.destroy();
          const r = new Error(t.data.message);
          r.data = t.data.data, this.emitReserved("connect_error", r);
          break;
      }
  }
  /**
   * Called upon a server event.
   *
   * @param packet
   * @private
   */
  onevent(t) {
    const n = t.data || [];
    t.id != null && n.push(this.ack(t.id)), this.connected ? this.emitEvent(n) : this.receiveBuffer.push(Object.freeze(n));
  }
  emitEvent(t) {
    if (this._anyListeners && this._anyListeners.length) {
      const n = this._anyListeners.slice();
      for (const r of n)
        r.apply(this, t);
    }
    super.emit.apply(this, t), this._pid && t.length && typeof t[t.length - 1] == "string" && (this._lastOffset = t[t.length - 1]);
  }
  /**
   * Produces an ack callback to emit with an event.
   *
   * @private
   */
  ack(t) {
    const n = this;
    let r = !1;
    return function(...s) {
      r || (r = !0, n.packet({
        type: U.ACK,
        id: t,
        data: s
      }));
    };
  }
  /**
   * Called upon a server acknowledgement.
   *
   * @param packet
   * @private
   */
  onack(t) {
    const n = this.acks[t.id];
    typeof n == "function" && (delete this.acks[t.id], n.withError && t.data.unshift(null), n.apply(this, t.data));
  }
  /**
   * Called upon server connect.
   *
   * @private
   */
  onconnect(t, n) {
    this.id = t, this.recovered = n && this._pid === n, this._pid = n, this.connected = !0, this.emitBuffered(), this.emitReserved("connect"), this._drainQueue(!0);
  }
  /**
   * Emit buffered events (received and emitted).
   *
   * @private
   */
  emitBuffered() {
    this.receiveBuffer.forEach((t) => this.emitEvent(t)), this.receiveBuffer = [], this.sendBuffer.forEach((t) => {
      this.notifyOutgoingListeners(t), this.packet(t);
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
    this.subs && (this.subs.forEach((t) => t()), this.subs = void 0), this.io._destroy(this);
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
    return this.connected && this.packet({ type: U.DISCONNECT }), this.destroy(), this.connected && this.onclose("io client disconnect"), this;
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
  compress(t) {
    return this.flags.compress = t, this;
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
  timeout(t) {
    return this.flags.timeout = t, this;
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
  onAny(t) {
    return this._anyListeners = this._anyListeners || [], this._anyListeners.push(t), this;
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
  prependAny(t) {
    return this._anyListeners = this._anyListeners || [], this._anyListeners.unshift(t), this;
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
  offAny(t) {
    if (!this._anyListeners)
      return this;
    if (t) {
      const n = this._anyListeners;
      for (let r = 0; r < n.length; r++)
        if (t === n[r])
          return n.splice(r, 1), this;
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
  onAnyOutgoing(t) {
    return this._anyOutgoingListeners = this._anyOutgoingListeners || [], this._anyOutgoingListeners.push(t), this;
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
  prependAnyOutgoing(t) {
    return this._anyOutgoingListeners = this._anyOutgoingListeners || [], this._anyOutgoingListeners.unshift(t), this;
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
  offAnyOutgoing(t) {
    if (!this._anyOutgoingListeners)
      return this;
    if (t) {
      const n = this._anyOutgoingListeners;
      for (let r = 0; r < n.length; r++)
        if (t === n[r])
          return n.splice(r, 1), this;
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
  notifyOutgoingListeners(t) {
    if (this._anyOutgoingListeners && this._anyOutgoingListeners.length) {
      const n = this._anyOutgoingListeners.slice();
      for (const r of n)
        r.apply(this, t.data);
    }
  }
}
function Ge(e) {
  e = e || {}, this.ms = e.min || 100, this.max = e.max || 1e4, this.factor = e.factor || 2, this.jitter = e.jitter > 0 && e.jitter <= 1 ? e.jitter : 0, this.attempts = 0;
}
Ge.prototype.duration = function() {
  var e = this.ms * Math.pow(this.factor, this.attempts++);
  if (this.jitter) {
    var t = Math.random(), n = Math.floor(t * this.jitter * e);
    e = (Math.floor(t * 10) & 1) == 0 ? e - n : e + n;
  }
  return Math.min(e, this.max) | 0;
};
Ge.prototype.reset = function() {
  this.attempts = 0;
};
Ge.prototype.setMin = function(e) {
  this.ms = e;
};
Ge.prototype.setMax = function(e) {
  this.max = e;
};
Ge.prototype.setJitter = function(e) {
  this.jitter = e;
};
class En extends re {
  constructor(t, n) {
    var r;
    super(), this.nsps = {}, this.subs = [], t && typeof t == "object" && (n = t, t = void 0), n = n || {}, n.path = n.path || "/socket.io", this.opts = n, Kt(this, n), this.reconnection(n.reconnection !== !1), this.reconnectionAttempts(n.reconnectionAttempts || 1 / 0), this.reconnectionDelay(n.reconnectionDelay || 1e3), this.reconnectionDelayMax(n.reconnectionDelayMax || 5e3), this.randomizationFactor((r = n.randomizationFactor) !== null && r !== void 0 ? r : 0.5), this.backoff = new Ge({
      min: this.reconnectionDelay(),
      max: this.reconnectionDelayMax(),
      jitter: this.randomizationFactor()
    }), this.timeout(n.timeout == null ? 2e4 : n.timeout), this._readyState = "closed", this.uri = t;
    const s = n.parser || tc;
    this.encoder = new s.Encoder(), this.decoder = new s.Decoder(), this._autoConnect = n.autoConnect !== !1, this._autoConnect && this.open();
  }
  reconnection(t) {
    return arguments.length ? (this._reconnection = !!t, t || (this.skipReconnect = !0), this) : this._reconnection;
  }
  reconnectionAttempts(t) {
    return t === void 0 ? this._reconnectionAttempts : (this._reconnectionAttempts = t, this);
  }
  reconnectionDelay(t) {
    var n;
    return t === void 0 ? this._reconnectionDelay : (this._reconnectionDelay = t, (n = this.backoff) === null || n === void 0 || n.setMin(t), this);
  }
  randomizationFactor(t) {
    var n;
    return t === void 0 ? this._randomizationFactor : (this._randomizationFactor = t, (n = this.backoff) === null || n === void 0 || n.setJitter(t), this);
  }
  reconnectionDelayMax(t) {
    var n;
    return t === void 0 ? this._reconnectionDelayMax : (this._reconnectionDelayMax = t, (n = this.backoff) === null || n === void 0 || n.setMax(t), this);
  }
  timeout(t) {
    return arguments.length ? (this._timeout = t, this) : this._timeout;
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
  open(t) {
    if (~this._readyState.indexOf("open"))
      return this;
    this.engine = new Vi(this.uri, this.opts);
    const n = this.engine, r = this;
    this._readyState = "opening", this.skipReconnect = !1;
    const s = be(n, "open", function() {
      r.onopen(), t && t();
    }), o = (c) => {
      this.cleanup(), this._readyState = "closed", this.emitReserved("error", c), t ? t(c) : this.maybeReconnectOnOpen();
    }, i = be(n, "error", o);
    if (this._timeout !== !1) {
      const c = this._timeout, l = this.setTimeoutFn(() => {
        s(), o(new Error("timeout")), n.close();
      }, c);
      this.opts.autoUnref && l.unref(), this.subs.push(() => {
        this.clearTimeoutFn(l);
      });
    }
    return this.subs.push(s), this.subs.push(i), this;
  }
  /**
   * Alias for open()
   *
   * @return self
   * @public
   */
  connect(t) {
    return this.open(t);
  }
  /**
   * Called upon transport open.
   *
   * @private
   */
  onopen() {
    this.cleanup(), this._readyState = "open", this.emitReserved("open");
    const t = this.engine;
    this.subs.push(
      be(t, "ping", this.onping.bind(this)),
      be(t, "data", this.ondata.bind(this)),
      be(t, "error", this.onerror.bind(this)),
      be(t, "close", this.onclose.bind(this)),
      // @ts-ignore
      be(this.decoder, "decoded", this.ondecoded.bind(this))
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
  ondata(t) {
    try {
      this.decoder.add(t);
    } catch (n) {
      this.onclose("parse error", n);
    }
  }
  /**
   * Called when parser fully decodes a packet.
   *
   * @private
   */
  ondecoded(t) {
    Vt(() => {
      this.emitReserved("packet", t);
    }, this.setTimeoutFn);
  }
  /**
   * Called upon socket error.
   *
   * @private
   */
  onerror(t) {
    this.emitReserved("error", t);
  }
  /**
   * Creates a new socket for the given `nsp`.
   *
   * @return {Socket}
   * @public
   */
  socket(t, n) {
    let r = this.nsps[t];
    return r ? this._autoConnect && !r.active && r.connect() : (r = new ps(this, t, n), this.nsps[t] = r), r;
  }
  /**
   * Called upon a socket close.
   *
   * @param socket
   * @private
   */
  _destroy(t) {
    const n = Object.keys(this.nsps);
    for (const r of n)
      if (this.nsps[r].active)
        return;
    this._close();
  }
  /**
   * Writes a packet.
   *
   * @param packet
   * @private
   */
  _packet(t) {
    const n = this.encoder.encode(t);
    for (let r = 0; r < n.length; r++)
      this.engine.write(n[r], t.options);
  }
  /**
   * Clean up transport subscriptions and packet buffer.
   *
   * @private
   */
  cleanup() {
    this.subs.forEach((t) => t()), this.subs.length = 0, this.decoder.destroy();
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
  onclose(t, n) {
    var r;
    this.cleanup(), (r = this.engine) === null || r === void 0 || r.close(), this.backoff.reset(), this._readyState = "closed", this.emitReserved("close", t, n), this._reconnection && !this.skipReconnect && this.reconnect();
  }
  /**
   * Attempt a reconnection.
   *
   * @private
   */
  reconnect() {
    if (this._reconnecting || this.skipReconnect)
      return this;
    const t = this;
    if (this.backoff.attempts >= this._reconnectionAttempts)
      this.backoff.reset(), this.emitReserved("reconnect_failed"), this._reconnecting = !1;
    else {
      const n = this.backoff.duration();
      this._reconnecting = !0;
      const r = this.setTimeoutFn(() => {
        t.skipReconnect || (this.emitReserved("reconnect_attempt", t.backoff.attempts), !t.skipReconnect && t.open((s) => {
          s ? (t._reconnecting = !1, t.reconnect(), this.emitReserved("reconnect_error", s)) : t.onreconnect();
        }));
      }, n);
      this.opts.autoUnref && r.unref(), this.subs.push(() => {
        this.clearTimeoutFn(r);
      });
    }
  }
  /**
   * Called upon successful reconnect.
   *
   * @private
   */
  onreconnect() {
    const t = this.backoff.attempts;
    this._reconnecting = !1, this.backoff.reset(), this.emitReserved("reconnect", t);
  }
}
const Xe = {};
function _t(e, t) {
  typeof e == "object" && (t = e, e = void 0), t = t || {};
  const n = Ki(e, t.path || "/socket.io"), r = n.source, s = n.id, o = n.path, i = Xe[s] && o in Xe[s].nsps, c = t.forceNew || t["force new connection"] || t.multiplex === !1 || i;
  let l;
  return c ? l = new En(r, t) : (Xe[s] || (Xe[s] = new En(r, t)), l = Xe[s]), n.query && !t.query && (t.query = n.queryKey), l.socket(n.path, t);
}
Object.assign(_t, {
  Manager: En,
  Socket: ps,
  io: _t,
  connect: _t
});
const V = [], rc = (e) => {
  V.push(e);
}, dr = (e) => {
  const t = V.findIndex((r) => r.uniqueId === e);
  if (t === -1)
    return;
  const n = V[t];
  return V.splice(t, 1), n;
}, ms = [
  "a[href]",
  "area[href]",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "button:not([disabled])",
  "iframe",
  "[tabindex]",
  "[contentEditable=true]"
].reduce((e, t, n) => `${e}${n ? "," : ""}${t}:not([tabindex="-1"])`, "");
let on = !1;
const he = ({ from: e, stopAtRootElement: t, ignoreElement: n = [], allowSelectors: r, direction: s = "forwards", wrap: o }) => {
  let i, c = !1;
  if (e instanceof Element)
    c = rt(e), i = e;
  else {
    if (e === "activeElement") {
      const m = document.activeElement;
      c = rt(m), i = hr(m);
    }
    typeof e == "object" && (e.getActiveElement && (i = hr(e.el)), c = e.isIframe);
  }
  const l = i, u = l.parentElement, f = c, a = l, d = ms + (r ? "," + r.join(",") : "");
  if (!a)
    return null;
  const h = (m, g) => {
    let E = !1;
    const w = m.children, _ = w.length;
    if (on && (E = !0), s === "forwards")
      for (let S = 0; S < _; S++) {
        const B = w[S];
        if (E) {
          const A = It(B, d, s, n);
          if (A)
            return A;
          continue;
        }
        if (B === t)
          return null;
        if (B === g) {
          E = !0;
          continue;
        }
      }
    else
      for (let S = _ - 1; S >= 0; S--) {
        const B = w[S];
        if (E) {
          const A = It(B, d, s, n);
          if (A)
            return A;
          continue;
        }
        if (B === t)
          return null;
        if (B === g) {
          E = !0;
          continue;
        }
      }
    if (g = m, m = m.parentElement, !m && f) {
      const S = document.activeElement;
      S && rt(S) && (g = S, m = S.parentElement);
    }
    return m ? h(m, g) : null;
  };
  let b = h(u, a);
  return !b && o && t && (on = !0, b = he({
    from: t,
    allowSelectors: r,
    direction: s,
    ignoreElement: n,
    // stopAtElement,
    wrap: !1
  })), on = !1, b;
}, gs = (e) => {
  try {
    return e.contentWindow;
  } catch {
    return null;
  }
}, sc = (e) => {
  const t = gs(e);
  return t ? t.document : null;
}, hr = (e) => {
  if (!rt(e))
    return e;
  const t = sc(e);
  return t && t.activeElement || e;
}, pr = (e, t = window) => {
  const n = (s) => s.display === "none" || s.visibility === "hidden";
  if (e.style && n(e.style) || e.hidden)
    return !0;
  const r = t.getComputedStyle(e);
  return !!(!r || n(r));
}, It = (e, t = ms, n = "forwards", r = [], s = window, o = !0) => {
  const i = (a) => {
    if (!a.matches(t))
      return {
        el: a,
        matched: !1
      };
    const d = a.getAttribute("tabindex");
    if (rt(a) && (!d || d === "-1")) {
      const h = gs(a);
      return h ? (a = h.document.documentElement, s = h, { el: a, matched: !1, windowContext: h }) : { el: a, matched: !0 };
    }
    return {
      el: a,
      matched: !0
    };
  };
  if (o) {
    if (r.some((b) => b === e) || pr(e, s))
      return null;
    const { el: a, matched: d, windowContext: h } = i(e);
    return e = a, d ? e : (s = h || s, It(e, t, n, r, s, !1));
  }
  const c = e.shadowRoot;
  c && (e = c);
  const l = e.children, u = l.length, f = (a) => {
    if (r.some((g) => g === a) || pr(a, s))
      return {
        continue: !0
      };
    const { el: d, matched: h, windowContext: b } = i(a);
    if (a = d, s = b || s, h)
      return { returnVal: a };
    const m = It(a, t, n, r, s, !1);
    return m ? { returnVal: m } : null;
  };
  if (n === "forwards")
    for (let a = 0; a < u; a++) {
      let d = l[a];
      const h = f(d);
      if (h) {
        if (h.continue)
          continue;
        if (h.returnVal)
          return h.returnVal;
      }
    }
  else
    for (let a = u - 1; a >= 0; a--) {
      let d = l[a];
      const h = f(d);
      if (h) {
        if (h.continue)
          continue;
        if (h.returnVal)
          return h.returnVal;
      }
    }
  return null;
}, rt = (e) => e.tagName === "IFRAME", Kn = (e) => e.offsetHeight === 0 && e.offsetWidth === 0, ys = (e) => Object.getPrototypeOf(e) === Object.prototype, se = (e, { inputElement: t, type: n, subType: r }) => {
  if (t === "menuPopup")
    return e.menuPopupEl;
  if (t === "menuButton")
    return ge(e.menuBtnEls);
  if (n === "focusElementOnOpen") {
    if (ys(t))
      return se(e, {
        inputElement: t.target,
        type: "focusElementOnOpen"
      });
    if (t === "none")
      return null;
    if (t === "firstChild")
      return he({
        from: e.focusSentinelBeforeEl,
        stopAtRootElement: e.containerEl
      });
    if (typeof t == "string")
      return e.containerEl?.querySelector(t);
    if (t instanceof Element)
      return t;
    if (typeof t == "object")
      return se(e, {
        inputElement: t.target,
        type: "focusElementOnOpen"
      });
    const s = t();
    return typeof s == "string" ? e.containerEl?.querySelector(s) : s;
  }
  if (t == null && n === "menuPopup")
    return e.containerEl ? e.menuPopupEl ? e.menuPopupEl : e.containerEl.children[1] : null;
  if (typeof t == "string" && n === "menuButton" || typeof t == "string")
    return document.querySelector(t);
  if (t instanceof Element)
    return t;
  if (typeof t == "function") {
    const s = t();
    if (s instanceof Element)
      return s;
    if (n === "closeButton")
      return e.containerEl ? e.containerEl.querySelector(s) : null;
  }
  if (n === "focusElementOnClose") {
    if (!t)
      return null;
    switch (r) {
      case "tabForwards":
        return se(e, { inputElement: t.tabForwards });
      case "tabBackwards":
        return se(e, { inputElement: t.tabBackwards });
      case "click":
        return se(e, { inputElement: t.click });
      case "escapeKey":
        return se(e, { inputElement: t.escapeKey });
      case "scrolling":
        return se(e, { inputElement: t.scrolling });
    }
  }
  if (t == null)
    return null;
  if (Array.isArray(t))
    return t.map((s) => se(e, { inputElement: s, type: n }));
  for (const s in t) {
    const o = t[s];
    return se(e, { inputElement: o });
  }
  return null;
}, $t = (e) => {
  const t = (n) => {
    const r = (o) => o.visibility === "hidden";
    if (n.style && r(n.style) || n.hidden)
      return !0;
    const s = window.getComputedStyle(n);
    return !!(!s || r(s));
  };
  return Kn(e) || t(e);
}, ve = (e, t, n) => {
  for (let r = e.length - 1; r >= 0; r--) {
    const { item: s, continue: o } = t(e[r]);
    if (s && n(s), !o)
      return;
  }
}, oc = (e, t) => {
  const { timeouts: n, closeWhenMenuButtonIsClicked: r, focusedMenuBtn: s, onClickOutsideMenuButtonRef: o, setOpen: i, open: c, deadMenuButton: l, closeWhenClickingOutside: u } = e;
  e.menuBtnMouseDownFired = !1;
  const f = t.currentTarget;
  if (O.focusedMenuBtns.forEach((a) => a.el = null), !l) {
    if (e.menuBtnKeyupTabFired = !1, s.el = f, O.focusedMenuBtns.add(s), !u) {
      const a = V[V.length - 1];
      a && !a.menuBtnEls.includes(f) && !a.containerEl.contains(f) && ve(V, (d) => ({ item: d, continue: !0 }), (d) => {
        const { setOpen: h } = d;
        h(!1);
      });
    }
    if (!r) {
      i(!0);
      return;
    }
    c() && (O.closedByEvents = !0), i(!c());
  }
}, ic = (e, t) => {
  const { containerEl: n, focusedMenuBtn: r, overlay: s, setOpen: o, timeouts: i, menuBtnMouseDownFired: c, closeWhenDocumentBlurs: l, closeWhenClickingOutside: u, open: f } = e, a = t.currentTarget;
  if (queueMicrotask(() => {
    Es();
  }), e.menuBtnKeyupTabFired) {
    e.menuBtnKeyupTabFired = !1;
    return;
  }
  if (c || n && n.contains(t.relatedTarget))
    return;
  if (!u && f()) {
    document.addEventListener("keydown", Ht);
    return;
  }
  const d = O.clickTarget, h = () => {
    const b = document.activeElement;
    if (!t.relatedTarget && b && b.tagName, !(n && n.contains(b)) && !(!l && !document.hasFocus()) && !O.closedBySetOpen && a.isConnected) {
      if ($t(a)) {
        let m = !1;
        if (e.menuBtnEls?.some((g) => g === a || $t(g) ? !1 : d && !g.contains(d) ? (m = !0, !1) : (g.focus(), !0)), !m)
          return;
      }
      e.open() && (O.closedByEvents = !0, r.el = null, o(!1));
    }
  };
  i.menuButtonBlurTimeoutId = window.setTimeout(h);
}, cc = (e, t) => {
  const { focusMenuButtonOnMouseDown: n } = e, r = t.currentTarget;
  e.menuBtnMouseDownFired = !0, r.addEventListener("click", e.onClickMenuButtonRef), n && (r.addEventListener("blur", e.onBlurMenuButtonRef), requestAnimationFrame(() => {
    r.focus();
  }));
}, lc = (e) => {
  e.focusedMenuBtn.el = null;
}, ac = (e, t) => {
  const { containerEl: n, setOpen: r, open: s, onKeydownMenuButtonRef: o, onBlurMenuButtonRef: i, mount: c, focusSentinelBeforeEl: l, focusSentinelAfterEl: u, ignoreMenuPopupWhenTabbing: f } = e, a = t.currentTarget;
  if (t.key !== "Tab" || (O.focusedMenuBtns.forEach((h) => h.el = null), !s()))
    return;
  if (e.menuBtnKeyupTabFired = !0, t.key === "Tab" && t.shiftKey) {
    if (O.closedByEvents = !0, !c || a.nextElementSibling !== n) {
      t.preventDefault();
      let h = he({
        from: a,
        direction: "backwards",
        ignoreElement: [
          n,
          l,
          u
        ]
      });
      h && h.focus();
    }
    r(!1), a.removeEventListener("keydown", o), a.removeEventListener("blur", i);
    return;
  }
  if (t.preventDefault(), f) {
    const h = he({
      from: a,
      direction: "forwards",
      ignoreElement: [
        n,
        l,
        u
      ]
    });
    h && h.focus(), r(!1), a.removeEventListener("keydown", o), a.removeEventListener("blur", i);
    return;
  }
  let d = he({
    from: l,
    stopAtRootElement: n
  });
  d ? d.focus() : n.focus(), d || (r(!1), d = he({
    from: l
  }), d && d.focus()), a.removeEventListener("keydown", o), a.removeEventListener("blur", i);
}, uc = (e, t) => {
  const { closeWhenMenuButtonIsTabbed: n, timeouts: r, deadMenuButton: s, menuBtnEls: o, focusedMenuBtn: i } = e, c = ge(o);
  if (c.addEventListener("click", e.onClickMenuButtonRef), c.addEventListener("blur", e.onBlurMenuButtonRef), c.addEventListener("keydown", e.onKeydownMenuButtonRef), i.el = t.currentTarget, window.setTimeout(() => {
  }), s) {
    c.addEventListener("blur", e.onBlurMenuButtonRef), c.addEventListener("keydown", e.onKeydownMenuButtonRef);
    return;
  }
  n || clearTimeout(r.containerFocusTimeoutId);
}, ge = (e) => {
  if (e)
    return e.length <= 1 ? e[0] : e.find((t) => {
      if (!(!t || Kn(t)))
        return t;
    });
}, fc = ({ state: e, menuButton: t, open: n }) => {
  if (Array.isArray(t) && !t.length)
    return;
  const { focusedMenuBtn: r, containerEl: s } = e, o = se(e, {
    inputElement: t,
    type: "menuButton"
  });
  if (!o)
    return;
  e.menuBtnEls = Array.isArray(o) ? o : [o];
  const i = V.find((c) => c.uniqueId === e.uniqueId);
  i && (i.menuBtnEls = e.menuBtnEls), e.menuBtnEls.forEach((c, l, u) => {
    if (dc(e, c), c.addEventListener("mousedown", e.onMouseDownMenuButtonRef), c.addEventListener("focus", e.onFocusMenuButtonRef), r.el && r.el !== c && (!(u.length > 1) || !Kn(c))) {
      if (r.el = c, s && s.contains(document.activeElement))
        return;
      c.focus({ preventScroll: !0 });
    }
  });
}, dc = (e, t) => {
  const { modal: n, uniqueId: r, deadMenuButton: s } = e;
  if (!s) {
    if (t.hasAttribute("type"))
      return;
    t.setAttribute("type", "button"), t.setAttribute("aria-expanded", "false");
  }
  n && (t.setAttribute("aria-controls", r), t.setAttribute("aria-haspopup", "dialog"));
}, hc = (e) => {
  const { menuBtnEls: t, deadMenuButton: n } = e;
  n && t && t.forEach((r) => {
    r.setAttribute("aria-expanded", "true");
  });
}, pc = (e) => {
  const { menuBtnEls: t, deadMenuButton: n } = e;
  n && t && t.forEach((r) => {
    r.setAttribute("aria-expanded", "false");
  });
}, mc = (e, t) => {
  !e || !e.menuBtnEls || (e.menuBtnMouseDownFired = !1, e.menuBtnEls.forEach((n) => {
    t && (n.removeEventListener("blur", e.onBlurMenuButtonRef), n.removeEventListener("keydown", e.onKeydownMenuButtonRef), n.removeEventListener("click", e.onClickMenuButtonRef), n.removeEventListener("focus", e.onFocusMenuButtonRef), n.removeEventListener("mousedown", e.onMouseDownMenuButtonRef));
  }));
}, gc = (e) => {
  if (O.thirdPartyPopupEl)
    return O.thirdPartyPopupEl = null, null;
  if (!document.hasFocus())
    return null;
  const t = O.clickTarget, r = e.map((s) => document.querySelector(s)).find((s) => s && s.contains(t)) || null;
  return O.thirdPartyPopupEl = r, r;
}, yc = (e) => {
  for (let t of e) {
    const n = document.querySelector(t);
    if (n && !$t(n))
      return n;
  }
  return null;
}, bc = () => {
  document.addEventListener("click", bs), document.addEventListener("keydown", vs, { capture: !0 });
}, Wt = () => {
  document.removeEventListener("click", bs), document.removeEventListener("keydown", vs, { capture: !0 }), O.thirdPartyPopupEl = null, O.thirdPartyPopupElPressedEscape = !1;
}, bs = (e) => {
  const t = e.target, { thirdPartyPopupEl: n } = O;
  n && n.contains(t) || ve(V, (r) => {
    const { containerEl: s } = r;
    return s.contains(t) ? { continue: !1 } : { item: r, continue: !0 };
  }, (r) => {
    const { setOpen: s } = r;
    O.closedByEvents = !0, s(!1), Wt();
  });
}, vs = (e) => {
  e.key === "Escape" && (O.thirdPartyPopupElPressedEscape = !0);
};
let cn = !1, xn = !1, Ke = null, ws = 0, _n = null, kt = null;
const O = {
  closedBySetOpen: !1,
  documentClickTimeout: null,
  closedByEvents: !1,
  focusedMenuBtns: /* @__PURE__ */ new Set(),
  cursorKeysPrevEl: null,
  clickTarget: null,
  overlayMouseDown: !1,
  thirdPartyPopupEl: null,
  thirdPartyPopupElPressedEscape: !1
};
let mr = null;
const Es = () => {
  clearTimeout(mr), mr = window.setTimeout(() => {
    O.clickTarget = null;
  });
}, Wn = () => {
  document.removeEventListener("pointerup", Wn);
}, xs = (e) => {
  const t = e.target;
  O.clickTarget = t, document.addEventListener("pointerup", Wn);
}, _s = (e) => {
  const t = V[V.length - 1];
  setTimeout(() => {
    const r = e.timeStamp - ws;
    if (!document.hasFocus() && r < 50) {
      ve(V, (s) => ({ item: s, continue: !0 }), (s) => {
        const { setOpen: o } = s;
        O.closedByEvents = !0, o(!1);
      });
      return;
    }
  });
  const n = (r) => {
    if (r.overlay || r.overlayEl || !r.closeWhenDocumentBlurs)
      return;
    ge(r.menuBtnEls).focus(), O.closedByEvents = !0, r.setOpen(!1);
  };
  t.overlay || setTimeout(() => {
    const r = document.activeElement;
    if (!r || r.tagName !== "IFRAME") {
      ve(V, (s) => ({ item: s, continue: !0 }), (s) => n(s));
      return;
    }
    ve(V, (s) => {
      const { containerEl: o } = s;
      return o.contains(r) ? (kt = r, Cs(), document.addEventListener("visibilitychange", As), { continue: !1 }) : { item: s, continue: !0 };
    }, (s) => {
      const { setOpen: o } = s;
      O.closedByEvents = !0, o(!1);
    });
  });
}, Ht = (e) => {
  e.key === "Tab" && setTimeout(() => {
    const t = document.activeElement, n = V[0];
    document.removeEventListener("keydown", Ht), n && !n.menuBtnEls.some((r) => r && r.contains(t)) && ve(V, (r) => ({ item: r, continue: !0 }), (r) => {
      const { setOpen: s } = r;
      s(!1);
    });
  });
}, ks = (e) => {
  const { setOpen: t, menuBtnEls: n, cursorKeys: r, closeWhenEscapeKeyIsPressed: s, focusElementOnClose: o, ignoreMenuPopupWhenTabbing: i, focusSentinelAfterEl: c, focusSentinelBeforeEl: l, mountedPopupsSafeList: u } = V[V.length - 1];
  if (e.key === "Tab") {
    if (i) {
      e.preventDefault();
      const a = e.shiftKey, d = ge(n), h = he({
        from: a ? l : c,
        direction: a ? "backwards" : "forwards",
        ignoreElement: d ? [d] : []
      });
      h && h.focus();
      return;
    }
    ws = e.timeStamp;
  }
  if (r && wc(e), e.key !== "Escape" || !s)
    return;
  if (O.thirdPartyPopupElPressedEscape) {
    O.thirdPartyPopupElPressedEscape = !1, Wt();
    return;
  }
  if (u && u.length) {
    const a = yc(u);
    if (a) {
      window.setTimeout(() => {
        !a.isConnected || $t(a) || f();
      }, 100);
      return;
    }
  }
  function f() {
    const a = ge(n), d = se({}, {
      inputElement: o,
      type: "focusElementOnClose",
      subType: "escapeKey"
    }) || a;
    d && d.focus(), O.closedByEvents = !0, t(!1);
  }
  f();
}, Hn = (e) => {
  const t = e.target;
  _n !== t && ve(V, (n) => {
    const { menuPopupEl: r } = n;
    return r.contains(t) ? (_n = t, { continue: !1 }) : { item: n, continue: !0 };
  }, (n) => {
    const { setOpen: r, focusElementOnClose: s, menuBtnEls: o } = n, i = ge(o);
    O.closedByEvents = !0, r(!1);
    const c = se({}, {
      inputElement: s,
      type: "focusElementOnClose",
      subType: "scrolling"
    }) || i;
    c && c.focus();
  });
}, vc = (e) => {
  _n = null, !xn && e && (xn = !1, window.addEventListener("wheel", Hn, {
    capture: !0,
    passive: !0
  }), document.body.addEventListener("touchmove", Ss)), !V.length && (document.addEventListener("pointerdown", xs), document.addEventListener("pointerup", Wn), document.addEventListener("keydown", ks), window.addEventListener("blur", _s));
}, gr = () => {
  V.length || (xn = !1, O.cursorKeysPrevEl = null, O.clickTarget = null, window.clearTimeout(O.documentClickTimeout), O.documentClickTimeout = null, document.removeEventListener("keydown", ks), document.removeEventListener("pointerdown", xs), document.removeEventListener("keydown", Ht), window.removeEventListener("blur", _s), window.removeEventListener("wheel", Hn, {
    capture: !0
  }), document.body.removeEventListener("touchmove", Ss));
}, Ss = () => {
  cn || (cn = !0, document.body.addEventListener("touchend", () => {
    cn = !1;
  }, { once: !0 }), window.addEventListener("scroll", Hn, {
    capture: !0,
    passive: !0,
    once: !0
  }));
}, wc = (e) => {
  const t = ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"], n = ["ArrowLeft", "ArrowRight"];
  if (!t.includes(e.key) || (e.preventDefault(), n.includes(e.key)))
    return;
  const { menuBtnEls: r, menuPopupEl: s, containerEl: o, focusSentinelBeforeEl: i, focusSentinelAfterEl: c, cursorKeys: l } = V[V.length - 1], u = ge(r);
  let f = O.cursorKeysPrevEl || document.activeElement, a;
  e.key === "ArrowDown" ? a = "forwards" : a = "backwards", (f === u || f === s || f === o) && (e.key === "ArrowUp" ? (a = "backwards", f = c) : (a = "forwards", f = i));
  const d = typeof l == "object", h = d && l.wrap;
  let b = he({
    from: f,
    direction: a,
    stopAtRootElement: s
  });
  if (!b && h) {
    const m = e.key === "ArrowDown" ? i : c;
    a = e.key === "ArrowDown" ? "forwards" : "backwards", b = he({
      from: m,
      direction: a,
      stopAtRootElement: o
    });
  }
  if (d && l.onKeyDown) {
    l.onKeyDown({
      currentEl: b,
      prevEl: O.cursorKeysPrevEl
    }), O.cursorKeysPrevEl = b;
    return;
  }
  b && b.focus();
}, As = () => {
  if (document.visibilityState === "visible" && Ke != null) {
    Cs();
    return;
  }
  clearTimeout(Ke);
}, Cs = () => {
  const t = () => {
    const n = document.activeElement;
    if (n) {
      if (kt === n) {
        Ke = window.setTimeout(t, 250);
        return;
      }
      ve(V, (r) => {
        const { containerEl: s } = r;
        return n.tagName === "IFRAME" ? s && !s.contains(n) ? { item: r, continue: !0 } : (kt = n, Ke = window.setTimeout(t, 250), { continue: !1 }) : s && !s.contains(n) ? { item: r, continue: !0 } : { continue: !1 };
      }, (r) => {
        const { setOpen: s } = r;
        O.closedByEvents = !0, s(!1), kt = null, Ke = null, document.removeEventListener("visibilitychange", As);
      });
    }
  };
  Ke = window.setTimeout(t, 250);
}, Ec = (e) => {
  const { menuPopup: t } = e;
  e.menuPopupAdded || (e.menuPopupEl = se(e, {
    inputElement: t,
    type: "menuPopup"
  }), e.menuPopupEl && (e.menuPopupAdded = !0, e.menuPopupEl.setAttribute("tabindex", "-1")));
}, yr = (e) => {
  e.menuPopupEl && e.menuPopupAdded && (e.menuPopupEl = null, e.menuPopupAdded = !1);
}, xc = (e) => e.replace(/-./g, (t) => t.toUpperCase()[1]), kn = (e, t) => {
  const { onToggleScrollbar: n, removeScrollbar: r } = e;
  if (n) {
    if (t) {
      if (V.length > 1)
        return;
      n.onRemove();
    } else {
      if (V.length)
        return;
      n.onRestore();
    }
    return;
  }
  if (!r || V.length > 1)
    return;
  const s = document.scrollingElement;
  t ? s.style.overflow = "hidden" : s.style.overflow = "";
};
function _c(e) {
  requestAnimationFrame(() => {
    requestAnimationFrame(e);
  });
}
const kc = (e) => {
  let t, n = !0, r = !1, s, o = !1, i = !!e.overlay;
  const [c, l] = $(), [u, f] = $(), a = jt(() => e.children), { onBeforeEnter: d, onEnter: h, onAfterEnter: b, onBeforeExit: m, onExit: g, onAfterExit: E, appendToElement: w, appear: _, state: S } = e, { onBeforeEnter: B, onEnter: A, onAfterEnter: j, onBeforeExit: H, onExit: J, onAfterExit: G, appendToElement: k } = e.overlay || {}, p = (v) => v === "content" ? d : B, R = (v) => v === "content" ? h : A, T = (v) => v === "content" ? b : j, L = (v) => v === "content" ? m : H, X = (v) => v === "content" ? g : J, ie = (v) => v === "content" ? E : G;
  function D(v, z) {
    const de = (v === "content" ? e.name : e.overlay?.name) || "s", le = xc(z) + "Class", ye = (v === "content" ? e : e.overlay)[le];
    return ye ? ye.split(" ") : [`${de}-${z}`];
  }
  const W = (v, z) => {
    const Z = v === "content" ? w : k;
    return Z ? Z === "menuPopup" && v !== "overlay" ? se({ containerEl: z }, { inputElement: null, type: "menuPopup" }) : typeof Z == "string" ? z && z.querySelector(Z) : Z : z;
  };
  let ee, N;
  function y(v, z, Z) {
    if (o && (v === "content" ? ee() : N()), !n || e.appear) {
      let fe = function(Ye) {
        q && (!Ye || Ye.target === q) && (q.removeEventListener("transitionend", fe), q.removeEventListener("animationend", fe), q.classList.remove(...Le), q.classList.remove(...Re), Dr(() => {
          const Jt = r ? s : z;
          c() !== Jt && l(Jt), u() === Jt && f(void 0);
        }), ye && ye(q), e.mode === "inout" && P(v, q, Z));
      };
      var de = fe;
      const le = R(v), ne = p(v), ye = T(v), Ce = D(v, "enter"), Le = D(v, "enter-active"), Re = D(v, "enter-to"), q = W(v, z);
      ne && ne(q), q.classList.add(...Ce), q.classList.add(...Le), requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          q.classList.remove(...Ce), q.classList.add(...Re);
        }), le && le(q, () => fe()), requestAnimationFrame(() => {
          (!le || le.length < 2) && (q.addEventListener("transitionend", fe), q.addEventListener("animationend", fe));
        });
      });
    }
    if (v === "content") {
      const le = r ? s : z;
      Z && !e.mode ? f(le) : l(le);
    }
  }
  function P(v, z, Z) {
    o = !0;
    const de = X(v), le = L(v), ne = ie(v), ye = D(v, "exit"), Ce = D(v, "exit-active"), Le = D(v, "exit-to"), Re = W(v, z), q = W(v, Z);
    if (!q.parentNode)
      return fe();
    le && le(q), q.classList.add(...ye), q.classList.add(...Ce), _c(() => {
      q.classList.remove(...ye), q.classList.add(...Le);
    }), de && de(q, () => fe()), (!de || de.length < 2) && (q.addEventListener("transitionend", fe), q.addEventListener("animationend", fe));
    function fe(Ye) {
      (!Ye || Ye.target === q) && (o = !1, q.removeEventListener("transitionend", fe), q.removeEventListener("animationend", fe), v === "content" && (q.classList.remove(...Ce), q.classList.remove(...Le)), v === "content" && (r && (Z.parentElement.remove(), kn(S, !1)), c() === Z && l(void 0)), ne && ne(q), e.mode === "outin" && y(v, Re, q));
    }
    v === "content" ? ee = fe : N = fe;
  }
  return Tt((v) => {
    for (t = a(); typeof t == "function"; )
      t = t();
    if (t && t.nodeType === 3) {
      r = !0, s = t, s.willRemove = !1;
      const z = t.portalContainerChild;
      if (i) {
        const Z = t.portalOverlay;
        Object.defineProperty(z, "portalOverlay", {
          get() {
            return Z;
          },
          configurable: !0
        });
      }
      t = z;
    }
    return ce(() => (t && t !== v && (e.mode !== "outin" ? (y("content", t, v), i && y(
      "overlay",
      // @ts-ignore
      t.portalOverlay,
      // @ts-ignore
      v && v.portalOverlay
    )) : n && l(r ? s : t)), v && v !== t && e.mode !== "inout" && (P("content", t, v), i && P("overlay", t && t.portalOverlay, v.portalOverlay)), n = !1, t));
  }), [c, u];
}, br = (e, { isCleanup: t = !1 } = {}) => {
  mc(e, t);
}, Sc = (e, t) => {
  const { overlayElement: n, trapFocus: r, timeouts: s, closeWhenDocumentBlurs: o, mountedPopupsSafeList: i } = e;
  if (Sn = !1, queueMicrotask(() => {
    Es();
  }), O.thirdPartyPopupEl && Wt(), O.closedBySetOpen || O.overlayMouseDown || n && r || !o && !document.hasFocus())
    return;
  const c = V.length;
  Oc(s, () => {
    if (i && gc(i)) {
      bc();
      return;
    }
    c < V.length || (O.closedByEvents = !0, ve(V, (l) => {
      const { containerEl: u, closeWhenClickingOutside: f } = l, a = O.clickTarget;
      return !f && a ? (document.addEventListener("keydown", Ht), { continue: !1 }) : a && u.contains(a) ? { continue: !1 } : u.contains(document.activeElement) ? { continue: !1 } : { item: l, continue: !0 };
    }, (l) => {
      const { setOpen: u } = l;
      u(!1);
    }));
  });
}, Ac = (e, t) => {
  const { timeouts: n } = e;
  clearTimeout(n.containerFocusTimeoutId), clearTimeout(n.menuButtonBlurTimeoutId);
}, Cc = (e) => {
  const { focusElementOnOpen: t, focusedMenuBtn: n } = e;
  if (t == null)
    return;
  const r = se(e, {
    inputElement: t,
    type: "focusElementOnOpen"
  });
  r && setTimeout(() => {
    const s = ys(t) ? (
      // @ts-ignore
      !!t.preventScroll
    ) : r === e.menuPopupEl;
    r.focus({ preventScroll: s }), n.el = null;
  });
};
let Sn = !1;
const Oc = (e, t) => {
  e.containerFocusTimeoutId = window.setTimeout(() => {
    Sn || (Sn = !0, t());
  });
}, Tc = () => {
  O.overlayMouseDown = !0;
}, Bc = () => {
  O.overlayMouseDown = !1;
}, Pc = (e) => {
  const { closeWhenOverlayClicked: t, menuPopupEl: n, focusElementOnClose: r, menuBtnEls: s } = e;
  if (O.overlayMouseDown = !1, !t) {
    n.focus({ preventScroll: !0 });
    return;
  }
  const o = ge(s), i = se(e, {
    inputElement: r,
    type: "focusElementOnClose",
    subType: "click"
  }) || o;
  i && i.focus(), ve(V, (c) => c.overlayElement ? { continue: !1 } : { item: c, continue: !0 }, (c) => {
    const { setOpen: l } = c;
    O.closedByEvents = !0, l(!1);
  }), O.closedByEvents = !0, e.setOpen(!1);
}, Lc = ({ parent: e, matchEl: t }) => {
  if (e === t)
    return !0;
  const n = (r) => {
    if (!r)
      return !1;
    const s = r.children[0];
    return s === t ? !0 : n(s);
  };
  return n(e);
}, Rc = (e) => {
  const { enableLastFocusSentinel: t, menuBtnEls: n, containerEl: r, focusSentinelAfterEl: s } = e;
  if (t) {
    s.setAttribute("tabindex", "0");
    return;
  }
  if (!n)
    return;
  const i = ge(n).nextElementSibling;
  Lc({
    parent: i,
    matchEl: r
  }) || s.setAttribute("tabindex", "0");
}, vr = (e, t, n) => {
  const { uniqueId: r, containerEl: s, menuBtnEls: o, focusSentinelBeforeEl: i, trapFocus: c, focusSentinelAfterEl: l, closeWhenMenuButtonIsTabbed: u, focusElementOnClose: f, mount: a, open: d, setOpen: h } = e, b = ge(o);
  V.forEach((E) => window.clearTimeout(E.timeouts.containerFocusTimeoutId));
  const m = (E, w) => {
    ve(V, (_) => w && ge(_.menuBtnEls) === E && !_.closeWhenMenuButtonIsTabbed ? { continue: !1 } : _.uniqueId === r || !_.containerEl.contains(E) ? { item: _, continue: !0 } : { continue: !1 }, (_) => {
      O.closedByEvents = !0, _.setOpen(!1);
    }), E && E.focus();
  };
  if (!d())
    return;
  if (b && (n === s || n === b)) {
    he({
      from: i,
      direction: "forwards",
      stopAtRootElement: s
    }).focus();
    return;
  }
  if (t === "before") {
    if (c) {
      he({
        from: l,
        direction: "backwards",
        stopAtRootElement: s
      }).focus();
      return;
    }
    if (u) {
      O.closedByEvents = !0, h(!1), b.focus();
      return;
    }
    const E = se(e, {
      inputElement: f,
      type: "focusElementOnClose",
      subType: "tabBackwards"
    }) || b;
    if (!e.menuBtnEls) {
      E.focus();
      return;
    }
    m(E, !0);
    return;
  }
  if (c) {
    he({
      from: i,
      stopAtRootElement: s
    }).focus();
    return;
  }
  const g = se(e, {
    inputElement: f,
    type: "focusElementOnClose",
    subType: "tabForwards"
  }) || he({
    from: b,
    ignoreElement: [s]
  });
  if (a) {
    m(g);
    return;
  }
  g && g.focus(), O.closedByEvents = !0, h(!1);
}, Ic = "http://www.w3.org/2000/svg";
function $c(e, t = !1) {
  return t ? document.createElementNS(Ic, e) : document.createElement(e);
}
function Mc(e) {
  const {
    useShadow: t,
    isModal: n
  } = e, r = document.createTextNode(""), s = e.mount || document.body;
  function o() {
    if (I.context) {
      const [i, c] = $(!1);
      return queueMicrotask(() => c(!0)), () => i() && e.children;
    } else return () => e.children;
  }
  if (s instanceof HTMLHeadElement) {
    const [i, c] = $(!1), l = () => c(!0);
    Me((u) => K(s, () => i() ? u() : o()(), null)), xe(() => {
      I.context ? queueMicrotask(l) : l();
    });
  } else {
    const i = $c(e.isSVG ? "g" : "div", e.isSVG), c = t && i.attachShadow ? i.attachShadow({
      mode: "open"
    }) : i, l = {
      get() {
        return r.parentNode;
      },
      configurable: !0
    };
    Object.defineProperty(i, "host", l), Object.defineProperty(i, "_$host", l), Object.defineProperty(r, "portalContainerChild", {
      get() {
        return u ? i.children[1] : i.firstElementChild;
      },
      configurable: !0
    }), Object.defineProperty(r, "portalContainer", {
      get() {
        return i;
      },
      configurable: !0
    }), Object.defineProperty(r, "portalMount", {
      get() {
        return s;
      },
      configurable: !0
    }), r.willRemove = !0, K(c, o());
    const u = e.overlayChildren;
    u && (Object.defineProperty(r, "portalOverlay", {
      get() {
        return u;
      },
      configurable: !0
    }), i.insertAdjacentElement("afterbegin", u)), s.appendChild(i), e.ref && e.ref(i), xe(() => {
      r.willRemove && s.removeChild(i);
    });
  }
  return r;
}
var Nc = /* @__PURE__ */ F("<div role=presentation>"), Fc = /* @__PURE__ */ F("<div><div style=position:fixed;top:0;left:0;outline:none;pointer-events:none;width:0;height:0; aria-hidden=true></div><div style=position:fixed;top:0;left:0;outline:none;pointer-events:none;width:0;height:0; aria-hidden=true>");
const wr = (e) => {
  const t = e.modal || !1, {
    id: n,
    menuButton: r,
    menuPopup: s,
    focusElementOnClose: o,
    focusElementOnOpen: i = t ? "menuPopup" : void 0,
    focusMenuButtonOnMouseDown: c = !0,
    cursorKeys: l = !1,
    closeWhenMenuButtonIsTabbed: u = !1,
    closeWhenMenuButtonIsClicked: f = !0,
    closeWhenScrolling: a = !1,
    closeWhenDocumentBlurs: d = !1,
    closeWhenOverlayClicked: h = !0,
    closeWhenEscapeKeyIsPressed: b = !0,
    closeWhenClickingOutside: m = !0,
    overlay: g = t,
    overlayElement: E = t,
    trapFocus: w = t,
    removeScrollbar: _ = t,
    enableLastFocusSentinel: S = !1,
    mount: B = t ? "body" : void 0,
    // stopComponentEventPropagation = false,
    show: A = !1,
    onToggleScrollbar: j,
    onOpen: H,
    deadMenuButton: J,
    ignoreMenuPopupWhenTabbing: G,
    mountedPopupsSafeList: k
  } = e, p = {
    mount: B,
    modal: t,
    addedFocusOutAppEvents: !1,
    closeWhenOverlayClicked: h,
    closeWhenDocumentBlurs: d,
    closeWhenEscapeKeyIsPressed: b,
    closeWhenMenuButtonIsClicked: f,
    closeWhenMenuButtonIsTabbed: u,
    closeWhenScrolling: a,
    closeWhenClickingOutside: m,
    cursorKeys: l,
    focusElementOnClose: o,
    focusMenuButtonOnMouseDown: c,
    deadMenuButton: J,
    focusElementOnOpen: i,
    ignoreMenuPopupWhenTabbing: G,
    // @ts-ignore
    id: n,
    uniqueId: ao(),
    menuBtnId: "",
    focusedMenuBtn: {
      el: null
    },
    menuBtnKeyupTabFired: !1,
    menuButton: r,
    timeouts: {
      containerFocusTimeoutId: null,
      menuButtonBlurTimeoutId: null
    },
    upperStackRemovedByFocusOut: !1,
    menuPopup: s,
    closeByDismissEvent: !1,
    menuPopupAdded: !1,
    enableLastFocusSentinel: S,
    overlay: g,
    overlayElement: E,
    onToggleScrollbar: j,
    removeScrollbar: _,
    trapFocus: w,
    hasFocusSentinels: !!o || g || !!E || w || S,
    mountedPopupsSafeList: k,
    open: e.open,
    setOpen: e.setOpen,
    onClickOutsideMenuButtonRef: () => lc(p),
    onClickOverlayRef: () => Pc(p),
    onFocusInContainerRef: (y) => Ac(p),
    onFocusOutContainerRef: (y) => Sc(p),
    onBlurMenuButtonRef: (y) => ic(p, y),
    onClickMenuButtonRef: (y) => oc(p, y),
    onMouseDownMenuButtonRef: (y) => cc(p, y),
    onFocusMenuButtonRef: (y) => uc(p, y),
    onKeydownMenuButtonRef: (y) => ac(p, y),
    refContainerCb: (y) => {
      if (E && (y.style.zIndex = "1000", t)) {
        y.style.pointerEvents = "none", y.style.position = "relative";
        const P = (v) => {
          v.id || (v.id = p.uniqueId), v.style.pointerEvents = "all", v.setAttribute("role", "dialog");
        };
        requestAnimationFrame(() => {
          const v = y.querySelector('[role="dialog"]');
          if (!v) {
            const z = y.children;
            if (!z) return;
            const Z = z[1];
            P(Z);
            return;
          }
          P(v);
        });
      }
      e.ref && e.ref(y), p.containerEl = y;
    },
    refOverlayCb: (y) => {
      y.style.position = "fixed", y.style.top = "0", y.style.left = "0", y.style.width = "100%", y.style.height = "calc(100% + 100px)", y.style.zIndex = "1000", typeof E == "object" && E.ref && E.ref(y), p.overlayEl = y;
    }
  }, R = !e.open(), T = () => {
    const y = document.activeElement;
    if (y !== document.body && p.menuBtnEls.every((le) => y !== le) && !p.containerEl?.contains(y))
      return;
    const {
      menuBtnEls: P,
      focusedMenuBtn: v,
      timeouts: z
    } = p, Z = ge(P), de = se(p, {
      inputElement: o,
      type: "focusElementOnClose",
      subType: "click"
    }) || Z;
    de && de.focus();
  }, L = () => typeof B == "string" ? document.querySelector(B) : B, X = () => {
    if (O.closedByEvents) return;
    const y = document.activeElement;
    if (
      // activeElement !== state.menuBtnEls
      p.menuBtnEls.every((P) => y !== P) && !p.containerEl?.contains(y)
    ) {
      setTimeout(() => {
        O.closedBySetOpen = !1;
      });
      return;
    }
    O.closedBySetOpen || (O.closedBySetOpen = !0, setTimeout(() => {
      O.closedBySetOpen = !1, T();
    }));
  };
  Tt(We(() => !!e.open(), (y, P) => {
    y !== P && (y || (p.focusSentinelAfterEl && (p.focusSentinelAfterEl.tabIndex = -1), X()));
  }, {
    defer: R
  })), Te(We(() => typeof e.menuButton == "function" ? e.menuButton() : e.menuButton, (y) => {
    fc({
      state: p,
      menuButton: y,
      open: e.open
    }), xe(() => {
    });
  })), Te(We(() => !!e.open(), (y, P) => {
    y !== P && (y ? (O.closedByEvents = !1, Ec(p), Cc(p), hc(p), vc(a), rc({
      // @ts-ignore
      id: n,
      uniqueId: p.uniqueId,
      open: e.open,
      setOpen: e.setOpen,
      containerEl: p.containerEl,
      menuBtnEls: p.menuBtnEls,
      focusedMenuBtn: p.focusedMenuBtn,
      overlayEl: p.overlayEl,
      menuPopupEl: p.menuPopupEl,
      overlay: g,
      closeWhenDocumentBlurs: d,
      closeWhenEscapeKeyIsPressed: b,
      closeWhenMenuButtonIsTabbed: u,
      closeWhenClickingOutside: m,
      overlayElement: E,
      cursorKeys: l,
      focusElementOnClose: o,
      focusSentinelBeforeEl: p.focusSentinelBeforeEl,
      focusSentinelAfterEl: p.focusSentinelAfterEl,
      ignoreMenuPopupWhenTabbing: G,
      upperStackRemovedByFocusOut: !1,
      detectIfMenuButtonObscured: !1,
      queueRemoval: !1,
      mountedPopupsSafeList: p.mountedPopupsSafeList,
      timeouts: p.timeouts
    }), H && H(y, {
      uniqueId: p.uniqueId,
      dismissStack: V
    }), kn(p, y), Rc(p)) : (pc(p), O.closedByEvents = !1, br(p), yr(p), dr(p.uniqueId), gr(), Wt(), H && H(y, {
      uniqueId: p.uniqueId,
      dismissStack: V
    }), e.animation || kn(p, y)));
  }, {
    defer: R
  })), xe(() => {
    br(p, {
      isCleanup: !0
    }), yr(p), dr(p.uniqueId), gr();
  });
  function ie() {
    return typeof e.overlayElement == "object" && e.overlayElement.element ? e.overlayElement.element : (() => {
      var y = Nc(), P = p.refOverlayCb;
      return typeof P == "function" ? ke(P, y) : p.refOverlayCb = y, Ve(y, "mouseup", Bc, !0), Ve(y, "mousedown", Tc, !0), Ve(y, "click", p.onClickOverlayRef, !0), oe((v) => {
        var z = typeof e.overlayElement == "object" ? e.overlayElement.class : void 0, Z = typeof e.overlayElement == "object" ? e.overlayElement.classList || {} : {};
        return z !== v.e && He(y, v.e = z), v.t = Rt(y, Z, v.t), v;
      }, {
        e: void 0,
        t: void 0
      }), y;
    })();
  }
  function D(y) {
    return (() => {
      var P = Fc(), v = P.firstChild, z = v.nextSibling, Z = p.refContainerCb;
      typeof Z == "function" ? ke(Z, P) : p.refContainerCb = P, Ve(P, "focusout", p.onFocusOutContainerRef, !0), Ve(P, "focusin", p.onFocusInContainerRef, !0);
      var de = p.focusSentinelBeforeEl;
      typeof de == "function" ? ke(de, v) : p.focusSentinelBeforeEl = v, v.addEventListener("focus", (ne) => {
        vr(p, "before", ne.relatedTarget);
      }), K(P, y, z);
      var le = p.focusSentinelAfterEl;
      return typeof le == "function" ? ke(le, z) : p.focusSentinelAfterEl = z, z.addEventListener("focus", () => {
        vr(p, "after");
      }), oe((ne) => {
        var ye = p.id, Ce = e.class, Le = e.classList || {}, Re = e.open() ? "0" : "-1", q = e.open() && p.hasFocusSentinels ? "0" : "-1";
        return ye !== ne.e && te(P, "id", ne.e = ye), Ce !== ne.t && He(P, ne.t = Ce), ne.a = Rt(P, Le, ne.a), Re !== ne.o && te(v, "tabindex", ne.o = Re), q !== ne.i && te(z, "tabindex", ne.i = q), ne;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0,
        i: void 0
      }), P;
    })();
  }
  if (A) return D(e.children);
  let W = !1;
  const ee = Y(() => e.open(), !1, {
    equals: (y, P) => W ? y === P : !y == !P
  }), N = Y(() => {
    const y = ee();
    if (y) {
      const P = e.children, v = typeof P == "function" && P.length > 0;
      return W = v, v ? ce(() => P(y)) : B ? C(Mc, {
        get mount() {
          return L();
        },
        get overlayChildren() {
          return E ? ie() : null;
        },
        get children() {
          return D(P);
        }
      }) : D(P);
    }
  });
  return e.animation ? C(kc, it(() => e.animation, {
    get name() {
      return e.animation.name;
    },
    get enterClass() {
      return e.animation.enterClass;
    },
    get enterActiveClass() {
      return e.animation.enterActiveClass;
    },
    get enterToClass() {
      return e.animation.enterToClass;
    },
    get exitClass() {
      return e.animation.exitClass;
    },
    get exitActiveClass() {
      return e.animation.exitActiveClass;
    },
    get exitToClass() {
      return e.animation.exitToClass;
    },
    get appear() {
      return e.animation.appear;
    },
    get overlay() {
      return typeof e.overlayElement == "object" ? e.overlayElement.animation : void 0;
    },
    state: p,
    get children() {
      return N();
    }
  })) : N;
};
Pe(["click", "mousedown", "mouseup", "focusin", "focusout"]);
var Dc = /* @__PURE__ */ F("<svg>");
const Ue = (e) => {
  const [t, n] = Wr(e, ["path"]);
  return (() => {
    var r = Dc();
    return $n(r, it({
      get viewBox() {
        return t.path.mini ? "0 0 20 20" : "0 0 24 24";
      },
      get fill() {
        return t.path.outline ? "none" : "currentColor";
      },
      get stroke() {
        return t.path.outline ? "currentColor" : "none";
      },
      get "stroke-width"() {
        return t.path.outline ? 1.5 : void 0;
      }
    }, n), !0, !0), K(r, () => t.path.path), r;
  })();
};
var qc = /* @__PURE__ */ F('<svg><path stroke-linecap=round stroke-linejoin=round d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"></svg>', !1, !0, !1), jc = /* @__PURE__ */ F('<svg><path stroke-linecap=round stroke-linejoin=round d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"></svg>', !1, !0, !1), Uc = /* @__PURE__ */ F('<svg><path stroke-linecap=round stroke-linejoin=round d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z"></svg>', !1, !0, !1), Vc = /* @__PURE__ */ F('<svg><path stroke-linecap=round stroke-linejoin=round d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25"></svg>', !1, !0, !1), Kc = /* @__PURE__ */ F('<svg><path stroke-linecap=round stroke-linejoin=round d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"></svg>', !1, !0, !1), Wc = /* @__PURE__ */ F('<svg><path stroke-linecap=round stroke-linejoin=round d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></svg>', !1, !0, !1);
const Hc = {
  path: () => qc(),
  outline: !0,
  mini: !1
}, zc = {
  path: () => jc(),
  outline: !0,
  mini: !1
}, Qc = {
  path: () => Uc(),
  outline: !0,
  mini: !1
}, Jc = {
  path: () => Vc(),
  outline: !0,
  mini: !1
}, Gc = {
  path: () => Kc(),
  outline: !0,
  mini: !1
}, Yc = {
  path: () => Wc(),
  outline: !0,
  mini: !1
};
var Xc = /* @__PURE__ */ F('<img class="h-8 w-8 rounded-full"crossorigin=anonymous>'), Zc = /* @__PURE__ */ F("<button>"), el = /* @__PURE__ */ F('<img class="h-10 w-10 rounded-full border-`1 border-neutral-200 dark:border-neutral-600 shadow-md"crossorigin=anonymous>'), tl = /* @__PURE__ */ F('<div class="dark:bg-neutral-900 absolute right-0 flex flex-col items-left justify-center bg-neutral-100 rounded-lg w-60 border border-neutral-600 dark:text-neutral-100 shadow-lg"> <div class="flex space-x-3 px-2 py-4 border-b border-neutral-600"> <div class=text-left> <p class="text-sm font-semibold text-gray-800 dark:text-gray-100"> <br><span class="text-xs text-gray-600 dark:text-gray-400 capitalize"></span></p></div></div><button class="flex items-center gap-2 px-4 py-2 text-left text-neutral-100 hover:bg-neutral-800"> Profile</button><button class="flex items-center gap-2 px-4 py-2 text-left text-neutral-100 hover:bg-neutral-800"> Sign Out'), nl = /* @__PURE__ */ F('<header class="dark:bg-neutral-900 border-b z-12 sticky top-0 flex items-center bg-white gap-x-4 border-slate-200 p-1 px-2 text-sm dark:border-neutral-800 mb-1"><button type=button class="visible relative ml-auto rounded px-3 py-2 opacity-80 hover:opacity-100 md:hidden"title="Mobile Menu Button"><span class=sr-only>Show menu</span></button><div class="relative h-8 cursor-pointer leading-snug">'), rl = /* @__PURE__ */ F('<h1 class="leading-0 uppercase tracking-widest"><b>Project</b> Board'), sl = /* @__PURE__ */ F('<a class="bg-neutral-800 mx-1 rounded px-3 py-2 text-lg text-slate-50"href=/login rel=external>Login'), ol = /* @__PURE__ */ F('<div class="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold uppercase">'), il = /* @__PURE__ */ F('<div class="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold uppercase border-2 border-gray-200 dark:border-gray-600 shadow-md">');
const zn = (e) => {
  const [t, n] = $(!1), r = qe(), [s, o] = $(!1), [i, c] = $(!1), [l, u] = $(!1), [f, a] = $("");
  let d, h;
  const b = Ae();
  window.addEventListener("resize", m), xe(() => {
    window.removeEventListener("resize", m);
  });
  function m() {
    o(!1);
  }
  function g() {
    console.log("Profile");
  }
  Te(async () => {
    r.user()?.email && (r.user()?.image && a(r.user()?.image), u(!0));
  });
  const E = async () => {
    try {
      await fetch(`${ze}/auth/logout`, {
        method: "POST",
        credentials: "include"
        // Ensures cookies are sent with the request
      }), localStorage.removeItem("token"), localStorage.removeItem("user"), u(!1), location.reload(), b("/login");
    } catch (w) {
      console.error("Logout failed:", w);
    }
  };
  return (() => {
    var w = nl(), _ = w.firstChild, S = _.firstChild, B = _.nextSibling;
    K(w, () => e.children || C(en, {
      href: "/",
      class: "flex cursor-alias flex-row items-center space-x-2 rounded px-2 py-2 opacity-80 hover:opacity-100 md:px-1",
      get children() {
        return rl();
      }
    }), _), K(w, C(wr, {
      get classList() {
        return {
          "absolute top-[53px] right-[10px] w-[fit-content] z-10": s(),
          "shadow-md flex flex-col justify-center bg-white dark:bg-solid-darkbg": s(),
          hidden: !s()
        };
      },
      class: "ml-auto md:flex md:flex-row md:items-center md:space-x-2",
      menuButton: () => d,
      open: s,
      setOpen: o,
      show: !0,
      get children() {
        return [C(en, {
          href: "/dashboard",
          class: "flex cursor-alias flex-row items-center space-x-2 rounded px-2 py-2 opacity-80 hover:opacity-100 md:px-1",
          get children() {
            return C(Ue, {
              path: Jc,
              class: "h-6"
            });
          }
        }), C(en, {
          href: "/terminal",
          class: "flex cursor-alias flex-row items-center space-x-2 rounded px-2 py-2 opacity-80 hover:opacity-100 md:px-1",
          get children() {
            return C(Ue, {
              path: Qc,
              class: "h-6"
            });
          }
        })];
      }
    }), _);
    var A = d;
    return typeof A == "function" ? ke(A, _) : d = _, K(_, C($e, {
      get when() {
        return s();
      },
      get fallback() {
        return C(Ue, {
          path: zc,
          class: "h-6 w-6"
        });
      },
      get children() {
        return C(Ue, {
          path: Yc,
          class: "h-[22px] w-[22px]"
        });
      }
    }), S), K(B, C($e, {
      get when() {
        return l();
      },
      get fallback() {
        return sl();
      },
      get children() {
        return [(() => {
          var j = Zc(), H = h;
          return typeof H == "function" ? ke(H, j) : h = j, K(j, C($e, {
            get when() {
              return r.user()?.image;
            },
            get fallback() {
              return (() => {
                var J = ol();
                return K(J, () => r.user()?.name?.[0] || r.user()?.email?.[0] || "U"), J;
              })();
            },
            get children() {
              var J = Xc();
              return oe((G) => {
                var k = `${ze}/file/proxy?url=${encodeURIComponent(r.user()?.image || "")}`, p = r.user()?.name;
                return k !== G.e && te(J, "src", G.e = k), p !== G.t && te(J, "alt", G.t = p), G;
              }, {
                e: void 0,
                t: void 0
              }), J;
            }
          })), j;
        })(), C(wr, {
          menuButton: () => h,
          open: i,
          setOpen: c,
          get children() {
            var j = tl(), H = j.firstChild, J = H.nextSibling, G = J.firstChild, k = G.nextSibling, p = k.firstChild, R = p.nextSibling, T = R.firstChild, L = T.nextSibling, X = L.nextSibling, ie = J.nextSibling, D = ie.firstChild, W = ie.nextSibling, ee = W.firstChild;
            return K(J, C($e, {
              get when() {
                return r.user()?.image;
              },
              get fallback() {
                return (() => {
                  var N = il();
                  return K(N, () => r.user()?.name?.[0] || r.user()?.email?.[0] || "U"), N;
                })();
              },
              get children() {
                var N = el();
                return oe((y) => {
                  var P = `${ze}/file/proxy?url=${encodeURIComponent(r.user()?.image || "")}`, v = r.user()?.name;
                  return P !== y.e && te(N, "src", y.e = P), v !== y.t && te(N, "alt", y.t = v), y;
                }, {
                  e: void 0,
                  t: void 0
                }), N;
              }
            }), k), K(R, () => r.user()?.name || r.user()?.email || "User", T), K(X, () => r.user()?.role || "Member"), ie.$$click = g, K(ie, C(Ue, {
              path: Gc,
              class: "h-7"
            }), D), W.$$click = E, K(W, C(Ue, {
              path: Hc,
              class: "h-7"
            }), ee), j;
          }
        })];
      }
    })), oe((j) => Rt(_, {
      "border-white border": s()
    }, j)), w;
  })();
};
Pe(["click"]);
var cl = /* @__PURE__ */ F('<div class="flex h-screen flex-col bg-white dark:bg-neutral-900/5 dark:text-white rounded-md"><div class="flex-1 overflow-auto scroll-smooth px-4 py-2 text-sm "><div id=outputMessage class="my-2 px-4 py-2"><pre class="font-normal whitespace-pre-wrap"></pre></div></div><div class="relative flex items-center justify-between gap-2 pb-4"><span>$</span><input type=text autofocus>'), ll = /* @__PURE__ */ F("<pre>"), al = /* @__PURE__ */ F('<div class="z-10 rounded-md border border-neutral-600 bg-neutral-900 text-sm text-white shadow-lg"><div class="flex flex-col text-left">'), ul = /* @__PURE__ */ F('<button class="flex items-center gap-2 px-4 py-2 text-left text-neutral-100 hover:bg-neutral-800">'), fl = /* @__PURE__ */ F('<svg xmlns=http://www.w3.org/2000/svg width=24 height=24 viewBox="0 0 24 24"><path fill=#fff d="m20.713 8.128l-.246.566a.506.506 0 0 1-.934 0l-.246-.566a4.36 4.36 0 0 0-2.22-2.25l-.759-.339a.53.53 0 0 1 0-.963l.717-.319a4.37 4.37 0 0 0 2.251-2.326l.253-.611a.506.506 0 0 1 .942 0l.253.61a4.37 4.37 0 0 0 2.25 2.327l.718.32a.53.53 0 0 1 0 .962l-.76.338a4.36 4.36 0 0 0-2.219 2.251M12 4a8 8 0 1 0 7.944 7.045l1.986-.236Q22 11.396 22 12c0 5.523-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2c.861 0 1.699.11 2.498.315L14 4.252A8 8 0 0 0 12 4m1 7h3l-5 7v-5H8l5-7z">'), dl = /* @__PURE__ */ F('<svg xmlns=http://www.w3.org/2000/svg width=24 height=24 viewBox="0 0 24 24"><path fill=none stroke=#fff d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2M7 7h10M7 12h10M7 17h6">'), hl = /* @__PURE__ */ F('<svg xmlns=http://www.w3.org/2000/svg width=24 height=24 viewBox="0 0 512 512"><path fill=#fff fill-rule=evenodd d="M256 42.667C138.18 42.667 42.667 138.179 42.667 256c0 117.82 95.513 213.334 213.333 213.334c117.822 0 213.334-95.513 213.334-213.334S373.822 42.667 256 42.667m0 384c-94.105 0-170.666-76.561-170.666-170.667S161.894 85.334 256 85.334c94.107 0 170.667 76.56 170.667 170.666S350.107 426.667 256 426.667m26.714-256c0 15.468-11.262 26.667-26.497 26.667c-15.851 0-26.837-11.2-26.837-26.963c0-15.15 11.283-26.37 26.837-26.37c15.235 0 26.497 11.22 26.497 26.666m-48 64h42.666v128h-42.666z">'), pl = /* @__PURE__ */ F('<svg xmlns=http://www.w3.org/2000/svg width=24 height=24 viewBox="0 0 24 24"><path fill=#fff d="M4 21h9.62a4 4 0 0 0 3.037-1.397l5.102-5.952a1 1 0 0 0-.442-1.6l-1.968-.656a3.04 3.04 0 0 0-2.823.503l-3.185 2.547l-.617-1.235A3.98 3.98 0 0 0 9.146 11H4c-1.103 0-2 .897-2 2v6c0 1.103.897 2 2 2m0-8h5.146c.763 0 1.448.423 1.789 1.105l.447.895H7v2h6.014a1 1 0 0 0 .442-.11l.003-.001l.004-.002h.003l.002-.001h.004l.001-.001c.009.003.003-.001.003-.001c.01 0 .002-.001.002-.001h.001l.002-.001l.003-.001l.002-.001l.002-.001l.003-.001l.002-.001c.003 0 .001-.001.002-.001l.003-.002l.002-.001l.002-.001l.003-.001l.002-.001h.001l.002-.001h.001l.002-.001l.002-.001c.009-.001.003-.001.003-.001l.002-.001a1 1 0 0 0 .11-.078l4.146-3.317c.262-.208.623-.273.94-.167l.557.186l-4.133 4.823a2.03 2.03 0 0 1-1.52.688H4zM16 2h-.017c-.163.002-1.006.039-1.983.705c-.951-.648-1.774-.7-1.968-.704L12.002 2h-.004c-.801 0-1.555.313-2.119.878C9.313 3.445 9 4.198 9 5s.313 1.555.861 2.104l3.414 3.586a1.006 1.006 0 0 0 1.45-.001l3.396-3.568C18.688 6.555 19 5.802 19 5s-.313-1.555-.878-2.121A2.98 2.98 0 0 0 16.002 2zm1 3c0 .267-.104.518-.311.725L14 8.55l-2.707-2.843C11.104 5.518 11 5.267 11 5s.104-.518.294-.708A.98.98 0 0 1 11.979 4c.025.001.502.032 1.067.485q.121.098.247.222l.707.707l.707-.707q.126-.124.247-.222c.529-.425.976-.478 1.052-.484a1 1 0 0 1 .701.292c.189.189.293.44.293.707">');
function ml() {
  const [e, t] = $([]), [n, r] = $(null), [s, o] = $(""), [i, c] = $("/home/your-username"), [l, u] = $(""), [f, a] = $("Disconnected"), [d, h] = $(!1), [b, m] = $({
    x: 0,
    y: 0
  }), [g, E] = $([]);
  Fn(), Ae(), dt(), qe();
  let w, _;
  _ && (_.disabled = !0);
  const S = ["Switch to AI", "Documentation", "Donate", "About"], B = (k) => {
    E(S.filter((p) => p.toLowerCase().includes(k.toLowerCase().slice(1))));
  }, A = (k) => {
    const p = k.currentTarget.value;
    if (o(p), p.startsWith("/")) {
      const R = k.currentTarget.getBoundingClientRect();
      m({
        x: R.left,
        y: R.bottom
      }), h(!0), B(p);
    } else
      h(!1);
  }, j = () => {
    w && (w.scrollTop = w.scrollHeight);
  }, H = (k, p) => {
    if (k === "outputMessage" || k === "error" && p === "Authentication required") {
      const T = document.getElementById("outputMessage");
      T && (T.innerHTML = `<pre class="${k === "error" ? "text-red-500" : "text-yellow-500"} font-light whitespace-pre-wrap">${p}</pre>`);
      return;
    }
    const R = e()[e().length - 1];
    R && R.content === p || (t((T) => [...T, {
      type: k,
      content: p
    }]), j());
  }, J = () => {
    s() && (H("message", "Processing..."), n()?.emit("exec", s()), o(""));
  };
  Ln(() => {
    const k = _t("http://localhost:5000/terminal", {
      transports: ["websocket"],
      withCredentials: !0
    });
    r(k), k.on("connect", () => {
      a("Connected"), _ && (_.disabled = !1);
    }), k.on("connect_error", (p) => {
      console.error("Connection Error:", p.message), _ && (_.disabled = !0), a("Disconnected");
    }), k.on("osinfo", (p) => {
      u(p.homedir);
    }), k.on("outputMessage", (p) => {
      H("outputMessage", p);
    }), k.on("output", (p) => H("message", p)), k.on("cwdInfo", (p) => H("message", p)), k.on("error", (p) => H("error", `${p}`)), k.on("close", (p) => H("message", `
${p}
`)), k.on("prompt", ({
      cwd: p,
      command: R
    }) => {
      let T = p;
      const L = l();
      if (L && p.startsWith(L))
        T = p.replace(L, "~");
      else {
        const X = p.split("/");
        T = X[X.length - 1] || "/";
      }
      c(T), H("command", `${p} $ ${R}`);
    }), xe(() => k.disconnect());
  });
  const G = (k) => {
    o(""), h(!1), H("message", `Selected: ${k}`);
  };
  return Te(j), (() => {
    var k = cl(), p = k.firstChild;
    p.firstChild;
    var R = p.nextSibling, T = R.firstChild, L = T.nextSibling;
    K(k, C(zn, {}), p);
    var X = w;
    typeof X == "function" ? ke(X, p) : w = p, p.style.setProperty("scroll-behavior", "smooth"), K(p, C(tr, {
      get each() {
        return e();
      },
      children: (D) => (() => {
        var W = ll();
        return K(W, (() => {
          var ee = Lt(() => D.type === "command");
          return () => ee() ? `${i()} $ ${D.content.split(" $ ")[1]}` : D.content;
        })()), oe((ee) => {
          var N = D.type === "command" ? "font-bold whitespace-pre-wrap text-yellow-400" : D.type === "error" ? "whitespace-pre-wrap text-red-400" : "whitespace-pre-wrap", y = D.type === "command" ? D.content.split(" $ ")[0] : "";
          return N !== ee.e && He(W, ee.e = N), y !== ee.t && te(W, "title", ee.t = y), ee;
        }, {
          e: void 0,
          t: void 0
        }), W;
      })()
    }), null), K(k, (() => {
      var D = Lt(() => !!(d() && g().length > 0));
      return () => D() && (() => {
        var W = al(), ee = W.firstChild;
        return W.style.setProperty("width", "200px"), K(ee, C(tr, {
          get each() {
            return g();
          },
          children: (N) => (() => {
            var y = ul();
            return y.$$click = () => G(N), K(y, N === "Switch to AI" ? fl() : N === "Documentation" ? dl() : N === "About" ? hl() : N === "Donate" ? pl() : null, null), K(y, N, null), y;
          })()
        })), oe((N) => {
          var y = `${b().x}px`, P = `${b().y + 4}px`;
          return y !== N.e && ((N.e = y) != null ? W.style.setProperty("left", y) : W.style.removeProperty("left")), P !== N.t && ((N.t = P) != null ? W.style.setProperty("top", P) : W.style.removeProperty("top")), N;
        }, {
          e: void 0,
          t: void 0
        }), W;
      })();
    })(), R), L.$$keydown = (D) => {
      D.key === "Enter" && (J(), h(!1));
    }, L.$$input = A;
    var ie = _;
    return typeof ie == "function" ? ke(ie, L) : _ = L, oe((D) => {
      var W = `ml-4 ${f() === "Connected" ? "text-green-400" : "text-red-400"}`, ee = `flex-1 dark:bg-netural-950 ${f() === "Connected" ? "text-green-400" : "text-red-400"} rounded-md px-1 text-sm focus:outline-none focus:ring-0`, N = `${f() === "Connected" ? "Type a command..." : f()}`;
      return W !== D.e && He(T, D.e = W), ee !== D.t && He(L, D.t = ee), N !== D.a && te(L, "placeholder", D.a = N), D;
    }, {
      e: void 0,
      t: void 0,
      a: void 0
    }), oe(() => L.value = s()), k;
  })();
}
Pe(["input", "keydown", "click"]);
var gl = /* @__PURE__ */ F('<div class="flex h-screen flex-col bg-white dark:bg-neutral-900 dark:text-white"><h1 class="leading-0 uppercase tracking-widest text-lg mt-6 px-4"><b>Dash</b>board</h1><div class="flex-1 overflow-auto scroll-smooth px-4 py-2 text-sm">');
function yl() {
  Fn();
  const e = Ae();
  dt();
  const t = qe();
  return Te(() => {
    t.user()?.email || e("/login");
  }), (() => {
    var n = gl(), r = n.firstChild, s = r.nextSibling;
    return K(n, C(zn, {}), r), s.style.setProperty("scroll-behavior", "smooth"), n;
  })();
}
var bl = /* @__PURE__ */ F('<div class="flex h-screen flex-col bg-white dark:bg-neutral-900 dark:text-white"><div class="flex-1 overflow-auto scroll-smooth px-4 py-2 text-sm">');
function vl() {
  Vo(), Ae();
  const e = qe();
  return Te(async () => {
    e.user()?.email || console.log(e.user());
  }), (() => {
    var t = bl(), n = t.firstChild;
    return K(t, C(zn, {}), n), n.style.setProperty("scroll-behavior", "smooth"), t;
  })();
}
/**
* (c) Iconify
*
* For the full copyright and license information, please view the license.txt
* files at https://github.com/iconify/iconify
*
* Licensed under MIT.
*
* @license MIT
* @version 3.0.0
*/
const Os = Object.freeze(
  {
    left: 0,
    top: 0,
    width: 16,
    height: 16
  }
), Mt = Object.freeze({
  rotate: 0,
  vFlip: !1,
  hFlip: !1
}), ht = Object.freeze({
  ...Os,
  ...Mt
}), An = Object.freeze({
  ...ht,
  body: "",
  hidden: !1
}), wl = Object.freeze({
  width: null,
  height: null
}), Ts = Object.freeze({
  // Dimensions
  ...wl,
  // Transformations
  ...Mt
});
function El(e, t = 0) {
  const n = e.replace(/^-?[0-9.]*/, "");
  function r(s) {
    for (; s < 0; )
      s += 4;
    return s % 4;
  }
  if (n === "") {
    const s = parseInt(e);
    return isNaN(s) ? 0 : r(s);
  } else if (n !== e) {
    let s = 0;
    switch (n) {
      case "%":
        s = 25;
        break;
      case "deg":
        s = 90;
    }
    if (s) {
      let o = parseFloat(e.slice(0, e.length - n.length));
      return isNaN(o) ? 0 : (o = o / s, o % 1 === 0 ? r(o) : 0);
    }
  }
  return t;
}
const xl = /[\s,]+/;
function _l(e, t) {
  t.split(xl).forEach((n) => {
    switch (n.trim()) {
      case "horizontal":
        e.hFlip = !0;
        break;
      case "vertical":
        e.vFlip = !0;
        break;
    }
  });
}
const Bs = {
  ...Ts,
  preserveAspectRatio: ""
};
function Er(e) {
  const t = {
    ...Bs
  }, n = (r, s) => e.getAttribute(r) || s;
  return t.width = n("width", null), t.height = n("height", null), t.rotate = El(n("rotate", "")), _l(t, n("flip", "")), t.preserveAspectRatio = n("preserveAspectRatio", n("preserveaspectratio", "")), t;
}
function kl(e, t) {
  for (const n in Bs)
    if (e[n] !== t[n])
      return !0;
  return !1;
}
const Ps = /^[a-z0-9]+(-[a-z0-9]+)*$/, pt = (e, t, n, r = "") => {
  const s = e.split(":");
  if (e.slice(0, 1) === "@") {
    if (s.length < 2 || s.length > 3)
      return null;
    r = s.shift().slice(1);
  }
  if (s.length > 3 || !s.length)
    return null;
  if (s.length > 1) {
    const c = s.pop(), l = s.pop(), u = {
      // Allow provider without '@': "provider:prefix:name"
      provider: s.length > 0 ? s[0] : r,
      prefix: l,
      name: c
    };
    return t && !St(u) ? null : u;
  }
  const o = s[0], i = o.split("-");
  if (i.length > 1) {
    const c = {
      provider: r,
      prefix: i.shift(),
      name: i.join("-")
    };
    return t && !St(c) ? null : c;
  }
  if (n && r === "") {
    const c = {
      provider: r,
      prefix: "",
      name: o
    };
    return t && !St(c, n) ? null : c;
  }
  return null;
}, St = (e, t) => e ? !!// Check prefix: cannot be empty, unless allowSimpleName is enabled
// Check name: cannot be empty
((t && e.prefix === "" || e.prefix) && e.name) : !1;
function Sl(e, t) {
  const n = {};
  !e.hFlip != !t.hFlip && (n.hFlip = !0), !e.vFlip != !t.vFlip && (n.vFlip = !0);
  const r = ((e.rotate || 0) + (t.rotate || 0)) % 4;
  return r && (n.rotate = r), n;
}
function xr(e, t) {
  const n = Sl(e, t);
  for (const r in An)
    r in Mt ? r in e && !(r in n) && (n[r] = Mt[r]) : r in t ? n[r] = t[r] : r in e && (n[r] = e[r]);
  return n;
}
function Al(e, t) {
  const n = e.icons, r = e.aliases || /* @__PURE__ */ Object.create(null), s = /* @__PURE__ */ Object.create(null);
  function o(i) {
    if (n[i])
      return s[i] = [];
    if (!(i in s)) {
      s[i] = null;
      const c = r[i] && r[i].parent, l = c && o(c);
      l && (s[i] = [c].concat(l));
    }
    return s[i];
  }
  return Object.keys(n).concat(Object.keys(r)).forEach(o), s;
}
function Cl(e, t, n) {
  const r = e.icons, s = e.aliases || /* @__PURE__ */ Object.create(null);
  let o = {};
  function i(c) {
    o = xr(
      r[c] || s[c],
      o
    );
  }
  return i(t), n.forEach(i), xr(e, o);
}
function Ls(e, t) {
  const n = [];
  if (typeof e != "object" || typeof e.icons != "object")
    return n;
  e.not_found instanceof Array && e.not_found.forEach((s) => {
    t(s, null), n.push(s);
  });
  const r = Al(e);
  for (const s in r) {
    const o = r[s];
    o && (t(s, Cl(e, s, o)), n.push(s));
  }
  return n;
}
const Ol = {
  provider: "",
  aliases: {},
  not_found: {},
  ...Os
};
function ln(e, t) {
  for (const n in t)
    if (n in e && typeof e[n] != typeof t[n])
      return !1;
  return !0;
}
function Rs(e) {
  if (typeof e != "object" || e === null)
    return null;
  const t = e;
  if (typeof t.prefix != "string" || !e.icons || typeof e.icons != "object" || !ln(e, Ol))
    return null;
  const n = t.icons;
  for (const s in n) {
    const o = n[s];
    if (
      // Name cannot be empty
      !s || // Must have body
      typeof o.body != "string" || // Check other props
      !ln(
        o,
        An
      )
    )
      return null;
  }
  const r = t.aliases || /* @__PURE__ */ Object.create(null);
  for (const s in r) {
    const o = r[s], i = o.parent;
    if (
      // Name cannot be empty
      !s || // Parent must be set and point to existing icon
      typeof i != "string" || !n[i] && !r[i] || // Check other props
      !ln(
        o,
        An
      )
    )
      return null;
  }
  return t;
}
const Nt = /* @__PURE__ */ Object.create(null);
function Tl(e, t) {
  return {
    provider: e,
    prefix: t,
    icons: /* @__PURE__ */ Object.create(null),
    missing: /* @__PURE__ */ new Set()
  };
}
function Se(e, t) {
  const n = Nt[e] || (Nt[e] = /* @__PURE__ */ Object.create(null));
  return n[t] || (n[t] = Tl(e, t));
}
function Is(e, t) {
  return Rs(t) ? Ls(t, (n, r) => {
    r ? e.icons[n] = r : e.missing.add(n);
  }) : [];
}
function Bl(e, t, n) {
  try {
    if (typeof n.body == "string")
      return e.icons[t] = { ...n }, !0;
  } catch {
  }
  return !1;
}
function Pl(e, t) {
  let n = [];
  return (typeof e == "string" ? [e] : Object.keys(Nt)).forEach((s) => {
    (typeof s == "string" && typeof t == "string" ? [t] : Object.keys(Nt[s] || {})).forEach((i) => {
      const c = Se(s, i);
      n = n.concat(
        Object.keys(c.icons).map(
          (l) => (s !== "" ? "@" + s + ":" : "") + i + ":" + l
        )
      );
    });
  }), n;
}
let lt = !1;
function $s(e) {
  return typeof e == "boolean" && (lt = e), lt;
}
function at(e) {
  const t = typeof e == "string" ? pt(e, !0, lt) : e;
  if (t) {
    const n = Se(t.provider, t.prefix), r = t.name;
    return n.icons[r] || (n.missing.has(r) ? null : void 0);
  }
}
function Ms(e, t) {
  const n = pt(e, !0, lt);
  if (!n)
    return !1;
  const r = Se(n.provider, n.prefix);
  return t ? Bl(r, n.name, t) : (r.missing.add(n.name), !0);
}
function _r(e, t) {
  if (typeof e != "object")
    return !1;
  if (typeof t != "string" && (t = e.provider || ""), lt && !t && !e.prefix) {
    let s = !1;
    return Rs(e) && (e.prefix = "", Ls(e, (o, i) => {
      Ms(o, i) && (s = !0);
    })), s;
  }
  const n = e.prefix;
  if (!St({
    prefix: n,
    name: "a"
  }))
    return !1;
  const r = Se(t, n);
  return !!Is(r, e);
}
function Ll(e) {
  return !!at(e);
}
function Rl(e) {
  const t = at(e);
  return t && {
    ...ht,
    ...t
  };
}
function Il(e) {
  const t = {
    loaded: [],
    missing: [],
    pending: []
  }, n = /* @__PURE__ */ Object.create(null);
  e.sort((s, o) => s.provider !== o.provider ? s.provider.localeCompare(o.provider) : s.prefix !== o.prefix ? s.prefix.localeCompare(o.prefix) : s.name.localeCompare(o.name));
  let r = {
    provider: "",
    prefix: "",
    name: ""
  };
  return e.forEach((s) => {
    if (r.name === s.name && r.prefix === s.prefix && r.provider === s.provider)
      return;
    r = s;
    const o = s.provider, i = s.prefix, c = s.name, l = n[o] || (n[o] = /* @__PURE__ */ Object.create(null)), u = l[i] || (l[i] = Se(o, i));
    let f;
    c in u.icons ? f = t.loaded : i === "" || u.missing.has(c) ? f = t.missing : f = t.pending;
    const a = {
      provider: o,
      prefix: i,
      name: c
    };
    f.push(a);
  }), t;
}
function Ns(e, t) {
  e.forEach((n) => {
    const r = n.loaderCallbacks;
    r && (n.loaderCallbacks = r.filter((s) => s.id !== t));
  });
}
function $l(e) {
  e.pendingCallbacksFlag || (e.pendingCallbacksFlag = !0, setTimeout(() => {
    e.pendingCallbacksFlag = !1;
    const t = e.loaderCallbacks ? e.loaderCallbacks.slice(0) : [];
    if (!t.length)
      return;
    let n = !1;
    const r = e.provider, s = e.prefix;
    t.forEach((o) => {
      const i = o.icons, c = i.pending.length;
      i.pending = i.pending.filter((l) => {
        if (l.prefix !== s)
          return !0;
        const u = l.name;
        if (e.icons[u])
          i.loaded.push({
            provider: r,
            prefix: s,
            name: u
          });
        else if (e.missing.has(u))
          i.missing.push({
            provider: r,
            prefix: s,
            name: u
          });
        else
          return n = !0, !0;
        return !1;
      }), i.pending.length !== c && (n || Ns([e], o.id), o.callback(
        i.loaded.slice(0),
        i.missing.slice(0),
        i.pending.slice(0),
        o.abort
      ));
    });
  }));
}
let Ml = 0;
function Nl(e, t, n) {
  const r = Ml++, s = Ns.bind(null, n, r);
  if (!t.pending.length)
    return s;
  const o = {
    id: r,
    icons: t,
    callback: e,
    abort: s
  };
  return n.forEach((i) => {
    (i.loaderCallbacks || (i.loaderCallbacks = [])).push(o);
  }), s;
}
const Cn = /* @__PURE__ */ Object.create(null);
function kr(e, t) {
  Cn[e] = t;
}
function On(e) {
  return Cn[e] || Cn[""];
}
function Fl(e, t = !0, n = !1) {
  const r = [];
  return e.forEach((s) => {
    const o = typeof s == "string" ? pt(s, t, n) : s;
    o && r.push(o);
  }), r;
}
var Dl = {
  resources: [],
  index: 0,
  timeout: 2e3,
  rotate: 750,
  random: !1,
  dataAfterTimeout: !1
};
function ql(e, t, n, r) {
  const s = e.resources.length, o = e.random ? Math.floor(Math.random() * s) : e.index;
  let i;
  if (e.random) {
    let A = e.resources.slice(0);
    for (i = []; A.length > 1; ) {
      const j = Math.floor(Math.random() * A.length);
      i.push(A[j]), A = A.slice(0, j).concat(A.slice(j + 1));
    }
    i = i.concat(A);
  } else
    i = e.resources.slice(o).concat(e.resources.slice(0, o));
  const c = Date.now();
  let l = "pending", u = 0, f, a = null, d = [], h = [];
  typeof r == "function" && h.push(r);
  function b() {
    a && (clearTimeout(a), a = null);
  }
  function m() {
    l === "pending" && (l = "aborted"), b(), d.forEach((A) => {
      A.status === "pending" && (A.status = "aborted");
    }), d = [];
  }
  function g(A, j) {
    j && (h = []), typeof A == "function" && h.push(A);
  }
  function E() {
    return {
      startTime: c,
      payload: t,
      status: l,
      queriesSent: u,
      queriesPending: d.length,
      subscribe: g,
      abort: m
    };
  }
  function w() {
    l = "failed", h.forEach((A) => {
      A(void 0, f);
    });
  }
  function _() {
    d.forEach((A) => {
      A.status === "pending" && (A.status = "aborted");
    }), d = [];
  }
  function S(A, j, H) {
    const J = j !== "success";
    switch (d = d.filter((G) => G !== A), l) {
      case "pending":
        break;
      case "failed":
        if (J || !e.dataAfterTimeout)
          return;
        break;
      default:
        return;
    }
    if (j === "abort") {
      f = H, w();
      return;
    }
    if (J) {
      f = H, d.length || (i.length ? B() : w());
      return;
    }
    if (b(), _(), !e.random) {
      const G = e.resources.indexOf(A.resource);
      G !== -1 && G !== e.index && (e.index = G);
    }
    l = "completed", h.forEach((G) => {
      G(H);
    });
  }
  function B() {
    if (l !== "pending")
      return;
    b();
    const A = i.shift();
    if (A === void 0) {
      if (d.length) {
        a = setTimeout(() => {
          b(), l === "pending" && (_(), w());
        }, e.timeout);
        return;
      }
      w();
      return;
    }
    const j = {
      status: "pending",
      resource: A,
      callback: (H, J) => {
        S(j, H, J);
      }
    };
    d.push(j), u++, a = setTimeout(B, e.rotate), n(A, t, j.callback);
  }
  return setTimeout(B), E;
}
function Fs(e) {
  const t = {
    ...Dl,
    ...e
  };
  let n = [];
  function r() {
    n = n.filter((c) => c().status === "pending");
  }
  function s(c, l, u) {
    const f = ql(
      t,
      c,
      l,
      (a, d) => {
        r(), u && u(a, d);
      }
    );
    return n.push(f), f;
  }
  function o(c) {
    return n.find((l) => c(l)) || null;
  }
  return {
    query: s,
    find: o,
    setIndex: (c) => {
      t.index = c;
    },
    getIndex: () => t.index,
    cleanup: r
  };
}
function Qn(e) {
  let t;
  if (typeof e.resources == "string")
    t = [e.resources];
  else if (t = e.resources, !(t instanceof Array) || !t.length)
    return null;
  return {
    // API hosts
    resources: t,
    // Root path
    path: e.path || "/",
    // URL length limit
    maxURL: e.maxURL || 500,
    // Timeout before next host is used.
    rotate: e.rotate || 750,
    // Timeout before failing query.
    timeout: e.timeout || 5e3,
    // Randomise default API end point.
    random: e.random === !0,
    // Start index
    index: e.index || 0,
    // Receive data after time out (used if time out kicks in first, then API module sends data anyway).
    dataAfterTimeout: e.dataAfterTimeout !== !1
  };
}
const zt = /* @__PURE__ */ Object.create(null), Ze = [
  "https://api.simplesvg.com",
  "https://api.unisvg.com"
], At = [];
for (; Ze.length > 0; )
  Ze.length === 1 || Math.random() > 0.5 ? At.push(Ze.shift()) : At.push(Ze.pop());
zt[""] = Qn({
  resources: ["https://api.iconify.design"].concat(At)
});
function Sr(e, t) {
  const n = Qn(t);
  return n === null ? !1 : (zt[e] = n, !0);
}
function Qt(e) {
  return zt[e];
}
function jl() {
  return Object.keys(zt);
}
function Ar() {
}
const an = /* @__PURE__ */ Object.create(null);
function Ul(e) {
  if (!an[e]) {
    const t = Qt(e);
    if (!t)
      return;
    const n = Fs(t), r = {
      config: t,
      redundancy: n
    };
    an[e] = r;
  }
  return an[e];
}
function Ds(e, t, n) {
  let r, s;
  if (typeof e == "string") {
    const o = On(e);
    if (!o)
      return n(void 0, 424), Ar;
    s = o.send;
    const i = Ul(e);
    i && (r = i.redundancy);
  } else {
    const o = Qn(e);
    if (o) {
      r = Fs(o);
      const i = e.resources ? e.resources[0] : "", c = On(i);
      c && (s = c.send);
    }
  }
  return !r || !s ? (n(void 0, 424), Ar) : r.query(t, s, n)().abort;
}
function Cr() {
}
function Vl(e) {
  e.iconsLoaderFlag || (e.iconsLoaderFlag = !0, setTimeout(() => {
    e.iconsLoaderFlag = !1, $l(e);
  }));
}
function Kl(e) {
  const t = [], n = [];
  return e.forEach((r) => {
    (r.match(Ps) ? t : n).push(r);
  }), {
    valid: t,
    invalid: n
  };
}
function et(e, t, n) {
  function r() {
    const s = e.pendingIcons;
    t.forEach((o) => {
      s && s.delete(o), e.icons[o] || e.missing.add(o);
    });
  }
  if (n && typeof n == "object")
    try {
      if (!Is(e, n).length) {
        r();
        return;
      }
    } catch (s) {
      console.error(s);
    }
  r(), Vl(e);
}
function Or(e, t) {
  e instanceof Promise ? e.then((n) => {
    t(n);
  }).catch(() => {
    t(null);
  }) : t(e);
}
function Wl(e, t) {
  e.iconsToLoad ? e.iconsToLoad = e.iconsToLoad.concat(t).sort() : e.iconsToLoad = t, e.iconsQueueFlag || (e.iconsQueueFlag = !0, setTimeout(() => {
    e.iconsQueueFlag = !1;
    const { provider: n, prefix: r } = e, s = e.iconsToLoad;
    if (delete e.iconsToLoad, !s || !s.length)
      return;
    const o = e.loadIcon;
    if (e.loadIcons && (s.length > 1 || !o)) {
      Or(
        e.loadIcons(s, r, n),
        (f) => {
          et(e, s, f);
        }
      );
      return;
    }
    if (o) {
      s.forEach((f) => {
        const a = o(f, r, n);
        Or(a, (d) => {
          const h = d ? {
            prefix: r,
            icons: {
              [f]: d
            }
          } : null;
          et(e, [f], h);
        });
      });
      return;
    }
    const { valid: i, invalid: c } = Kl(s);
    if (c.length && et(e, c, null), !i.length)
      return;
    const l = r.match(Ps) ? On(n) : null;
    if (!l) {
      et(e, i, null);
      return;
    }
    l.prepare(n, r, i).forEach((f) => {
      Ds(n, f, (a) => {
        et(e, f.icons, a);
      });
    });
  }));
}
const Jn = (e, t) => {
  const n = Fl(e, !0, $s()), r = Il(n);
  if (!r.pending.length) {
    let l = !0;
    return t && setTimeout(() => {
      l && t(
        r.loaded,
        r.missing,
        r.pending,
        Cr
      );
    }), () => {
      l = !1;
    };
  }
  const s = /* @__PURE__ */ Object.create(null), o = [];
  let i, c;
  return r.pending.forEach((l) => {
    const { provider: u, prefix: f } = l;
    if (f === c && u === i)
      return;
    i = u, c = f, o.push(Se(u, f));
    const a = s[u] || (s[u] = /* @__PURE__ */ Object.create(null));
    a[f] || (a[f] = []);
  }), r.pending.forEach((l) => {
    const { provider: u, prefix: f, name: a } = l, d = Se(u, f), h = d.pendingIcons || (d.pendingIcons = /* @__PURE__ */ new Set());
    h.has(a) || (h.add(a), s[u][f].push(a));
  }), o.forEach((l) => {
    const u = s[l.provider][l.prefix];
    u.length && Wl(l, u);
  }), t ? Nl(t, r, o) : Cr;
}, Hl = (e) => new Promise((t, n) => {
  const r = typeof e == "string" ? pt(e, !0) : e;
  if (!r) {
    n(e);
    return;
  }
  Jn([r || e], (s) => {
    if (s.length && r) {
      const o = at(r);
      if (o) {
        t({
          ...ht,
          ...o
        });
        return;
      }
    }
    n(e);
  });
});
function Tr(e) {
  try {
    const t = typeof e == "string" ? JSON.parse(e) : e;
    if (typeof t.body == "string")
      return {
        ...t
      };
  } catch {
  }
}
function zl(e, t) {
  if (typeof e == "object")
    return {
      data: Tr(e),
      value: e
    };
  if (typeof e != "string")
    return {
      value: e
    };
  if (e.includes("{")) {
    const o = Tr(e);
    if (o)
      return {
        data: o,
        value: e
      };
  }
  const n = pt(e, !0, !0);
  if (!n)
    return {
      value: e
    };
  const r = at(n);
  if (r !== void 0 || !n.prefix)
    return {
      value: e,
      name: n,
      data: r
      // could be 'null' -> icon is missing
    };
  const s = Jn([n], () => t(e, n, at(n)));
  return {
    value: e,
    name: n,
    loading: s
  };
}
let qs = !1;
try {
  qs = navigator.vendor.indexOf("Apple") === 0;
} catch {
}
function Ql(e, t) {
  switch (t) {
    // Force mode
    case "svg":
    case "bg":
    case "mask":
      return t;
  }
  return t !== "style" && (qs || e.indexOf("<a") === -1) ? "svg" : e.indexOf("currentColor") === -1 ? "bg" : "mask";
}
const Jl = /(-?[0-9.]*[0-9]+[0-9.]*)/g, Gl = /^-?[0-9.]*[0-9]+[0-9.]*$/g;
function Tn(e, t, n) {
  if (t === 1)
    return e;
  if (n = n || 100, typeof e == "number")
    return Math.ceil(e * t * n) / n;
  if (typeof e != "string")
    return e;
  const r = e.split(Jl);
  if (r === null || !r.length)
    return e;
  const s = [];
  let o = r.shift(), i = Gl.test(o);
  for (; ; ) {
    if (i) {
      const c = parseFloat(o);
      isNaN(c) ? s.push(o) : s.push(Math.ceil(c * t * n) / n);
    } else
      s.push(o);
    if (o = r.shift(), o === void 0)
      return s.join("");
    i = !i;
  }
}
function Yl(e, t = "defs") {
  let n = "";
  const r = e.indexOf("<" + t);
  for (; r >= 0; ) {
    const s = e.indexOf(">", r), o = e.indexOf("</" + t);
    if (s === -1 || o === -1)
      break;
    const i = e.indexOf(">", o);
    if (i === -1)
      break;
    n += e.slice(s + 1, o).trim(), e = e.slice(0, r).trim() + e.slice(i + 1);
  }
  return {
    defs: n,
    content: e
  };
}
function Xl(e, t) {
  return e ? "<defs>" + e + "</defs>" + t : t;
}
function Zl(e, t, n) {
  const r = Yl(e);
  return Xl(r.defs, t + r.content + n);
}
const ea = (e) => e === "unset" || e === "undefined" || e === "none";
function js(e, t) {
  const n = {
    ...ht,
    ...e
  }, r = {
    ...Ts,
    ...t
  }, s = {
    left: n.left,
    top: n.top,
    width: n.width,
    height: n.height
  };
  let o = n.body;
  [n, r].forEach((m) => {
    const g = [], E = m.hFlip, w = m.vFlip;
    let _ = m.rotate;
    E ? w ? _ += 2 : (g.push(
      "translate(" + (s.width + s.left).toString() + " " + (0 - s.top).toString() + ")"
    ), g.push("scale(-1 1)"), s.top = s.left = 0) : w && (g.push(
      "translate(" + (0 - s.left).toString() + " " + (s.height + s.top).toString() + ")"
    ), g.push("scale(1 -1)"), s.top = s.left = 0);
    let S;
    switch (_ < 0 && (_ -= Math.floor(_ / 4) * 4), _ = _ % 4, _) {
      case 1:
        S = s.height / 2 + s.top, g.unshift(
          "rotate(90 " + S.toString() + " " + S.toString() + ")"
        );
        break;
      case 2:
        g.unshift(
          "rotate(180 " + (s.width / 2 + s.left).toString() + " " + (s.height / 2 + s.top).toString() + ")"
        );
        break;
      case 3:
        S = s.width / 2 + s.left, g.unshift(
          "rotate(-90 " + S.toString() + " " + S.toString() + ")"
        );
        break;
    }
    _ % 2 === 1 && (s.left !== s.top && (S = s.left, s.left = s.top, s.top = S), s.width !== s.height && (S = s.width, s.width = s.height, s.height = S)), g.length && (o = Zl(
      o,
      '<g transform="' + g.join(" ") + '">',
      "</g>"
    ));
  });
  const i = r.width, c = r.height, l = s.width, u = s.height;
  let f, a;
  i === null ? (a = c === null ? "1em" : c === "auto" ? u : c, f = Tn(a, l / u)) : (f = i === "auto" ? l : i, a = c === null ? Tn(f, u / l) : c === "auto" ? u : c);
  const d = {}, h = (m, g) => {
    ea(g) || (d[m] = g.toString());
  };
  h("width", f), h("height", a);
  const b = [s.left, s.top, l, u];
  return d.viewBox = b.join(" "), {
    attributes: d,
    viewBox: b,
    body: o
  };
}
function Gn(e, t) {
  let n = e.indexOf("xlink:") === -1 ? "" : ' xmlns:xlink="http://www.w3.org/1999/xlink"';
  for (const r in t)
    n += " " + r + '="' + t[r] + '"';
  return '<svg xmlns="http://www.w3.org/2000/svg"' + n + ">" + e + "</svg>";
}
function ta(e) {
  return e.replace(/"/g, "'").replace(/%/g, "%25").replace(/#/g, "%23").replace(/</g, "%3C").replace(/>/g, "%3E").replace(/\s+/g, " ");
}
function na(e) {
  return "data:image/svg+xml," + ta(e);
}
function Us(e) {
  return 'url("' + na(e) + '")';
}
const ra = () => {
  let e;
  try {
    if (e = fetch, typeof e == "function")
      return e;
  } catch {
  }
};
let Ft = ra();
function sa(e) {
  Ft = e;
}
function oa() {
  return Ft;
}
function ia(e, t) {
  const n = Qt(e);
  if (!n)
    return 0;
  let r;
  if (!n.maxURL)
    r = 0;
  else {
    let s = 0;
    n.resources.forEach((i) => {
      s = Math.max(s, i.length);
    });
    const o = t + ".json?icons=";
    r = n.maxURL - s - n.path.length - o.length;
  }
  return r;
}
function ca(e) {
  return e === 404;
}
const la = (e, t, n) => {
  const r = [], s = ia(e, t), o = "icons";
  let i = {
    type: o,
    provider: e,
    prefix: t,
    icons: []
  }, c = 0;
  return n.forEach((l, u) => {
    c += l.length + 1, c >= s && u > 0 && (r.push(i), i = {
      type: o,
      provider: e,
      prefix: t,
      icons: []
    }, c = l.length), i.icons.push(l);
  }), r.push(i), r;
};
function aa(e) {
  if (typeof e == "string") {
    const t = Qt(e);
    if (t)
      return t.path;
  }
  return "/";
}
const ua = (e, t, n) => {
  if (!Ft) {
    n("abort", 424);
    return;
  }
  let r = aa(t.provider);
  switch (t.type) {
    case "icons": {
      const o = t.prefix, c = t.icons.join(","), l = new URLSearchParams({
        icons: c
      });
      r += o + ".json?" + l.toString();
      break;
    }
    case "custom": {
      const o = t.uri;
      r += o.slice(0, 1) === "/" ? o.slice(1) : o;
      break;
    }
    default:
      n("abort", 400);
      return;
  }
  let s = 503;
  Ft(e + r).then((o) => {
    const i = o.status;
    if (i !== 200) {
      setTimeout(() => {
        n(ca(i) ? "abort" : "next", i);
      });
      return;
    }
    return s = 501, o.json();
  }).then((o) => {
    if (typeof o != "object" || o === null) {
      setTimeout(() => {
        o === 404 ? n("abort", o) : n("next", s);
      });
      return;
    }
    setTimeout(() => {
      n("success", o);
    });
  }).catch(() => {
    n("next", s);
  });
}, fa = {
  prepare: la,
  send: ua
};
function da(e, t, n) {
  Se(n || "", t).loadIcons = e;
}
function ha(e, t, n) {
  Se(n || "", t).loadIcon = e;
}
const un = "data-style";
let Vs = "";
function pa(e) {
  Vs = e;
}
function Br(e, t) {
  let n = Array.from(e.childNodes).find((r) => r.hasAttribute && r.hasAttribute(un));
  n || (n = document.createElement("style"), n.setAttribute(un, un), e.appendChild(n)), n.textContent = ":host{display:inline-block;vertical-align:" + (t ? "-0.125em" : "0") + "}span,svg{display:block;margin:auto}" + Vs;
}
function Ks() {
  kr("", fa), $s(!0);
  let e;
  try {
    e = window;
  } catch {
  }
  if (e) {
    if (e.IconifyPreload !== void 0) {
      const n = e.IconifyPreload, r = "Invalid IconifyPreload syntax.";
      typeof n == "object" && n !== null && (n instanceof Array ? n : [n]).forEach((s) => {
        try {
          // Check if item is an object and not null/array
          (typeof s != "object" || s === null || s instanceof Array || // Check for 'icons' and 'prefix'
          typeof s.icons != "object" || typeof s.prefix != "string" || // Add icon set
          !_r(s)) && console.error(r);
        } catch {
          console.error(r);
        }
      });
    }
    if (e.IconifyProviders !== void 0) {
      const n = e.IconifyProviders;
      if (typeof n == "object" && n !== null)
        for (const r in n) {
          const s = "IconifyProviders[" + r + "] is invalid.";
          try {
            const o = n[r];
            if (typeof o != "object" || !o || o.resources === void 0)
              continue;
            Sr(r, o) || console.error(s);
          } catch {
            console.error(s);
          }
        }
    }
  }
  return {
    iconLoaded: Ll,
    getIcon: Rl,
    listIcons: Pl,
    addIcon: Ms,
    addCollection: _r,
    calculateSize: Tn,
    buildIcon: js,
    iconToHTML: Gn,
    svgToURL: Us,
    loadIcons: Jn,
    loadIcon: Hl,
    addAPIProvider: Sr,
    setCustomIconLoader: ha,
    setCustomIconsLoader: da,
    appendCustomStyle: pa,
    _api: {
      getAPIConfig: Qt,
      setAPIModule: kr,
      sendAPIQuery: Ds,
      setFetch: sa,
      getFetch: oa,
      listAPIProviders: jl
    }
  };
}
const Bn = {
  "background-color": "currentColor"
}, Ws = {
  "background-color": "transparent"
}, Pr = {
  image: "var(--svg)",
  repeat: "no-repeat",
  size: "100% 100%"
}, Lr = {
  "-webkit-mask": Bn,
  mask: Bn,
  background: Ws
};
for (const e in Lr) {
  const t = Lr[e];
  for (const n in Pr)
    t[e + "-" + n] = Pr[n];
}
function Rr(e) {
  return e ? e + (e.match(/^[-0-9.]+$/) ? "px" : "") : "inherit";
}
function ma(e, t, n) {
  const r = document.createElement("span");
  let s = e.body;
  s.indexOf("<a") !== -1 && (s += "<!-- " + Date.now() + " -->");
  const o = e.attributes, i = Gn(s, {
    ...o,
    width: t.width + "",
    height: t.height + ""
  }), c = Us(i), l = r.style, u = {
    "--svg": c,
    width: Rr(o.width),
    height: Rr(o.height),
    ...n ? Bn : Ws
  };
  for (const f in u)
    l.setProperty(f, u[f]);
  return r;
}
let st;
function ga() {
  try {
    st = window.trustedTypes.createPolicy("iconify", {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      createHTML: (e) => e
    });
  } catch {
    st = null;
  }
}
function ya(e) {
  return st === void 0 && ga(), st ? st.createHTML(e) : e;
}
function ba(e) {
  const t = document.createElement("span"), n = e.attributes;
  let r = "";
  n.width || (r = "width: inherit;"), n.height || (r += "height: inherit;"), r && (n.style = r);
  const s = Gn(e.body, n);
  return t.innerHTML = ya(s), t.firstChild;
}
function Pn(e) {
  return Array.from(e.childNodes).find((t) => {
    const n = t.tagName && t.tagName.toUpperCase();
    return n === "SPAN" || n === "SVG";
  });
}
function Ir(e, t) {
  const n = t.icon.data, r = t.customisations, s = js(n, r);
  r.preserveAspectRatio && (s.attributes.preserveAspectRatio = r.preserveAspectRatio);
  const o = t.renderedMode;
  let i;
  switch (o) {
    case "svg":
      i = ba(s);
      break;
    default:
      i = ma(s, {
        ...ht,
        ...n
      }, o === "mask");
  }
  const c = Pn(e);
  c ? i.tagName === "SPAN" && c.tagName === i.tagName ? c.setAttribute("style", i.getAttribute("style")) : e.replaceChild(i, c) : e.appendChild(i);
}
function $r(e, t, n) {
  const r = n && (n.rendered ? n : n.lastRender);
  return {
    rendered: !1,
    inline: t,
    icon: e,
    lastRender: r
  };
}
function va(e = "iconify-icon") {
  let t, n;
  try {
    t = window.customElements, n = window.HTMLElement;
  } catch {
    return;
  }
  if (!t || !n)
    return;
  const r = t.get(e);
  if (r)
    return r;
  const s = [
    // Icon
    "icon",
    // Mode
    "mode",
    "inline",
    "noobserver",
    // Customisations
    "width",
    "height",
    "rotate",
    "flip"
  ], o = class extends n {
    // Root
    _shadowRoot;
    // Initialised
    _initialised = !1;
    // Icon state
    _state;
    // Attributes check queued
    _checkQueued = !1;
    // Connected
    _connected = !1;
    // Observer
    _observer = null;
    _visible = !0;
    /**
     * Constructor
     */
    constructor() {
      super();
      const c = this._shadowRoot = this.attachShadow({
        mode: "open"
      }), l = this.hasAttribute("inline");
      Br(c, l), this._state = $r({
        value: ""
      }, l), this._queueCheck();
    }
    /**
     * Connected to DOM
     */
    connectedCallback() {
      this._connected = !0, this.startObserver();
    }
    /**
     * Disconnected from DOM
     */
    disconnectedCallback() {
      this._connected = !1, this.stopObserver();
    }
    /**
     * Observed attributes
     */
    static get observedAttributes() {
      return s.slice(0);
    }
    /**
     * Observed properties that are different from attributes
     *
     * Experimental! Need to test with various frameworks that support it
     */
    /*
    static get properties() {
        return {
            inline: {
                type: Boolean,
                reflect: true,
            },
            // Not listing other attributes because they are strings or combination
            // of string and another type. Cannot have multiple types
        };
    }
    */
    /**
     * Attribute has changed
     */
    attributeChangedCallback(c) {
      switch (c) {
        case "inline": {
          const l = this.hasAttribute("inline"), u = this._state;
          l !== u.inline && (u.inline = l, Br(this._shadowRoot, l));
          break;
        }
        case "noobserver": {
          this.hasAttribute("noobserver") ? this.startObserver() : this.stopObserver();
          break;
        }
        default:
          this._queueCheck();
      }
    }
    /**
     * Get/set icon
     */
    get icon() {
      const c = this.getAttribute("icon");
      if (c && c.slice(0, 1) === "{")
        try {
          return JSON.parse(c);
        } catch {
        }
      return c;
    }
    set icon(c) {
      typeof c == "object" && (c = JSON.stringify(c)), this.setAttribute("icon", c);
    }
    /**
     * Get/set inline
     */
    get inline() {
      return this.hasAttribute("inline");
    }
    set inline(c) {
      c ? this.setAttribute("inline", "true") : this.removeAttribute("inline");
    }
    /**
     * Get/set observer
     */
    get observer() {
      return this.hasAttribute("observer");
    }
    set observer(c) {
      c ? this.setAttribute("observer", "true") : this.removeAttribute("observer");
    }
    /**
     * Restart animation
     */
    restartAnimation() {
      const c = this._state;
      if (c.rendered) {
        const l = this._shadowRoot;
        if (c.renderedMode === "svg")
          try {
            l.lastChild.setCurrentTime(0);
            return;
          } catch {
          }
        Ir(l, c);
      }
    }
    /**
     * Get status
     */
    get status() {
      const c = this._state;
      return c.rendered ? "rendered" : c.icon.data === null ? "failed" : "loading";
    }
    /**
     * Queue attributes re-check
     */
    _queueCheck() {
      this._checkQueued || (this._checkQueued = !0, setTimeout(() => {
        this._check();
      }));
    }
    /**
     * Check for changes
     */
    _check() {
      if (!this._checkQueued)
        return;
      this._checkQueued = !1;
      const c = this._state, l = this.getAttribute("icon");
      if (l !== c.icon.value) {
        this._iconChanged(l);
        return;
      }
      if (!c.rendered || !this._visible)
        return;
      const u = this.getAttribute("mode"), f = Er(this);
      (c.attrMode !== u || kl(c.customisations, f) || !Pn(this._shadowRoot)) && this._renderIcon(c.icon, f, u);
    }
    /**
     * Icon value has changed
     */
    _iconChanged(c) {
      const l = zl(c, (u, f, a) => {
        const d = this._state;
        if (d.rendered || this.getAttribute("icon") !== u)
          return;
        const h = {
          value: u,
          name: f,
          data: a
        };
        h.data ? this._gotIconData(h) : d.icon = h;
      });
      l.data ? this._gotIconData(l) : this._state = $r(l, this._state.inline, this._state);
    }
    /**
     * Force render icon on state change
     */
    _forceRender() {
      if (!this._visible) {
        const c = Pn(this._shadowRoot);
        c && this._shadowRoot.removeChild(c);
        return;
      }
      this._queueCheck();
    }
    /**
     * Got new icon data, icon is ready to (re)render
     */
    _gotIconData(c) {
      this._checkQueued = !1, this._renderIcon(c, Er(this), this.getAttribute("mode"));
    }
    /**
     * Re-render based on icon data
     */
    _renderIcon(c, l, u) {
      const f = Ql(c.data.body, u), a = this._state.inline;
      Ir(this._shadowRoot, this._state = {
        rendered: !0,
        icon: c,
        inline: a,
        customisations: l,
        attrMode: u,
        renderedMode: f
      });
    }
    /**
     * Start observer
     */
    startObserver() {
      if (!this._observer && !this.hasAttribute("noobserver"))
        try {
          this._observer = new IntersectionObserver((c) => {
            const l = c.some((u) => u.isIntersecting);
            l !== this._visible && (this._visible = l, this._forceRender());
          }), this._observer.observe(this);
        } catch {
          if (this._observer) {
            try {
              this._observer.disconnect();
            } catch {
            }
            this._observer = null;
          }
        }
    }
    /**
     * Stop observer
     */
    stopObserver() {
      this._observer && (this._observer.disconnect(), this._observer = null, this._visible = !0, this._connected && this._forceRender());
    }
  };
  s.forEach((c) => {
    c in o.prototype || Object.defineProperty(o.prototype, c, {
      get: function() {
        return this.getAttribute(c);
      },
      set: function(l) {
        l !== null ? this.setAttribute(c, l) : this.removeAttribute(c);
      }
    });
  });
  const i = Ks();
  for (const c in i)
    o[c] = o.prototype[c] = i[c];
  return t.define(e, o), o;
}
const wa = va() || Ks(), { iconLoaded: Da, getIcon: qa, listIcons: ja, addIcon: Ua, addCollection: Va, calculateSize: Ka, buildIcon: Wa, iconToHTML: Ha, svgToURL: za, loadIcons: Qa, loadIcon: Ja, setCustomIconLoader: Ga, setCustomIconsLoader: Ya, addAPIProvider: Xa, _api: Za } = wa;
var Ea = /* @__PURE__ */ F("<iconify-icon>", !0, !1, !1);
function Hs(e) {
  let {
    icon: t,
    mode: n,
    inline: r,
    rotate: s,
    flip: o,
    width: i,
    height: c,
    preserveAspectRatio: l,
    noobserver: u
  } = e;
  return typeof t == "object" && (t = JSON.stringify(t)), // @ts-ignore
  (() => {
    var f = Ea();
    return te(f, "icon", t), te(f, "mode", n), te(f, "inline", r), te(f, "rotate", s), te(f, "flip", o), te(f, "width", i), te(f, "height", c), te(f, "preserveaspectratio", l), te(f, "noobserver", u), $n(f, e, !1, !1), f._$owner = qt(), f;
  })();
}
var xa = /* @__PURE__ */ F('<button class="w-full flex items-center gap-2 justify-center p-3 text-white bg-neutral-900 rounded-md hover:bg-neutral-800 mt-4"> Sign in with Google');
const _a = "http://localhost:5000/api/auth/google/callback";
function ka() {
  const [e, t] = $("");
  return Ln(() => {
    t(`${_a}`);
  }), (() => {
    var n = xa(), r = n.firstChild;
    return n.$$click = () => e() && (window.location.href = e()), K(n, C(Hs, {
      icon: "flat-color-icons:google",
      width: "20",
      height: "20"
    }), r), n;
  })();
}
Pe(["click"]);
var Sa = /* @__PURE__ */ F('<button class="w-full flex gap-2 items-center justify-center p-3 text-white bg-gray-700 rounded-md hover:bg-gray-600 mt-4"> Sign in with Github');
const Aa = "http://localhost:5000/api/auth/github/callback";
function Ca() {
  const [e, t] = $("");
  return Ln(() => {
    t(`${Aa}`);
  }), (() => {
    var n = Sa(), r = n.firstChild;
    return n.$$click = () => e() && (window.location.href = e()), K(n, C(Hs, {
      icon: "mdi:github",
      width: "24",
      class: "text-gray-900",
      height: "24"
    }), r), n;
  })();
}
Pe(["click"]);
var Oa = /* @__PURE__ */ F('<div class="bg-solid-darkbg fixed inset-0 flex items-center justify-center"><svg class="m-auto h-12 w-12 animate-spin text-white"xmlns=http://www.w3.org/2000/svg fill=none viewBox="0 0 24 24"><circle class=opacity-25 cx=12 cy=12 r=10 stroke=currentColor stroke-width=4></circle><path class=opacity-75 fill=currentColor d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">'), Ta = /* @__PURE__ */ F('<div class="bg-white dark:bg-neutral-900 h-screen w-full"><div class="flex min-h-screen items-center justify-center"><div class="w-full max-w-md rounded-lg bg-neutral-950 p-8 shadow-lg"><h2 class="text-center text-2xl font-bold text-white">Welcome Back 👋</h2><form class=space-y-4><div><label class="block text-gray-400">Username</label><input type=text placeholder="Enter username"class="mt-1 w-full rounded-md border border-neutral-600 bg-neutral-700 p-3 text-white placeholder-neutral-400 focus:ring-2 focus:ring-blue-500"></div><div><label class="block text-gray-400">Password</label><input type=password placeholder=•••••••• class="mt-1 w-full rounded-md border border-neutral-600 bg-neutral-700 p-3 text-white placeholder-neutral-400 focus:ring-2 focus:ring-blue-500"></div><button type=submit class="w-full rounded-md bg-blue-600 p-3 text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400">Sign In'), Ba = /* @__PURE__ */ F('<p class="text-center text-sm text-red-400">'), Pa = /* @__PURE__ */ F('<div class="dark:bg-solid-darkbg fixed inset-0 flex items-center justify-center">');
const La = () => Oa(), Ra = () => {
  const [e, t] = $(""), [n, r] = $(""), [s, o] = $(""), [i, c] = $(!1), l = Ae();
  qe();
  const u = async (f) => {
    f.preventDefault(), o(""), c(!0);
    try {
      const a = await fetch(`${ze}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          email: e(),
          password: n()
        })
      });
      if (!a.ok) {
        const h = await a.text();
        throw o(h || a.statusText), new Error(h || a.statusText);
      }
      const d = await a.json();
      if (d)
        localStorage.setItem("token", d.accessToken), location.reload(), l("/dashboard");
      else
        throw new Error("AccessToken not found in response");
    } catch (a) {
      o(a.message || "Login failed");
    } finally {
      c(!1);
    }
  };
  return C($e, {
    get when() {
      return !i();
    },
    get fallback() {
      return C(La, {});
    },
    get children() {
      var f = Ta(), a = f.firstChild, d = a.firstChild, h = d.firstChild, b = h.nextSibling, m = b.firstChild, g = m.firstChild, E = g.nextSibling, w = m.nextSibling, _ = w.firstChild, S = _.nextSibling;
      return K(d, (() => {
        var B = Lt(() => !!s());
        return () => B() && (() => {
          var A = Ba();
          return K(A, s), A;
        })();
      })(), b), b.addEventListener("submit", u), E.$$input = (B) => t(B.currentTarget.value), S.$$input = (B) => r(B.currentTarget.value), K(d, C(ka, {}), null), K(d, C(Ca, {}), null), oe(() => E.value = e()), oe(() => S.value = n()), f;
    }
  });
}, Ia = () => {
  const e = Ae();
  localStorage.getItem("user");
  const t = qe();
  return Te(() => {
    t.user()?.email && e("/dashboard");
  }), (() => {
    var n = Pa();
    return K(n, C(Ra, {})), n;
  })();
};
Pe(["input"]);
const $a = () => C(oi, {
  root: (t) => C(li, {
    get children() {
      return C(ho, {
        get children() {
          return t.children;
        }
      });
    }
  }),
  get children() {
    return [C(gt, {
      path: "/",
      component: () => C(tn, {
        isAuthenticated: !1,
        get children() {
          return C(vl, {});
        }
      })
    }), C(gt, {
      path: "/dashboard",
      component: () => C(tn, {
        isAuthenticated: !1,
        get children() {
          return C(yl, {});
        }
      })
    }), C(gt, {
      path: "/terminal",
      component: () => C(tn, {
        isAuthenticated: !1,
        get children() {
          return C(ml, {});
        }
      })
    }), C(gt, {
      path: "/login",
      component: () => C(Ia, {})
    })];
  }
}), Ma = document.getElementById("root");
_o(() => C($a, {}), Ma);
