import * as THREE from '../three/three.module.js';
import randomIntInRange from './utils/randomIntInRange.js';

const generateGridTiles = (scene, size, division) => {

    /**
     * Chad Axel
     */

    // let tileSize = size / division;
    // let start = -(size / 2) + (tileSize / 2);
    // let gridTiles = [];
    // const colorList = [
    //     0xFE2712,
    //     0xFABC02,
    //     0xFEFE33,
    //     0x66B032,
    //     0x0391CE,
    //     0x8601AF
    // ];

    // // Add gridhelper for border on each plane
    // const gridHelper = new THREE.GridHelper( size, division );
    // scene.add( gridHelper );


    // let baseX = start - tileSize;
    // let matColor = 0xebcb7c;

    // for (let x = 0; x < division; x++) {
    //     baseX += tileSize;
    //     let baseZ = start - tileSize
    //     for (let z = 0; z < division; z++) {
    //         baseZ += tileSize;
    //         // let matColor = colorList[Math.floor(randomIntInRange(0, 6))];
    //         // console.log(`${matColor}`);

    //         const geo = new THREE.PlaneGeometry(tileSize, tileSize);
    //         const material = new THREE.MeshStandardMaterial({
    //             color: matColor
    //         });
    //         const plane = new THREE.Mesh(geo, material);
    //         plane.position.set(baseX, 0, baseZ);
    //         plane.rotation.set(-(Math.PI / 2), 0, 0);
    //         scene.add(plane);
    //         gridTiles.push(plane);
    //     }
    // }

    // return gridTiles;

    /**
     * Hong
     */

    const gridHelper = new THREE.GridHelper(size, division);
    // gridHelper.position.set(0, -1, 0)
    scene.add(gridHelper);

    const geo = new THREE.PlaneGeometry(size, size);
    geo.rotateX( - Math.PI / 2 );
    // const material = new THREE.MeshBasicMaterial({color: 0xffffff});
    const plane = new THREE.Mesh(
        geo, 
        new THREE.MeshStandardMaterial( { color: 0xffffff, visible: false, opacity: 0 } )
        // material
    );
    // plane.position.set(0, -1, 0);
    plane.receiveShadow = true;
    return plane;
    // const group = new THREE.Group();
    // group.add(plane);
    // group.add(gridHelper);
    // return group;
}


export default generateGridTiles;