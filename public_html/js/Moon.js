import Engine from "./Engine.js";
import degreesToRadians from "./Utilities.js";

class Moon {

	#moon;

	constructor() {}

	init() {
		this.#moon = BABYLON.MeshBuilder.CreateSphere("moon", {
			diameter: 100,
			segments: 1024,
			updatable: true
		}, Engine.scene, true);

		this.#moon.applyDisplacementMap("./textures/moon_heightmap.png", 0, 2);

		this.#moon.rotation = new BABYLON.Vector3(0, degreesToRadians(-90), 0);

		const moonMaterial = new BABYLON.StandardMaterial("moonMaterial", Engine.scene);
		const moonTexture = new BABYLON.Texture("./textures/lunar_map.png", Engine.scene);
		moonTexture.wAng = Math.PI;
		moonTexture.vAng = Math.PI;
		moonMaterial.diffuseTexture = moonTexture;
		moonMaterial.specularColor = new BABYLON.Color3(0, 0, 0);

		this.#moon.material = moonMaterial;

	}
}

export default Moon;