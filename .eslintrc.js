module.exports = {
  extends: ['standard', 'prettier'],
  env: {
    browser: true,
  },
  globals: {
    //引用的工具函数库
    rx: 'readonly',
    //油猴全局变量
    unsafeWindow: 'writable',
    GM_registerMenuCommand: 'readonly',
    GM_setValue: 'readonly',
    GM_getValue: 'readonly',
    GM_deleteValue: 'readonly',
    GM_addStyle: 'readonly',
    GM_getResourceText: 'readonly',
    GM_getResourceURL: 'readonly',
    GM_info: 'readonly',
    GM_listValues: 'readonly',
    GM_log: 'readonly',
    GM_openInTab: 'readonly',
    GM_setClipboard: 'readonly',
    GM_xmlhttpRequest: 'readonly',
  },
}
