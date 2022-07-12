import * as THREE from "../../three/three.module.js";
import InventoryTemplate from "./template.js";

export default class Cube extends InventoryTemplate{
    scalar = [5,5,5];
    constructor(props) {
        super();
        const { colorHex, mMetalness, mRoughness } = props;

        const mColor = new THREE.Color(colorHex);
        const ghostGeo = new THREE.BoxGeometry(10,10,10);
        const ghostMat = new THREE.MeshBasicMaterial( { 
            color: mColor, 
            opacity: 0.5, 
            transparent: true 
        } );

        this.ghost = new THREE.Mesh(ghostGeo, ghostMat);

        this.objectGeo = new THREE.BoxGeometry(10,10,10);
        this.objectMat = new THREE.MeshLambertMaterial({
            color: mColor,
        } );

        this.setTransparent(10, 10, 10);
        
    }

    getObject() {
        let object = new THREE.Mesh(this.objectGeo, this.objectMat);
        object.castShadow = true;
        object.receiveShadow = true;
        return object;
    }

    getGhost() {
        return this.ghost;
    }

    getScalar() {
        return this.scalar;
    }
}