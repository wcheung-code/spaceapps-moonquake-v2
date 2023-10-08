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
		//Can't zoom out more than 1495 units
		Camera.camera.upperRadiusLimit = 1495;
		Camera.camera.attachControl(true);

		//Refore render loop, this rotates the camera by 0.0005 radians around the y-axis
		Engine.scene.registerBeforeRender(() => {
			//Every action, has an equal and opposite reaction
			//The camera rotates the exact opposite amount of the root node containing all meshes
			Camera.camera.alpha -= 0.0005;
		});

		document.body.onclick = function() {
			const result = Engine.scene.pick(Engine.scene.pointerX, Engine.scene.pointerY);
			if(result && result.pickedMesh.mission) {
				console.log(result.pickedMesh.mission);
				document.querySelector("#mission-name").innerHTML = "Selected mission: " + result.pickedMesh.mission;
			}
		}
	}
}

export default Camera;