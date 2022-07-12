import * as THREE from '../../three/three.module.js'
import Transparent from '../utils/transparent.js';


export default class InventoryTemplate{
    transparent = null;
    constructor() {}

    setTransparent(w,h,d) {
        this.transparent = new Transparent(w, h, d);
    }

    getTransparentBox() {
        return this.transparent.getBoxHolder();
    }

    getTransparentScalar() {
        return this.transparent.getTransparentScalar();
    }
}