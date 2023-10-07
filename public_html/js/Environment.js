import Engine from "./Engine.js";
import Moon from "./Moon.js";
import Sun from "./Sun.js";

class Environment {
	constructor() {}

	static initStars() {
		const stars = BABYLON.MeshBuilder.CreateSphere("stars", { diameter: 3000 }, Engine.scene);
		const starsMaterial = new BABYLON.StandardMaterial("starsMaterial", Engine.scene);
		const texture = new BABYLON.Texture("./textures/stars.png", Engine.scene);
		starsMaterial.emissiveTexture = texture;
		starsMaterial.backFaceCulling = false;
		//Prevents the sun from affecting the stars
		starsMaterial.disableLighting = true; // Disable lighting
		stars.material = starsMaterial;
	}

	init() {
		Environment.initStars();

		new Moon().init();
		new Sun().init();
	}
}

export default Environment;