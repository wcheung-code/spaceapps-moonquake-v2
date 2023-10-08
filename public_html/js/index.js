import Engine from "./Engine.js";
import Camera from "./Camera.js";
import Environment from "./Environment.js";

//Prevents zooming in/out with mouse wheel or trackpad
//so that the canvas can be zoomed but the browser window can't
window.addEventListener('wheel', e=>{
    e.preventDefault();
}, {passive: false});

new Camera().createCamera();
new Environment().init();

Engine.runRenderLoop();

//A resize event listener for the browser window
window.addEventListener("resize", function () {
    Engine.engine.resize();
});