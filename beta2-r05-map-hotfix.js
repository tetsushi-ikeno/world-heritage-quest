(()=>{'use strict';
if(document.querySelector('script[data-whq-world-map-runtime]'))return;
const s=document.createElement('script');
s.src='world-map-runtime.js?v=r20260902-01';
s.dataset.whqWorldMapRuntime='1';
document.head.appendChild(s);
})();
