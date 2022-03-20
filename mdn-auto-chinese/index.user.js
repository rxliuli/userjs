// ==UserScript==
// @name mdn-auto-chinese
// @namespace https://github.com/rxliuli/userjs
// @version 0.2.0
// @description 如果有中文翻译的话就跳转到中文翻译页面
// @author rxliuli
// @match http*://developer.mozilla.org/*
// ==/UserScript==

(() => {
  // src/index.ts
  function parseLocales() {
    return JSON.parse(document.querySelector("#hydration").textContent).doc.other_translations.map((item) => item.locale);
  }
  function goto() {
    const language = new RegExp("https://developer.mozilla.org/(.*?)/").exec(location.href)[1];
    if (language === "zh-CN") {
      return;
    }
    const someZhCN = parseLocales().includes("zh-CN");
    if (someZhCN) {
      location.href = location.href.replace(language, "zh-CN");
    }
  }
  goto();
})();
