# mobile 上知乎自动展开答案

> [GitHub](https://github.com/rxliuli/userjs/tree/master/src/ZhihuAutoExpand), [GreasyFork](https://greasyfork.org/zh-CN/scripts/375653)

## 场景

在 mobile 上的浏览器，打开知乎会只能展开看第一条回答，而更多的回答则无法看到（即便它们已经加载了），点击展开会跳转到 app 下载页面，真是不厌其烦。  
所以吾辈创建了这个 user.js 脚本，可以在 mobile 上自动打开所有回答。顺便屏蔽了知乎的推荐以及在 app 中打开的按钮。

## 使用方法

前置条件

- [x] 使用支持 user.js 的浏览器，例如 [Firefox](https://www.mozilla.org/zh-CN/firefox/mobile/), [Via](http://viayoo.com/zh-cn/)
- [x] 了解 user.js 是什么

找到 Firefox 的扩展 [Tampermonkey](https://addons.mozilla.org/zh-CN/firefox/addon/tampermonkey/)，安装这个扩展  
![Firefox 扩展](https://raw.githubusercontent.com/rxliuli/img-bed/master/20181218162418.png)

然后找到 user.js 脚本 [mobile 上知乎自动展开答案](https://greasyfork.org/zh-CN/scripts/375653-mobile-%E4%B8%8A%E7%9F%A5%E4%B9%8E%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E7%AD%94%E6%A1%88)  
![user.js 脚本](https://raw.githubusercontent.com/rxliuli/img-bed/master/20181218162550.png)

安装之后，打开一个知乎问题测试一下应该就可以啦

[从混乱邪恶到守序善良，这样的九宫格评价结构为何有较高的适用性？](https://www.zhihu.com/question/26556282)
