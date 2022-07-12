import * as THREE from '../../three/three.module.js';
import { GLTFLoader } from '../../three/jsm/loaders/GLTFLoader.js';
import Transparent from '../utils/transparent.js'
import InventoryTemplate from './template.js';

let object = null;

export default class WhitePlasticDoor extends InventoryTemplate{
    scalar = [10,0,5];
    loader = new GLTFLoader();
    constructor() {
        super();
        this.loader.load(
            './assets/white_plastic_door.gltf',
            function (gltf) {
                gltf.scene.traverse( function( node ) {
                    if ( node.isMesh ) { node.castShadow = true; }            
                } );
            
                gltf.scene.scale.set(20,14,10);
                object = gltf;
            }
        );
        this.setTransparent(20, 30, 10);
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