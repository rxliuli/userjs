// ==UserScript==
// @name 解除网页限制
// @namespace http://github.com/rxliuli/userjs
// @version 2.4.2
// @description 破解禁止复制/剪切/粘贴/选择/右键菜单的网站
// @author rxliuli
// @include *
// @connect userjs.rxliuli.com
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_deleteValue
// @grant GM_listValues
// @grant GM_registerMenuCommand
// @grant GM_addStyle
// @grant GM_xmlhttpRequest
// @grant unsafeWindow
// @run-at document-start
// @license MIT
// ==/UserScript==

(() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };

  // src/util/safeExec.ts
  function safeExec(fn, defaultVal, ...args) {
    const defRes = defaultVal === void 0 ? null : defaultVal;
    try {
      const res = fn(...args);
      return res instanceof Promise ? res.catch(() => defRes) : res;
    } catch (err) {
      return defRes;
    }
  }

  // src/util/compatibleAsync.ts
  function compatibleAsync(res, callback) {
    return res instanceof Promise ? res.then(callback) : callback(res);
  }

  // src/util/onceOfCycle.ts
  var LastUpdateKey = "LastUpdate";
  var LastValueKey = "LastValue";
  function onceOfCycle(fn, time) {
    const get = window.GM_getValue.bind(window);
    const set = window.GM_setValue.bind(window);
    return new Proxy(fn, {
      apply(_, _this, args) {
        const now = Date.now();
        const last = get(LastUpdateKey);
        if (![null, void 0, "null", "undefined"].includes(last) && now - last < time) {
          return safeExec(() => JSON.parse(get(LastValueKey)), 1);
        }
        return compatibleAsync(Reflect.apply(_, _this, args), (res) => {
          set(LastUpdateKey, now);
          set(LastValueKey, JSON.stringify(res));
          return res;
        });
      }
    });
  }

  // src/index.ts
  var _UnblockLimit = class {
    static watchEventListener() {
      const documentAddEventListener = document.addEventListener;
      const eventTargetAddEventListener = EventTarget.prototype.addEventListener;
      const proxyHandler = {
        apply(target, thisArg, [type, listener, useCapture]) {
          const $addEventListener = target instanceof Document ? documentAddEventListener : eventTargetAddEventListener;
          if (_UnblockLimit.eventTypes.includes(type)) {
            console.log("\u62E6\u622A addEventListener: ", type, this);
            return;
          }
          Reflect.apply($addEventListener, thisArg, [type, listener, useCapture]);
        }
      };
      document.addEventListener = new Proxy(documentAddEventListener, proxyHandler);
      EventTarget.prototype.addEventListener = new Proxy(eventTargetAddEventListener, proxyHandler);
    }
    static proxyKeyEventListener() {
      const documentAddEventListener = document.addEventListener;
      const eventTargetAddEventListener = EventTarget.prototype.addEventListener;
      const keyProxyHandler = {
        apply(target, thisArg, argArray) {
          const ev = argArray[0];
          const proxyKey = ["c", "x", "v", "a"];
          const proxyAssistKey = ["Control", "Alt"];
          if (ev.ctrlKey && proxyKey.includes(ev.key) || proxyAssistKey.includes(ev.key)) {
            console.log("\u5DF2\u963B\u6B62: ", ev.ctrlKey, ev.altKey, ev.key);
            return;
          }
          if (ev.altKey) {
            return;
          }
          Reflect.apply(target, thisArg, argArray);
        }
      };
      const proxyHandler = {
        apply(target, thisArg, [type, listener, useCapture]) {
          const $addEventListener = target instanceof Document ? documentAddEventListener : eventTargetAddEventListener;
          Reflect.apply($addEventListener, thisArg, [
            type,
            _UnblockLimit.keyEventTypes.includes(type) ? new Proxy(listener, keyProxyHandler) : listener,
            useCapture
          ]);
        }
      };
      document.addEventListener = new Proxy(documentAddEventListener, proxyHandler);
      EventTarget.prototype.addEventListener = new Proxy(eventTargetAddEventListener, proxyHandler);
    }
    static clearJsOnXXXEvent() {
      const emptyFunc = () => {
      };
      function modifyPrototype(prototype, type) {
        Object.defineProperty(prototype, `on${type}`, {
          get() {
            return emptyFunc;
          },
          set() {
            return true;
          }
        });
      }
      _UnblockLimit.eventTypes.forEach((type) => {
        modifyPrototype(HTMLElement.prototype, type);
        modifyPrototype(document, type);
      });
    }
    static clearDomOnXXXEvent() {
      function _innerClear() {
        _UnblockLimit.eventTypes.forEach((type) => {
          document.querySelectorAll(`[on${type}]`).forEach((el) => el.setAttribute(`on${type}`, "return true"));
        });
      }
      setInterval(_innerClear, 3e3);
    }
    static clearCSS() {
      GM_addStyle(`html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed,
figure, figcaption, footer, header, hgroup,
menu, nav, output, ruby, section, summary,
time, mark, audio, video, html body * {
  -webkit-user-select: text !important;
  -moz-user-select: text !important;
  user-select: text !important;
}

::-moz-selection {
  color: #111 !important;
  background: #05d3f9 !important;
}

::selection {
  color: #111 !important;
  background: #05d3f9 !important;
}
`);
    }
  };
  var UnblockLimit = _UnblockLimit;
  __publicField(UnblockLimit, "eventTypes", [
    "copy",
    "cut",
    "paste",
    "select",
    "selectstart",
    "contextmenu",
    "dragstart",
    "mousedown"
  ]);
  __publicField(UnblockLimit, "keyEventTypes", [
    "keydown",
    "keypress",
    "keyup"
  ]);
  var _BlockHost = class {
    static fetchHostList() {
      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: "GET",
          url: "https://userjs.rxliuli.com/blockList.json",
          headers: {
            "Cache-Control": "no-cache"
          },
          onload(res) {
            const list = JSON.parse(res.responseText);
            resolve(list);
            console.info("\u66F4\u65B0\u914D\u7F6E\u6210\u529F: ", list);
          },
          onerror(e) {
            reject(e);
            console.error("\u66F4\u65B0\u914D\u7F6E\u5931\u8D25: ", e);
          }
        });
      });
    }
    static updateHostList(hostList) {
      hostList.filter((config) => GM_getValue(JSON.stringify(config)) === void 0).forEach((domain) => {
        console.log("\u66F4\u65B0\u4E86\u5C4F\u853D\u57DF\u540D: ", domain);
        GM_setValue(JSON.stringify(domain), true);
      });
    }
    static findKey() {
      return GM_listValues().filter((config) => GM_getValue(config)).find((configStr) => {
        const config = safeExec(() => JSON.parse(configStr), {
          type: "domain",
          url: configStr
        });
        return this.match(new URL(location.href), config);
      });
    }
    static match(href, config) {
      if (typeof config === "string") {
        return href.host.includes(config);
      } else {
        const { type, url } = config;
        switch (type) {
          case "domain":
            return href.host === url;
          case "link":
            return href.href === url;
          case "linkPrefix":
            return href.href.startsWith(url);
          case "regex":
            return new RegExp(url).test(href.href);
        }
      }
    }
  };
  var BlockHost = _BlockHost;
  __publicField(BlockHost, "updateBlockHostList", onceOfCycle(async () => {
    _BlockHost.updateHostList(await _BlockHost.fetchHostList());
  }, 1e3 * 60 * 60 * 24));
  var MenuHandler = class {
    static register() {
      const findKey = BlockHost.findKey();
      const key = findKey || JSON.stringify({
        type: "domain",
        url: location.host
      });
      console.log("key: ", key);
      GM_registerMenuCommand(findKey ? "\u6062\u590D\u9ED8\u8BA4" : "\u89E3\u9664\u9650\u5236", () => {
        GM_setValue(key, !GM_getValue(key));
        console.log("isBlock: ", key, GM_getValue(key));
        location.reload();
      });
    }
  };
  var ConfigBlockApi = class {
    listKey() {
      return GM_listValues().filter((key) => ![LastUpdateKey, LastValueKey].includes(key));
    }
    list() {
      return this.listKey().map((config) => ({
        ...safeExec(() => JSON.parse(config), {
          type: "domain",
          url: config
        }),
        enable: GM_getValue(config),
        key: config
      }));
    }
    switch(key) {
      console.log("ConfigBlockApi.switch: ", key);
      GM_setValue(key, !GM_getValue(key));
    }
    remove(key) {
      console.log("ConfigBlockApi.remove: ", key);
      GM_deleteValue(key);
    }
    add(config) {
      console.log("ConfigBlockApi.add: ", config);
      GM_setValue(JSON.stringify(config), true);
    }
    clear() {
      const delKeyList = this.listKey();
      console.log("ConfigBlockApi.clear: ", delKeyList);
      delKeyList.forEach(GM_deleteValue);
    }
    async update() {
      await BlockHost.updateHostList(await BlockHost.fetchHostList());
    }
  };
  var Application = class {
    start() {
      MenuHandler.register();
      if (BlockHost.findKey()) {
        UnblockLimit.watchEventListener();
        UnblockLimit.proxyKeyEventListener();
        UnblockLimit.clearJsOnXXXEvent();
      }
      BlockHost.updateBlockHostList();
      window.addEventListener("load", function() {
        if (BlockHost.findKey()) {
          UnblockLimit.clearDomOnXXXEvent();
          UnblockLimit.clearCSS();
        }
      });
      if (location.href.startsWith("https://userjs.rxliuli.com/") || location.hostname === "127.0.0.1") {
        Reflect.set(unsafeWindow, "com.rxliuli.UnblockWebRestrictions.configBlockApi", new ConfigBlockApi());
      }
    }
  };
  new Application().start();
})();
