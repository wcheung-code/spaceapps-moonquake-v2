import Engine from "./Engine.js";

class Camera {

	static camera;

	constructor() {}

	createCamera() {
		/*Camera properties: name,
		  initial horizontal angle,
		  initial vertical angle,
		  distance from target point,
		  target point,
		  scene
		*/
		Camera.camera = new BABYLON.ArcRotateCamera("camera", -Math.PI/2,  Math.PI/2, 105, new BABYLON.Vector3(0, 0, 0), Engine.scene);

		//Can't zoom in less than 70 units
		Camera.camera.lowerRadiusLimit = 70;
		Camera.camera.attachControl(true);

		//before render loop, rotate camera by 0.005 radians around the y-axis
		Engine.scene.registerBeforeRender(function () {
			//Every action, has an equal and opposite reaction
			//The camera rotates the exact opposite amount of the root node containing all meshes
			Camera.camera.alpha -= 0.0005;
		});
	}
}

export default Camera;