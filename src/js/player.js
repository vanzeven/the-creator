import * as THREE from "../three/three.module.js";
import { PointerLockControls } from "../three/jsm/controls/PointerLockControls.js";
import Inventory from "./Inventory/inventory.js";

let controls, blocker, instructions, crosshair, btn;

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let moveUp = false;
let moveDown = false;
let isInventoryOpen = false;
let inv;
let locked = false;

let hand;
let inventory;

let velocity = new THREE.Vector3();
let direction = new THREE.Vector3();

// Raycaster
let pointer = new THREE.Vector2();
let raycaster = new THREE.Raycaster();

let speedControl = 20.0;


let boxPanorama;

export default class Player {
    scene = null;

    constructor(camera, document, scene, panorama) {

        moveForward = false;
        moveBackward = false;
        moveLeft = false;
        moveRight = false;
        moveUp = false;
        moveDown = false;
        this.scene = scene;

        boxPanorama = panorama;
        inv = document.getElementById("inv");

        velocity = new THREE.Vector3();
        direction = new THREE.Vector3();

        controls = new PointerLockControls(camera, document.body);
        blocker = document.getElementById("blocker");
        instructions = document.getElementById("instructions");
        crosshair = document.getElementById("crosshair");
        btn = document.querySelector("button");

        crosshair.style.display = 'none';
        inv.style.display = 'none';

        inventory = new Inventory(document, controls);

        instructions.addEventListener('click', function () {
            // if(!isInventoryOpen) {
            //     controls.lock();
            // }
            if(!inventory.isInventoryOpen()) {
                controls.lock();
            }
        });

        controls.addEventListener('lock', function () {
            instructions.style.display = 'none';
            blocker.style.display = 'none';
            crosshair.style.display = '';
            // inv.style.display = 'none';
            // inventory.closeInventory();
            locked = true;
        });

        controls.addEventListener('unlock', function () {
            // if(isInventoryOpen) {
            if(inventory.isInventoryOpen()) {
                instructions.style.display = 'none';
                blocker.style.display = 'block';
                crosshair.style.display = 'none';
                // inv.style.display = '';
                // let x = document.getElementById("item-name");
                // x.innerText = 'None';
                // inventory.openInventory();
            }
            else {
                instructions.style.display = '';
                blocker.style.display = 'block';
                crosshair.style.display = 'none';
                inv.style.display = 'none';
            }
            locked = false;
        });

        this.onKeyDown = function (event) {
            if (!inventory.isInventoryOpen()) {
                if (event.keyCode === 32) // Space
                    moveUp = true;
                else if (event.keyCode === 87) // W
                    moveForward = true;
                else if (event.keyCode === 65) // A
                    moveLeft = true;
                else if (event.keyCode === 83) // S
                    moveBackward = true;
                else if (event.keyCode === 68) // D
                    moveRight = true;
                else if (event.keyCode === 67) // C
                    moveDown = true;

                if (event.keyCode === 33) // increase speed, pageup 
                {
                    speedControl -= 1;
                    if (speedControl < 15) speedControl = 15;
                }
                if (event.keyCode === 34) // decrease speed, pagedown
                {
                    speedControl +=1;
                    if (speedControl > 45) speedControl = 45;
                }

                if (event.keyCode === 70 && locked) { // F
                    isInventoryOpen = true;
                    inventory.openInventory();
                    controls.unlock();
                }
            }
            else {
                if (event.keyCode === 70 && !locked) { // F
                    controls.lock();
                    isInventoryOpen = false;
                    inventory.closeInventory();
                }
            }
        };

        this.onKeyUp = function (event) {
            if (event.keyCode === 32) // Space
                moveUp = false;
            else if (event.keyCode === 87) // W
                moveForward = false;
            else if (event.keyCode === 65) // A
                moveLeft = false;
            else if (event.keyCode === 83) // S
                moveBackward = false;
            else if (event.keyCode === 68) // D
                moveRight = false;
            else if (event.keyCode === 67) // C
                moveDown = false;
        };

        document.addEventListener('keydown', this.onKeyDown);
        document.addEventListener('keyup', this.onKeyUp);
    }

    getObj() {
        return controls.getObject();
    }

    move(delta) {
        if (controls.isLocked === true) {

            velocity.x -= velocity.x * speedControl * delta;
            velocity.z -= velocity.z * speedControl * delta;
            velocity.y -= velocity.y * speedControl * delta;

            direction.z = Number(moveForward) - Number(moveBackward);
            direction.x = Number(moveRight) - Number(moveLeft);
            direction.y = Number(moveUp) - Number(moveDown);
            direction.normalize();

            if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
            if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;
            if (moveUp) velocity.y -= direction.y * 400.0 * delta;
            if (moveDown) velocity.y -= direction.y * 400.0 * delta;

            controls.moveRight(- velocity.x * delta);
            controls.moveForward(- velocity.z * delta);
            controls.getObject().position.y -= (velocity.y * delta);

            boxPanorama.position.set(
                controls.getObject().position.x,
                controls.getObject().position.y,
                // -2,
                controls.getObject().position.z
            );
            console.log(`control position ${controls.getObject().position.x}`)

            if(controls.getObject().position.y <= 1) {
                controls.getObject().position.y = 1;
            }

            if(controls.getObject().position.y >= 240) {
                controls.getObject().position.y = 240;
            }

        }
    }

    getPreview() {
        this.setHand();
        return hand.getGhost();
    }

    getVoxel() {
        if(isInventoryOpen || !locked) return null;
        else return hand.getObject();
    }

    getTransparentObject() {
        return hand.getTransparentBox();
    }

    setHand() {
        hand = inventory.getObject();
    }

    setOK() {
        controls.lock();
        isInventoryOpen = false;
        inventory.closeInventory();
        // inventory.validateDatGui();
    }

    getScalar() {
        return hand.getScalar();
    }

    getTransparentScalar() {
        return hand.getTransparentScalar();
    }
}