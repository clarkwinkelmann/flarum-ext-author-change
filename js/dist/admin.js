module.exports=function(e){var n={};function r(t){if(n[t])return n[t].exports;var a=n[t]={i:t,l:!1,exports:{}};return e[t].call(a.exports,a,a.exports,r),a.l=!0,a.exports}return r.m=e,r.c=n,r.d=function(e,n,t){r.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:t})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,n){if(1&n&&(e=r(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(r.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var a in e)r.d(t,a,function(n){return e[n]}.bind(null,a));return t},r.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(n,"a",n),n},r.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},r.p="",r(r.s=16)}({16:function(e,n,r){"use strict";r.r(n);var t=r(2),a=r.n(t);a.a.initializers.add("clarkwinkelmann-author-change",(function(){a.a.extensionData.for("clarkwinkelmann-author-change").registerPermission({icon:"fas fa-user-edit",label:a.a.translator.trans("clarkwinkelmann-author-change.admin.permissions.edit-user"),permission:"clarkwinkelmann-author-change.edit-user"},"moderate").registerPermission({icon:"far fa-clock",label:a.a.translator.trans("clarkwinkelmann-author-change.admin.permissions.edit-date"),permission:"clarkwinkelmann-author-change.edit-date"},"moderate")}))},2:function(e,n){e.exports=flarum.core.compat["admin/app"]}});
//# sourceMappingURL=admin.js.map