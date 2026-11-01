import * as k from "@wbc-ui/core";
import { WBC as g, clone as y, generalVal as W, excludeList as _ } from "@wbc-ui/core";
import { WBC as H } from "@wbc-ui/core";
import { h as b, defineComponent as B } from "vue";
import E from "js-cookie";
function x(t, a = {}) {
  var f, v, m;
  if (!t) return {};
  const e = ((m = (v = (f = t.$) == null ? void 0 : f.appContext) == null ? void 0 : v.config) == null ? void 0 : m.globalProperties) || {}, i = (n) => Object.prototype.hasOwnProperty.call(t, n) ? t[n] : e[n], o = i("$store") || {}, s = i("$route") || {}, r = i("$router"), d = t && Object.getPrototypeOf(t) || {}, u = a.language || {}, h = a.auth || {}, c = a.services || {}, l = () => typeof u.get == "function" ? u.get(t) : o.state && o.state.lg || "en";
  return {
    // ── Ecosystem-global (same referents as the engine) ──
    _store: o,
    _router: r,
    _routes: r && r.options && r.options.routes ? Object.fromEntries(r.options.routes.map((n) => [n.name, n])) : {},
    _route: s,
    _routeParams: s.params || {},
    _lg: {
      lang: l(),
      get: l,
      set: (n) => {
        typeof u.set == "function" ? u.set(n, t) : typeof o.commit == "function" && o.commit("updateLang", n);
      }
    },
    _user: typeof h.user == "function" ? h.user(t) : o.state && o.state.user,
    _loggedIn: typeof h.loggedIn == "function" ? !!h.loggedIn(t) : !!(o.state && o.state.loggedIn),
    _userTier: typeof h.userTier == "function" ? h.userTier(t) : o.state && (o.state.userTier || o.state.tier) || "free",
    // ── Component context ──
    _props: t.$props || {},
    // `_data` is the resolved VIEW tree (viewComps), NOT the raw $data — view-data
    // functions read/mutate it as `_thiss._data.options…`, `_thiss._data.password…`, etc.
    _data: t.$data && t.$data.viewComps || t.viewComps || {},
    // `_state` is the REACTIVE view-local state from `_data.js` (in Vue's reactivity via
    // WBGC.data()). Read/mutate as `_thiss._state.loading = true` to trigger re-renders.
    // `_s` is an ergonomic shorthand alias for the SAME reactive object (same reference,
    // so `_thiss._s.count` and `_thiss._state.count` are interchangeable).
    _state: t.viewState || {},
    get _s() {
      return t.viewState || {};
    },
    // `_methods` are the view-local helpers from `_methods.js`, callable from any hook
    // (init0/init/tracker/…) as `_thiss._methods.foo(...)`.
    _methods: t.viewData_ && t.viewData_.methods || {},
    _meta: t.$data && t.$data.viewComps && t.$data.viewComps.options && t.$data.viewComps.options.meta || {},
    _proto: d,
    _vm: t,
    get _el() {
      return t.$el || null;
    },
    _ref: () => t.$refs && t.$refs.reference,
    _refs: t.$refs || {},
    // ── Browser context ──
    _cookies: c.cookies || i("$cookies") || E,
    _moment: c.moment || i("$moment") || i("$dayjs"),
    _dayjs: c.dayjs || i("$dayjs"),
    // ── Services (server interaction + reactivity) ──
    _queryData: (...n) => {
      const p = c.queryData || i("queryData");
      return typeof p == "function" ? p(...n) : null;
    },
    _aes: c.aes || { enc: i("aesEnc"), dec: i("aesDec") },
    _validators: c.validators || i("validators") || {},
    _watch: (n, p, O) => t.$watch ? t.$watch(n, p, O) : null,
    // ── Dynamic-programming helpers (mirror WBC's itemAccessibility, curated for the
    //    WBGC loader). All `_`-prefixed; available to every jsDive function. ──
    _update: () => {
      t.key_ = (t.key_ || 0) + 1;
    },
    _emit: (n, p) => {
      t.$emit && t.$emit(n, p);
    },
    _alert: (...n) => typeof t.alert == "function" ? t.alert(...n) : void 0,
    _trigger: (n, ...p) => typeof t[n] == "function" ? t[n](...p) : void 0,
    _go: (n) => {
      r && n && s.path !== n && r.push(n);
    }
  };
}
const I = ["view", "viewData"];
function P(t, a, e) {
  let i = t;
  for (let o = 0; o < a.length - 1; o++) {
    const s = a[o];
    (typeof i[s] != "object" || i[s] === null) && (i[s] = {}), i = i[s];
  }
  i[a[a.length - 1]] = e;
}
function D(t, { skip: a = [] } = {}) {
  const e = {}, i = /* @__PURE__ */ new Set([...I, ...a]);
  for (const [o, s] of Object.entries(t || {})) {
    const r = String(o).split("/").pop() || "";
    if (!r.startsWith("_")) continue;
    const d = r.replace(/\.[^.]+$/, "").replace(/^_+/, "");
    if (!d) continue;
    const u = d.split("__").filter(Boolean);
    if (!u.length || i.has(u.join("."))) continue;
    const h = s && typeof s == "object" && "default" in s ? s.default : s;
    P(e, u, h);
  }
  return e;
}
let w;
function S(t) {
  var d, u, h, c, l;
  const { viewMeta: a = {}, jsAccessibility: e, viewComps: i } = t, o = ((d = e == null ? void 0 : e._lg) == null ? void 0 : d.lang) || "en", s = e == null ? void 0 : e._router;
  Object.entries(a).forEach(([f, v]) => {
    const m = t.objLang(v, o);
    let n = document.querySelector(`meta[name='${f}']`);
    n ? n.content = m : (n = document.createElement("meta"), n.name = f, n.content = m, document.head.appendChild(n));
  }), w === void 0 && (w = document.title);
  const r = t.objLang(
    t.generalVal(((h = (u = s == null ? void 0 : s.currentRoute) == null ? void 0 : u.meta) == null ? void 0 : h.title) || "", e, o),
    o
  );
  if ((l = (c = i == null ? void 0 : i.options) == null ? void 0 : c.meta) != null && l.title) {
    const f = t.objLang(i.options.meta.title, o);
    document.title = f ? w ? f + " | " + w : f : w;
  } else r && (document.title = w ? r + " | " + w : r);
}
function L(t) {
  var o, s, r;
  const { viewComps: a } = t;
  if (!((o = a == null ? void 0 : a.options) != null && o.favIcon)) return;
  const e = t.objLang(a.options.favIcon, ((r = (s = t.jsAccessibility) == null ? void 0 : s._lg) == null ? void 0 : r.lang) || "en");
  let i = document.querySelector('link[rel="icon"]');
  i ? i.href = e : (i = document.createElement("link"), i.rel = "icon", i.href = e, document.head.appendChild(i));
}
function q(t, ...a) {
  a[0] === "+" ? t.alertObj.push(...a.slice(1)) : t.alertObj = a;
}
function A(t, a) {
  return String(a).split(".").reduce((e, i) => e != null ? e[i] : void 0, t);
}
const M = ["error", "lang", "val", "txt", "json", "blob", "text", "init", "encFn", "decFn", "resolved", "owners", "filter", "alert", "context"], T = Array.isArray(_) && _.length ? _.filter((t) => t !== "tracker" && t !== "on" && t !== "item-value" && t !== "item-text") : M;
function j(t = {}) {
  const a = t.context || t.adapters || {};
  return {
    name: "WBGC",
    props: {
      viewData: { type: Object, default: () => null },
      // `modules` is an `import.meta.glob('./**/_*.js', { eager: true })` map authored
      // in the host's `_view.js`. When `viewData` is absent, WBGC assembles it from these
      // modules via assembleViewData — so `<WBGC :modules="…"/>` replaces the per-folder
      // `_viewData.js` boilerplate. `viewData` still wins when both are given (legacy path).
      modules: { type: Object, default: () => null },
      // Optional `params` injected into the assembled viewData (createView forwards
      // `$route.params` here). Named `viewParams` to avoid clashing with the `params`
      // instance field set in mounted() from `viewData_.params`.
      viewParams: { type: Object, default: () => null },
      loaderDive: { type: Boolean, default: () => !0 }
    },
    data() {
      const e = this.viewData ? y(this.viewData) : this.modules ? y(D(this.modules)) : {};
      this.viewParams && (e.params = this.viewParams);
      const i = e && e.data ? typeof e.data == "function" ? e.data() : { ...e.data } : {};
      return {
        viewData_: e,
        viewState: i,
        viewComps: {},
        viewMeta: {},
        request: {},
        watchers: null,
        init0: null,
        init: null,
        tracker: null,
        viewOptions: null,
        finalAction: null,
        alertObj: [],
        key_: 0,
        selectItemOptions: {}
      };
    },
    render() {
      this.setMetaParams();
      let e = this.mainRender(this.viewComps);
      return b("div", {
        ...this.selectItemOptions || {},
        onContextmenu: this.handleMouseContextmenu,
        onMousedown: this.handleMouseDown
      }, [e]);
    },
    updated() {
      typeof (this == null ? void 0 : this.tracker) == "function" && this.tracker(this.jsAccessibility);
    },
    computed: {
      ...(t == null ? void 0 : t.computed) || {},
      // The ONLY dynamic-programming surface WBGC exposes — the `_this` jsAccessibility.
      // WBGC resolves the FIRST arrow of every viewComps function against this; a curried
      // inner arrow is left untouched for WBC, which resolves it against its OWN
      // `itemAccessibility` (the second level, e.g. `that?.store`). `itemAccessibility` is
      // 100% WBC's concern and intentionally does NOT live here. See createJsAccessibility.
      jsAccessibility() {
        return x(this, a);
      },
      compKey() {
        var e;
        return `key-view-${this.jsAccessibility._lg.lang}-${this.key_}-${(e = this == null ? void 0 : this.$route) == null ? void 0 : e.params}`;
      }
    },
    methods: {
      alert(...e) {
        q(this, ...e);
      },
      handleMouseDown(e) {
      },
      handleMouseContextmenu(e) {
      },
      setMetaParams() {
        S(this);
      },
      mainRender(e) {
        const i = this.jsAccessibility._lg.lang;
        return b(g, { key: `wbgc-view-${i}-${this.key_}`, item: e });
      }
    },
    watch: {},
    components: { WBC: g, ...(t == null ? void 0 : t.components) || {} },
    // NOTE: vuetify, router, and store are app-level plugins in Vue 3, installed via
    // app.use(router) / app.use(store) / app.use(vuetify) by the host — NOT component
    // options. $store and $route are available on `this` through their respective plugins.
    mounted() {
      var e, i, o, s, r, d;
      this.params = (e = this.viewData_) == null ? void 0 : e.params, this.finalAction = (i = this.viewData_) == null ? void 0 : i.finalAction, this.request = (o = this.viewData_) == null ? void 0 : o.request, this.viewOptions = (s = this.viewData_) == null ? void 0 : s.viewOptions, this.init = (r = this.viewData_) == null ? void 0 : r.init, typeof this.init == "function" && this.init(this.jsAccessibility), this.tracker = (d = this.viewData_) == null ? void 0 : d.tracker;
    },
    beforeUnmount() {
      typeof this.finalAction == "function" && this.finalAction(this.jsAccessibility);
    },
    created() {
      var i, o, s, r, d, u, h;
      if (this.viewData_ || (this.viewData_ = this.viewData ? y(this.viewData) : this.modules ? y(D(this.modules)) : {}, this.viewParams && (this.viewData_.params = this.viewParams)), this.viewComps = (i = this.viewData_) == null ? void 0 : i.viewComps, this.init0 = (o = this.viewData_) == null ? void 0 : o.init0, typeof this.init0 == "function" && this.init0(this.jsAccessibility), typeof ((s = this.viewComps) == null ? void 0 : s.jsDive) == "boolean" ? this.viewComps.jsDive : this.loaderDive) {
        const c = this.jsAccessibility._lg.lang;
        this.viewComps = W(y(this.viewComps), this.jsAccessibility, c, T);
      }
      this.watchers = (r = this.viewData_) == null ? void 0 : r.watchers, this.viewMeta = (u = (d = this.viewComps) == null ? void 0 : d.options) == null ? void 0 : u.meta, (h = this.viewComps) != null && h.options && (this.viewComps.options.ref = "reference", this.viewComps.ref = () => {
        var c;
        return (c = this == null ? void 0 : this.$refs) == null ? void 0 : c.reference;
      }, this.viewComps.asChild = () => this.jsAccessibility), L(this);
      for (let c of (this == null ? void 0 : this.watchers) || []) {
        if (!Array.isArray(c) || c.length < 2) continue;
        const l = c[0];
        if (!(l instanceof Function) && typeof l != "string" && !Array.isArray(l)) continue;
        let f = (c == null ? void 0 : c[1]) || [], v = (n, p) => f(this.jsAccessibility, n, p), m = () => {
          if (l instanceof Function) return l(this.jsAccessibility);
          if (typeof l == "string") return A(this.jsAccessibility, l);
          if (Array.isArray(l)) return l.map((n) => {
            if (n instanceof Function) return n(this.jsAccessibility);
            if (typeof n == "string") return A(this.jsAccessibility, n);
          });
        };
        this.$watch(m, v, ...c.slice(2));
      }
    }
  };
}
const C = j();
function F({ name: t, modules: a, viewData: e }) {
  return {
    name: t || "AnonymousView",
    props: {
      params: { type: Object, default: () => null }
    },
    data() {
      var i;
      return {
        params_: (this == null ? void 0 : this.params) || ((i = this.$route) == null ? void 0 : i.params)
      };
    },
    render() {
      return b(C, {
        viewData: e || null,
        modules: a || null,
        viewParams: this.params_
      });
    }
  };
}
const V = (t) => t && typeof t.install == "function" && t.install || t && t.default && typeof t.default.install == "function" && t.default.install || t && typeof t.default == "function" && t.default || null, $ = /* @__PURE__ */ new WeakSet(), G = function(t, a = {}) {
  if (!t || typeof t.component != "function")
    throw new TypeError("[WBJS] install requires a valid Vue application instance.");
  if (!$.has(t))
    try {
      const e = V(k);
      if (!e)
        throw new Error("[WBJS] @wbc-ui/core install not found — WBC is required.");
      e(t, a), t.component("WBGC", B(j(a))), typeof globalThis < "u" && (globalThis.WBGC = C), $.add(t);
    } catch (e) {
      throw console.error("[WBJS] Installation FAILED:", e), e;
    }
}, K = { install: G, createWBGCOptions: j, WBGC: C, WBC: g, assembleViewData: D, createView: F };
export {
  H as WBC,
  C as WBGC,
  D as assembleViewData,
  F as createView,
  j as createWBGCOptions,
  K as default,
  G as install
};
