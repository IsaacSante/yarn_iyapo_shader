import {
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
    MeshStandardMaterial,
    Mesh,
    Color,
    SphereBufferGeometry,
    BoxBufferGeometry,
    DodecahedronBufferGeometry,
    TorusBufferGeometry,
    ConeBufferGeometry,
    HemisphereLight,
    DirectionalLight,
    DirectionalLightHelper,
    ShaderMaterial,
    Clock,
    Raycaster,
    Vector3,
  } from "three";

// import {spCode} from './spCode.js';
// import {sculptToThreeJSMesh} from 'shader-park-core'
// import {Sculpture} from './Sculpture.js';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as Stats from 'stats.js';
import {lerp, params} from './helper.js';
import anime from 'animejs/lib/anime.es.js';
import * as dat from 'dat.gui';
import * as THREE from 'three'; //REMOVE this in production
import fragmentShader from "./shaders/fragment.glsl";
import vertexShader from "./shaders/vertex.glsl";

const DEBUG = true; // Set to false in production

if(DEBUG) {
    window.THREE = THREE;
}

let container, scene, camera, renderer, controls, gui, mesh, mouse, intersects, INTERSECTED;
let time, clock, repoData, repoLength, raycaster;
let stats;

let sculpture;

function init() {
    mouse = new THREE.Vector2();
    raycaster = new THREE.Raycaster();
    container = document.querySelector(".container");
    scene = new Scene();
    scene.background = new Color("skyblue");
    clock = new Clock(true);
    time = 0;
    createRenderer();
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

    createCamera();
    createLights();
    createControls();
    filterObjects();

    if(DEBUG) {
        window.scene = scene;
        window.camera = camera;
        window.controls = controls;
        stats = Stats.default();
        document.body.appendChild( stats.dom );
    }

    // sculpture = new Sculpture(spCode);
    // scene.add(sculpture.mesh);

    renderer.setAnimationLoop(() => {
        stats.begin();
        animate();
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
    const geometry = new BoxBufferGeometry(3, 3, 3);
    const geometry2 = new SphereBufferGeometry(3, 3, 3);
    const geometry3 = new DodecahedronBufferGeometry(3, 3, 3);
    const geometry4 = new ConeBufferGeometry(5, 4, 3);
    const geometry5 = new TorusBufferGeometry( 3, 1, 16, 100 );
    // const material = new ShaderMaterial({
    //     opacity: 0,
    //     transparent: true,
    //     fragmentShader: fragmentShader,
    //     vertexShader: vertexShader,
    // });

    const material = new THREE.MeshLambertMaterial({
        color: 0xff0000,
        opacity: 1,
        transparent: true,
      });
      const material2 = new THREE.MeshLambertMaterial({
        color: 0xFFFF00,
        opacity: 1,
        transparent: true,
      });
      const material3 = new THREE.MeshLambertMaterial({
        color: 0x0000FF,
        opacity: 1,
        transparent: true,
      });
      const material4 = new THREE.MeshLambertMaterial({
        color: 0x00FF00,
        opacity: 1,
        transparent: true,
      });
      const material5 = new THREE.MeshLambertMaterial({
        color: 0x6D8C2D,
        opacity: 1,
        transparent: true,
      });

    let Apocalyptic = repoData.filter(child => child.Narrative == "Apocalyptic");
    let Utopian = repoData.filter(child => child.Narrative == "Utopian");
    let Dystopian = repoData.filter(child => child.Narrative == "Dystopian");
    let Revolutionary = repoData.filter(child => child.Narrative == "Revolutionary");
    let NoDomain = repoData.filter(child => child.Narrative == "-na-");

    // sculpture = new Sculpture('sphere(0.2);');

    // let sculpMesh = sculptToThreeJSMesh('sphere(0.5);');
    // // console.log(mesh);
    // let uniformDescriptions = sculpMesh.material.uniformDescriptions;
    // let matUniforms = sculpMesh.material.uniforms;

    // let defaultUniforms = { 'sculptureCenter': 0, 'opacity': 0, 'time': 0, 'stepSize': 0, 'mouse': 0};
    // let customUniforms = uniformDescriptions.filter(uniform => !(uniform.name in defaultUniforms));
    
    // //set the default value of the uniforms
    // customUniforms.forEach(uniform => matUniforms[uniform.name].value = uniform.value);

    // // default uniforms for the scupture
    // matUniforms['sculptureCenter'].value = new Vector3();
    // matUniforms['mouse'].value = new Vector3();
    // matUniforms['opacity'].value = 1.0;
    // matUniforms['time'].value = 0.0;
    // matUniforms['stepSize'].value = 0.85;
    
    // // console.log(sculpture);
    // scene.add(sculpture.mesh);

    for ( let i = 0; i < Apocalyptic.length; i ++ ){
        mesh = new Mesh(geometry, material4);
        mesh.position.x = Math.random() * 50 - 50;
        mesh.position.y = Math.random() * 10 - 10;
        mesh.position.z = Math.random() * 6 - 1;
        mesh.rotation.x = Math.random() * 2 * Math.PI;
        mesh.rotation.y = Math.random() * 2 * Math.PI;
        mesh.rotation.z = Math.random() * 2 * Math.PI;
        mesh.userData = Apocalyptic[i]
         mesh.name = 'ApoGeo';
         scene.add(mesh);
    }

    for ( let i = 0; i < Utopian.length; i ++ ){
        mesh = new Mesh(geometry2, material3);
        mesh.position.x = Math.random() * 50 - 50;
        mesh.position.y = Math.random() * 10 - 10;
        mesh.position.z = Math.random() * 6 - 1;
        mesh.rotation.x = Math.random() * 2 * Math.PI;
        mesh.rotation.y = Math.random() * 2 * Math.PI;
        mesh.rotation.z = Math.random() * 2 * Math.PI;
        mesh.userData = Utopian[i]
         mesh.name = 'UtoGeo';
         scene.add(mesh);
    }

    for ( let i = 0; i < Dystopian.length; i ++ ){
        mesh = new Mesh(geometry3, material2);
        mesh.position.x = Math.random() * 50 - 50;
        mesh.position.y = Math.random() * 10 - 10;
        mesh.position.z = Math.random() * 6 - 1;
        mesh.rotation.x = Math.random() * 2 * Math.PI;
        mesh.rotation.y = Math.random() * 2 * Math.PI;
        mesh.rotation.z = Math.random() * 2 * Math.PI;
        mesh.userData = Dystopian[i]
         mesh.name = 'DystoGeo';
         scene.add(mesh);
    }

    for ( let i = 0; i < Revolutionary.length; i ++ ){
        mesh = new Mesh(geometry5, material5);
        mesh.position.x = Math.random() * 50 - 50;
        mesh.position.y = Math.random() * 10 - 10;
        mesh.position.z = Math.random() * 6 - 1;
        mesh.rotation.x = Math.random() * 2 * Math.PI;
        mesh.rotation.y = Math.random() * 2 * Math.PI;
        mesh.rotation.z = Math.random() * 2 * Math.PI;
        mesh.userData = Revolutionary[i]
         mesh.name = 'RevolutionGeo';
         scene.add(mesh);
    }

    for ( let i = 0; i < NoDomain.length; i ++ ){
        mesh = new Mesh(geometry4, material);
        mesh.position.x = Math.random() * 100 - 50;
        mesh.position.y = Math.random() * 10 - 10;
        mesh.position.z = Math.random() * 10 - 1;
        mesh.rotation.x = Math.random() * 2 * Math.PI;
        mesh.rotation.y = Math.random() * 2 * Math.PI;
        mesh.rotation.z = Math.random() * 2 * Math.PI;
        mesh.userData = NoDomain[i]
        mesh.name = 'NoDomainGeo';
        scene.add(mesh);
    }
}

function BoxDefaultMovement(){
    let sphere = scene.children.filter(child => child.type == "Mesh");
    for (var i = 0, il = sphere.length; i < il; i++) {
      sphere[i].position.x = 60 * Math.tan(time + i); 
      sphere[i].position.y = 30 * Math.cos(time + i * 1.1);
      sphere[i].position.z = 20 * Math.cos(time + i * 1); 
     }
}

//  function BoxIntersctedMovement(){
//     INTERSECTED.position.x = 0;
//     INTERSECTED.position.y = 0;
//     INTERSECTED.position.z = 0;
//     console.log(INTERSECTED[0].position.z)
//  }


function animate(){
    // requestAnimationFrame(animate);
    BoxDefaultMovement();
    time = 0.0002 * Date.now();

//       sculpture.setPosition(new THREE.Vector3(1, 0, 1));
//   sculpture.setPosition(0, 0, 0);
  

    // if(sculpture) {
    //     sculpture.update({time, mouse}, (customUniforms, sculpUniforms) => {
    //          sculpUniforms['red'].value = Math.abs(Math.sin(time));
    //     });
    // }
    
    let sphere = scene.children.filter(child => child.type == 'Mesh');
    intersects = raycaster.intersectObjects(sphere);
    if (intersects.length > 0){
    // // BoxIntersctedMovement()
    } else {

    }
    controls.update();
    renderer.render(scene, camera)
}

function createControls() {
    controls = new OrbitControls(camera, renderer.domElement);
}

function onMouseClick(event) {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    let sphere = scene.children.filter(child => child.type == "Mesh");
   intersects = raycaster.intersectObjects(sphere);
   if (intersects.length > 0){
    if (INTERSECTED != intersects[0].object) {
        INTERSECTED = intersects[0].object;
        DisplayInfo();
    }else{
        INTERSECTED = null;
    }
   }
}

function DisplayInfo(){
    let modal = document.getElementById("newcont")
    modal.classList.add("show");
    let modal_name = document.getElementById("name");
    let modal_title = document.getElementById("title");
    let modal_desc = document.getElementById("desc");
    let modal_img = document.getElementById("modal-img");   
    let modal_narrative = document.getElementById("narrative");
    modal_title.innerHTML = INTERSECTED.userData.artid;
    modal_name.innerHTML = INTERSECTED.userData.aname;
    modal_narrative.innerHTML =INTERSECTED.userData.Narrative; 
    modal_desc.innerHTML = INTERSECTED.userData.artdes;
    modal_img.src = INTERSECTED.userData.manimg;
    let close = document.getElementById("close");
    close.addEventListener("click", () => {
        modal.classList.remove("show");
    });
  }

function filterObjects() {
    let AllManuscripts = document.getElementById("All");
    let ApocalypticFilter = document.getElementById("Apo");
    let UtopianFilter = document.getElementById("Uto");
    let DystopianFilter = document.getElementById("Dysto");
    let RevolutionaryFilter = document.getElementById("Revo");
    let Unfiltered = document.getElementById("NoClass");

    AllManuscripts.addEventListener("click", () => {
        let ApoOpacity = scene.children.filter(child => child.name == "ApoGeo");
        let DystoOpacity = scene.children.filter(child => child.name == 'DystoGeo');
        let UtopianOpacity = scene.children.filter(child => child.name == 'UtoGeo');
        let RevolutionaryOpacity = scene.children.filter(child => child.name == 'RevolutionGeo');
        let NoDomainOpacity = scene.children.filter(child => child.name == 'NoDomainGeo');
        for (var i = 0, il = NoDomainOpacity.length; i < il; i++) {
            NoDomainOpacity[i].visible = true;
        }
       for (var i = 0, il = ApoOpacity.length; i < il; i++) {
        ApoOpacity[i].visible = true;
        }
        for (var i = 0, il = DystoOpacity.length; i < il; i++) {
            DystoOpacity[i].visible = true;
        }
        for (var i = 0, il = UtopianOpacity.length; i < il; i++) {
             UtopianOpacity[i].visible = true;
        }
        for (var i = 0, il = RevolutionaryOpacity.length; i < il; i++) {
            RevolutionaryOpacity[i].visible = true;
       }
      });

      ApocalypticFilter.addEventListener("click", () => {
        let ApoOpacity = scene.children.filter(child => child.name == "ApoGeo");
        let DystoOpacity = scene.children.filter(child => child.name == 'DystoGeo');
        let UtopianOpacity = scene.children.filter(child => child.name == 'UtoGeo');
        let RevolutionaryOpacity = scene.children.filter(child => child.name == 'RevolutionGeo');
        let NoDomainOpacity = scene.children.filter(child => child.name == 'NoDomainGeo');
        for (var i = 0, il = NoDomainOpacity.length; i < il; i++) {
            NoDomainOpacity[i].visible = false;
         }
       for (var i = 0, il = ApoOpacity.length; i < il; i++) {
        ApoOpacity[i].visible = true;
        }
        for (var i = 0, il = DystoOpacity.length; i < il; i++) {
            DystoOpacity[i].visible = false;
        }
        for (var i = 0, il = UtopianOpacity.length; i < il; i++) {
            UtopianOpacity[i].visible = false;
        }
        for (var i = 0, il = RevolutionaryOpacity.length; i < il; i++) {
            RevolutionaryOpacity[i].visible = false;
       }
      });

      UtopianFilter.addEventListener("click", () => {
        let ApoOpacity = scene.children.filter(child => child.name == "ApoGeo");
        let DystoOpacity = scene.children.filter(child => child.name == 'DystoGeo');
        let UtopianOpacity = scene.children.filter(child => child.name == 'UtoGeo');
        let RevolutionaryOpacity = scene.children.filter(child => child.name == 'RevolutionGeo');
        let NoDomainOpacity = scene.children.filter(child => child.name == 'NoDomainGeo');
        for (var i = 0, il = NoDomainOpacity.length; i < il; i++) {
            NoDomainOpacity[i].visible = false;
         }
       for (var i = 0, il = ApoOpacity.length; i < il; i++) {
        ApoOpacity[i].visible = false;
        }
        for (var i = 0, il = DystoOpacity.length; i < il; i++) {
            DystoOpacity[i].visible = false;
        }
        for (var i = 0, il = UtopianOpacity.length; i < il; i++) {
            UtopianOpacity[i].visible = true;
        }
        for (var i = 0, il = RevolutionaryOpacity.length; i < il; i++) {
            RevolutionaryOpacity[i].visible = false;
       }
      });

      DystopianFilter.addEventListener("click", () => {
        let ApoOpacity = scene.children.filter(child => child.name == "ApoGeo");
        let DystoOpacity = scene.children.filter(child => child.name == 'DystoGeo');
        let UtopianOpacity = scene.children.filter(child => child.name == 'UtoGeo');
        let RevolutionaryOpacity = scene.children.filter(child => child.name == 'RevolutionGeo');
        let NoDomainOpacity = scene.children.filter(child => child.name == 'NoDomainGeo');
        for (var i = 0, il = NoDomainOpacity.length; i < il; i++) {
            NoDomainOpacity[i].visible = false;
         }
       for (var i = 0, il = ApoOpacity.length; i < il; i++) {
        ApoOpacity[i].visible = false;
        }
        for (var i = 0, il = DystoOpacity.length; i < il; i++) {
            DystoOpacity[i].visible = true;
        }
        for (var i = 0, il = UtopianOpacity.length; i < il; i++) {
            UtopianOpacity[i].visible = false;
        }
        for (var i = 0, il = RevolutionaryOpacity.length; i < il; i++) {
            RevolutionaryOpacity[i].visible = false;
       }
      });

    RevolutionaryFilter.addEventListener("click", () => {
        let ApoOpacity = scene.children.filter(child => child.name == "ApoGeo");
        let DystoOpacity = scene.children.filter(child => child.name == 'DystoGeo');
        let UtopianOpacity = scene.children.filter(child => child.name == 'UtoGeo');
        let RevolutionaryOpacity = scene.children.filter(child => child.name == 'RevolutionGeo');
        let NoDomainOpacity = scene.children.filter(child => child.name == 'NoDomainGeo');
        for (var i = 0, il = NoDomainOpacity.length; i < il; i++) {
            NoDomainOpacity[i].visible = false;
         }
       for (var i = 0, il = ApoOpacity.length; i < il; i++) {
        ApoOpacity[i].visible = false;
        }
        for (var i = 0, il = DystoOpacity.length; i < il; i++) {
            DystoOpacity[i].visible = false;
        }
        for (var i = 0, il = UtopianOpacity.length; i < il; i++) {
            UtopianOpacity[i].visible = false;
        }
        for (var i = 0, il = RevolutionaryOpacity.length; i < il; i++) {
            RevolutionaryOpacity[i].visible = true;
       }
      });

      Unfiltered.addEventListener("click", () => {
        let ApoOpacity = scene.children.filter(child => child.name == "ApoGeo");
        let DystoOpacity = scene.children.filter(child => child.name == 'DystoGeo');
        let UtopianOpacity = scene.children.filter(child => child.name == 'UtoGeo');
        let RevolutionaryOpacity = scene.children.filter(child => child.name == 'RevolutionGeo');
        let NoDomainOpacity = scene.children.filter(child => child.name == 'NoDomainGeo');
        for (var i = 0, il = NoDomainOpacity.length; i < il; i++) {
            NoDomainOpacity[i].visible = true;
         }
       for (var i = 0, il = ApoOpacity.length; i < il; i++) {
        ApoOpacity[i].visible = false;
        }
        for (var i = 0, il = DystoOpacity.length; i < il; i++) {
            DystoOpacity[i].visible = false;
        }
        for (var i = 0, il = UtopianOpacity.length; i < il; i++) {
            UtopianOpacity[i].visible = false;
        }
        for (var i = 0, il = RevolutionaryOpacity.length; i < il; i++) {
            RevolutionaryOpacity[i].visible = false;
       }
      });
}

document.addEventListener("click", onMouseClick, false);

function onWindowResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

window.addEventListener("resize", onWindowResize, false);

init();
