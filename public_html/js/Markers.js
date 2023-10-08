import Engine from "./Engine.js";
import degreesToRadians from "./Utilities.js";

class Markers {

	#apolloMarkers = [
		[0.67416, 23.47314],
		[-3.0128, -23.4219],
		[-3.64589, -17.47194],
		[26.13239, 3.63330],
		[-8.9734, 15.5011],
		[20.1911, 30.7723]
	];

	#flags;

	constructor() {}

	init() {
		this.#flags = BABYLON.MeshBuilder.CreatePlane("plane", {size: 2}, Engine.scene);
		const flagTexture = new BABYLON.Texture("./textures/flag.png", Engine.scene);
		const planeMaterial = new BABYLON.StandardMaterial("planeMaterial", Engine.scene);
		planeMaterial.emissiveTexture = flagTexture;
		planeMaterial.opacityTexture = flagTexture;
		planeMaterial.backFaceCulling = false;
		planeMaterial.emissiveTexture.hasAlpha = true;
		planeMaterial.useAlphaFromEmissiveTexture = true;
		planeMaterial.disableLighting = true;
		this.#flags.material = planeMaterial;
		this.#flags.rotation = new BABYLON.Vector3(0, 0, 0);

		this.#initApolloMarkers();
	}

	#initApolloMarkers() {
		this.#apolloMarkers.forEach((marker, index) => {
			this.#marker(marker, index);
		});
	}

	#marker(marker, index) {
		const parentNode = new BABYLON.TransformNode("marker"+index, Engine.scene);

		parentNode.position = new BABYLON.Vector3.Zero();
		parentNode.rotate(BABYLON.Axis.X, degreesToRadians(marker[0]), BABYLON.Space.LOCAL);
		parentNode.rotate(BABYLON.Axis.Y, degreesToRadians(-marker[1]), BABYLON.Space.LOCAL);

		const flag = this.#flags.clone();

		flag.parent = parentNode;
		flag.position = new BABYLON.Vector3(0, 0, -52);
	}
}

export default Markers;