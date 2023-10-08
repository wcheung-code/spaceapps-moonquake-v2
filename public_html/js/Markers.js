import Engine from "./Engine.js";
import degreesToRadians from "./Utilities.js";

class Markers {

	#apolloMarkers = [
		{lat: 0.67416, long: 23.47314, mission: "Apollo 11"},
		{lat: -3.0128, long: -23.4219, mission: "Apollo 12"},
		{lat: -3.64589, long: -17.47194, mission: "Apollo 14"},
		{lat: 26.13239, long: 3.63330, mission: "Apollo 15"},
		{lat: -8.9734, long: 15.5011, mission: "Apollo 16"},
		{lat: 20.1911, long: 30.7723, mission: "Apollo 17"}
	];

	#flags;

	constructor() {}

	init() {
		this.#flags = BABYLON.MeshBuilder.CreatePlane("plane", {size: 2}, Engine.scene);
		const flagTexture = new BABYLON.Texture("./textures/flag.png", Engine.scene);
		const flagMaterial = new BABYLON.StandardMaterial("planeMaterial", Engine.scene);
		flagMaterial.emissiveTexture = flagTexture;
		flagMaterial.opacityTexture = flagTexture;
		flagMaterial.backFaceCulling = false;
		flagMaterial.emissiveTexture.hasAlpha = true;
		flagMaterial.useAlphaFromEmissiveTexture = true;
		flagMaterial.disableLighting = true;
		this.#flags.material = flagMaterial;
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

		//Rotates the parent which is in the center of the mooon
		//Flags are then offset from this center point
		parentNode.position = new BABYLON.Vector3.Zero();
		parentNode.rotate(BABYLON.Axis.X, degreesToRadians(marker.lat), BABYLON.Space.LOCAL);
		parentNode.rotate(BABYLON.Axis.Y, degreesToRadians(-marker.long), BABYLON.Space.LOCAL);

		//Clones the flag so that the above code in init() isn't called 6 times
		const flag = this.#flags.clone();

		flag.parent = parentNode;
		//Sets the flag position to -51 unites from the center of the moon
		flag.position = new BABYLON.Vector3(0, 0, -51);
		flag.mission = marker.mission;
	}
}

export default Markers;