// ==UserScript==
// @name        goflac-download
// @description 简化下载音乐需要重命名的麻烦，基本上和 91flac-download 差不多
// @namespace   http://github.com/rxliuli/userjs
// @require     https://cdn.jsdelivr.net/npm/sweetalert2@11.1.0/dist/sweetalert2.min.js
// @version     0.1.0
// @author      rxliuli
// @match       https://www.goflac.com/*
// @license     MIT
// @grant       GM_xmlhttpRequest
// ==/UserScript==

(function () {
  'use strict';

  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation.

  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.

  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** */function t(e,t,r,n){return new(r||(r=Promise))((function(o,s){function a(e){try{l(n.next(e));}catch(e){s(e);}}function i(e){try{l(n.throw(e));}catch(e){s(e);}}function l(e){var t;e.done?o(e.value):(t=e.value,t instanceof r?t:new r((function(e){e(t);}))).then(a,i);}l((n=n.apply(e,t||[])).next());}))}var r;!function(e){e.Xlsx="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",e.Zip="application/zip",e.Pdf="application/pdf";}(r||(r={}));class n{static dataURItoBlob(e){const t=atob(e.split(",")[1]),r=e.split(",")[0].split(":")[1].split(";")[0],n=new ArrayBuffer(t.length),o=new Uint8Array(n);for(let e=0;e<t.length;e++)o[e]=t.charCodeAt(e);return new Blob([n],{type:r})}static blobToFile(e,t){const r=e;return r.lastModifiedDate=new Date,r.name=t,e}static arrayBufferToBlob(e,t){return new Blob([new Uint8Array(e).buffer],t)}static initLookup(){const e=new Uint8Array(256);for(let t=0;t<n.chars.length;t++)e[n.chars.charCodeAt(t)]=t;return e}static arrayBufferToBase64(e){let t,r=new Uint8Array(e),o=r.length,s="";for(t=0;t<o;t+=3)s+=n.chars[r[t]>>2],s+=n.chars[(3&r[t])<<4|r[t+1]>>4],s+=n.chars[(15&r[t+1])<<2|r[t+2]>>6],s+=n.chars[63&r[t+2]];return o%3==2?s=s.substring(0,s.length-1)+"=":o%3==1&&(s=s.substring(0,s.length-2)+"=="),s}static base64ToArrayBuffer(e){let t=.75*e.length;const r=e.length;let o,s,a,i,l,c=0;"="===e[e.length-1]&&(t--,"="===e[e.length-2]&&t--);const u=new ArrayBuffer(t),h=new Uint8Array(u);for(o=0;o<r;o+=4)s=n.lookup[e.charCodeAt(o)],a=n.lookup[e.charCodeAt(o+1)],i=n.lookup[e.charCodeAt(o+2)],l=n.lookup[e.charCodeAt(o+3)],h[c++]=s<<2|a>>4,h[c++]=(15&a)<<4|i>>2,h[c++]=(3&i)<<6|63&l;return u}static arrayBufferToString(e){return new Promise(((t,r)=>{const n=new Blob([e]),o=new FileReader;o.addEventListener("load",(()=>t(o.result))),o.addEventListener("error",r),o.readAsText(n,"utf-8");}))}static arrayBufferToJson(e){return t(this,void 0,void 0,(function*(){return JSON.parse(yield this.arrayBufferToString(e))}))}}n.chars="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",n.lookup=n.initLookup(),n.ArrayBufferToJson=n.arrayBufferToJson;function l(e,t="unknown"){const r=document.createElement("a");r.download=t,r.style.display="none",r.href=URL.createObjectURL(e),document.body.appendChild(r),r.click(),document.body.removeChild(r);}

  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation.

  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.

  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** */
  function e(t){return new Promise((e=>{if("number"==typeof t)setTimeout(e,t);else if("function"==typeof t){const n=setInterval((()=>{t()&&(clearInterval(n),e());}),100);}else e();}))}var a;!function(t){t.Filter="filter",t.Map="map",t.ForEach="forEach",t.Reduce="reduce",t.FlatMap="flatMap";}(a||(a={}));

  class Loading {
    
    constructor() {
      const root = document.createElement('div');
      root.innerHTML = `<div style="position: fixed; right: 10px; bottom: 10px">
  <section
    class="content"
    style="background-color: grey; color: white; font-size: 20px; padding: 10px"
  />
</div>
`;

      this.container = root.querySelector('*'); 
      document.body.append(this.container);
      this.hide();
    }
    show() {
      this.container.style.display = 'block';
    }
    update(content) {
      this.container.querySelector('.content').textContent = content;
    }
    hide() {
      this.container.style.display = 'none';
    }
  }






  let instance;
  function loading(content) {
    if (!instance) {
      instance = new Loading();
    }
    instance.show();
    instance.update(content);
    return instance
  }

  /**
   * 下载歌曲
   * @param {string} url 链接
   * @param {string} name 歌曲全名，包括后缀
   */
  function downloadMusic(url, name) {
    const instance = loading('正在下载... 0%');
    // eslint-disable-next-line no-undef
    GM_xmlhttpRequest({
      method: 'GET',
      responseType: 'blob',
      url,
      onload(res) {
        // eslint-disable-next-line no-undef
        l(res.response, name);
        instance.hide();
      },
      onprogress(res) {
        if (res.readyState !== 3) {
          return
        }
        const num = Math.floor(((res ).done * 100) / res.total);
        instance.update(`正在下载... ${num}%`);
      },
    } );
  }

  function getMusicName() {
    const titleElement = document.querySelector(
      'main .space-y-2 .inline',
    ); 
    return titleElement.textContent.replaceAll(' ', '')
  }

  function getLink() {
    return (document.querySelector('div.mt-4 a') ).href
  }

  var TypeEnum; (function (TypeEnum) {
    const Flac = 0; TypeEnum[TypeEnum["Flac"] = Flac] = "Flac";
    const HighMp3 = Flac + 1; TypeEnum[TypeEnum["HighMp3"] = HighMp3] = "HighMp3";
    const BasicMp3 = HighMp3 + 1; TypeEnum[TypeEnum["BasicMp3"] = BasicMp3] = "BasicMp3";
    const HighOGG = BasicMp3 + 1; TypeEnum[TypeEnum["HighOGG"] = HighOGG] = "HighOGG";
    const HighAAC = HighOGG + 1; TypeEnum[TypeEnum["HighAAC"] = HighAAC] = "HighAAC";
    const BasicAAC = HighAAC + 1; TypeEnum[TypeEnum["BasicAAC"] = BasicAAC] = "BasicAAC";
  })(TypeEnum || (TypeEnum = {}));

  const textToTypeMap = {
    [TypeEnum.Flac]: ['flac'],
    [TypeEnum.HighMp3]: ['极高', 'mp3'],
    [TypeEnum.BasicMp3]: ['标准', 'mp3'],
    [TypeEnum.HighOGG]: ['较高', 'ogg'],
    [TypeEnum.HighAAC]: ['较高', 'aac'],
    [TypeEnum.BasicAAC]: ['标准', 'aac'],
  };
  const typeToExtMap = {
    [TypeEnum.Flac]: 'flac',
    [TypeEnum.HighMp3]: 'mp3',
    [TypeEnum.BasicMp3]: 'mp3',
    [TypeEnum.HighOGG]: 'ogg',
    [TypeEnum.HighAAC]: 'aac',
    [TypeEnum.BasicAAC]: 'aac',
  };

  function getType(text) {
    text = text.toLocaleLowerCase();
    for (let [k, v] of Object.entries(textToTypeMap)) {
      if (v.every((s) => text.includes(s))) {
        return (k ) 
      }
    }
    return null
  }

  function hideDialog() {
    const dialogStyle = (document.querySelector(
      '.jetstream-modal',
    ) ).style;
    dialogStyle.zIndex = '-100';
    dialogStyle.display = 'none';
    dialogStyle.position = 'fixed';
    dialogStyle.left = '-10000px';
  }

  function insertCSS(href) {
    const linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.href = href;
    document.head.appendChild(linkElement);
  }

  function main() {
    insertCSS(
      'https://cdn.jsdelivr.net/npm/sweetalert2@11.1.0/dist/sweetalert2.css',
    );
    const downloadButtonList = document.getElementsByClassName('-m-2')[1];
    hideDialog();
    downloadButtonList.addEventListener('click', async (evt) => {
      const target = evt.target; 
      const text = target.textContent;
      const type = getType(text);
      const currLink = getLink();
      await e(() => getLink() !== currLink);
      downloadMusic(getLink(), getMusicName() + '.' + typeToExtMap[type]);
      hideDialog();
    });
  }

  window.addEventListener('load', main);

}());
