import * as THREE from "../../three/three.module.js";
import { GUI } from '../../three/jsm/libs/dat.gui.module.js';
import Cube from "./cube.js";
import Sphere from "./sphere.js";
import Cone from "./cone.js";
import Torus from "./torus.js";
import Bed from "./bed.js";
import Chair from "./chair.js"
import WhitePlasticDoor from "./white_plastic_door.js";
import Desk from "./desk.js";
import Chair2 from "./chair2.js"

import formatRgbToRgbString from "../utils/formatRgbToRgbString.js";

let items;
// let inventory;
let object;
let selected;
let btnConfirm, btnBack;
let inv;
let mainItem, chairItem;
let currentProps;
let h;
let controller;
let mainInventory; 
let chairInventory;
let currentInventory = "";

export default class Inventory {
    isOpen = false;
    inventory = null;

    constructor (document, controls) {
        this.inventory = document.getElementById("inv");
        mainInventory = document.getElementById("inv-main");
        chairInventory = document.getElementById("inv-chair");
        // this.mainInventory.style.display = 'none';
        chairInventory.style.display = 'none';

        currentInventory = "inv-main";

        items = document.querySelectorAll(".item");
        btnConfirm = document.getElementById("button-confirm");
        btnConfirm.style.display = 'none';

        btnBack = document.getElementById("button-back");
        btnBack.style.display = 'none';

        mainItem = document.getElementById("main-item");
        chairItem = document.getElementById("chair-item");

        selected = 'None';

        inv = this;

        controller = {
            red: 0,
            green: 0,
            blue: 0,
            roughness: 0.0,
            metalness: 0.0
        };


        let gui = new GUI();

        h = gui.addFolder("Material Color");

        h.add(controller, 'red', 0, 255, 1).name("Red").onChange(this.changeProps);
        h.add(controller, 'green', 0, 255, 1).name("Green").onChange(this.changeProps);
        h.add(controller, 'blue', 0, 255, 1).name("Blue").onChange(this.changeProps);


        // h = gui.addFolder("Material Behaviour");
        // h.add(controller, 'metalness', 0.0, 1.0, 0.01).name("Metalness").onChange(this.changeProps);
        // h.add(controller, 'roughness', 0.0, 1.0, 0.01).name("Roughness").onChange(this.changeProps);

        currentProps = {
            colorHex: formatRgbToRgbString(controller.red, controller.green, controller.blue), 
            mMetalness: controller.metalness, 
            mRoughness: controller.roughness
        }
        GUI.toggleHide();
        this.setEventListener();    
    }

    setEventListener() {
        items.forEach(item => {
            item.addEventListener('mouseenter', function () {
                mainItem.innerText = item.innerHTML.valueOf();
                chairItem.innerText = item.innerHTML.valueOf();
            });
            item.addEventListener('mouseleave', function () {
                mainItem.innerText = selected;
                chairItem.innerText = selected;
            });
            item.addEventListener('click', function() {
                selected = item.innerHTML.valueOf();
                selectItem();
                if(selected != 'None') {
                    btnConfirm.style.display = '';
                }

                function selectItem() {
                    if(currentInventory === "inv-main") {
                        if(selected === 'Cube') {
                            object = new Cube(currentProps);
                        } else if(selected === 'Sphere') {
                            object = new Sphere(currentProps);
                        } else if(selected === 'Cone'){
                            object = new Cone(currentProps);
                        } else if(selected === 'Torus'){
                            object = new Torus(currentProps);
                        } else if(selected === 'Chair') {
                            // object = new Chair();
                            currentInventory = 'inv-chair';
                            mainInventory.style.display = 'none';
                            chairInventory.style.display = '';
                            btnBack.style.display = 'block';
                        } else if(selected === 'Bed') {
                            object = new Bed();
                        } else if(selected === 'Desk') {
                            object = new Desk();
                        } else if (selected === 'Door') {
                            object = new WhitePlasticDoor();
                        } else if (selected == 'Clear') {
                            object = undefined;
                        }
                    } else if (currentInventory === 'inv-chair') {
                        if (selected === 'Chair 1') {
                            object = new Chair("chair1.gltf");
                            console.log('set obj with chair 1');
                        } else if (selected === 'Chair 2') {
                            object = new Chair("chair2.gltf");
                            console.log('set obj with chair 2');
                        } else if (selected === 'Chair 3') {
                            object = new Chair("chair3.gltf");
                            console.log('set obj with chair 3');
                        }
                    }


                }
            });
        });

        btnBack.addEventListener('click', this.backToMainInventory, false);
    }

    changeProps() {
        currentProps = {
            colorHex: formatRgbToRgbString(controller.red, controller.green, controller.blue), 
            mMetalness: controller.metalness, 
            mRoughness: controller.roughness
        };

        if(selected === 'Cube') {
            object = new Cube(currentProps);
        } else if(selected === 'Sphere') {
            object = new Sphere(currentProps);
        }else if(selected === 'Cone') {
            object = new Cone(currentProps);
        }else if(selected === 'Torus') {
            object = new Torus(currentProps);
        }
        
    }

    backToMainInventory = (e) => {
        currentInventory = 'inv-main';
        mainInventory.style.display = '';
        chairInventory.style.display = 'none';
        btnBack.style.display = 'none';
        selected = 'None';
    }

    controllerToProps = () => {
        return {
            colorHex: currentColor, 
            mMetalness: controller.metallness, 
            mRoughness: controller.roughness
        }
    }

    validateDatGui() {
        GUI.toggleHide();
    }

    getObject() {
        return object;
    }

    isInventoryOpen() {
        return this.isOpen;
    }

    openInventory() {
        this.isOpen = true;
        this.inventory.style.display = '';
        let x;
        if (currentInventory === 'inv-main') {
            x = document.getElementById('main-item');
        } else if (currentInventory === 'inv-chair') {
            x = document.getElementById('chair-item');
        }
        
        x.innerText = 'None';

        this.debug();
        this.validateDatGui();
    }

    closeInventory() {
        this.isOpen = false;
        this.inventory.style.display = 'none';
        this.debug();
        this.validateDatGui();
    }

    debug() {
        console.log(this.isOpen);
    }

}