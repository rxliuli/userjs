# Remove web restrictions

> [GitHub](https://github.com/rxliuli/userjs/blob/master/packages/unblock-web-restrictions/), [GreasyFork](https://greasyfork.org/zh-CN/scripts/391193)

## Introduction

> [English](https://github.com/rxliuli/userjs/blob/master/packages/unblock-web-restrictions/README.md), [中文简体](https://github.com/rxliuli/userjs/blob/master/packages/unblock-web-restrictions/README.zhCN.md)

The reason why this script is written is that it is very inconvenient to add / disable the domain name in the existing UserJS script, so write one yourself, which is convenient for my generation to use.

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

If you find a domain name that is not yet supported, you can click _Tampermonkey => Remove Webpage Restrictions => Remove Restrictions_ to take effect, or, put it on [GitHub Issues](https://github.com/rxliuli/userjs/issues) , So that everyone can update the domain name to lift the restriction.

![image.png](https://i.loli.net/2019/10/15/xypJIQnbtN4DuWM.png)

## FAQ

- The script does not take effect. If it is a website on localhost, the loading time of the script may be later than the webpage script. Refer to: <https://www.tampermonkey.net/documentation.php#_run_at>
- The shortcut keys on the webpage are no longer available. Yes, since the script will cover the following shortcut keys, `c-c/v/x/a`, it may also include some shortcut keys related to drag and drop via `ctrl + mouse`.
- In fact, at present, the script will limit the scope of the impact as small as possible, but there is no guarantee that there will be no conflict with the website (see the previous article), so if any problems occur, please directly raise them on GitHub issues.
