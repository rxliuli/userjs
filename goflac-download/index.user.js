// ==UserScript==
// @name        goflac-download
// @description 简化下载音乐需要重命名的麻烦，基本上和 91flac-download 差不多
// @namespace   http://github.com/rxliuli/userjs
// @version     0.1.1
// @author      rxliuli
// @match       https://www.goflac.com/*
// @license     MIT
// @grant       GM_xmlhttpRequest
// ==/UserScript==
(function () {
  'use strict';

  var y=(l,e,t)=>new Promise((n,o)=>{var r=i=>{try{p(t.next(i));}catch(c){o(c);}},a=i=>{try{p(t.throw(i));}catch(c){o(c);}},p=i=>i.done?n(i.value):Promise.resolve(i.value).then(r,a);p((t=t.apply(l,e)).next());});var g;(function(n){n.Xlsx="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",n.Zip="application/zip",n.Pdf="application/pdf";})(g||(g={}));var s=class{static dataURItoBlob(e){let t=atob(e.split(",")[1]),n=e.split(",")[0].split(":")[1].split(";")[0],o=new ArrayBuffer(t.length),r=new Uint8Array(o);for(let a=0;a<t.length;a++)r[a]=t.charCodeAt(a);return new Blob([o],{type:n})}static blobToFile(e,t){let n=e;return n.lastModifiedDate=new Date,n.name=t,e}static arrayBufferToBlob(e,t){return new Blob([new Uint8Array(e).buffer],t)}static initLookup(){let e=new Uint8Array(256);for(let t=0;t<s.chars.length;t++)e[s.chars.charCodeAt(t)]=t;return e}static arrayBufferToBase64(e){let t=new Uint8Array(e),n,o=t.length,r="";for(n=0;n<o;n+=3)r+=s.chars[t[n]>>2],r+=s.chars[(t[n]&3)<<4|t[n+1]>>4],r+=s.chars[(t[n+1]&15)<<2|t[n+2]>>6],r+=s.chars[t[n+2]&63];return o%3==2?r=r.substring(0,r.length-1)+"=":o%3==1&&(r=r.substring(0,r.length-2)+"=="),r}static base64ToArrayBuffer(e){let t=e.length*.75,n=e.length,o,r=0,a,p,i,c;e[e.length-1]==="="&&(t--,e[e.length-2]==="="&&t--);let m=new ArrayBuffer(t),f=new Uint8Array(m);for(o=0;o<n;o+=4)a=s.lookup[e.charCodeAt(o)],p=s.lookup[e.charCodeAt(o+1)],i=s.lookup[e.charCodeAt(o+2)],c=s.lookup[e.charCodeAt(o+3)],f[r++]=a<<2|p>>4,f[r++]=(p&15)<<4|i>>2,f[r++]=(i&3)<<6|c&63;return m}static arrayBufferToString(e){return new Promise((t,n)=>{let o=new Blob([e]),r=new FileReader;r.addEventListener("load",()=>t(r.result)),r.addEventListener("error",n),r.readAsText(o,"utf-8");})}static arrayBufferToJson(e){return y(this,null,function*(){return JSON.parse(yield this.arrayBufferToString(e))})}},v=s;v.chars="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",v.lookup=s.initLookup(),v.ArrayBufferToJson=s.arrayBufferToJson;function K(l,e="unknown"){let t=document.createElement("a");t.download=e,t.style.display="none",t.href=URL.createObjectURL(l),document.body.appendChild(t),t.click(),document.body.removeChild(t);}

  function c(n){return new Promise(e=>{if(typeof n=="number")setTimeout(e,n);else if(typeof n=="function"){let t=setInterval(()=>{n()&&(clearInterval(t),e());},100);}else e();})}var u;(function(s){s.Filter="filter",s.Map="map",s.ForEach="forEach",s.Reduce="reduce",s.FlatMap="flatMap";})(u||(u={}));

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
        K(res.response, name);
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
    const titleElement = document.querySelector('h1'); 
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
        return k 
      }
    }
    return null
  }

  function hideDialog() {
    const dialogStyle = (
      document.querySelector('.jetstream-modal') 
    ).style;
    dialogStyle.zIndex = '-100';
    dialogStyle.display = 'none';
    dialogStyle.position = 'fixed';
    dialogStyle.left = '-10000px';
  }

  function main() {
    const downloadButtonList = document.getElementsByClassName('-m-2')[1];
    hideDialog();
    downloadButtonList.addEventListener('click', async (evt) => {
      const target = evt.target; 
      const text = target.textContent;
      const type = getType(text);
      const currLink = getLink();
      await c(() => getLink() !== currLink);
      downloadMusic(getLink(), getMusicName() + '.' + typeToExtMap[type]);
      hideDialog();
    });
  }

  window.addEventListener('load', main);

})();
