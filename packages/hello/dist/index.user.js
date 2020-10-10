// ==UserScript==
// @name        hello
// @description hello
// @namespace   http://github.com/rxliuli/userjs
// @version     0.1.0
// @author      rxliuli
// @match       *
// @grant       MIT
// ==/UserScript==

(() => {
    function hello(name) {
        console.log('hello: ', name);
    }
    hello('hello');
})();
