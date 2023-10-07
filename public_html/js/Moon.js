import Engine from "./Engine.js";

class Moon {
	init() {
		const moon = BABYLON.MeshBuilder.CreateSphere("moon", {diameter: 100}, Engine.scene);
	}
}

export default Moon;