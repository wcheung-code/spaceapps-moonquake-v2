class Engine {

	static canvas = document.getElementById("canvas");
	static engine = new BABYLON.Engine(Engine.canvas, true);
	static scene = new BABYLON.Scene(Engine.engine);

	constructor() {}

	static runRenderLoop() {
		// Engine.scene.debugLayer.show();
		Engine.engine.runRenderLoop(function () {
			Engine.scene.render();
		});
	}
}

export default Engine;