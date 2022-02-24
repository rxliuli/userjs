# twitter-block-qr

> [安装](https://userjs.rxliuli.com/twitter-block-qr/index.user.js)

屏蔽 twitter 上垃圾二维码消息。简单来说，现在中文推圈回复中经常出现发什么比特币二维码的推文，该插件将扫描所有图片，如果包含二维码则自动移除推文。

效果图：

![image.png](https://s2.loli.net/2022/02/25/Cca46pBHdkDsL9v.png)

## FAQ

被屏蔽一次的图像将会被保存到 localStorage 中，可能会导致一些问题，后续再考虑用 indexeddb 优化了。
