module.exports = {
  extends: ['standard', 'prettier'],
  env: {
    browser: true,
  },
  globals: {
    //油猴全局变量
    unsafeWindow: 'writable',
    //引用的工具函数库
    rx: 'readonly',
  },
}
