# 日常需要用到便自行实现的油猴脚本

[![source-GitHub](https://img.shields.io/badge/source-GitHub-brightgreen.svg)](https://github.com/rxliuli/userjs) [![license-MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/rxliuli/userjs/blob/master/LICENSE)

## 模块列表

- [解除网页限制](https://github.com/rxliuli/userjs/tree/master/packages/unblock-web-restrictions): 快速解除/恢复网页限制
- [91Flac Download](https://github.com/rxliuli/userjs/tree/master/packages/91flac-download): 下载歌曲时自动设置歌曲的文件名
- [知乎移动端浏览优化](https://github.com/rxliuli/userjs/tree/master/packages/zhihu-mobile-browse): 知乎移动端浏览优化，避免使用 App 打开知乎。
- [website](https://github.com/rxliuli/userjs/tree/master/packages/website): 脚本的配置网站
- [百度网盘导出数据（已废弃）](https://github.com/rxliuli/userjs/blob/master/src/PanbaiduExportData/README.md): 导出百度网盘中的所有文件/文件夹的数据，方便进行二级的检索和分析
- [Telegram 屏蔽群用户消息（已废弃）](https://github.com/rxliuli/userjs/blob/master/src/TelegramBlock/README.md)
  > 适用于 <https://web.telegram.org/#/im>
- [Telegram 黑暗模式萌化（已废弃）](https://github.com/rxliuli/userjs/tree/master/packages/telegram-dark-cute)
  > 适用于 <https://evgeny-nadymov.github.io/telegram-react/>
- [Slack 暗黑模式萌化（已废弃）](https://github.com/rxliuli/userjs/tree/master/packages/slack-dark-cute)
- [MDN 自动跳转中文翻译（已废弃）](https://github.com/rxliuli/userjs/blob/master/src/MDNAutoRedirectChinese/README.md): 如果有中文翻译的话就跳转到中文翻译页面，主要是为了避免 MDN 本身的自动跳转失效
- [Youtube RSS Inoreader Subscription（已废弃）](https://github.com/rxliuli/userjs/blob/master/src/YoutubeRSSInoreaderSubscription/README.md): 为 Youtube 订阅者添加 RSS 订阅按钮，点击后弹出 Inoreader 的订阅弹窗
- [动漫花园广告屏蔽（已废弃）](https://github.com/rxliuli/userjs/blob/master/src/dmhy/README.md)

## 库

- [liuli-util](https://github.com/rxliuli/liuli-util): 并非特意实现给 UserJS 使用，但里面基本上全是无依赖的 TS 编译成 JS 的工具库，在脚本中通过 `yarn add @liuli-util/*` 安装使用
