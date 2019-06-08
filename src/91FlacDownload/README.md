# 91Flac 下载时自动设置文件名

> [GitHub](https://github.com/rxliuli/userjs/tree/master/src/91FlacDownload), [GreasyFork](https://greasyfork.org/zh-CN/scripts/385046)

## 简介

目前在 [91Flac](https://91flac.vip/) 下载音乐时得到的总是一串 id 的文件名，天下苦此久矣，所以吾辈写了这个脚本，可以在点击下载时自动设置文件名，让你下载得到的文件可以直接丢到音乐文件夹不用再手动改名啦！

## 安装

1. 安装 [Tampermonkey](http://www.tampermonkey.net/)
2. 从 [Greasy Fork](https://greasyfork.org/zh-CN/scripts/385046) 安装脚本

## 使用

导航到任意一个歌曲的详情页面，例如 [我的名字 - 焦迈奇](https://91flac.vip/song/213816939)，点击下载，右下角会弹出一个提示窗，在上面会显示进度，等待进度到达 100% 则会下载到本地。

> 附：第一次下载时会提醒你是否允许跨域下载，点击 **允许域名** 即可。

## 下一步

- 目前无法调起本地的下载器，例如 FDM/IDM/迅雷，之后有时间可能研究一下。
- 目前下载是单线程的，以后可能在浏览器直接实现分段并发下载以提高速度。
