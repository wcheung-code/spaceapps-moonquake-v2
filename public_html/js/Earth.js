import Engine from "./Engine.js";

class Earth {
	constructor() {}

	init() {
		const earth = BABYLON.MeshBuilder.CreateSphere("earth", {
			diameter: 400,
			segments: 1024,
			updatable: true
		}, Engine.scene, true);

		earth.applyDisplacementMap("./textures/lunar_heightmap.png", 0, 2);

		const earthMaterial = new BABYLON.StandardMaterial("earthMaterial", Engine.scene);
		//https://planetpixelemporium.com/images/mappreviews/earthmapthumb.jpg
		const earthTexture = new BABYLON.Texture("./textures/earth_map.png", Engine.scene);
		earthTexture.wAng = Math.PI;
		earthMaterial.diffuseTexture = earthTexture;
		earthMaterial.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);

		earth.material = earthMaterial;
		earth.position = new BABYLON.Vector3(0, 0, -800);

		//Earth clouds
		const clouds = BABYLON.MeshBuilder.CreateSphere("clouds", {
			diameter: 402,
			segments: 1024,
			updatable: true
		}, Engine.scene, true);

		clouds.backFaceCulling = true;

		const cloudsMaterial = new BABYLON.StandardMaterial("cloudsMaterial", Engine.scene);
		//https://www.pngkey.com/png/full/200-2001465_earth-clouds-2048-earth-clouds-texture-png.png
		const cloudsTexture = new BABYLON.Texture("./textures/clouds.png", Engine.scene);
		cloudsTexture.wAng = Math.PI;
		cloudsMaterial.opacityTexture = cloudsTexture;
		cloudsMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
		cloudsMaterial.hasAlpha = true;
		cloudsMaterial.transparencyMode = BABYLON.Material.MATERIAL_ALPHATEST;

		clouds.material = cloudsMaterial;
		clouds.position = new BABYLON.Vector3(0, 0, -800);

		const clouds2 = clouds.clone();
		clouds2.name = "clouds2";
		clouds2.position = new BABYLON.Vector3(0, 0, -800);
		clouds2.scaling = new BABYLON.Vector3(1.05, 1.05, 1.05);

		Engine.scene.registerBeforeRender(function () {
			earth.rotate(BABYLON.Axis.Y, 0.0005, BABYLON.Space.LOCAL);
			clouds.rotate(BABYLON.Axis.Y, 0.001, BABYLON.Space.LOCAL);
			clouds.rotate(BABYLON.Axis.X, -0.002, BABYLON.Space.LOCAL);
			clouds2.rotate(BABYLON.Axis.Y, -0.001, BABYLON.Space.LOCAL);
		});
	}
}

export default Earth;