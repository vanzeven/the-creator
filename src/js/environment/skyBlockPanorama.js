import * as THREE from '../../three/three.module.js';

const skyBlockPanorama = (scene) => {
    const materials = [];
    const textureCube = [
        'cloud_middle_right.jpg', 'cloud_left.jpg',
        'cloud_top.jpg', 'cloud_bottom.jpg',
        'cloud_middle_left.jpg', 'cloud_right.jpg', 
    ];
    const loader = new THREE.TextureLoader();


    
    for ( let i = 0; i < 6; i ++ ) {
        console.log(`./assets/texture/${textureCube[i]}`);

        let texture = loader.load(`./assets/texture/${textureCube[i]}`);
        materials.push( new THREE.MeshBasicMaterial( { 
            map: texture,
            side: THREE.DoubleSide
        } ) );

    }

    const boxPanorama = new THREE.BoxGeometry(500, 500, 500);

    const panorama = new THREE.Mesh(boxPanorama, materials);
    panorama.position.set(0,-3, 0);

    return panorama;
}


export default skyBlockPanorama;