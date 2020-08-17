// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"pages/unblock/util/match.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.match = match;

function match(href, config) {
  if (typeof config === 'string') {
    return href.host.includes(config);
  } else {
    var type = config.type,
        url = config.url;

    switch (type) {
      case 'domain':
        return href.host.includes(url);

      case 'link':
        return href.href === url;

      case 'linkPrefix':
        return href.href.startsWith(url);

      case 'regex':
        return new RegExp(url).test(href.href);
    }
  }
}
},{}],"pages/unblock/constant/configTypeLabelMap.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configTypeLabelMap = void 0;
var configTypeLabelMap = {
  domain: '域名',
  link: '链接',
  linkPrefix: '链接前缀',
  regex: '正则表达式'
};
exports.configTypeLabelMap = configTypeLabelMap;
},{}],"pages/unblock/component/UnblockWebRestrictionsConfigForm.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _antd = require("antd");

var _match = require("../util/match");

var _configTypeLabelMap = require("../constant/configTypeLabelMap");

var React = _interopRequireWildcard(require("react"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/**
 * 配置新增表单
 */
var UnblockWebRestrictionsConfigForm = function UnblockWebRestrictionsConfigForm(props) {
  var _Form$useForm = _antd.Form.useForm(),
      _Form$useForm2 = _slicedToArray(_Form$useForm, 1),
      form = _Form$useForm2[0];

  function onReset() {
    form.resetFields();
  }

  function onFinish(values) {
    var _values = values;

    if (!(0, _match.match)(new URL(_values.tempUrl), _values)) {
      _antd.message.warn('测试需要匹配的 URL 未能匹配！');

      return;
    }

    window.configBlockApi.add({
      type: _values.type,
      url: _values.url
    });

    _antd.message.success('添加成功');

    props.onReload();
    onReset();
  }

  return React.createElement(_antd.Form, {
    form: form,
    onFinish: onFinish,
    layout: 'vertical'
  }, React.createElement(_antd.Form.Item, {
    label: '匹配模式',
    name: 'type',
    rules: [{
      required: true,
      message: '匹配模式没有选择'
    }]
  }, React.createElement(_antd.Select, {
    options: Object.entries(_configTypeLabelMap.configTypeLabelMap).map(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          value = _ref2[0],
          label = _ref2[1];

      return {
        label: label,
        value: value
      };
    })
  })), React.createElement(_antd.Form.Item, {
    label: '匹配值',
    name: 'url',
    rules: [{
      required: true,
      message: '匹配值不能为空'
    }]
  }, React.createElement(_antd.Input, null)), React.createElement(_antd.Form.Item, {
    label: '测试需要匹配的 URL',
    name: 'tempUrl',
    rules: [{
      required: true,
      message: '测试需要匹配的 URL 不能为空'
    }, {
      type: 'url',
      message: '测试需要匹配的 URL 必须是个 URL 啊喂 (#`O′)'
    }]
  }, React.createElement(_antd.Input, null)), React.createElement(_antd.Form.Item, null, React.createElement(_antd.Button, {
    type: "primary",
    htmlType: 'submit',
    style: {
      marginRight: 8
    }
  }, "\u63D0\u4EA4"), React.createElement(_antd.Button, {
    htmlType: 'reset',
    onClick: onReset
  }, "\u6E05\u7A7A")));
};

var _default = UnblockWebRestrictionsConfigForm;
exports.default = _default;
},{"antd":"../node_modules/antd/es/index.js","../util/match":"pages/unblock/util/match.tsx","../constant/configTypeLabelMap":"pages/unblock/constant/configTypeLabelMap.ts","react":"../node_modules/react/index.js"}],"pages/unblock/component/UnblockWebRestrictionsConfigList.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _antd = require("antd");

var _configTypeLabelMap = require("../constant/configTypeLabelMap");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/**
 * 屏蔽列表
 */
