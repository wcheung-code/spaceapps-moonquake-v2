import Engine from "./Engine.js";
import Camera from "./Camera.js";
import Sun from "./Sun.js";
import Moon from "./Moon.js";

//Prevents zooming in/out with mouse wheel or trackpad
//so that the canvas can be zoomed but the browser window can't
window.addEventListener('wheel', e=>{
    e.preventDefault();
}, {passive: false});


new Moon().init();

new Camera().createCamera();
new Sun().init();

Engine.runRenderLoop();