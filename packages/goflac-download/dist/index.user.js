// ==UserScript==
// @name        goflac-download
// @description 在 telegram 群组中屏蔽置顶用户的消息
// @namespace   http://github.com/rxliuli/userjs
// @version     0.2.7
// @author      rxliuli
// @match       https://www.goflac.com/*
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

  /**
   * Url 对象
   */



































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
  var ReadType; (function (ReadType) {
    /**
     * 以 data url 读取
     */
    const DataURL = 'readAsDataURL'; ReadType["DataURL"] = DataURL;
    /**
     * 以文本读取
     */
    const Text = 'readAsText'; ReadType["Text"] = Text;
    /**
     * 以二进制文件读取
     */
    const BinaryString = 'readAsBinaryString'; ReadType["BinaryString"] = BinaryString;
    /**
     * 以 ArrayBuffer 读取
     */
    const ArrayBuffer = 'readAsArrayBuffer'; ReadType["ArrayBuffer"] = ArrayBuffer;
  })(ReadType || (ReadType = {}));








  /**
   * 读取本地浏览器选择的文件
   * @param file 选择的文件
   * @param options 读取的选项
   * @returns 返回了读取到的内容（异步）
   */
  function _readLocal(
    file,
    options


   = {},
  ) {
    const { type, encoding } = Object.assign(
      {
        type: ReadType.DataURL,
        encoding: 'UTF-8',
      },
      options,
    );
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error('file not exists'));
      }
      const fr = new FileReader();
      fr.onload = () => {
        resolve(fr.result );
      };
      fr.onerror = (error) => {
        reject(error);
      };
      switch (type) {
        case ReadType.DataURL:
          fr.readAsDataURL(file);
          break
        case ReadType.Text:
          fr.readAsText(file, encoding);
          break
        case ReadType.BinaryString:
          fr.readAsBinaryString(file);
          break
        case ReadType.ArrayBuffer:
          fr.readAsArrayBuffer(file);
          break
      }
    })
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
   * 为 js 中的 Date 对象原型添加 format 格式化方法
   * @param date 要进行格式化的日期
   * @param fmt 日期的格式，格式 {@code '[Y+|y+][M+][D+|d+][H+|h+][m+][s+][S+][q+]'}
   * @returns 格式化得到的结果
   */
  function dateFormat(date, fmt) {
    const timeFormatDefaults = {
      'Y+|y+': date.getFullYear(),
      'M+': date.getMonth() + 1, // 月份
      'D+|d+': date.getDate(), // 日
      'H+|h+': date.getHours(), // 小时
      'm+': date.getMinutes(), // 分
      's+': date.getSeconds(), // 秒
      'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
      'S+': date.getMilliseconds(), // 毫秒
    };
    for (const k in timeFormatDefaults) {
      if (!new RegExp('(' + k + ')').test(fmt)) {
        continue
      }
      if (k === 'Y+|y+') {
        fmt = fmt.replace(
          RegExp.$1,
          ('' + timeFormatDefaults[k]).substr(4 - RegExp.$1.length),
        );
      } else if (k === 'S+') {
        let lens = RegExp.$1.length;
        lens = lens === 1 ? 3 : lens;
        fmt = fmt.replace(
          RegExp.$1,
          ('00' + timeFormatDefaults[k]).substr(
            ('' + timeFormatDefaults[k]).length - 1,
            lens,
          ),
        );
      } else {
        const v = Reflect.get(timeFormatDefaults, k);
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length === 1 ? v : ('00' + v).substr(('' + v).length),
        );
      }
    }
    return fmt
  }

  /**
   * 判断一个对象是否是无效的
   * 无效的值仅包含 null/undefined
   * @param object 任何一个对象
   * @returns 是否无效的值
   */
  function isNullOrUndefined(object) {
    return object === undefined || object === null
  }

  /**
   * 返回第一个参数的函数
   * 注: 一般可以当作返回参数自身的函数，如果你只关注第一个参数的话
   * @param obj 任何对象
   * @typeparam T 传入参数的类型
   * @typeparam R 返回结果的类型，默认为 T，只是为了兼容该函数当参数被传递时可能出现需要类型不一致的问题
   * @returns 传入的第一个参数
   */
  function returnItself(obj) {
    return obj 
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
  function compatibleAsync(
    res,
    callback,
  ) {
    return (res instanceof Promise
      ? res.then(callback)
      : callback(res )) 
  }

  /**
   * 谓词的返回值，支持异步函数
   */






  /**
   * 内部使用的函数
   * 注: 如果谓词中包含任意一个异步(返回 Promise)函数,则整个返回结果将变成异步的,否则默认为同步操作.
   * @param fns 谓词数组
   * @param args 谓词应用的参数列表
   * @param condition 临界条件
   * @returns 返回结果
   */
  function _inner(
    fns,
    args,
    condition,
  ) {
    const fn = fns[0];
    const res = fn(...args);
    function _call(res) {
      if (condition(res)) {
        return res
      }
      const others = fns.slice(1);
      if (others.length === 0) {
        return res
      }
      return _inner(others, args, condition)
    }
    return compatibleAsync(res, _call) 
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
        return _inner(fns, args, (res) => !res)
      }
    }
    /**
     * 使用 || 进行连接
     * @param fns 连接任意多个谓词
     * @returns 连接后的新谓词
     */
     static or(...fns) {
      return function (...args) {
        return _inner(fns, args, (res) => res)
      }
    }
    /**
     * 对谓词进行取反
     * @param fn 谓词
     * @returns 取反后的谓词
     */
     static not(fn) {
      return new Proxy(fn, {
        apply(_, _this, args) {
          return compatibleAsync(Reflect.apply(_, this, args), (res) => !res)
        },
      })
    }
  }
  const not = CombinedPredicate.not;

  /**
   * 操作类型
   */
  var ActionType; (function (ActionType) {
    const forEach = 'forEach'; ActionType["forEach"] = forEach;
    const filter = 'filter'; ActionType["filter"] = filter;
    const map = 'map'; ActionType["map"] = map;
    const flatMap = 'flatMap'; ActionType["flatMap"] = flatMap;
    const sort = 'sort'; ActionType["sort"] = sort;
    const reduce = 'reduce'; ActionType["reduce"] = reduce;
    const reduceRight = 'reduceRight'; ActionType["reduceRight"] = reduceRight;
    const findIndex = 'findIndex'; ActionType["findIndex"] = findIndex;
    const find = 'find'; ActionType["find"] = find;
    const every = 'every'; ActionType["every"] = every;
    const some = 'some'; ActionType["some"] = some;
    const parallel = 'parallel'; ActionType["parallel"] = parallel;
    const serial = 'serial'; ActionType["serial"] = serial;
  })(ActionType || (ActionType = {}));
  /**
   * 保存高阶函数传入的异步操作
   * @field 异步操作的类型
   * @field 异步操作
   */
  class Action {
     static __initStatic() {this.Type = ActionType;}
    constructor(  type,   args) {this.type = type;this.args = args;
      this.type = type;
      this.args = args;
    }
  } Action.__initStatic();

  /**
   * 判断数字是否在指定区间之中
   * @param num 指定数字
   * @param min 最小值
   * @param max 最大值（不包含）
   */
  function isRange(num, min, max) {
    return num >= min && num < max
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
      return isNullOrUndefined(str) || str === ''
    }
    /**
     * 判断一个字符串是否为空白的字符串
     * @param str 字符串
     * @returns 是否为空字符串
     */
     static isBlank(str) {
      return StringValidator.isEmpty(str) || str.trim() === ''
    }

    /**
     * 判断字符串是否位小数
     * @param str 需要进行判断的字符串
     * @returns 是否为小数
     */
     static isFloat(str) {
      if (isNullOrUndefined(str)) {
        return false
      }
      return FloatRule.test(str)
    }

    /**
     * 判断字符串是否位整数
     * @param str 需要进行判断的字符串
     * @returns 是否为小数
     */
     static isInteger(str) {
      return !isNullOrUndefined(str) && IntegerRule.test(str)
    }
    /**
     * 判断邮箱的格式是否正确
     * @param str 邮箱字符串
     * @returns 是否是邮箱
     */
     static isEmail(str) {
      return !isNullOrUndefined(str) && EmailRule.test(str)
    }
    /**
     * 判断 ipv4 地址的格式是否正确
     * @param str ipv4 字符串
     * @returns 是否是 ipv4 地址
     */
     static isIpv4(str) {
      return !isNullOrUndefined(str) && Ipv4Rule.test(str)
    }
    /**
     * 判断字符串是否为正确的端口号
     * 正确的端口号是 1-65535
     * @param str 字符串
     * @returns 是否为端口号
     */
     static isPort(str) {
      // tslint:disable-next-line:radix
      return StringValidator.isInteger(str) && isRange(parseInt(str), 1, 65535)
    }
    /**
     * 判断是否为固定电话
     * @param str 字符串
     * @returns 是否为固定电话
     */
     static isTelephone(str) {
      return !isNullOrUndefined(str) && TelephoneRule.test(str)
    }
    /**
     * 判断是否为移动电话
     * @param str 字符串
     * @returns 是否为移动电话
     */
     static isMobile(str) {
      return !isNullOrUndefined(str) && MobileRule.test(str)
    }
    /**
     * 判断是否为域名
     * @param str 字符串
     * @returns 是否为域名
     */
     static isDomain(str) {
      return !isNullOrUndefined(str) && DomainRule.test(str)
    }
    /**
     * 判断是否为邮政编码
     * @param str 字符串
     * @returns 是否为邮政编码
     */
     static isPostcode(str) {
      return !isNullOrUndefined(str) && PostcodeRule.test(str)
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
  var Type; (function (Type) {
    const String = 0; Type[Type["String"] = String] = "String";
    const Number = String + 1; Type[Type["Number"] = Number] = "Number";
    const Boolean = Number + 1; Type[Type["Boolean"] = Boolean] = "Boolean";
    const Undefined = Boolean + 1; Type[Type["Undefined"] = Undefined] = "Undefined";
    const Null = Undefined + 1; Type[Type["Null"] = Null] = "Null";
    const Symbol = Null + 1; Type[Type["Symbol"] = Symbol] = "Symbol";
    const PropertyKey = Symbol + 1; Type[Type["PropertyKey"] = PropertyKey] = "PropertyKey";
    const Object = PropertyKey + 1; Type[Type["Object"] = Object] = "Object";
    const Array = Object + 1; Type[Type["Array"] = Array] = "Array";
    const Function = Array + 1; Type[Type["Function"] = Function] = "Function";
    const Date = Function + 1; Type[Type["Date"] = Date] = "Date";
    const File = Date + 1; Type[Type["File"] = File] = "File";
    const Blob = File + 1; Type[Type["Blob"] = Blob] = "Blob";
    const Stream = Blob + 1; Type[Type["Stream"] = Stream] = "Stream";
    const ArrayBuffer = Stream + 1; Type[Type["ArrayBuffer"] = ArrayBuffer] = "ArrayBuffer";
    const ArrayBufferView = ArrayBuffer + 1; Type[Type["ArrayBufferView"] = ArrayBufferView] = "ArrayBufferView";
    const URLSearchParams = ArrayBufferView + 1; Type[Type["URLSearchParams"] = URLSearchParams] = "URLSearchParams";
    const FormData = URLSearchParams + 1; Type[Type["FormData"] = FormData] = "FormData";
  })(Type || (Type = {}));
  /**
   * 校验变量的类型
   */
  class TypeValidator {
    /**
     * 类型枚举类对象
     */
     static __initStatic() {this.Type = Type;}
    /**
     * 获取变量的类型
     * @param val 变量
     * @returns 类型
     * 注: 此函数依赖于 ts 的编译枚举原理与约定 {@link TypeValidator} 中所有判断函数都是以 `is` 开头并于 {@link Type} 中的保持一致
     */
     static getType(val) {
      for (const k of Object.keys(Type)) {
        if (StringValidator.isInteger(k)) {
          const type = Type[k ];
          if ((TypeValidator )['is' + type](val)) {
            return Type[type ] 
          }
        }
      }
      throw new Error('无法识别的类型')
    }
    /**
     * 判断是否为指定类型
     * @param val 需要判断的值
     * @param types 需要判断的类型
     */
     static isType(val, ...types) {
      return types.includes(TypeValidator.getType(val))
    }
    /**
     * 判断是否为字符串
     * @param val 需要判断的值
     * @returns 是否为字符串
     */
     static isString(val) {
      return typeof val === 'string'
    }
    /**
     * 判断是否为数字
     * @param val 需要判断的值
     * @returns 是否为数字
     */
     static isNumber(val) {
      return typeof val === 'number'
    }
    /**
     * 判断是否为布尔值
     * @param val 需要判断的值
     * @returns 是否为布尔值
     */
     static isBoolean(val) {
      return typeof val === 'boolean'
    }
    /**
     * 判断是否为 Symbol
     * @param val 需要判断的值
     * @returns 是否为 Symbol
     */
     static isSymbol(val) {
      return typeof val === 'symbol'
    }
    /**
     * 判断是否为 undefined
     * @param val 需要判断的值
     * @returns 是否为 undefined
     */
     static isUndefined(val) {
      return val === undefined
    }
    /**
     * 判断是否为 null
     * @param val 需要判断的值
     * @returns 是否为 null
     */
     static isNull(val) {
      return val === null
    }
    /**
     * 判断是否可以作为对象的属性
     * @param val 需要判断的值
     * @returns 是否为对象属性
     */
     static isPropertyKey(val) {
      return (
        TypeValidator.isString(val) ||
        TypeValidator.isNumber(val) ||
        TypeValidator.isSymbol(val)
      )
    }
    /**
     * 判断是否为对象
     * 注: 函数（包括 ES6 箭头函数）将不被视为对象
     * @param val 需要判断的值
     * @returns 是否为对象
     */
     static isObject(val) {
      return (
        !TypeValidator.isNull(val) &&
        !TypeValidator.isUndefined(val) &&
        typeof val === 'object'
      )
    }
    /**
     * 判断是否为数组
     * @param val 需要判断的值
     * @returns 是否为数组
     */
     static isArray(val) {
      return Array.isArray(val)
    }
    /**
     * 判断是否为数组
     * @param val 需要判断的值
     * @returns 是否为数组
     */
     static isFunction(val) {
      return toString.call(val) === '[object Function]'
    }
    /**
     * 判断是否为日期
     * @param val 需要判断的值
     * @returns 是否为日期
     */
     static isDate(val) {
      return toString.call(val) === '[object Date]'
    }
    /**
     * 判断是否为浏览器文件类型
     * @param val 需要判断的值
     * @returns 是否为浏览器文件类型
     */
     static isFile(val) {
      return toString.call(val) === '[object File]'
    }
    /**
     * 判断是否为浏览器二进制类型
     * @param val 需要判断的值
     * @returns 是否为浏览器二进制类型
     */
     static isBlob(val) {
      return toString.call(val) === '[object Blob]'
    }
    /**
     * 判断是否为浏览器流类型
     * @param val 需要判断的值
     * @returns 是否为浏览器流类型
     */
     static isStream(val) {
      return TypeValidator.isObject(val) && TypeValidator.isFunction(val.pipe)
    }
    /**
     * 判断是否为浏览器 ArrayBuffer 类型
     * @param val 需要判断的值
     * @returns 是否为浏览器 ArrayBuffer 类型
     */
     static isArrayBuffer(val) {
      return toString.call(val) === '[object ArrayBuffer]'
    }
    /**
     * 判断是否为浏览器 ArrayBufferView 类型
     * @param val 需要判断的值
     * @returns 是否为浏览器 ArrayBufferView 类型
     */
     static isArrayBufferView(val) {
      return typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView
        ? ArrayBuffer.isView(val)
        : val && val.buffer && val.buffer instanceof ArrayBuffer
    }
    /**
     * 判断是否为浏览器 URLSearchParams 类型
     * @param val 需要判断的值
     * @returns 是否为浏览器 URLSearchParams 类型
     */
     static isURLSearchParams(val) {
      return !TypeValidator.isUndefined(val) && val instanceof URLSearchParams
    }
    /**
     * 判断是否为浏览器 FormData 类型
     * @param val 需要判断的值
     * @returns 是否为浏览器 FormData 类型
     */
     static isFormData(val) {
      return !TypeValidator.isUndefined(val) && val instanceof FormData
    }
  } TypeValidator.__initStatic();

  /**
   * 安全执行某个函数
   * 支持异步函数
   * @param fn 需要执行的函数
   * @param defaultVal 发生异常后的默认返回值，默认为 null
   * @param args 可选的函数参数
   * @returns 函数执行的结果，或者其默认值
   */
  function safeExec(
    fn,
    defaultVal,
    ...args
  ) {
    const defRes = (defaultVal === undefined ? null : defaultVal); 
    try {
      const res = fn(...(args ));
      return res instanceof Promise ? res.catch(() => defRes) : res
    } catch (err) {
      return defRes
    }
  }

  /**
   * 提取对象中的字段并封装为函数
   * @param k 提取的字段，深度获取使用 . 分割不同的字段
   * @returns 获取对象中指定字段的函数
   */
  function extractField(
    k,
  ) {
    const fields = TypeValidator.isString(k) ? k.split('.') : [k];
    return fields.reduceRight((fn, field) => {
      return function (obj) {
        return safeExec(() => fn(Reflect.get(obj , field)))
      }
    }, returnItself)
  }

  /**
   * 获取提取对象属性的函数
   * @param k 提取对象属性的函数或者是属性名（允许使用 . 进行分割）
   * @returns 提取对象属性的函数
   */
  function getKFn(k) {
    return k instanceof Function ? k : (extractField(k) )
  }

  /**
   * js 数组按照某个条件进行分组
   *
   * @param arr 要进行分组的数组
   * @param k 元素分组的唯一标识函数
   * @returns 元素标识 => 数组映射 Map
   * @typeparam T 数组元素的类型
   * @typeparam K 分组依据的 Key 的类型，也是结果 Map 的 K
   */



































  function groupBy(
    arr,
    k,
    /**
     * 默认的值处理函数
     * @param res 最终 V 集合
     * @param item 当前迭代的元素
     * @returns 将当前元素合并后的最终 V 集合
     */
    vFn = ((res, item) => {
      res.push(item);
      return res
    }) ,
    init = () => [] ,
  ) {
    const kFn = getKFn(k);
    // 将元素按照分组条件进行分组得到一个 条件 -> 数组 的对象
    return arr.reduce((res, item, index, arr) => {
      const k = kFn(item, index, arr);
      // 如果已经有这个键了就直接追加, 否则先将之初始化再追加元素
      if (!res.has(k)) {
        res.set(k, init());
      }
      res.set(k, vFn(res.get(k), item, index, arr));
      return res
    }, new Map())
  }

  /**
   * 将数组映射为 Map
   * @param arr 数组
   * @param k 产生 Map 元素唯一标识的函数，或者对象元素中的一个属性名
   * @param v 产生 Map 值的函数，默认为返回数组的元素，或者对象元素中的一个属性名
   * @returns 映射产生的 map 集合
   */
  function arrayToMap(
    arr,
    k,
    v = returnItself,
  ) {
    const kFn = getKFn(k);
    const vFn = getKFn(v);
    return arr.reduce(
      (res, item, index, arr) =>
        res.set(kFn(item, index, arr), vFn(item, index, arr)),
      new Map(),
    )
  }

  /**
   * 日期格式化类
   */
  class DateFormat {
    /**
     * 构造函数
     * @param name 日期格式的名称
     * @param format 日期的格式值
     * @param value 格式化得到的值
     * @param index 需要替换位置的索引
     */
    constructor(
       name,
       format,
       value,
       index,
    ) {this.name = name;this.format = format;this.value = value;this.index = index;}
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
   * 月份日期校验
   */
  const monthDayValidate = {
    1: 31,
    3: 31,
    5: 31,
    7: 31,
    8: 31,
    10: 31,
    12: 31,
    4: 30,
    6: 30,
    9: 30,
    11: 30,
    2: 28,
  };
  /**
   * 解析字符串为 Date 对象
   * @param str 日期字符串
   * @param fmt 日期字符串的格式，目前仅支持使用 y(年),M(月),d(日),h(时),m(分),s(秒),S(毫秒)
   * @returns 解析得到的 Date 对象
   */
  function dateParse(str, fmt) {
    const now = new Date();
    defaultDateValues.set('year', now.getFullYear().toString());
    // 保存对传入的日期字符串进行格式化的全部信息数组列表
    const dateUnits = [];
    for (const [fmtName, regex] of dateFormats) {
      const regExp = new RegExp(regex);
      if (regExp.test(fmt)) {
        const matchStr = regExp.exec(fmt)[0];
        const regexStr = '`'.repeat(matchStr.length);
        const index = fmt.indexOf(matchStr);
        fmt = fmt.replace(matchStr, regexStr);
        dateUnits.push(
          new DateFormat(fmtName, '\\d'.repeat(matchStr.length), null, index),
        );
      } else {
        dateUnits.push(
          new DateFormat(fmtName, null, defaultDateValues.get(fmtName), -1),
        );
      }
    }
    // 进行验证是否真的是符合传入格式的字符串
    fmt = fmt.replace(new RegExp('`', 'g'), '\\d');
    if (!new RegExp(`^${fmt}$`).test(str)) {
      return null
    }
    // 进行一次排序, 依次对字符串进行截取
    dateUnits
      // 过滤掉没有得到格式化的对象
      .filter(({ format }) => format)
      // 按照字符串中日期片段的索引进行排序
      .sort(function (a, b) {
        return a.index - b.index
      })
      // 获取到匹配的日期片段的值
      .map((format) => {
        const matchDateUnit = new RegExp(format.format).exec(str);
        if (matchDateUnit !== null && matchDateUnit.length > 0) {
          str = str.replace(matchDateUnit[0], '');
          format.value = matchDateUnit[0];
        }
        return format
      })
      // 覆写到 dateStr 上面
      .forEach(({ format }, i) => {
        const matchDateUnit = new RegExp(format).exec(str);
        if (matchDateUnit !== null && matchDateUnit.length > 0) {
          str = str.replace(matchDateUnit[0], '');
          dateUnits[i].value = matchDateUnit[0];
        }
      });
    // 将截取完成的信息封装成对象并格式化标准的日期字符串
    const map = arrayToMap(
      dateUnits,
      (item) => item.name,
      (item) => item.value,
    );
    if (map.get('year').length === 2) {
      map.set(
        'year',
        defaultDateValues.get('year').substr(0, 2).concat(map.get('year')),
      );
    }
    // 注意：此处使用的是本地时间而非 UTC 时间
    const get = (unit) => parseInt(map.get(unit));
    const year = get('year');
    const month = get('month');
    const day = get('day');
    const hour = get('hour');
    const minute = get('minute');
    const second = get('second');
    const millieSecond = get('millieSecond');
    if (!isRange(month, 1, 12 + 1)) {
      return null
    }
    if (
      !isRange(
        day,
        1,
        Reflect.get(monthDayValidate, month) +
          (month === 2 && year % 4 === 0 ? 1 : 0) +
          1,
      )
    ) {
      return null
    }
    if (
      !isRange(hour, 0, 24 + 1) ||
      !isRange(minute, 0, 60 + 1) ||
      !isRange(second, 0, 60 + 1) ||
      !isRange(millieSecond, 0, 999 + 1)
    ) {
      return null
    }
    return new Date(year, month - 1, day, hour, minute, second, millieSecond)
  }

  /**
   * 根据 html 字符串创建 Element 元素
   * @param str html 字符串
   * @returns 创建的 Element 元素
   */
  function createElByString(str) {
    const root = document.createElement('div');
    root.innerHTML = str;
    return root.querySelector('*')
  }

  /**
   * 字符串安全的转换为小写
   * @param str 字符串
   * @returns 转换后得到的全小写字符串
   */
  function toLowerCase(str) {
    if (isNullOrUndefined(str) || typeof str !== 'string') {
      return str
    }
    return str.toLowerCase() 
  }

  let lastFocusEl;

  /**
   * 获取到最后一个获得焦点的元素
   * @returns 最后一个获取到焦点的元素
   */
  function _lastFocus() {
    return lastFocusEl
  }

  const lastFocus = Object.assign(_lastFocus, {
    init() {
      document.addEventListener(
        'focus',
        (event) => {
          lastFocusEl = event.target;
        },
        true,
      );
      document.addEventListener(
        'blur',
        () => {
          lastFocusEl = null;
        },
        true,
      );
    },
  });

  /**
   * 使用 Proxy 实现通用的单例模式
   * @param clazz 需要包装为单例的类型
   * @returns 包装后的单例模式类，使用 {@code new} 创建将只在第一次有效
   */
  function singleModel


  (clazz) {
    let instance;
    return new Proxy(clazz, {
      construct(target, args, newTarget) {
        if (instance === undefined) {
          instance = Reflect.construct(target, args, newTarget);
        }
        return instance
      },
    })
  }

  /**
   * 字符串安全的转换为大写
   * @param str 字符串
   * @returns 转换后得到的全大写字符串
   */
  function toUpperCase(str) {
    if (isNullOrUndefined(str) || typeof str !== 'string') {
      return str
    }
    return str.toUpperCase() 
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
      throw new Error('子类必须重写 from 函数')
    }
    /**
     * 将字符串列表构造为字符串
     *
     * @param list 字符串列表
     * @return {String} 字符串
     * @abstract
     */
     to(list) {
      throw new Error('子类必须重写 to 函数')
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
      return result
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
          str.substring(1))
      }, '')
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
        return (res += toUpperCase(str.substring(0, 1)) + str.substring(1))
      }, '')
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
      return str.split('_')
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
      return list.map(toLowerCase).join('_')
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
      return list.map(toUpperCase).join('_')
    }
  }

  /**
   * @enum {Symbol} 字符串风格常量对象
   */
  var StringStyleType; (function (StringStyleType) {
    /**
     * 小写驼峰
     */
    const Camel = 1; StringStyleType[StringStyleType["Camel"] = Camel] = "Camel";
    /**
     * 大写驼峰
     */
    const Pascal = Camel + 1; StringStyleType[StringStyleType["Pascal"] = Pascal] = "Pascal";
    /**
     * 小写下划线
     */
    const Snake = Pascal + 1; StringStyleType[StringStyleType["Snake"] = Snake] = "Snake";
    /**
     * 大写下划线
     */
    const ScreamingSnake = Snake + 1; StringStyleType[StringStyleType["ScreamingSnake"] = ScreamingSnake] = "ScreamingSnake";
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
          return new CamelConverter()
        case StringStyleType.Pascal:
          return new PascalConverter()
        case StringStyleType.Snake:
          return new SnakeConverter()
        case StringStyleType.ScreamingSnake:
          return new ScreamingSnakeConverter()
        default:
          throw new Error('No corresponding converter found')
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
        return str
      }
      return this.toConverter.to(this.fromConverter.from(str))
    }
  }

  /**
   * 内存缓存接口
   */







































  /**
   * 基本缓存实现
   * 主要封装通用的 delete/size 函数
   */
   class BasicMemoryCache {
     __init() {this.cache = new Map();}
    
    constructor({ limit = Infinity } = {}) {BasicMemoryCache.prototype.__init.call(this);
      if (limit <= 0) {
        throw new Error('缓存的最大容量至少为 1')
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
      return this.cache.size
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
        keys.forEach((k) => this.delete(k));
      }
      this.cache.set(key, val);
    }

    delete(key) {
      this.cache.delete(key);
    }

    get(key) {
      return this.cache.get(key)
    }

    get size() {
      return this.cache.size
    }

    has(key) {
      return this.cache.has(key)
    }
  }

  /**
   * IFU 算法
   */
  class MemoryCacheLFU extends BasicMemoryCache {constructor(...args) { super(...args); MemoryCacheLFU.prototype.__init2.call(this); }
     __init2() {this.lfuMap = new Map();}

    add(key, val) {
      const diff = this.cache.size + 1 - this.limit;
      if (diff > 0) {
        const keys = [...this.cache.keys()]
          .sort((k1, k2) => this.lfuMap.get(k1) - this.lfuMap.get(k2))
          .slice(0, diff);
        keys.forEach((k) => this.delete(k));
      }
      this.cache.set(key, val);
      this.lfuMap.set(key, 0);
    }

    get(key) {
      this.lfuMap.set(key, this.lfuMap.get(key) + 1);
      return this.cache.get(key)
    }

    has(key) {
      this.lfuMap.set(key, this.lfuMap.get(key) + 1);
      return this.cache.has(key)
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
  class MemoryCacheLRU extends BasicMemoryCache {constructor(...args2) { super(...args2); MemoryCacheLRU.prototype.__init3.call(this);MemoryCacheLRU.prototype.__init4.call(this); }
     __init3() {this.i = 0;}
     get idx() {
      return this.i++
    }
     __init4() {this.lruMap = new Map();}

    add(key, val) {
      const diff = this.cache.size + 1 - this.limit;
      if (diff > 0) {
        const keys = [...this.cache.keys()]
          .sort((k1, k2) => this.lruMap.get(k1) - this.lruMap.get(k2))
          .slice(0, diff);
        console.log(keys, this.lruMap);
        keys.forEach((k) => this.delete(k));
      }
      this.cache.set(key, val);
      this.lruMap.set(key, this.idx);
    }

    get(key) {
      this.lruMap.set(key, this.idx);
      return this.cache.get(key)
    }

    has(key) {
      this.lruMap.set(key, this.idx);
      return this.cache.has(key)
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

  var MemoryCacheEnum; (function (MemoryCacheEnum) {
    //先进先出
    const Fifo = 0; MemoryCacheEnum[MemoryCacheEnum["Fifo"] = Fifo] = "Fifo";
    //最少使用
    const Lfu = Fifo + 1; MemoryCacheEnum[MemoryCacheEnum["Lfu"] = Lfu] = "Lfu";
    //最近使用
    const Lru = Lfu + 1; MemoryCacheEnum[MemoryCacheEnum["Lru"] = Lru] = "Lru";
  })(MemoryCacheEnum || (MemoryCacheEnum = {}));

  /**
   * 缓存工厂类
   */
  class MemoryCacheFactory {
    static create(
      type,
      config,
    ) {
      switch (type) {
        case MemoryCacheEnum.Fifo:
          return new MemoryCacheFIFO(config)
        case MemoryCacheEnum.Lfu:
          return new MemoryCacheLFU(config)
        case MemoryCacheEnum.Lru:
          return new MemoryCacheLRU(config)
      }
    }
  }

  const onceOfSameParamIdentity = (fn, args) =>
    `onceOfSameParam-${fn.toString()}-${JSON.stringify(args)}`;

  /**
   * 包装一个函数为指定参数只执行一次的函数
   * @param fn 需要包装的函数
   * @param identity 参数转换的函数，参数为需要包装函数的参数
   * @param memoryCache
   * @returns 需要被包装的函数
   */
  function _onceOfSameParam(
    fn,
    identity = onceOfSameParamIdentity,
    memoryCache = MemoryCacheFactory.create(MemoryCacheEnum.Fifo),
  ) {
    const res = new Proxy(fn, {
      apply(_, _this, args) {
        const key = identity(fn, args);
        const old = memoryCache.get(key);
        if (old !== undefined) {
          return old
        }
        const res = Reflect.apply(_, _this, args);
        return compatibleAsync(res, (res) => {
          memoryCache.add(key, res);
          return res
        })
      },
    });
    return Object.assign(res, {
      origin: fn,
      clear(...keys) {
        if (keys.length) {
          memoryCache.clear();
        } else {
          keys.forEach((key) => memoryCache.delete(key));
        }
      },
    })
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
    (from, to) =>
      new StringStyleConverter(from, to),
  );

  /**
   * 日期格式化器
   * 包含格式化为字符串和解析字符串为日期的函数
   */
  class DateFormatter {
    /**
     * 日期格式化器
     */
     static __initStatic() {this.dateFormatter = new DateFormatter('yyyy-MM-dd');}
    /**
     * 时间格式化器
     */
     static __initStatic2() {this.timeFormatter = new DateFormatter('hh:mm:ss');}
    /**
     * 日期时间格式化器
     */
     static __initStatic3() {this.dateTimeFormatter = new DateFormatter('yyyy-MM-dd hh:mm:ss');}
    /**
     * 构造函数
     * @param fmt 日期时间格式
     */
    constructor( fmt) {this.fmt = fmt;}
    /**
     * 格式化
     * @param date 需要格式化的日期
     * @returns 格式化的字符串
     */
     format(date) {
      if (isNullOrUndefined(date)) {
        return ''
      }
      return dateFormat(date, this.fmt)
    }
    /**
     * 解析字符串为日期对象
     * @param str 字符串
     * @returns 解析得到的日期
     */
     parse(str) {
      if (stringValidator.isEmpty(str)) {
        return null
      }
      return dateParse(str, this.fmt)
    }
    /**
     * 将日期时间字符串转换为前端指定格式的字符串
     * 主要适用场景是前端接收到后端的日期时间一般是一个字符串，然而需要自定义格式的时候还必须先创建 {@link Date} 对象才能格式化，略微繁琐，故使用该函数
     * @param str 字符串
     * @param parseFmt 解析的日期时间格式。默认直接使用 {@link new Date()} 创建
     * @returns 转换后得到的字符串
     */
     strFormat(str, parseFmt) {
      if (stringValidator.isEmpty(str)) {
        return ''
      }
      const date = parseFmt ? dateParse(str, parseFmt) : new Date(str);
      return dateFormat(date, this.fmt)
    }
  } DateFormatter.__initStatic(); DateFormatter.__initStatic2(); DateFormatter.__initStatic3();

  /**
   * 缓存值的构造函数对象参数定义接口
   */















  /**
   * 缓存的值
   */
  class CacheVal  {
    
    
    
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
   * 缓存选项
   * @param options.timeout 超时时间，以毫秒为单位
   * @param options.timeStart 缓存开始时间
   * @param options.serialize 缓存序列化
   * @param options.deserialize 缓存反序列化
   */

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
    constructor({
      timeout = TimeoutInfinite,
      serialize = JSON.stringify,
      deserialize = JSON.parse,
    } = {}) {
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
     async clearExpired() {
      const local = this.localStorage;
      const getKeys = () => {
        const len = local.length;
        const res = [];
        for (let i = 0; i < len; i++) {
          res.push(local.key(i));
        }
        return res
      };
      getKeys()
        .filter(not(isNullOrUndefined))
        .map((key) => safeExec(() => JSON.parse(local.getItem(key))))
        .filter(
          (cacheVal) =>
            !isNullOrUndefined(cacheVal) &&
            isNullOrUndefined(cacheVal.cacheOption),
        )
        // TODO 这里暂时加个补丁，过滤掉 timeStart,timeout 为 undefined 的缓存
        .filter(({ cacheOption = {}  }) => {
          const { timeStart, timeout } = cacheOption;
          if (isNullOrUndefined(timeStart) || isNullOrUndefined(timeout)) {
            return false
          }
          return timeout !== TimeoutInfinite && Date.now() - timeStart > timeout
        })
        .forEach(({ key }) => local.removeItem(key));
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
        return
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
      this.localStorage.setItem(
        key,
        JSON.stringify(
          new CacheVal({
            key,
            val: this.cacheOption.serialize(val),
            // 我们不需要缓存序列化/反序列化策略（实际上也无法缓存）
            cacheOption: {
              timeStart: Date.now(),
              timeout: timeout || this.cacheOption.timeout,
            } ,
          }),
        ),
      );
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
      if (
        isNullOrUndefined(cacheVal) ||
        isNullOrUndefined(cacheVal.cacheOption)
      ) {
        return null
      }
      const [timeStart, timeout, deserialize] = [
        cacheVal.cacheOption.timeStart,
        cacheVal.cacheOption.timeout,
        this.cacheOption.deserialize,
      ];
      // 如果超时则删除并返回 null
      if (timeout !== TimeoutInfinite && Date.now() - timeStart > timeout) {
        this.del(key);
        return null
      }
      try {
        return deserialize(cacheVal.val)
      } catch (e) {
        this.del(key);
        return null
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
      if (
        isNullOrUndefined(cacheVal) ||
        isNullOrUndefined(cacheVal.cacheOption)
      ) {
        return null
      }
      const [timeStart, timeout, deserialize] = [
        cacheVal.cacheOption.timeStart,
        cacheVal.cacheOption.timeout,
        this.cacheOption.deserialize,
      ];
      // 如果超时则删除并返回 null
      if (timeout !== TimeoutInfinite && Date.now() - timeStart > timeout) {
        this.del(key);
        return null
      }
      try {
        const result = deserialize(cacheVal.val);
        this.set(key, result, { timeStart: Date.now(), timeout } );
        return result
      } catch (e) {
        this.del(key);
        return null
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
  function emptyFunc(...args) {}

  /**
   * 路径工具
   */
  class PathUtil {
    /**
     * 拼接多个路径
     *
     * @param paths 路径数组
     * @return {String} 拼接完成的路径
     */
     static join(...paths) {
      return paths.reduce(PathUtil._join)
    }
    /**
     * 路径分隔符
     */
     static __initStatic() {this.Separator = '/';}
    /**
     * 拼接两个路径
     *
     * @param pathStart 开始路径
     * @param pathEnd   结束路径
     * @return {String} 拼接完成的两个路径
     */
     static _join(pathStart, pathEnd) {
      if (pathStart.endsWith(PathUtil.Separator)) {
        return (pathStart + pathEnd).replace(
          PathUtil.Separator + PathUtil.Separator,
          PathUtil.Separator,
        )
      }
      if (pathEnd.startsWith(PathUtil.Separator)) {
        return pathStart + pathEnd
      }
      return pathStart + PathUtil.Separator + pathEnd
    }
  } PathUtil.__initStatic();

  var LoggerLevelEnum; (function (LoggerLevelEnum) {
    const Debug = 0; LoggerLevelEnum[LoggerLevelEnum["Debug"] = Debug] = "Debug";
    const Log = Debug + 1; LoggerLevelEnum[LoggerLevelEnum["Log"] = Log] = "Log";
    const Info = Log + 1; LoggerLevelEnum[LoggerLevelEnum["Info"] = Info] = "Info";
    const Warn = Info + 1; LoggerLevelEnum[LoggerLevelEnum["Warn"] = Warn] = "Warn";
    const Error = Warn + 1; LoggerLevelEnum[LoggerLevelEnum["Error"] = Error] = "Error";
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
    static __initStatic() {this.Level = LoggerLevelEnum;}
    /**
     * 设置 enable 的 setter 属性，在改变时合并对应的子类对象实现
     * @param enable 是否开启
     */
    set enable(enable) {
  (Object.keys(console) ).forEach((k) =>
        Reflect.set(this, k, enable ? console[k] : emptyFunc),
      );
    }

    /**
     * 设置日志的级别
     * @param level
     */
    set level(level) {
  (Object.keys(console) )
        .filter((k) => Reflect.has(enumMap, k))
        .forEach((k) =>
          Reflect.set(
            this,
            k,
            Reflect.get(enumMap, k) >= level ? console[k] : emptyFunc,
          ),
        );
    }

    /**
     * 开发日志：业务强相关调试日志，希望其他人开发时默认隐藏起来的日志（例如第三方服务的回调日志很多，但对于服务接入层的使用者并不关心）
     */
    __init() {this.debug = console.debug;}
    /**
     * 开发日志：业务相关调试日志，希望其他开发时也能看到的日志
     */
    __init2() {this.log = console.log;}
    /**
     * 生产日志：开发环境也会打印的日志，希望在生产环境打印并且方便调试的日志
     */
    __init3() {this.info = console.info;}
    /**
     * 警告日志：一些危险的操作可以在这里打印出来，同时会显示在生产环境（例如警告用户不要在控制台输入不了解的代码以避免账号安全）
     */
    __init4() {this.warn = console.warn;}
    /**
     * 错误日志：发生错误时使用的日志，发生影响到用户的错误时必须使用该日志
     */
    __init5() {this.error = console.error;}

    __init6() {this.dir = console.dir;}
    __init7() {this.dirxml = console.dirxml;}
    __init8() {this.table = console.table;}
    __init9() {this.trace = console.trace;}
    __init10() {this.group = console.group;}
    __init11() {this.groupCollapsed = console.groupCollapsed;}
    __init12() {this.groupEnd = console.groupEnd;}
    __init13() {this.clear = console.clear;}
    __init14() {this.count = console.count;}
    __init15() {this.assert = console.assert;}
    __init16() {this.time = console.time;}
    __init17() {this.timeEnd = console.timeEnd;}
    __init18() {this.timeStamp = console.timeStamp;}

    /**
     * 构造函数
     * @param options 可选项
     * @param options.enable 是否开启日志
     */
    constructor(
      {
        enable = true,
        level = LoggerLevelEnum.Log,
      } = {} ,
    ) {Logger.prototype.__init.call(this);Logger.prototype.__init2.call(this);Logger.prototype.__init3.call(this);Logger.prototype.__init4.call(this);Logger.prototype.__init5.call(this);Logger.prototype.__init6.call(this);Logger.prototype.__init7.call(this);Logger.prototype.__init8.call(this);Logger.prototype.__init9.call(this);Logger.prototype.__init10.call(this);Logger.prototype.__init11.call(this);Logger.prototype.__init12.call(this);Logger.prototype.__init13.call(this);Logger.prototype.__init14.call(this);Logger.prototype.__init15.call(this);Logger.prototype.__init16.call(this);Logger.prototype.__init17.call(this);Logger.prototype.__init18.call(this);
      this.enable = enable;
      this.level = level;
    }
  } Logger.__initStatic();

  /**
   * 导出一个全局可用的 Logger 对象
   * 使用 enable 属性控制是否开启日志输出，默认为 true
   */
  const logger = new Logger();

  /**
   * 缓存的事件监听对象
   */

















  /**
   * 事件工具类
   */
  class EventUtil {
    /**
     * 缓存的事件监听对象映射表
     */
     static __initStatic() {this.listenerMap = new Map();}

    //region add

    



































    static add(
      dom,
      type,
      listener,
      options,
    ) {
      if (!EventUtil.listenerMap.has(dom)) {
        EventUtil.listenerMap.set(dom, []);
      }
      EventUtil.listenerMap.get(dom).push({
        type,
        listener,
        options,
      });
      dom.addEventListener(type, listener, options);
    }

    //endregion

    //region remove

    



































    static remove(
      dom,
      type,
      listener,
      options,
    ) {
      dom.removeEventListener(type, listener , options);
      EventUtil.listenerMap.set(
        dom,
        (EventUtil.listenerMap.get(dom) || []).filter(
          (cacheListener) =>
            cacheListener.type !== type ||
            cacheListener.listener !== listener ||
            cacheListener.options !== options,
        ),
      );
    }

    //endregion

    //region removeByType

    





























    static removeByType(
      dom,
      type,
      options,
    ) {
      const listenerList = EventUtil.listenerMap.get(dom);
      if (listenerList === undefined) {
        return []
      }
      const map = groupBy(
        listenerList,
        (cacheListener) =>
          type === cacheListener.type && options === cacheListener.options,
      );
      const removeCacheListenerList = map.get(true) || [];
      const retainCacheListenerList = map.get(true) || [];
      EventUtil.listenerMap.set(dom, retainCacheListenerList);
      return removeCacheListenerList.map((cacheListener) => {
        dom.removeEventListener(
          cacheListener.type,
          cacheListener.listener ,
          cacheListener.options,
        );
        return cacheListener
      })
    }

    //endregion
  } EventUtil.__initStatic();

  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation.

  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.

  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** */
  function e(t){return new Promise((e=>{if("number"==typeof t)setTimeout(e,t);else if("function"==typeof t){const n=setInterval((()=>{t()&&(clearInterval(n),e());}),100);}else e();}))}var a;!function(t){t.Filter="filter",t.Map="map",t.ForEach="forEach",t.Reduce="reduce",t.FlatMap="flatMap";}(a||(a={}));

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

  function getMusicName() {
    const titleElement = document.querySelector(
      'main .space-y-2 .inline',
    ); 
    return titleElement.textContent.replaceAll(' ', '')
  }

  function getLink() {
    return (document.querySelector('div.mt-4 a') ).href
  }

  var TypeEnum; (function (TypeEnum) {
    const Flac = 0; TypeEnum[TypeEnum["Flac"] = Flac] = "Flac";
    const HighMp3 = Flac + 1; TypeEnum[TypeEnum["HighMp3"] = HighMp3] = "HighMp3";
    const BasicMp3 = HighMp3 + 1; TypeEnum[TypeEnum["BasicMp3"] = BasicMp3] = "BasicMp3";
    const HighOGG = BasicMp3 + 1; TypeEnum[TypeEnum["HighOGG"] = HighOGG] = "HighOGG";
    const HighAAC = HighOGG + 1; TypeEnum[TypeEnum["HighAAC"] = HighAAC] = "HighAAC";
    const BasicAAC = HighAAC + 1; TypeEnum[TypeEnum["BasicAAC"] = BasicAAC] = "BasicAAC";
  })(TypeEnum || (TypeEnum = {}));

  const textToTypeMap = {
    [TypeEnum.Flac]: ['flac'],
    [TypeEnum.HighMp3]: ['极高', 'mp3'],
    [TypeEnum.BasicMp3]: ['标准', 'mp3'],
    [TypeEnum.HighOGG]: ['较高', 'ogg'],
    [TypeEnum.HighAAC]: ['较高', 'aac'],
    [TypeEnum.BasicAAC]: ['标准', 'aac'],
  };
  const typeToExtMap = {
    [TypeEnum.Flac]: 'flac',
    [TypeEnum.HighMp3]: 'mp3',
    [TypeEnum.BasicMp3]: 'mp3',
    [TypeEnum.HighOGG]: 'ogg',
    [TypeEnum.HighAAC]: 'aac',
    [TypeEnum.BasicAAC]: 'aac',
  };

  function getType(text) {
    text = text.toLocaleLowerCase();
    for (let [k, v] of Object.entries(textToTypeMap)) {
      if (v.every((s) => text.includes(s))) {
        return (k ) 
      }
    }
    return null
  }

  function hideDialog() {
    const dialogStyle = (document.querySelector(
      '.jetstream-modal',
    ) ).style;
    dialogStyle.zIndex = '-100';
    dialogStyle.display = 'none';
    dialogStyle.position = 'fixed';
    dialogStyle.left = '-10000px';
  }

  function main() {
    const downloadButtonList = document.getElementsByClassName('-m-2')[1];
    hideDialog();
    downloadButtonList.addEventListener('click', async (evt) => {
      const target = evt.target; 
      const text = target.textContent;
      const type = getType(text);
      const currLink = getLink();
      await e(() => getLink() !== currLink);
      downloadMusic(getLink(), getMusicName() + '.' + typeToExtMap[type]);
      hideDialog();
    });
  }

  window.addEventListener('load', main);

}());
