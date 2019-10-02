module.exports = {
  // 缩进宽度
  tabWidth: 2,
  // 单行最大宽度
  printWidth: 80,
  // 去掉代码结尾的分号
  semi: false,
  // 使用单引号替代双引号
  singleQuote: true,
  // 尽量在所有地方都添加尾逗号
  trailingComma: 'all',
  // 换行符
  endOfLine: 'lf',
  overrides: [
    {
      files: ['*.md', '*.json', '*.yml', '*.yaml'],
      options: {
        tabWidth: 2,
      },
    },
  ],
}
