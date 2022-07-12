import * as THREE from '../../three/three.module.js';
import { GLTFLoader } from '../../three/jsm/loaders/GLTFLoader.js';
import Transparent from '../utils/transparent.js';
import InventoryTemplate from './template.js';

let object = null;

export default class Chair2 extends InventoryTemplate{
    scalar = 0;
    loader = new GLTFLoader();
    constructor() {
        super();
        this.loader.load(
            './assets/chair2.glb',
            function (gltf) {
                gltf.scene.castShadow = true;
                gltf.scene.receiveShadow = true;
                gltf.scene.scale.set(40, 40, 40);
                object = gltf;
            }
        );

        this.setTransparent(10, 10, 10);
        // this.transparent = new Transparent(10, 10, 10);
    }

    getObject() {
        return object.scene.clone();
    }

    getGhost() {
        return object.scene;
    }

    getScalar() {
        return this.scalar;
    }

    // getTransparentBox() {
    //     return this.transparent.getBoxHolder();
    // }
}