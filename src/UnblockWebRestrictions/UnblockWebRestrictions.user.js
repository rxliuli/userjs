// ==UserScript==
// @name         解除网页限制
// @namespace    http://github.com/rxliuli/userjs
// @version      2.2.3
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
// @grant        unsafeWindow
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
                const $addEventListener = this instanceof Document
                    ? documentAddEventListener
                    : eventTargetAddEventListener;
                // 在这里阻止会更合适一点
                if (UnblockLimit.eventTypes.includes(type)) {
                    console.log('拦截 addEventListener: ', type, this);
                    return;
                }
                Reflect.apply($addEventListener, this, [type, listener, useCapture]);
            }
            document.addEventListener = EventTarget.prototype.addEventListener = addEventListener;
        }
        // 代理网页添加的键盘快捷键，阻止自定义 C-C/C-V/C-X 这三个快捷键
        static proxyKeyEventListener() {
            const documentAddEventListener = document.addEventListener;
            const eventTargetAddEventListener = EventTarget.prototype.addEventListener;
            function addEventListener(type, listener, useCapture) {
                const $addEventListener = this === document
                    ? documentAddEventListener
                    : eventTargetAddEventListener;
                // 在这里阻止会更合适一点
                const listenerHandler = {
                    apply(target, thisArg, argArray) {
                        const ev = argArray[0];
                        const proxyKey = ['c', 'x', 'v', 'a'];
                        const proxyAssistKey = ['Control', 'Alt'];
                        if ((ev.ctrlKey && proxyKey.includes(ev.key)) ||
                            proxyAssistKey.includes(ev.key)) {
                            console.log('已阻止: ', ev.ctrlKey, ev.altKey, ev.key);
                            return;
                        }
                        if (ev.altKey) {
                            return;
                        }
                        // Reflect.apply(target, thisArg, argArray)
                    },
                };
                Reflect.apply($addEventListener, this, [
                    type,
                    UnblockLimit.keyEventTypes.includes(type)
                        ? new Proxy(listener, listenerHandler)
                        : listener,
                    useCapture,
                ]);
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
    UnblockLimit.keyEventTypes = [
        'keydown',
        'keypress',
        'keyup',
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
        static findKey() {
            return GM_listValues()
                .filter(config => GM_getValue(config) === true)
                .find(configStr => {
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
            const findKey = BlockHost.findKey();
            const key = findKey ||
                JSON.stringify({
                    type: 'domain',
                    url: location.host,
                });
            console.log('key: ', key);
            GM_registerMenuCommand(findKey ? '恢复默认' : '解除限制', () => {
                GM_setValue(key, !GM_getValue(key));
                console.log('isBlock: ', key, GM_getValue(key));
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
                .map(config => ({
                ...safeExec(() => JSON.parse(config), {
                    type: 'domain',
                    url: config,
                }),
                enable: GM_getValue(config),
                key: config,
            }));
        }
        switch(key) {
            GM_setValue(key, !GM_getValue(key));
        }
        remove(key) {
            GM_deleteValue(key);
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
            if (BlockHost.findKey()) {
                UnblockLimit.watchEventListener();
                UnblockLimit.proxyKeyEventListener();
                UnblockLimit.clearJsOnXXXEvent();
            }
            BlockHost.updateBlockHostList();
            window.addEventListener('load', function () {
                if (BlockHost.findKey()) {
                    UnblockLimit.clearDomOnXXXEvent();
                    UnblockLimit.clearCSS();
                }
            });
            if (location.href.includes('https://rxliuli.com/userjs/') ||
                location.hostname === '127.0.0.1') {
                Reflect.set(unsafeWindow, 'com.rxliuli.UnblockWebRestrictions.configBlockApi', new ConfigBlockApi());
            }
        }
    }
    new Application().start();
})();
