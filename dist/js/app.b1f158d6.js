(function(e){function t(t){for(var n,l,i=t[0],u=t[1],c=t[2],f=0,d=[];f<i.length;f++)l=i[f],o[l]&&d.push(o[l][0]),o[l]=0;for(n in u)Object.prototype.hasOwnProperty.call(u,n)&&(e[n]=u[n]);s&&s(t);while(d.length)d.shift()();return a.push.apply(a,c||[]),r()}function r(){for(var e,t=0;t<a.length;t++){for(var r=a[t],n=!0,i=1;i<r.length;i++){var u=r[i];0!==o[u]&&(n=!1)}n&&(a.splice(t--,1),e=l(l.s=r[0]))}return e}var n={},o={app:0},a=[];function l(t){if(n[t])return n[t].exports;var r=n[t]={i:t,l:!1,exports:{}};return e[t].call(r.exports,r,r.exports,l),r.l=!0,r.exports}l.m=e,l.c=n,l.d=function(e,t,r){l.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},l.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},l.t=function(e,t){if(1&t&&(e=l(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(l.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)l.d(r,n,function(t){return e[t]}.bind(null,n));return r},l.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return l.d(t,"a",t),t},l.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},l.p="/";var i=window["webpackJsonp"]=window["webpackJsonp"]||[],u=i.push.bind(i);i.push=t,i=i.slice();for(var c=0;c<i.length;c++)t(i[c]);var s=u;a.push([0,"chunk-vendors"]),r()})({0:function(e,t,r){e.exports=r("56d7")},"034f":function(e,t,r){"use strict";var n=r("64a9"),o=r.n(n);o.a},"39e9":function(e,t,r){},"56d7":function(e,t,r){"use strict";r.r(t);r("cadf"),r("551c"),r("f751"),r("097d");var n=r("2b0e"),o=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{attrs:{id:"app"}},[r("text-reader")],1)},a=[],l=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"container"},[r("label",{staticClass:"text-reader"},[e._v("\n    Upload Files\n    "),r("input",{attrs:{type:"file",multiple:"multiple"},on:{change:e.loadTextFromFile}})]),e.showTable?r("div",{staticClass:"output"},[e._m(0),r("vue-good-table",{attrs:{columns:e.columns,rows:e.matchedRecords,"max-height":"500px","fixed-header":!0,"line-numbers":!0,"search-options":{enabled:!0}}})],1):e._e()])},i=[function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"header"},[r("p",{staticClass:"main_heading"},[e._v("Final Output Table Formatter")]),r("button",{staticClass:"button right"},[e._v("Download Excel")])])}],u=(r("7f7f"),r("ac6a"),r("28a5"),r("fe82")),c=(r("dac4"),{components:{VueGoodTable:u["a"]},data:function(){return{matchedRecords:[],showTable:!1,columns:[{label:"Product",field:"product",type:"number"},{label:"SKU",field:"SKU",type:"number"},{label:"Error Code",field:"error-code"},{label:"Error Message",field:"error-msg"}]}},methods:{loadTextFromFile:function(e){var t=e.target.files;if(t.length){for(var r=[],n=t.length,o=0;o<n;o++){var a=t[o],l=new FileReader;l.onload=function(e){var t=e.target.result,n=t.split(/\r\n|\n/);n.forEach(function(e,t){if(t>4){var n=e.split("\t");if("8541"===n["2"]||"8542"===n["2"]){var o=n["1"].split("."),a={};a["product"]=o[0],a["SKU"]=o[1],a["error-code"]=n["2"],a["error-msg"]=n["4"],r.push(a)}}})},this.matchedRecords=r,l.onerror=function(e){alert(e.target.error.name)},l.readAsText(a)}null!==this.matchedRecords&&(this.showTable=!0)}}}}),s=c,f=(r("b4fa"),r("2877")),d=Object(f["a"])(s,l,i,!1,null,null,null),p=d.exports,h={name:"app",data:function(){return{text:""}},components:{TextReader:p}},b=h,v=(r("034f"),Object(f["a"])(b,o,a,!1,null,null,null)),m=v.exports;n["a"].config.productionTip=!1,new n["a"]({render:function(e){return e(m)}}).$mount("#app")},"64a9":function(e,t,r){},b4fa:function(e,t,r){"use strict";var n=r("39e9"),o=r.n(n);o.a}});
//# sourceMappingURL=app.b1f158d6.js.map