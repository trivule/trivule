var De = Object.defineProperty;
var ae = Object.getOwnPropertySymbols;
var Ae = Object.prototype.hasOwnProperty, Ie = Object.prototype.propertyIsEnumerable;
var le = (t, e, s) => e in t ? De(t, e, { enumerable: !0, configurable: !0, writable: !0, value: s }) : t[e] = s, I = (t, e) => {
  for (var s in e || (e = {}))
    Ae.call(e, s) && le(t, s, e[s]);
  if (ae)
    for (var s of ae(e))
      Ie.call(e, s) && le(t, s, e[s]);
  return t;
};
const z = {
  invalidClass: "is-invalid",
  // Default invalid class for all input
  validClass: ""
  //Default valid class for all input
}, fe = (t) => {
  const e = /^(\w+):(.+)$/, s = t.match(e);
  if (s) {
    const r = s[1];
    let l = s[2];
    return { ruleName: r, params: l };
  } else {
    const [r, l] = t.split(":");
    return { ruleName: r, params: l };
  }
}, O = (t, e = ",") => typeof t != "string" ? [] : t.split(e).map((s) => s.trim()), Y = (t) => {
  throw new Error(`Please provide <<${t}>> rule arguments`);
}, V = (t) => t instanceof File || t instanceof Blob, K = (t, e) => {
  if (V(t)) {
    const r = t.size;
    let l;
    const d = e == null ? void 0 : e.match(/^(\d+(\.\d+)?)\s*(B|KB|MB|GB)$/i);
    if (!d)
      throw new Error(
        "Invalid maxSize format. Please use valid format like '1KB', '1MB', etc."
      );
    const f = parseFloat(d[1]), v = d[3].toUpperCase();
    return v === "KB" ? l = f * 1024 : v === "MB" ? l = f * 1024 * 1024 : v === "GB" ? l = f * 1024 * 1024 * 1024 : l = f, r <= l;
  } else
    return !1;
}, re = (t, e) => {
  if (V(t)) {
    const r = t.size;
    let l;
    const d = e == null ? void 0 : e.match(/^(\d+(\.\d+)?)\s*(B|KB|MB|GB)$/i);
    if (!d)
      throw new Error(
        "Invalid minSize format. Please use valid format like '1KB', '1MB', etc."
      );
    const f = parseFloat(d[1]), v = d[3].toUpperCase();
    return v === "KB" ? l = f * 1024 : v === "MB" ? l = f * 1024 * 1024 : v === "GB" ? l = f * 1024 * 1024 * 1024 : l = f, r >= l;
  } else
    return !1;
};
var Ne = typeof globalThis != "undefined" ? globalThis : typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : {};
function qe(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var de = { exports: {} };
(function(t, e) {
  (function(s, r) {
    t.exports = r();
  })(Ne, function() {
    var s = 1e3, r = 6e4, l = 36e5, d = "millisecond", f = "second", v = "minute", B = "hour", T = "day", _ = "week", M = "month", W = "quarter", S = "year", N = "date", P = "Invalid Date", Te = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/, Se = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g, Ce = { name: "en", weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"), ordinal: function(o) {
      var a = ["th", "st", "nd", "rd"], i = o % 100;
      return "[" + o + (a[(i - 20) % 10] || a[i] || a[0]) + "]";
    } }, J = function(o, a, i) {
      var u = String(o);
      return !u || u.length >= a ? o : "" + Array(a + 1 - u.length).join(i) + o;
    }, Be = { s: J, z: function(o) {
      var a = -o.utcOffset(), i = Math.abs(a), u = Math.floor(i / 60), n = i % 60;
      return (a <= 0 ? "+" : "-") + J(u, 2, "0") + ":" + J(n, 2, "0");
    }, m: function o(a, i) {
      if (a.date() < i.date())
        return -o(i, a);
      var u = 12 * (i.year() - a.year()) + (i.month() - a.month()), n = a.clone().add(u, M), c = i - n < 0, h = a.clone().add(u + (c ? -1 : 1), M);
      return +(-(u + (i - n) / (c ? n - h : h - n)) || 0);
    }, a: function(o) {
      return o < 0 ? Math.ceil(o) || 0 : Math.floor(o);
    }, p: function(o) {
      return { M, y: S, w: _, d: T, D: N, h: B, m: v, s: f, ms: d, Q: W }[o] || String(o || "").toLowerCase().replace(/s$/, "");
    }, u: function(o) {
      return o === void 0;
    } }, x = "en", L = {};
    L[x] = Ce;
    var X = function(o) {
      return o instanceof Z;
    }, U = function o(a, i, u) {
      var n;
      if (!a)
        return x;
      if (typeof a == "string") {
        var c = a.toLowerCase();
        L[c] && (n = c), i && (L[c] = i, n = c);
        var h = a.split("-");
        if (!n && h.length > 1)
          return o(h[0]);
      } else {
        var m = a.name;
        L[m] = a, n = m;
      }
      return !u && n && (x = n), n || !u && x;
    }, w = function(o, a) {
      if (X(o))
        return o.clone();
      var i = typeof a == "object" ? a : {};
      return i.date = o, i.args = arguments, new Z(i);
    }, g = Be;
    g.l = U, g.i = X, g.w = function(o, a) {
      return w(o, { locale: a.$L, utc: a.$u, x: a.$x, $offset: a.$offset });
    };
    var Z = function() {
      function o(i) {
        this.$L = U(i.locale, null, !0), this.parse(i);
      }
      var a = o.prototype;
      return a.parse = function(i) {
        this.$d = function(u) {
          var n = u.date, c = u.utc;
          if (n === null)
            return /* @__PURE__ */ new Date(NaN);
          if (g.u(n))
            return /* @__PURE__ */ new Date();
          if (n instanceof Date)
            return new Date(n);
          if (typeof n == "string" && !/Z$/i.test(n)) {
            var h = n.match(Te);
            if (h) {
              var m = h[2] - 1 || 0, b = (h[7] || "0").substring(0, 3);
              return c ? new Date(Date.UTC(h[1], m, h[3] || 1, h[4] || 0, h[5] || 0, h[6] || 0, b)) : new Date(h[1], m, h[3] || 1, h[4] || 0, h[5] || 0, h[6] || 0, b);
            }
          }
          return new Date(n);
        }(i), this.$x = i.x || {}, this.init();
      }, a.init = function() {
        var i = this.$d;
        this.$y = i.getFullYear(), this.$M = i.getMonth(), this.$D = i.getDate(), this.$W = i.getDay(), this.$H = i.getHours(), this.$m = i.getMinutes(), this.$s = i.getSeconds(), this.$ms = i.getMilliseconds();
      }, a.$utils = function() {
        return g;
      }, a.isValid = function() {
        return this.$d.toString() !== P;
      }, a.isSame = function(i, u) {
        var n = w(i);
        return this.startOf(u) <= n && n <= this.endOf(u);
      }, a.isAfter = function(i, u) {
        return w(i) < this.startOf(u);
      }, a.isBefore = function(i, u) {
        return this.endOf(u) < w(i);
      }, a.$g = function(i, u, n) {
        return g.u(i) ? this[u] : this.set(n, i);
      }, a.unix = function() {
        return Math.floor(this.valueOf() / 1e3);
      }, a.valueOf = function() {
        return this.$d.getTime();
      }, a.startOf = function(i, u) {
        var n = this, c = !!g.u(u) || u, h = g.p(i), m = function(k, E) {
          var R = g.w(n.$u ? Date.UTC(n.$y, E, k) : new Date(n.$y, E, k), n);
          return c ? R : R.endOf(T);
        }, b = function(k, E) {
          return g.w(n.toDate()[k].apply(n.toDate("s"), (c ? [0, 0, 0, 0] : [23, 59, 59, 999]).slice(E)), n);
        }, p = this.$W, y = this.$M, q = this.$D, A = "set" + (this.$u ? "UTC" : "");
        switch (h) {
          case S:
            return c ? m(1, 0) : m(31, 11);
          case M:
            return c ? m(1, y) : m(0, y + 1);
          case _:
            var F = this.$locale().weekStart || 0, Q = (p < F ? p + 7 : p) - F;
            return m(c ? q - Q : q + (6 - Q), y);
          case T:
          case N:
            return b(A + "Hours", 0);
          case B:
            return b(A + "Minutes", 1);
          case v:
            return b(A + "Seconds", 2);
          case f:
            return b(A + "Milliseconds", 3);
          default:
            return this.clone();
        }
      }, a.endOf = function(i) {
        return this.startOf(i, !1);
      }, a.$set = function(i, u) {
        var n, c = g.p(i), h = "set" + (this.$u ? "UTC" : ""), m = (n = {}, n[T] = h + "Date", n[N] = h + "Date", n[M] = h + "Month", n[S] = h + "FullYear", n[B] = h + "Hours", n[v] = h + "Minutes", n[f] = h + "Seconds", n[d] = h + "Milliseconds", n)[c], b = c === T ? this.$D + (u - this.$W) : u;
        if (c === M || c === S) {
          var p = this.clone().set(N, 1);
          p.$d[m](b), p.init(), this.$d = p.set(N, Math.min(this.$D, p.daysInMonth())).$d;
        } else
          m && this.$d[m](b);
        return this.init(), this;
      }, a.set = function(i, u) {
        return this.clone().$set(i, u);
      }, a.get = function(i) {
        return this[g.p(i)]();
      }, a.add = function(i, u) {
        var n, c = this;
        i = Number(i);
        var h = g.p(u), m = function(y) {
          var q = w(c);
          return g.w(q.date(q.date() + Math.round(y * i)), c);
        };
        if (h === M)
          return this.set(M, this.$M + i);
        if (h === S)
          return this.set(S, this.$y + i);
        if (h === T)
          return m(1);
        if (h === _)
          return m(7);
        var b = (n = {}, n[v] = r, n[B] = l, n[f] = s, n)[h] || 1, p = this.$d.getTime() + i * b;
        return g.w(p, this);
      }, a.subtract = function(i, u) {
        return this.add(-1 * i, u);
      }, a.format = function(i) {
        var u = this, n = this.$locale();
        if (!this.isValid())
          return n.invalidDate || P;
        var c = i || "YYYY-MM-DDTHH:mm:ssZ", h = g.z(this), m = this.$H, b = this.$m, p = this.$M, y = n.weekdays, q = n.months, A = function(E, R, ee, G) {
          return E && (E[R] || E(u, c)) || ee[R].slice(0, G);
        }, F = function(E) {
          return g.s(m % 12 || 12, E, "0");
        }, Q = n.meridiem || function(E, R, ee) {
          var G = E < 12 ? "AM" : "PM";
          return ee ? G.toLowerCase() : G;
        }, k = { YY: String(this.$y).slice(-2), YYYY: this.$y, M: p + 1, MM: g.s(p + 1, 2, "0"), MMM: A(n.monthsShort, p, q, 3), MMMM: A(q, p), D: this.$D, DD: g.s(this.$D, 2, "0"), d: String(this.$W), dd: A(n.weekdaysMin, this.$W, y, 2), ddd: A(n.weekdaysShort, this.$W, y, 3), dddd: y[this.$W], H: String(m), HH: g.s(m, 2, "0"), h: F(1), hh: F(2), a: Q(m, b, !0), A: Q(m, b, !1), m: String(b), mm: g.s(b, 2, "0"), s: String(this.$s), ss: g.s(this.$s, 2, "0"), SSS: g.s(this.$ms, 3, "0"), Z: h };
        return c.replace(Se, function(E, R) {
          return R || k[E] || h.replace(":", "");
        });
      }, a.utcOffset = function() {
        return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
      }, a.diff = function(i, u, n) {
        var c, h = g.p(u), m = w(i), b = (m.utcOffset() - this.utcOffset()) * r, p = this - m, y = g.m(this, m);
        return y = (c = {}, c[S] = y / 12, c[M] = y, c[W] = y / 3, c[_] = (p - b) / 6048e5, c[T] = (p - b) / 864e5, c[B] = p / l, c[v] = p / r, c[f] = p / s, c)[h] || p, n ? y : g.a(y);
      }, a.daysInMonth = function() {
        return this.endOf(M).$D;
      }, a.$locale = function() {
        return L[this.$L];
      }, a.locale = function(i, u) {
        if (!i)
          return this.$L;
        var n = this.clone(), c = U(i, u, !0);
        return c && (n.$L = c), n;
      }, a.clone = function() {
        return g.w(this.$d, this);
      }, a.toDate = function() {
        return new Date(this.valueOf());
      }, a.toJSON = function() {
        return this.isValid() ? this.toISOString() : null;
      }, a.toISOString = function() {
        return this.$d.toISOString();
      }, a.toString = function() {
        return this.$d.toUTCString();
      }, o;
    }(), ne = Z.prototype;
    return w.prototype = ne, [["$ms", d], ["$s", f], ["$m", v], ["$H", B], ["$W", T], ["$M", M], ["$y", S], ["$D", N]].forEach(function(o) {
      ne[o[1]] = function(a) {
        return this.$g(a, o[0], o[1]);
      };
    }), w.extend = function(o, a) {
      return o.$i || (o(a, Z, w), o.$i = !0), w;
    }, w.locale = U, w.isDayjs = X, w.unix = function(o) {
      return w(1e3 * o);
    }, w.en = L[x], w.Ls = L, w.p = {}, w;
  });
})(de);
var Re = de.exports;
const ie = /* @__PURE__ */ qe(Re), Ve = (t) => ie(t, void 0, !0).isValid(), me = (t, e) => ie(t).isBefore(e), ge = (t, e) => ie(t).isAfter(e), _e = (t, e) => {
  e || Y("dateBetween");
  const [s, r] = O(e != null ? e : "");
  return ge(t, s) && me(t, r);
}, Le = (t, ...e) => !!t, Oe = (t) => !0, We = (t, e) => (e || Y("in"), O(e).includes(t)), ke = (t, e) => V(t) ? K(t, e) : te(t, e), ze = (t) => typeof t == "boolean" || typeof t == "string" && (t = t.toLowerCase(), t === "true" || t === "false" || t === "0" || t === "1" || t === "yes" || t === "no"), He = (t, e) => {
  var [s, r] = O(e != null ? e : "");
  return V(t) ? K(t, r) && re(t, s) : !$(t) && !V(t) ? _e(t, e) : (s = Number(s), r = Number(r), t !== void 0 && t !== Number && t !== "" && $(s) && $(r) ? (t = Number(t), $(t) ? we(t, r) && be(t, s) : !1) : !1);
}, xe = (t, ...e) => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(t), ve = (t, e) => t && H(t) ? t.length >= Number(e) : !1, pe = (t, e) => t ? H(t) ? t.length <= Number(e) : !1 : !0, H = (t) => typeof t == "string", Fe = (t) => /^(ftp|http|https):\/\/[^ "]+$/.test(t), Qe = (t) => typeof t != "string" || t.length === 0 ? !1 : /^[A-Z]/.test(t), je = (t) => typeof t != "string" || t.length === 0 ? !1 : /^[a-z]/.test(t), Ye = (t, e) => {
  e || Y("startWith");
  const s = O(e != null ? e : "");
  return H(t) ? s.some((r) => t.startsWith(r)) : !1;
}, Pe = (t, e) => {
  e || Y("endWith");
  const s = O(e != null ? e : "");
  return H(t) ? s.some((r) => t.endsWith(r)) : !1;
}, Ue = (t, e) => {
  e || Y("contains");
  const s = O(e != null ? e : "");
  return H(t) ? s.some((r) => t.includes(r)) : !1;
}, te = (t, e) => {
  if (!$(e))
    throw new Error("The length rule argument must be an integer");
  return e = parseInt(e), typeof t == "string" || typeof t == "number" ? t = t.toString().split("") : typeof t == "object" && t !== null && t !== void 0 && (t = []), Array.isArray(t) ? t.length === e : !1;
}, Ze = (t) => {
  const s = /[A-Z]/.test(t), r = /[a-z]/.test(t), l = /\d/.test(t), d = /[!@#$%^&*(),.?":{}|<>]/.test(t);
  return !(t.length < 8 || !s || !r || !l || !d);
}, be = (t, e) => {
  if (V(t))
    return re(t, e);
  if (t == null && (t = 0), !$(e))
    throw new Error("Min rule parameter must be an integer");
  return $(t) ? Number(t) >= Number(e) : ve(t, e);
}, we = (t, e) => {
  if (V(t))
    return K(t, e);
  if (!$(e))
    throw new Error("Min rule parameter must be an integer");
  return t == null && (t = 0), $(t) ? Number(t) <= Number(e) : pe(t, e);
}, oe = (t) => $(t) ? Number.isInteger(Number(t)) : !1, $ = (t) => t === "" || t === null ? !1 : t === "0" || t === 0 || t === "1" || t === 1 ? !0 : !isNaN(Number(t)) && typeof t != "boolean" && typeof t != "object", D = class {
  /**
   * Add a custom validation rule to the rules bag
   * @param rule - The name of the custom rule
   * @param callback - The callback function for the custom rule
   * @param message - The error message for the custom rule
   */
  static rule(t, e, s) {
    D.addRule(t, e), D.addMessage(t, s != null ? s : "This input is invalide");
  }
  /**
   * Add a custom validation rule to the rules bag
   * @param rule - The name of the custom rule
   * @param callback - The callback function for the custom rule
   */
  static addRule(t, e) {
    D.rules[t] = e;
  }
  /**
   * Add a custom error message for a validation rule to the messages bag
   * @param rule - The name of the validation rule
   * @param message - The error message for the validation rule
   */
  static addMessage(t, e) {
    D.messages[t] = e;
  }
  /**
   * Check if a validation rule exists in the rules bag
   * @param rule - The name of the validation rule
   * @returns True if the rule exists, false otherwise
   */
  static hasRule(t) {
    return t in D.rules;
  }
  static getRule(t) {
    return D.rules[t];
  }
  static getMessage(t) {
    return D.messages[t];
  }
  static allRules() {
    return D.rules;
  }
  static allMessages() {
    return D.messages;
  }
};
let C = D;
C.messages = {
  required: "The :field field is required",
  email: "Please enter a valid email address",
  maxlength: "The maximum number of characters allowed has been exceeded",
  minlength: "The minimum number of characters allowed has not been reached",
  min: "The :field field must be greater than or equal to ':min'",
  max: "The :field field must be less than or equal to ':max'",
  string: "Please enter a string of characters",
  between: "This field value must be in ':min' and ':max'",
  startWith: "The :field field must be started with ':startWith'",
  endWith: "The :field field must be ended with ':endWith'",
  contains: "The :field field must contain the value ':contains'",
  in: "Please choose a correct value for the :field field",
  integer: "The :field field must an integer",
  int: "The :field field must an integer",
  number: "This field must be a number",
  numeric: "This field must be a number",
  file: "This field must be a file",
  url: "This field must be a valid url",
  length: "The size of this must be :size",
  len: "The size of this must be :size",
  maxFileSize: "The file size must be smaller than :maxFileSize.",
  minFileSize: "The file size must be larger than :minFileSize.",
  size: "This field's size should be less than or equal to :size ",
  boolean: "This field must be a boolean (yes or no) included",
  startWithUpper: "This field must be started with capitale letter",
  startWithLower: "This field must be started with capitale letter",
  nullable: "",
  password: "The password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a digit, and a special character.",
  date: "This field must be a valid date",
  before: "The date must be before (:beforeDate)",
  after: "The date must be after (:afterDate)"
};
C.rules = {
  required: Le,
  email: xe,
  maxlength: pe,
  minlength: ve,
  min: be,
  max: we,
  string: H,
  between: He,
  startWith: Ye,
  endWith: Pe,
  contains: Ue,
  in: We,
  integer: oe,
  int: oe,
  number: $,
  numeric: $,
  url: Fe,
  length: te,
  len: te,
  file: V,
  maxFileSize: K,
  minFileSize: re,
  size: ke,
  boolean: ze,
  startWithUpper: Qe,
  nullable: Oe,
  startWithLower: je,
  password: Ze,
  date: Ve,
  before: me,
  after: ge
};
class ye {
  constructor() {
    this.messages = C.allMessages();
  }
  getRulesMessages(e) {
    const s = [];
    for (const r of e)
      this.messages[r] ? s.push(this.messages[r]) : s.push("Invalid input");
    return s;
  }
  parseMessage(e, s, r, l) {
    let d = [e, ...O(l != null ? l : "")], f = r;
    return f.includes(":field") || (d = d.slice(1)), f = this.replace(r, f, d), f;
  }
  /**
   *
   * @param messages
   * @returns
   */
  setMessages(e) {
    return this.messages = e, this;
  }
  replace(e, s, r) {
    var d;
    const l = e.match(/:[a-zA-Z]+/g);
    if (l)
      for (let f = 0; f < l.length; f++) {
        const v = (d = r[f]) != null ? d : "";
        s = s.replace(l[f], v);
      }
    return s;
  }
}
class Ge {
  constructor(e, s) {
    this.rules = e, this.messages = s, this.compensateMessages(), this.sanitizeMessage();
  }
  compensateMessages() {
    var s;
    const e = this.rules.length;
    if (this.messages.length !== e)
      for (let r = 0; r < this.rules.length; r++) {
        const l = this.convertAcoladeGroupToArray((s = this.messages[r]) != null ? s : "");
        for (const d of l)
          this.messages[d] = this.messages[r];
      }
  }
  sanitizeMessage() {
    const e = /{(\d+(?:,\s*\d+)*)}/g;
    this.messages = this.messages.map((s) => s.replace(e, ""));
  }
  /**
   * Va catuper {1,2...} et les transformer sous forme de tableau
   * @param str
   * @returns
   */
  convertAcoladeGroupToArray(e) {
    var l;
    const s = /{(\d+(?:,\s*\d+)*)}/g;
    return (l = [...e.matchAll(s)].map(
      (d) => d[1].split(",").map((f) => parseInt(f.trim()))
    )[0]) != null ? l : [];
  }
  getMessages() {
    return this.messages;
  }
}
class Ke {
  constructor(e, s, r = !0) {
    this.emitEvent = r, this.config = z, this.feedbackElement = null, this.rules = [], this.messages = {}, this._errors = [], this.name = "", this.showMessage = "first", this.showMessages = ["first", "full", "last"], this.validClass = "", this.invalidClass = "is-invalid", this.events = ["blur", "input", "change"], this.setConfig(s), this.setInputElement(e), this.setInputRules(), this.setInputName(), this.setFeedbackElement(), this.setShowMessage(), this.setInputValidationClass(), this.getElementQvMessages(), this.setEvent();
  }
  /**
   *Set input rules from input
   * @returns
   */
  setInputRules() {
    var s;
    let e = (s = this.inputElement.dataset.qvRules) != null ? s : "";
    if (e)
      for (const r of e.split("|"))
        if (C.hasRule(fe(r).ruleName))
          this.rules.push(r);
        else
          throw new Error(
            `The validation rule ${r} is not supported by QuickV`
          );
    return this;
  }
  setEvent() {
    const e = this.inputElement.dataset.qvEvents;
    e && (this.events = e.split("|"));
  }
  setInputElement(e) {
    if (!(e instanceof HTMLElement)) {
      const s = document.querySelector(e);
      s && (e = s);
    }
    if (!(e instanceof HTMLElement))
      throw new Error(
        "The 'inputElement' parameter must be of type HTMLElement."
      );
    this.inputElement = e;
  }
  setInputName() {
    let e = this.inputElement.name;
    if (this.inputElement.dataset.qvName && (e = this.inputElement.dataset.qvName), e == null || typeof e == "string" && e.length < 0)
      throw new Error("The input name could not be empty or null");
    this.name = e;
  }
  set errors(e) {
    var s;
    e && (this._errors = (s = e[this.name]) != null ? s : []), this.showErrorMessages();
  }
  /**
   * Searches for the closest HTML element with a custom data attribute "data-qv-feedback"
   * that is associated with the current input element, and stores a reference to it.
   *
   */
  setFeedbackElement() {
    let s = this.inputElement.parentElement, r = null;
    for (; s && !r; )
      r = s.querySelector(
        `[data-qv-feedback='${this.name}']`
      ), s = s.parentElement;
    this.feedbackElement = r;
  }
  /**
   * Shows error messages based on the value of the "qv-show" attribute
   * The "showMessage" property determines how the error messages are displayed.
   *
   */
  showErrorMessages() {
    if (this.feedbackElement instanceof HTMLElement, this.feedbackElement instanceof HTMLElement) {
      let e = "";
      Array.isArray(this._errors) && (e = this._errors[0], this.showMessage == "full" ? e = this._errors.join("<br>") : this.showMessage == "last" && this._errors.length > 0 && (e = this._errors[this._errors.length - 1])), this.feedbackElement.innerHTML = e != null ? e : "";
    }
  }
  /**
   * Get and set the ways error message will be displayed
   */
  setShowMessage() {
    var e;
    this.showMessage = (e = this.inputElement.dataset.qvShow) != null ? e : "first", this.showMessage = this.showMessages.includes(this.showMessage) ? this.showMessage : "first";
  }
  setInputValidationClass() {
    var e, s, r, l;
    this.invalidClass = (e = this.config.invalidClass) != null ? e : "", this.validClass = (s = this.config.validClass) != null ? s : "", this.invalidClass = (r = this.inputElement.dataset.qvInvalidClass) != null ? r : this.invalidClass, this.validClass = (l = this.inputElement.dataset.qvValidClass) != null ? l : this.validClass;
  }
  setValidationClass(e) {
    const s = (l) => {
      l.length > 0 && this.inputElement.classList.remove(l);
    }, r = (l) => {
      l.length > 0 && this.inputElement.classList.add(l);
    };
    e ? (this.invalidClass.split(" ").forEach(s), this.validClass.split(" ").forEach(r), this.inputElement.setAttribute("data-qv-valid", "1")) : (this.validClass.split(" ").forEach(s), this.invalidClass.split(" ").forEach(r), this.inputElement.setAttribute("data-qv-valid", "0"));
  }
  getElementQvMessages() {
    var r;
    const e = this.inputElement.dataset.qvMessages;
    let s = {};
    for (let l = 0; l < this.rules.length; l++) {
      let d = (r = e == null ? void 0 : e.split("|").map((B) => B.trim())) != null ? r : [];
      d && (d = new Ge(this.rules, d).getMessages());
      const f = d !== void 0 ? d[l] : "", v = new se().getRule(this.rules[l]).ruleName;
      typeof f == "string" && f.length > 0 ? s[v] = f : s[v] = C.getMessage(v);
    }
    this.messages = s;
  }
  getName() {
    return this.name;
  }
  getValue() {
    return this.inputElement.type.toLowerCase() == "file" ? this.inputElement.files ? this.inputElement.files[0] : null : this.inputElement.value;
  }
  setConfig(e) {
    this.config = z, e && typeof e == "object" && (this.config = I(I({}, this.config), e));
  }
}
const Me = class {
  constructor() {
    this.errors = {};
  }
  /**
   * Validates a set of inputs according to a set of rules.
   *
   * @param rules The rules to apply for each input.
   * @param inputs The inputs to validate.
   */
  static make(t, e, s) {
    const r = new Me();
    for (const [l, d] of Object.entries(t)) {
      const f = e[l], v = new se();
      if (!Array.isArray(d))
        throw new Error("The validator input must be an array");
      if (!v.validate(f, d)) {
        const T = s != null ? s : new ye(), _ = [];
        for (const M of v.getErrors()) {
          const W = d.find((S) => S.startsWith(M));
          if (W) {
            const N = v.getRule(W).params, P = T.parseMessage(
              l,
              W,
              T.getRulesMessages([M])[0],
              N
            );
            _.push(P);
          }
        }
        r.errors[l] = _;
      }
    }
    return r;
  }
  /**
   * Validates an input according to a single rule.
   *
   * @param input The input to validate.
   * @param rule The rule to apply.
   */
  static valid(t, e) {
    if (!Array.isArray(e))
      throw new Error("The validator input must be an array");
    const s = new se();
    return s.validate(t, e), s.isValid();
  }
  /**
   * Return true if validation failed
   * @returns
   */
  fails() {
    return Object.keys(this.errors).length > 0;
  }
  /**
   * Get validations errors messages
   * @returns
   */
  getMessages() {
    return this.errors;
  }
  /**
   * Return true if data is valids
   * @returns
   */
  isValid() {
    return !this.fails();
  }
  rule(t, e, s) {
    C.rule(t, e, s);
  }
};
let Ee = Me;
Ee.rulesBag = C.allRules();
class Je extends Ke {
  constructor(e, s, r = !0) {
    super(e, s, r);
  }
  /**
   * Performs validation on the input element. And emits qv.input.validated event if necessary.
   * @returns true if the input element is valid, false otherwise.
   * Example:
   * ```
   * const qvInput = new QvInput(inputElement);
   * const isValid = qvInput.validate();
   * if (isValid) {
   *   // Proceed with form submission or handle valid input
   * } else {
   *   // Display error messages or handle invalid input
   * }
   * ```
   */
  validate() {
    const e = this.valid();
    return this.setValidationClass(e), this.errors = this.validator.getMessages(), this.emitChangeEvent(), e;
  }
  /**
   * Returns the validation rules defined for the input element.
   * @returns An array of validation rules.
   * Example:
   * ```
   * const qvInput = new QvInput(inputElement);
   * const rules = qvInput.getRules();
   * console.log(rules); // Output: ['required', 'email']
   * ```
   */
  getRules() {
    return this.rules;
  }
  /**
   * Checks if the input element has validation rules.
   * @returns A boolean indicating if rules are defined.
   * Example:
   * ```
   * const qvInput = new QvInput(inputElement);
   * const hasRules = qvInput.hasRules();
   * console.log(hasRules); // Output: true or false
   * ```
   */
  hasRules() {
    return this.rules.length > 0;
  }
  /**
   * Get the validation messages associated with the input element.
   * @returns An object containing the validation messages.
   * Example:
   * ```
   * const qvInput = new QvInput(inputElement);
   * const messages = qvInput.getMessages();
   * console.log(messages); // Output: { ruleName1: 'Message 1', ruleName2: 'Message 2', ... }
   * ```
   */
  getMessages() {
    return this.messages;
  }
  /**
   * Performs validation on the input element using the defined validation rules. Don't emit qv.input.validated event
   * @returns true if the input element is valid, false otherwise.
   * Example:
   * ```
   * const qvInput = new QvInput(inputElement);
   * const isValid = qvInput.valid();
   * if (isValid) {
   *   // Proceed with form submission or handle valid input
   * } else {
   *   // Display error messages or handle invalid input
   * }
   * ```
   */
  valid() {
    const e = {}, s = {};
    e[this.name] = this.getValue(), s[this.name] = this.rules;
    const r = new ye();
    return r.setMessages(this.messages), this.validator = Ee.make(s, e, r), this.validator.isValid();
  }
  /**
   * Emit event if input change
   */
  emitChangeEvent() {
    this.emitEvent && this.inputElement.dispatchEvent(
      new CustomEvent("qv.input.validated", {
        detail: {
          rules: this.rules,
          input: {},
          element: this.inputElement
        },
        bubbles: !0
      })
    );
  }
  getErrors() {
    return this._errors;
  }
  /**
   * Check if the input element has failed validation.
   * @returns `true` if the input element has failed validation, `false` otherwise.
   * Example:
   * ```
   * const qvInput = new QvInput(inputElement);
   * if (qvInput.fails()) {
   *   console.log('Validation failed');
   * } else {
   *   console.log('Validation succeeded');
   * }
   * ```
   */
  fails() {
    return !this.valid();
  }
}
class j extends Je {
  constructor(e, s, r = !0) {
    super(e, s, r);
  }
  /**
   * Initializes live validation on the input element.
   * Example:
   * ```
   * const qvInput = new QvInput(inputElement);
   * qvInput.init();
   * ```
   */
  init() {
    this.events.forEach((e) => {
      this.inputElement.addEventListener(e, () => {
        this.validate();
      });
    });
  }
  /**
   * Add new rule to input element
   * @param ruleName
   * @param call
   * @param message
   */
  rule(e, s, r) {
    C.rule(e, s, r);
  }
}
class $e {
  constructor(e) {
    this.inputs = {}, this.config = z, this.setContainer(e);
  }
  setContainer(e) {
    if (!(e instanceof HTMLElement)) {
      const r = document.querySelector(e);
      r && (e = r);
    }
    if (!(e instanceof HTMLElement))
      throw new Error("The 'container' parameter must be of type HTMLElement.");
    this.container = e;
    const s = this.container.querySelector("[data-qv-submit]");
    s && (this.submitButton = s);
  }
  /**
   * Initializes live validation on the form element.
   * @param config Optional configuration object for QvForm.
   * Example:
   * ```
   * const qvForm = new QvForm(formElement);
   * qvForm.init();
   * ```
   */
  init(e) {
    this.setConfig(e), this.disableButton(), this.container.querySelectorAll("[data-qv-rules]").forEach((s) => {
      new j(s, this.config).init();
    }), this.handle(), this.onSubmit(), this.setInputs();
  }
  disableButton() {
    this.submitButton && this.submitButton.setAttribute("disabled", "true");
  }
  enableButton() {
    this.submitButton && this.submitButton.removeAttribute("disabled");
  }
  handle() {
    const e = () => {
      this.isValid() ? this.enableButton() : this.disableButton();
    };
    ["change", "qv.input.validated"].forEach((s) => {
      this.container.addEventListener(s, (r) => {
        r.stopPropagation(), e(), this.setInputs();
      });
    });
  }
  /**
   * Check if the form is valid
   * @returns
   */
  isValid() {
    return [
      ...this.container.querySelectorAll("[data-qv-rules]")
    ].every((s) => new j(s).valid());
  }
  /**
   * Handle validation befor process submtion
   */
  onSubmit() {
    this.container.addEventListener("submit", (e) => {
      this.container.querySelectorAll("[data-qv-rules]").forEach((s) => {
        new j(s, this.config, !1).validate();
      }), this.isValid() || e.preventDefault();
    });
  }
  setInputs() {
    this.container.querySelectorAll("[data-qv-rules]").forEach((e) => {
      const s = new j(e);
      this.inputs[s.getName()] = s.getValue();
    });
  }
  /**
   * Add new rule
   * @param ruleName
   * @param call
   * @param message
   */
  rule(e, s, r) {
    C.rule(e, s, r);
  }
  setConfig(e) {
    this.config = z, e && typeof e == "object" && (this.config = I(I({}, this.config), e));
  }
}
class Xe {
  constructor() {
    this.config = z;
  }
  /**
   * Select all the form in the document and apply QvForm for them
   * @param config
   */
  init(e) {
    this.setConfig(e), document.querySelectorAll("form").forEach((s) => {
      new $e(s).init(this.config);
    });
  }
  /**
   * Adds a new validation rule to Quickv's rule bag.
   * @param ruleName The name of the rule.
   * @param call The rule callback function.
   * @param message Optional error message for the rule.
   * Example:
   * ```
   * quickv.rule('customRule', (value) => value === 'foo', 'Value must be "foo"');
   * ```
   */
  rule(e, s, r) {
    C.rule(e, s, r);
  }
  setConfig(e) {
    this.config = z, e && typeof e == "object" && (this.config = I(I({}, this.config), e));
  }
}
class se {
  constructor() {
    this.rulesBag = C.allRules(), this.errors = [];
  }
  validate(e, s) {
    if (!Array.isArray(s))
      throw new Error("The rule provided must be an array of Rule");
    return s.forEach((r) => {
      const { ruleName: l, params: d } = this.getRule(r), f = this.rulesBag[l];
      if (!f)
        throw new Error(`The rule ${l} is not defined`);
      f(e, d) || this.errors.push(l);
    }), !this.hasErrors();
  }
  getRule(e) {
    return fe(e);
  }
  getErrors() {
    return this.errors;
  }
  hasErrors() {
    return this.errors.length > 0;
  }
  isValid() {
    return !this.hasErrors();
  }
  setRules(e) {
    this.rulesBag = I(I({}, this.rulesBag), e);
  }
  getRules() {
    return this.rulesBag;
  }
}
var ue, he, ce;
typeof window != "undefined" && (window.QvInput = (ue = window.QvInput) != null ? ue : j, window.QvForm = (he = window.QvForm) != null ? he : $e, window.Quickv = (ce = window.Quickv) != null ? ce : Xe);
export {
  Xe as Quickv,
  z as QvConfig,
  $e as QvForm,
  j as QvInput
};
