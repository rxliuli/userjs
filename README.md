# 日常需要用到便自行实现的油猴脚本

[![source-GitHub](https://img.shields.io/badge/source-GitHub-brightgreen.svg)](https://github.com/rxliuli/userjs) [![license-MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/rxliuli/userjs/blob/master/LICENSE)

## 脚本列表

- [解除网页限制](https://github.com/rxliuli/userjs/raw/master/src/UnblockWebRestrictions/README.md): 快速解除/恢复网页限制
- [91Flac Download](https://github.com/rxliuli/userjs/tree/master/src/91FlacDownload): 下载歌曲时自动设置歌曲的文件名
- [百度网盘导出数据](https://github.com/rxliuli/userjs/tree/master/src/PanbaiduExportData): 导出百度网盘中的所有文件/文件夹的数据，方便进行二级的检索和分析
- [mobile 上知乎自动展开答案](https://github.com/rxliuli/userjs/tree/master/src/ZhihuAutoExpand): 自动展开 mobile 上知乎的答案，避免使用 app 打开
- [MDN 自动跳转中文翻译](https://github.com/rxliuli/userjs/tree/master/src/MDNAutoRedirectChinese): 如果有中文翻译的话就跳转到中文翻译页面，主要是为了避免 MDN 本身的自动跳转失效
- [Youtube RSS Inoreader Subscription](https://github.com/rxliuli/userjs/tree/master/src/YoutubeRSSInoreaderSubscription): 为 Youtube 订阅者添加 RSS 订阅按钮，点击后弹出 Inoreader 的订阅弹窗

## 库

- [rx-util](https://github.com/rxliuli/rx-util): 并非特意实现给 UserJS 使用，但里面基本上全是原生 TS 并编译成 JS 的工具库，在脚本中通过 `// @require https://greasyfork.org/scripts/382120-rx-util/code/rx-util.js` 引用
