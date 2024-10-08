import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const canvas = document.getElementById('bbv-santa-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: false });

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Softer shadows
renderer.setSize(window.innerWidth, window.innerHeight);
scene.background = new THREE.Color( 0xf0f0f0 );

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Point Light
const lightp = new THREE.PointLight(0xffffff, 1.5, 100);
lightp.position.set(-8, 7, 0);
scene.add(lightp);

// Directional Light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(50, 100, 50);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048; // Higher resolution for more detail
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.radius = 4; // Increase to blur the shadow
directionalLight.shadow.bias = -0.0009; // Bias to reduce shadow artifacts
scene.add(directionalLight);
// Ambient Light
const light2 = new THREE.AmbientLight(0x404040, 1); // Increase intensity
scene.add(light2);

// Hemisphere Light
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
hemiLight.position.set(0, 20, 0);
scene.add(hemiLight);

// Spot Light
const spotLight = new THREE.SpotLight(0xffffff, 1.5);
spotLight.position.set(15, 40, 35);
spotLight.angle = Math.PI / 6;
spotLight.penumbra = 0.1;
spotLight.decay = 2;
spotLight.distance = 200;
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
scene.add(spotLight);

const textureLoader = new THREE.TextureLoader();

//Create a PointLight and turn on shadows for the light
const slight = new THREE.PointLight( 0xffffff, 1, 100 );
slight.position.set( 0, 40, 14 );
slight.castShadow = true; // default false
scene.add( slight );
//Set up shadow properties for the light
slight.shadow.mapSize.width = 812; // default
slight.shadow.mapSize.height = 812; // default
slight.shadow.camera.near = 0.5; // default
slight.shadow.camera.far = 500; // default

// Create and configure the DRACOLoader
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.4.3/');

// Create the GLTFLoader and set the DRACOLoader
const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);
let van, part1, part2,part3;
// Load a Draco compressed GLTF model
loader.load('model.glb', function (gltf) {
    van = gltf.scene;
  van.rotation.y = -0.75;
  van.traverse((child) => {
    if (child.isMesh) {
        child.castShadow = true; // Ensure all meshes in the model cast shadows
        child.receiveShadow = true; // Optionally, the model can also receive shadows
    }
  });
  van.castShadow = true; 
  van.receiveShadow = true;
  
  part1 = van.children[141];
  part2 = van.children[142];
  part3 = van.children[143];

  // Center and scale the model
  const box = new THREE.Box3().setFromObject(van);
  const center = box.getCenter(new THREE.Vector3());
  van.position.sub(center);

  scene.add(van);
}, undefined, function (error) {
    console.error('An error happened while loading the model:', error);
});

dracoLoader.dispose();

const geometry = new THREE.PlaneGeometry(450, 450);
geometry.rotateX(-Math.PI / 2);
const material = new THREE.MeshStandardMaterial({ color: 0xF8EFBA });
const plane = new THREE.Mesh(geometry, material);
plane.receiveShadow = true;
plane.position.y = -1.53;
scene.add(plane);


// Camera initial position
camera.position.set(0, 2, 5);

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();

let textureIndex = 0; // Initialize the index variable



// Button event listeners to toggle visibility of parts
document.getElementById('togglePart1').addEventListener('click', () => {
  if (part1) {
    part1.visible = !part1.visible;

    const box = new THREE.Box3().setFromObject(part1);
    const center = box.getCenter(new THREE.Vector3());
    part1.position.sub(center);
    const lookAtTarget = center;// Adjust this if your model's center is different
camera.lookAt(lookAtTarget);
  }
  if (part2) {
    part2.visible = !part2.visible;

  }
  if (part3) {
    part3.visible = !part3.visible;
  
  }
});

document.getElementById('togglePart2').addEventListener('click', () => {

});

document.getElementById('togglePart3').addEventListener('click', () => {

});

// Adjust camera and renderer on window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
