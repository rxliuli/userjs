# Unblock web restrictions

> [GitHub](https://github.com/rxliuli/userjs/blob/master/packages/unblock-web-restrictions/), [GreasyFork](https://greasyfork.org/zh-CN/scripts/391193)

## Introduction

> [English](https://github.com/rxliuli/userjs/blob/master/packages/unblock-web-restrictions/README.md), [中文简体](https://github.com/rxliuli/userjs/blob/master/packages/unblock-web-restrictions/README.zhCN.md)

The reason why this script is written is that it is very inconvenient to add / disable the domain name in the existing UserJS script, so write one myself, which is convenient for my generation to use.

## Features

- Force selection / copy / paste
- Disable the small tail when copying web pages
- Allows quick enable / disable through the menu (main improvements)
- Dynamic update support domain name list (main improvements)
- Advanced matching mode

## Advanced Matching Mode

> [Local Rule Configuration Page](https://userjs.rxliuli.com/)

This is a more powerful feature, not only matching domain names, but also matching urls, url prefixes, and regular expressions.

![image.png](https://i.loli.net/2020/05/17/4Piwq6CbGIfx1HU.png)

## Help

If you find a domain name that is not yet supported, you can click _Tampermonkey => Unblock web restrictions => Unlock Restrictions_ to take effect, or, put it on [GitHub Issues](https://github.com/rxliuli/userjs/issues) so that everyone can update the domain name to lift the restriction.

![image.png](https://i.loli.net/2019/10/15/xypJIQnbtN4DuWM.png)

## FAQ

### Script not working

There are many reasons for this issue, some common ones include

- Using transparent images or div masks -- usually solved by removing the corresponding element using user.css/js
- Using custom fonts to replace the displayed text with the actual text -- find the font mapping rules and parse them back

The following need to use OCR technology to solve the problem, which is painful for web developers and users alike

- Custom text typography rules, making it difficult to select text
- Use canvas to draw the text on
- Render text as image on server side, client side only gets image

> [Special Web Solution Description](https://github.com/rxliuli/userjs/blob/master/packages/unblock-web-restrictions/docs/SpecialPages.md)

### Shortcuts on web pages don't work anymore

Yes, because the script overrides the following shortcuts, `c-c/v/x/a`, and possibly some drag-and-drop related shortcuts via `ctrl + mouse`.

### The functionality of the site itself is affected

In fact, the script currently limits the impact to as little as possible, but there is no guarantee that there will be no conflicts with the site (see the previous article), so if something goes wrong, please raise it directly in GitHub Issues.
