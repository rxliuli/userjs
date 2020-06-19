# 日常需要用到便自行实现的油猴脚本

[![source-GitHub](https://img.shields.io/badge/source-GitHub-brightgreen.svg)](https://github.com/rxliuli/userjs) [![license-MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/rxliuli/userjs/blob/master/LICENSE)

## 脚本列表

- [解除网页限制](https://github.com/rxliuli/userjs/blob/master/src/UnblockWebRestrictions/README.md): 快速解除/恢复网页限制
- [Telegram 屏蔽群用户消息](https://github.com/rxliuli/userjs/blob/master/src/TelegramBlock/README.md)
  > 适用于 <https://web.telegram.org/#/im>
- [Telegram 黑暗模式萌化（动态泡水灵梦）](https://github.com/rxliuli/userjs/blob/master/src/TelegramDarkCute/README.md)
  > 适用于 <https://evgeny-nadymov.github.io/telegram-react/>
- [Slack 暗黑模式萌化（动态泡水灵梦）](https://github.com/rxliuli/userjs/blob/master/src/SlackDarkCute/SlackDarkCute.user.ts)
- [91Flac Download](https://github.com/rxliuli/userjs/blob/master/src/91FlacDownload/README.md): 下载歌曲时自动设置歌曲的文件名
- [百度网盘导出数据](https://github.com/rxliuli/userjs/blob/master/src/PanbaiduExportData/README.md): 导出百度网盘中的所有文件/文件夹的数据，方便进行二级的检索和分析
- [MDN 自动跳转中文翻译](https://github.com/rxliuli/userjs/blob/master/src/MDNAutoRedirectChinese/README.md): 如果有中文翻译的话就跳转到中文翻译页面，主要是为了避免 MDN 本身的自动跳转失效
- [Youtube RSS Inoreader Subscription](https://github.com/rxliuli/userjs/blob/master/src/YoutubeRSSInoreaderSubscription/README.md): 为 Youtube 订阅者添加 RSS 订阅按钮，点击后弹出 Inoreader 的订阅弹窗
- [动漫花园广告屏蔽（已废弃）](https://github.com/rxliuli/userjs/blob/master/src/dmhy/README.md)

## 库

- [rx-util](https://github.com/rxliuli/rx-util): 并非特意实现给 UserJS 使用，但里面基本上全是原生 TS 并编译成 JS 的工具库，在脚本中通过 `// @require https://greasyfork.org/scripts/382120-rx-util/code/rx-util.js` 引用
