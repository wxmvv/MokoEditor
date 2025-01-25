/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable prefer-const */
/* eslint-disable prefer-rest-params */
/* eslint-disable for-direction */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-unused-expressions */
(() => {
	"use strict";
	function t() {
		function t(t, e, n) {
			Object.defineProperty(t, e, { value: n, enumerable: !1, configurable: !0, writable: !0 });
		}
		function e(t, e, n) {
			Object.defineProperty(t, e, { get: n, enumerable: !1, configurable: !0 });
		}
		for (let n = window, r = 0, o = ["TouchEvent"]; r < o.length; r++) {
			const i = o[r];
			void 0 === n[i] && (n[i] = function () {});
		}
		try {
			const s = window.matchMedia;
			s &&
				!s("(prefers-color-scheme: dark)").addEventListener &&
				(window.matchMedia = function (t) {
					const e = s(t);
					return (
						e.addEventListener ||
							(e.addEventListener = function (t, e) {
								this.addListener(e);
							}),
						e.removeEventListener ||
							(e.removeEventListener = function (t, e) {
								this.removeListener(e);
							}),
						e
					);
				});
		} catch (t) {
			console.error(t);
		}
		window.ResizeObserver ||
			(window.ResizeObserver = (function () {
				function t() {}
				return (t.prototype.observe = function () {}), (t.prototype.unobserve = function () {}), (t.prototype.disconnect = function () {}), t;
			})()),
			Object.isEmpty ||
				t(Object, "isEmpty", function (t) {
					for (const e in t) if (t.hasOwnProperty(e)) return !1;
					return !0;
				}),
			Object.each ||
				(Object.each = function (t, e, n) {
					for (const r in t) if (t.hasOwnProperty(r) && !1 === e.call(n, t[r], r)) return !1;
					return !0;
				}),
			Array.combine ||
				(Array.combine = function (t) {
					for (var e = 0, n = 0, r = t; n < r.length; n++) {
						e += r[n].length;
					}
					for (var o = new Array(e), i = 0, s = 0, a = t; s < a.length; s++)
						for (let p = 0, c = a[s]; p < c.length; p++) {
							const u = c[p];
							(o[i] = u), i++;
						}
					return o;
				}),
			Array.prototype.first ||
				t(Array.prototype, "first", function () {
					if (0 !== this.length) return this[0];
				}),
			Array.prototype.last ||
				t(Array.prototype, "last", function () {
					if (0 !== this.length) return this[this.length - 1];
				}),
			Array.prototype.contains ||
				t(Array.prototype, "contains", function (t) {
					return -1 !== this.indexOf(t);
				}),
			Array.prototype.remove ||
				t(Array.prototype, "remove", function (t) {
					for (let e = this.length - 1; e >= 0; e--) this[e] === t && this.splice(e, 1);
				}),
			Array.prototype.shuffle ||
				t(Array.prototype, "shuffle", function () {
					for (var t, e, n = this.length; 0 !== n; ) (e = Math.floor(Math.random() * n)), (t = this[(n -= 1)]), (this[n] = this[e]), (this[e] = t);
					return this;
				}),
			Array.prototype.findLastIndex ||
				t(Array.prototype, "findLastIndex", function (t) {
					for (let e = this.length - 1; e <= 0; e--) if (t(this[e], e)) return e;
					return -1;
				}),
			Array.prototype.unique ||
				t(Array.prototype, "unique", function () {
					return Array.from(new Set(this).values());
				}),
			Math.clamp ||
				(Math.clamp = function (t, e, n) {
					return Math.min(Math.max(t, e), n);
				}),
			Math.square ||
				(Math.square = function (t) {
					return t * t;
				}),
			String.isString ||
				(String.isString = function (t) {
					return "string" == typeof t || t instanceof String;
				}),
			String.prototype.contains ||
				(String.prototype.contains = function (t) {
					return -1 !== this.indexOf(t);
				}),
			String.prototype.startsWith ||
				(String.prototype.startsWith = function (t, e) {
					return this.substr(!e || e < 0 ? 0 : +e, t.length) === t;
				}),
			String.prototype.endsWith ||
				(String.prototype.endsWith = function (t, e) {
					const n = void 0 === e || e > this.length ? this.length : e;
					return this.substring(n - t.length, n) === t;
				}),
			String.prototype.format ||
				(String.prototype.format = function () {
					for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
					return this.replace(/{(\d+)}/g, function (e, n) {
						return void 0 !== t[n] ? t[n] : e;
					});
				}),
			Number.isNumber ||
				t(Number, "isNumber", function (t) {
					return "number" == typeof t;
				}),
			t(window, "isBoolean", function (t) {
				return "boolean" == typeof t;
			});
		const a = function (t) {
			const e = t.nodeType;
			if (1 === e || 9 === e || 11 === e) {
				if ("string" == typeof t.textContent) return t.textContent;
				for (var n = [], r = t.firstChild; r; r = r.nextSibling) n.push(a(r));
				return n.join("");
			}
			return ((3 === e || 4 === e) && t.nodeValue) || "";
		};
		function p(t) {
			const e = this.style;
			for (const n in t) t.hasOwnProperty(n) && (e[n] = t[n]);
		}
		function c(t) {
			const e = this.style;
			for (const n in t) t.hasOwnProperty(n) && e.setProperty(n, t[n]);
		}
		(Element.prototype.getText = function () {
			return a(this);
		}),
			(Element.prototype.setText = function (t) {
				!(function (t, e) {
					if (e instanceof DocumentFragment || e instanceof Node) return t.empty(), void t.appendChild(e);
					String.isString(e) || (e = String(e));
					const n = t.nodeType;
					(1 !== n && 9 !== n && 11 !== n) || (t.textContent = e);
				})(this, t);
			}),
			(Element.prototype.addClass = function () {
				for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
				this.addClasses(t);
			}),
			(Element.prototype.addClasses = function (t) {
				if (t) for (let e = 0; e < t.length; e++) this.classList.add(t[e]);
			}),
			(Element.prototype.removeClass = function () {
				for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
				this.removeClasses(t);
			}),
			(Element.prototype.removeClasses = function (t) {
				for (let e = 0; e < t.length; e++) this.classList.remove(t[e]);
			}),
			(Element.prototype.toggleClass = function (t, e) {
				t instanceof Array || (t = [t]), e ? this.addClasses(t) : this.removeClasses(t);
			}),
			(Element.prototype.hasClass = function (t) {
				return this.classList.contains(t);
			}),
			[Element.prototype, Document.prototype, DocumentFragment.prototype].forEach(function (e) {
				t(e, "prepend", function () {
					for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
					for (var n = document.createDocumentFragment(), r = 0, o = t; r < o.length; r++) {
						const i = o[r];
						n.appendChild(i instanceof Node ? i : document.createTextNode(String(i)));
					}
					this.insertBefore(n, this.firstChild);
				});
			}),
			(Node.prototype.detach = function () {
				this.parentNode && this.parentNode.removeChild(this);
			}),
			(Node.prototype.empty = function () {
				for (; this.lastChild; ) this.removeChild(this.lastChild);
			}),
			(Node.prototype.insertAfter = function (t, e) {
				return e ? this.insertBefore(t, e.nextSibling) : this.insertBefore(t, this.firstChild), t;
			}),
			(Node.prototype.indexOf = function (t) {
				return Array.prototype.indexOf.call(this.childNodes, t);
			}),
			(Node.prototype.setChildrenInPlace = function (t) {
				for (var e = this.firstChild, n = new Set(t), r = 0, o = t; r < o.length; r++) {
					for (var i = o[r]; e && !n.has(e); ) {
						var s = e;
						(e = e.nextSibling), this.removeChild(s);
					}
					i !== e ? this.insertBefore(i, e) : (e = e.nextSibling);
				}
				for (; e; ) {
					s = e;
					(e = e.nextSibling), this.removeChild(s);
				}
			}),
			(Node.prototype.appendText = function (t) {
				this.appendChild(document.createTextNode(t));
			}),
			(Node.prototype.instanceOf = function (t) {
				if (this instanceof t) return !0;
				let e = this.win[t.name];
				return !!(e && this instanceof e) || !!((e = this.constructorWin[t.name]) && this instanceof e);
			}),
			e(Node.prototype, "doc", function () {
				return this.ownerDocument || document;
			}),
			e(Node.prototype, "win", function () {
				return this.doc.defaultView || window;
			}),
			(Node.prototype.constructorWin = window),
			(Element.prototype.setAttr = function (t, e) {
				null === e ? this.removeAttribute(t) : this.setAttribute(t, String(e));
			}),
			(Element.prototype.setAttrs = function (t) {
				for (const e in t)
					if (t.hasOwnProperty(e)) {
						const n = t[e];
						this.setAttr(e, n);
					}
			}),
			(Element.prototype.getAttr = Element.prototype.getAttribute),
			t(Element.prototype, "matchParent", function (t, e) {
				if (this.matches(t)) return this;
				if (this === e) return null;
				const n = this.parentElement;
				return n ? n.matchParent(t, e) : null;
			}),
			(Element.prototype.getCssPropertyValue = function (t, e) {
				return getComputedStyle(this, e).getPropertyValue(t).trim();
			}),
			t(Element.prototype, "isActiveElement", function () {
				for (let t = this; t; ) {
					if (t.doc.activeElement !== t) return !1;
					const e = t.win.frameElement;
					if (!e) return t.win === activeWindow;
					t = e;
				}
				return !1;
			}),
			HTMLElement.prototype.show ||
				(HTMLElement.prototype.show = function () {
					"none" === this.style.display && ((this.style.display = this.getAttribute("data-display") || ""), this.removeAttribute("data-display"));
				}),
			HTMLElement.prototype.hide ||
				(HTMLElement.prototype.hide = function () {
					const t = this.style.display;
					"none" !== t && ((this.style.display = "none"), t ? this.setAttribute("data-display", t) : this.removeAttribute("data-display"));
				}),
			HTMLElement.prototype.toggle ||
				(HTMLElement.prototype.toggle = function (t) {
					t ? this.show() : this.hide();
				}),
			HTMLElement.prototype.toggleVisibility ||
				(HTMLElement.prototype.toggleVisibility = function (t) {
					this.style.visibility = t ? "" : "hidden";
				}),
			t(HTMLElement.prototype, "isShown", function () {
				return !!this.offsetParent;
			}),
			e(HTMLElement.prototype, "innerWidth", function () {
				let t = getComputedStyle(this),
					e = parseFloat(t.paddingLeft),
					n = parseFloat(t.paddingRight);
				return isNaN(e) && (e = 0), isNaN(n) && (n = 0), this.scrollWidth - e - n;
			}),
			e(HTMLElement.prototype, "innerHeight", function () {
				let t = getComputedStyle(this),
					e = parseFloat(t.paddingTop),
					n = parseFloat(t.paddingBottom);
				return isNaN(e) && (e = 0), isNaN(n) && (n = 0), this.scrollHeight - e - n;
			}),
			t(HTMLElement.prototype, "setCssStyles", p),
			t(SVGElement.prototype, "setCssStyles", p),
			t(HTMLElement.prototype, "setCssProps", c),
			t(SVGElement.prototype, "setCssProps", c),
			t(HTMLElement.prototype, "addEventListeners", function (t) {
				for (const e in t)
					if (t.hasOwnProperty(e)) {
						const n = e,
							r = t[n];
						"function" == typeof r && this.addEventListener(n, r);
					}
			}),
			(window.fish = function (t) {
				return document.querySelector(t);
			}),
			(window.fishAll = function (t) {
				return Array.prototype.slice.call(document.querySelectorAll(t));
			}),
			(Element.prototype.find = function (t) {
				return this.querySelector(t);
			}),
			(Element.prototype.findAll = function (t) {
				return Array.prototype.slice.call(this.querySelectorAll(t));
			}),
			(Element.prototype.findAllSelf = function (t) {
				const e = Array.prototype.slice.call(this.querySelectorAll(t));
				return this.matches(t) && e.unshift(this), e;
			}),
			(DocumentFragment.prototype.find = function (t) {
				return this.querySelector(t);
			}),
			(DocumentFragment.prototype.findAll = function (t) {
				return Array.prototype.slice.call(this.querySelectorAll(t));
			}),
			(Node.prototype.createEl = function (t, e, n) {
				return "string" == typeof e && (e = { cls: e }), ((e = e || {}).parent = this), createEl(t, e, n);
			}),
			(Node.prototype.createDiv = function (t, e) {
				return this.createEl("div", t, e);
			}),
			(Node.prototype.createSpan = function (t, e) {
				return this.createEl("span", t, e);
			}),
			(Node.prototype.createSvg = function (t, e, n) {
				return "string" == typeof e && (e = { cls: e }), ((e = e || {}).parent = this), createSvg(t, e, n);
			}),
			// (Node.prototype.addSvgIcon = function (t, e, n) {
			// 	return "string" == typeof e && (e = { cls: e }), ((e = e || {}).parent = this), createSvg(t, e, n);
			// }),
			(window.createEl = function (t, e, n) {
				const r = document.createElement(t);
				"string" == typeof e && (e = { cls: e });
				const o = e || {},
					i = o.cls,
					s = o.text,
					a = o.attr,
					p = o.title,
					c = o.value,
					u = o.placeholder,
					l = o.type,
					f = o.parent,
					d = o.prepend,
					h = o.href;
				for (const y in (i && (Array.isArray(i) ? (r.className = i.join(" ")) : (r.className = i)),
				s && r.setText(s),
				a && r.setAttrs(a),
				void 0 !== p && (r.title = p),
				void 0 !== c && (r instanceof HTMLInputElement || r instanceof HTMLSelectElement || r instanceof HTMLOptionElement) && (r.value = c),
				l && r instanceof HTMLInputElement && (r.type = l),
				l && r instanceof HTMLStyleElement && r.setAttribute("type", l),
				u && r instanceof HTMLInputElement && (r.placeholder = u),
				h && (r instanceof HTMLAnchorElement || r instanceof HTMLLinkElement || r instanceof HTMLBaseElement) && (r.href = h),
				n && n(r),
				f && (d ? f.insertBefore(r, f.firstChild) : f.appendChild(r)),
				e))
					if (e.hasOwnProperty(y) && y.startsWith("on")) {
						const m = y,
							v = e[m];
						"function" == typeof v && r.addEventListener(m.substring(2), v);
					}
				return r;
			}),
			(window.createDiv = function (t, e) {
				return createEl("div", t, e);
			}),
			(window.createSpan = function (t, e) {
				return createEl("span", t, e);
			}),
			(window.createSvg = function (t, e, n) {
				let r,
					o = document.createElementNS("http://www.w3.org/2000/svg", t);
				"string" == typeof e && (e = { cls: e });
				const i = e || {},
					s = i.cls,
					a = i.attr,
					p = i.parent,
					c = i.prepend;
				return (
					s && (Array.isArray(s) ? (r = o.classList).add.apply(r, s) : o.classList.add(s)), a && o.setAttrs(a), n && n(o), p && (c ? p.insertBefore(o, p.firstChild) : p.appendChild(o)), o
				);
			}),
			(window.createFragment = function (t) {
				const e = document.createDocumentFragment();
				return t && t(e), e;
			});
		const u = function (t, e, n, r) {
				let o = this._EVENTS;
				o || ((o = {}), (this._EVENTS = o));
				let i = o[t];
				i || ((i = []), (o[t] = i));
				const s = function (t) {
					const r = t.target;
					if (r.matchParent) {
						const o = r.matchParent(e, t.currentTarget);
						o && n.call(this, t, o);
					}
				};
				i.push({ selector: e, listener: n, options: r, callback: s }), this.addEventListener(t, s, r);
			},
			l = function (t, e, n, r) {
				const o = this,
					i = this._EVENTS;
				if (i) {
					const s = i[t];
					s &&
						(i[t] = s.filter(function (i) {
							if (i.selector === e && i.listener === n && i.options === r) {
								const s = i.callback;
								return o.removeEventListener(t, s, r), !1;
							}
							return !0;
						}));
				}
			};
		(HTMLElement.prototype.on = u),
			(HTMLElement.prototype.off = l),
			(Document.prototype.on = u),
			(Document.prototype.off = l),
			(HTMLElement.prototype.onClickEvent = function (t, e) {
				this.addEventListener("click", t, e), this.addEventListener("auxclick", t, e);
			}),
			(HTMLElement.prototype.trigger = function (t) {
				const e = document.createEvent("HTMLEvents");
				e.initEvent(t, !0, !1), this.dispatchEvent(e);
			}),
			e(UIEvent.prototype, "targetNode", function () {
				return this.target;
			}),
			e(UIEvent.prototype, "win", function () {
				return this.view || window;
			}),
			e(UIEvent.prototype, "doc", function () {
				return this.win.document;
			}),
			(UIEvent.prototype.instanceOf = function (t) {
				if (this instanceof t) return !0;
				const e = this.view;
				if (!e) return !1;
				const n = e[t.name];
				return !(!n || n === t) && this instanceof n;
			});
		const f = new WeakMap();
		(HTMLElement.prototype.onNodeInserted = function (t, e) {
			var n = this,
				r = function (r) {
					n.isShown() && (e && o(), "node-inserted" === r.animationName && t());
				},
				o = function () {
					n.removeEventListener("animationstart", r);
					const t = (f.get(n) || 0) - 1;
					t <= 0 ? (f.delete(n), n.removeClass("node-insert-event")) : f.set(n, t);
				};
			return f.set(this, (f.get(this) || 0) + 1), this.addClass("node-insert-event"), this.addEventListener("animationstart", r), o;
		}),
			(HTMLElement.prototype.onWindowMigrated = function (t) {
				let e = this,
					n = this.win;
				return this.onNodeInserted(function () {
					const r = e.win;
					r !== n && t((n = r));
				});
			}),
			(window.ajax = function (t) {
				let e = t.method,
					n = t.url,
					r = t.success,
					o = t.error,
					i = t.data,
					s = t.headers,
					a = t.withCredentials;
				e = e || "GET";
				const p = new XMLHttpRequest();
				if (
					((t.req = p),
					p.open(e, n, !0),
					(p.onload = function () {
						const t = p.status,
							e = p.response;
						t >= 200 && t < 400 ? r && r(e, p) : o && o(e, p);
					}),
					(p.onerror = function (t) {
						o && o(t, p);
					}),
					s)
				)
					for (const c in s) s.hasOwnProperty(c) && p.setRequestHeader(c, s[c]);
				(p.withCredentials = a || !1),
					i
						? (void 0 === a && (p.withCredentials = !0),
						  String.isString(i)
								? p.send(i)
								: i instanceof ArrayBuffer
								? (p.setRequestHeader("Content-Type", "application/octet-stream"), p.send(i))
								: (p.setRequestHeader("Content-Type", "application/json; charset=utf-8"), p.send(JSON.stringify(i))))
						: p.send();
			}),
			(window.ajaxPromise = function (t) {
				return new Promise(function (e, n) {
					(t.success = e),
						(t.error = function (t, e) {
							return n(e);
						}),
						ajax(t);
				});
			}),
			(window.ready = function (t) {
				"loading" !== document.readyState ? t() : document.addEventListener("DOMContentLoaded", t);
			}),
			(window.sleep = function (t) {
				return new Promise(function (e) {
					return window.setTimeout(e, t);
				});
			}),
			(window.nextFrame = function () {
				return new Promise(function (t) {
					return window.requestAnimationFrame(function () {
						return t();
					});
				});
			}),
			(window.activeWindow = window),
			(window.activeDocument = document);
	}
	t(), (window.globalEnhance = t);
})();
