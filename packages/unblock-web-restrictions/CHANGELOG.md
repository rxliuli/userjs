## CHANGELOG

## 2.4.2

- feat(unblock-web-restrictions): 添加脚本英语名称及说明

## 2.4.1

- feat(unblock-web-restrictions): 将屏蔽列表的域名添加至源域名白名单中

## 2.4.0

- feat(unblock-web-restrictions): 对按键事件 c+c,c+v 也进行拦截处理
- chore(unblock-web-restrictions): 将百度文库添加到默认屏蔽列表

## 2.3.3

- 使用 cdn 下载配置文件对国内用户更加友好

## 2.3.2

- 禁用黑名单网站屏蔽 `mousedown` 事件（阻止了事件冒泡进而阻止了 `select` 事件）

## 2.3.1

- 由于部分网友反馈 google 下拉选择项受到影响，删除屏蔽快捷键 `ctrl+c/ctrl+x/alt/` 的组合快捷键
