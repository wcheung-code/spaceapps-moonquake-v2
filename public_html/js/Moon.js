import Engine from "./Engine.js";

class Moon {
	init() {
		const moon = BABYLON.MeshBuilder.CreateSphere("moon", {
			diameter: 100,
			segments: 1024,
			updatable: true
		}, Engine.scene, true);

		moon.applyDisplacementMap("./textures/lunar_heightmap.png", 0, 2);

		const moonMaterial = new BABYLON.StandardMaterial("moonMaterial", Engine.scene);
		const moonTexture = new BABYLON.Texture("./textures/lunar_map.png", Engine.scene);
		moonTexture.wAng = Math.PI;
		moonMaterial.diffuseTexture = moonTexture;
		moonMaterial.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);

		moon.material = moonMaterial;

		// Engine.scene.registerBeforeRender(function () {
		// 	Engine.scene.getMeshByName("moon").rotate(BABYLON.Axis.Y, 0.0005, BABYLON.Space.LOCAL);
		// });
	}
}

export default Moon;