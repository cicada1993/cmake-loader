(()=>{"use strict";var r,e={119:(r,e,t)=>{var o=t(183);o&&o().then((r=>{console.log("wasm",r)}));const n=new Worker(new URL(t.p+t.u(93),t.b));console.log("cppWorker",n),n.postMessage({type:"greet"})}},t={};function o(r){var n=t[r];if(void 0!==n)return n.exports;var a=t[r]={exports:{}};return e[r](a,a.exports,o),a.exports}o.m=e,r=[],o.O=(e,t,n,a)=>{if(!t){var c=1/0;for(l=0;l<r.length;l++){for(var[t,n,a]=r[l],i=!0,s=0;s<t.length;s++)(!1&a||c>=a)&&Object.keys(o.O).every((r=>o.O[r](t[s])))?t.splice(s--,1):(i=!1,a<c&&(c=a));i&&(r.splice(l--,1),e=n())}return e}a=a||0;for(var l=r.length;l>0&&r[l-1][2]>a;l--)r[l]=r[l-1];r[l]=[t,n,a]},o.u=r=>r+".js",o.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(r){if("object"==typeof window)return window}}(),o.o=(r,e)=>Object.prototype.hasOwnProperty.call(r,e),(()=>{var r;o.g.importScripts&&(r=o.g.location+"");var e=o.g.document;if(!r&&e&&(e.currentScript&&(r=e.currentScript.src),!r)){var t=e.getElementsByTagName("script");t.length&&(r=t[t.length-1].src)}if(!r)throw new Error("Automatic publicPath is not supported in this browser");r=r.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),o.p=r})(),(()=>{o.b=document.baseURI||self.location.href;var r={179:0};o.O.j=e=>0===r[e];var e=(e,t)=>{var n,a,[c,i,s]=t,l=0;for(n in i)o.o(i,n)&&(o.m[n]=i[n]);if(s)var p=s(o);for(e&&e(t);l<c.length;l++)a=c[l],o.o(r,a)&&r[a]&&r[a][0](),r[c[l]]=0;return o.O(p)},t=self.webpackChunkcmake_loader=self.webpackChunkcmake_loader||[];t.forEach(e.bind(null,0)),t.push=e.bind(null,t.push.bind(t))})();var n=o.O(void 0,[183],(()=>o(119)));n=o.O(n)})();