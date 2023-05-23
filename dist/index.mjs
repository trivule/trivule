var _e = Object.defineProperty;
var ae = Object.getOwnPropertySymbols;
var Te = Object.prototype.hasOwnProperty, Ce = Object.prototype.propertyIsEnumerable;
var le = (t, e, s) => e in t ? _e(t, e, { enumerable: !0, configurable: !0, writable: !0, value: s }) : t[e] = s, T = (t, e) => {
  for (var s in e || (e = {}))
    Te.call(e, s) && le(t, s, e[s]);
  if (ae)
    for (var s of ae(e))
      Ce.call(e, s) && le(t, s, e[s]);
  return t;
};
const k = {
  invalidClass: "is-invalid",
  // Default invalid class for all input
  validClass: ""
  //Default valid class for all input
}, X = (t) => {
  const e = /^(\w+):(.+)$/, s = t.match(e);
  if (s) {
    const i = s[1];
    let l = s[2];
    return { ruleName: i, params: l };
  } else {
    const [i, l] = t.split(":");
    return { ruleName: i, params: l };
  }
}, O = (t, e = ",") => typeof t != "string" ? [] : t.split(e).map((s) => s.trim()), j = (t) => {
  throw new Error(`Please provide <<${t}>> rule arguments`);
}, A = (t) => t instanceof File || t instanceof Blob, Z = (t, e) => {
  if (A(t)) {
    const i = t.size;
    let l;
    const d = e == null ? void 0 : e.match(/^(\d+(\.\d+)?)\s*(B|KB|MB|GB)$/i);
    if (!d)
      throw new Error(
        "Invalid maxSize format. Please use valid format like '1KB', '1MB', etc."
      );
    const o = parseFloat(d[1]), p = d[3].toUpperCase();
    return p === "KB" ? l = o * 1024 : p === "MB" ? l = o * 1024 * 1024 : p === "GB" ? l = o * 1024 * 1024 * 1024 : l = o, i <= l;
  } else
    return !1;
}, te = (t, e) => {
  if (A(t)) {
    const i = t.size;
    let l;
    const d = e == null ? void 0 : e.match(/^(\d+(\.\d+)?)\s*(B|KB|MB|GB)$/i);
    if (!d)
      throw new Error(
        "Invalid minSize format. Please use valid format like '1KB', '1MB', etc."
      );
    const o = parseFloat(d[1]), p = d[3].toUpperCase();
    return p === "KB" ? l = o * 1024 : p === "MB" ? l = o * 1024 * 1024 : p === "GB" ? l = o * 1024 * 1024 * 1024 : l = o, i >= l;
  } else
    return !1;
};
var Se = typeof globalThis != "undefined" ? globalThis : typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : {};
function De(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var ce = { exports: {} };
(function(t, e) {
  (function(s, i) {
    t.exports = i();
  })(Se, function() {
    var s = 1e3, i = 6e4, l = 36e5, d = "millisecond", o = "second", p = "minute", C = "hour", $ = "day", H = "week", _ = "month", ie = "quarter", B = "year", x = "date", re = "Invalid Date", Ee = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/, Me = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g, ye = { name: "en", weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"), ordinal: function(u) {
      var a = ["th", "st", "nd", "rd"], r = u % 100;
      return "[" + u + (a[(r - 20) % 10] || a[r] || a[0]) + "]";
    } }, G = function(u, a, r) {
      var h = String(u);
      return !h || h.length >= a ? u : "" + Array(a + 1 - h.length).join(r) + u;
    }, $e = { s: G, z: function(u) {
      var a = -u.utcOffset(), r = Math.abs(a), h = Math.floor(r / 60), n = r % 60;
      return (a <= 0 ? "+" : "-") + G(h, 2, "0") + ":" + G(n, 2, "0");
    }, m: function u(a, r) {
      if (a.date() < r.date())
        return -u(r, a);
      var h = 12 * (r.year() - a.year()) + (r.month() - a.month()), n = a.clone().add(h, _), c = r - n < 0, f = a.clone().add(h + (c ? -1 : 1), _);
      return +(-(h + (r - n) / (c ? n - f : f - n)) || 0);
    }, a: function(u) {
      return u < 0 ? Math.ceil(u) || 0 : Math.floor(u);
    }, p: function(u) {
      return { M: _, y: B, w: H, d: $, D: x, h: C, m: p, s: o, ms: d, Q: ie }[u] || String(u || "").toLowerCase().replace(/s$/, "");
    }, u: function(u) {
      return u === void 0;
    } }, V = "en", I = {};
    I[V] = ye;
    var K = function(u) {
      return u instanceof Y;
    }, Q = function u(a, r, h) {
      var n;
      if (!a)
        return V;
      if (typeof a == "string") {
        var c = a.toLowerCase();
        I[c] && (n = c), r && (I[c] = r, n = c);
        var f = a.split("-");
        if (!n && f.length > 1)
          return u(f[0]);
      } else {
        var m = a.name;
        I[m] = a, n = m;
      }
      return !h && n && (V = n), n || !h && V;
    }, w = function(u, a) {
      if (K(u))
        return u.clone();
      var r = typeof a == "object" ? a : {};
      return r.date = u, r.args = arguments, new Y(r);
    }, g = $e;
    g.l = Q, g.i = K, g.w = function(u, a) {
      return w(u, { locale: a.$L, utc: a.$u, x: a.$x, $offset: a.$offset });
    };
    var Y = function() {
      function u(r) {
        this.$L = Q(r.locale, null, !0), this.parse(r);
      }
      var a = u.prototype;
      return a.parse = function(r) {
        this.$d = function(h) {
          var n = h.date, c = h.utc;
          if (n === null)
            return /* @__PURE__ */ new Date(NaN);
          if (g.u(n))
            return /* @__PURE__ */ new Date();
          if (n instanceof Date)
            return new Date(n);
          if (typeof n == "string" && !/Z$/i.test(n)) {
            var f = n.match(Ee);
            if (f) {
              var m = f[2] - 1 || 0, b = (f[7] || "0").substring(0, 3);
              return c ? new Date(Date.UTC(f[1], m, f[3] || 1, f[4] || 0, f[5] || 0, f[6] || 0, b)) : new Date(f[1], m, f[3] || 1, f[4] || 0, f[5] || 0, f[6] || 0, b);
            }
          }
          return new Date(n);
        }(r), this.$x = r.x || {}, this.init();
      }, a.init = function() {
        var r = this.$d;
        this.$y = r.getFullYear(), this.$M = r.getMonth(), this.$D = r.getDate(), this.$W = r.getDay(), this.$H = r.getHours(), this.$m = r.getMinutes(), this.$s = r.getSeconds(), this.$ms = r.getMilliseconds();
      }, a.$utils = function() {
        return g;
      }, a.isValid = function() {
        return this.$d.toString() !== re;
      }, a.isSame = function(r, h) {
        var n = w(r);
        return this.startOf(h) <= n && n <= this.endOf(h);
      }, a.isAfter = function(r, h) {
        return w(r) < this.startOf(h);
      }, a.isBefore = function(r, h) {
        return this.endOf(h) < w(r);
      }, a.$g = function(r, h, n) {
        return g.u(r) ? this[h] : this.set(n, r);
      }, a.unix = function() {
        return Math.floor(this.valueOf() / 1e3);
      }, a.valueOf = function() {
        return this.$d.getTime();
      }, a.startOf = function(r, h) {
        var n = this, c = !!g.u(h) || h, f = g.p(r), m = function(L, M) {
          var R = g.w(n.$u ? Date.UTC(n.$y, M, L) : new Date(n.$y, M, L), n);
          return c ? R : R.endOf($);
        }, b = function(L, M) {
          return g.w(n.toDate()[L].apply(n.toDate("s"), (c ? [0, 0, 0, 0] : [23, 59, 59, 999]).slice(M)), n);
        }, v = this.$W, E = this.$M, N = this.$D, D = "set" + (this.$u ? "UTC" : "");
        switch (f) {
          case B:
            return c ? m(1, 0) : m(31, 11);
          case _:
            return c ? m(1, E) : m(0, E + 1);
          case H:
            var z = this.$locale().weekStart || 0, F = (v < z ? v + 7 : v) - z;
            return m(c ? N - F : N + (6 - F), E);
          case $:
          case x:
            return b(D + "Hours", 0);
          case C:
            return b(D + "Minutes", 1);
          case p:
            return b(D + "Seconds", 2);
          case o:
            return b(D + "Milliseconds", 3);
          default:
            return this.clone();
        }
      }, a.endOf = function(r) {
        return this.startOf(r, !1);
      }, a.$set = function(r, h) {
        var n, c = g.p(r), f = "set" + (this.$u ? "UTC" : ""), m = (n = {}, n[$] = f + "Date", n[x] = f + "Date", n[_] = f + "Month", n[B] = f + "FullYear", n[C] = f + "Hours", n[p] = f + "Minutes", n[o] = f + "Seconds", n[d] = f + "Milliseconds", n)[c], b = c === $ ? this.$D + (h - this.$W) : h;
        if (c === _ || c === B) {
          var v = this.clone().set(x, 1);
          v.$d[m](b), v.init(), this.$d = v.set(x, Math.min(this.$D, v.daysInMonth())).$d;
        } else
          m && this.$d[m](b);
        return this.init(), this;
      }, a.set = function(r, h) {
        return this.clone().$set(r, h);
      }, a.get = function(r) {
        return this[g.p(r)]();
      }, a.add = function(r, h) {
        var n, c = this;
        r = Number(r);
        var f = g.p(h), m = function(E) {
          var N = w(c);
          return g.w(N.date(N.date() + Math.round(E * r)), c);
        };
        if (f === _)
          return this.set(_, this.$M + r);
        if (f === B)
          return this.set(B, this.$y + r);
        if (f === $)
          return m(1);
        if (f === H)
          return m(7);
        var b = (n = {}, n[p] = i, n[C] = l, n[o] = s, n)[f] || 1, v = this.$d.getTime() + r * b;
        return g.w(v, this);
      }, a.subtract = function(r, h) {
        return this.add(-1 * r, h);
      }, a.format = function(r) {
        var h = this, n = this.$locale();
        if (!this.isValid())
          return n.invalidDate || re;
        var c = r || "YYYY-MM-DDTHH:mm:ssZ", f = g.z(this), m = this.$H, b = this.$m, v = this.$M, E = n.weekdays, N = n.months, D = function(M, R, J, U) {
          return M && (M[R] || M(h, c)) || J[R].slice(0, U);
        }, z = function(M) {
          return g.s(m % 12 || 12, M, "0");
        }, F = n.meridiem || function(M, R, J) {
          var U = M < 12 ? "AM" : "PM";
          return J ? U.toLowerCase() : U;
        }, L = { YY: String(this.$y).slice(-2), YYYY: this.$y, M: v + 1, MM: g.s(v + 1, 2, "0"), MMM: D(n.monthsShort, v, N, 3), MMMM: D(N, v), D: this.$D, DD: g.s(this.$D, 2, "0"), d: String(this.$W), dd: D(n.weekdaysMin, this.$W, E, 2), ddd: D(n.weekdaysShort, this.$W, E, 3), dddd: E[this.$W], H: String(m), HH: g.s(m, 2, "0"), h: z(1), hh: z(2), a: F(m, b, !0), A: F(m, b, !1), m: String(b), mm: g.s(b, 2, "0"), s: String(this.$s), ss: g.s(this.$s, 2, "0"), SSS: g.s(this.$ms, 3, "0"), Z: f };
        return c.replace(Me, function(M, R) {
          return R || L[M] || f.replace(":", "");
        });
      }, a.utcOffset = function() {
        return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
      }, a.diff = function(r, h, n) {
        var c, f = g.p(h), m = w(r), b = (m.utcOffset() - this.utcOffset()) * i, v = this - m, E = g.m(this, m);
        return E = (c = {}, c[B] = E / 12, c[_] = E, c[ie] = E / 3, c[H] = (v - b) / 6048e5, c[$] = (v - b) / 864e5, c[C] = v / l, c[p] = v / i, c[o] = v / s, c)[f] || v, n ? E : g.a(E);
      }, a.daysInMonth = function() {
        return this.endOf(_).$D;
      }, a.$locale = function() {
        return I[this.$L];
      }, a.locale = function(r, h) {
        if (!r)
          return this.$L;
        var n = this.clone(), c = Q(r, h, !0);
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
      }, u;
    }(), ne = Y.prototype;
    return w.prototype = ne, [["$ms", d], ["$s", o], ["$m", p], ["$H", C], ["$W", $], ["$M", _], ["$y", B], ["$D", x]].forEach(function(u) {
      ne[u[1]] = function(a) {
        return this.$g(a, u[0], u[1]);
      };
    }), w.extend = function(u, a) {
      return u.$i || (u(a, Y, w), u.$i = !0), w;
    }, w.locale = Q, w.isDayjs = K, w.unix = function(u) {
      return w(1e3 * u);
    }, w.en = I[V], w.Ls = I, w.p = {}, w;
  });
})(ce);
var qe = ce.exports;
const se = /* @__PURE__ */ De(qe), Be = (t) => se(t, void 0, !0).isValid(), de = (t, e) => se(t).isBefore(e), me = (t, e) => se(t).isAfter(e), Ne = (t, e) => {
  e || j("dateBetween");
  const [s, i] = O(e != null ? e : "");
  return me(t, s) && de(t, i);
}, Re = (t, ...e) => !!t, Ae = (t) => !0, Ie = (t, e) => (e || j("in"), O(e).includes(t)), Oe = (t, e) => A(t) ? Z(t, e) : ee(t, e), xe = (t) => typeof t == "boolean" || typeof t == "string" && (t = t.toLowerCase(), t === "true" || t === "false" || t === "0" || t === "1" || t === "yes" || t === "no"), Le = (t, e) => {
  var [s, i] = O(e != null ? e : "");
  return A(t) ? Z(t, i) && te(t, s) : !y(t) && !A(t) ? Ne(t, e) : (s = Number(s), i = Number(i), t !== void 0 && t !== Number && t !== "" && y(s) && y(i) ? (t = Number(t), y(t) ? be(t, i) && pe(t, s) : !1) : !1);
}, ke = (t, ...e) => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(t), ge = (t, e) => t && W(t) ? t.length >= Number(e) : !1, ve = (t, e) => t ? W(t) ? t.length <= Number(e) : !1 : !0, W = (t) => typeof t == "string", We = (t) => /^(ftp|http|https):\/\/[^ "]+$/.test(t), Ve = (t) => typeof t != "string" || t.length === 0 ? !1 : /^[A-Z]/.test(t), ze = (t) => typeof t != "string" || t.length === 0 ? !1 : /^[a-z]/.test(t), Fe = (t, e) => {
  e || j("startWith");
  const s = O(e != null ? e : "");
  return W(t) ? s.some((i) => t.startsWith(i)) : !1;
}, Pe = (t, e) => {
  e || j("endWith");
  const s = O(e != null ? e : "");
  return W(t) ? s.some((i) => t.endsWith(i)) : !1;
}, je = (t, e) => {
  e || j("contains");
  const s = O(e != null ? e : "");
  return W(t) ? s.some((i) => t.includes(i)) : !1;
}, ee = (t, e) => {
  if (!y(e))
    throw new Error("The length rule argument must be an integer");
  return e = parseInt(e), typeof t == "string" || typeof t == "number" ? t = t.toString().split("") : typeof t == "object" && t !== null && t !== void 0 && (t = []), Array.isArray(t) ? t.length === e : !1;
}, He = (t) => {
  const s = /[A-Z]/.test(t), i = /[a-z]/.test(t), l = /\d/.test(t), d = /[!@#$%^&*(),.?":{}|<>]/.test(t);
  return !(t.length < 8 || !s || !i || !l || !d);
}, pe = (t, e) => {
  if (A(t))
    return te(t, e);
  if (t == null && (t = 0), !y(e))
    throw new Error("Min rule parameter must be an integer");
  return y(t) ? Number(t) >= Number(e) : ge(t, e);
}, be = (t, e) => {
  if (A(t))
    return Z(t, e);
  if (!y(e))
    throw new Error("Min rule parameter must be an integer");
  return t == null && (t = 0), y(t) ? Number(t) <= Number(e) : ve(t, e);
}, oe = (t) => y(t) ? Number.isInteger(Number(t)) : !1, y = (t) => t === "" || t === null ? !1 : t === "0" || t === 0 || t === "1" || t === 1 ? !0 : !isNaN(Number(t)) && typeof t != "boolean" && typeof t != "object", S = class {
  /**
   * Add a custom validation rule to the rules bag
   * @param rule - The name of the custom rule
   * @param callback - The callback function for the custom rule
   * @param message - The error message for the custom rule
   */
  static rule(t, e, s) {
    S.addRule(t, e), S.addMessage(t, s != null ? s : "This input is invalide");
  }
  /**
   * Add a custom validation rule to the rules bag
   * @param rule - The name of the custom rule
   * @param callback - The callback function for the custom rule
   */
  static addRule(t, e) {
    S.rules[t] = e;
  }
  /**
   * Add a custom error message for a validation rule to the messages bag
   * @param rule - The name of the validation rule
   * @param message - The error message for the validation rule
   */
  static addMessage(t, e) {
    S.messages[t] = e;
  }
  /**
   * Check if a validation rule exists in the rules bag
   * @param rule - The name of the validation rule
   * @returns True if the rule exists, false otherwise
   */
  static hasRule(t) {
    return t in S.rules;
  }
  static getRule(t) {
    return S.rules[t];
  }
  static getMessage(t) {
    return S.messages[t];
  }
  static allRules() {
    return S.rules;
  }
  static allMessages() {
    return S.messages;
  }
};
let q = S;
q.messages = {
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
q.rules = {
  required: Re,
  email: ke,
  maxlength: ve,
  minlength: ge,
  min: pe,
  max: be,
  string: W,
  between: Le,
  startWith: Fe,
  endWith: Pe,
  contains: je,
  in: Ie,
  integer: oe,
  int: oe,
  number: y,
  numeric: y,
  url: We,
  length: ee,
  len: ee,
  file: A,
  maxFileSize: Z,
  minFileSize: te,
  size: Oe,
  boolean: xe,
  startWithUpper: Ve,
  nullable: Ae,
  startWithLower: ze,
  password: He,
  date: Be,
  before: de,
  after: me
};
class Qe {
  constructor() {
    this.messages = q.allMessages();
  }
  getRulesMessages(e) {
    const s = [];
    for (const i of e)
      this.messages[i] ? s.push(this.messages[i]) : s.push("Invalid input");
    return s;
  }
  parseMessage(e, s, i, l) {
    let d = [e, ...O(l != null ? l : "")], o = i;
    return o.includes(":field") || (d = d.slice(1)), o = this.replace(i, o, d), o;
  }
  /**
   *
   * @param messages
   * @returns
   */
  setMessages(e) {
    return this.messages = T(T({}, this.messages), e), this;
  }
  replace(e, s, i) {
    var d;
    const l = e.match(/:[a-zA-Z]+/g);
    if (l)
      for (let o = 0; o < l.length; o++) {
        const p = (d = i[o]) != null ? d : "";
        s = s.replace(l[o], p);
      }
    return s;
  }
}
class Ye {
  constructor(e, s) {
    this.rules = e, this.messages = s, this.compensateMessages(), this.sanitizeMessage();
  }
  compensateMessages() {
    var s;
    const e = this.rules.length;
    if (this.messages.length !== e)
      for (let i = 0; i < this.rules.length; i++) {
        const l = this.convertAcoladeGroupToArray((s = this.messages[i]) != null ? s : "");
        for (const d of l)
          this.messages[d] = this.messages[i];
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
      (d) => d[1].split(",").map((o) => parseInt(o.trim()))
    )[0]) != null ? l : [];
  }
  getMessages() {
    return this.messages;
  }
}
class Ue {
  constructor(e, s, i) {
    this.config = k, this.feedbackElement = null, this.rules = [], this.messages = {}, this._errors = [], this.name = "", this.showMessage = "first", this.showMessages = ["first", "full", "last"], this.validClass = "", this.invalidClass = "is-invalid", this.param = {
      emitEvent: !0,
      autoValidate: !0,
      failsOnfirst: !0,
      events: ["blur", "input", "change"]
    }, this.validator = new Ke(this.param), this.setConfig(s), this.setInputElement(e), this._setParams(i), this.setRules(i == null ? void 0 : i.rules), this.setInputName(), this.setFeedbackElement(), this.setShowMessage(), this.setInputValidationClass(), this._setErrors(), this._setEvent(i == null ? void 0 : i.events), this.validator.setParams(this.param);
  }
  /**
   *Set input rules from input
   * @returns
   */
  setRules(e) {
    var i;
    let s = (i = this.inputElement.dataset.qvRules) != null ? i : "";
    if (s)
      for (const l of s.split("|"))
        if (q.hasRule(X(l).ruleName))
          this.rules.push(l);
        else
          throw new Error(
            `The validation rule ${l} is not supported by QuickV`
          );
    return this.rules = e != null ? e : this.rules, this.param.rules = this.rules, this;
  }
  _setEvent(e) {
    const s = this.inputElement.dataset.qvEvents;
    s && (this.param.events = s.split("|").length ? s.split("|") : this.param.events), this.param.events = e != null ? e : this.param.events;
  }
  /**
   * Sets the input element for validation.
   * This method should be called before calling the 'init' method.
   * @param {ValidatableInput} inputElement - The input element or selector string representing the input element.
   * @throws {Error} If the input element is not valid or cannot be found.
   */
  setInputElement(e) {
    if (!(e instanceof Element)) {
      const s = document.querySelector(e);
      s && (e = s);
    }
    if (!(e instanceof Element))
      throw new Error(
        "The 'inputElement' parameter must be valide 'ValidatableInput' type."
      );
    this.inputElement = e;
  }
  setInputName() {
    let e = this.inputElement.name;
    if (e == null || typeof e == "string" && e.length < 0)
      throw new Error("The input name could not be empty or null");
    this.name = e;
    let s = this.name;
    this.inputElement.dataset.qvName && (s = this.inputElement.dataset.qvName), this.param.attribute = s;
  }
  set errors(e) {
    e && (this._errors = e != null ? e : []), this.showErrorMessages();
  }
  /**
   * Searches for the closest HTML element with a custom data attribute "data-qv-feedback"
   * that is associated with the current input element, and stores a reference to it.
   *
   */
  setFeedbackElement() {
    var l;
    let s = this.inputElement.parentElement, i = null;
    for (; s && !i; )
      i = s.querySelector(
        `[data-qv-feedback='${this.name}']`
      ), s = s.parentElement;
    this.feedbackElement = i, this.param.feedbackElement = (l = this.param.feedbackElement) != null ? l : i;
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
    var e, s, i, l;
    this.invalidClass = (e = this.config.invalidClass) != null ? e : "", this.validClass = (s = this.config.validClass) != null ? s : "", this.invalidClass = (i = this.inputElement.dataset.qvInvalidClass) != null ? i : this.invalidClass, this.validClass = (l = this.inputElement.dataset.qvValidClass) != null ? l : this.validClass;
  }
  setValidationClass(e) {
    const s = (l) => {
      l.length > 0 && this.inputElement.classList.remove(l);
    }, i = (l) => {
      l.length > 0 && this.inputElement.classList.add(l);
    };
    e ? (this.invalidClass.split(" ").forEach(s), this.validClass.split(" ").forEach(i), this.inputElement.setAttribute("data-qv-valid", "1")) : (this.validClass.split(" ").forEach(s), this.invalidClass.split(" ").forEach(i), this.inputElement.setAttribute("data-qv-valid", "0"));
  }
  _setErrors(e) {
    var l;
    const s = this.inputElement.dataset.qvMessages;
    let i = {};
    for (let d = 0; d < this.rules.length; d++) {
      let o = (l = s == null ? void 0 : s.split("|").map(($) => $.trim())) != null ? l : [];
      o && (o = new Ye(this.rules, o).getMessages());
      const p = o !== void 0 ? o[d] : "", C = X(this.rules[d]).ruleName;
      typeof p == "string" && p.length > 0 ? i[C] = p : i[C] = q.getMessage(C);
    }
    typeof e != "undefined" && typeof e == "object" && Object.values(e).length > 0 ? this.param.errors = e : this.param.errors = i;
  }
  getName() {
    return this.name;
  }
  getValue() {
    return this.inputElement.type.toLowerCase() == "file" ? this.inputElement.files ? this.inputElement.files[0] : null : this.inputElement.value;
  }
  setConfig(e) {
    this.config = k, e && typeof e == "object" && (this.config = T(T({}, this.config), e));
  }
  _setParams(e) {
    typeof e == "object" && typeof e != "undefined" && (this.param = T(T({}, this.param), e));
  }
}
class Ze extends Ue {
  constructor(e, s, i) {
    super(e, s, i);
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
   * console.log(messages);
   * ```
   */
  getMessages() {
    return this.validator.getMessages();
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
    return this.validator.value = this.getValue(), this.validator.passes();
  }
  /**
   * Emit event if input change
   */
  emitChangeEvent() {
    this.param.emitEvent && this.inputElement.dispatchEvent(
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
    return this.validator.getErrors();
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
  destroy() {
    var e;
    (e = this.param.events) == null || e.forEach((s) => {
      this.inputElement.removeEventListener(s, this.validate);
    });
  }
}
class P extends Ze {
  constructor(e, s, i) {
    super(e, s, i);
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
    var e;
    (e = this.param.events) == null || e.forEach((s) => {
      this.inputElement.addEventListener(s, () => {
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
  rule(e, s, i) {
    q.rule(e, s, i);
  }
  with(e) {
    this._setParams(e), this.validator.setParams(this.param);
  }
}
class we {
  constructor(e) {
    this.inputs = {}, this.config = k, this.setContainer(e);
  }
  setContainer(e) {
    if (!(e instanceof HTMLElement)) {
      const i = document.querySelector(e);
      i && (e = i);
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
      new P(s, this.config).init();
    }), this.handle(), this.onSubmit(), this.setInputs(), this.onFails((s) => {
      this.disableButton();
    }), this.onPasses((s) => {
      this.enableButton();
    });
  }
  disableButton() {
    this.submitButton && this.submitButton.setAttribute("disabled", "true");
  }
  enableButton() {
    this.submitButton && this.submitButton.removeAttribute("disabled");
  }
  handle() {
    ["change", "qv.input.validated"].forEach((e) => {
      this.on(e, (s) => {
        s.stopPropagation(), this.isValid() ? this.emit("qv.form.passes") : this.emit("qv.form.fails");
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
    ].every((s) => new P(s).valid());
  }
  /**
   * Handle validation before process submtion
   */
  onSubmit() {
    this.container.addEventListener("submit", (e) => {
      this.container.querySelectorAll("[data-qv-rules]").forEach((s) => {
        new P(s, this.config, {
          emitEvent: !1
        }).validate();
      }), this.isValid() ? this.emit("qv.form.passes") : (this.emit("qv.form.fails"), e.preventDefault());
    });
  }
  setInputs() {
    this.container.querySelectorAll("[data-qv-rules]").forEach((e) => {
      const s = new P(e);
      this.inputs[s.getName()] = s.getValue();
    });
  }
  /**
   * Add new rule
   * @param ruleName
   * @param call
   * @param message
   */
  rule(e, s, i) {
    q.rule(e, s, i);
  }
  setConfig(e) {
    this.config = k, e && typeof e == "object" && (this.config = T(T({}, this.config), e));
  }
  /**
   * Attach an event listener to the container element.
   *
   * @param e - The name of the event to listen to.
   * @param fn - The callback function to execute when the event occurs.
   * This function takes an event of type `Event` as a parameter and returns nothing.
   * Example: `(event) => { ... }`
   */
  on(e, s) {
    this.container.addEventListener(e, s);
  }
  /**
   * Emits a custom event to the container element.
   *
   * @param e - The name of the custom event to emit.
   * @param data - The additional data to pass with the event.
   */
  emit(e, s) {
    const i = new CustomEvent(e, { detail: s });
    this.container.dispatchEvent(i);
  }
  /**
   * Attaches an event listener to the "qv.form.fails" event.
   * This event is triggered when the form fails validation.
   * @param fn - The callback function to execute when the event occurs.
   * Example:
   * ```typescript
   * qvForm.onFails((e) => {
   *   console.log("Form validation failed", e);
   * });
   * ```
   */
  onFails(e) {
    this.on("qv.form.fails", e);
  }
  /**
   * Attaches an event listener to the "qv.form.passes" event.
   * This event is triggered when the form passes validation.
   * @param fn - The callback function to execute when the event occurs.
   * Example:
   * ```typescript
   * qvForm.onPasses((e) => {
   *   console.log("Form validation passed", e);
   * });
   * ```
   */
  onPasses(e) {
    this.on("qv.form.passes", e);
  }
}
class Ge {
  constructor() {
    this.config = k;
  }
  /**
   * Select all the form in the document and apply QvForm for them
   * @param config
   */
  init(e) {
    this.setConfig(e), document.querySelectorAll("form").forEach((s) => {
      new we(s).init(this.config);
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
  rule(e, s, i) {
    q.rule(e, s, i);
  }
  setConfig(e) {
    this.config = k, e && typeof e == "object" && (this.config = T(T({}, this.config), e));
  }
}
class Ke {
  constructor(e) {
    this._rules = [], this._value = void 0, this._ruleExecuted = [], this._failOnfirst = !0, this._attr = "", this._qvmessages = {}, e && this.setParams(e);
  }
  /**
   * This method performs the validation process. It iterates over the _rules array and executes each rule on the
   * _value. If _failOnfirst is set to true, the method stops executing rules after the first failure. The method
   * updates the _ruleExecuted array with the result of each rule execution.
   * It returns a boolean value indicating whether the validation passed (true) or not (false)
   * @example
   * const qvalidation = new QValidation(param)
   * qvalidation.validate()
   */
  validate() {
    const e = this._rules;
    if (!Array.isArray(e))
      throw new Error("The rule provided must be an array of Rule");
    for (const s of e) {
      const { ruleName: i, params: l } = X(s), d = q.getRule(i), o = this._makeRuleExcutedInstance(i);
      if (o.params = l, !d)
        throw new Error(`The rule ${i} is not defined`);
      if (o.wasRunWith(this._value) ? o.passed = o.passed : (o.passed = d(this._value, l), o.valueTested = this._value, o.run = !0), this._failOnfirst) {
        if (!o.passed) {
          this._parseRuleMessage(o), this._addRuleExecuted(o);
          break;
        }
      } else
        o.passed ? o.message = "" : this._parseRuleMessage(o), this._addRuleExecuted(o);
    }
    return !this.hasErrors();
  }
  getErrors() {
    var s;
    const e = {};
    for (const i of this._ruleExecuted)
      i.passed || (e[i.ruleName] = (s = i.message) != null ? s : "");
    return e;
  }
  hasErrors() {
    return this._ruleExecuted.some((e) => !e.passed);
  }
  /**
   *
   * This method is an alias for hasErrors(). It returns true if there are no errors, false otherwise
   *
   */
  passes() {
    return !this.hasErrors();
  }
  setRules(e) {
    this._rules = e;
  }
  getRules() {
    return this._rules;
  }
  /**
   * Create an instance of RuleExcuted
   * @param r
   * @returns
   */
  _makeRuleExcutedInstance(e) {
    let s = this._ruleExecuted.find((i) => i.isNamed(e));
    return s != null ? s : new Je(e);
  }
  _addRuleExecuted(e) {
    this._ruleExecuted.includes(e) || this._ruleExecuted.push(e);
  }
  _parseRuleMessage(e) {
    const s = new Qe().setMessages(
      this._qvmessages
    ), i = s.parseMessage(
      this._attr,
      e.ruleName,
      s.getRulesMessages([e.ruleName])[0],
      e.params
    );
    return e.message = i, e;
  }
  /***
   * This method returns an array of error messages from the
   * _ruleExecuted array for the rules that did not pass.
   */
  getMessages() {
    return this._ruleExecuted.filter((s) => !s.passed).map((s) => s.message);
  }
  set value(e) {
    this._value = e, this.validate();
  }
  get value() {
    return this._value;
  }
  setParams(e) {
    var s, i, l;
    this._attr = (s = e.attribute) != null ? s : "", this._failOnfirst = e.failsOnfirst !== void 0 && e.failsOnfirst, this._rules = (i = e.rules) != null ? i : [], this._qvmessages = (l = e.errors) != null ? l : {};
  }
}
class Je {
  constructor(e) {
    this.passed = !1, this.message = null, this.run = !1, this.ruleName = e;
  }
  /**
   * Returns true if for the given value, the validation was run and passed
   * @param value
   */
  wasRunWith(e) {
    return this.valueTested === e && this.run;
  }
  isNamed(e) {
    return this.ruleName === e;
  }
}
var ue, he, fe;
typeof window != "undefined" && (window.QvInput = (ue = window.QvInput) != null ? ue : P, window.QvForm = (he = window.QvForm) != null ? he : we, window.Quickv = (fe = window.Quickv) != null ? fe : Ge);
export {
  Ge as Quickv,
  k as QvConfig,
  we as QvForm,
  P as QvInput
};
