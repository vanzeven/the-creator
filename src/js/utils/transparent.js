import * as THREE from '../../three/three.module.js';

export default class Transparent {
    object = null;
    scalar = [];
    constructor(width, height, depth) {
        this.box = new THREE.BoxGeometry(width, height, depth);
        this.material = new THREE.MeshBasicMaterial({
            opacity: 0, 
            transparent: true 
        });
        this.object = new THREE.Mesh(this.box, this.material);
        this.scalar.push(Math.ceil(width/2), Math.ceil(height/2), Math.ceil(depth/2));
    }

    getBoxHolder() {
        return this.object.clone();
    }

    getTransparentScalar() {
        return this.scalar;
    }
}