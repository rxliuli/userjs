// ==UserScript==
// @name         解除网页限制
// @namespace    http://github.com/rxliuli/userjs
// @version      2.1.2
// @description  破解禁止复制/剪切/粘贴/选择/右键菜单的网站
// @author       rxliuli
// @include      *
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// 这里的 @run-at 非常重要，设置在文档开始时就载入脚本
// @run-at       document-start
// @license      MIT
// ==/UserScript==
;
(() => {
    /**
     * 安全执行某个函数
     * 支持异步函数
     * @param fn 需要执行的函数
     * @param defaultVal 发生异常后的默认返回值，默认为 null
     * @param args 可选的函数参数
     * @returns 函数执行的结果，或者其默认值
     */
    function safeExec(fn, defaultVal, ...args) {
        const defRes = (defaultVal === undefined ? null : defaultVal);
        try {
            const res = fn(...args);
            return res instanceof Promise ? res.catch(() => defRes) : res;
        }
        catch (err) {
            return defRes;
        }
    }
    /**
     * 兼容异步函数的返回值
     * @param res 返回值
     * @param callback 同步/异步结果的回调函数
     * @typeparam T 处理参数的类型，如果是 Promise 类型，则取出其泛型类型
     * @typeparam Param 处理参数具体的类型，如果是 Promise 类型，则指定为原类型
     * @typeparam R 返回值具体的类型，如果是 Promise 类型，则指定为 Promise 类型，否则为原类型
     * @returns 处理后的结果，如果是同步的，则返回结果是同步的，否则为异步的
     */
    function compatibleAsync(res, callback) {
        return (res instanceof Promise
            ? res.then(callback)
            : callback(res));
    }
    /**
     * 在固定时间周期内只执行函数一次
     * @param {Function} fn 执行的函数
     * @param {Number} time 时间周期
     * @returns {Function} 包装后的函数
     */
    function onceOfCycle(fn, time) {
        const get = window.GM_getValue.bind(window);
        const set = window.GM_setValue.bind(window);
        const LastUpdateKey = 'LastUpdate';
        const LastValueKey = 'LastValue';
        return new Proxy(fn, {
            apply(_, _this, args) {
                const now = Date.now();
                const last = get(LastUpdateKey);
                if (![null, undefined, 'null', 'undefined'].includes(last) &&
                    now - last < time) {
                    return safeExec(() => JSON.parse(get(LastValueKey)), 1);
                }
                return compatibleAsync(Reflect.apply(_, _this, args), res => {
                    set(LastUpdateKey, now);
                    set(LastValueKey, JSON.stringify(res));
                    return res;
                });
            },
        });
    }
    /**
     * 解除限制
     */
    class UnblockLimit {
        /**
         * 监听 event 的添加
         * 注：必须及早运行
         */
        static watchEventListener() {
            const documentAddEventListener = document.addEventListener;
            const eventTargetAddEventListener = EventTarget.prototype.addEventListener;
            function addEventListener(type, listener, useCapture) {
                const $addEventListener = this === document
                    ? documentAddEventListener
                    : eventTargetAddEventListener;
                // 在这里阻止会更合适一点
                if (UnblockLimit.eventTypes.includes(type)) {
                    console.log('拦截 addEventListener: ', type, this);
                    return;
                }
                $addEventListener.apply(this, [type, listener, useCapture]);
            }
            document.addEventListener = EventTarget.prototype.addEventListener = addEventListener;
        }
        // 清理使用 onXXX 添加到事件
        static clearJsOnXXXEvent() {
            const emptyFunc = () => { };
            function modifyPrototype(prototype, type) {
                Object.defineProperty(prototype, `on${type}`, {
                    get() {
                        return emptyFunc;
                    },
                    set() {
                        return true;
                    },
                });
            }
            UnblockLimit.eventTypes.forEach(type => {
                modifyPrototype(HTMLElement.prototype, type);
                modifyPrototype(document, type);
            });
        }
        // 清理或还原DOM节点的onXXX 属性
        static clearDomOnXXXEvent() {
            function _innerClear() {
                UnblockLimit.eventTypes.forEach(type => {
                    document
                        .querySelectorAll(`[on${type}]`)
                        .forEach(el => el.setAttribute(`on${type}`, 'return true'));
                });
            }
            setInterval(_innerClear, 3000);
        }
        // 清理掉网页添加的全局防止复制/选择的 CSS
        static clearCSS() {
            GM_addStyle(`html, * {
  -webkit-user-select: text !important;
  -moz-user-select: text !important;
  user-select: text !important;
}

::-moz-selection {
  color: #111 !important;
  background: #05D3F9 !important;
}

::selection {
  color: #111 !important;
  background: #05D3F9 !important;
}`);
        }
    }
    UnblockLimit.eventTypes = [
        'copy',
        'cut',
        'paste',
        'select',
        'selectstart',
        'contextmenu',
        'dragstart',
    ];
    //更新屏蔽列表
    class BlockHost {
        static fetchHostList() {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: 'https://rxliuli.com/userjs/src/UnblockWebRestrictions/blockList.json',
                    onload(res) {
                        resolve(JSON.parse(res.responseText));
                    },
                    onerror(e) {
                        reject(e);
                    },
                });
            });
        }
        static updateHostList(hostList) {
            hostList
                .filter(config => GM_getValue(JSON.stringify(config)) === undefined)
                .forEach(domain => {
                console.log('更新了屏蔽域名: ', domain);
                GM_setValue(JSON.stringify(domain), true);
            });
        }
        static isBlock() {
            return GM_listValues()
                .filter(config => GM_getValue(config) === true)
                .some(configStr => {
                const config = safeExec(() => JSON.parse(configStr), {
                    type: 'domain',
                    url: configStr,
                });
                return this.match(new URL(location.href), config);
            });
        }
        static match(href, config) {
            if (typeof config === 'string') {
                return href.host.includes(config);
            }
            else {
                const { type, url } = config;
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
    }
    // 更新支持的网站列表
    BlockHost.updateBlockHostList = onceOfCycle(async () => {
        BlockHost.updateHostList(await BlockHost.fetchHostList());
    }, 1000 * 60 * 60 * 24);
    //注册菜单
    class MenuHandler {
        static register() {
            const domain = location.host;
            const isIncludes = GM_getValue(domain) === true;
            const isBlock = BlockHost.isBlock();
            if (!isBlock) {
                console.log('domain: ', domain);
            }
            GM_registerMenuCommand(isBlock ? '恢复默认' : '解除限制', () => {
                GM_setValue(JSON.stringify({
                    type: 'domain',
                    url: domain,
                }), !isIncludes);
                location.reload();
            });
        }
    }
    /**
     * 屏蔽列表配置 API，用以在指定 API 进行高级配置
     */
    class ConfigBlockApi {
        list() {
            return GM_listValues()
                .filter(key => key !== 'LastUpdate' && key !== 'LastValue')
                .map(config => safeExec(() => JSON.parse(config), {
                type: 'domain',
                url: config,
            }));
        }
        delete(config) {
            GM_deleteValue(JSON.stringify(config));
        }
        add(config) {
            GM_setValue(JSON.stringify(config), true);
        }
        clear() {
            GM_listValues().forEach(GM_deleteValue);
        }
        async update() {
            await BlockHost.updateBlockHostList();
        }
    }
    //启动类
    class Application {
        start() {
            MenuHandler.register();
            if (BlockHost.isBlock()) {
                UnblockLimit.watchEventListener();
                UnblockLimit.clearJsOnXXXEvent();
            }
            BlockHost.updateBlockHostList();
            window.addEventListener('load', function () {
                if (BlockHost.isBlock()) {
                    UnblockLimit.clearDomOnXXXEvent();
                    UnblockLimit.clearCSS();
                }
            });
            if (location.href ===
                'https://rxliuli.com/userjs/src/UnblockWebRestrictions/website/dist/' ||
                location.hostname === '127.0.0.1') {
                Reflect.set(unsafeWindow, 'configBlockApi', new ConfigBlockApi());
            }
        }
    }
    new Application().start();
})();
