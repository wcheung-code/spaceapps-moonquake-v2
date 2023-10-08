import Engine from "./Engine.js";

class Moon {

	#moon;

	constructor() {}

	init() {
		this.#moon = BABYLON.MeshBuilder.CreateSphere("moon", {
			diameter: 100,
			segments: 1024,
			updatable: true
		}, Engine.scene, true);

		this.#moon.applyDisplacementMap("./textures/lunar_heightmap.png", 0, 2);

		const moonMaterial = new BABYLON.StandardMaterial("moonMaterial", Engine.scene);
		const moonTexture = new BABYLON.Texture("./textures/lunar_map.png", Engine.scene);
		moonTexture.wAng = Math.PI;
		moonMaterial.diffuseTexture = moonTexture;
		moonMaterial.specularColor = new BABYLON.Color3(0, 0, 0);

		this.#moon.material = moonMaterial;

		const plane = BABYLON.MeshBuilder.CreatePlane("plane", {size: 10}, Engine.scene);
		plane.position = new BABYLON.Vector3(0, 0, -52);
		plane.rotation = new BABYLON.Vector3(0, 0, 0);
		plane.setPivotMatrix(BABYLON.Matrix.Translation(0, 0, 0));
		// plane.rotation.x = -36.6;
		plane.rotation.y = Math.PI/2;
		const flagTexture = new BABYLON.Texture("./textures/flag.png", Engine.scene);
		const planeMaterial = new BABYLON.StandardMaterial("planeMaterial", Engine.scene);
		planeMaterial.emissiveTexture = flagTexture;
		planeMaterial.opacityTexture = flagTexture;
		planeMaterial.backFaceCulling = false;
		planeMaterial.emissiveTexture.hasAlpha = true;
		planeMaterial.useAlphaFromEmissiveTexture = true;
		planeMaterial.disableLighting = true;
		plane.material = planeMaterial;

		// this.#moon.decalMap = decalMap;

		Engine.scene.registerBeforeRender(() => {
			// Engine.scene.getMeshByName("moon").rotate(BABYLON.Axis.Y, 0.0005, BABYLON.Space.LOCAL);
			//rotate the moon around the earth which is at z -800
			// this.#moon.rotateAround(new BABYLON.Vector3(0, 0, -800), BABYLON.Axis.Y, 0.0005, BABYLON.Space.LOCAL);
		});
	}
}

export default Moon;

function degreesToRadians(degrees) {
	return degrees * (Math.PI / 180);
}