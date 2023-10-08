import Markers from "./Markers.js";
import Engine from "./Engine.js";
import Earth from "./Earth.js";
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

		new Sun().init();
		new Earth().init();
		new Moon().init();
		new Markers().init();

		//parent meshes to transform-node
		const meshes = Engine.scene.meshes;
		let root = new BABYLON.TransformNode();
		meshes.forEach(mesh => {
			const meshes = ["earth", "moon"];
			if (meshes.includes(mesh.name)) {
				mesh.parent = root;
			}
		});

		for(let i = 0; i < 6; i++) {
			let marker = Engine.scene.getTransformNodeByName("marker"+i);
			marker.parent = root;
		}

		Engine.scene.registerBeforeRender(function () {
			root.rotate(BABYLON.Axis.Y, 0.0005, BABYLON.Space.LOCAL);
		});
	}
}

export default Environment;