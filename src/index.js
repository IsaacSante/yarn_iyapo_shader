import {
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
    MeshStandardMaterial,
    Mesh,
    Color,
    SphereBufferGeometry,
    BoxBufferGeometry,
    HemisphereLight,
    DirectionalLight,
    DirectionalLightHelper,
    ShaderMaterial,
    Clock,
    Raycaster,
  } from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as Stats from 'stats.js';
import {lerp, params} from './helper.js';
import anime from 'animejs/lib/anime.es.js';
import * as dat from 'dat.gui';
import * as THREE from 'three'; //REMOVE this in production
import fragmentShader from "./shaders/fragment.glsl";
import vertexShader from "./shaders/vertex.glsl";
import * as TWEEN from '@tweenjs/tween.js';

const DEBUG = true; // Set to false in production

if(DEBUG) {
    window.THREE = THREE;
}

let container, scene, camera, renderer, controls, gui, mesh, mouse, intersects, INTERSECTED;
let time, clock, repoData, repoLength, raycaster;
let modal_container, modal_title, modal_desc, modal_name, close;
let stats;

function init() {
    fetch('https://iyapo-repo.glitch.me/mynewdata', {
        mode: 'cors',
        headers: {
          'Access-Control-Allow-Origin':'*'
        }
    }).then(resp => resp.json())
    .then(data => {
        repoData = data ;
        repoLength = repoData.length;
         createGeometries();
    }).catch(e => console.error(e));

    mouse = new THREE.Vector2(), INTERSECTED;
    raycaster = new THREE.Raycaster();
    container = document.querySelector(".container");
    scene = new Scene();
    scene.background = new Color("skyblue");
    clock = new Clock(true);
    time = 0;

    createCamera();
    createLights();
    createRenderer();
    createControls();

    if(DEBUG) {
        window.scene = scene;
        window.camera = camera;
        window.controls = controls;
        stats = Stats.default();
        document.body.appendChild( stats.dom );
    }

    renderer.setAnimationLoop(() => {
        stats.begin();
        update();
        renderer.render(scene, camera);
        stats.end();
    });
}

function createCamera() {
    const aspect = container.clientWidth / container.clientHeight;
    camera = new PerspectiveCamera(35, aspect, 0.1, 1000);
    camera.position.set(100, 50, 200);

}

function createLights() {
    const directionalLight = new DirectionalLight(0xffffff, 5);
    directionalLight.position.set(5, 5, 10);
    const hemisphereLight = new HemisphereLight(0xddeeff, 0x202020, 3);
    scene.add(directionalLight, hemisphereLight);
}

function createRenderer() {
    renderer = new WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.physicallyCorrectLights = true;
    container.appendChild(renderer.domElement);
}

function createGeometries() {
    const geometry = new BoxBufferGeometry(1, 1, 1);
        const material = new ShaderMaterial({
        fragmentShader: fragmentShader,
        vertexShader: vertexShader,
    });
    for ( let i = 0; i < repoLength; i ++ ){
        mesh = new Mesh(geometry, material);
        mesh.position.x = Math.random() * 800 - 200;
        mesh.position.y = Math.random() * 100 - 100;
        mesh.position.z = Math.random() * 10 - 10;
        mesh.name = 'sphere';
        mesh.userData = repoData[i]
        scene.add(mesh);
    }
}

 function animate(){
 requestAnimationFrame(animate);
 let sphere = scene.children.filter(child => child.name == 'sphere');
 for (var i = 1, il = sphere.length; i < il; i++) {
   sphere[i].position.x = 8 * Math.cos(time + i) 
   sphere[i].position.y = 5 * Math.sin(time + i * 0.2)
    sphere[i].position.z = 5 * Math.tan(time + i * 0.3) 
  }
  controls.update();
  renderer.render(scene, camera)
 }

function createControls() {
    controls = new OrbitControls(camera, renderer.domElement);
}

function update() {
    // time = clock.getDelta();
    //time = clock.getElapsedTime();
     time = 0.0002 * Date.now()
}

function onMouseClick(event) {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
   let sphere = scene.children.filter(child => child.name == 'sphere');
   intersects = raycaster.intersectObjects(sphere);
   if (intersects.length > 0){
    if (INTERSECTED != intersects[0].object) {
        INTERSECTED = intersects[0].object;
        console.log(INTERSECTED.userData)
    }else{
        INTERSECTED = null;
    }
   }
}

document.addEventListener("click", onMouseClick, false);

function onWindowResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

window.addEventListener("resize", onWindowResize, false);

init();
animate();
