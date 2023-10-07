import Engine from "./Engine.js";
class Sun {

	static sun;

	constructor() {}

	init() {

		/*Light properties: name,
		  position,
		  direction,
		  angle of light cone (radians),
		  exponent for light falloff,
		  scene
		*/
		var sunlight = new BABYLON.SpotLight("sunlight", new BABYLON.Vector3(0, 120, 0), new BABYLON.Vector3(0, -1, 0), Math.PI / 2, 1, Engine.scene);
		sunlight.diffuse = new BABYLON.Color3(1, 1, 0.8);
		sunlight.specular = new BABYLON.Color3(1, 1, 1);
	}
}

export default Sun;