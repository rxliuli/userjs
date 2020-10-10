// ==UserScript==
// @name        91Flac Download
// @description 在 91Flac 下载歌曲自动设置文件名
// @namespace   https://github.com/rxliuli
// @version     0.1.3
// @author      rxliuli
// @match       http*://www.91flac.com/*
// @match       http*://91flac.vip/*
// @match       http*://*.91flac.vip/*
// @license     MIT
// @grant       GM_xmlhttpRequest
// ==/UserScript==

(function () {
    'use strict';

    /**
     * 在浏览器上下载二进制资源
     * @param blob 要下载的二进制资源
     * @param filename 文件名
     */
    function download(blob, filename = 'unknown') {
        // 创建隐藏的可下载链接
        const eleLink = document.createElement('a');
        eleLink.download = filename;
        eleLink.style.display = 'none';
        // 为 link 赋值
        eleLink.href = URL.createObjectURL(blob);
        // 触发点击
        document.body.appendChild(eleLink);
        eleLink.click();
        // 然后移除
        document.body.removeChild(eleLink);
    }

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    /**
     * 协议与默认端口映射表
     */
    const protocolPortMap = new Map()
        .set('http', 80)
        .set('https', 443)
        .set('ssh', 22)
        .set('ftp', 21);

    /**
     * 读取文件类型
     */
    var ReadType;
    (function (ReadType) {
        /**
         * 以 data url 读取
         */
        ReadType["DataURL"] = "readAsDataURL";
        /**
         * 以文本读取
         */
        ReadType["Text"] = "readAsText";
        /**
         * 以二进制文件读取
         */
        ReadType["BinaryString"] = "readAsBinaryString";
        /**
         * 以 ArrayBuffer 读取
         */
        ReadType["ArrayBuffer"] = "readAsArrayBuffer";
    })(ReadType || (ReadType = {}));
    /**
     * 读取本地浏览器选择的文件
     * @param file 选择的文件
     * @param options 读取的选项
     * @returns 返回了读取到的内容（异步）
     */
    function _readLocal(file, options = {}) {
        const { type, encoding } = Object.assign({
            type: ReadType.DataURL,
            encoding: 'UTF-8',
        }, options);
        return new Promise((resolve, reject) => {
            if (!file) {
                reject(new Error('file not exists'));
            }
            const fr = new FileReader();
            fr.onload = () => {
                resolve(fr.result);
            };
            fr.onerror = error => {
                reject(error);
            };
            switch (type) {
                case ReadType.DataURL:
                    fr.readAsDataURL(file);
                    break;
                case ReadType.Text:
                    fr.readAsText(file, encoding);
                    break;
                case ReadType.BinaryString:
                    fr.readAsBinaryString(file);
                    break;
                case ReadType.ArrayBuffer:
                    fr.readAsArrayBuffer(file);
                    break;
            }
        });
    }
    const readLocal = Object.assign(_readLocal, {
        ReadType,
        /**
         * 以 data url 读取
         * @deprecated 已废弃，请使用枚举类 ReadType
         */
        DataURL: ReadType.DataURL,
        /**
         * 以文本读取
         * @deprecated 已废弃，请使用枚举类 ReadType
         */
        Text: ReadType.Text,
        /**
         * 以二进制文件读取
         * @deprecated 已废弃，请使用枚举类 ReadType
         */
        BinaryString: ReadType.BinaryString,
        /**
         * 以 ArrayBuffer 读取
         * @deprecated 已废弃，请使用枚举类 ReadType
         */
        ArrayBuffer: ReadType.ArrayBuffer,
    });

    /**
     * 等待指定的时间/等待指定表达式成立
     * 如果未指定等待条件则立刻执行
     * 注: 此实现在 nodejs 10- 会存在宏任务与微任务的问题，切记 async-await 本质上还是 Promise 的语法糖，实际上并非真正的同步函数！！！即便在浏览器，也不要依赖于这种特性。
     * @param param 等待时间/等待条件
     * @returns Promise 对象
     */
    function wait(param) {
        return new Promise(resolve => {
            if (typeof param === 'number') {
                setTimeout(resolve, param);
            }
            else if (typeof param === 'function') {
                const timer = setInterval(() => {
                    if (param()) {
                        clearInterval(timer);
                        resolve();
                    }
                }, 100);
            }
            else {
                resolve();
            }
        });
    }

    /**
     * 判断一个对象是否是无效的
     * 无效的值仅包含 null/undefined
     * @param object 任何一个对象
     * @returns 是否无效的值
     */
    function isNullOrUndefined(object) {
        return object === undefined || object === null;
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
     * 内部使用的函数
     * 注: 如果谓词中包含任意一个异步(返回 Promise)函数,则整个返回结果将变成异步的,否则默认为同步操作.
     * @param fns 谓词数组
     * @param args 谓词应用的参数列表
     * @param condition 临界条件
     * @returns 返回结果
     */
    function _inner(fns, args, condition) {
        const fn = fns[0];
        const res = fn(...args);
        function _call(res) {
            if (condition(res)) {
                return res;
            }
            const others = fns.slice(1);
            if (others.length === 0) {
                return res;
            }
            return _inner(others, args, condition);
        }
        return compatibleAsync(res, _call);
    }
    /**
     * 连接谓词函数
     */
    class CombinedPredicate {
        /**
         * 使用 && 进行连接
         * @param fns 连接任意多个谓词
         * @returns 连接后的新谓词
         */
        static and(...fns) {
            return function (...args) {
                return _inner(fns, args, res => !res);
            };
        }
        /**
         * 使用 || 进行连接
         * @param fns 连接任意多个谓词
         * @returns 连接后的新谓词
         */
        static or(...fns) {
            return function (...args) {
                return _inner(fns, args, res => res);
            };
        }
        /**
         * 对谓词进行取反
         * @param fn 谓词
         * @returns 取反后的谓词
         */
        static not(fn) {
            return new Proxy(fn, {
                apply(_, _this, args) {
                    return compatibleAsync(Reflect.apply(_, this, args), res => !res);
                },
            });
        }
    }
    const not = CombinedPredicate.not;

    /**
     * 操作类型
     */
    var ActionType;
    (function (ActionType) {
        ActionType["forEach"] = "forEach";
        ActionType["filter"] = "filter";
        ActionType["map"] = "map";
        ActionType["flatMap"] = "flatMap";
        ActionType["sort"] = "sort";
        ActionType["reduce"] = "reduce";
        ActionType["reduceRight"] = "reduceRight";
        ActionType["findIndex"] = "findIndex";
        ActionType["find"] = "find";
        ActionType["every"] = "every";
        ActionType["some"] = "some";
        ActionType["parallel"] = "parallel";
        ActionType["serial"] = "serial";
    })(ActionType || (ActionType = {}));

    /**
     * 判断数字是否在指定区间之中
     * @param num 指定数字
     * @param min 最小值
     * @param max 最大值（不包含）
     */
    function isRange(num, min, max) {
        return num >= min && num < max;
    }

    /**
     * 判断是否为小数的正则表达式
     */
    const FloatRule = /^(-?\d+)(.\d+)?$/;
    /**
     * 判断是否为整数的正则表达式
     */
    const IntegerRule = /^-?\d+$/;
    /**
     * 判断是否为邮箱的正则表达式
     */
    const EmailRule = /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
    /**
     * 判断是否为 ipv4 地址的正则表达式
     */
    const Ipv4Rule = /^((25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(25[0-5]|2[0-4]\d|1?\d?\d)$/;
    /**
     * 判断是否为固定电话的正则表达式
     */
    const TelephoneRule = /^0[1-9][0-9]{1,2}-[2-8][0-9]{6,7}$/;
    /**
     * 判断是否为移动电话的正则表达式
     * 注：不在判断二三位的数字，具体参考：http://caibaojian.com/phone-regexp.html
     */
    const MobileRule = /^1\d{10}$/;
    /**
     * 判断是否为域名的正则表达式
     */
    const DomainRule = /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/;
    /**
     * 判断是否为邮政编码的正则表达式
     */
    const PostcodeRule = /^\d{6}$/;
    /**
     * 字符串校验
     * @suppress 之后将会对类型定义进行不兼容修改，避免一直出现的两难问题
     */
    class StringValidator {
        /**
         * 判断一个字符串是否为空字符串
         * @param str 字符串
         * @returns 是否为空字符串
         */
        static isEmpty(str) {
            return isNullOrUndefined(str) || str === '';
        }
        /**
         * 判断一个字符串是否为空白的字符串
         * @param str 字符串
         * @returns 是否为空字符串
         */
        static isBlank(str) {
            return StringValidator.isEmpty(str) || str.trim() === '';
        }
        /**
         * 判断字符串是否位小数
         * @param str 需要进行判断的字符串
         * @returns 是否为小数
         */
        static isFloat(str) {
            if (isNullOrUndefined(str)) {
                return false;
            }
            return FloatRule.test(str);
        }
        /**
         * 判断字符串是否位整数
         * @param str 需要进行判断的字符串
         * @returns 是否为小数
         */
        static isInteger(str) {
            return !isNullOrUndefined(str) && IntegerRule.test(str);
        }
        /**
         * 判断邮箱的格式是否正确
         * @param str 邮箱字符串
         * @returns 是否是邮箱
         */
        static isEmail(str) {
            return !isNullOrUndefined(str) && EmailRule.test(str);
        }
        /**
         * 判断 ipv4 地址的格式是否正确
         * @param str ipv4 字符串
         * @returns 是否是 ipv4 地址
         */
        static isIpv4(str) {
            return !isNullOrUndefined(str) && Ipv4Rule.test(str);
        }
        /**
         * 判断字符串是否为正确的端口号
         * 正确的端口号是 1-65535
         * @param str 字符串
         * @returns 是否为端口号
         */
        static isPort(str) {
            // tslint:disable-next-line:radix
            return StringValidator.isInteger(str) && isRange(parseInt(str), 1, 65535);
        }
        /**
         * 判断是否为固定电话
         * @param str 字符串
         * @returns 是否为固定电话
         */
        static isTelephone(str) {
            return !isNullOrUndefined(str) && TelephoneRule.test(str);
        }
        /**
         * 判断是否为移动电话
         * @param str 字符串
         * @returns 是否为移动电话
         */
        static isMobile(str) {
            return !isNullOrUndefined(str) && MobileRule.test(str);
        }
        /**
         * 判断是否为域名
         * @param str 字符串
         * @returns 是否为域名
         */
        static isDomain(str) {
            return !isNullOrUndefined(str) && DomainRule.test(str);
        }
        /**
         * 判断是否为邮政编码
         * @param str 字符串
         * @returns 是否为邮政编码
         */
        static isPostcode(str) {
            return !isNullOrUndefined(str) && PostcodeRule.test(str);
        }
    }
    /**
     * 导出一个字符串校验的对象
     * @deprecated 已废弃，请直接使用类的静态函数
     */
    const stringValidator = StringValidator;

    /**
     * 可能的类型
     */
    var Type;
    (function (Type) {
        Type[Type["String"] = 0] = "String";
        Type[Type["Number"] = 1] = "Number";
        Type[Type["Boolean"] = 2] = "Boolean";
        Type[Type["Undefined"] = 3] = "Undefined";
        Type[Type["Null"] = 4] = "Null";
        Type[Type["Symbol"] = 5] = "Symbol";
        Type[Type["PropertyKey"] = 6] = "PropertyKey";
        Type[Type["Object"] = 7] = "Object";
        Type[Type["Array"] = 8] = "Array";
        Type[Type["Function"] = 9] = "Function";
        Type[Type["Date"] = 10] = "Date";
        Type[Type["File"] = 11] = "File";
        Type[Type["Blob"] = 12] = "Blob";
        Type[Type["Stream"] = 13] = "Stream";
        Type[Type["ArrayBuffer"] = 14] = "ArrayBuffer";
        Type[Type["ArrayBufferView"] = 15] = "ArrayBufferView";
        Type[Type["URLSearchParams"] = 16] = "URLSearchParams";
        Type[Type["FormData"] = 17] = "FormData";
    })(Type || (Type = {}));

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
     * 日期时间的正则表达式
     */
    const dateFormats = new Map()
        .set('year', 'Y{4}|Y{2}|y{4}|y{2}')
        .set('month', 'M{1,2}')
        .set('day', 'D{1,2}|d{1,2}')
        .set('hour', 'h{1,2}')
        .set('minute', 'm{1,2}')
        .set('second', 's{1,2}')
        .set('millieSecond', 'S{1,3}');
    /**
     * 如果没有格式化某项的话则设置为默认时间
     */
    const defaultDateValues = new Map()
        .set('month', '01')
        .set('day', '01')
        .set('hour', '00')
        .set('minute', '00')
        .set('second', '00')
        .set('millieSecond', '000');

    /**
     * 根据 html 字符串创建 Element 元素
     * @param str html 字符串
     * @returns 创建的 Element 元素
     */
    function createElByString(str) {
        const root = document.createElement('div');
        root.innerHTML = str;
        return root.querySelector('*');
    }

    /**
     * 字符串安全的转换为小写
     * @param str 字符串
     * @returns 转换后得到的全小写字符串
     */
    function toLowerCase(str) {
        if (isNullOrUndefined(str) || typeof str !== 'string') {
            return str;
        }
        return str.toLowerCase();
    }

    let lastFocusEl;
    /**
     * 获取到最后一个获得焦点的元素
     * @returns 最后一个获取到焦点的元素
     */
    function _lastFocus() {
        return lastFocusEl;
    }
    const lastFocus = Object.assign(_lastFocus, {
        init() {
            document.addEventListener('focus', event => {
                lastFocusEl = event.target;
            }, true);
            document.addEventListener('blur', () => {
                lastFocusEl = null;
            }, true);
        },
    });

    /**
     * 使用 Proxy 实现通用的单例模式
     * @param clazz 需要包装为单例的类型
     * @returns 包装后的单例模式类，使用 {@code new} 创建将只在第一次有效
     */
    function singleModel(clazz) {
        let instance;
        return new Proxy(clazz, {
            construct(target, args, newTarget) {
                if (instance === undefined) {
                    instance = Reflect.construct(target, args, newTarget);
                }
                return instance;
            },
        });
    }

    /**
     * 字符串安全的转换为大写
     * @param str 字符串
     * @returns 转换后得到的全大写字符串
     */
    function toUpperCase(str) {
        if (isNullOrUndefined(str) || typeof str !== 'string') {
            return str;
        }
        return str.toUpperCase();
    }

    /**
     * 转换接口
     * @interface
     */
    class IConverter {
        /**
         * 将字符串解析为字符串列表
         *
         * @param str 字符串
         * @return {Array.<String>} 字符串列表
         * @abstract
         */
        from(str) {
            throw new Error('子类必须重写 from 函数');
        }
        /**
         * 将字符串列表构造为字符串
         *
         * @param list 字符串列表
         * @return {String} 字符串
         * @abstract
         */
        to(list) {
            throw new Error('子类必须重写 to 函数');
        }
    }

    /**
     * 驼峰风格解析
     */
    class CamelOrPascalFrom extends IConverter {
        /**
         * 将字符串解析为字符串列表
         *
         * @param str 字符串
         * @return {Array.<String>} 字符串列表
         * @override
         */
        from(str) {
            const result = [];
            const len = str.length;
            let old = 0;
            for (let i = 0; i < len; i++) {
                const c = str.charAt(i);
                if (c >= 'A' && c <= 'Z') {
                    if (i !== 0) {
                        result.push(str.substring(old, i));
                    }
                    old = i;
                }
            }
            if (old !== str.length) {
                result.push(str.substring(old, str.length));
            }
            return result;
        }
    }

    /**
     * 小写开头的驼峰转换器
     *
     */
    class CamelConverter extends CamelOrPascalFrom {
        /**
         * 将字符串列表构造为字符串
         *
         * @param list 字符串列表
         * @return {String} 字符串
         * @override
         */
        to(list) {
            return list.reduce((res, s, i) => {
                const str = toLowerCase(s);
                return (res +=
                    (i === 0 ? toLowerCase : toUpperCase)(str.substring(0, 1)) +
                        str.substring(1));
            }, '');
        }
    }

    /**
     * 大写开头的驼峰转换器
     */
    class PascalConverter extends CamelOrPascalFrom {
        /**
         * 将字符串列表构造为字符串
         *
         * @param list 字符串列表
         * @return {String} 字符串
         * @override
         */
        to(list) {
            return list.reduce((res, s) => {
                const str = toLowerCase(s);
                return (res += toUpperCase(str.substring(0, 1)) + str.substring(1));
            }, '');
        }
    }

    /**
     * 下划线风格解析
     */
    class SnakeOrScreamingSnakeFrom extends IConverter {
        /**
         * 将字符串解析为字符串列表
         *
         * @param str 字符串
         * @return {Array.<String>} 字符串列表
         * @override
         */
        from(str) {
            return str.split('_');
        }
    }

    /**
     * 小写下划线的转换器
     */
    class SnakeConverter extends SnakeOrScreamingSnakeFrom {
        /**
         * 将字符串列表构造为字符串
         *
         * @param list 字符串列表
         * @return {String} 字符串
         * @override
         */
        to(list) {
            return list.map(toLowerCase).join('_');
        }
    }

    /**
     * 大写下划线的转换器
     */
    class ScreamingSnakeConverter extends SnakeOrScreamingSnakeFrom {
        /**
         * 将字符串列表构造为字符串
         *
         * @param list 字符串列表
         * @return {String} 字符串
         * @override
         */
        to(list) {
            return list.map(toUpperCase).join('_');
        }
    }

    /**
     * @enum {Symbol} 字符串风格常量对象
     */
    var StringStyleType;
    (function (StringStyleType) {
        /**
         * 小写驼峰
         */
        StringStyleType[StringStyleType["Camel"] = 1] = "Camel";
        /**
         * 大写驼峰
         */
        StringStyleType[StringStyleType["Pascal"] = 2] = "Pascal";
        /**
         * 小写下划线
         */
        StringStyleType[StringStyleType["Snake"] = 3] = "Snake";
        /**
         * 大写下划线
         */
        StringStyleType[StringStyleType["ScreamingSnake"] = 4] = "ScreamingSnake";
    })(StringStyleType || (StringStyleType = {}));

    /**
     * 转换器工厂
     */
    class ConverterFactory {
        /**
         * 获取一个转换器实例
         *
         * @param styleType 转换风格，使用了 {@link stringStyleType} 定义的常量对象
         * @return {IConverter} 转换器对象
         * @throws 如果获取未定义过的转换器，则会抛出异常
         */
        static getInstance(styleType) {
            switch (styleType) {
                case StringStyleType.Camel:
                    return new CamelConverter();
                case StringStyleType.Pascal:
                    return new PascalConverter();
                case StringStyleType.Snake:
                    return new SnakeConverter();
                case StringStyleType.ScreamingSnake:
                    return new ScreamingSnakeConverter();
                default:
                    throw new Error('No corresponding converter found');
            }
        }
    }

    /**
     * 字符串风格转换器
     * 请不要直接使用构造函数创建，而是用 {@link StringStyleUtil.getConverter} 来获得一个转换器
     * @private
     */
    class StringStyleConverter {
        /**
         * 构造一个字符串任意风格转换器
         * @param from 转换字符串的风格
         * @param to 需要转换的风格
         * @private
         */
        constructor(from, to) {
            /**
             * @field 解析字符串风格的转换器
             * @type {IConverter}
             * @private
             */
            this.fromConverter = ConverterFactory.getInstance(from);
            /**
             * @field 构造字符串风格的转换器
             * @type {IConverter}
             * @private
             */
            this.toConverter = ConverterFactory.getInstance(to);
        }
        /**
         * 转换字符串的风格
         *
         * @param str 要转换的字符串
         * @return {String} 转换得到的字符串
         */
        convert(str) {
            if (stringValidator.isEmpty(str)) {
                return str;
            }
            return this.toConverter.to(this.fromConverter.from(str));
        }
    }

    /**
     * 基本缓存实现
     * 主要封装通用的 delete/size 函数
     */
    class BasicMemoryCache {
        constructor({ limit = Infinity } = {}) {
            this.cache = new Map();
            if (limit <= 0) {
                throw new Error('缓存的最大容量至少为 1');
            }
            this.limit = limit;
        }
        delete(key) {
            this.cache.delete(key);
        }
        clear() {
            this.cache.clear();
        }
        get size() {
            return this.cache.size;
        }
    }
    /**
     * FIFO 算法
     */
    class MemoryCacheFIFO extends BasicMemoryCache {
        add(key, val) {
            const diff = this.cache.size + 1 - this.limit;
            if (diff > 0) {
                const keys = [...this.cache.keys()].slice(0, diff);
                keys.forEach(k => this.delete(k));
            }
            this.cache.set(key, val);
        }
        delete(key) {
            this.cache.delete(key);
        }
        get(key) {
            return this.cache.get(key);
        }
        get size() {
            return this.cache.size;
        }
        has(key) {
            return this.cache.has(key);
        }
    }
    /**
     * IFU 算法
     */
    class MemoryCacheLFU extends BasicMemoryCache {
        constructor() {
            super(...arguments);
            this.lfuMap = new Map();
        }
        add(key, val) {
            const diff = this.cache.size + 1 - this.limit;
            if (diff > 0) {
                const keys = [...this.cache.keys()]
                    .sort((k1, k2) => this.lfuMap.get(k1) - this.lfuMap.get(k2))
                    .slice(0, diff);
                keys.forEach(k => this.delete(k));
            }
            this.cache.set(key, val);
            this.lfuMap.set(key, 0);
        }
        get(key) {
            this.lfuMap.set(key, this.lfuMap.get(key) + 1);
            return this.cache.get(key);
        }
        has(key) {
            this.lfuMap.set(key, this.lfuMap.get(key) + 1);
            return this.cache.has(key);
        }
        delete(key) {
            super.delete(key);
            this.lfuMap.delete(key);
        }
        clear() {
            super.clear();
            this.lfuMap.clear();
        }
    }
    /**
     * LRU 算法
     */
    class MemoryCacheLRU extends BasicMemoryCache {
        constructor() {
            super(...arguments);
            this.i = 0;
            this.lruMap = new Map();
        }
        get idx() {
            return this.i++;
        }
        add(key, val) {
            const diff = this.cache.size + 1 - this.limit;
            if (diff > 0) {
                const keys = [...this.cache.keys()]
                    .sort((k1, k2) => this.lruMap.get(k1) - this.lruMap.get(k2))
                    .slice(0, diff);
                console.log(keys, this.lruMap);
                keys.forEach(k => this.delete(k));
            }
            this.cache.set(key, val);
            this.lruMap.set(key, this.idx);
        }
        get(key) {
            this.lruMap.set(key, this.idx);
            return this.cache.get(key);
        }
        has(key) {
            this.lruMap.set(key, this.idx);
            return this.cache.has(key);
        }
        delete(key) {
            super.delete(key);
            this.lruMap.delete(key);
        }
        clear() {
            super.clear();
            this.lruMap.clear();
        }
    }
    var MemoryCacheEnum;
    (function (MemoryCacheEnum) {
        //先进先出
        MemoryCacheEnum[MemoryCacheEnum["Fifo"] = 0] = "Fifo";
        //最少使用
        MemoryCacheEnum[MemoryCacheEnum["Lfu"] = 1] = "Lfu";
        //最近使用
        MemoryCacheEnum[MemoryCacheEnum["Lru"] = 2] = "Lru";
    })(MemoryCacheEnum || (MemoryCacheEnum = {}));
    /**
     * 缓存工厂类
     */
    class MemoryCacheFactory {
        static create(type, config) {
            switch (type) {
                case MemoryCacheEnum.Fifo:
                    return new MemoryCacheFIFO(config);
                case MemoryCacheEnum.Lfu:
                    return new MemoryCacheLFU(config);
                case MemoryCacheEnum.Lru:
                    return new MemoryCacheLRU(config);
            }
        }
    }

    const onceOfSameParamIdentity = (fn, args) => `onceOfSameParam-${fn.toString()}-${JSON.stringify(args)}`;
    /**
     * 包装一个函数为指定参数只执行一次的函数
     * @param fn 需要包装的函数
     * @param identity 参数转换的函数，参数为需要包装函数的参数
     * @param memoryCache
     * @returns 需要被包装的函数
     */
    function _onceOfSameParam(fn, identity = onceOfSameParamIdentity, memoryCache = MemoryCacheFactory.create(MemoryCacheEnum.Fifo)) {
        const res = new Proxy(fn, {
            apply(_, _this, args) {
                const key = identity(fn, args);
                const old = memoryCache.get(key);
                if (old !== undefined) {
                    return old;
                }
                const res = Reflect.apply(_, _this, args);
                return compatibleAsync(res, res => {
                    memoryCache.add(key, res);
                    return res;
                });
            },
        });
        return Object.assign(res, {
            origin: fn,
            clear(...keys) {
                if (keys.length) {
                    memoryCache.clear();
                }
                else {
                    keys.forEach(key => memoryCache.delete(key));
                }
            },
        });
    }
    const onceOfSameParam = Object.assign(_onceOfSameParam, {
        identity: onceOfSameParamIdentity,
    });

    /**
     * 包装获取字符串风格转换器
     * 此处采用了单例模式，每种转换器只会有一个
     *
     * @param from 解析风格
     * @param to 转换风格
     * @return {StringStyleConverter} 转换器的实例
     */
    const _getConverter = onceOfSameParam(
    /**
     * @param from 解析风格
     * @param to 转换风格
     * @return {StringStyleConverter} 转换器的实例
     */
    (from, to) => new StringStyleConverter(from, to));

    /**
     * 缓存的值
     */
    class CacheVal {
        /**
         * 构造函数
         * @param options 缓存值对象
         * @param options.key 缓存的键原始值
         * @param options.val 缓存的值
         * @param options.cacheOption 缓存的选项
         */
        constructor(options = {}) {
            Object.assign(this, options);
        }
    }

    /**
     * 无限的超时时间
     * TODO 此处暂时使用字符串作为一种折衷方法，因为 Symbol 无法被序列化为 JSON，反向序列化也是不可能的
     */
    const TimeoutInfinite = 'TimeoutInfinite';

    /**
     * 使用 LocalStorage 实现的缓存
     * 1. get: 根据 key 获取
     * 2. set: 根据 key value 设置，会覆盖
     * 3. touch: 获取并刷新超时时间
     * 4. add: 根据 key value 添加，不会覆盖
     * 5. del: 根据 key 删除
     * 6. clearExpired: 清除所有过期的缓存
     */
    class LocalStorageCache {
        /**
         * 构造函数
         * @param cacheOption 全局缓存选项
         */
        constructor({ timeout = TimeoutInfinite, serialize = JSON.stringify, deserialize = JSON.parse, } = {}) {
            // 这里必须强制转换，因为 timeStart 在全局选项中是不可能存在的
            this.cacheOption = {
                timeout,
                serialize,
                deserialize,
            };
            /**
             * 缓存对象，默认使用 localStorage
             */
            this.localStorage = window.localStorage;
            // 创建后将异步清空所有过期的缓存
            this.clearExpired();
        }
        /**
         * 清空所有过期的 key
         * 注: 该函数是异步执行的
         */
        clearExpired() {
            return __awaiter(this, void 0, void 0, function* () {
                const local = this.localStorage;
                const getKeys = () => {
                    const len = local.length;
                    const res = [];
                    for (let i = 0; i < len; i++) {
                        res.push(local.key(i));
                    }
                    return res;
                };
                getKeys()
                    .filter(not(isNullOrUndefined))
                    .map(key => safeExec(() => JSON.parse(local.getItem(key))))
                    .filter(cacheVal => !isNullOrUndefined(cacheVal) &&
                    isNullOrUndefined(cacheVal.cacheOption))
                    // TODO 这里暂时加个补丁，过滤掉 timeStart,timeout 为 undefined 的缓存
                    .filter(({ cacheOption = {} }) => {
                    const { timeStart, timeout } = cacheOption;
                    if (isNullOrUndefined(timeStart) || isNullOrUndefined(timeout)) {
                        return false;
                    }
                    return timeout !== TimeoutInfinite && Date.now() - timeStart > timeout;
                })
                    .forEach(({ key }) => local.removeItem(key));
            });
        }
        /**
         * 根据 key + value 添加
         * 如果不存在则添加，否则忽略
         * @param key 缓存的 key
         * @param val 缓存的 value
         * @param cacheOption 缓存的选项，默认为无限时间
         * @override
         */
        add(key, val, timeout) {
            const result = this.get(key);
            if (result !== null) {
                return;
            }
            this.set(key, val, timeout);
        }
        /**
         * 根据指定的 key 删除
         * 如果存在则删除，否则忽略
         * @param key 删除的 key
         * @override
         */
        del(key) {
            this.localStorage.removeItem(key);
        }
        /**
         * 根据指定的 key 修改
         * 不管是否存在都会设置
         * @param key 修改的 key
         * @param val 修改的 value
         * @param timeout 修改的选项
         * @override
         */
        set(key, val, timeout) {
            this.localStorage.setItem(key, JSON.stringify(new CacheVal({
                key,
                val: this.cacheOption.serialize(val),
                // 我们不需要缓存序列化/反序列化策略（实际上也无法缓存）
                cacheOption: {
                    timeStart: Date.now(),
                    timeout: timeout || this.cacheOption.timeout,
                },
            })));
        }
        /**
         * 根据 key 获取
         * 如果存在则获取，否则忽略
         * @param key 指定的 key
         * @param timeout 获取的选项
         * @returns 获取到的缓存值
         * @override
         */
        get(key) {
            const str = this.localStorage.getItem(key);
            const cacheVal = safeExec(() => JSON.parse(str));
            if (isNullOrUndefined(cacheVal) ||
                isNullOrUndefined(cacheVal.cacheOption)) {
                return null;
            }
            const [timeStart, timeout, deserialize] = [
                cacheVal.cacheOption.timeStart,
                cacheVal.cacheOption.timeout,
                this.cacheOption.deserialize,
            ];
            // 如果超时则删除并返回 null
            if (timeout !== TimeoutInfinite && Date.now() - timeStart > timeout) {
                this.del(key);
                return null;
            }
            try {
                return deserialize(cacheVal.val);
            }
            catch (e) {
                this.del(key);
                return null;
            }
        }
        /**
         * 根据 key 获取并刷新超时时间
         * @param key 指定的 key
         * @param cacheOption 获取的选项
         * @returns 获取到的缓存值
         * @override
         */
        touch(key) {
            const str = this.localStorage.getItem(key);
            /**
             * @type {CacheVal}
             */
            const cacheVal = safeExec(() => JSON.parse(str));
            if (isNullOrUndefined(cacheVal) ||
                isNullOrUndefined(cacheVal.cacheOption)) {
                return null;
            }
            const [timeStart, timeout, deserialize] = [
                cacheVal.cacheOption.timeStart,
                cacheVal.cacheOption.timeout,
                this.cacheOption.deserialize,
            ];
            // 如果超时则删除并返回 null
            if (timeout !== TimeoutInfinite && Date.now() - timeStart > timeout) {
                this.del(key);
                return null;
            }
            try {
                const result = deserialize(cacheVal.val);
                this.set(key, result, { timeStart: Date.now(), timeout });
                return result;
            }
            catch (e) {
                this.del(key);
                return null;
            }
        }
    }

    /**
     * 默认使用的 {@link ICache} 接口的缓存实现
     */
    const cache = new LocalStorageCache();

    /**
     * 一个空的函数
     * @param args 接受任何参数
     */
    function emptyFunc(...args) { }

    var LoggerLevelEnum;
    (function (LoggerLevelEnum) {
        LoggerLevelEnum[LoggerLevelEnum["Debug"] = 0] = "Debug";
        LoggerLevelEnum[LoggerLevelEnum["Log"] = 1] = "Log";
        LoggerLevelEnum[LoggerLevelEnum["Info"] = 2] = "Info";
        LoggerLevelEnum[LoggerLevelEnum["Warn"] = 3] = "Warn";
        LoggerLevelEnum[LoggerLevelEnum["Error"] = 4] = "Error";
    })(LoggerLevelEnum || (LoggerLevelEnum = {}));
    const enumMap = {
        debug: LoggerLevelEnum.Debug,
        log: LoggerLevelEnum.Log,
        info: LoggerLevelEnum.Info,
        warn: LoggerLevelEnum.Warn,
        error: LoggerLevelEnum.Error,
    };
    /**
     * 自定义的日志类
     * 主要便于在开发环境下正常显示调试信息，在生产环境则默认关闭它
     */
    class Logger {
        /**
         * 构造函数
         * @param options 可选项
         * @param options.enable 是否开启日志
         */
        constructor({ enable = true, level = LoggerLevelEnum.Log, } = {}) {
            /**
             * 开发日志：业务强相关调试日志，希望其他人开发时默认隐藏起来的日志（例如第三方服务的回调日志很多，但对于服务接入层的使用者并不关心）
             */
            this.debug = console.debug;
            /**
             * 开发日志：业务相关调试日志，希望其他开发时也能看到的日志
             */
            this.log = console.log;
            /**
             * 生产日志：开发环境也会打印的日志，希望在生产环境打印并且方便调试的日志
             */
            this.info = console.info;
            /**
             * 警告日志：一些危险的操作可以在这里打印出来，同时会显示在生产环境（例如警告用户不要在控制台输入不了解的代码以避免账号安全）
             */
            this.warn = console.warn;
            /**
             * 错误日志：发生错误时使用的日志，发生影响到用户的错误时必须使用该日志
             */
            this.error = console.error;
            this.dir = console.dir;
            this.dirxml = console.dirxml;
            this.table = console.table;
            this.trace = console.trace;
            this.group = console.group;
            this.groupCollapsed = console.groupCollapsed;
            this.groupEnd = console.groupEnd;
            this.clear = console.clear;
            this.count = console.count;
            this.assert = console.assert;
            this.profile = console.profile;
            this.profileEnd = console.profileEnd;
            this.time = console.time;
            this.timeEnd = console.timeEnd;
            this.timeStamp = console.timeStamp;
            this.enable = enable;
            this.level = level;
        }
        /**
         * 设置 enable 的 setter 属性，在改变时合并对应的子类对象实现
         * @param enable 是否开启
         */
        set enable(enable) {
            Object.keys(console).forEach(k => Reflect.set(this, k, enable ? console[k] : emptyFunc));
        }
        /**
         * 设置日志的级别
         * @param level
         */
        set level(level) {
            Object.keys(console)
                .filter(k => Reflect.has(enumMap, k))
                .forEach(k => Reflect.set(this, k, Reflect.get(enumMap, k) >= level ? console[k] : emptyFunc));
        }
    }
    Logger.Level = LoggerLevelEnum;
    /**
     * 导出一个全局可用的 Logger 对象
     * 使用 enable 属性控制是否开启日志输出，默认为 true
     */
    const logger = new Logger();

    /**
     * 简单的弹窗组件
     */
    const Loading = singleModel(
      class Loading {
        constructor() {
          const LoadingText = `
    <div class="rx-loading" style="position: fixed; right: 10px; bottom: 10px;">
      <div
        class="loading-content"
        style="background-color: grey; color: white; font-size: 20px; padding: 10px;"
      >
        正在下载...（<span class="loading-progress">50</span>%）
      </div>
    </div>
    `;
          // eslint-disable-next-line no-undef
          document.body.append(createElByString(LoadingText));
          this.hide();
        }
        show() {
    (document.querySelector('.rx-loading') ).style.display =
            'block';
        }
        hide() {
    (document.querySelector('.rx-loading') ).style.display =
            'none';
        }
        progress(num) {
    (document.querySelector(
            '.rx-loading .loading-progress',
          ) ).innerHTML = num.toString();
        }
      },
    );
    function load() {
      const loading = new Loading();
      loading.show();
      loading.progress(0);
      return loading
    }

    /**
     * 下载歌曲
     * @param {string} url 链接
     * @param {string} name 歌曲全名，包括后缀
     */
    function downloadMusic(url, name) {
      const loading = load();
      // eslint-disable-next-line no-undef
      GM_xmlhttpRequest({
        method: 'GET',
        responseType: 'blob',
        url,
        onload(res) {
          // eslint-disable-next-line no-undef
          download(res.response, name);
          loading.hide();
        },
        onprogress(res) {
          if (res.readyState !== 3) {
            return
          }
          const num = Math.floor(((res ).done * 100) / res.total);
          loading.progress(num);
        },
      } );
    }






    /**
     * 下载单个歌曲
     */
    function singleDownload() {
      /**
       * 获取到所有需要替换的按钮
       * 获取歌曲名
       * 获取后缀名
       * 添加按钮点击事件，修改按钮的超链接
       */
      const MusicTypeList = ['flac', 'ape', 'mp3', 'aac', 'ogg', 'm4a'];
      const EmptyHref = 'javascript:void(0)';

      /**
       * 获取所有可用的下载按钮列表
       */
      function getBtnList() {
        function predicate($elem) {
          if (!MusicTypeList.some((type) => $elem.dataset.type.includes(type))) {
            return false
          }
          const $btn = $elem.querySelector('a.btn'); 
          return !(
            $btn === null ||
            $btn.classList.contains('disabled') ||
            $btn.href === EmptyHref
          )
        }
        return (Array.from(document.querySelectorAll('.download')) )
          .filter(predicate)
          .map(
            ($elem) =>
              ({
                el: $elem.querySelector('a.btn'),
                suffix: $elem.dataset.type,
              } ),
          )
      }

      /**
       * 获取当前页面的歌曲名
       */
      function getMusicName() {
        return document.querySelector('.rounded .h3').innerHTML
      }

      /**
       * 添加事件
       * @param {object} option 选项
       * @param {Element} option.el 按钮元素
       * @param {string} option.suffix 后缀名
       */
      function addClickEvent({ el, suffix }) {
        const url = el.href;
        el.addEventListener('click', function () {
          downloadMusic(url, `${getMusicName()}.${suffix}`);
        });
        el.href = EmptyHref;
        el.removeAttribute('target');
      }
    (async () => {
        // 等待全部按钮都加载完毕
        // eslint-disable-next-line no-undef
        await wait(() =>
          (Array.from(
            document.querySelectorAll('.download a.btn'),
          ) ).every(($el) => $el.innerText !== '加载中...'),
        );
        getBtnList().forEach(addClickEvent);
      })();
    }

    /**
     * 批量下载
     */
    function batchDownload() {
      /**
       * 获取选中的 id 列表
       * 请求后台得到详细的链接
       * 询问下载选项（类型/优先音质）
       * 下载歌曲
       */
      function getSelectedTrList() {
        return Array.from(document.querySelectorAll('.songs-list tbody tr')).filter(
          ($el) =>
            ($el.querySelector('td input[type="checkbox"]') )
              .checked,
        ) 
      }
      function getSelectedIdList(trList) {
        return trList.map(
          ($el) =>
            ($el.querySelector('td input[type="checkbox"]') )
              .value,
        )
      }
      async function getLinks(idList) {
        fetch('https://www.91flac.com/song/links', {
          credentials: 'omit',
          headers: {
            accept: 'application/json, text/plain, */*',
            'content-type': 'application/json;charset=UTF-8',
            'x-csrf-token': 'hRsUiNhoByVzlbUxYdaJRQtaoEQReU5Q7vASPWwq',
            'x-requested-with': 'XMLHttpRequest',
            'x-xsrf-token':
              'eyJpdiI6IkpDTE53eHBCc29GSjJEWjFIcHB3blE9PSIsInZhbHVlIjoibVZPaVlcLzNVVDBXYnljNllkVGE5allZMzIyUFk1bWs5M29oTElxeG1NXC9BNDk1YXQxK20yOFN4MHVFN0hTMnBvIiwibWFjIjoiNDk2MDFjOWU2ODI1NTQ0ZTcwMzg2OTBjMGUwM2JhYmQwM2NiMWVhNjBmODNkYTE2YzRhNTY1ZWM0YjNkNzhjMiJ9',
          },
          referrer:
            'https://www.91flac.com/search?keyword=%E9%99%88%E9%9B%AA%E5%87%9D',
          referrerPolicy: 'no-referrer-when-downgrade',
          body: '{"songIds":["228859369"]}',
          method: 'POST',
          mode: 'cors',
        });
        const res = await fetch('/song/links', {
          method: 'POST',
          body: JSON.stringify({ songIds: idList }),
        });
        // eslint-disable-next-line no-return-await
        return await res.json()
      }
      function calcMusicName(el) {
        return (
          (el.querySelector('td:nth-child(1) a') ).innerText +
          (el.querySelector('td:nth-child(2) a') ).innerText
        )
      }
      const SUFFIXS = ['flac', 'ape', 'mp3', 'aac', 'ogg'];
      function calcType(links) {
        const arr = Array.from(links);
        return SUFFIXS.find((suffix) => arr.some(([name]) => name.includes(suffix)))
      }
      function calcLink(links) {
        const arr = Array.from(links);
        let result;
        SUFFIXS.find((suffix) => {
          result = arr.find(([name]) => name.includes(suffix));
          return result
        });
        return result
      }

      async function downloadSelected() {
        const selectedTrList = getSelectedTrList();
        const selectedIdList = getSelectedIdList(selectedTrList);
        const links = await getLinks(selectedIdList);
        selectedTrList
          .map(($el, i) => ({
            el: $el,
            musicName: calcMusicName($el),
            id: selectedIdList[i],
            type: calcType(links[i]),
            link: calcLink(links[i]),
          }))
          .filter(({ link }) => link)
          .forEach(({ musicName, type, link }) =>
            downloadMusic(link, `${musicName}.${type}`),
          );
      }

      downloadSelected();
    }

    Reflect.set(unsafeWindow, 'batchDownload', batchDownload);
    Reflect.set(unsafeWindow, 'singleDownload', singleDownload);
    singleDownload();

}());
