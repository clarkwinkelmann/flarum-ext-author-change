module.exports=function(e){var n={};function t(r){if(n[r])return n[r].exports;var a=n[r]={i:r,l:!1,exports:{}};return e[r].call(a.exports,a,a.exports,t),a.l=!0,a.exports}return t.m=e,t.c=n,t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:r})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,n){if(1&n&&(e=t(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(t.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var a in e)t.d(r,a,function(n){return e[n]}.bind(null,a));return r},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="",t(t.s=16)}({0:function(e,n){e.exports=flarum.core.compat.app},14:function(e,n){e.exports=flarum.core.compat["components/PermissionGrid"]},16:function(e,n,t){"use strict";t.r(n);var r=t(0),a=t.n(r),o=t(2),i=t(14),u=t.n(i);a.a.initializers.add("clarkwinkelmann/flarum-ext-author-change",(function(){Object(o.extend)(u.a.prototype,"moderateItems",(function(e){e.add("clarkwinkelmann-author-change",{icon:"fas fa-user-edit",label:a.a.translator.trans("clarkwinkelmann-author-change.admin.permissions.edit-user"),permission:"clarkwinkelmann-author-change.edit-user"}),e.add("clarkwinkelmann-post-date",{icon:"far fa-clock",label:a.a.translator.trans("clarkwinkelmann-author-change.admin.permissions.edit-date"),permission:"clarkwinkelmann-author-change.edit-date"})}))}))},2:function(e,n){e.exports=flarum.core.compat.extend}});
//# sourceMappingURL=admin.js.map