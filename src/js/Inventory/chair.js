import * as THREE from '../../three/three.module.js';
import { GLTFLoader } from '../../three/jsm/loaders/GLTFLoader.js';
import Transparent from '../utils/transparent.js';
import InventoryTemplate from './template.js';

let object = null;

export default class Chair extends InventoryTemplate{
    scalar = [5,0,5];
    loader = new GLTFLoader().setPath('./assets/');
    constructor(name) {
        super();
        this.loader.load(
            name,
            function (gltf) {
                gltf.scene.traverse( function( node ) {
                    if ( node.isMesh ) { node.castShadow = true; }            
                } );
                gltf.scene.scale.set(10,15,10);
                object = gltf;
            }
        );

        this.setTransparent(10, 20, 10);
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