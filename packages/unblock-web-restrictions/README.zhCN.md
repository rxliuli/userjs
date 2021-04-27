# 解除网页限制
> [GitHub](https://github.com/rxliuli/userjs/blob/master/packages/unblock-web-restrictions/), [GreasyFork](https://greasyfork.org/zh-CN/scripts/391193)

## 简介

> [English](https://github.com/rxliuli/userjs/blob/master/packages/unblock-web-restrictions/README.md), [中文简体](https://github.com/rxliuli/userjs/blob/master/packages/unblock-web-restrictions/README.zhCN.md)

之所以要写这个脚本的原因在于目前已有的 UserJS 脚本添加/禁用域名很不方便，所以便自己写一个，方便吾辈更好的使用。

## 功能

- 强制允许选择/复制/粘贴
- 禁用掉网页复制时的小尾巴
- 允许通过菜单快速启用/禁用（主要改进）
- 动态更新支持域名列表（主要改进）
- 高级匹配模式

## 高级匹配模式

> [本地规则配置页面](https://userjs.rxliuli.com/)

这是一项更加强大的功能，不仅能匹配域名，还能匹配 url、url 前缀、正则表达式。

![image.png](https://i.loli.net/2020/05/17/4Piwq6CbGIfx1HU.png)

## 帮助

如果发现还没有支持的域名，可以点击 _Tampermonkey => 解除网页限制 => 解除限制_ 即可生效，或者，在 [GitHub Issues](https://github.com/rxliuli/userjs/issues) 上提出，以使所有人都能更新该域名为解除限制。

![image.png](https://i.loli.net/2019/10/15/xypJIQnbtN4DuWM.png)

## 常问问题

- 脚本未生效。如果是在 localhost 的网站，脚本的载入时机可能晚于网页脚本，参考: <https://www.tampermonkey.net/documentation.php#_run_at>
- 网页上的快捷键不能用了。是的，由于脚本会覆盖以下快捷键，`c-c/v/x/a`，还有可能包括一些通过 `ctrl + 鼠标` 拖拽相关的快捷键。
- 事实上，目前该脚本将影响范围限制的尽量小，但不保证与网站一定没有任何冲突（参见上一条），所以如果发生了什么问题，请直接在 GitHub Issues 提出。
