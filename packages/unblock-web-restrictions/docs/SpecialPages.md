# 特殊网页

该文档记录了一些特殊的网页，包括需特殊支持以及不支持的网页。

推荐与 `uBlock Origin` 一起使用，并订阅 `uBlock filters – Annoyances` 过滤规则，配合该脚本达到更好的解除屏蔽效果。

## 需特殊支持的网页

### votetw.com（台灣選舉維基百科）

该网页使用透明遮罩层，详见 [#27](https://github.com/rxliuli/userjs/issues/27)

解决方案

- 添加自定义过滤规则（已包含于 `uBlock filters – Annoyances` 过滤规则中）

```ubo
votetw.com##div[style="width: 100%; height: 100%; top: 0;left: 0; position:fixed; z-index: 255;"]
```

- 使用 user.css 删除该遮罩 [点此安装](https://github.com/rxliuli/userjs/blob/master/packages/usercss/%E5%88%A0%E9%99%A4%E5%8F%B0%E7%81%A3%E9%81%B8%E8%88%89%E7%B6%AD%E5%9F%BA%E7%99%BE%E7%A7%91%E7%9A%84%E9%80%8F%E6%98%8E%E9%81%AE%E7%BD%A9.user.css)

```css
/* ==UserStyle==
@name           votetw.com 删除遮罩层
@namespace      github.com/openstyles/stylus
@version        1.0.0
@description    A new userstyle
@author         rxliuli
==/UserStyle== */
@-moz-document domain("votetw.com") {
  div[style*='width: 100%; height: 100%; top: 0;left: 0; position:fixed; z-index: 255;'] {
    display: none;
  }
}
```

### myhtebooks.com（海棠文化）

该网页使用透明图片进行遮罩，详见[该链接](https://greasyfork.org/zh-CN/scripts/391193-%E8%A7%A3%E9%99%A4%E7%BD%91%E9%A1%B5%E9%99%90%E5%88%B6/discussions/89917#comment-214785)

解决方案

- 添加自定义过滤规则（已包含于 `uBlock filters – Annoyances` 过滤规则中）

```ubo
myhtebooks.com##+js(ra, oncontextmenu|ondragstart|onselectstart|onselect|oncopy|onbeforecopy|onkeydown|onunload)
myhtebooks.com##*:style(-webkit-touch-callout: default !important; -webkit-user-select: text !important; -moz-user-select: text !important; -ms-user-select: text !important; user-select: text !important;)
```

- 使用 user.css 来删除文字的透明遮罩图片 [点此安装](https://github.com/rxliuli/userjs/blob/master/packages/usercss/%E6%B5%B7%E6%A3%A0%E6%96%87%E5%8C%96%E5%88%A0%E9%99%A4%E6%96%87%E5%AD%97%E7%9A%84%E9%81%AE%E7%BD%A9%E5%9B%BE%E7%89%87.user.css)

```css
/* ==UserStyle==
@name           海棠文化删除文字的遮罩图片
@namespace      github.com/rxliuli/userjs
@version        0.1.0
@description    这个网站会在禁止复制的文字上面覆盖一个透明的图片，这个脚本可以删除掉它
@author         rxliuli
==/UserStyle== */
@-moz-document domain("www.myhtebooks.com") {
  .fullimg[src='/images/fullcolor.png'] {
    display: none;
  }
}
```

### boke112.com（boke112 联盟）

该网页修改了选中文本的颜色，详见 [#19](https://github.com/rxliuli/userjs/issues/19)

解决方案

- 添加自定义过滤规则（已包含于 `uBlock filters – Annoyances` 过滤规则中）

```ubo
boke112.com##+js(aopw, stopPrntScr)
||boke.yigujin.cn/wp-content/themes/Three/js/content112.js$script,domain=boke112.com
boke112.com##*::selection:style(background-color:#338FFF!important)
```

- 使用 user style 恢复文本高亮的颜色 [点此安装](https://github.com/rxliuli/userjs/blob/master/packages/usercss/boke112%20%E9%80%89%E4%B8%AD%E6%96%87%E6%9C%AC%E9%A2%9C%E8%89%B2%E6%81%A2%E5%A4%8D%E9%AB%98%E4%BA%AE.user.css)

```css
/* ==UserStyle==
@name           boke112 选中文本颜色恢复高亮
@namespace      github.com/openstyles/stylus
@version        1.0.0
@description    A new userstyle
@author         Me
==/UserStyle== */

@-moz-document domain("boke112.com") {
  /* 在此插入代码... */
  :not(input):not(textarea)::selection {
    color: white !important;
    background-color: #05d3f9 !important;
  }
}
```

## 不支持的网页

### chuangshi.qq.com（创世中文网）

网站使用了自定义的字体，所以复制出来在其他字体下会出现乱码，详见 [#23](https://github.com/rxliuli/userjs/issues/23)

### doc88.com（道客巴巴）

使用的 canvas 画布，所见文字并不是文字，本质上都是由这个网站的开发者自行“画”上去的，详见 [#25](https://github.com/rxliuli/userjs/issues/25)
