/*
Licensed per https://github.com/privacy-tech-lab/gpc-optmeowt/blob/main/LICENSE.md
privacy-tech-lab, https://www.privacytechlab.org/
*/


/*
gpc_dom_cs_injectionjs
================================================================================
gpc_dom_cs_injection.js is the static script injected by a related 
content script (registered from the extension service worker) for full DOM access
*/


/**
 * Sets Global Privacy Control (GPC) JavaScript property on the DOM
 */
function setDomSignal () {
   try {
	   if ('globalPrivacyControl' in Navigator.prototype) {
		   //console.log("Found globalPrivacyControl DOM signal, doing nothing!")
		   return
	   };

	   var GPCVal = true
	   const GPCDomVal = `Object.defineProperty(Navigator.prototype, "globalPrivacyControl", {
		   get: () => ${GPCVal},
		   configurable: true,
		   enumerable: true
	   });
	   document.currentScript.parentElement.removeChild(document.currentScript);
	   `

	   const GPCDomElem = document.createElement('script');
	   GPCDomElem.innerHTML = GPCDomVal;
	   document.documentElement.prepend(GPCDomElem);
	   
	   console.log(`Added GPC JS property to DOM.`);
   } catch(e) {
	   console.error(`Failed to set DOM signal: ${e}`);
   }
}

setDomSignal();