var UnblockWebRestrictionsConfigList = function UnblockWebRestrictionsConfigList(props) {
  return React.createElement("div", null, React.createElement("h2", null, "\u672C\u5730\u5C4F\u853D\u914D\u7F6E\u5217\u8868"), React.createElement(_antd.List, {
    dataSource: props.list,
    renderItem: function renderItem(config, i) {
      return React.createElement(_antd.List.Item, {
        key: i,
        actions: [React.createElement(_antd.Switch, {
          checked: config.enable,
          onChange: function onChange() {
            return props.onSwitch(config);
          }
        }), React.createElement(_antd.Button, {
          type: 'danger',
          onClick: function onClick() {
            return props.onRemove(config);
          }
        }, "\u5220\u9664")]
      }, React.createElement(_antd.List.Item.Meta, {
        title: React.createElement("div", null, React.createElement(_antd.Tag, null, _configTypeLabelMap.configTypeLabelMap[config.type]), React.createElement("span", {
          style: {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          },
          title: config.url
        }, config.type === 'regex' ? config.url : React.createElement("a", {
          href: (config.type === 'domain' ? 'https://' : '') + config.url
        }, config.url))),
        description: React.createElement("div", null, config.enable)
      }));
    }
  }));
};

var _default = UnblockWebRestrictionsConfigList;
exports.default = _default;
},{"react":"../node_modules/react/index.js","antd":"../node_modules/antd/es/index.js","../constant/configTypeLabelMap":"pages/unblock/constant/configTypeLabelMap.ts"}],"pages/unblock/UnblockWebRestrictionsConfig.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _antd = require("antd");

var _UnblockWebRestrictionsConfigForm = _interopRequireDefault(require("./component/UnblockWebRestrictionsConfigForm"));

var _UnblockWebRestrictionsConfigList = _interopRequireDefault(require("./component/UnblockWebRestrictionsConfigList"));

var _BasicLayoutCard = _interopRequireDefault(require("../../components/layout/BasicLayoutCard"));

var _LayoutEmpty = _interopRequireDefault(require("../../components/layout/LayoutEmpty"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var configBlockApi = window['com.rxliuli.UnblockWebRestrictions.configBlockApi'];

var UnblockWebRestrictionsConfig = function UnblockWebRestrictionsConfig() {
  if (!configBlockApi) {
    return React.createElement(_LayoutEmpty.default, {
      title: "\u60A8\u8FD8\u672A\u5B89\u88C5\u89E3\u9664\u7F51\u9875\u7981\u6B62\u590D\u5236/\u7C98\u8D34\u7684\u811A\u672C",
      href: 'https://greasyfork.org/zh-CN/scripts/391193'
    });
  }

  var _useState = (0, React.useState)(function () {
    return configBlockApi.list();
  }),
      _useState2 = _slicedToArray(_useState, 2),
      configList = _useState2[0],
      setConfigList = _useState2[1];

  function handleReload() {
    var list = configBlockApi.list();
    setConfigList(list);
    console.log('reload: ', list);
  }

  function handleClear() {
    configBlockApi.clear();
    handleReload();

    _antd.message.success('清空成功');
  }

  function handleUpdate() {
    return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return configBlockApi.update();

            case 2:
              handleReload();

              _antd.message.success('更新成功');

            case 4:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
  }

  function handleRemove(config) {
    console.log('remove key: ', config.key);
    configBlockApi.remove(config.key);
    handleReload();

    _antd.message.success('删除成功');
  }

  function handleSwitch(config) {
    console.log('handleSwitch: ', config);
    configBlockApi.switch(config.key);
    handleReload();
  }

  return React.createElement(_BasicLayoutCard.default, {
    title: '配置页',
    extra: React.createElement("div", null, React.createElement(_antd.Button, {
      type: "primary",
      onClick: handleClear,
      style: {
        marginRight: 8
      }
    }, "\u6E05\u7A7A"), React.createElement(_antd.Button, {
      type: "primary",
      onClick: handleUpdate
    }, "\u66F4\u65B0"))
  }, React.createElement(_UnblockWebRestrictionsConfigForm.default, {
    onReload: handleReload
  }), React.createElement(_UnblockWebRestrictionsConfigList.default, {
    list: configList,
    onRemove: handleRemove,
    onSwitch: handleSwitch
  }));
};

var _default = UnblockWebRestrictionsConfig;
exports.default = _default;
},{"react":"../node_modules/react/index.js","antd":"../node_modules/antd/es/index.js","./component/UnblockWebRestrictionsConfigForm":"pages/unblock/component/UnblockWebRestrictionsConfigForm.tsx","./component/UnblockWebRestrictionsConfigList":"pages/unblock/component/UnblockWebRestrictionsConfigList.tsx","../../components/layout/BasicLayoutCard":"components/layout/BasicLayoutCard.tsx","../../components/layout/LayoutEmpty":"components/layout/LayoutEmpty.tsx"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "64130" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js"], null)
//# sourceMappingURL=/UnblockWebRestrictionsConfig.95b698bc.js.map