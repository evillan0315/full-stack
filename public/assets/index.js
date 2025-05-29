const R = {
  context: void 0,
  registry: void 0,
  effects: void 0,
  done: !1,
  getContextId() {
    return zn(this.context.count);
  },
  getNextContextId() {
    return zn(this.context.count++);
  }
};
function zn(e) {
  const t = String(e), n = t.length - 1;
  return R.context.id + (n ? String.fromCharCode(96 + n) : "") + t;
}
function Ze(e) {
  R.context = e;
}
const Ks = !1, Ws = (e, t) => e === t, _t = Symbol("solid-proxy"), Lr = typeof Proxy == "function", Hs = Symbol("solid-track"), kt = {
  equals: Ws
};
let Rr = Fr;
const we = 1, st = 2, Ir = {
  owned: null,
  cleanups: null,
  context: null,
  owner: null
}, zt = {};
var $ = null;
let _ = null, zs = null, z = null, ue = null, ae = null, $t = 0;
function Me(e, t) {
  const n = z, r = $, s = e.length === 0, i = t === void 0 ? r : t, o = s ? Ir : {
    owned: null,
    cleanups: null,
    context: i ? i.context : null,
    owner: i
  }, c = s ? e : () => e(() => ce(() => Pe(o)));
  $ = o, z = null;
  try {
    return pe(c, !0);
  } finally {
    z = n, $ = r;
  }
}
function I(e, t) {
  t = t ? Object.assign({}, kt, t) : kt;
  const n = {
    value: e,
    observers: null,
    observerSlots: null,
    comparator: t.equals || void 0
  }, r = (s) => (typeof s == "function" && (_ && _.running && _.sources.has(n) ? s = s(n.tValue) : s = s(n.value)), Nr(n, s));
  return [Mr.bind(n), r];
}
function St(e, t, n) {
  const r = Ft(e, t, !0, we);
  He(r);
}
function oe(e, t, n) {
  const r = Ft(e, t, !1, we);
  He(r);
}
function Be(e, t, n) {
  Rr = ei;
  const r = Ft(e, t, !1, we), s = Ne && We(Ne);
  s && (r.suspense = s), r.user = !0, ae ? ae.push(r) : He(r);
}
function ee(e, t, n) {
  n = n ? Object.assign({}, kt, n) : kt;
  const r = Ft(e, t, !0, 0);
  return r.observers = null, r.observerSlots = null, r.comparator = n.equals || void 0, He(r), Mr.bind(r);
}
function Qs(e) {
  return e && typeof e == "object" && "then" in e;
}
function Gs(e, t, n) {
  let r, s, i;
  typeof t == "function" ? (r = e, s = t, i = {}) : (r = !0, s = e, i = t || {});
  let o = null, c = zt, l = null, u = !1, f = !1, a = "initialValue" in i, d = typeof r == "function" && ee(r);
  const h = /* @__PURE__ */ new Set(), [y, p] = (i.storage || I)(i.initialValue), [g, w] = I(void 0), [x, T] = I(void 0, {
    equals: !1
  }), [S, O] = I(a ? "ready" : "unresolved");
  R.context && (l = R.getNextContextId(), i.ssrLoadFrom === "initial" ? c = i.initialValue : R.load && R.has(l) && (c = R.load(l)));
  function k(M, m, C, E) {
    return o === M && (o = null, E !== void 0 && (a = !0), (M === c || m === c) && i.onHydrated && queueMicrotask(
      () => i.onHydrated(E, {
        value: m
      })
    ), c = zt, _ && M && u ? (_.promises.delete(M), u = !1, pe(() => {
      _.running = !0, Q(m, C);
    }, !1)) : Q(m, C)), m;
  }
  function Q(M, m) {
    pe(() => {
      m === void 0 && p(() => M), O(m !== void 0 ? "errored" : a ? "ready" : "unresolved"), w(m);
      for (const C of h.keys()) C.decrement();
      h.clear();
    }, !1);
  }
  function K() {
    const M = Ne && We(Ne), m = y(), C = g();
    if (C !== void 0 && !o) throw C;
    return z && !z.user && M && St(() => {
      x(), o && (M.resolved && _ && u ? _.promises.add(o) : h.has(M) || (M.increment(), h.add(M)));
    }), m;
  }
  function J(M = !0) {
    if (M !== !1 && f) return;
    f = !1;
    const m = d ? d() : r;
    if (u = _ && _.running, m == null || m === !1) {
      k(o, ce(y));
      return;
    }
    _ && o && _.promises.delete(o);
    const C = c !== zt ? c : ce(
      () => s(m, {
        value: y(),
        refetching: M
      })
    );
    return Qs(C) ? (o = C, "value" in C ? (C.status === "success" ? k(o, C.value, void 0, m) : k(o, void 0, ln(C.value), m), C) : (f = !0, queueMicrotask(() => f = !1), pe(() => {
      O(a ? "refreshing" : "pending"), T();
    }, !1), C.then(
      (E) => k(C, E, void 0, m),
      (E) => k(C, void 0, ln(E), m)
    ))) : (k(o, C, void 0, m), C);
  }
  Object.defineProperties(K, {
    state: {
      get: () => S()
    },
    error: {
      get: () => g()
    },
    loading: {
      get() {
        const M = S();
        return M === "pending" || M === "refreshing";
      }
    },
    latest: {
      get() {
        if (!a) return K();
        const M = g();
        if (M && !o) throw M;
        return y();
      }
    }
  });
  let V = $;
  return d ? St(() => (V = $, J(!1))) : J(!1), [
    K,
    {
      refetch: (M) => Bn(V, () => J(M)),
      mutate: p
    }
  ];
}
function $r(e) {
  return pe(e, !1);
}
function ce(e) {
  if (z === null) return e();
  const t = z;
  z = null;
  try {
    return e();
  } finally {
    z = t;
  }
}
function Ue(e, t, n) {
  const r = Array.isArray(e);
  let s, i = n && n.defer;
  return (o) => {
    let c;
    if (r) {
      c = Array(e.length);
      for (let u = 0; u < e.length; u++) c[u] = e[u]();
    } else c = e();
    if (i)
      return i = !1, o;
    const l = ce(() => t(c, s, o));
    return s = c, l;
  };
}
function Tn(e) {
  Be(() => ce(e));
}
function xe(e) {
  return $ === null || ($.cleanups === null ? $.cleanups = [e] : $.cleanups.push(e)), e;
}
function Mt() {
  return $;
}
function Bn(e, t) {
  const n = $, r = z;
  $ = e, z = null;
  try {
    return pe(t, !0);
  } catch (s) {
    Pn(s);
  } finally {
    $ = n, z = r;
  }
}
function Js(e) {
  if (_ && _.running)
    return e(), _.done;
  const t = z, n = $;
  return Promise.resolve().then(() => {
    z = t, $ = n;
    let r;
    return Ne && (r = _ || (_ = {
      sources: /* @__PURE__ */ new Set(),
      effects: [],
      promises: /* @__PURE__ */ new Set(),
      disposed: /* @__PURE__ */ new Set(),
      queue: /* @__PURE__ */ new Set(),
      running: !0
    }), r.done || (r.done = new Promise((s) => r.resolve = s)), r.running = !0), pe(e, !1), z = $ = null, r ? r.done : void 0;
  });
}
const [Oa, Qn] = /* @__PURE__ */ I(!1);
function Ys(e) {
  ae.push.apply(ae, e), e.length = 0;
}
function lt(e, t) {
  const n = Symbol("context");
  return {
    id: n,
    Provider: ti(n),
    defaultValue: e
  };
}
function We(e) {
  let t;
  return $ && $.context && (t = $.context[e.id]) !== void 0 ? t : e.defaultValue;
}
function Nt(e) {
  const t = ee(e), n = ee(() => an(t()));
  return n.toArray = () => {
    const r = n();
    return Array.isArray(r) ? r : r != null ? [r] : [];
  }, n;
}
let Ne;
function Xs() {
  return Ne || (Ne = lt());
}
function Mr() {
  const e = _ && _.running;
  if (this.sources && (e ? this.tState : this.state))
    if ((e ? this.tState : this.state) === we) He(this);
    else {
      const t = ue;
      ue = null, pe(() => Ct(this), !1), ue = t;
    }
  if (z) {
    const t = this.observers ? this.observers.length : 0;
    z.sources ? (z.sources.push(this), z.sourceSlots.push(t)) : (z.sources = [this], z.sourceSlots = [t]), this.observers ? (this.observers.push(z), this.observerSlots.push(z.sources.length - 1)) : (this.observers = [z], this.observerSlots = [z.sources.length - 1]);
  }
  return e && _.sources.has(this) ? this.tValue : this.value;
}
function Nr(e, t, n) {
  let r = _ && _.running && _.sources.has(e) ? e.tValue : e.value;
  if (!e.comparator || !e.comparator(r, t)) {
    if (_) {
      const s = _.running;
      (s || !n && _.sources.has(e)) && (_.sources.add(e), e.tValue = t), s || (e.value = t);
    } else e.value = t;
    e.observers && e.observers.length && pe(() => {
      for (let s = 0; s < e.observers.length; s += 1) {
        const i = e.observers[s], o = _ && _.running;
        o && _.disposed.has(i) || ((o ? !i.tState : !i.state) && (i.pure ? ue.push(i) : ae.push(i), i.observers && Dr(i)), o ? i.tState = we : i.state = we);
      }
      if (ue.length > 1e6)
        throw ue = [], new Error();
    }, !1);
  }
  return t;
}
function He(e) {
  if (!e.fn) return;
  Pe(e);
  const t = $t;
  Gn(
    e,
    _ && _.running && _.sources.has(e) ? e.tValue : e.value,
    t
  ), _ && !_.running && _.sources.has(e) && queueMicrotask(() => {
    pe(() => {
      _ && (_.running = !0), z = $ = e, Gn(e, e.tValue, t), z = $ = null;
    }, !1);
  });
}
function Gn(e, t, n) {
  let r;
  const s = $, i = z;
  z = $ = e;
  try {
    r = e.fn(t);
  } catch (o) {
    return e.pure && (_ && _.running ? (e.tState = we, e.tOwned && e.tOwned.forEach(Pe), e.tOwned = void 0) : (e.state = we, e.owned && e.owned.forEach(Pe), e.owned = null)), e.updatedAt = n + 1, Pn(o);
  } finally {
    z = i, $ = s;
  }
  (!e.updatedAt || e.updatedAt <= n) && (e.updatedAt != null && "observers" in e ? Nr(e, r, !0) : _ && _.running && e.pure ? (_.sources.add(e), e.tValue = r) : e.value = r, e.updatedAt = n);
}
function Ft(e, t, n, r = we, s) {
  const i = {
    fn: e,
    state: r,
    updatedAt: null,
    owned: null,
    sources: null,
    sourceSlots: null,
    cleanups: null,
    value: t,
    owner: $,
    context: $ ? $.context : null,
    pure: n
  };
  return _ && _.running && (i.state = 0, i.tState = r), $ === null || $ !== Ir && (_ && _.running && $.pure ? $.tOwned ? $.tOwned.push(i) : $.tOwned = [i] : $.owned ? $.owned.push(i) : $.owned = [i]), i;
}
function At(e) {
  const t = _ && _.running;
  if ((t ? e.tState : e.state) === 0) return;
  if ((t ? e.tState : e.state) === st) return Ct(e);
  if (e.suspense && ce(e.suspense.inFallback)) return e.suspense.effects.push(e);
  const n = [e];
  for (; (e = e.owner) && (!e.updatedAt || e.updatedAt < $t); ) {
    if (t && _.disposed.has(e)) return;
    (t ? e.tState : e.state) && n.push(e);
  }
  for (let r = n.length - 1; r >= 0; r--) {
    if (e = n[r], t) {
      let s = e, i = n[r + 1];
      for (; (s = s.owner) && s !== i; )
        if (_.disposed.has(s)) return;
    }
    if ((t ? e.tState : e.state) === we)
      He(e);
    else if ((t ? e.tState : e.state) === st) {
      const s = ue;
      ue = null, pe(() => Ct(e, n[0]), !1), ue = s;
    }
  }
}
function pe(e, t) {
  if (ue) return e();
  let n = !1;
  t || (ue = []), ae ? n = !0 : ae = [], $t++;
  try {
    const r = e();
    return Zs(n), r;
  } catch (r) {
    n || (ae = null), ue = null, Pn(r);
  }
}
function Zs(e) {
  if (ue && (Fr(ue), ue = null), e) return;
  let t;
  if (_) {
    if (!_.promises.size && !_.queue.size) {
      const r = _.sources, s = _.disposed;
      ae.push.apply(ae, _.effects), t = _.resolve;
      for (const i of ae)
        "tState" in i && (i.state = i.tState), delete i.tState;
      _ = null, pe(() => {
        for (const i of s) Pe(i);
        for (const i of r) {
          if (i.value = i.tValue, i.owned)
            for (let o = 0, c = i.owned.length; o < c; o++) Pe(i.owned[o]);
          i.tOwned && (i.owned = i.tOwned), delete i.tValue, delete i.tOwned, i.tState = 0;
        }
        Qn(!1);
      }, !1);
    } else if (_.running) {
      _.running = !1, _.effects.push.apply(_.effects, ae), ae = null, Qn(!0);
      return;
    }
  }
  const n = ae;
  ae = null, n.length && pe(() => Rr(n), !1), t && t();
}
function Fr(e) {
  for (let t = 0; t < e.length; t++) At(e[t]);
}
function ei(e) {
  let t, n = 0;
  for (t = 0; t < e.length; t++) {
    const r = e[t];
    r.user ? e[n++] = r : At(r);
  }
  if (R.context) {
    if (R.count) {
      R.effects || (R.effects = []), R.effects.push(...e.slice(0, n));
      return;
    }
    Ze();
  }
  for (R.effects && (R.done || !R.count) && (e = [...R.effects, ...e], n += R.effects.length, delete R.effects), t = 0; t < n; t++) At(e[t]);
}
function Ct(e, t) {
  const n = _ && _.running;
  n ? e.tState = 0 : e.state = 0;
  for (let r = 0; r < e.sources.length; r += 1) {
    const s = e.sources[r];
    if (s.sources) {
      const i = n ? s.tState : s.state;
      i === we ? s !== t && (!s.updatedAt || s.updatedAt < $t) && At(s) : i === st && Ct(s, t);
    }
  }
}
function Dr(e) {
  const t = _ && _.running;
  for (let n = 0; n < e.observers.length; n += 1) {
    const r = e.observers[n];
    (t ? !r.tState : !r.state) && (t ? r.tState = st : r.state = st, r.pure ? ue.push(r) : ae.push(r), r.observers && Dr(r));
  }
}
function Pe(e) {
  let t;
  if (e.sources)
    for (; e.sources.length; ) {
      const n = e.sources.pop(), r = e.sourceSlots.pop(), s = n.observers;
      if (s && s.length) {
        const i = s.pop(), o = n.observerSlots.pop();
        r < s.length && (i.sourceSlots[o] = r, s[r] = i, n.observerSlots[r] = o);
      }
    }
  if (e.tOwned) {
    for (t = e.tOwned.length - 1; t >= 0; t--) Pe(e.tOwned[t]);
    delete e.tOwned;
  }
  if (_ && _.running && e.pure)
    qr(e, !0);
  else if (e.owned) {
    for (t = e.owned.length - 1; t >= 0; t--) Pe(e.owned[t]);
    e.owned = null;
  }
  if (e.cleanups) {
    for (t = e.cleanups.length - 1; t >= 0; t--) e.cleanups[t]();
    e.cleanups = null;
  }
  _ && _.running ? e.tState = 0 : e.state = 0;
}
function qr(e, t) {
  if (t || (e.tState = 0, _.disposed.add(e)), e.owned)
    for (let n = 0; n < e.owned.length; n++) qr(e.owned[n]);
}
function ln(e) {
  return e instanceof Error ? e : new Error(typeof e == "string" ? e : "Unknown error", {
    cause: e
  });
}
function Pn(e, t = $) {
  throw ln(e);
}
function an(e) {
  if (typeof e == "function" && !e.length) return an(e());
  if (Array.isArray(e)) {
    const t = [];
    for (let n = 0; n < e.length; n++) {
      const r = an(e[n]);
      Array.isArray(r) ? t.push.apply(t, r) : t.push(r);
    }
    return t;
  }
  return e;
}
function ti(e, t) {
  return function(r) {
    let s;
    return oe(
      () => s = ce(() => ($.context = {
        ...$.context,
        [e]: r.value
      }, Nt(() => r.children))),
      void 0
    ), s;
  };
}
const ni = Symbol("fallback");
function Jn(e) {
  for (let t = 0; t < e.length; t++) e[t]();
}
function ri(e, t, n = {}) {
  let r = [], s = [], i = [], o = 0, c = t.length > 1 ? [] : null;
  return xe(() => Jn(i)), () => {
    let l = e() || [], u = l.length, f, a;
    return l[Hs], ce(() => {
      let h, y, p, g, w, x, T, S, O;
      if (u === 0)
        o !== 0 && (Jn(i), i = [], r = [], s = [], o = 0, c && (c = [])), n.fallback && (r = [ni], s[0] = Me((k) => (i[0] = k, n.fallback())), o = 1);
      else if (o === 0) {
        for (s = new Array(u), a = 0; a < u; a++)
          r[a] = l[a], s[a] = Me(d);
        o = u;
      } else {
        for (p = new Array(u), g = new Array(u), c && (w = new Array(u)), x = 0, T = Math.min(o, u); x < T && r[x] === l[x]; x++) ;
        for (T = o - 1, S = u - 1; T >= x && S >= x && r[T] === l[S]; T--, S--)
          p[S] = s[T], g[S] = i[T], c && (w[S] = c[T]);
        for (h = /* @__PURE__ */ new Map(), y = new Array(S + 1), a = S; a >= x; a--)
          O = l[a], f = h.get(O), y[a] = f === void 0 ? -1 : f, h.set(O, a);
        for (f = x; f <= T; f++)
          O = r[f], a = h.get(O), a !== void 0 && a !== -1 ? (p[a] = s[f], g[a] = i[f], c && (w[a] = c[f]), a = y[a], h.set(O, a)) : i[f]();
        for (a = x; a < u; a++)
          a in p ? (s[a] = p[a], i[a] = g[a], c && (c[a] = w[a], c[a](a))) : s[a] = Me(d);
        s = s.slice(0, o = u), r = l.slice(0);
      }
      return s;
    });
    function d(h) {
      if (i[a] = h, c) {
        const [y, p] = I(a);
        return c[a] = p, t(l[a], y);
      }
      return t(l[a]);
    }
  };
}
function P(e, t) {
  return ce(() => e(t || {}));
}
function ft() {
  return !0;
}
const un = {
  get(e, t, n) {
    return t === _t ? n : e.get(t);
  },
  has(e, t) {
    return t === _t ? !0 : e.has(t);
  },
  set: ft,
  deleteProperty: ft,
  getOwnPropertyDescriptor(e, t) {
    return {
      configurable: !0,
      enumerable: !0,
      get() {
        return e.get(t);
      },
      set: ft,
      deleteProperty: ft
    };
  },
  ownKeys(e) {
    return e.keys();
  }
};
function Qt(e) {
  return (e = typeof e == "function" ? e() : e) ? e : {};
}
function si() {
  for (let e = 0, t = this.length; e < t; ++e) {
    const n = this[e]();
    if (n !== void 0) return n;
  }
}
function Ln(...e) {
  let t = !1;
  for (let o = 0; o < e.length; o++) {
    const c = e[o];
    t = t || !!c && _t in c, e[o] = typeof c == "function" ? (t = !0, ee(c)) : c;
  }
  if (Lr && t)
    return new Proxy(
      {
        get(o) {
          for (let c = e.length - 1; c >= 0; c--) {
            const l = Qt(e[c])[o];
            if (l !== void 0) return l;
          }
        },
        has(o) {
          for (let c = e.length - 1; c >= 0; c--)
            if (o in Qt(e[c])) return !0;
          return !1;
        },
        keys() {
          const o = [];
          for (let c = 0; c < e.length; c++)
            o.push(...Object.keys(Qt(e[c])));
          return [...new Set(o)];
        }
      },
      un
    );
  const n = {}, r = /* @__PURE__ */ Object.create(null);
  for (let o = e.length - 1; o >= 0; o--) {
    const c = e[o];
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
          get: si.bind(n[f] = [a.get.bind(c)])
        } : a.value !== void 0 ? a : void 0;
      else {
        const d = n[f];
        d && (a.get ? d.push(a.get.bind(c)) : a.value !== void 0 && d.push(() => a.value));
      }
    }
  }
  const s = {}, i = Object.keys(r);
  for (let o = i.length - 1; o >= 0; o--) {
    const c = i[o], l = r[c];
    l && l.get ? Object.defineProperty(s, c, l) : s[c] = l ? l.value : void 0;
  }
  return s;
}
function ii(e, ...t) {
  if (Lr && _t in e) {
    const s = new Set(t.length > 1 ? t.flat() : t[0]), i = t.map((o) => new Proxy(
      {
        get(c) {
          return o.includes(c) ? e[c] : void 0;
        },
        has(c) {
          return o.includes(c) && c in e;
        },
        keys() {
          return o.filter((c) => c in e);
        }
      },
      un
    ));
    return i.push(
      new Proxy(
        {
          get(o) {
            return s.has(o) ? void 0 : e[o];
          },
          has(o) {
            return s.has(o) ? !1 : o in e;
          },
          keys() {
            return Object.keys(e).filter((o) => !s.has(o));
          }
        },
        un
      )
    ), i;
  }
  const n = {}, r = t.map(() => ({}));
  for (const s of Object.getOwnPropertyNames(e)) {
    const i = Object.getOwnPropertyDescriptor(e, s), o = !i.get && !i.set && i.enumerable && i.writable && i.configurable;
    let c = !1, l = 0;
    for (const u of t)
      u.includes(s) && (c = !0, o ? r[l][s] = i.value : Object.defineProperty(r[l], s, i)), ++l;
    c || (o ? n[s] = i.value : Object.defineProperty(n, s, i));
  }
  return [...r, n];
}
let oi = 0;
function ci() {
  return R.context ? R.getNextContextId() : `cl-${oi++}`;
}
const li = (e) => `Stale read from <${e}>.`;
function Yn(e) {
  const t = "fallback" in e && {
    fallback: () => e.fallback
  };
  return ee(ri(() => e.each, e.children, t || void 0));
}
function Oe(e) {
  const t = e.keyed, n = ee(() => e.when, void 0, void 0), r = t ? n : ee(n, void 0, {
    equals: (s, i) => !s == !i
  });
  return ee(
    () => {
      const s = r();
      if (s) {
        const i = e.children;
        return typeof i == "function" && i.length > 0 ? ce(
          () => i(
            t ? s : () => {
              if (!ce(r)) throw li("Show");
              return n();
            }
          )
        ) : i;
      }
      return e.fallback;
    },
    void 0,
    void 0
  );
}
const ai = /* @__PURE__ */ lt();
function ui(e) {
  let t = 0, n, r, s, i, o;
  const [c, l] = I(!1), u = Xs(), f = {
    increment: () => {
      ++t === 1 && l(!0);
    },
    decrement: () => {
      --t === 0 && l(!1);
    },
    inFallback: c,
    effects: [],
    resolved: !1
  }, a = Mt();
  if (R.context && R.load) {
    const y = R.getContextId();
    let p = R.load(y);
    if (p && (typeof p != "object" || p.status !== "success" ? s = p : R.gather(y)), s && s !== "$$f") {
      const [g, w] = I(void 0, {
        equals: !1
      });
      i = g, s.then(
        () => {
          if (R.done) return w();
          R.gather(y), Ze(r), w(), Ze();
        },
        (x) => {
          o = x, w();
        }
      );
    }
  }
  const d = We(ai);
  d && (n = d.register(f.inFallback));
  let h;
  return xe(() => h && h()), P(u.Provider, {
    value: f,
    get children() {
      return ee(() => {
        if (o) throw o;
        if (r = R.context, i)
          return i(), i = void 0;
        r && s === "$$f" && Ze();
        const y = ee(() => e.children);
        return ee((p) => {
          const g = f.inFallback(), { showContent: w = !0, showFallback: x = !0 } = n ? n() : {};
          if ((!g || s && s !== "$$f") && w)
            return f.resolved = !0, h && h(), h = r = s = void 0, Ys(f.effects), y();
          if (x)
            return h ? p : Me((T) => (h = T, r && (Ze({
              id: r.id + "F",
              count: 0
            }), r = void 0), e.fallback), a);
        });
      });
    }
  });
}
const fi = [
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
], di = /* @__PURE__ */ new Set([
  "className",
  "value",
  "readOnly",
  "noValidate",
  "formNoValidate",
  "isMap",
  "noModule",
  "playsInline",
  ...fi
]), hi = /* @__PURE__ */ new Set([
  "innerHTML",
  "textContent",
  "innerText",
  "children"
]), pi = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(null), {
  className: "class",
  htmlFor: "for"
}), mi = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(null), {
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
function gi(e, t) {
  const n = mi[e];
  return typeof n == "object" ? n[t] ? n.$ : void 0 : n;
}
const yi = /* @__PURE__ */ new Set([
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
]), bi = {
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace"
}, Ot = (e) => ee(() => e());
function vi(e, t, n) {
  let r = n.length, s = t.length, i = r, o = 0, c = 0, l = t[s - 1].nextSibling, u = null;
  for (; o < s || c < i; ) {
    if (t[o] === n[c]) {
      o++, c++;
      continue;
    }
    for (; t[s - 1] === n[i - 1]; )
      s--, i--;
    if (s === o) {
      const f = i < r ? c ? n[c - 1].nextSibling : n[i - c] : l;
      for (; c < i; ) e.insertBefore(n[c++], f);
    } else if (i === c)
      for (; o < s; )
        (!u || !u.has(t[o])) && t[o].remove(), o++;
    else if (t[o] === n[i - 1] && n[c] === t[s - 1]) {
      const f = t[--s].nextSibling;
      e.insertBefore(n[c++], t[o++].nextSibling), e.insertBefore(n[--i], f), t[s] = n[i];
    } else {
      if (!u) {
        u = /* @__PURE__ */ new Map();
        let a = c;
        for (; a < i; ) u.set(n[a], a++);
      }
      const f = u.get(t[o]);
      if (f != null)
        if (c < f && f < i) {
          let a = o, d = 1, h;
          for (; ++a < s && a < i && !((h = u.get(t[a])) == null || h !== f + d); )
            d++;
          if (d > f - c) {
            const y = t[o];
            for (; c < f; ) e.insertBefore(n[c++], y);
          } else e.replaceChild(n[c++], t[o++]);
        } else o++;
      else t[o++].remove();
    }
  }
}
const Xn = "_$DX_DELEGATE";
function wi(e, t, n, r = {}) {
  let s;
  return Me((i) => {
    s = i, t === document ? e() : U(t, e(), t.firstChild ? null : void 0, n);
  }, r.owner), () => {
    s(), t.textContent = "";
  };
}
function q(e, t, n, r) {
  let s;
  const i = () => {
    const c = r ? document.createElementNS("http://www.w3.org/1998/Math/MathML", "template") : document.createElement("template");
    return c.innerHTML = e, n ? c.content.firstChild.firstChild : r ? c.firstChild : c.content.firstChild;
  }, o = t ? () => ce(() => document.importNode(s || (s = i()), !0)) : () => (s || (s = i())).cloneNode(!0);
  return o.cloneNode = o, o;
}
function Le(e, t = window.document) {
  const n = t[Xn] || (t[Xn] = /* @__PURE__ */ new Set());
  for (let r = 0, s = e.length; r < s; r++) {
    const i = e[r];
    n.has(i) || (n.add(i), t.addEventListener(i, Ai));
  }
}
function te(e, t, n) {
  ze(e) || (n == null ? e.removeAttribute(t) : e.setAttribute(t, n));
}
function Ei(e, t, n, r) {
  ze(e) || (r == null ? e.removeAttributeNS(t, n) : e.setAttributeNS(t, n, r));
}
function xi(e, t, n) {
  ze(e) || (n ? e.setAttribute(t, "") : e.removeAttribute(t));
}
function Ve(e, t) {
  ze(e) || (t == null ? e.removeAttribute("class") : e.className = t);
}
function qe(e, t, n, r) {
  if (r)
    Array.isArray(n) ? (e[`$$${t}`] = n[0], e[`$$${t}Data`] = n[1]) : e[`$$${t}`] = n;
  else if (Array.isArray(n)) {
    const s = n[0];
    e.addEventListener(t, n[0] = (i) => s.call(e, n[1], i));
  } else e.addEventListener(t, n, typeof n != "function" && n);
}
function Tt(e, t, n = {}) {
  const r = Object.keys(t || {}), s = Object.keys(n);
  let i, o;
  for (i = 0, o = s.length; i < o; i++) {
    const c = s[i];
    !c || c === "undefined" || t[c] || (Zn(e, c, !1), delete n[c]);
  }
  for (i = 0, o = r.length; i < o; i++) {
    const c = r[i], l = !!t[c];
    !c || c === "undefined" || n[c] === l || !l || (Zn(e, c, !0), n[c] = l);
  }
  return n;
}
function _i(e, t, n) {
  if (!t) return n ? te(e, "style") : t;
  const r = e.style;
  if (typeof t == "string") return r.cssText = t;
  typeof n == "string" && (r.cssText = n = void 0), n || (n = {}), t || (t = {});
  let s, i;
  for (i in n)
    t[i] == null && r.removeProperty(i), delete n[i];
  for (i in t)
    s = t[i], s !== n[i] && (r.setProperty(i, s), n[i] = s);
  return n;
}
function jr(e, t = {}, n, r) {
  const s = {};
  return r || oe(
    () => s.children = it(e, t.children, s.children)
  ), oe(() => typeof t.ref == "function" && ke(t.ref, e)), oe(() => ki(e, t, n, !0, s, !0)), s;
}
function ke(e, t, n) {
  return ce(() => e(t, n));
}
function U(e, t, n, r) {
  if (n !== void 0 && !r && (r = []), typeof t != "function") return it(e, t, r, n);
  oe((s) => it(e, t(), s, n), r);
}
function ki(e, t, n, r, s = {}, i = !1) {
  t || (t = {});
  for (const o in s)
    if (!(o in t)) {
      if (o === "children") continue;
      s[o] = er(e, o, null, s[o], n, i, t);
    }
  for (const o in t) {
    if (o === "children")
      continue;
    const c = t[o];
    s[o] = er(e, o, c, s[o], n, i, t);
  }
}
function ze(e) {
  return !!R.context && !R.done && (!e || e.isConnected);
}
function Si(e) {
  return e.toLowerCase().replace(/-([a-z])/g, (t, n) => n.toUpperCase());
}
function Zn(e, t, n) {
  const r = t.trim().split(/\s+/);
  for (let s = 0, i = r.length; s < i; s++)
    e.classList.toggle(r[s], n);
}
function er(e, t, n, r, s, i, o) {
  let c, l, u, f, a;
  if (t === "style") return _i(e, n, r);
  if (t === "classList") return Tt(e, n, r);
  if (n === r) return r;
  if (t === "ref")
    i || n(e);
  else if (t.slice(0, 3) === "on:") {
    const d = t.slice(3);
    r && e.removeEventListener(d, r, typeof r != "function" && r), n && e.addEventListener(d, n, typeof n != "function" && n);
  } else if (t.slice(0, 10) === "oncapture:") {
    const d = t.slice(10);
    r && e.removeEventListener(d, r, !0), n && e.addEventListener(d, n, !0);
  } else if (t.slice(0, 2) === "on") {
    const d = t.slice(2).toLowerCase(), h = yi.has(d);
    if (!h && r) {
      const y = Array.isArray(r) ? r[0] : r;
      e.removeEventListener(d, y);
    }
    (h || n) && (qe(e, d, n, h), h && Le([d]));
  } else if (t.slice(0, 5) === "attr:")
    te(e, t.slice(5), n);
  else if (t.slice(0, 5) === "bool:")
    xi(e, t.slice(5), n);
  else if ((a = t.slice(0, 5) === "prop:") || (u = hi.has(t)) || !s && ((f = gi(t, e.tagName)) || (l = di.has(t))) || (c = e.nodeName.includes("-") || "is" in o)) {
    if (a)
      t = t.slice(5), l = !0;
    else if (ze(e)) return n;
    t === "class" || t === "className" ? Ve(e, n) : c && !l && !u ? e[Si(t)] = n : e[f || t] = n;
  } else {
    const d = s && t.indexOf(":") > -1 && bi[t.split(":")[0]];
    d ? Ei(e, d, t, n) : te(e, pi[t] || t, n);
  }
  return n;
}
function Ai(e) {
  if (R.registry && R.events && R.events.find(([l, u]) => u === e))
    return;
  let t = e.target;
  const n = `$$${e.type}`, r = e.target, s = e.currentTarget, i = (l) => Object.defineProperty(e, "target", {
    configurable: !0,
    value: l
  }), o = () => {
    const l = t[n];
    if (l && !t.disabled) {
      const u = t[`${n}Data`];
      if (u !== void 0 ? l.call(t, u, e) : l.call(t, e), e.cancelBubble) return;
    }
    return t.host && typeof t.host != "string" && !t.host._$host && t.contains(e.target) && i(t.host), !0;
  }, c = () => {
    for (; o() && (t = t._$host || t.parentNode || t.host); ) ;
  };
  if (Object.defineProperty(e, "currentTarget", {
    configurable: !0,
    get() {
      return t || document;
    }
  }), R.registry && !R.done && (R.done = _$HY.done = !0), e.composedPath) {
    const l = e.composedPath();
    i(l[0]);
    for (let u = 0; u < l.length - 2 && (t = l[u], !!o()); u++) {
      if (t._$host) {
        t = t._$host, c();
        break;
      }
      if (t.parentNode === s)
        break;
    }
  } else c();
  i(r);
}
function it(e, t, n, r, s) {
  const i = ze(e);
  if (i) {
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
  const o = typeof t, c = r !== void 0;
  if (e = c && n[0] && n[0].parentNode || e, o === "string" || o === "number") {
    if (i || o === "number" && (t = t.toString(), t === n))
      return n;
    if (c) {
      let l = n[0];
      l && l.nodeType === 3 ? l.data !== t && (l.data = t) : l = document.createTextNode(t), n = De(e, n, r, l);
    } else
      n !== "" && typeof n == "string" ? n = e.firstChild.data = t : n = e.textContent = t;
  } else if (t == null || o === "boolean") {
    if (i) return n;
    n = De(e, n, r);
  } else {
    if (o === "function")
      return oe(() => {
        let l = t();
        for (; typeof l == "function"; ) l = l();
        n = it(e, l, n, r);
      }), () => n;
    if (Array.isArray(t)) {
      const l = [], u = n && Array.isArray(n);
      if (fn(l, t, n, s))
        return oe(() => n = it(e, l, n, r, !0)), () => n;
      if (i) {
        if (!l.length) return n;
        if (r === void 0) return n = [...e.childNodes];
        let f = l[0];
        if (f.parentNode !== e) return n;
        const a = [f];
        for (; (f = f.nextSibling) !== r; ) a.push(f);
        return n = a;
      }
      if (l.length === 0) {
        if (n = De(e, n, r), c) return n;
      } else u ? n.length === 0 ? tr(e, l, r) : vi(e, n, l) : (n && De(e), tr(e, l));
      n = l;
    } else if (t.nodeType) {
      if (i && t.parentNode) return n = c ? [t] : t;
      if (Array.isArray(n)) {
        if (c) return n = De(e, n, r, t);
        De(e, n, null, t);
      } else n == null || n === "" || !e.firstChild ? e.appendChild(t) : e.replaceChild(t, e.firstChild);
      n = t;
    }
  }
  return n;
}
function fn(e, t, n, r) {
  let s = !1;
  for (let i = 0, o = t.length; i < o; i++) {
    let c = t[i], l = n && n[e.length], u;
    if (!(c == null || c === !0 || c === !1)) if ((u = typeof c) == "object" && c.nodeType)
      e.push(c);
    else if (Array.isArray(c))
      s = fn(e, c, l) || s;
    else if (u === "function")
      if (r) {
        for (; typeof c == "function"; ) c = c();
        s = fn(
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
function tr(e, t, n = null) {
  for (let r = 0, s = t.length; r < s; r++) e.insertBefore(t[r], n);
}
function De(e, t, n, r) {
  if (n === void 0) return e.textContent = "";
  const s = r || document.createTextNode("");
  if (t.length) {
    let i = !1;
    for (let o = t.length - 1; o >= 0; o--) {
      const c = t[o];
      if (s !== c) {
        const l = c.parentNode === e;
        !i && !o ? l ? e.replaceChild(s, c) : e.insertBefore(s, n) : l && c.remove();
      } else i = !0;
    }
  } else e.insertBefore(s, n);
  return [s];
}
const Ur = !1;
function Vr() {
  let e = /* @__PURE__ */ new Set();
  function t(s) {
    return e.add(s), () => e.delete(s);
  }
  let n = !1;
  function r(s, i) {
    if (n)
      return !(n = !1);
    const o = {
      to: s,
      options: i,
      defaultPrevented: !1,
      preventDefault: () => o.defaultPrevented = !0
    };
    for (const c of e)
      c.listener({
        ...o,
        from: c.location,
        retry: (l) => {
          l && (n = !0), c.navigate(s, { ...i, resolve: !1 });
        }
      });
    return !o.defaultPrevented;
  }
  return {
    subscribe: t,
    confirm: r
  };
}
let dn;
function Rn() {
  (!window.history.state || window.history.state._depth == null) && window.history.replaceState({ ...window.history.state, _depth: window.history.length - 1 }, ""), dn = window.history.state._depth;
}
Rn();
function Ci(e) {
  return {
    ...e,
    _depth: window.history.state && window.history.state._depth
  };
}
function Oi(e, t) {
  let n = !1;
  return () => {
    const r = dn;
    Rn();
    const s = r == null ? null : dn - r;
    if (n) {
      n = !1;
      return;
    }
    s && t(s) ? (n = !0, window.history.go(-s)) : e();
  };
}
const Ti = /^(?:[a-z0-9]+:)?\/\//i, Bi = /^\/+|(\/)\/+$/g, Kr = "http://sr";
function tt(e, t = !1) {
  const n = e.replace(Bi, "$1");
  return n ? t || /^[?#]/.test(n) ? n : "/" + n : "";
}
function mt(e, t, n) {
  if (Ti.test(t))
    return;
  const r = tt(e), s = n && tt(n);
  let i = "";
  return !s || t.startsWith("/") ? i = r : s.toLowerCase().indexOf(r.toLowerCase()) !== 0 ? i = r + s : i = s, (i || "/") + tt(t, !i);
}
function Pi(e, t) {
  if (e == null)
    throw new Error(t);
  return e;
}
function Li(e, t) {
  return tt(e).replace(/\/*(\*.*)?$/g, "") + tt(t);
}
function Wr(e) {
  const t = {};
  return e.searchParams.forEach((n, r) => {
    r in t ? Array.isArray(t[r]) ? t[r].push(n) : t[r] = [t[r], n] : t[r] = n;
  }), t;
}
function Ri(e, t, n) {
  const [r, s] = e.split("/*", 2), i = r.split("/").filter(Boolean), o = i.length;
  return (c) => {
    const l = c.split("/").filter(Boolean), u = l.length - o;
    if (u < 0 || u > 0 && s === void 0 && !t)
      return null;
    const f = {
      path: o ? "" : "/",
      params: {}
    }, a = (d) => n === void 0 ? void 0 : n[d];
    for (let d = 0; d < o; d++) {
      const h = i[d], y = h[0] === ":", p = y ? l[d] : l[d].toLowerCase(), g = y ? h.slice(1) : h.toLowerCase();
      if (y && Gt(p, a(g)))
        f.params[g] = p;
      else if (y || !Gt(p, g))
        return null;
      f.path += `/${p}`;
    }
    if (s) {
      const d = u ? l.slice(-u).join("/") : "";
      if (Gt(d, a(s)))
        f.params[s] = d;
      else
        return null;
    }
    return f;
  };
}
function Gt(e, t) {
  const n = (r) => r === e;
  return t === void 0 ? !0 : typeof t == "string" ? n(t) : typeof t == "function" ? t(e) : Array.isArray(t) ? t.some(n) : t instanceof RegExp ? t.test(e) : !1;
}
function Ii(e) {
  const [t, n] = e.pattern.split("/*", 2), r = t.split("/").filter(Boolean);
  return r.reduce((s, i) => s + (i.startsWith(":") ? 2 : 3), r.length - (n === void 0 ? 0 : 1));
}
function Hr(e) {
  const t = /* @__PURE__ */ new Map(), n = Mt();
  return new Proxy({}, {
    get(r, s) {
      return t.has(s) || Bn(n, () => t.set(s, ee(() => e()[s]))), t.get(s)();
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
function $i(e, t) {
  const n = new URLSearchParams(e);
  Object.entries(t).forEach(([s, i]) => {
    i == null || i === "" || i instanceof Array && !i.length ? n.delete(s) : i instanceof Array ? (n.delete(s), i.forEach((o) => {
      n.append(s, String(o));
    })) : n.set(s, String(i));
  });
  const r = n.toString();
  return r ? `?${r}` : "";
}
function zr(e) {
  let t = /(\/?\:[^\/]+)\?/.exec(e);
  if (!t)
    return [e];
  let n = e.slice(0, t.index), r = e.slice(t.index + t[0].length);
  const s = [n, n += t[1]];
  for (; t = /^(\/\:[^\/]+)\?/.exec(r); )
    s.push(n += t[1]), r = r.slice(t[0].length);
  return zr(r).reduce((i, o) => [...i, ...s.map((c) => c + o)], []);
}
const Mi = 100, Qr = lt(), Gr = lt(), In = () => Pi(We(Qr), "<A> and 'use' router primitives can be only used inside a Route."), Ae = () => In().navigatorFactory(), Dt = () => In().location, $n = () => In().params, Ni = () => {
  const e = Dt(), t = Ae(), n = (r, s) => {
    const i = ce(() => $i(e.search, r) + e.hash);
    t(i, {
      scroll: !1,
      resolve: !1,
      ...s
    });
  };
  return [e.query, n];
};
function Fi(e, t = "") {
  const { component: n, preload: r, load: s, children: i, info: o } = e, c = !i || Array.isArray(i) && !i.length, l = {
    key: e,
    component: n,
    preload: r || s,
    info: o
  };
  return Jr(e.path).reduce((u, f) => {
    for (const a of zr(f)) {
      const d = Li(t, a);
      let h = c ? d : d.split("/*", 1)[0];
      h = h.split("/").map((y) => y.startsWith(":") || y.startsWith("*") ? y : encodeURIComponent(y)).join("/"), u.push({
        ...l,
        originalPath: f,
        pattern: h,
        matcher: Ri(h, !c, e.matchFilters)
      });
    }
    return u;
  }, []);
}
function Di(e, t = 0) {
  return {
    routes: e,
    score: Ii(e[e.length - 1]) * 1e4 - t,
    matcher(n) {
      const r = [];
      for (let s = e.length - 1; s >= 0; s--) {
        const i = e[s], o = i.matcher(n);
        if (!o)
          return null;
        r.unshift({
          ...o,
          route: i
        });
      }
      return r;
    }
  };
}
function Jr(e) {
  return Array.isArray(e) ? e : [e];
}
function Yr(e, t = "", n = [], r = []) {
  const s = Jr(e);
  for (let i = 0, o = s.length; i < o; i++) {
    const c = s[i];
    if (c && typeof c == "object") {
      c.hasOwnProperty("path") || (c.path = "");
      const l = Fi(c, t);
      for (const u of l) {
        n.push(u);
        const f = Array.isArray(c.children) && c.children.length === 0;
        if (c.children && !f)
          Yr(c.children, u.pattern, n, r);
        else {
          const a = Di([...n], r.length);
          r.push(a);
        }
        n.pop();
      }
    }
  }
  return n.length ? r : r.sort((i, o) => o.score - i.score);
}
function Jt(e, t) {
  for (let n = 0, r = e.length; n < r; n++) {
    const s = e[n].matcher(t);
    if (s)
      return s;
  }
  return [];
}
function qi(e, t, n) {
  const r = new URL(Kr), s = ee((f) => {
    const a = e();
    try {
      return new URL(a, r);
    } catch {
      return console.error(`Invalid path ${a}`), f;
    }
  }, r, {
    equals: (f, a) => f.href === a.href
  }), i = ee(() => s().pathname), o = ee(() => s().search, !0), c = ee(() => s().hash), l = () => "", u = Ue(o, () => Wr(s()));
  return {
    get pathname() {
      return i();
    },
    get search() {
      return o();
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
    query: n ? n(u) : Hr(u)
  };
}
let $e;
function ji() {
  return $e;
}
function Ui(e, t, n, r = {}) {
  const { signal: [s, i], utils: o = {} } = e, c = o.parsePath || ((E) => E), l = o.renderPath || ((E) => E), u = o.beforeLeave || Vr(), f = mt("", r.base || "");
  if (f === void 0)
    throw new Error(`${f} is not a valid base path`);
  f && !s().value && i({ value: f, replace: !0, scroll: !1 });
  const [a, d] = I(!1);
  let h;
  const y = (E, L) => {
    L.value === p() && L.state === w() || (h === void 0 && d(!0), $e = E, h = L, Js(() => {
      h === L && (g(h.value), x(h.state), O[1]((W) => W.filter((G) => G.pending)));
    }).finally(() => {
      h === L && $r(() => {
        $e = void 0, E === "navigate" && m(h), d(!1), h = void 0;
      });
    }));
  }, [p, g] = I(s().value), [w, x] = I(s().state), T = qi(p, w, o.queryWrapper), S = [], O = I([]), k = ee(() => typeof r.transformUrl == "function" ? Jt(t(), r.transformUrl(T.pathname)) : Jt(t(), T.pathname)), Q = () => {
    const E = k(), L = {};
    for (let W = 0; W < E.length; W++)
      Object.assign(L, E[W].params);
    return L;
  }, K = o.paramsWrapper ? o.paramsWrapper(Q, t) : Hr(Q), J = {
    pattern: f,
    path: () => f,
    outlet: () => null,
    resolvePath(E) {
      return mt(f, E);
    }
  };
  return oe(Ue(s, (E) => y("native", E), { defer: !0 })), {
    base: J,
    location: T,
    params: K,
    isRouting: a,
    renderPath: l,
    parsePath: c,
    navigatorFactory: M,
    matches: k,
    beforeLeave: u,
    preloadRoute: C,
    singleFlight: r.singleFlight === void 0 ? !0 : r.singleFlight,
    submissions: O
  };
  function V(E, L, W) {
    ce(() => {
      if (typeof L == "number") {
        L && (o.go ? o.go(L) : console.warn("Router integration does not support relative routing"));
        return;
      }
      const G = !L || L[0] === "?", { replace: X, resolve: se, scroll: H, state: Y } = {
        replace: !1,
        resolve: !G,
        scroll: !0,
        ...W
      }, b = se ? E.resolvePath(L) : mt(G && T.pathname || "", L);
      if (b === void 0)
        throw new Error(`Path '${L}' is not a routable path`);
      if (S.length >= Mi)
        throw new Error("Too many redirects");
      const A = p();
      (b !== A || Y !== w()) && (Ur || u.confirm(b, W) && (S.push({ value: A, replace: X, scroll: H, state: w() }), y("navigate", {
        value: b,
        state: Y
      })));
    });
  }
  function M(E) {
    return E = E || We(Gr) || J, (L, W) => V(E, L, W);
  }
  function m(E) {
    const L = S[0];
    L && (i({
      ...E,
      replace: L.replace,
      scroll: L.scroll
    }), S.length = 0);
  }
  function C(E, L) {
    const W = Jt(t(), E.pathname), G = $e;
    $e = "preload";
    for (let X in W) {
      const { route: se, params: H } = W[X];
      se.component && se.component.preload && se.component.preload();
      const { preload: Y } = se;
      L && Y && Bn(n(), () => Y({
        params: H,
        location: {
          pathname: E.pathname,
          search: E.search,
          hash: E.hash,
          query: Wr(E),
          state: null,
          key: ""
        },
        intent: "preload"
      }));
    }
    $e = G;
  }
}
function Vi(e, t, n, r) {
  const { base: s, location: i, params: o } = e, { pattern: c, component: l, preload: u } = r().route, f = ee(() => r().path);
  l && l.preload && l.preload();
  const a = u ? u({ params: o, location: i, intent: $e || "initial" }) : void 0;
  return {
    parent: t,
    pattern: c,
    path: f,
    outlet: () => l ? P(l, {
      params: o,
      location: i,
      data: a,
      get children() {
        return n();
      }
    }) : n(),
    resolvePath(h) {
      return mt(s.path(), h, f());
    }
  };
}
const Ki = (e) => (t) => {
  const {
    base: n
  } = t, r = Nt(() => t.children), s = ee(() => Yr(r(), t.base || ""));
  let i;
  const o = Ui(e, s, () => i, {
    base: n,
    singleFlight: t.singleFlight,
    transformUrl: t.transformUrl
  });
  return e.create && e.create(o), P(Qr.Provider, {
    value: o,
    get children() {
      return P(Wi, {
        routerState: o,
        get root() {
          return t.root;
        },
        get preload() {
          return t.rootPreload || t.rootLoad;
        },
        get children() {
          return [Ot(() => (i = Mt()) && null), P(Hi, {
            routerState: o,
            get branches() {
              return s();
            }
          })];
        }
      });
    }
  });
};
function Wi(e) {
  const t = e.routerState.location, n = e.routerState.params, r = ee(() => e.preload && ce(() => {
    e.preload({
      params: n,
      location: t,
      intent: ji() || "initial"
    });
  }));
  return P(Oe, {
    get when() {
      return e.root;
    },
    keyed: !0,
    get fallback() {
      return e.children;
    },
    children: (s) => P(s, {
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
function Hi(e) {
  const t = [];
  let n;
  const r = ee(Ue(e.routerState.matches, (s, i, o) => {
    let c = i && s.length === i.length;
    const l = [];
    for (let u = 0, f = s.length; u < f; u++) {
      const a = i && i[u], d = s[u];
      o && a && d.route.key === a.route.key ? l[u] = o[u] : (c = !1, t[u] && t[u](), Me((h) => {
        t[u] = h, l[u] = Vi(e.routerState, l[u - 1] || e.routerState.base, nr(() => r()[u + 1]), () => e.routerState.matches()[u]);
      }));
    }
    return t.splice(s.length).forEach((u) => u()), o && c ? o : (n = l[0], l);
  }));
  return nr(() => r() && n)();
}
const nr = (e) => () => P(Oe, {
  get when() {
    return e();
  },
  keyed: !0,
  children: (t) => P(Gr.Provider, {
    value: t,
    get children() {
      return t.outlet();
    }
  })
}), dt = (e) => {
  const t = Nt(() => e.children);
  return Ln(e, {
    get children() {
      return t();
    }
  });
};
function zi([e, t], n, r) {
  return [e, r ? (s) => t(r(s)) : t];
}
function Qi(e) {
  let t = !1;
  const n = (s) => typeof s == "string" ? { value: s } : s, r = zi(I(n(e.get()), {
    equals: (s, i) => s.value === i.value && s.state === i.state
  }), void 0, (s) => (!t && e.set(s), R.registry && !R.done && (R.done = !0), s));
  return e.init && xe(e.init((s = e.get()) => {
    t = !0, r[1](n(s)), t = !1;
  })), Ki({
    signal: r,
    create: e.create,
    utils: e.utils
  });
}
function Gi(e, t, n) {
  return e.addEventListener(t, n), () => e.removeEventListener(t, n);
}
function Ji(e, t) {
  const n = e && document.getElementById(e);
  n ? n.scrollIntoView() : t && window.scrollTo(0, 0);
}
const Yi = /* @__PURE__ */ new Map();
function Xi(e = !0, t = !1, n = "/_server", r) {
  return (s) => {
    const i = s.base.path(), o = s.navigatorFactory(s.base);
    let c, l;
    function u(p) {
      return p.namespaceURI === "http://www.w3.org/2000/svg";
    }
    function f(p) {
      if (p.defaultPrevented || p.button !== 0 || p.metaKey || p.altKey || p.ctrlKey || p.shiftKey)
        return;
      const g = p.composedPath().find((k) => k instanceof Node && k.nodeName.toUpperCase() === "A");
      if (!g || t && !g.hasAttribute("link"))
        return;
      const w = u(g), x = w ? g.href.baseVal : g.href;
      if ((w ? g.target.baseVal : g.target) || !x && !g.hasAttribute("state"))
        return;
      const S = (g.getAttribute("rel") || "").split(/\s+/);
      if (g.hasAttribute("download") || S && S.includes("external"))
        return;
      const O = w ? new URL(x, document.baseURI) : new URL(x);
      if (!(O.origin !== window.location.origin || i && O.pathname && !O.pathname.toLowerCase().startsWith(i.toLowerCase())))
        return [g, O];
    }
    function a(p) {
      const g = f(p);
      if (!g)
        return;
      const [w, x] = g, T = s.parsePath(x.pathname + x.search + x.hash), S = w.getAttribute("state");
      p.preventDefault(), o(T, {
        resolve: !1,
        replace: w.hasAttribute("replace"),
        scroll: !w.hasAttribute("noscroll"),
        state: S ? JSON.parse(S) : void 0
      });
    }
    function d(p) {
      const g = f(p);
      if (!g)
        return;
      const [w, x] = g;
      r && (x.pathname = r(x.pathname)), s.preloadRoute(x, w.getAttribute("preload") !== "false");
    }
    function h(p) {
      clearTimeout(c);
      const g = f(p);
      if (!g)
        return l = null;
      const [w, x] = g;
      l !== w && (r && (x.pathname = r(x.pathname)), c = setTimeout(() => {
        s.preloadRoute(x, w.getAttribute("preload") !== "false"), l = w;
      }, 20));
    }
    function y(p) {
      if (p.defaultPrevented)
        return;
      let g = p.submitter && p.submitter.hasAttribute("formaction") ? p.submitter.getAttribute("formaction") : p.target.getAttribute("action");
      if (!g)
        return;
      if (!g.startsWith("https://action/")) {
        const x = new URL(g, Kr);
        if (g = s.parsePath(x.pathname + x.search), !g.startsWith(n))
          return;
      }
      if (p.target.method.toUpperCase() !== "POST")
        throw new Error("Only POST forms are supported for Actions");
      const w = Yi.get(g);
      if (w) {
        p.preventDefault();
        const x = new FormData(p.target, p.submitter);
        w.call({ r: s, f: p.target }, p.target.enctype === "multipart/form-data" ? x : new URLSearchParams(x));
      }
    }
    Le(["click", "submit"]), document.addEventListener("click", a), e && (document.addEventListener("mousemove", h, { passive: !0 }), document.addEventListener("focusin", d, { passive: !0 }), document.addEventListener("touchstart", d, { passive: !0 })), document.addEventListener("submit", y), xe(() => {
      document.removeEventListener("click", a), e && (document.removeEventListener("mousemove", h), document.removeEventListener("focusin", d), document.removeEventListener("touchstart", d)), document.removeEventListener("submit", y);
    });
  };
}
function Zi(e) {
  const t = () => {
    const r = window.location.pathname.replace(/^\/+/, "/") + window.location.search, s = window.history.state && window.history.state._depth && Object.keys(window.history.state).length === 1 ? void 0 : window.history.state;
    return {
      value: r + window.location.hash,
      state: s
    };
  }, n = Vr();
  return Qi({
    get: t,
    set({ value: r, replace: s, scroll: i, state: o }) {
      s ? window.history.replaceState(Ci(o), "", r) : window.history.pushState(o, "", r), Ji(decodeURIComponent(window.location.hash.slice(1)), i), Rn();
    },
    init: (r) => Gi(window, "popstate", Oi(r, (s) => {
      if (s && s < 0)
        return !n.confirm(s);
      {
        const i = t();
        return !n.confirm(i.value, { state: i.state });
      }
    })),
    create: Xi(e.preload, e.explicitLinks, e.actionBase, e.transformUrl),
    utils: {
      go: (r) => window.history.go(r),
      beforeLeave: n
    }
  })(e);
}
const eo = () => {
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
}, Xr = lt(), Ke = "http://localhost:5000/api", to = (e) => {
  Ae();
  const [t, n] = I(localStorage.getItem("token") || ""), [r, s] = I([]), [i, o] = I(eo()), [c] = Gs(t, async (a) => {
    const d = localStorage.getItem("user");
    if (d)
      return JSON.parse(d);
    const h = await fetch(`${Ke}/auth/me`, {
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
    const y = await h.json();
    return localStorage.setItem("user", JSON.stringify(y)), y;
  }), l = async () => {
    try {
      const a = await fetch(`${Ke}/file/list?directory=./&recursive=true`, {
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
  let [u, f] = I();
  return P(Xr.Provider, {
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
      dark: i,
      toggleDark() {
        let a = !i();
        document.body.classList.toggle("dark", a), o(a), localStorage.setItem("dark", String(a));
      },
      files: r,
      refreshFiles: l
    },
    get children() {
      return e.children;
    }
  });
}, Fe = () => We(Xr), D = [], no = (e) => {
  D.push(e);
}, rr = (e) => {
  const t = D.findIndex((r) => r.uniqueId === e);
  if (t === -1)
    return;
  const n = D[t];
  return D.splice(t, 1), n;
}, Zr = [
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
let Yt = !1;
const he = ({ from: e, stopAtRootElement: t, ignoreElement: n = [], allowSelectors: r, direction: s = "forwards", wrap: i }) => {
  let o, c = !1;
  if (e instanceof Element)
    c = nt(e), o = e;
  else {
    if (e === "activeElement") {
      const p = document.activeElement;
      c = nt(p), o = sr(p);
    }
    typeof e == "object" && (e.getActiveElement && (o = sr(e.el)), c = e.isIframe);
  }
  const l = o, u = l.parentElement, f = c, a = l, d = Zr + (r ? "," + r.join(",") : "");
  if (!a)
    return null;
  const h = (p, g) => {
    let w = !1;
    const x = p.children, T = x.length;
    if (Yt && (w = !0), s === "forwards")
      for (let S = 0; S < T; S++) {
        const O = x[S];
        if (w) {
          const k = Bt(O, d, s, n);
          if (k)
            return k;
          continue;
        }
        if (O === t)
          return null;
        if (O === g) {
          w = !0;
          continue;
        }
      }
    else
      for (let S = T - 1; S >= 0; S--) {
        const O = x[S];
        if (w) {
          const k = Bt(O, d, s, n);
          if (k)
            return k;
          continue;
        }
        if (O === t)
          return null;
        if (O === g) {
          w = !0;
          continue;
        }
      }
    if (g = p, p = p.parentElement, !p && f) {
      const S = document.activeElement;
      S && nt(S) && (g = S, p = S.parentElement);
    }
    return p ? h(p, g) : null;
  };
  let y = h(u, a);
  return !y && i && t && (Yt = !0, y = he({
    from: t,
    allowSelectors: r,
    direction: s,
    ignoreElement: n,
    // stopAtElement,
    wrap: !1
  })), Yt = !1, y;
}, es = (e) => {
  try {
    return e.contentWindow;
  } catch {
    return null;
  }
}, ro = (e) => {
  const t = es(e);
  return t ? t.document : null;
}, sr = (e) => {
  if (!nt(e))
    return e;
  const t = ro(e);
  return t && t.activeElement || e;
}, ir = (e, t = window) => {
  const n = (s) => s.display === "none" || s.visibility === "hidden";
  if (e.style && n(e.style) || e.hidden)
    return !0;
  const r = t.getComputedStyle(e);
  return !!(!r || n(r));
}, Bt = (e, t = Zr, n = "forwards", r = [], s = window, i = !0) => {
  const o = (a) => {
    if (!a.matches(t))
      return {
        el: a,
        matched: !1
      };
    const d = a.getAttribute("tabindex");
    if (nt(a) && (!d || d === "-1")) {
      const h = es(a);
      return h ? (a = h.document.documentElement, s = h, { el: a, matched: !1, windowContext: h }) : { el: a, matched: !0 };
    }
    return {
      el: a,
      matched: !0
    };
  };
  if (i) {
    if (r.some((y) => y === e) || ir(e, s))
      return null;
    const { el: a, matched: d, windowContext: h } = o(e);
    return e = a, d ? e : (s = h || s, Bt(e, t, n, r, s, !1));
  }
  const c = e.shadowRoot;
  c && (e = c);
  const l = e.children, u = l.length, f = (a) => {
    if (r.some((g) => g === a) || ir(a, s))
      return {
        continue: !0
      };
    const { el: d, matched: h, windowContext: y } = o(a);
    if (a = d, s = y || s, h)
      return { returnVal: a };
    const p = Bt(a, t, n, r, s, !1);
    return p ? { returnVal: p } : null;
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
}, nt = (e) => e.tagName === "IFRAME", Mn = (e) => e.offsetHeight === 0 && e.offsetWidth === 0, ts = (e) => Object.getPrototypeOf(e) === Object.prototype, ie = (e, { inputElement: t, type: n, subType: r }) => {
  if (t === "menuPopup")
    return e.menuPopupEl;
  if (t === "menuButton")
    return ge(e.menuBtnEls);
  if (n === "focusElementOnOpen") {
    if (ts(t))
      return ie(e, {
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
      return ie(e, {
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
        return ie(e, { inputElement: t.tabForwards });
      case "tabBackwards":
        return ie(e, { inputElement: t.tabBackwards });
      case "click":
        return ie(e, { inputElement: t.click });
      case "escapeKey":
        return ie(e, { inputElement: t.escapeKey });
      case "scrolling":
        return ie(e, { inputElement: t.scrolling });
    }
  }
  if (t == null)
    return null;
  if (Array.isArray(t))
    return t.map((s) => ie(e, { inputElement: s, type: n }));
  for (const s in t) {
    const i = t[s];
    return ie(e, { inputElement: i });
  }
  return null;
}, Pt = (e) => {
  const t = (n) => {
    const r = (i) => i.visibility === "hidden";
    if (n.style && r(n.style) || n.hidden)
      return !0;
    const s = window.getComputedStyle(n);
    return !!(!s || r(s));
  };
  return Mn(e) || t(e);
}, ve = (e, t, n) => {
  for (let r = e.length - 1; r >= 0; r--) {
    const { item: s, continue: i } = t(e[r]);
    if (s && n(s), !i)
      return;
  }
}, so = (e, t) => {
  const { timeouts: n, closeWhenMenuButtonIsClicked: r, focusedMenuBtn: s, onClickOutsideMenuButtonRef: i, setOpen: o, open: c, deadMenuButton: l, closeWhenClickingOutside: u } = e;
  e.menuBtnMouseDownFired = !1;
  const f = t.currentTarget;
  if (B.focusedMenuBtns.forEach((a) => a.el = null), !l) {
    if (e.menuBtnKeyupTabFired = !1, s.el = f, B.focusedMenuBtns.add(s), !u) {
      const a = D[D.length - 1];
      a && !a.menuBtnEls.includes(f) && !a.containerEl.contains(f) && ve(D, (d) => ({ item: d, continue: !0 }), (d) => {
        const { setOpen: h } = d;
        h(!1);
      });
    }
    if (!r) {
      o(!0);
      return;
    }
    c() && (B.closedByEvents = !0), o(!c());
  }
}, io = (e, t) => {
  const { containerEl: n, focusedMenuBtn: r, overlay: s, setOpen: i, timeouts: o, menuBtnMouseDownFired: c, closeWhenDocumentBlurs: l, closeWhenClickingOutside: u, open: f } = e, a = t.currentTarget;
  if (queueMicrotask(() => {
    is();
  }), e.menuBtnKeyupTabFired) {
    e.menuBtnKeyupTabFired = !1;
    return;
  }
  if (c || n && n.contains(t.relatedTarget))
    return;
  if (!u && f()) {
    document.addEventListener("keydown", jt);
    return;
  }
  const d = B.clickTarget, h = () => {
    const y = document.activeElement;
    if (!t.relatedTarget && y && y.tagName, !(n && n.contains(y)) && !(!l && !document.hasFocus()) && !B.closedBySetOpen && a.isConnected) {
      if (Pt(a)) {
        let p = !1;
        if (e.menuBtnEls?.some((g) => g === a || Pt(g) ? !1 : d && !g.contains(d) ? (p = !0, !1) : (g.focus(), !0)), !p)
          return;
      }
      e.open() && (B.closedByEvents = !0, r.el = null, i(!1));
    }
  };
  o.menuButtonBlurTimeoutId = window.setTimeout(h);
}, oo = (e, t) => {
  const { focusMenuButtonOnMouseDown: n } = e, r = t.currentTarget;
  e.menuBtnMouseDownFired = !0, r.addEventListener("click", e.onClickMenuButtonRef), n && (r.addEventListener("blur", e.onBlurMenuButtonRef), requestAnimationFrame(() => {
    r.focus();
  }));
}, co = (e) => {
  e.focusedMenuBtn.el = null;
}, lo = (e, t) => {
  const { containerEl: n, setOpen: r, open: s, onKeydownMenuButtonRef: i, onBlurMenuButtonRef: o, mount: c, focusSentinelBeforeEl: l, focusSentinelAfterEl: u, ignoreMenuPopupWhenTabbing: f } = e, a = t.currentTarget;
  if (t.key !== "Tab" || (B.focusedMenuBtns.forEach((h) => h.el = null), !s()))
    return;
  if (e.menuBtnKeyupTabFired = !0, t.key === "Tab" && t.shiftKey) {
    if (B.closedByEvents = !0, !c || a.nextElementSibling !== n) {
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
    r(!1), a.removeEventListener("keydown", i), a.removeEventListener("blur", o);
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
    h && h.focus(), r(!1), a.removeEventListener("keydown", i), a.removeEventListener("blur", o);
    return;
  }
  let d = he({
    from: l,
    stopAtRootElement: n
  });
  d ? d.focus() : n.focus(), d || (r(!1), d = he({
    from: l
  }), d && d.focus()), a.removeEventListener("keydown", i), a.removeEventListener("blur", o);
}, ao = (e, t) => {
  const { closeWhenMenuButtonIsTabbed: n, timeouts: r, deadMenuButton: s, menuBtnEls: i, focusedMenuBtn: o } = e, c = ge(i);
  if (c.addEventListener("click", e.onClickMenuButtonRef), c.addEventListener("blur", e.onBlurMenuButtonRef), c.addEventListener("keydown", e.onKeydownMenuButtonRef), o.el = t.currentTarget, window.setTimeout(() => {
  }), s) {
    c.addEventListener("blur", e.onBlurMenuButtonRef), c.addEventListener("keydown", e.onKeydownMenuButtonRef);
    return;
  }
  n || clearTimeout(r.containerFocusTimeoutId);
}, ge = (e) => {
  if (e)
    return e.length <= 1 ? e[0] : e.find((t) => {
      if (!(!t || Mn(t)))
        return t;
    });
}, uo = ({ state: e, menuButton: t, open: n }) => {
  if (Array.isArray(t) && !t.length)
    return;
  const { focusedMenuBtn: r, containerEl: s } = e, i = ie(e, {
    inputElement: t,
    type: "menuButton"
  });
  if (!i)
    return;
  e.menuBtnEls = Array.isArray(i) ? i : [i];
  const o = D.find((c) => c.uniqueId === e.uniqueId);
  o && (o.menuBtnEls = e.menuBtnEls), e.menuBtnEls.forEach((c, l, u) => {
    if (fo(e, c), c.addEventListener("mousedown", e.onMouseDownMenuButtonRef), c.addEventListener("focus", e.onFocusMenuButtonRef), r.el && r.el !== c && (!(u.length > 1) || !Mn(c))) {
      if (r.el = c, s && s.contains(document.activeElement))
        return;
      c.focus({ preventScroll: !0 });
    }
  });
}, fo = (e, t) => {
  const { modal: n, uniqueId: r, deadMenuButton: s } = e;
  if (!s) {
    if (t.hasAttribute("type"))
      return;
    t.setAttribute("type", "button"), t.setAttribute("aria-expanded", "false");
  }
  n && (t.setAttribute("aria-controls", r), t.setAttribute("aria-haspopup", "dialog"));
}, ho = (e) => {
  const { menuBtnEls: t, deadMenuButton: n } = e;
  n && t && t.forEach((r) => {
    r.setAttribute("aria-expanded", "true");
  });
}, po = (e) => {
  const { menuBtnEls: t, deadMenuButton: n } = e;
  n && t && t.forEach((r) => {
    r.setAttribute("aria-expanded", "false");
  });
}, mo = (e, t) => {
  !e || !e.menuBtnEls || (e.menuBtnMouseDownFired = !1, e.menuBtnEls.forEach((n) => {
    t && (n.removeEventListener("blur", e.onBlurMenuButtonRef), n.removeEventListener("keydown", e.onKeydownMenuButtonRef), n.removeEventListener("click", e.onClickMenuButtonRef), n.removeEventListener("focus", e.onFocusMenuButtonRef), n.removeEventListener("mousedown", e.onMouseDownMenuButtonRef));
  }));
}, go = (e) => {
  if (B.thirdPartyPopupEl)
    return B.thirdPartyPopupEl = null, null;
  if (!document.hasFocus())
    return null;
  const t = B.clickTarget, r = e.map((s) => document.querySelector(s)).find((s) => s && s.contains(t)) || null;
  return B.thirdPartyPopupEl = r, r;
}, yo = (e) => {
  for (let t of e) {
    const n = document.querySelector(t);
    if (n && !Pt(n))
      return n;
  }
  return null;
}, bo = () => {
  document.addEventListener("click", ns), document.addEventListener("keydown", rs, { capture: !0 });
}, qt = () => {
  document.removeEventListener("click", ns), document.removeEventListener("keydown", rs, { capture: !0 }), B.thirdPartyPopupEl = null, B.thirdPartyPopupElPressedEscape = !1;
}, ns = (e) => {
  const t = e.target, { thirdPartyPopupEl: n } = B;
  n && n.contains(t) || ve(D, (r) => {
    const { containerEl: s } = r;
    return s.contains(t) ? { continue: !1 } : { item: r, continue: !0 };
  }, (r) => {
    const { setOpen: s } = r;
    B.closedByEvents = !0, s(!1), qt();
  });
}, rs = (e) => {
  e.key === "Escape" && (B.thirdPartyPopupElPressedEscape = !0);
};
let Xt = !1, hn = !1, je = null, ss = 0, pn = null, gt = null;
const B = {
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
let or = null;
const is = () => {
  clearTimeout(or), or = window.setTimeout(() => {
    B.clickTarget = null;
  });
}, Nn = () => {
  document.removeEventListener("pointerup", Nn);
}, os = (e) => {
  const t = e.target;
  B.clickTarget = t, document.addEventListener("pointerup", Nn);
}, cs = (e) => {
  const t = D[D.length - 1];
  setTimeout(() => {
    const r = e.timeStamp - ss;
    if (!document.hasFocus() && r < 50) {
      ve(D, (s) => ({ item: s, continue: !0 }), (s) => {
        const { setOpen: i } = s;
        B.closedByEvents = !0, i(!1);
      });
      return;
    }
  });
  const n = (r) => {
    if (r.overlay || r.overlayEl || !r.closeWhenDocumentBlurs)
      return;
    ge(r.menuBtnEls).focus(), B.closedByEvents = !0, r.setOpen(!1);
  };
  t.overlay || setTimeout(() => {
    const r = document.activeElement;
    if (!r || r.tagName !== "IFRAME") {
      ve(D, (s) => ({ item: s, continue: !0 }), (s) => n(s));
      return;
    }
    ve(D, (s) => {
      const { containerEl: i } = s;
      return i.contains(r) ? (gt = r, fs(), document.addEventListener("visibilitychange", us), { continue: !1 }) : { item: s, continue: !0 };
    }, (s) => {
      const { setOpen: i } = s;
      B.closedByEvents = !0, i(!1);
    });
  });
}, jt = (e) => {
  e.key === "Tab" && setTimeout(() => {
    const t = document.activeElement, n = D[0];
    document.removeEventListener("keydown", jt), n && !n.menuBtnEls.some((r) => r && r.contains(t)) && ve(D, (r) => ({ item: r, continue: !0 }), (r) => {
      const { setOpen: s } = r;
      s(!1);
    });
  });
}, ls = (e) => {
  const { setOpen: t, menuBtnEls: n, cursorKeys: r, closeWhenEscapeKeyIsPressed: s, focusElementOnClose: i, ignoreMenuPopupWhenTabbing: o, focusSentinelAfterEl: c, focusSentinelBeforeEl: l, mountedPopupsSafeList: u } = D[D.length - 1];
  if (e.key === "Tab") {
    if (o) {
      e.preventDefault();
      const a = e.shiftKey, d = ge(n), h = he({
        from: a ? l : c,
        direction: a ? "backwards" : "forwards",
        ignoreElement: d ? [d] : []
      });
      h && h.focus();
      return;
    }
    ss = e.timeStamp;
  }
  if (r && wo(e), e.key !== "Escape" || !s)
    return;
  if (B.thirdPartyPopupElPressedEscape) {
    B.thirdPartyPopupElPressedEscape = !1, qt();
    return;
  }
  if (u && u.length) {
    const a = yo(u);
    if (a) {
      window.setTimeout(() => {
        !a.isConnected || Pt(a) || f();
      }, 100);
      return;
    }
  }
  function f() {
    const a = ge(n), d = ie({}, {
      inputElement: i,
      type: "focusElementOnClose",
      subType: "escapeKey"
    }) || a;
    d && d.focus(), B.closedByEvents = !0, t(!1);
  }
  f();
}, Fn = (e) => {
  const t = e.target;
  pn !== t && ve(D, (n) => {
    const { menuPopupEl: r } = n;
    return r.contains(t) ? (pn = t, { continue: !1 }) : { item: n, continue: !0 };
  }, (n) => {
    const { setOpen: r, focusElementOnClose: s, menuBtnEls: i } = n, o = ge(i);
    B.closedByEvents = !0, r(!1);
    const c = ie({}, {
      inputElement: s,
      type: "focusElementOnClose",
      subType: "scrolling"
    }) || o;
    c && c.focus();
  });
}, vo = (e) => {
  pn = null, !hn && e && (hn = !1, window.addEventListener("wheel", Fn, {
    capture: !0,
    passive: !0
  }), document.body.addEventListener("touchmove", as)), !D.length && (document.addEventListener("pointerdown", os), document.addEventListener("pointerup", Nn), document.addEventListener("keydown", ls), window.addEventListener("blur", cs));
}, cr = () => {
  D.length || (hn = !1, B.cursorKeysPrevEl = null, B.clickTarget = null, window.clearTimeout(B.documentClickTimeout), B.documentClickTimeout = null, document.removeEventListener("keydown", ls), document.removeEventListener("pointerdown", os), document.removeEventListener("keydown", jt), window.removeEventListener("blur", cs), window.removeEventListener("wheel", Fn, {
    capture: !0
  }), document.body.removeEventListener("touchmove", as));
}, as = () => {
  Xt || (Xt = !0, document.body.addEventListener("touchend", () => {
    Xt = !1;
  }, { once: !0 }), window.addEventListener("scroll", Fn, {
    capture: !0,
    passive: !0,
    once: !0
  }));
}, wo = (e) => {
  const t = ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"], n = ["ArrowLeft", "ArrowRight"];
  if (!t.includes(e.key) || (e.preventDefault(), n.includes(e.key)))
    return;
  const { menuBtnEls: r, menuPopupEl: s, containerEl: i, focusSentinelBeforeEl: o, focusSentinelAfterEl: c, cursorKeys: l } = D[D.length - 1], u = ge(r);
  let f = B.cursorKeysPrevEl || document.activeElement, a;
  e.key === "ArrowDown" ? a = "forwards" : a = "backwards", (f === u || f === s || f === i) && (e.key === "ArrowUp" ? (a = "backwards", f = c) : (a = "forwards", f = o));
  const d = typeof l == "object", h = d && l.wrap;
  let y = he({
    from: f,
    direction: a,
    stopAtRootElement: s
  });
  if (!y && h) {
    const p = e.key === "ArrowDown" ? o : c;
    a = e.key === "ArrowDown" ? "forwards" : "backwards", y = he({
      from: p,
      direction: a,
      stopAtRootElement: i
    });
  }
  if (d && l.onKeyDown) {
    l.onKeyDown({
      currentEl: y,
      prevEl: B.cursorKeysPrevEl
    }), B.cursorKeysPrevEl = y;
    return;
  }
  y && y.focus();
}, us = () => {
  if (document.visibilityState === "visible" && je != null) {
    fs();
    return;
  }
  clearTimeout(je);
}, fs = () => {
  const t = () => {
    const n = document.activeElement;
    if (n) {
      if (gt === n) {
        je = window.setTimeout(t, 250);
        return;
      }
      ve(D, (r) => {
        const { containerEl: s } = r;
        return n.tagName === "IFRAME" ? s && !s.contains(n) ? { item: r, continue: !0 } : (gt = n, je = window.setTimeout(t, 250), { continue: !1 }) : s && !s.contains(n) ? { item: r, continue: !0 } : { continue: !1 };
      }, (r) => {
        const { setOpen: s } = r;
        B.closedByEvents = !0, s(!1), gt = null, je = null, document.removeEventListener("visibilitychange", us);
      });
    }
  };
  je = window.setTimeout(t, 250);
}, Eo = (e) => {
  const { menuPopup: t } = e;
  e.menuPopupAdded || (e.menuPopupEl = ie(e, {
    inputElement: t,
    type: "menuPopup"
  }), e.menuPopupEl && (e.menuPopupAdded = !0, e.menuPopupEl.setAttribute("tabindex", "-1")));
}, lr = (e) => {
  e.menuPopupEl && e.menuPopupAdded && (e.menuPopupEl = null, e.menuPopupAdded = !1);
}, xo = (e) => e.replace(/-./g, (t) => t.toUpperCase()[1]), mn = (e, t) => {
  const { onToggleScrollbar: n, removeScrollbar: r } = e;
  if (n) {
    if (t) {
      if (D.length > 1)
        return;
      n.onRemove();
    } else {
      if (D.length)
        return;
      n.onRestore();
    }
    return;
  }
  if (!r || D.length > 1)
    return;
  const s = document.scrollingElement;
  t ? s.style.overflow = "hidden" : s.style.overflow = "";
};
function _o(e) {
  requestAnimationFrame(() => {
    requestAnimationFrame(e);
  });
}
const ko = (e) => {
  let t, n = !0, r = !1, s, i = !1, o = !!e.overlay;
  const [c, l] = I(), [u, f] = I(), a = Nt(() => e.children), { onBeforeEnter: d, onEnter: h, onAfterEnter: y, onBeforeExit: p, onExit: g, onAfterExit: w, appendToElement: x, appear: T, state: S } = e, { onBeforeEnter: O, onEnter: k, onAfterEnter: Q, onBeforeExit: K, onExit: J, onAfterExit: V, appendToElement: M } = e.overlay || {}, m = (v) => v === "content" ? d : O, C = (v) => v === "content" ? h : k, E = (v) => v === "content" ? y : Q, L = (v) => v === "content" ? p : K, W = (v) => v === "content" ? g : J, G = (v) => v === "content" ? w : V;
  function X(v, j) {
    const de = (v === "content" ? e.name : e.overlay?.name) || "s", le = xo(j) + "Class", ye = (v === "content" ? e : e.overlay)[le];
    return ye ? ye.split(" ") : [`${de}-${j}`];
  }
  const se = (v, j) => {
    const Z = v === "content" ? x : M;
    return Z ? Z === "menuPopup" && v !== "overlay" ? ie({ containerEl: j }, { inputElement: null, type: "menuPopup" }) : typeof Z == "string" ? j && j.querySelector(Z) : Z : j;
  };
  let H, Y;
  function b(v, j, Z) {
    if (i && (v === "content" ? H() : Y()), !n || e.appear) {
      let fe = function(Ge) {
        N && (!Ge || Ge.target === N) && (N.removeEventListener("transitionend", fe), N.removeEventListener("animationend", fe), N.classList.remove(...Re), N.classList.remove(...Ie), $r(() => {
          const Ht = r ? s : j;
          c() !== Ht && l(Ht), u() === Ht && f(void 0);
        }), ye && ye(N), e.mode === "inout" && A(v, N, Z));
      };
      var de = fe;
      const le = C(v), ne = m(v), ye = E(v), Ce = X(v, "enter"), Re = X(v, "enter-active"), Ie = X(v, "enter-to"), N = se(v, j);
      ne && ne(N), N.classList.add(...Ce), N.classList.add(...Re), requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          N.classList.remove(...Ce), N.classList.add(...Ie);
        }), le && le(N, () => fe()), requestAnimationFrame(() => {
          (!le || le.length < 2) && (N.addEventListener("transitionend", fe), N.addEventListener("animationend", fe));
        });
      });
    }
    if (v === "content") {
      const le = r ? s : j;
      Z && !e.mode ? f(le) : l(le);
    }
  }
  function A(v, j, Z) {
    i = !0;
    const de = W(v), le = L(v), ne = G(v), ye = X(v, "exit"), Ce = X(v, "exit-active"), Re = X(v, "exit-to"), Ie = se(v, j), N = se(v, Z);
    if (!N.parentNode)
      return fe();
    le && le(N), N.classList.add(...ye), N.classList.add(...Ce), _o(() => {
      N.classList.remove(...ye), N.classList.add(...Re);
    }), de && de(N, () => fe()), (!de || de.length < 2) && (N.addEventListener("transitionend", fe), N.addEventListener("animationend", fe));
    function fe(Ge) {
      (!Ge || Ge.target === N) && (i = !1, N.removeEventListener("transitionend", fe), N.removeEventListener("animationend", fe), v === "content" && (N.classList.remove(...Ce), N.classList.remove(...Re)), v === "content" && (r && (Z.parentElement.remove(), mn(S, !1)), c() === Z && l(void 0)), ne && ne(N), e.mode === "outin" && b(v, Ie, N));
    }
    v === "content" ? H = fe : Y = fe;
  }
  return St((v) => {
    for (t = a(); typeof t == "function"; )
      t = t();
    if (t && t.nodeType === 3) {
      r = !0, s = t, s.willRemove = !1;
      const j = t.portalContainerChild;
      if (o) {
        const Z = t.portalOverlay;
        Object.defineProperty(j, "portalOverlay", {
          get() {
            return Z;
          },
          configurable: !0
        });
      }
      t = j;
    }
    return ce(() => (t && t !== v && (e.mode !== "outin" ? (b("content", t, v), o && b(
      "overlay",
      // @ts-ignore
      t.portalOverlay,
      // @ts-ignore
      v && v.portalOverlay
    )) : n && l(r ? s : t)), v && v !== t && e.mode !== "inout" && (A("content", t, v), o && A("overlay", t && t.portalOverlay, v.portalOverlay)), n = !1, t));
  }), [c, u];
}, ar = (e, { isCleanup: t = !1 } = {}) => {
  mo(e, t);
}, So = (e, t) => {
  const { overlayElement: n, trapFocus: r, timeouts: s, closeWhenDocumentBlurs: i, mountedPopupsSafeList: o } = e;
  if (gn = !1, queueMicrotask(() => {
    is();
  }), B.thirdPartyPopupEl && qt(), B.closedBySetOpen || B.overlayMouseDown || n && r || !i && !document.hasFocus())
    return;
  const c = D.length;
  Oo(s, () => {
    if (o && go(o)) {
      bo();
      return;
    }
    c < D.length || (B.closedByEvents = !0, ve(D, (l) => {
      const { containerEl: u, closeWhenClickingOutside: f } = l, a = B.clickTarget;
      return !f && a ? (document.addEventListener("keydown", jt), { continue: !1 }) : a && u.contains(a) ? { continue: !1 } : u.contains(document.activeElement) ? { continue: !1 } : { item: l, continue: !0 };
    }, (l) => {
      const { setOpen: u } = l;
      u(!1);
    }));
  });
}, Ao = (e, t) => {
  const { timeouts: n } = e;
  clearTimeout(n.containerFocusTimeoutId), clearTimeout(n.menuButtonBlurTimeoutId);
}, Co = (e) => {
  const { focusElementOnOpen: t, focusedMenuBtn: n } = e;
  if (t == null)
    return;
  const r = ie(e, {
    inputElement: t,
    type: "focusElementOnOpen"
  });
  r && setTimeout(() => {
    const s = ts(t) ? (
      // @ts-ignore
      !!t.preventScroll
    ) : r === e.menuPopupEl;
    r.focus({ preventScroll: s }), n.el = null;
  });
};
let gn = !1;
const Oo = (e, t) => {
  e.containerFocusTimeoutId = window.setTimeout(() => {
    gn || (gn = !0, t());
  });
}, To = () => {
  B.overlayMouseDown = !0;
}, Bo = () => {
  B.overlayMouseDown = !1;
}, Po = (e) => {
  const { closeWhenOverlayClicked: t, menuPopupEl: n, focusElementOnClose: r, menuBtnEls: s } = e;
  if (B.overlayMouseDown = !1, !t) {
    n.focus({ preventScroll: !0 });
    return;
  }
  const i = ge(s), o = ie(e, {
    inputElement: r,
    type: "focusElementOnClose",
    subType: "click"
  }) || i;
  o && o.focus(), ve(D, (c) => c.overlayElement ? { continue: !1 } : { item: c, continue: !0 }, (c) => {
    const { setOpen: l } = c;
    B.closedByEvents = !0, l(!1);
  }), B.closedByEvents = !0, e.setOpen(!1);
}, Lo = ({ parent: e, matchEl: t }) => {
  if (e === t)
    return !0;
  const n = (r) => {
    if (!r)
      return !1;
    const s = r.children[0];
    return s === t ? !0 : n(s);
  };
  return n(e);
}, Ro = (e) => {
  const { enableLastFocusSentinel: t, menuBtnEls: n, containerEl: r, focusSentinelAfterEl: s } = e;
  if (t) {
    s.setAttribute("tabindex", "0");
    return;
  }
  if (!n)
    return;
  const o = ge(n).nextElementSibling;
  Lo({
    parent: o,
    matchEl: r
  }) || s.setAttribute("tabindex", "0");
}, ur = (e, t, n) => {
  const { uniqueId: r, containerEl: s, menuBtnEls: i, focusSentinelBeforeEl: o, trapFocus: c, focusSentinelAfterEl: l, closeWhenMenuButtonIsTabbed: u, focusElementOnClose: f, mount: a, open: d, setOpen: h } = e, y = ge(i);
  D.forEach((w) => window.clearTimeout(w.timeouts.containerFocusTimeoutId));
  const p = (w, x) => {
    ve(D, (T) => x && ge(T.menuBtnEls) === w && !T.closeWhenMenuButtonIsTabbed ? { continue: !1 } : T.uniqueId === r || !T.containerEl.contains(w) ? { item: T, continue: !0 } : { continue: !1 }, (T) => {
      B.closedByEvents = !0, T.setOpen(!1);
    }), w && w.focus();
  };
  if (!d())
    return;
  if (y && (n === s || n === y)) {
    he({
      from: o,
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
      B.closedByEvents = !0, h(!1), y.focus();
      return;
    }
    const w = ie(e, {
      inputElement: f,
      type: "focusElementOnClose",
      subType: "tabBackwards"
    }) || y;
    if (!e.menuBtnEls) {
      w.focus();
      return;
    }
    p(w, !0);
    return;
  }
  if (c) {
    he({
      from: o,
      stopAtRootElement: s
    }).focus();
    return;
  }
  const g = ie(e, {
    inputElement: f,
    type: "focusElementOnClose",
    subType: "tabForwards"
  }) || he({
    from: y,
    ignoreElement: [s]
  });
  if (a) {
    p(g);
    return;
  }
  g && g.focus(), B.closedByEvents = !0, h(!1);
}, Io = "http://www.w3.org/2000/svg";
function $o(e, t = !1) {
  return t ? document.createElementNS(Io, e) : document.createElement(e);
}
function Mo(e) {
  const {
    useShadow: t,
    isModal: n
  } = e, r = document.createTextNode(""), s = e.mount || document.body;
  function i() {
    if (R.context) {
      const [o, c] = I(!1);
      return queueMicrotask(() => c(!0)), () => o() && e.children;
    } else return () => e.children;
  }
  if (s instanceof HTMLHeadElement) {
    const [o, c] = I(!1), l = () => c(!0);
    Me((u) => U(s, () => o() ? u() : i()(), null)), xe(() => {
      R.context ? queueMicrotask(l) : l();
    });
  } else {
    const o = $o(e.isSVG ? "g" : "div", e.isSVG), c = t && o.attachShadow ? o.attachShadow({
      mode: "open"
    }) : o, l = {
      get() {
        return r.parentNode;
      },
      configurable: !0
    };
    Object.defineProperty(o, "host", l), Object.defineProperty(o, "_$host", l), Object.defineProperty(r, "portalContainerChild", {
      get() {
        return u ? o.children[1] : o.firstElementChild;
      },
      configurable: !0
    }), Object.defineProperty(r, "portalContainer", {
      get() {
        return o;
      },
      configurable: !0
    }), Object.defineProperty(r, "portalMount", {
      get() {
        return s;
      },
      configurable: !0
    }), r.willRemove = !0, U(c, i());
    const u = e.overlayChildren;
    u && (Object.defineProperty(r, "portalOverlay", {
      get() {
        return u;
      },
      configurable: !0
    }), o.insertAdjacentElement("afterbegin", u)), s.appendChild(o), e.ref && e.ref(o), xe(() => {
      r.willRemove && s.removeChild(o);
    });
  }
  return r;
}
var No = /* @__PURE__ */ q("<div role=presentation>"), Fo = /* @__PURE__ */ q("<div><div style=position:fixed;top:0;left:0;outline:none;pointer-events:none;width:0;height:0; aria-hidden=true></div><div style=position:fixed;top:0;left:0;outline:none;pointer-events:none;width:0;height:0; aria-hidden=true>");
const fr = (e) => {
  const t = e.modal || !1, {
    id: n,
    menuButton: r,
    menuPopup: s,
    focusElementOnClose: i,
    focusElementOnOpen: o = t ? "menuPopup" : void 0,
    focusMenuButtonOnMouseDown: c = !0,
    cursorKeys: l = !1,
    closeWhenMenuButtonIsTabbed: u = !1,
    closeWhenMenuButtonIsClicked: f = !0,
    closeWhenScrolling: a = !1,
    closeWhenDocumentBlurs: d = !1,
    closeWhenOverlayClicked: h = !0,
    closeWhenEscapeKeyIsPressed: y = !0,
    closeWhenClickingOutside: p = !0,
    overlay: g = t,
    overlayElement: w = t,
    trapFocus: x = t,
    removeScrollbar: T = t,
    enableLastFocusSentinel: S = !1,
    mount: O = t ? "body" : void 0,
    // stopComponentEventPropagation = false,
    show: k = !1,
    onToggleScrollbar: Q,
    onOpen: K,
    deadMenuButton: J,
    ignoreMenuPopupWhenTabbing: V,
    mountedPopupsSafeList: M
  } = e, m = {
    mount: O,
    modal: t,
    addedFocusOutAppEvents: !1,
    closeWhenOverlayClicked: h,
    closeWhenDocumentBlurs: d,
    closeWhenEscapeKeyIsPressed: y,
    closeWhenMenuButtonIsClicked: f,
    closeWhenMenuButtonIsTabbed: u,
    closeWhenScrolling: a,
    closeWhenClickingOutside: p,
    cursorKeys: l,
    focusElementOnClose: i,
    focusMenuButtonOnMouseDown: c,
    deadMenuButton: J,
    focusElementOnOpen: o,
    ignoreMenuPopupWhenTabbing: V,
    // @ts-ignore
    id: n,
    uniqueId: ci(),
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
    overlayElement: w,
    onToggleScrollbar: Q,
    removeScrollbar: T,
    trapFocus: x,
    hasFocusSentinels: !!i || g || !!w || x || S,
    mountedPopupsSafeList: M,
    open: e.open,
    setOpen: e.setOpen,
    onClickOutsideMenuButtonRef: () => co(m),
    onClickOverlayRef: () => Po(m),
    onFocusInContainerRef: (b) => Ao(m),
    onFocusOutContainerRef: (b) => So(m),
    onBlurMenuButtonRef: (b) => io(m, b),
    onClickMenuButtonRef: (b) => so(m, b),
    onMouseDownMenuButtonRef: (b) => oo(m, b),
    onFocusMenuButtonRef: (b) => ao(m, b),
    onKeydownMenuButtonRef: (b) => lo(m, b),
    refContainerCb: (b) => {
      if (w && (b.style.zIndex = "1000", t)) {
        b.style.pointerEvents = "none", b.style.position = "relative";
        const A = (v) => {
          v.id || (v.id = m.uniqueId), v.style.pointerEvents = "all", v.setAttribute("role", "dialog");
        };
        requestAnimationFrame(() => {
          const v = b.querySelector('[role="dialog"]');
          if (!v) {
            const j = b.children;
            if (!j) return;
            const Z = j[1];
            A(Z);
            return;
          }
          A(v);
        });
      }
      e.ref && e.ref(b), m.containerEl = b;
    },
    refOverlayCb: (b) => {
      b.style.position = "fixed", b.style.top = "0", b.style.left = "0", b.style.width = "100%", b.style.height = "calc(100% + 100px)", b.style.zIndex = "1000", typeof w == "object" && w.ref && w.ref(b), m.overlayEl = b;
    }
  }, C = !e.open(), E = () => {
    const b = document.activeElement;
    if (b !== document.body && m.menuBtnEls.every((le) => b !== le) && !m.containerEl?.contains(b))
      return;
    const {
      menuBtnEls: A,
      focusedMenuBtn: v,
      timeouts: j
    } = m, Z = ge(A), de = ie(m, {
      inputElement: i,
      type: "focusElementOnClose",
      subType: "click"
    }) || Z;
    de && de.focus();
  }, L = () => typeof O == "string" ? document.querySelector(O) : O, W = () => {
    if (B.closedByEvents) return;
    const b = document.activeElement;
    if (
      // activeElement !== state.menuBtnEls
      m.menuBtnEls.every((A) => b !== A) && !m.containerEl?.contains(b)
    ) {
      setTimeout(() => {
        B.closedBySetOpen = !1;
      });
      return;
    }
    B.closedBySetOpen || (B.closedBySetOpen = !0, setTimeout(() => {
      B.closedBySetOpen = !1, E();
    }));
  };
  St(Ue(() => !!e.open(), (b, A) => {
    b !== A && (b || (m.focusSentinelAfterEl && (m.focusSentinelAfterEl.tabIndex = -1), W()));
  }, {
    defer: C
  })), Be(Ue(() => typeof e.menuButton == "function" ? e.menuButton() : e.menuButton, (b) => {
    uo({
      state: m,
      menuButton: b,
      open: e.open
    }), xe(() => {
    });
  })), Be(Ue(() => !!e.open(), (b, A) => {
    b !== A && (b ? (B.closedByEvents = !1, Eo(m), Co(m), ho(m), vo(a), no({
      // @ts-ignore
      id: n,
      uniqueId: m.uniqueId,
      open: e.open,
      setOpen: e.setOpen,
      containerEl: m.containerEl,
      menuBtnEls: m.menuBtnEls,
      focusedMenuBtn: m.focusedMenuBtn,
      overlayEl: m.overlayEl,
      menuPopupEl: m.menuPopupEl,
      overlay: g,
      closeWhenDocumentBlurs: d,
      closeWhenEscapeKeyIsPressed: y,
      closeWhenMenuButtonIsTabbed: u,
      closeWhenClickingOutside: p,
      overlayElement: w,
      cursorKeys: l,
      focusElementOnClose: i,
      focusSentinelBeforeEl: m.focusSentinelBeforeEl,
      focusSentinelAfterEl: m.focusSentinelAfterEl,
      ignoreMenuPopupWhenTabbing: V,
      upperStackRemovedByFocusOut: !1,
      detectIfMenuButtonObscured: !1,
      queueRemoval: !1,
      mountedPopupsSafeList: m.mountedPopupsSafeList,
      timeouts: m.timeouts
    }), K && K(b, {
      uniqueId: m.uniqueId,
      dismissStack: D
    }), mn(m, b), Ro(m)) : (po(m), B.closedByEvents = !1, ar(m), lr(m), rr(m.uniqueId), cr(), qt(), K && K(b, {
      uniqueId: m.uniqueId,
      dismissStack: D
    }), e.animation || mn(m, b)));
  }, {
    defer: C
  })), xe(() => {
    ar(m, {
      isCleanup: !0
    }), lr(m), rr(m.uniqueId), cr();
  });
  function G() {
    return typeof e.overlayElement == "object" && e.overlayElement.element ? e.overlayElement.element : (() => {
      var b = No(), A = m.refOverlayCb;
      return typeof A == "function" ? ke(A, b) : m.refOverlayCb = b, qe(b, "mouseup", Bo, !0), qe(b, "mousedown", To, !0), qe(b, "click", m.onClickOverlayRef, !0), oe((v) => {
        var j = typeof e.overlayElement == "object" ? e.overlayElement.class : void 0, Z = typeof e.overlayElement == "object" ? e.overlayElement.classList || {} : {};
        return j !== v.e && Ve(b, v.e = j), v.t = Tt(b, Z, v.t), v;
      }, {
        e: void 0,
        t: void 0
      }), b;
    })();
  }
  function X(b) {
    return (() => {
      var A = Fo(), v = A.firstChild, j = v.nextSibling, Z = m.refContainerCb;
      typeof Z == "function" ? ke(Z, A) : m.refContainerCb = A, qe(A, "focusout", m.onFocusOutContainerRef, !0), qe(A, "focusin", m.onFocusInContainerRef, !0);
      var de = m.focusSentinelBeforeEl;
      typeof de == "function" ? ke(de, v) : m.focusSentinelBeforeEl = v, v.addEventListener("focus", (ne) => {
        ur(m, "before", ne.relatedTarget);
      }), U(A, b, j);
      var le = m.focusSentinelAfterEl;
      return typeof le == "function" ? ke(le, j) : m.focusSentinelAfterEl = j, j.addEventListener("focus", () => {
        ur(m, "after");
      }), oe((ne) => {
        var ye = m.id, Ce = e.class, Re = e.classList || {}, Ie = e.open() ? "0" : "-1", N = e.open() && m.hasFocusSentinels ? "0" : "-1";
        return ye !== ne.e && te(A, "id", ne.e = ye), Ce !== ne.t && Ve(A, ne.t = Ce), ne.a = Tt(A, Re, ne.a), Ie !== ne.o && te(v, "tabindex", ne.o = Ie), N !== ne.i && te(j, "tabindex", ne.i = N), ne;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0,
        i: void 0
      }), A;
    })();
  }
  if (k) return X(e.children);
  let se = !1;
  const H = ee(() => e.open(), !1, {
    equals: (b, A) => se ? b === A : !b == !A
  }), Y = ee(() => {
    const b = H();
    if (b) {
      const A = e.children, v = typeof A == "function" && A.length > 0;
      return se = v, v ? ce(() => A(b)) : O ? P(Mo, {
        get mount() {
          return L();
        },
        get overlayChildren() {
          return w ? G() : null;
        },
        get children() {
          return X(A);
        }
      }) : X(A);
    }
  });
  return e.animation ? P(ko, Ln(() => e.animation, {
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
    state: m,
    get children() {
      return Y();
    }
  })) : Y;
};
Le(["click", "mousedown", "mouseup", "focusin", "focusout"]);
var Do = /* @__PURE__ */ q("<svg>");
const Zt = (e) => {
  const [t, n] = ii(e, ["path"]);
  return (() => {
    var r = Do();
    return jr(r, Ln({
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
    }, n), !0, !0), U(r, () => t.path.path), r;
  })();
};
var qo = /* @__PURE__ */ q('<svg><path stroke-linecap=round stroke-linejoin=round d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"></svg>', !1, !0, !1), jo = /* @__PURE__ */ q('<svg><path stroke-linecap=round stroke-linejoin=round d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z"></svg>', !1, !0, !1), Uo = /* @__PURE__ */ q('<svg><path stroke-linecap=round stroke-linejoin=round d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></svg>', !1, !0, !1);
const Vo = {
  path: () => qo(),
  outline: !0,
  mini: !1
}, Ko = {
  path: () => jo(),
  outline: !0,
  mini: !1
}, Wo = {
  path: () => Uo(),
  outline: !0,
  mini: !1
};
var Ho = /* @__PURE__ */ q('<a href=/terminal class="flex cursor-alias flex-row items-center space-x-2 rounded px-2 py-2 opacity-80 hover:opacity-100 md:px-1"title=Terminal>'), zo = /* @__PURE__ */ q('<img class="h-8 w-8 rounded-full"crossorigin=anonymous>'), Qo = /* @__PURE__ */ q("<button>"), Go = /* @__PURE__ */ q('<img class="h-10 w-10 rounded-full border-`1 border-neutral-200 dark:border-neutral-600 shadow-md"crossorigin=anonymous>'), Jo = /* @__PURE__ */ q('<div class="dark:bg-neutral-950 absolute right-0 flex flex-col items-left justify-center bg-white shadow-md rounded-lg p-4 w-60"> <div class="flex space-x-3"> <div class=text-left> <p class="text-sm font-semibold text-gray-800 dark:text-gray-100"> <br><span class="text-xs text-gray-600 dark:text-gray-400 capitalize"></span></p></div></div><button class="w-full px-2 py-2 text-left text-xs hover:bg-gray-300 dark:hover:bg-gray-800 rounded-md mt-2">Sign Out'), Yo = /* @__PURE__ */ q('<header class="dark:bg-neutral-950 border-b-2px z-12 sticky top-0 flex items-center bg-white gap-x-4 border-slate-200 p-1 px-2 text-sm dark:border-neutral-800"><button type=button class="visible relative ml-auto rounded px-3 py-2 opacity-80 hover:opacity-100 md:hidden"title="Mobile Menu Button"><span class=sr-only>Show menu</span></button><div class="relative h-8 cursor-pointer leading-snug">'), Xo = /* @__PURE__ */ q('<a href=/dashboard title=Dashboard><h1 class="leading-0 uppercase tracking-widest"><b>Dash</b> Playground'), Zo = /* @__PURE__ */ q('<a class="bg-solid-default mx-1 rounded px-3 py-2 text-lg text-slate-50"href=/login rel=external>Login'), ec = /* @__PURE__ */ q('<div class="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold uppercase">'), tc = /* @__PURE__ */ q('<div class="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold uppercase border-2 border-gray-200 dark:border-gray-600 shadow-md">');
const nc = (e) => {
  const [t, n] = I(!1), r = Fe(), [s, i] = I(!1), [o, c] = I(!1), [l, u] = I(!1), [f, a] = I("");
  let d, h;
  const y = Ae();
  window.addEventListener("resize", p), xe(() => {
    window.removeEventListener("resize", p);
  });
  function p() {
    i(!1);
  }
  Be(async () => {
    r.user()?.email && (r.user()?.image && a(r.user()?.image), u(!0));
  });
  const g = async () => {
    try {
      await fetch(`${Ke}/auth/logout`, {
        method: "POST",
        credentials: "include"
        // Ensures cookies are sent with the request
      }), localStorage.removeItem("token"), localStorage.removeItem("user"), u(!1), location.reload(), y("/login");
    } catch (w) {
      console.error("Logout failed:", w);
    }
  };
  return (() => {
    var w = Yo(), x = w.firstChild, T = x.firstChild, S = x.nextSibling;
    U(w, () => e.children || Xo(), x), U(w, P(fr, {
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
      setOpen: i,
      show: !0,
      get children() {
        var k = Ho();
        return U(k, P(Zt, {
          path: Ko,
          class: "h-6"
        })), k;
      }
    }), x);
    var O = d;
    return typeof O == "function" ? ke(O, x) : d = x, U(x, P(Oe, {
      get when() {
        return s();
      },
      get fallback() {
        return P(Zt, {
          path: Vo,
          class: "h-6 w-6"
        });
      },
      get children() {
        return P(Zt, {
          path: Wo,
          class: "h-[22px] w-[22px]"
        });
      }
    }), T), U(S, P(Oe, {
      get when() {
        return l();
      },
      get fallback() {
        return Zo();
      },
      get children() {
        return [(() => {
          var k = Qo(), Q = h;
          return typeof Q == "function" ? ke(Q, k) : h = k, U(k, P(Oe, {
            get when() {
              return r.user()?.image;
            },
            get fallback() {
              return (() => {
                var K = ec();
                return U(K, () => r.user()?.name?.[0] || r.user()?.email?.[0] || "U"), K;
              })();
            },
            get children() {
              var K = zo();
              return oe((J) => {
                var V = `${Ke}/file/proxy?url=${encodeURIComponent(r.user()?.image || "")}`, M = r.user()?.name;
                return V !== J.e && te(K, "src", J.e = V), M !== J.t && te(K, "alt", J.t = M), J;
              }, {
                e: void 0,
                t: void 0
              }), K;
            }
          })), k;
        })(), P(fr, {
          menuButton: () => h,
          open: o,
          setOpen: c,
          get children() {
            var k = Jo(), Q = k.firstChild, K = Q.nextSibling, J = K.firstChild, V = J.nextSibling, M = V.firstChild, m = M.nextSibling, C = m.firstChild, E = C.nextSibling, L = E.nextSibling, W = K.nextSibling;
            return U(K, P(Oe, {
              get when() {
                return r.user()?.image;
              },
              get fallback() {
                return (() => {
                  var G = tc();
                  return U(G, () => r.user()?.name?.[0] || r.user()?.email?.[0] || "U"), G;
                })();
              },
              get children() {
                var G = Go();
                return oe((X) => {
                  var se = `${Ke}/file/proxy?url=${encodeURIComponent(r.user()?.image || "")}`, H = r.user()?.name;
                  return se !== X.e && te(G, "src", X.e = se), H !== X.t && te(G, "alt", X.t = H), X;
                }, {
                  e: void 0,
                  t: void 0
                }), G;
              }
            }), V), U(m, () => r.user()?.name || r.user()?.email || "User", C), U(L, () => r.user()?.role || "Member"), W.$$click = g, k;
          }
        })];
      }
    })), oe((k) => Tt(x, {
      "border-white border": s()
    }, k)), w;
  })();
};
Le(["click"]);
var rc = /* @__PURE__ */ q("<footer><p>&copy; 2025 "), sc = /* @__PURE__ */ q('<div class="max-w-screen overflow-x-hidden"><div class="fixed inset-x-0 top-0 z-10 border-b border-black/5 dark:border-white/10"><div class="bg-white dark:bg-neutral-950"></div></div><main class="h-screen overflow-hidden"><div class="grid grid-cols-1 grid-rows-[1fr_1px_auto_1px_auto] justify-center pt-10.25 [--gutter-width:2.5rem] md:-mx-4 md:grid-cols-[var(--gutter-width)_minmax(0,var(--breakpoint-2xl))_var(--gutter-width)] lg:mx-0"><div class="col-start-1 row-span-full row-start-1 hidden border-x border-x-[--pattern-fg] border-neutral-200 dark:border-neutral-800 bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed [--pattern-fg:var(--color-black)]/5 md:block dark:[--pattern-fg:var(--color-white)]/10"></div><div class="row-span-full row-start-1 hidden border-x border-x-[--pattern-fg] border-neutral-200 dark:border-neutral-800 bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed [--pattern-fg:var(--color-black)]/5 md:col-start-3 md:block dark:[--pattern-fg:var(--color-white)]/10"></div></div><div class=fixed! aria-hidden=true><input type=text tabindex=-1>');
const en = (e) => ($n(), Ae(), Dt(), Fe(), (() => {
  var t = sc(), n = t.firstChild, r = n.firstChild, s = n.nextSibling, i = s.firstChild, o = i.firstChild, c = o.nextSibling, l = i.nextSibling;
  return l.firstChild, U(r, P(nc, {})), U(i, () => e.children, c), U(t, P(Oe, {
    get when() {
      return e.footer;
    },
    get children() {
      var u = rc(), f = u.firstChild;
      return f.firstChild, U(f, () => e.footer, null), u;
    }
  }), null), t;
})()), _e = /* @__PURE__ */ Object.create(null);
_e.open = "0";
_e.close = "1";
_e.ping = "2";
_e.pong = "3";
_e.message = "4";
_e.upgrade = "5";
_e.noop = "6";
const yt = /* @__PURE__ */ Object.create(null);
Object.keys(_e).forEach((e) => {
  yt[_e[e]] = e;
});
const yn = { type: "error", data: "parser error" }, ds = typeof Blob == "function" || typeof Blob < "u" && Object.prototype.toString.call(Blob) === "[object BlobConstructor]", hs = typeof ArrayBuffer == "function", ps = (e) => typeof ArrayBuffer.isView == "function" ? ArrayBuffer.isView(e) : e && e.buffer instanceof ArrayBuffer, Dn = ({ type: e, data: t }, n, r) => ds && t instanceof Blob ? n ? r(t) : dr(t, r) : hs && (t instanceof ArrayBuffer || ps(t)) ? n ? r(t) : dr(new Blob([t]), r) : r(_e[e] + (t || "")), dr = (e, t) => {
  const n = new FileReader();
  return n.onload = function() {
    const r = n.result.split(",")[1];
    t("b" + (r || ""));
  }, n.readAsDataURL(e);
};
function hr(e) {
  return e instanceof Uint8Array ? e : e instanceof ArrayBuffer ? new Uint8Array(e) : new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
}
let tn;
function ic(e, t) {
  if (ds && e.data instanceof Blob)
    return e.data.arrayBuffer().then(hr).then(t);
  if (hs && (e.data instanceof ArrayBuffer || ps(e.data)))
    return t(hr(e.data));
  Dn(e, !1, (n) => {
    tn || (tn = new TextEncoder()), t(tn.encode(n));
  });
}
const pr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", et = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (let e = 0; e < pr.length; e++)
  et[pr.charCodeAt(e)] = e;
const oc = (e) => {
  let t = e.length * 0.75, n = e.length, r, s = 0, i, o, c, l;
  e[e.length - 1] === "=" && (t--, e[e.length - 2] === "=" && t--);
  const u = new ArrayBuffer(t), f = new Uint8Array(u);
  for (r = 0; r < n; r += 4)
    i = et[e.charCodeAt(r)], o = et[e.charCodeAt(r + 1)], c = et[e.charCodeAt(r + 2)], l = et[e.charCodeAt(r + 3)], f[s++] = i << 2 | o >> 4, f[s++] = (o & 15) << 4 | c >> 2, f[s++] = (c & 3) << 6 | l & 63;
  return u;
}, cc = typeof ArrayBuffer == "function", qn = (e, t) => {
  if (typeof e != "string")
    return {
      type: "message",
      data: ms(e, t)
    };
  const n = e.charAt(0);
  return n === "b" ? {
    type: "message",
    data: lc(e.substring(1), t)
  } : yt[n] ? e.length > 1 ? {
    type: yt[n],
    data: e.substring(1)
  } : {
    type: yt[n]
  } : yn;
}, lc = (e, t) => {
  if (cc) {
    const n = oc(e);
    return ms(n, t);
  } else
    return { base64: !0, data: e };
}, ms = (e, t) => {
  switch (t) {
    case "blob":
      return e instanceof Blob ? e : new Blob([e]);
    case "arraybuffer":
    default:
      return e instanceof ArrayBuffer ? e : e.buffer;
  }
}, gs = "", ac = (e, t) => {
  const n = e.length, r = new Array(n);
  let s = 0;
  e.forEach((i, o) => {
    Dn(i, !1, (c) => {
      r[o] = c, ++s === n && t(r.join(gs));
    });
  });
}, uc = (e, t) => {
  const n = e.split(gs), r = [];
  for (let s = 0; s < n.length; s++) {
    const i = qn(n[s], t);
    if (r.push(i), i.type === "error")
      break;
  }
  return r;
};
function fc() {
  return new TransformStream({
    transform(e, t) {
      ic(e, (n) => {
        const r = n.length;
        let s;
        if (r < 126)
          s = new Uint8Array(1), new DataView(s.buffer).setUint8(0, r);
        else if (r < 65536) {
          s = new Uint8Array(3);
          const i = new DataView(s.buffer);
          i.setUint8(0, 126), i.setUint16(1, r);
        } else {
          s = new Uint8Array(9);
          const i = new DataView(s.buffer);
          i.setUint8(0, 127), i.setBigUint64(1, BigInt(r));
        }
        e.data && typeof e.data != "string" && (s[0] |= 128), t.enqueue(s), t.enqueue(n);
      });
    }
  });
}
let nn;
function ht(e) {
  return e.reduce((t, n) => t + n.length, 0);
}
function pt(e, t) {
  if (e[0].length === t)
    return e.shift();
  const n = new Uint8Array(t);
  let r = 0;
  for (let s = 0; s < t; s++)
    n[s] = e[0][r++], r === e[0].length && (e.shift(), r = 0);
  return e.length && r < e[0].length && (e[0] = e[0].slice(r)), n;
}
function dc(e, t) {
  nn || (nn = new TextDecoder());
  const n = [];
  let r = 0, s = -1, i = !1;
  return new TransformStream({
    transform(o, c) {
      for (n.push(o); ; ) {
        if (r === 0) {
          if (ht(n) < 1)
            break;
          const l = pt(n, 1);
          i = (l[0] & 128) === 128, s = l[0] & 127, s < 126 ? r = 3 : s === 126 ? r = 1 : r = 2;
        } else if (r === 1) {
          if (ht(n) < 2)
            break;
          const l = pt(n, 2);
          s = new DataView(l.buffer, l.byteOffset, l.length).getUint16(0), r = 3;
        } else if (r === 2) {
          if (ht(n) < 8)
            break;
          const l = pt(n, 8), u = new DataView(l.buffer, l.byteOffset, l.length), f = u.getUint32(0);
          if (f > Math.pow(2, 21) - 1) {
            c.enqueue(yn);
            break;
          }
          s = f * Math.pow(2, 32) + u.getUint32(4), r = 3;
        } else {
          if (ht(n) < s)
            break;
          const l = pt(n, s);
          c.enqueue(qn(i ? l : nn.decode(l), t)), r = 0;
        }
        if (s === 0 || s > e) {
          c.enqueue(yn);
          break;
        }
      }
    }
  });
}
const ys = 4;
function re(e) {
  if (e) return hc(e);
}
function hc(e) {
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
const Ut = typeof Promise == "function" && typeof Promise.resolve == "function" ? (t) => Promise.resolve().then(t) : (t, n) => n(t, 0), me = typeof self < "u" ? self : typeof window < "u" ? window : Function("return this")(), pc = "arraybuffer";
function bs(e, ...t) {
  return t.reduce((n, r) => (e.hasOwnProperty(r) && (n[r] = e[r]), n), {});
}
const mc = me.setTimeout, gc = me.clearTimeout;
function Vt(e, t) {
  t.useNativeTimers ? (e.setTimeoutFn = mc.bind(me), e.clearTimeoutFn = gc.bind(me)) : (e.setTimeoutFn = me.setTimeout.bind(me), e.clearTimeoutFn = me.clearTimeout.bind(me));
}
const yc = 1.33;
function bc(e) {
  return typeof e == "string" ? vc(e) : Math.ceil((e.byteLength || e.size) * yc);
}
function vc(e) {
  let t = 0, n = 0;
  for (let r = 0, s = e.length; r < s; r++)
    t = e.charCodeAt(r), t < 128 ? n += 1 : t < 2048 ? n += 2 : t < 55296 || t >= 57344 ? n += 3 : (r++, n += 4);
  return n;
}
function vs() {
  return Date.now().toString(36).substring(3) + Math.random().toString(36).substring(2, 5);
}
function wc(e) {
  let t = "";
  for (let n in e)
    e.hasOwnProperty(n) && (t.length && (t += "&"), t += encodeURIComponent(n) + "=" + encodeURIComponent(e[n]));
  return t;
}
function Ec(e) {
  let t = {}, n = e.split("&");
  for (let r = 0, s = n.length; r < s; r++) {
    let i = n[r].split("=");
    t[decodeURIComponent(i[0])] = decodeURIComponent(i[1]);
  }
  return t;
}
class xc extends Error {
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
    super(), this.writable = !1, Vt(this, t), this.opts = t, this.query = t.query, this.socket = t.socket, this.supportsBinary = !t.forceBase64;
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
    return super.emitReserved("error", new xc(t, n, r)), this;
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
    const n = wc(t);
    return n.length ? "?" + n : "";
  }
}
class _c extends jn {
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
    uc(t, this.socket.binaryType).forEach(n), this.readyState !== "closed" && (this._polling = !1, this.emitReserved("pollComplete"), this.readyState === "open" && this._poll());
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
    this.writable = !1, ac(t, (n) => {
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
    return this.opts.timestampRequests !== !1 && (n[this.opts.timestampParam] = vs()), !this.supportsBinary && !n.sid && (n.b64 = 1), this.createUri(t, n);
  }
}
let ws = !1;
try {
  ws = typeof XMLHttpRequest < "u" && "withCredentials" in new XMLHttpRequest();
} catch {
}
const kc = ws;
function Sc() {
}
class Ac extends _c {
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
    r.on("success", n), r.on("error", (s, i) => {
      this.onError("xhr post error", s, i);
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
    super(), this.createRequest = t, Vt(this, r), this._opts = r, this._method = r.method || "GET", this._uri = n, this._data = r.data !== void 0 ? r.data : null, this._create();
  }
  /**
   * Creates the XHR object and sends the request.
   *
   * @private
   */
  _create() {
    var t;
    const n = bs(this._opts, "agent", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "autoUnref");
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
      if (this._xhr.onreadystatechange = Sc, t)
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
    attachEvent("onunload", mr);
  else if (typeof addEventListener == "function") {
    const e = "onpagehide" in me ? "pagehide" : "unload";
    addEventListener(e, mr, !1);
  }
}
function mr() {
  for (let e in Ee.requests)
    Ee.requests.hasOwnProperty(e) && Ee.requests[e].abort();
}
const Cc = function() {
  const e = Es({
    xdomain: !1
  });
  return e && e.responseType !== null;
}();
class Oc extends Ac {
  constructor(t) {
    super(t);
    const n = t && t.forceBase64;
    this.supportsBinary = Cc && !n;
  }
  request(t = {}) {
    return Object.assign(t, { xd: this.xd }, this.opts), new Ee(Es, this.uri(), t);
  }
}
function Es(e) {
  const t = e.xdomain;
  try {
    if (typeof XMLHttpRequest < "u" && (!t || kc))
      return new XMLHttpRequest();
  } catch {
  }
  if (!t)
    try {
      return new me[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP");
    } catch {
    }
}
const xs = typeof navigator < "u" && typeof navigator.product == "string" && navigator.product.toLowerCase() === "reactnative";
class Tc extends jn {
  get name() {
    return "websocket";
  }
  doOpen() {
    const t = this.uri(), n = this.opts.protocols, r = xs ? {} : bs(this.opts, "agent", "perMessageDeflate", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "localAddress", "protocolVersion", "origin", "maxPayload", "family", "checkServerIdentity");
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
      Dn(r, this.supportsBinary, (i) => {
        try {
          this.doWrite(r, i);
        } catch {
        }
        s && Ut(() => {
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
    return this.opts.timestampRequests && (n[this.opts.timestampParam] = vs()), this.supportsBinary || (n.b64 = 1), this.createUri(t, n);
  }
}
const rn = me.WebSocket || me.MozWebSocket;
class Bc extends Tc {
  createSocket(t, n, r) {
    return xs ? new rn(t, n, r) : n ? new rn(t, n) : new rn(t);
  }
  doWrite(t, n) {
    this.ws.send(n);
  }
}
class Pc extends jn {
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
        const n = dc(Number.MAX_SAFE_INTEGER, this.socket.binaryType), r = t.readable.pipeThrough(n).getReader(), s = fc();
        s.readable.pipeTo(t.writable), this._writer = s.writable.getWriter();
        const i = () => {
          r.read().then(({ done: c, value: l }) => {
            c || (this.onPacket(l), i());
          }).catch((c) => {
          });
        };
        i();
        const o = { type: "open" };
        this.query.sid && (o.data = `{"sid":"${this.query.sid}"}`), this._writer.write(o).then(() => this.onOpen());
      });
    });
  }
  write(t) {
    this.writable = !1;
    for (let n = 0; n < t.length; n++) {
      const r = t[n], s = n === t.length - 1;
      this._writer.write(r).then(() => {
        s && Ut(() => {
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
const Lc = {
  websocket: Bc,
  webtransport: Pc,
  polling: Oc
}, Rc = /^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/, Ic = [
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
function bn(e) {
  if (e.length > 8e3)
    throw "URI too long";
  const t = e, n = e.indexOf("["), r = e.indexOf("]");
  n != -1 && r != -1 && (e = e.substring(0, n) + e.substring(n, r).replace(/:/g, ";") + e.substring(r, e.length));
  let s = Rc.exec(e || ""), i = {}, o = 14;
  for (; o--; )
    i[Ic[o]] = s[o] || "";
  return n != -1 && r != -1 && (i.source = t, i.host = i.host.substring(1, i.host.length - 1).replace(/;/g, ":"), i.authority = i.authority.replace("[", "").replace("]", "").replace(/;/g, ":"), i.ipv6uri = !0), i.pathNames = $c(i, i.path), i.queryKey = Mc(i, i.query), i;
}
function $c(e, t) {
  const n = /\/{2,9}/g, r = t.replace(n, "/").split("/");
  return (t.slice(0, 1) == "/" || t.length === 0) && r.splice(0, 1), t.slice(-1) == "/" && r.splice(r.length - 1, 1), r;
}
function Mc(e, t) {
  const n = {};
  return t.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function(r, s, i) {
    s && (n[s] = i);
  }), n;
}
const vn = typeof addEventListener == "function" && typeof removeEventListener == "function", bt = [];
vn && addEventListener("offline", () => {
  bt.forEach((e) => e());
}, !1);
class Te extends re {
  /**
   * Socket constructor.
   *
   * @param {String|Object} uri - uri or options
   * @param {Object} opts - options
   */
  constructor(t, n) {
    if (super(), this.binaryType = pc, this.writeBuffer = [], this._prevBufferLen = 0, this._pingInterval = -1, this._pingTimeout = -1, this._maxPayload = -1, this._pingTimeoutTime = 1 / 0, t && typeof t == "object" && (n = t, t = null), t) {
      const r = bn(t);
      n.hostname = r.host, n.secure = r.protocol === "https" || r.protocol === "wss", n.port = r.port, r.query && (n.query = r.query);
    } else n.host && (n.hostname = bn(n.host).host);
    Vt(this, n), this.secure = n.secure != null ? n.secure : typeof location < "u" && location.protocol === "https:", n.hostname && !n.port && (n.port = this.secure ? "443" : "80"), this.hostname = n.hostname || (typeof location < "u" ? location.hostname : "localhost"), this.port = n.port || (typeof location < "u" && location.port ? location.port : this.secure ? "443" : "80"), this.transports = [], this._transportsByName = {}, n.transports.forEach((r) => {
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
    }, n), this.opts.path = this.opts.path.replace(/\/$/, "") + (this.opts.addTrailingSlash ? "/" : ""), typeof this.opts.query == "string" && (this.opts.query = Ec(this.opts.query)), vn && (this.opts.closeOnBeforeunload && (this._beforeunloadEventListener = () => {
      this.transport && (this.transport.removeAllListeners(), this.transport.close());
    }, addEventListener("beforeunload", this._beforeunloadEventListener, !1)), this.hostname !== "localhost" && (this._offlineEventListener = () => {
      this._onClose("transport close", {
        description: "network connection lost"
      });
    }, bt.push(this._offlineEventListener))), this.opts.withCredentials && (this._cookieJar = void 0), this._open();
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
    n.EIO = ys, n.transport = t, this.id && (n.sid = this.id);
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
    const t = this.opts.rememberUpgrade && Te.priorWebsocketSuccess && this.transports.indexOf("websocket") !== -1 ? "websocket" : this.transports[0];
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
    this.readyState = "open", Te.priorWebsocketSuccess = this.transport.name === "websocket", this.emitReserved("open"), this.flush();
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
      if (s && (n += bc(s)), r > 0 && n > this._maxPayload)
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
    return t && (this._pingTimeoutTime = 0, Ut(() => {
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
    const i = {
      type: t,
      data: n,
      options: r
    };
    this.emitReserved("packetCreate", i), this.writeBuffer.push(i), s && this.once("flush", s), this.flush();
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
    if (Te.priorWebsocketSuccess = !1, this.opts.tryAllTransports && this.transports.length > 1 && this.readyState === "opening")
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
      if (this.clearTimeoutFn(this._pingTimeoutTimer), this.transport.removeAllListeners("close"), this.transport.close(), this.transport.removeAllListeners(), vn && (this._beforeunloadEventListener && removeEventListener("beforeunload", this._beforeunloadEventListener, !1), this._offlineEventListener)) {
        const r = bt.indexOf(this._offlineEventListener);
        r !== -1 && bt.splice(r, 1);
      }
      this.readyState = "closed", this.id = null, this.emitReserved("close", t, n), this.writeBuffer = [], this._prevBufferLen = 0;
    }
  }
}
Te.protocol = ys;
class Nc extends Te {
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
    Te.priorWebsocketSuccess = !1;
    const s = () => {
      r || (n.send([{ type: "ping", data: "probe" }]), n.once("packet", (a) => {
        if (!r)
          if (a.type === "pong" && a.data === "probe") {
            if (this.upgrading = !0, this.emitReserved("upgrading", n), !n)
              return;
            Te.priorWebsocketSuccess = n.name === "websocket", this.transport.pause(() => {
              r || this.readyState !== "closed" && (f(), this.setTransport(n), n.send([{ type: "upgrade" }]), this.emitReserved("upgrade", n), n = null, this.upgrading = !1, this.flush());
            });
          } else {
            const d = new Error("probe error");
            d.transport = n.name, this.emitReserved("upgradeError", d);
          }
      }));
    };
    function i() {
      r || (r = !0, f(), n.close(), n = null);
    }
    const o = (a) => {
      const d = new Error("probe error: " + a);
      d.transport = n.name, i(), this.emitReserved("upgradeError", d);
    };
    function c() {
      o("transport closed");
    }
    function l() {
      o("socket closed");
    }
    function u(a) {
      n && a.name !== n.name && i();
    }
    const f = () => {
      n.removeListener("open", s), n.removeListener("error", o), n.removeListener("close", c), this.off("close", l), this.off("upgrading", u);
    };
    n.once("open", s), n.once("error", o), n.once("close", c), this.once("close", l), this.once("upgrading", u), this._upgrades.indexOf("webtransport") !== -1 && t !== "webtransport" ? this.setTimeoutFn(() => {
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
let Fc = class extends Nc {
  constructor(t, n = {}) {
    const r = typeof t == "object" ? t : n;
    (!r.transports || r.transports && typeof r.transports[0] == "string") && (r.transports = (r.transports || ["polling", "websocket", "webtransport"]).map((s) => Lc[s]).filter((s) => !!s)), super(t, r);
  }
};
function Dc(e, t = "", n) {
  let r = e;
  n = n || typeof location < "u" && location, e == null && (e = n.protocol + "//" + n.host), typeof e == "string" && (e.charAt(0) === "/" && (e.charAt(1) === "/" ? e = n.protocol + e : e = n.host + e), /^(https?|wss?):\/\//.test(e) || (typeof n < "u" ? e = n.protocol + "//" + e : e = "https://" + e), r = bn(e)), r.port || (/^(http|ws)$/.test(r.protocol) ? r.port = "80" : /^(http|ws)s$/.test(r.protocol) && (r.port = "443")), r.path = r.path || "/";
  const i = r.host.indexOf(":") !== -1 ? "[" + r.host + "]" : r.host;
  return r.id = r.protocol + "://" + i + ":" + r.port + t, r.href = r.protocol + "://" + i + (n && n.port === r.port ? "" : ":" + r.port), r;
}
const qc = typeof ArrayBuffer == "function", jc = (e) => typeof ArrayBuffer.isView == "function" ? ArrayBuffer.isView(e) : e.buffer instanceof ArrayBuffer, _s = Object.prototype.toString, Uc = typeof Blob == "function" || typeof Blob < "u" && _s.call(Blob) === "[object BlobConstructor]", Vc = typeof File == "function" || typeof File < "u" && _s.call(File) === "[object FileConstructor]";
function Un(e) {
  return qc && (e instanceof ArrayBuffer || jc(e)) || Uc && e instanceof Blob || Vc && e instanceof File;
}
function vt(e, t) {
  if (!e || typeof e != "object")
    return !1;
  if (Array.isArray(e)) {
    for (let n = 0, r = e.length; n < r; n++)
      if (vt(e[n]))
        return !0;
    return !1;
  }
  if (Un(e))
    return !0;
  if (e.toJSON && typeof e.toJSON == "function" && arguments.length === 1)
    return vt(e.toJSON(), !0);
  for (const n in e)
    if (Object.prototype.hasOwnProperty.call(e, n) && vt(e[n]))
      return !0;
  return !1;
}
function Kc(e) {
  const t = [], n = e.data, r = e;
  return r.data = wn(n, t), r.attachments = t.length, { packet: r, buffers: t };
}
function wn(e, t) {
  if (!e)
    return e;
  if (Un(e)) {
    const n = { _placeholder: !0, num: t.length };
    return t.push(e), n;
  } else if (Array.isArray(e)) {
    const n = new Array(e.length);
    for (let r = 0; r < e.length; r++)
      n[r] = wn(e[r], t);
    return n;
  } else if (typeof e == "object" && !(e instanceof Date)) {
    const n = {};
    for (const r in e)
      Object.prototype.hasOwnProperty.call(e, r) && (n[r] = wn(e[r], t));
    return n;
  }
  return e;
}
function Wc(e, t) {
  return e.data = En(e.data, t), delete e.attachments, e;
}
function En(e, t) {
  if (!e)
    return e;
  if (e && e._placeholder === !0) {
    if (typeof e.num == "number" && e.num >= 0 && e.num < t.length)
      return t[e.num];
    throw new Error("illegal attachments");
  } else if (Array.isArray(e))
    for (let n = 0; n < e.length; n++)
      e[n] = En(e[n], t);
  else if (typeof e == "object")
    for (const n in e)
      Object.prototype.hasOwnProperty.call(e, n) && (e[n] = En(e[n], t));
  return e;
}
const Hc = [
  "connect",
  "connect_error",
  "disconnect",
  "disconnecting",
  "newListener",
  "removeListener"
  // used by the Node.js EventEmitter
], zc = 5;
var F;
(function(e) {
  e[e.CONNECT = 0] = "CONNECT", e[e.DISCONNECT = 1] = "DISCONNECT", e[e.EVENT = 2] = "EVENT", e[e.ACK = 3] = "ACK", e[e.CONNECT_ERROR = 4] = "CONNECT_ERROR", e[e.BINARY_EVENT = 5] = "BINARY_EVENT", e[e.BINARY_ACK = 6] = "BINARY_ACK";
})(F || (F = {}));
class Qc {
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
    return (t.type === F.EVENT || t.type === F.ACK) && vt(t) ? this.encodeAsBinary({
      type: t.type === F.EVENT ? F.BINARY_EVENT : F.BINARY_ACK,
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
    return (t.type === F.BINARY_EVENT || t.type === F.BINARY_ACK) && (n += t.attachments + "-"), t.nsp && t.nsp !== "/" && (n += t.nsp + ","), t.id != null && (n += t.id), t.data != null && (n += JSON.stringify(t.data, this.replacer)), n;
  }
  /**
   * Encode packet as 'buffer sequence' by removing blobs, and
   * deconstructing packet into object with placeholders and
   * a list of buffers.
   */
  encodeAsBinary(t) {
    const n = Kc(t), r = this.encodeAsString(n.packet), s = n.buffers;
    return s.unshift(r), s;
  }
}
function gr(e) {
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
      const r = n.type === F.BINARY_EVENT;
      r || n.type === F.BINARY_ACK ? (n.type = r ? F.EVENT : F.ACK, this.reconstructor = new Gc(n), n.attachments === 0 && super.emitReserved("decoded", n)) : super.emitReserved("decoded", n);
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
    if (F[r.type] === void 0)
      throw new Error("unknown packet type " + r.type);
    if (r.type === F.BINARY_EVENT || r.type === F.BINARY_ACK) {
      const i = n + 1;
      for (; t.charAt(++n) !== "-" && n != t.length; )
        ;
      const o = t.substring(i, n);
      if (o != Number(o) || t.charAt(n) !== "-")
        throw new Error("Illegal attachments");
      r.attachments = Number(o);
    }
    if (t.charAt(n + 1) === "/") {
      const i = n + 1;
      for (; ++n && !(t.charAt(n) === "," || n === t.length); )
        ;
      r.nsp = t.substring(i, n);
    } else
      r.nsp = "/";
    const s = t.charAt(n + 1);
    if (s !== "" && Number(s) == s) {
      const i = n + 1;
      for (; ++n; ) {
        const o = t.charAt(n);
        if (o == null || Number(o) != o) {
          --n;
          break;
        }
        if (n === t.length)
          break;
      }
      r.id = Number(t.substring(i, n + 1));
    }
    if (t.charAt(++n)) {
      const i = this.tryParse(t.substr(n));
      if (Vn.isPayloadValid(r.type, i))
        r.data = i;
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
      case F.CONNECT:
        return gr(n);
      case F.DISCONNECT:
        return n === void 0;
      case F.CONNECT_ERROR:
        return typeof n == "string" || gr(n);
      case F.EVENT:
      case F.BINARY_EVENT:
        return Array.isArray(n) && (typeof n[0] == "number" || typeof n[0] == "string" && Hc.indexOf(n[0]) === -1);
      case F.ACK:
      case F.BINARY_ACK:
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
class Gc {
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
      const n = Wc(this.reconPack, this.buffers);
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
const Jc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Decoder: Vn,
  Encoder: Qc,
  get PacketType() {
    return F;
  },
  protocol: zc
}, Symbol.toStringTag, { value: "Module" }));
function be(e, t, n) {
  return e.on(t, n), function() {
    e.off(t, n);
  };
}
const Yc = Object.freeze({
  connect: 1,
  connect_error: 1,
  disconnect: 1,
  disconnecting: 1,
  // EventEmitter reserved events: https://nodejs.org/api/events.html#events_event_newlistener
  newListener: 1,
  removeListener: 1
});
class ks extends re {
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
    var r, s, i;
    if (Yc.hasOwnProperty(t))
      throw new Error('"' + t.toString() + '" is a reserved event name');
    if (n.unshift(t), this._opts.retries && !this.flags.fromQueue && !this.flags.volatile)
      return this._addToQueue(n), this;
    const o = {
      type: F.EVENT,
      data: n
    };
    if (o.options = {}, o.options.compress = this.flags.compress !== !1, typeof n[n.length - 1] == "function") {
      const f = this.ids++, a = n.pop();
      this._registerAckCallback(f, a), o.id = f;
    }
    const c = (s = (r = this.io.engine) === null || r === void 0 ? void 0 : r.transport) === null || s === void 0 ? void 0 : s.writable, l = this.connected && !(!((i = this.io.engine) === null || i === void 0) && i._hasPingExpired());
    return this.flags.volatile && !c || (l ? (this.notifyOutgoingListeners(o), this.packet(o)) : this.sendBuffer.push(o)), this.flags = {}, this;
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
    const i = this.io.setTimeoutFn(() => {
      delete this.acks[t];
      for (let c = 0; c < this.sendBuffer.length; c++)
        this.sendBuffer[c].id === t && this.sendBuffer.splice(c, 1);
      n.call(this, new Error("operation has timed out"));
    }, s), o = (...c) => {
      this.io.clearTimeoutFn(i), n.apply(this, c);
    };
    o.withError = !0, this.acks[t] = o;
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
      const i = (o, c) => o ? s(o) : r(c);
      i.withError = !0, n.push(i), this.emit(t, ...n);
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
    t.push((s, ...i) => r !== this._queue[0] ? void 0 : (s !== null ? r.tryCount > this._opts.retries && (this._queue.shift(), n && n(s)) : (this._queue.shift(), n && n(null, ...i)), r.pending = !1, this._drainQueue())), this._queue.push(r), this._drainQueue();
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
      type: F.CONNECT,
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
        case F.CONNECT:
          t.data && t.data.sid ? this.onconnect(t.data.sid, t.data.pid) : this.emitReserved("connect_error", new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));
          break;
        case F.EVENT:
        case F.BINARY_EVENT:
          this.onevent(t);
          break;
        case F.ACK:
        case F.BINARY_ACK:
          this.onack(t);
          break;
        case F.DISCONNECT:
          this.ondisconnect();
          break;
        case F.CONNECT_ERROR:
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
        type: F.ACK,
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
    return this.connected && this.packet({ type: F.DISCONNECT }), this.destroy(), this.connected && this.onclose("io client disconnect"), this;
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
function Qe(e) {
  e = e || {}, this.ms = e.min || 100, this.max = e.max || 1e4, this.factor = e.factor || 2, this.jitter = e.jitter > 0 && e.jitter <= 1 ? e.jitter : 0, this.attempts = 0;
}
Qe.prototype.duration = function() {
  var e = this.ms * Math.pow(this.factor, this.attempts++);
  if (this.jitter) {
    var t = Math.random(), n = Math.floor(t * this.jitter * e);
    e = (Math.floor(t * 10) & 1) == 0 ? e - n : e + n;
  }
  return Math.min(e, this.max) | 0;
};
Qe.prototype.reset = function() {
  this.attempts = 0;
};
Qe.prototype.setMin = function(e) {
  this.ms = e;
};
Qe.prototype.setMax = function(e) {
  this.max = e;
};
Qe.prototype.setJitter = function(e) {
  this.jitter = e;
};
class xn extends re {
  constructor(t, n) {
    var r;
    super(), this.nsps = {}, this.subs = [], t && typeof t == "object" && (n = t, t = void 0), n = n || {}, n.path = n.path || "/socket.io", this.opts = n, Vt(this, n), this.reconnection(n.reconnection !== !1), this.reconnectionAttempts(n.reconnectionAttempts || 1 / 0), this.reconnectionDelay(n.reconnectionDelay || 1e3), this.reconnectionDelayMax(n.reconnectionDelayMax || 5e3), this.randomizationFactor((r = n.randomizationFactor) !== null && r !== void 0 ? r : 0.5), this.backoff = new Qe({
      min: this.reconnectionDelay(),
      max: this.reconnectionDelayMax(),
      jitter: this.randomizationFactor()
    }), this.timeout(n.timeout == null ? 2e4 : n.timeout), this._readyState = "closed", this.uri = t;
    const s = n.parser || Jc;
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
    this.engine = new Fc(this.uri, this.opts);
    const n = this.engine, r = this;
    this._readyState = "opening", this.skipReconnect = !1;
    const s = be(n, "open", function() {
      r.onopen(), t && t();
    }), i = (c) => {
      this.cleanup(), this._readyState = "closed", this.emitReserved("error", c), t ? t(c) : this.maybeReconnectOnOpen();
    }, o = be(n, "error", i);
    if (this._timeout !== !1) {
      const c = this._timeout, l = this.setTimeoutFn(() => {
        s(), i(new Error("timeout")), n.close();
      }, c);
      this.opts.autoUnref && l.unref(), this.subs.push(() => {
        this.clearTimeoutFn(l);
      });
    }
    return this.subs.push(s), this.subs.push(o), this;
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
    Ut(() => {
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
    return r ? this._autoConnect && !r.active && r.connect() : (r = new ks(this, t, n), this.nsps[t] = r), r;
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
const Je = {};
function wt(e, t) {
  typeof e == "object" && (t = e, e = void 0), t = t || {};
  const n = Dc(e, t.path || "/socket.io"), r = n.source, s = n.id, i = n.path, o = Je[s] && i in Je[s].nsps, c = t.forceNew || t["force new connection"] || t.multiplex === !1 || o;
  let l;
  return c ? l = new xn(r, t) : (Je[s] || (Je[s] = new xn(r, t)), l = Je[s]), n.query && !t.query && (t.query = n.queryKey), l.socket(n.path, t);
}
Object.assign(wt, {
  Manager: xn,
  Socket: ks,
  io: wt,
  connect: wt
});
var Xc = /* @__PURE__ */ q('<div class="flex h-screen flex-col bg-white dark:bg-neutral-900 dark:text-white pt-10"><div class="flex-1 overflow-auto scroll-smooth px-4 py-2 text-sm"><div id=outputMessage class="my-2 px-4 py-2"><pre class="font-normal whitespace-pre-wrap"></pre></div></div><div class="relative flex items-center justify-between gap-2 pb-4"><span>$</span><input type=text autofocus>'), Zc = /* @__PURE__ */ q("<pre>"), el = /* @__PURE__ */ q('<div class="z-10 rounded-md border border-neutral-600 bg-neutral-900 text-sm text-white shadow-lg"><div class="flex flex-col text-left">'), tl = /* @__PURE__ */ q('<button class="flex items-center gap-2 px-4 py-2 text-left text-neutral-100 hover:bg-neutral-800">'), nl = /* @__PURE__ */ q('<svg xmlns=http://www.w3.org/2000/svg width=24 height=24 viewBox="0 0 24 24"><path fill=#fff d="m20.713 8.128l-.246.566a.506.506 0 0 1-.934 0l-.246-.566a4.36 4.36 0 0 0-2.22-2.25l-.759-.339a.53.53 0 0 1 0-.963l.717-.319a4.37 4.37 0 0 0 2.251-2.326l.253-.611a.506.506 0 0 1 .942 0l.253.61a4.37 4.37 0 0 0 2.25 2.327l.718.32a.53.53 0 0 1 0 .962l-.76.338a4.36 4.36 0 0 0-2.219 2.251M12 4a8 8 0 1 0 7.944 7.045l1.986-.236Q22 11.396 22 12c0 5.523-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2c.861 0 1.699.11 2.498.315L14 4.252A8 8 0 0 0 12 4m1 7h3l-5 7v-5H8l5-7z">'), rl = /* @__PURE__ */ q('<svg xmlns=http://www.w3.org/2000/svg width=24 height=24 viewBox="0 0 24 24"><path fill=none stroke=#fff d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2M7 7h10M7 12h10M7 17h6">'), sl = /* @__PURE__ */ q('<svg xmlns=http://www.w3.org/2000/svg width=24 height=24 viewBox="0 0 512 512"><path fill=#fff fill-rule=evenodd d="M256 42.667C138.18 42.667 42.667 138.179 42.667 256c0 117.82 95.513 213.334 213.333 213.334c117.822 0 213.334-95.513 213.334-213.334S373.822 42.667 256 42.667m0 384c-94.105 0-170.666-76.561-170.666-170.667S161.894 85.334 256 85.334c94.107 0 170.667 76.56 170.667 170.666S350.107 426.667 256 426.667m26.714-256c0 15.468-11.262 26.667-26.497 26.667c-15.851 0-26.837-11.2-26.837-26.963c0-15.15 11.283-26.37 26.837-26.37c15.235 0 26.497 11.22 26.497 26.666m-48 64h42.666v128h-42.666z">'), il = /* @__PURE__ */ q('<svg xmlns=http://www.w3.org/2000/svg width=24 height=24 viewBox="0 0 24 24"><path fill=#fff d="M4 21h9.62a4 4 0 0 0 3.037-1.397l5.102-5.952a1 1 0 0 0-.442-1.6l-1.968-.656a3.04 3.04 0 0 0-2.823.503l-3.185 2.547l-.617-1.235A3.98 3.98 0 0 0 9.146 11H4c-1.103 0-2 .897-2 2v6c0 1.103.897 2 2 2m0-8h5.146c.763 0 1.448.423 1.789 1.105l.447.895H7v2h6.014a1 1 0 0 0 .442-.11l.003-.001l.004-.002h.003l.002-.001h.004l.001-.001c.009.003.003-.001.003-.001c.01 0 .002-.001.002-.001h.001l.002-.001l.003-.001l.002-.001l.002-.001l.003-.001l.002-.001c.003 0 .001-.001.002-.001l.003-.002l.002-.001l.002-.001l.003-.001l.002-.001h.001l.002-.001h.001l.002-.001l.002-.001c.009-.001.003-.001.003-.001l.002-.001a1 1 0 0 0 .11-.078l4.146-3.317c.262-.208.623-.273.94-.167l.557.186l-4.133 4.823a2.03 2.03 0 0 1-1.52.688H4zM16 2h-.017c-.163.002-1.006.039-1.983.705c-.951-.648-1.774-.7-1.968-.704L12.002 2h-.004c-.801 0-1.555.313-2.119.878C9.313 3.445 9 4.198 9 5s.313 1.555.861 2.104l3.414 3.586a1.006 1.006 0 0 0 1.45-.001l3.396-3.568C18.688 6.555 19 5.802 19 5s-.313-1.555-.878-2.121A2.98 2.98 0 0 0 16.002 2zm1 3c0 .267-.104.518-.311.725L14 8.55l-2.707-2.843C11.104 5.518 11 5.267 11 5s.104-.518.294-.708A.98.98 0 0 1 11.979 4c.025.001.502.032 1.067.485q.121.098.247.222l.707.707l.707-.707q.126-.124.247-.222c.529-.425.976-.478 1.052-.484a1 1 0 0 1 .701.292c.189.189.293.44.293.707">');
function ol() {
  const [e, t] = I([]), [n, r] = I(null), [s, i] = I(""), [o, c] = I("/home/your-username"), [l, u] = I(""), [f, a] = I("Disconnected"), [d, h] = I(!1), [y, p] = I({
    x: 0,
    y: 0
  }), [g, w] = I([]);
  $n();
  const x = Ae();
  Dt();
  const T = Fe();
  let S, O;
  O && (O.disabled = !0);
  const k = ["Switch to AI", "Documentation", "Donate", "About"], Q = (C) => {
    w(k.filter((E) => E.toLowerCase().includes(C.toLowerCase().slice(1))));
  }, K = (C) => {
    const E = C.currentTarget.value;
    if (i(E), E.startsWith("/")) {
      const L = C.currentTarget.getBoundingClientRect();
      p({
        x: L.left,
        y: L.bottom
      }), h(!0), Q(E);
    } else
      h(!1);
  }, J = () => {
    S && (S.scrollTop = S.scrollHeight);
  }, V = (C, E) => {
    if (C === "outputMessage" || C === "error" && E === "Authentication required") {
      const W = document.getElementById("outputMessage");
      W && (W.innerHTML = `<pre class="${C === "error" ? "text-red-500" : "text-yellow-500"} font-light whitespace-pre-wrap">${E}</pre>`);
      return;
    }
    const L = e()[e().length - 1];
    L && L.content === E || (t((W) => [...W, {
      type: C,
      content: E
    }]), J());
  }, M = () => {
    s() && (V("message", "Processing..."), n()?.emit("exec", s()), i(""));
  };
  Tn(() => {
    J();
    const C = wt("http://localhost:5000/terminal", {
      transports: ["websocket"],
      withCredentials: !0
    });
    r(C), C.on("connect", () => {
      a("Connected"), O && (O.disabled = !1);
    }), C.on("connect_error", (E) => {
      console.error("Connection Error:", E.message), O && (O.disabled = !0), a("Disconnected");
    }), C.on("osinfo", (E) => {
      u(E.homedir);
    }), C.on("outputMessage", (E) => {
      V("outputMessage", E);
    }), C.on("output", (E) => V("message", E)), C.on("cwdInfo", (E) => V("message", E)), C.on("error", (E) => V("error", `${E}`)), C.on("close", (E) => V("message", `
${E}
`)), C.on("prompt", ({
      cwd: E,
      command: L
    }) => {
      let W = E;
      const G = l();
      if (G && E.startsWith(G))
        W = E.replace(G, "~");
      else {
        const X = E.split("/");
        W = X[X.length - 1] || "/";
      }
      c(W), V("command", `${E} $ ${L}`);
    }), xe(() => C.disconnect());
  });
  const m = (C) => {
    i(""), h(!1), V("message", `Selected: ${C}`);
  };
  return Be(() => {
    T.user()?.email || x("/login"), J();
  }), (() => {
    var C = Xc(), E = C.firstChild;
    E.firstChild;
    var L = E.nextSibling, W = L.firstChild, G = W.nextSibling, X = S;
    typeof X == "function" ? ke(X, E) : S = E, E.style.setProperty("scroll-behavior", "smooth"), U(E, P(Yn, {
      get each() {
        return e();
      },
      children: (H) => (() => {
        var Y = Zc();
        return U(Y, (() => {
          var b = Ot(() => H.type === "command");
          return () => b() ? `${o()} $ ${H.content.split(" $ ")[1]}` : H.content;
        })()), oe((b) => {
          var A = H.type === "command" ? "font-bold whitespace-pre-wrap text-yellow-400" : H.type === "error" ? "whitespace-pre-wrap text-red-400" : "whitespace-pre-wrap", v = H.type === "command" ? H.content.split(" $ ")[0] : "";
          return A !== b.e && Ve(Y, b.e = A), v !== b.t && te(Y, "title", b.t = v), b;
        }, {
          e: void 0,
          t: void 0
        }), Y;
      })()
    }), null), U(C, (() => {
      var H = Ot(() => !!(d() && g().length > 0));
      return () => H() && (() => {
        var Y = el(), b = Y.firstChild;
        return Y.style.setProperty("width", "200px"), U(b, P(Yn, {
          get each() {
            return g();
          },
          children: (A) => (() => {
            var v = tl();
            return v.$$click = () => m(A), U(v, A === "Switch to AI" ? nl() : A === "Documentation" ? rl() : A === "About" ? sl() : A === "Donate" ? il() : null, null), U(v, A, null), v;
          })()
        })), oe((A) => {
          var v = `${y().x}px`, j = `${y().y + 4}px`;
          return v !== A.e && ((A.e = v) != null ? Y.style.setProperty("left", v) : Y.style.removeProperty("left")), j !== A.t && ((A.t = j) != null ? Y.style.setProperty("top", j) : Y.style.removeProperty("top")), A;
        }, {
          e: void 0,
          t: void 0
        }), Y;
      })();
    })(), L), G.$$keydown = (H) => {
      H.key === "Enter" && (M(), h(!1));
    }, G.$$input = K;
    var se = O;
    return typeof se == "function" ? ke(se, G) : O = G, oe((H) => {
      var Y = `ml-4 ${f() === "Connected" ? "text-green-400" : "text-red-400"}`, b = `flex-1 dark:bg-netural-950 ${f() === "Connected" ? "text-green-400" : "text-red-400"} rounded-md px-1 text-sm focus:outline-none focus:ring-0`, A = `${f() === "Connected" ? "Type a command..." : f()}`;
      return Y !== H.e && Ve(W, H.e = Y), b !== H.t && Ve(G, H.t = b), A !== H.a && te(G, "placeholder", H.a = A), H;
    }, {
      e: void 0,
      t: void 0,
      a: void 0
    }), oe(() => G.value = s()), C;
  })();
}
Le(["input", "keydown", "click"]);
var cl = /* @__PURE__ */ q('<div class="flex min-h-screen items-center justify-center">');
function ll() {
  $n();
  const e = Ae();
  Dt();
  const t = Fe();
  return Be(() => {
    t.user()?.email || e("/login");
  }), cl();
}
var al = /* @__PURE__ */ q('<div class="flex min-h-screen items-center justify-center">');
function ul() {
  Ni(), Ae();
  const e = Fe();
  return Be(async () => {
    e.user()?.email || console.log(e.user());
  }), al();
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
const Ss = Object.freeze(
  {
    left: 0,
    top: 0,
    width: 16,
    height: 16
  }
), Lt = Object.freeze({
  rotate: 0,
  vFlip: !1,
  hFlip: !1
}), at = Object.freeze({
  ...Ss,
  ...Lt
}), _n = Object.freeze({
  ...at,
  body: "",
  hidden: !1
}), fl = Object.freeze({
  width: null,
  height: null
}), As = Object.freeze({
  // Dimensions
  ...fl,
  // Transformations
  ...Lt
});
function dl(e, t = 0) {
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
      let i = parseFloat(e.slice(0, e.length - n.length));
      return isNaN(i) ? 0 : (i = i / s, i % 1 === 0 ? r(i) : 0);
    }
  }
  return t;
}
const hl = /[\s,]+/;
function pl(e, t) {
  t.split(hl).forEach((n) => {
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
const Cs = {
  ...As,
  preserveAspectRatio: ""
};
function yr(e) {
  const t = {
    ...Cs
  }, n = (r, s) => e.getAttribute(r) || s;
  return t.width = n("width", null), t.height = n("height", null), t.rotate = dl(n("rotate", "")), pl(t, n("flip", "")), t.preserveAspectRatio = n("preserveAspectRatio", n("preserveaspectratio", "")), t;
}
function ml(e, t) {
  for (const n in Cs)
    if (e[n] !== t[n])
      return !0;
  return !1;
}
const Os = /^[a-z0-9]+(-[a-z0-9]+)*$/, ut = (e, t, n, r = "") => {
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
    return t && !Et(u) ? null : u;
  }
  const i = s[0], o = i.split("-");
  if (o.length > 1) {
    const c = {
      provider: r,
      prefix: o.shift(),
      name: o.join("-")
    };
    return t && !Et(c) ? null : c;
  }
  if (n && r === "") {
    const c = {
      provider: r,
      prefix: "",
      name: i
    };
    return t && !Et(c, n) ? null : c;
  }
  return null;
}, Et = (e, t) => e ? !!// Check prefix: cannot be empty, unless allowSimpleName is enabled
// Check name: cannot be empty
((t && e.prefix === "" || e.prefix) && e.name) : !1;
function gl(e, t) {
  const n = {};
  !e.hFlip != !t.hFlip && (n.hFlip = !0), !e.vFlip != !t.vFlip && (n.vFlip = !0);
  const r = ((e.rotate || 0) + (t.rotate || 0)) % 4;
  return r && (n.rotate = r), n;
}
function br(e, t) {
  const n = gl(e, t);
  for (const r in _n)
    r in Lt ? r in e && !(r in n) && (n[r] = Lt[r]) : r in t ? n[r] = t[r] : r in e && (n[r] = e[r]);
  return n;
}
function yl(e, t) {
  const n = e.icons, r = e.aliases || /* @__PURE__ */ Object.create(null), s = /* @__PURE__ */ Object.create(null);
  function i(o) {
    if (n[o])
      return s[o] = [];
    if (!(o in s)) {
      s[o] = null;
      const c = r[o] && r[o].parent, l = c && i(c);
      l && (s[o] = [c].concat(l));
    }
    return s[o];
  }
  return Object.keys(n).concat(Object.keys(r)).forEach(i), s;
}
function bl(e, t, n) {
  const r = e.icons, s = e.aliases || /* @__PURE__ */ Object.create(null);
  let i = {};
  function o(c) {
    i = br(
      r[c] || s[c],
      i
    );
  }
  return o(t), n.forEach(o), br(e, i);
}
function Ts(e, t) {
  const n = [];
  if (typeof e != "object" || typeof e.icons != "object")
    return n;
  e.not_found instanceof Array && e.not_found.forEach((s) => {
    t(s, null), n.push(s);
  });
  const r = yl(e);
  for (const s in r) {
    const i = r[s];
    i && (t(s, bl(e, s, i)), n.push(s));
  }
  return n;
}
const vl = {
  provider: "",
  aliases: {},
  not_found: {},
  ...Ss
};
function sn(e, t) {
  for (const n in t)
    if (n in e && typeof e[n] != typeof t[n])
      return !1;
  return !0;
}
function Bs(e) {
  if (typeof e != "object" || e === null)
    return null;
  const t = e;
  if (typeof t.prefix != "string" || !e.icons || typeof e.icons != "object" || !sn(e, vl))
    return null;
  const n = t.icons;
  for (const s in n) {
    const i = n[s];
    if (
      // Name cannot be empty
      !s || // Must have body
      typeof i.body != "string" || // Check other props
      !sn(
        i,
        _n
      )
    )
      return null;
  }
  const r = t.aliases || /* @__PURE__ */ Object.create(null);
  for (const s in r) {
    const i = r[s], o = i.parent;
    if (
      // Name cannot be empty
      !s || // Parent must be set and point to existing icon
      typeof o != "string" || !n[o] && !r[o] || // Check other props
      !sn(
        i,
        _n
      )
    )
      return null;
  }
  return t;
}
const Rt = /* @__PURE__ */ Object.create(null);
function wl(e, t) {
  return {
    provider: e,
    prefix: t,
    icons: /* @__PURE__ */ Object.create(null),
    missing: /* @__PURE__ */ new Set()
  };
}
function Se(e, t) {
  const n = Rt[e] || (Rt[e] = /* @__PURE__ */ Object.create(null));
  return n[t] || (n[t] = wl(e, t));
}
function Ps(e, t) {
  return Bs(t) ? Ts(t, (n, r) => {
    r ? e.icons[n] = r : e.missing.add(n);
  }) : [];
}
function El(e, t, n) {
  try {
    if (typeof n.body == "string")
      return e.icons[t] = { ...n }, !0;
  } catch {
  }
  return !1;
}
function xl(e, t) {
  let n = [];
  return (typeof e == "string" ? [e] : Object.keys(Rt)).forEach((s) => {
    (typeof s == "string" && typeof t == "string" ? [t] : Object.keys(Rt[s] || {})).forEach((o) => {
      const c = Se(s, o);
      n = n.concat(
        Object.keys(c.icons).map(
          (l) => (s !== "" ? "@" + s + ":" : "") + o + ":" + l
        )
      );
    });
  }), n;
}
let ot = !1;
function Ls(e) {
  return typeof e == "boolean" && (ot = e), ot;
}
function ct(e) {
  const t = typeof e == "string" ? ut(e, !0, ot) : e;
  if (t) {
    const n = Se(t.provider, t.prefix), r = t.name;
    return n.icons[r] || (n.missing.has(r) ? null : void 0);
  }
}
function Rs(e, t) {
  const n = ut(e, !0, ot);
  if (!n)
    return !1;
  const r = Se(n.provider, n.prefix);
  return t ? El(r, n.name, t) : (r.missing.add(n.name), !0);
}
function vr(e, t) {
  if (typeof e != "object")
    return !1;
  if (typeof t != "string" && (t = e.provider || ""), ot && !t && !e.prefix) {
    let s = !1;
    return Bs(e) && (e.prefix = "", Ts(e, (i, o) => {
      Rs(i, o) && (s = !0);
    })), s;
  }
  const n = e.prefix;
  if (!Et({
    prefix: n,
    name: "a"
  }))
    return !1;
  const r = Se(t, n);
  return !!Ps(r, e);
}
function _l(e) {
  return !!ct(e);
}
function kl(e) {
  const t = ct(e);
  return t && {
    ...at,
    ...t
  };
}
function Sl(e) {
  const t = {
    loaded: [],
    missing: [],
    pending: []
  }, n = /* @__PURE__ */ Object.create(null);
  e.sort((s, i) => s.provider !== i.provider ? s.provider.localeCompare(i.provider) : s.prefix !== i.prefix ? s.prefix.localeCompare(i.prefix) : s.name.localeCompare(i.name));
  let r = {
    provider: "",
    prefix: "",
    name: ""
  };
  return e.forEach((s) => {
    if (r.name === s.name && r.prefix === s.prefix && r.provider === s.provider)
      return;
    r = s;
    const i = s.provider, o = s.prefix, c = s.name, l = n[i] || (n[i] = /* @__PURE__ */ Object.create(null)), u = l[o] || (l[o] = Se(i, o));
    let f;
    c in u.icons ? f = t.loaded : o === "" || u.missing.has(c) ? f = t.missing : f = t.pending;
    const a = {
      provider: i,
      prefix: o,
      name: c
    };
    f.push(a);
  }), t;
}
function Is(e, t) {
  e.forEach((n) => {
    const r = n.loaderCallbacks;
    r && (n.loaderCallbacks = r.filter((s) => s.id !== t));
  });
}
function Al(e) {
  e.pendingCallbacksFlag || (e.pendingCallbacksFlag = !0, setTimeout(() => {
    e.pendingCallbacksFlag = !1;
    const t = e.loaderCallbacks ? e.loaderCallbacks.slice(0) : [];
    if (!t.length)
      return;
    let n = !1;
    const r = e.provider, s = e.prefix;
    t.forEach((i) => {
      const o = i.icons, c = o.pending.length;
      o.pending = o.pending.filter((l) => {
        if (l.prefix !== s)
          return !0;
        const u = l.name;
        if (e.icons[u])
          o.loaded.push({
            provider: r,
            prefix: s,
            name: u
          });
        else if (e.missing.has(u))
          o.missing.push({
            provider: r,
            prefix: s,
            name: u
          });
        else
          return n = !0, !0;
        return !1;
      }), o.pending.length !== c && (n || Is([e], i.id), i.callback(
        o.loaded.slice(0),
        o.missing.slice(0),
        o.pending.slice(0),
        i.abort
      ));
    });
  }));
}
let Cl = 0;
function Ol(e, t, n) {
  const r = Cl++, s = Is.bind(null, n, r);
  if (!t.pending.length)
    return s;
  const i = {
    id: r,
    icons: t,
    callback: e,
    abort: s
  };
  return n.forEach((o) => {
    (o.loaderCallbacks || (o.loaderCallbacks = [])).push(i);
  }), s;
}
const kn = /* @__PURE__ */ Object.create(null);
function wr(e, t) {
  kn[e] = t;
}
function Sn(e) {
  return kn[e] || kn[""];
}
function Tl(e, t = !0, n = !1) {
  const r = [];
  return e.forEach((s) => {
    const i = typeof s == "string" ? ut(s, t, n) : s;
    i && r.push(i);
  }), r;
}
var Bl = {
  resources: [],
  index: 0,
  timeout: 2e3,
  rotate: 750,
  random: !1,
  dataAfterTimeout: !1
};
function Pl(e, t, n, r) {
  const s = e.resources.length, i = e.random ? Math.floor(Math.random() * s) : e.index;
  let o;
  if (e.random) {
    let k = e.resources.slice(0);
    for (o = []; k.length > 1; ) {
      const Q = Math.floor(Math.random() * k.length);
      o.push(k[Q]), k = k.slice(0, Q).concat(k.slice(Q + 1));
    }
    o = o.concat(k);
  } else
    o = e.resources.slice(i).concat(e.resources.slice(0, i));
  const c = Date.now();
  let l = "pending", u = 0, f, a = null, d = [], h = [];
  typeof r == "function" && h.push(r);
  function y() {
    a && (clearTimeout(a), a = null);
  }
  function p() {
    l === "pending" && (l = "aborted"), y(), d.forEach((k) => {
      k.status === "pending" && (k.status = "aborted");
    }), d = [];
  }
  function g(k, Q) {
    Q && (h = []), typeof k == "function" && h.push(k);
  }
  function w() {
    return {
      startTime: c,
      payload: t,
      status: l,
      queriesSent: u,
      queriesPending: d.length,
      subscribe: g,
      abort: p
    };
  }
  function x() {
    l = "failed", h.forEach((k) => {
      k(void 0, f);
    });
  }
  function T() {
    d.forEach((k) => {
      k.status === "pending" && (k.status = "aborted");
    }), d = [];
  }
  function S(k, Q, K) {
    const J = Q !== "success";
    switch (d = d.filter((V) => V !== k), l) {
      case "pending":
        break;
      case "failed":
        if (J || !e.dataAfterTimeout)
          return;
        break;
      default:
        return;
    }
    if (Q === "abort") {
      f = K, x();
      return;
    }
    if (J) {
      f = K, d.length || (o.length ? O() : x());
      return;
    }
    if (y(), T(), !e.random) {
      const V = e.resources.indexOf(k.resource);
      V !== -1 && V !== e.index && (e.index = V);
    }
    l = "completed", h.forEach((V) => {
      V(K);
    });
  }
  function O() {
    if (l !== "pending")
      return;
    y();
    const k = o.shift();
    if (k === void 0) {
      if (d.length) {
        a = setTimeout(() => {
          y(), l === "pending" && (T(), x());
        }, e.timeout);
        return;
      }
      x();
      return;
    }
    const Q = {
      status: "pending",
      resource: k,
      callback: (K, J) => {
        S(Q, K, J);
      }
    };
    d.push(Q), u++, a = setTimeout(O, e.rotate), n(k, t, Q.callback);
  }
  return setTimeout(O), w;
}
function $s(e) {
  const t = {
    ...Bl,
    ...e
  };
  let n = [];
  function r() {
    n = n.filter((c) => c().status === "pending");
  }
  function s(c, l, u) {
    const f = Pl(
      t,
      c,
      l,
      (a, d) => {
        r(), u && u(a, d);
      }
    );
    return n.push(f), f;
  }
  function i(c) {
    return n.find((l) => c(l)) || null;
  }
  return {
    query: s,
    find: i,
    setIndex: (c) => {
      t.index = c;
    },
    getIndex: () => t.index,
    cleanup: r
  };
}
function Kn(e) {
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
const Kt = /* @__PURE__ */ Object.create(null), Ye = [
  "https://api.simplesvg.com",
  "https://api.unisvg.com"
], xt = [];
for (; Ye.length > 0; )
  Ye.length === 1 || Math.random() > 0.5 ? xt.push(Ye.shift()) : xt.push(Ye.pop());
Kt[""] = Kn({
  resources: ["https://api.iconify.design"].concat(xt)
});
function Er(e, t) {
  const n = Kn(t);
  return n === null ? !1 : (Kt[e] = n, !0);
}
function Wt(e) {
  return Kt[e];
}
function Ll() {
  return Object.keys(Kt);
}
function xr() {
}
const on = /* @__PURE__ */ Object.create(null);
function Rl(e) {
  if (!on[e]) {
    const t = Wt(e);
    if (!t)
      return;
    const n = $s(t), r = {
      config: t,
      redundancy: n
    };
    on[e] = r;
  }
  return on[e];
}
function Ms(e, t, n) {
  let r, s;
  if (typeof e == "string") {
    const i = Sn(e);
    if (!i)
      return n(void 0, 424), xr;
    s = i.send;
    const o = Rl(e);
    o && (r = o.redundancy);
  } else {
    const i = Kn(e);
    if (i) {
      r = $s(i);
      const o = e.resources ? e.resources[0] : "", c = Sn(o);
      c && (s = c.send);
    }
  }
  return !r || !s ? (n(void 0, 424), xr) : r.query(t, s, n)().abort;
}
function _r() {
}
function Il(e) {
  e.iconsLoaderFlag || (e.iconsLoaderFlag = !0, setTimeout(() => {
    e.iconsLoaderFlag = !1, Al(e);
  }));
}
function $l(e) {
  const t = [], n = [];
  return e.forEach((r) => {
    (r.match(Os) ? t : n).push(r);
  }), {
    valid: t,
    invalid: n
  };
}
function Xe(e, t, n) {
  function r() {
    const s = e.pendingIcons;
    t.forEach((i) => {
      s && s.delete(i), e.icons[i] || e.missing.add(i);
    });
  }
  if (n && typeof n == "object")
    try {
      if (!Ps(e, n).length) {
        r();
        return;
      }
    } catch (s) {
      console.error(s);
    }
  r(), Il(e);
}
function kr(e, t) {
  e instanceof Promise ? e.then((n) => {
    t(n);
  }).catch(() => {
    t(null);
  }) : t(e);
}
function Ml(e, t) {
  e.iconsToLoad ? e.iconsToLoad = e.iconsToLoad.concat(t).sort() : e.iconsToLoad = t, e.iconsQueueFlag || (e.iconsQueueFlag = !0, setTimeout(() => {
    e.iconsQueueFlag = !1;
    const { provider: n, prefix: r } = e, s = e.iconsToLoad;
    if (delete e.iconsToLoad, !s || !s.length)
      return;
    const i = e.loadIcon;
    if (e.loadIcons && (s.length > 1 || !i)) {
      kr(
        e.loadIcons(s, r, n),
        (f) => {
          Xe(e, s, f);
        }
      );
      return;
    }
    if (i) {
      s.forEach((f) => {
        const a = i(f, r, n);
        kr(a, (d) => {
          const h = d ? {
            prefix: r,
            icons: {
              [f]: d
            }
          } : null;
          Xe(e, [f], h);
        });
      });
      return;
    }
    const { valid: o, invalid: c } = $l(s);
    if (c.length && Xe(e, c, null), !o.length)
      return;
    const l = r.match(Os) ? Sn(n) : null;
    if (!l) {
      Xe(e, o, null);
      return;
    }
    l.prepare(n, r, o).forEach((f) => {
      Ms(n, f, (a) => {
        Xe(e, f.icons, a);
      });
    });
  }));
}
const Wn = (e, t) => {
  const n = Tl(e, !0, Ls()), r = Sl(n);
  if (!r.pending.length) {
    let l = !0;
    return t && setTimeout(() => {
      l && t(
        r.loaded,
        r.missing,
        r.pending,
        _r
      );
    }), () => {
      l = !1;
    };
  }
  const s = /* @__PURE__ */ Object.create(null), i = [];
  let o, c;
  return r.pending.forEach((l) => {
    const { provider: u, prefix: f } = l;
    if (f === c && u === o)
      return;
    o = u, c = f, i.push(Se(u, f));
    const a = s[u] || (s[u] = /* @__PURE__ */ Object.create(null));
    a[f] || (a[f] = []);
  }), r.pending.forEach((l) => {
    const { provider: u, prefix: f, name: a } = l, d = Se(u, f), h = d.pendingIcons || (d.pendingIcons = /* @__PURE__ */ new Set());
    h.has(a) || (h.add(a), s[u][f].push(a));
  }), i.forEach((l) => {
    const u = s[l.provider][l.prefix];
    u.length && Ml(l, u);
  }), t ? Ol(t, r, i) : _r;
}, Nl = (e) => new Promise((t, n) => {
  const r = typeof e == "string" ? ut(e, !0) : e;
  if (!r) {
    n(e);
    return;
  }
  Wn([r || e], (s) => {
    if (s.length && r) {
      const i = ct(r);
      if (i) {
        t({
          ...at,
          ...i
        });
        return;
      }
    }
    n(e);
  });
});
function Sr(e) {
  try {
    const t = typeof e == "string" ? JSON.parse(e) : e;
    if (typeof t.body == "string")
      return {
        ...t
      };
  } catch {
  }
}
function Fl(e, t) {
  if (typeof e == "object")
    return {
      data: Sr(e),
      value: e
    };
  if (typeof e != "string")
    return {
      value: e
    };
  if (e.includes("{")) {
    const i = Sr(e);
    if (i)
      return {
        data: i,
        value: e
      };
  }
  const n = ut(e, !0, !0);
  if (!n)
    return {
      value: e
    };
  const r = ct(n);
  if (r !== void 0 || !n.prefix)
    return {
      value: e,
      name: n,
      data: r
      // could be 'null' -> icon is missing
    };
  const s = Wn([n], () => t(e, n, ct(n)));
  return {
    value: e,
    name: n,
    loading: s
  };
}
let Ns = !1;
try {
  Ns = navigator.vendor.indexOf("Apple") === 0;
} catch {
}
function Dl(e, t) {
  switch (t) {
    // Force mode
    case "svg":
    case "bg":
    case "mask":
      return t;
  }
  return t !== "style" && (Ns || e.indexOf("<a") === -1) ? "svg" : e.indexOf("currentColor") === -1 ? "bg" : "mask";
}
const ql = /(-?[0-9.]*[0-9]+[0-9.]*)/g, jl = /^-?[0-9.]*[0-9]+[0-9.]*$/g;
function An(e, t, n) {
  if (t === 1)
    return e;
  if (n = n || 100, typeof e == "number")
    return Math.ceil(e * t * n) / n;
  if (typeof e != "string")
    return e;
  const r = e.split(ql);
  if (r === null || !r.length)
    return e;
  const s = [];
  let i = r.shift(), o = jl.test(i);
  for (; ; ) {
    if (o) {
      const c = parseFloat(i);
      isNaN(c) ? s.push(i) : s.push(Math.ceil(c * t * n) / n);
    } else
      s.push(i);
    if (i = r.shift(), i === void 0)
      return s.join("");
    o = !o;
  }
}
function Ul(e, t = "defs") {
  let n = "";
  const r = e.indexOf("<" + t);
  for (; r >= 0; ) {
    const s = e.indexOf(">", r), i = e.indexOf("</" + t);
    if (s === -1 || i === -1)
      break;
    const o = e.indexOf(">", i);
    if (o === -1)
      break;
    n += e.slice(s + 1, i).trim(), e = e.slice(0, r).trim() + e.slice(o + 1);
  }
  return {
    defs: n,
    content: e
  };
}
function Vl(e, t) {
  return e ? "<defs>" + e + "</defs>" + t : t;
}
function Kl(e, t, n) {
  const r = Ul(e);
  return Vl(r.defs, t + r.content + n);
}
const Wl = (e) => e === "unset" || e === "undefined" || e === "none";
function Fs(e, t) {
  const n = {
    ...at,
    ...e
  }, r = {
    ...As,
    ...t
  }, s = {
    left: n.left,
    top: n.top,
    width: n.width,
    height: n.height
  };
  let i = n.body;
  [n, r].forEach((p) => {
    const g = [], w = p.hFlip, x = p.vFlip;
    let T = p.rotate;
    w ? x ? T += 2 : (g.push(
      "translate(" + (s.width + s.left).toString() + " " + (0 - s.top).toString() + ")"
    ), g.push("scale(-1 1)"), s.top = s.left = 0) : x && (g.push(
      "translate(" + (0 - s.left).toString() + " " + (s.height + s.top).toString() + ")"
    ), g.push("scale(1 -1)"), s.top = s.left = 0);
    let S;
    switch (T < 0 && (T -= Math.floor(T / 4) * 4), T = T % 4, T) {
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
    T % 2 === 1 && (s.left !== s.top && (S = s.left, s.left = s.top, s.top = S), s.width !== s.height && (S = s.width, s.width = s.height, s.height = S)), g.length && (i = Kl(
      i,
      '<g transform="' + g.join(" ") + '">',
      "</g>"
    ));
  });
  const o = r.width, c = r.height, l = s.width, u = s.height;
  let f, a;
  o === null ? (a = c === null ? "1em" : c === "auto" ? u : c, f = An(a, l / u)) : (f = o === "auto" ? l : o, a = c === null ? An(f, u / l) : c === "auto" ? u : c);
  const d = {}, h = (p, g) => {
    Wl(g) || (d[p] = g.toString());
  };
  h("width", f), h("height", a);
  const y = [s.left, s.top, l, u];
  return d.viewBox = y.join(" "), {
    attributes: d,
    viewBox: y,
    body: i
  };
}
function Hn(e, t) {
  let n = e.indexOf("xlink:") === -1 ? "" : ' xmlns:xlink="http://www.w3.org/1999/xlink"';
  for (const r in t)
    n += " " + r + '="' + t[r] + '"';
  return '<svg xmlns="http://www.w3.org/2000/svg"' + n + ">" + e + "</svg>";
}
function Hl(e) {
  return e.replace(/"/g, "'").replace(/%/g, "%25").replace(/#/g, "%23").replace(/</g, "%3C").replace(/>/g, "%3E").replace(/\s+/g, " ");
}
function zl(e) {
  return "data:image/svg+xml," + Hl(e);
}
function Ds(e) {
  return 'url("' + zl(e) + '")';
}
const Ql = () => {
  let e;
  try {
    if (e = fetch, typeof e == "function")
      return e;
  } catch {
  }
};
let It = Ql();
function Gl(e) {
  It = e;
}
function Jl() {
  return It;
}
function Yl(e, t) {
  const n = Wt(e);
  if (!n)
    return 0;
  let r;
  if (!n.maxURL)
    r = 0;
  else {
    let s = 0;
    n.resources.forEach((o) => {
      s = Math.max(s, o.length);
    });
    const i = t + ".json?icons=";
    r = n.maxURL - s - n.path.length - i.length;
  }
  return r;
}
function Xl(e) {
  return e === 404;
}
const Zl = (e, t, n) => {
  const r = [], s = Yl(e, t), i = "icons";
  let o = {
    type: i,
    provider: e,
    prefix: t,
    icons: []
  }, c = 0;
  return n.forEach((l, u) => {
    c += l.length + 1, c >= s && u > 0 && (r.push(o), o = {
      type: i,
      provider: e,
      prefix: t,
      icons: []
    }, c = l.length), o.icons.push(l);
  }), r.push(o), r;
};
function ea(e) {
  if (typeof e == "string") {
    const t = Wt(e);
    if (t)
      return t.path;
  }
  return "/";
}
const ta = (e, t, n) => {
  if (!It) {
    n("abort", 424);
    return;
  }
  let r = ea(t.provider);
  switch (t.type) {
    case "icons": {
      const i = t.prefix, c = t.icons.join(","), l = new URLSearchParams({
        icons: c
      });
      r += i + ".json?" + l.toString();
      break;
    }
    case "custom": {
      const i = t.uri;
      r += i.slice(0, 1) === "/" ? i.slice(1) : i;
      break;
    }
    default:
      n("abort", 400);
      return;
  }
  let s = 503;
  It(e + r).then((i) => {
    const o = i.status;
    if (o !== 200) {
      setTimeout(() => {
        n(Xl(o) ? "abort" : "next", o);
      });
      return;
    }
    return s = 501, i.json();
  }).then((i) => {
    if (typeof i != "object" || i === null) {
      setTimeout(() => {
        i === 404 ? n("abort", i) : n("next", s);
      });
      return;
    }
    setTimeout(() => {
      n("success", i);
    });
  }).catch(() => {
    n("next", s);
  });
}, na = {
  prepare: Zl,
  send: ta
};
function ra(e, t, n) {
  Se(n || "", t).loadIcons = e;
}
function sa(e, t, n) {
  Se(n || "", t).loadIcon = e;
}
const cn = "data-style";
let qs = "";
function ia(e) {
  qs = e;
}
function Ar(e, t) {
  let n = Array.from(e.childNodes).find((r) => r.hasAttribute && r.hasAttribute(cn));
  n || (n = document.createElement("style"), n.setAttribute(cn, cn), e.appendChild(n)), n.textContent = ":host{display:inline-block;vertical-align:" + (t ? "-0.125em" : "0") + "}span,svg{display:block;margin:auto}" + qs;
}
function js() {
  wr("", na), Ls(!0);
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
          !vr(s)) && console.error(r);
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
            const i = n[r];
            if (typeof i != "object" || !i || i.resources === void 0)
              continue;
            Er(r, i) || console.error(s);
          } catch {
            console.error(s);
          }
        }
    }
  }
  return {
    iconLoaded: _l,
    getIcon: kl,
    listIcons: xl,
    addIcon: Rs,
    addCollection: vr,
    calculateSize: An,
    buildIcon: Fs,
    iconToHTML: Hn,
    svgToURL: Ds,
    loadIcons: Wn,
    loadIcon: Nl,
    addAPIProvider: Er,
    setCustomIconLoader: sa,
    setCustomIconsLoader: ra,
    appendCustomStyle: ia,
    _api: {
      getAPIConfig: Wt,
      setAPIModule: wr,
      sendAPIQuery: Ms,
      setFetch: Gl,
      getFetch: Jl,
      listAPIProviders: Ll
    }
  };
}
const Cn = {
  "background-color": "currentColor"
}, Us = {
  "background-color": "transparent"
}, Cr = {
  image: "var(--svg)",
  repeat: "no-repeat",
  size: "100% 100%"
}, Or = {
  "-webkit-mask": Cn,
  mask: Cn,
  background: Us
};
for (const e in Or) {
  const t = Or[e];
  for (const n in Cr)
    t[e + "-" + n] = Cr[n];
}
function Tr(e) {
  return e ? e + (e.match(/^[-0-9.]+$/) ? "px" : "") : "inherit";
}
function oa(e, t, n) {
  const r = document.createElement("span");
  let s = e.body;
  s.indexOf("<a") !== -1 && (s += "<!-- " + Date.now() + " -->");
  const i = e.attributes, o = Hn(s, {
    ...i,
    width: t.width + "",
    height: t.height + ""
  }), c = Ds(o), l = r.style, u = {
    "--svg": c,
    width: Tr(i.width),
    height: Tr(i.height),
    ...n ? Cn : Us
  };
  for (const f in u)
    l.setProperty(f, u[f]);
  return r;
}
let rt;
function ca() {
  try {
    rt = window.trustedTypes.createPolicy("iconify", {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      createHTML: (e) => e
    });
  } catch {
    rt = null;
  }
}
function la(e) {
  return rt === void 0 && ca(), rt ? rt.createHTML(e) : e;
}
function aa(e) {
  const t = document.createElement("span"), n = e.attributes;
  let r = "";
  n.width || (r = "width: inherit;"), n.height || (r += "height: inherit;"), r && (n.style = r);
  const s = Hn(e.body, n);
  return t.innerHTML = la(s), t.firstChild;
}
function On(e) {
  return Array.from(e.childNodes).find((t) => {
    const n = t.tagName && t.tagName.toUpperCase();
    return n === "SPAN" || n === "SVG";
  });
}
function Br(e, t) {
  const n = t.icon.data, r = t.customisations, s = Fs(n, r);
  r.preserveAspectRatio && (s.attributes.preserveAspectRatio = r.preserveAspectRatio);
  const i = t.renderedMode;
  let o;
  switch (i) {
    case "svg":
      o = aa(s);
      break;
    default:
      o = oa(s, {
        ...at,
        ...n
      }, i === "mask");
  }
  const c = On(e);
  c ? o.tagName === "SPAN" && c.tagName === o.tagName ? c.setAttribute("style", o.getAttribute("style")) : e.replaceChild(o, c) : e.appendChild(o);
}
function Pr(e, t, n) {
  const r = n && (n.rendered ? n : n.lastRender);
  return {
    rendered: !1,
    inline: t,
    icon: e,
    lastRender: r
  };
}
function ua(e = "iconify-icon") {
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
  ], i = class extends n {
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
      Ar(c, l), this._state = Pr({
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
          l !== u.inline && (u.inline = l, Ar(this._shadowRoot, l));
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
        Br(l, c);
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
      const u = this.getAttribute("mode"), f = yr(this);
      (c.attrMode !== u || ml(c.customisations, f) || !On(this._shadowRoot)) && this._renderIcon(c.icon, f, u);
    }
    /**
     * Icon value has changed
     */
    _iconChanged(c) {
      const l = Fl(c, (u, f, a) => {
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
      l.data ? this._gotIconData(l) : this._state = Pr(l, this._state.inline, this._state);
    }
    /**
     * Force render icon on state change
     */
    _forceRender() {
      if (!this._visible) {
        const c = On(this._shadowRoot);
        c && this._shadowRoot.removeChild(c);
        return;
      }
      this._queueCheck();
    }
    /**
     * Got new icon data, icon is ready to (re)render
     */
    _gotIconData(c) {
      this._checkQueued = !1, this._renderIcon(c, yr(this), this.getAttribute("mode"));
    }
    /**
     * Re-render based on icon data
     */
    _renderIcon(c, l, u) {
      const f = Dl(c.data.body, u), a = this._state.inline;
      Br(this._shadowRoot, this._state = {
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
    c in i.prototype || Object.defineProperty(i.prototype, c, {
      get: function() {
        return this.getAttribute(c);
      },
      set: function(l) {
        l !== null ? this.setAttribute(c, l) : this.removeAttribute(c);
      }
    });
  });
  const o = js();
  for (const c in o)
    i[c] = i.prototype[c] = o[c];
  return t.define(e, i), i;
}
const fa = ua() || js(), { iconLoaded: Ba, getIcon: Pa, listIcons: La, addIcon: Ra, addCollection: Ia, calculateSize: $a, buildIcon: Ma, iconToHTML: Na, svgToURL: Fa, loadIcons: Da, loadIcon: qa, setCustomIconLoader: ja, setCustomIconsLoader: Ua, addAPIProvider: Va, _api: Ka } = fa;
var da = /* @__PURE__ */ q("<iconify-icon>", !0, !1, !1);
function Vs(e) {
  let {
    icon: t,
    mode: n,
    inline: r,
    rotate: s,
    flip: i,
    width: o,
    height: c,
    preserveAspectRatio: l,
    noobserver: u
  } = e;
  return typeof t == "object" && (t = JSON.stringify(t)), // @ts-ignore
  (() => {
    var f = da();
    return te(f, "icon", t), te(f, "mode", n), te(f, "inline", r), te(f, "rotate", s), te(f, "flip", i), te(f, "width", o), te(f, "height", c), te(f, "preserveaspectratio", l), te(f, "noobserver", u), jr(f, e, !1, !1), f._$owner = Mt(), f;
  })();
}
var ha = /* @__PURE__ */ q('<button class="w-full flex items-center gap-2 justify-center p-3 text-white bg-neutral-900 rounded-md hover:bg-neutral-800 mt-4"> Sign in with Google');
const pa = "http://localhost:5000/api/auth/google/callback";
function ma() {
  const [e, t] = I("");
  return Tn(() => {
    t(`${pa}`);
  }), (() => {
    var n = ha(), r = n.firstChild;
    return n.$$click = () => e() && (window.location.href = e()), U(n, P(Vs, {
      icon: "flat-color-icons:google",
      width: "20",
      height: "20"
    }), r), n;
  })();
}
Le(["click"]);
var ga = /* @__PURE__ */ q('<button class="w-full flex gap-2 items-center justify-center p-3 text-white bg-gray-700 rounded-md hover:bg-gray-600 mt-4"> Sign in with Github');
const ya = "http://localhost:5000/api/auth/github/callback";
function ba() {
  const [e, t] = I("");
  return Tn(() => {
    t(`${ya}`);
  }), (() => {
    var n = ga(), r = n.firstChild;
    return n.$$click = () => e() && (window.location.href = e()), U(n, P(Vs, {
      icon: "mdi:github",
      width: "24",
      class: "text-gray-900",
      height: "24"
    }), r), n;
  })();
}
Le(["click"]);
var va = /* @__PURE__ */ q('<div class="bg-solid-darkbg fixed inset-0 flex items-center justify-center"><svg class="m-auto h-12 w-12 animate-spin text-white"xmlns=http://www.w3.org/2000/svg fill=none viewBox="0 0 24 24"><circle class=opacity-25 cx=12 cy=12 r=10 stroke=currentColor stroke-width=4></circle><path class=opacity-75 fill=currentColor d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">'), wa = /* @__PURE__ */ q('<div class="bg-white dark:bg-neutral-900 h-screen w-full"><div class="flex min-h-screen items-center justify-center"><div class="w-full max-w-md rounded-lg bg-neutral-950 p-8 shadow-lg"><h2 class="text-center text-2xl font-bold text-white">Welcome Back 👋</h2><form class=space-y-4><div><label class="block text-gray-400">Username</label><input type=text placeholder="Enter username"class="mt-1 w-full rounded-md border border-neutral-600 bg-neutral-700 p-3 text-white placeholder-neutral-400 focus:ring-2 focus:ring-blue-500"></div><div><label class="block text-gray-400">Password</label><input type=password placeholder=•••••••• class="mt-1 w-full rounded-md border border-neutral-600 bg-neutral-700 p-3 text-white placeholder-neutral-400 focus:ring-2 focus:ring-blue-500"></div><button type=submit class="w-full rounded-md bg-blue-600 p-3 text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400">Sign In'), Ea = /* @__PURE__ */ q('<p class="text-center text-sm text-red-400">'), xa = /* @__PURE__ */ q('<div class="dark:bg-solid-darkbg fixed inset-0 flex items-center justify-center">');
const _a = () => va(), ka = () => {
  const [e, t] = I(""), [n, r] = I(""), [s, i] = I(""), [o, c] = I(!1), l = Ae();
  Fe();
  const u = async (f) => {
    f.preventDefault(), i(""), c(!0);
    try {
      const a = await fetch(`${Ke}/auth/login`, {
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
        throw i(h || a.statusText), new Error(h || a.statusText);
      }
      const d = await a.json();
      if (d)
        localStorage.setItem("token", d.accessToken), location.reload(), l("/dashboard");
      else
        throw new Error("AccessToken not found in response");
    } catch (a) {
      i(a.message || "Login failed");
    } finally {
      c(!1);
    }
  };
  return P(Oe, {
    get when() {
      return !o();
    },
    get fallback() {
      return P(_a, {});
    },
    get children() {
      var f = wa(), a = f.firstChild, d = a.firstChild, h = d.firstChild, y = h.nextSibling, p = y.firstChild, g = p.firstChild, w = g.nextSibling, x = p.nextSibling, T = x.firstChild, S = T.nextSibling;
      return U(d, (() => {
        var O = Ot(() => !!s());
        return () => O() && (() => {
          var k = Ea();
          return U(k, s), k;
        })();
      })(), y), y.addEventListener("submit", u), w.$$input = (O) => t(O.currentTarget.value), S.$$input = (O) => r(O.currentTarget.value), U(d, P(ma, {}), null), U(d, P(ba, {}), null), oe(() => w.value = e()), oe(() => S.value = n()), f;
    }
  });
}, Sa = () => {
  const e = Ae();
  localStorage.getItem("user");
  const t = Fe();
  return Be(() => {
    t.user()?.email && e("/dashboard");
  }), (() => {
    var n = xa();
    return U(n, P(ka, {})), n;
  })();
};
Le(["input"]);
const Aa = () => P(Zi, {
  root: (t) => P(to, {
    get children() {
      return P(ui, {
        get children() {
          return t.children;
        }
      });
    }
  }),
  get children() {
    return [P(dt, {
      path: "/",
      component: () => P(en, {
        isAuthenticated: !1,
        get children() {
          return P(ul, {});
        }
      })
    }), P(dt, {
      path: "/dashboard",
      component: () => P(en, {
        isAuthenticated: !1,
        get children() {
          return P(ll, {});
        }
      })
    }), P(dt, {
      path: "/terminal",
      component: () => P(en, {
        isAuthenticated: !1,
        get children() {
          return P(ol, {});
        }
      })
    }), P(dt, {
      path: "/login",
      component: () => P(Sa, {})
    })];
  }
}), Ca = document.getElementById("root");
wi(() => P(Aa, {}), Ca);
