import Engine from "./Engine.js";

class Moon {
	init() {
		const moonMaterial = new BABYLON.StandardMaterial("moonMaterial", Engine.scene);
		moonMaterial.diffuseTexture = new BABYLON.Texture("./textures/lunar_map.png", Engine.scene);

		const moon = BABYLON.MeshBuilder.CreateSphere("moon", {
			diameter: 100,
			segments: 64,
			updatable: true
		}, Engine.scene, true);
		moon.applyDisplacementMap("./textures/lunar_heightmap.png", 0, 4);

		moon.material = moonMaterial;
	}
}

export default Moon;