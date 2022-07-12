import * as THREE from '../../three/three.module.js';
import { GLTFLoader } from '../../three/jsm/loaders/GLTFLoader.js';
import Transparent from '../utils/transparent.js'
import InventoryTemplate from './template.js';

let object = null;

export default class Desk extends InventoryTemplate{
    scalar = 0;
    loader = new GLTFLoader();
    constructor() {
        super();
        this.loader.load(
            './assets/desk.glb',
            function (gltf) {
                gltf.scene.traverse( function( node ) {
                    if ( node.isMesh ) { node.castShadow = true; }            
                } );
                gltf.scene.scale.set(80,80,100);
                object = gltf;
            }
        );
        this.setTransparent(40, 20, 60);
        // this.transparent = new Transparent(20, 20, 30);
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

}