import Engine from "./Engine.js";

class Earth {
	constructor() {}

	init() {
		const earth = BABYLON.MeshBuilder.CreateSphere("earth", {
			diameter: 400,
			segments: 1024,
			updatable: true
		}, Engine.scene, true);

		earth.position = new BABYLON.Vector3(0, 0, -800);

		earth.applyDisplacementMap("./textures/lunar_heightmap.png", 0, 2);

		const earthMaterial = new BABYLON.StandardMaterial("earthMaterial", Engine.scene);
		const earthTexture = new BABYLON.Texture("./textures/earth_map.png", Engine.scene);
		earthTexture.wAng = Math.PI;
		earthMaterial.diffuseTexture = earthTexture;
		earthMaterial.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);

		earth.material = earthMaterial;

		//earth root node
		// const earthRoot = new BABYLON.TransformNode("earthRoot");
		// earthRoot.position = new BABYLON.Vector3(0, 0, 0);
		// earth.parent = earthRoot;

		//set the earths centerpoint to xyz 0,0,0
		earth.setPivotMatrix(BABYLON.Matrix.Translation(0, 0, 0));

		Engine.scene.registerBeforeRender(function () {
			earth.rotate(BABYLON.Axis.Y, 0.0005, BABYLON.Space.LOCAL);
			// earthRoot.rotate(BABYLON.Axis.Y, 0.0005, BABYLON.Space.LOCAL);
		});
	}
}

export default Earth;