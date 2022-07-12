import * as THREE from './three/three.module.js';
import { OrbitControls } from './three/jsm/controls/OrbitControls.js';
import applyDynamicWindow from './js/window.js';
import generateGridTiles from './js/generateGridTiles.js';
import Player from './js/player.js';
import checkPlaceRange from './js/utils/checkPlaceRange.js';
import skyBlockPanorama from './js/environment/skyBlockPanorama.js';

// Object
const RAD = 57.2957795;
const objects = [];
let preview = null;
let pointer = new THREE.Vector2();
let raycaster = new THREE.Raycaster();
let rotate = 0;

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xd2d2d2);
scene.fog = new THREE.FogExp2( 0xefd1b5, 0.0025 );

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(70, sizes.width / sizes.height, 0.1, 1000);
camera.position.set(0, 5, 10);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.shadowMap.type = THREE.PCFShadowMap; // default THREE.PCFShadowMap
renderer.shadowMap.enabled = true;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
applyDynamicWindow(sizes, camera, renderer);

// const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );

// directionalLight.position.set( 0, 100, 0 ); //default; light shining from top
// directionalLight.castShadow = true; // default false

// directionalLight.shadowMapWidth = 512;
// directionalLight.shadowMapHeight = 512;

// let shadowLightSize = 100;

// directionalLight.shadowCameraLeft = -shadowLightSize;
// directionalLight.shadowCameraRight = shadowLightSize;
// directionalLight.shadowCameraTop = shadowLightSize;
// directionalLight.shadowCameraBottom = -shadowLightSize;
// directionalLight.shadowCameraVisible = true;

// directionalLight.shadowCameraFar = 1000;
// directionalLight.shadowDarrkness = 0.8;

// directionalLight.target.position.set(0, 0, 0);

// scene.add( directionalLight );
// scene.add( directionalLight.target );

const light = new THREE.PointLight( 0xffffff );
light.castShadow = true; // default false
light.position.set(1000, 1000, 0);
scene.add( light );

const ambientLight = new THREE.AmbientLight(0xfdfdfd); // soft white light
scene.add(ambientLight);

// const hemiLight = new THREE.HemisphereLightProbe(0x0487E, 0xC68767, 1);
// scene.add(hemiLight);

//Set up shadow properties for the light
// light.shadow.mapSize.width = 512 * 500; // default
// light.shadow.mapSize.height = 512 * 500; // default
// light.shadow.camera.near = 0.1; // default
// light.shadow.camera.far = 2000; // default
// light.shadow.focus = 1; // default

// const helper = new THREE.CameraHelper( light.shadow.camera );
// scene.add( helper );




// const orbitControls = new OrbitControls( camera, canvas );
// orbitControls.enableDamping = true;
// orbitControls.update();

window.addPreview = () => {
    console.log("window.addPreview()")
    if (preview != null) {
        scene.remove(preview);
    }
    preview = player.getPreview();
    scene.add(preview);
    player.setOK();
    rotate = 0;
}


const gridHelper = generateGridTiles(scene, 5000, 500);
scene.add(gridHelper);
objects.push(gridHelper);

const boxPanorama = skyBlockPanorama();
scene.add(boxPanorama);


const player = new Player(camera, document, scene, boxPanorama);
scene.add(player.getObj());
objects.push(player.getObj());

const clock = new THREE.Clock();
let prevtime = 0;

const tick = () => {
    let time = performance.now();
    const elapsedTime = clock.getElapsedTime();
    // Render
    renderer.render(scene, camera);
    // orbitControls.update();

    let delta = (time - prevtime) / 1000;
    player.move(delta);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
    prevtime = time;
}


document.addEventListener('pointermove', onPointerMove);
document.addEventListener('click', onClick);


function onPointerMove(event) {
    if (preview != null) {

        pointer.set(0, 0);

        raycaster.setFromCamera(pointer, camera);

        const intersects = raycaster.intersectObjects(objects, true);
        console.log(intersects[0]);

        if (intersects.length > 0) {
            const intersect = intersects[0];

            const isInRange = checkPlaceRange(intersect.point.clone(), camera.position.clone());

            if (isInRange) {
                // preview.material.visible = true;
                preview.position.copy(intersect.point).add(intersect.face.normal);
                preview.position.divideScalar(10).floor().multiplyScalar(10);
                // preview.position.divideScalar(10).floor().multiplyScalar(10).addScalar(player.getScalar());
                
                let temp1 = preview.clone();
                let posX = temp1.position.addScalar(player.getScalar()[0]);
                let temp2 = preview.clone();
                let posY = temp2.position.addScalar(player.getScalar()[1]);
                let temp3 = preview.clone();
                let posZ = temp3.position.addScalar(player.getScalar()[2]);
                preview.position.set(posX.x, posY.y, posZ.z);


                // console.log("temp: " + posX.x + " " + posY.y + " " + posX.z);
                // console.log(preview.position);
            } else {
                // preview.material.visible = false;
            }
        }
    }
}

function onClick(event) {

    pointer.set(0, 0);

    raycaster.setFromCamera(pointer, camera);

    const intersects = raycaster.intersectObjects(objects, true);

    if (intersects.length > 0) {

        const intersect = intersects[0];
        const isInRange = checkPlaceRange(intersect.point.clone(), camera.position.clone());

        if (!isInRange) {
            return;
        }

        if (event.button === 0) {
            const voxel = player.getVoxel();
            if (voxel != null) {
                // voxel.position.copy(intersect.point).add(intersect.face.normal);
                // voxel.position.divideScalar(10).floor().multiplyScalar(10);
                voxel.position.copy(preview.position);
                voxel.castShadow = true;
                voxel.receiveShadow = true;
                console.log(voxel);
                

                const ghostMesh = player.getTransparentObject();
                ghostMesh.position.copy(preview.position);
                ghostMesh.position.copy(intersect.point).add(intersect.face.normal);
                ghostMesh.position.divideScalar(10).floor().multiplyScalar(10);
                let temp1 = ghostMesh.clone();
                let posX = temp1.position.addScalar(player.getTransparentScalar()[0]);
                let temp2 = ghostMesh.clone();
                let posY = temp2.position.addScalar(player.getTransparentScalar()[1]);
                let temp3 = ghostMesh.clone();
                let posZ = temp3.position.addScalar(player.getTransparentScalar()[2]);
                ghostMesh.position.set(posX.x, posY.y, posZ.z);
                ghostMesh.rotateY(90*rotate/RAD);
                
                const group = new THREE.Group();
                group.add(voxel);
                group.add(ghostMesh);
                objects.push(group);
                scene.add(group);
            }
        }
        else if (event.button === 2) {
            if (intersect.object !== gridHelper) {
                console.log(intersect.object);

                // scene.remove(intersect.object);
                intersect.object.parent.clear();

                objects.splice(objects.indexOf(intersect.object), 1);

            }
        }
        else if(event.button === 1) {
            preview.rotateY(90/RAD);
            rotate++;
        }
    }
}


tick();