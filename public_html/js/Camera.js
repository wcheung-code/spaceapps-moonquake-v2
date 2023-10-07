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
		Camera.camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2,  Math.PI / 4, 105, new BABYLON.Vector3(0, 0, 0), Engine.scene);

		//Can't zoom in less than 105 units
		Camera.camera.lowerRadiusLimit = 70;
		Camera.camera.attachControl(true);
	}
}

export default Camera;