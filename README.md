# 日常需要用到便自行实现的油猴脚本

[![source-GitHub](https://img.shields.io/badge/source-GitHub-brightgreen.svg)](https://github.com/rxliuli/userjs) [![license-MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/rxliuli/userjs/blob/master/LICENSE)

## 模块列表

- [解除网页限制](./packages/unblock-web-restrictions): 快速解除/恢复网页限制
- [translation-selection](./packages/translation-selection): 将网页上选中的文字为英文，然后复制到剪切版便于粘贴
- [goflac-download](./packages/goflac-download): 简化下载音乐需要重命名的麻烦，基本上和 91flac-download 差不多
- [user.css](./packages/usercss): 一些 user.css 样式
- [website](./packages/website): 脚本的配置网站

## 库

- [liuli-util](https://github.com/rxliuli/liuli-util): 并非特意实现给 UserJS 使用，但里面基本上全是无依赖的小型 JS 的工具库，在脚本中通过 `yarn add @liuli-util/*` 安装使用

## FAQ

### 为什么没有发布到 GreasyFork 上？

事实上，它们删了吾辈的用户脚本。由于它们要求所有的代码不能压缩，而第三方依赖（例如 react）默认会压缩，只能通过 `@require` 引入，但并非所有 npm 包都支持 iife（浏览器专用）的格式（一般支持 esm/cjs），懒得与其斗智斗勇所以放弃了。
