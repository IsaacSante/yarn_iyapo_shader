import {
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
    Mesh,
    MeshLambertMaterial,
    Color,
    SphereBufferGeometry,
    BoxBufferGeometry,
    DodecahedronBufferGeometry,
    TorusBufferGeometry,
    ConeBufferGeometry,
    HemisphereLight,
    DirectionalLight,
    DirectionalLightHelper,
    Clock,
    Raycaster,
    Vector3,
  } from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {params} from './helper.js';
import * as dat from 'dat.gui';
import {createSculpture} from 'shader-park-core';
import * as Stats from 'stats.js';

import * as THREE from 'three'; //REMOVE this in production
const DEBUG = true; // Set to false in production
if(DEBUG) {
    window.THREE = THREE;
}
let container, scene, camera, renderer, controls, mesh, mouse, intersects, INTERSECTED;
let time, clock, repoData, repoLength, raycaster;
let stats;
let gui;

function uniformUpdateCallback() {
   return {
       time: time,
       _scale: params.sdfScale
   }
}

function init() {
    mouse = new THREE.Vector2();
    raycaster = new THREE.Raycaster();
    container = document.querySelector(".container");
    scene = new Scene();
    scene.background = new Color("skyblue");
    clock = new Clock(true);
    time = 0;
    createRenderer();
   const spinner = document.getElementById("spinner");
      function hideSpinner() {
      spinner.classList.add("hide");
   }
    fetch('https://iyapo-repo.glitch.me/mynewdata', {
        mode: 'cors',
        headers: {
          'Access-Control-Allow-Origin':'*'
        }
    }).then(resp => resp.json())
    .then(data => {
        repoData = data ;
        repoLength = repoData.length;
         hideSpinner();
         createGeometries();
    }).catch(e => console.error(e));

    createCamera();
    createLights();
    createControls();
    filterObjects();
  // initGui();
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
      //   time = clock.getD
    });
}


function initGui() {
   gui = new dat.GUI();
   window.gui = gui;
   document.querySelector('.dg').style.zIndex = 99; //fix dat.gui hidden
   gui.add(params, 'mixShape', 0, 1.00001);
}

function createCamera() {
    const aspect = container.clientWidth / container.clientHeight;
    camera = new PerspectiveCamera(35, aspect, 0.1, 1000);
    camera.position.set(100, 50, 150);

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

    let radius = params.boundingSphere;
    let spCode = `
    let s = getRayDirection();
    s.x += .01;
    color(s)
    sphere(0.5);
    `;
    let spCode2 = `
    let s = getRayDirection();
    s.x += .01;
    color(s)
    box(.5, .5, .5);
    `;
    let spCode3 = `
    let s = getRayDirection();
    s.x += .01;
    color(s)
    rotateX(Math.PI/2);
    torus(0.9, 0.05);
    `;

    for ( let i = 0; i < Apocalyptic.length; i ++ ){
      mesh = createSculpture(spCode, () => ({
         'time': time
     }), {radius: 5});
     mesh.position.x = Math.random() * 50 - 50;
     mesh.position.y = Math.random() * 10 - 10;
     mesh.position.z = Math.random() * 6 - 1;
     mesh.userData = Apocalyptic[i]
     mesh.name = 'ApoGeo';
     scene.add(mesh);
    }

    for ( let i = 0; i < Utopian.length; i ++ ){
      mesh = createSculpture(spCode2, () => ({
         'time': time
     }), {radius: 4});
        mesh.position.x = Math.random() * 50 - 50;
        mesh.position.y = Math.random() * 10 - 10;
        mesh.position.z = Math.random() * 6 - 1;
        mesh.userData = Utopian[i]
         mesh.name = 'UtoGeo';
         scene.add(mesh);
    }

    for ( let i = 0; i < Dystopian.length; i ++ ){
      mesh = createSculpture(spCode3, () => ({
         'time': time
     }), {radius: 3});
        mesh.position.x = Math.random() * 50 - 50;
        mesh.position.y = Math.random() * 10 - 10;
        mesh.position.z = Math.random() * 6 - 1;
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
        // console.log(intersects[0].object.userData)
        DisplayInfo();
    }else{
        INTERSECTED = null;
    }
   }
}

// function DisplayInfo(){
//     let modal = document.getElementById("newcont")
//     modal.classList.add("show");
//     let modal_name = document.getElementById("name");
//     let modal_title = document.getElementById("title");
//     let modal_desc = document.getElementById("desc");
//     let modal_img = document.getElementById("modal-img");   
//     let modal_narrative = document.getElementById("narrative");
//     modal_title.innerHTML = INTERSECTED.userData.artid;
//     modal_name.innerHTML = INTERSECTED.userData.aname;
//     modal_narrative.innerHTML =INTERSECTED.userData.Narrative; 
//     modal_desc.innerHTML = INTERSECTED.userData.artdes;
//     modal_img.src = INTERSECTED.userData.manimg;
//     let close = document.getElementById("close");
//     close.addEventListener("click", () => {
//         modal.classList.remove("show");
//     });
//   }

function filterObjects() {

    //Narrative Buttons//
    let AllManuscripts = document.getElementById("All");
    let ApocalypticFilter = document.getElementById("Apo");
    let UtopianFilter = document.getElementById("Uto");
    let DystopianFilter = document.getElementById("Dysto");
    let RevolutionaryFilter = document.getElementById("Revo");
    let Unfiltered = document.getElementById("NoClass");

    //Domain Buttons//
    let AllDomainsFilter = document.getElementById("AllDomains");
    let PoliticsFilter  = document.getElementById("Politics");
    let EnvironmentFilter = document.getElementById("Environment");
    let SpaceTravelFilter  = document.getElementById("Space-Travel");
    let EducationFilter = document.getElementById("Education");
    let GameFilter = document.getElementById("Game");
    let SecurityFilter = document.getElementById("Security");
    let FashionFilter = document.getElementById("Fashion");
    let FoodFilter = document.getElementById("Food");
    let HealthFilter = document.getElementById("Health");
    let MusicFilter = document.getElementById("Music");
    let NoDomainFilter = document.getElementById("NoDomain");

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

      AllDomainsFilter.addEventListener("click", () => {

        let PoliticsOpacity = scene.children.filter(child => child.userData.Domain == "Politics");
        let EnvironmentOpacity = scene.children.filter(child => child.userData.Domain == "Environment");
        let SpaceTravelOpacity  = scene.children.filter(child => child.userData.Domain == "Space Travel");
        let EducationOpacity  = scene.children.filter(child => child.userData.Domain == "Education");
        let GameOpacity = scene.children.filter(child => child.userData.Domain == "Game");
        let SecurityOpacity = scene.children.filter(child => child.userData.Domain == "Security");
        let FashionOpacity = scene.children.filter(child => child.userData.Domain == "Fashion");
        let FoodOpacity = scene.children.filter(child => child.userData.Domain == "Food");
        let HealthOpacity = scene.children.filter(child => child.userData.Domain == "Health");
        let MusicOpacity = scene.children.filter(child => child.userData.Domain == "Music");
        let NoDomainTypeOpacity = scene.children.filter(child => child.userData.Domain == "-na-");

        for (var i = 0, il = PoliticsOpacity.length; i < il; i++) {
            PoliticsOpacity[i].visible = true;
         }
         for (var i = 0, il = EnvironmentOpacity.length; i < il; i++) {
            EnvironmentOpacity[i].visible = true;
         }
         for (var i = 0, il = SpaceTravelOpacity.length; i < il; i++) {
            SpaceTravelOpacity[i].visible = true;
         }
         for (var i = 0, il = EducationOpacity.length; i < il; i++) {
            EducationOpacity[i].visible = true;
         }
         for (var i = 0, il = GameOpacity.length; i < il; i++) {
            GameOpacity[i].visible = true;
         }
         for (var i = 0, il = SecurityOpacity.length; i < il; i++) {
            SecurityOpacity[i].visible = true;
         }
         for (var i = 0, il = FashionOpacity.length; i < il; i++) {
            FashionOpacity[i].visible = true;
         }
         for (var i = 0, il = FoodOpacity.length; i < il; i++) {
            FoodOpacity[i].visible = true;
         }
         for (var i = 0, il = HealthOpacity.length; i < il; i++) {
            HealthOpacity[i].visible = true;
         }
         for (var i = 0, il = MusicOpacity.length; i < il; i++) {
            MusicOpacity[i].visible = true;
         }
         for (var i = 0, il = NoDomainTypeOpacity.length; i < il; i++) {
            NoDomainTypeOpacity[i].visible = true;
         }

      })

      PoliticsFilter.addEventListener("click", () => {

        let PoliticsOpacity = scene.children.filter(child => child.userData.Domain == "Politics");
        let EnvironmentOpacity = scene.children.filter(child => child.userData.Domain == "Environment");
        let SpaceTravelOpacity  = scene.children.filter(child => child.userData.Domain == "Space Travel");
        let EducationOpacity  = scene.children.filter(child => child.userData.Domain == "Education");
        let GameOpacity = scene.children.filter(child => child.userData.Domain == "Game");
        let SecurityOpacity = scene.children.filter(child => child.userData.Domain == "Security");
        let FashionOpacity = scene.children.filter(child => child.userData.Domain == "Fashion");
        let FoodOpacity = scene.children.filter(child => child.userData.Domain == "Food");
        let HealthOpacity = scene.children.filter(child => child.userData.Domain == "Health");
        let MusicOpacity = scene.children.filter(child => child.userData.Domain == "Music");
        let NoDomainTypeOpacity = scene.children.filter(child => child.userData.Domain == "-na-");

        for (var i = 0, il = PoliticsOpacity.length; i < il; i++) {
            PoliticsOpacity[i].visible = true;
         }
         for (var i = 0, il = EnvironmentOpacity.length; i < il; i++) {
            EnvironmentOpacity[i].visible = false;
         }
         for (var i = 0, il = SpaceTravelOpacity.length; i < il; i++) {
            SpaceTravelOpacity[i].visible = false;
         }
         for (var i = 0, il = EducationOpacity.length; i < il; i++) {
            EducationOpacity[i].visible = false;
         }
         for (var i = 0, il = GameOpacity.length; i < il; i++) {
            GameOpacity[i].visible = false;
         }
         for (var i = 0, il = SecurityOpacity.length; i < il; i++) {
            SecurityOpacity[i].visible = false;
         }
         for (var i = 0, il = FashionOpacity.length; i < il; i++) {
            FashionOpacity[i].visible = false;
         }
         for (var i = 0, il = FoodOpacity.length; i < il; i++) {
            FoodOpacity[i].visible = false;
         }
         for (var i = 0, il = HealthOpacity.length; i < il; i++) {
            HealthOpacity[i].visible = false;
         }
         for (var i = 0, il = MusicOpacity.length; i < il; i++) {
            MusicOpacity[i].visible = false;
         }
         for (var i = 0, il = NoDomainTypeOpacity.length; i < il; i++) {
            NoDomainTypeOpacity[i].visible = false;
         }

      })

      EnvironmentFilter.addEventListener("click", () => {

        let PoliticsOpacity = scene.children.filter(child => child.userData.Domain == "Politics");
        let EnvironmentOpacity = scene.children.filter(child => child.userData.Domain == "Environment");
        let SpaceTravelOpacity  = scene.children.filter(child => child.userData.Domain == "Space Travel");
        let EducationOpacity  = scene.children.filter(child => child.userData.Domain == "Education");
        let GameOpacity = scene.children.filter(child => child.userData.Domain == "Game");
        let SecurityOpacity = scene.children.filter(child => child.userData.Domain == "Security");
        let FashionOpacity = scene.children.filter(child => child.userData.Domain == "Fashion");
        let FoodOpacity = scene.children.filter(child => child.userData.Domain == "Food");
        let HealthOpacity = scene.children.filter(child => child.userData.Domain == "Health");
        let MusicOpacity = scene.children.filter(child => child.userData.Domain == "Music");
        let NoDomainTypeOpacity = scene.children.filter(child => child.userData.Domain == "-na-");

        for (var i = 0, il = PoliticsOpacity.length; i < il; i++) {
            PoliticsOpacity[i].visible = false;
         }
         for (var i = 0, il = EnvironmentOpacity.length; i < il; i++) {
            EnvironmentOpacity[i].visible = true;
         }
         for (var i = 0, il = SpaceTravelOpacity.length; i < il; i++) {
            SpaceTravelOpacity[i].visible = false;
         }
         for (var i = 0, il = EducationOpacity.length; i < il; i++) {
            EducationOpacity[i].visible = false;
         }
         for (var i = 0, il = GameOpacity.length; i < il; i++) {
            GameOpacity[i].visible = false;
         }
         for (var i = 0, il = SecurityOpacity.length; i < il; i++) {
            SecurityOpacity[i].visible = false;
         }
         for (var i = 0, il = FashionOpacity.length; i < il; i++) {
            FashionOpacity[i].visible = false;
         }
         for (var i = 0, il = FoodOpacity.length; i < il; i++) {
            FoodOpacity[i].visible = false;
         }
         for (var i = 0, il = HealthOpacity.length; i < il; i++) {
            HealthOpacity[i].visible = false;
         }
         for (var i = 0, il = MusicOpacity.length; i < il; i++) {
            MusicOpacity[i].visible = false;
         }
         for (var i = 0, il = NoDomainTypeOpacity.length; i < il; i++) {
            NoDomainTypeOpacity[i].visible = false;
         }

      })

      SpaceTravelFilter.addEventListener("click", () => {

        let PoliticsOpacity = scene.children.filter(child => child.userData.Domain == "Politics");
        let EnvironmentOpacity = scene.children.filter(child => child.userData.Domain == "Environment");
        let SpaceTravelOpacity  = scene.children.filter(child => child.userData.Domain == "Space Travel");
        let EducationOpacity  = scene.children.filter(child => child.userData.Domain == "Education");
        let GameOpacity = scene.children.filter(child => child.userData.Domain == "Game");
        let SecurityOpacity = scene.children.filter(child => child.userData.Domain == "Security");
        let FashionOpacity = scene.children.filter(child => child.userData.Domain == "Fashion");
        let FoodOpacity = scene.children.filter(child => child.userData.Domain == "Food");
        let HealthOpacity = scene.children.filter(child => child.userData.Domain == "Health");
        let MusicOpacity = scene.children.filter(child => child.userData.Domain == "Music");
        let NoDomainTypeOpacity = scene.children.filter(child => child.userData.Domain == "-na-");

        for (var i = 0, il = PoliticsOpacity.length; i < il; i++) {
            PoliticsOpacity[i].visible = false;
         }
         for (var i = 0, il = EnvironmentOpacity.length; i < il; i++) {
            EnvironmentOpacity[i].visible = false;
         }
         for (var i = 0, il = SpaceTravelOpacity.length; i < il; i++) {
            SpaceTravelOpacity[i].visible = true;
         }
         for (var i = 0, il = EducationOpacity.length; i < il; i++) {
            EducationOpacity[i].visible = false;
         }
         for (var i = 0, il = GameOpacity.length; i < il; i++) {
            GameOpacity[i].visible = false;
         }
         for (var i = 0, il = SecurityOpacity.length; i < il; i++) {
            SecurityOpacity[i].visible = false;
         }
         for (var i = 0, il = FashionOpacity.length; i < il; i++) {
            FashionOpacity[i].visible = false;
         }
         for (var i = 0, il = FoodOpacity.length; i < il; i++) {
            FoodOpacity[i].visible = false;
         }
         for (var i = 0, il = HealthOpacity.length; i < il; i++) {
            HealthOpacity[i].visible = false;
         }
         for (var i = 0, il = MusicOpacity.length; i < il; i++) {
            MusicOpacity[i].visible = false;
         }
         for (var i = 0, il = NoDomainTypeOpacity.length; i < il; i++) {
            NoDomainTypeOpacity[i].visible = false;
         }

      })

      EducationFilter.addEventListener("click", () => {

        let PoliticsOpacity = scene.children.filter(child => child.userData.Domain == "Politics");
        let EnvironmentOpacity = scene.children.filter(child => child.userData.Domain == "Environment");
        let SpaceTravelOpacity  = scene.children.filter(child => child.userData.Domain == "Space Travel");
        let EducationOpacity  = scene.children.filter(child => child.userData.Domain == "Education");
        let GameOpacity = scene.children.filter(child => child.userData.Domain == "Game");
        let SecurityOpacity = scene.children.filter(child => child.userData.Domain == "Security");
        let FashionOpacity = scene.children.filter(child => child.userData.Domain == "Fashion");
        let FoodOpacity = scene.children.filter(child => child.userData.Domain == "Food");
        let HealthOpacity = scene.children.filter(child => child.userData.Domain == "Health");
        let MusicOpacity = scene.children.filter(child => child.userData.Domain == "Music");
        let NoDomainTypeOpacity = scene.children.filter(child => child.userData.Domain == "-na-");

        for (var i = 0, il = PoliticsOpacity.length; i < il; i++) {
            PoliticsOpacity[i].visible = false;
         }
         for (var i = 0, il = EnvironmentOpacity.length; i < il; i++) {
            EnvironmentOpacity[i].visible = false;
         }
         for (var i = 0, il = SpaceTravelOpacity.length; i < il; i++) {
            SpaceTravelOpacity[i].visible = false;
         }
         for (var i = 0, il = EducationOpacity.length; i < il; i++) {
            EducationOpacity[i].visible = true;
         }
         for (var i = 0, il = GameOpacity.length; i < il; i++) {
            GameOpacity[i].visible = false;
         }
         for (var i = 0, il = SecurityOpacity.length; i < il; i++) {
            SecurityOpacity[i].visible = false;
         }
         for (var i = 0, il = FashionOpacity.length; i < il; i++) {
            FashionOpacity[i].visible = false;
         }
         for (var i = 0, il = FoodOpacity.length; i < il; i++) {
            FoodOpacity[i].visible = false;
         }
         for (var i = 0, il = HealthOpacity.length; i < il; i++) {
            HealthOpacity[i].visible = false;
         }
         for (var i = 0, il = MusicOpacity.length; i < il; i++) {
            MusicOpacity[i].visible = false;
         }
         for (var i = 0, il = NoDomainTypeOpacity.length; i < il; i++) {
            NoDomainTypeOpacity[i].visible = false;
         }

      })

      GameFilter.addEventListener("click", () => {

        let PoliticsOpacity = scene.children.filter(child => child.userData.Domain == "Politics");
        let EnvironmentOpacity = scene.children.filter(child => child.userData.Domain == "Environment");
        let SpaceTravelOpacity  = scene.children.filter(child => child.userData.Domain == "Space Travel");
        let EducationOpacity  = scene.children.filter(child => child.userData.Domain == "Education");
        let GameOpacity = scene.children.filter(child => child.userData.Domain == "Game");
        let SecurityOpacity = scene.children.filter(child => child.userData.Domain == "Security");
        let FashionOpacity = scene.children.filter(child => child.userData.Domain == "Fashion");
        let FoodOpacity = scene.children.filter(child => child.userData.Domain == "Food");
        let HealthOpacity = scene.children.filter(child => child.userData.Domain == "Health");
        let MusicOpacity = scene.children.filter(child => child.userData.Domain == "Music");
        let NoDomainTypeOpacity = scene.children.filter(child => child.userData.Domain == "-na-");

        for (var i = 0, il = PoliticsOpacity.length; i < il; i++) {
            PoliticsOpacity[i].visible = false;
         }
         for (var i = 0, il = EnvironmentOpacity.length; i < il; i++) {
            EnvironmentOpacity[i].visible = false;
         }
         for (var i = 0, il = SpaceTravelOpacity.length; i < il; i++) {
            SpaceTravelOpacity[i].visible = false;
         }
         for (var i = 0, il = EducationOpacity.length; i < il; i++) {
            EducationOpacity[i].visible = false;
         }
         for (var i = 0, il = GameOpacity.length; i < il; i++) {
            GameOpacity[i].visible = true;
         }
         for (var i = 0, il = SecurityOpacity.length; i < il; i++) {
            SecurityOpacity[i].visible = false;
         }
         for (var i = 0, il = FashionOpacity.length; i < il; i++) {
            FashionOpacity[i].visible = false;
         }
         for (var i = 0, il = FoodOpacity.length; i < il; i++) {
            FoodOpacity[i].visible = false;
         }
         for (var i = 0, il = HealthOpacity.length; i < il; i++) {
            HealthOpacity[i].visible = false;
         }
         for (var i = 0, il = MusicOpacity.length; i < il; i++) {
            MusicOpacity[i].visible = false;
         }
         for (var i = 0, il = NoDomainTypeOpacity.length; i < il; i++) {
            NoDomainTypeOpacity[i].visible = false;
         }

      })

      SecurityFilter.addEventListener("click", () => {

        let PoliticsOpacity = scene.children.filter(child => child.userData.Domain == "Politics");
        let EnvironmentOpacity = scene.children.filter(child => child.userData.Domain == "Environment");
        let SpaceTravelOpacity  = scene.children.filter(child => child.userData.Domain == "Space Travel");
        let EducationOpacity  = scene.children.filter(child => child.userData.Domain == "Education");
        let GameOpacity = scene.children.filter(child => child.userData.Domain == "Game");
        let SecurityOpacity = scene.children.filter(child => child.userData.Domain == "Security");
        let FashionOpacity = scene.children.filter(child => child.userData.Domain == "Fashion");
        let FoodOpacity = scene.children.filter(child => child.userData.Domain == "Food");
        let HealthOpacity = scene.children.filter(child => child.userData.Domain == "Health");
        let MusicOpacity = scene.children.filter(child => child.userData.Domain == "Music");
        let NoDomainTypeOpacity = scene.children.filter(child => child.userData.Domain == "-na-");

        for (var i = 0, il = PoliticsOpacity.length; i < il; i++) {
            PoliticsOpacity[i].visible = false;
         }
         for (var i = 0, il = EnvironmentOpacity.length; i < il; i++) {
            EnvironmentOpacity[i].visible = false;
         }
         for (var i = 0, il = SpaceTravelOpacity.length; i < il; i++) {
            SpaceTravelOpacity[i].visible = false;
         }
         for (var i = 0, il = EducationOpacity.length; i < il; i++) {
            EducationOpacity[i].visible = false;
         }
         for (var i = 0, il = GameOpacity.length; i < il; i++) {
            GameOpacity[i].visible = false;
         }
         for (var i = 0, il = SecurityOpacity.length; i < il; i++) {
            SecurityOpacity[i].visible = true;
         }
         for (var i = 0, il = FashionOpacity.length; i < il; i++) {
            FashionOpacity[i].visible = false;
         }
         for (var i = 0, il = FoodOpacity.length; i < il; i++) {
            FoodOpacity[i].visible = false;
         }
         for (var i = 0, il = HealthOpacity.length; i < il; i++) {
            HealthOpacity[i].visible = false;
         }
         for (var i = 0, il = MusicOpacity.length; i < il; i++) {
            MusicOpacity[i].visible = false;
         }
         for (var i = 0, il = NoDomainTypeOpacity.length; i < il; i++) {
            NoDomainTypeOpacity[i].visible = false;
         }

      })

      FashionFilter.addEventListener("click", () => {

        let PoliticsOpacity = scene.children.filter(child => child.userData.Domain == "Politics");
        let EnvironmentOpacity = scene.children.filter(child => child.userData.Domain == "Environment");
        let SpaceTravelOpacity  = scene.children.filter(child => child.userData.Domain == "Space Travel");
        let EducationOpacity  = scene.children.filter(child => child.userData.Domain == "Education");
        let GameOpacity = scene.children.filter(child => child.userData.Domain == "Game");
        let SecurityOpacity = scene.children.filter(child => child.userData.Domain == "Security");
        let FashionOpacity = scene.children.filter(child => child.userData.Domain == "Fashion");
        let FoodOpacity = scene.children.filter(child => child.userData.Domain == "Food");
        let HealthOpacity = scene.children.filter(child => child.userData.Domain == "Health");
        let MusicOpacity = scene.children.filter(child => child.userData.Domain == "Music");
        let NoDomainTypeOpacity = scene.children.filter(child => child.userData.Domain == "-na-");

        for (var i = 0, il = PoliticsOpacity.length; i < il; i++) {
            PoliticsOpacity[i].visible = false;
         }
         for (var i = 0, il = EnvironmentOpacity.length; i < il; i++) {
            EnvironmentOpacity[i].visible = false;
         }
         for (var i = 0, il = SpaceTravelOpacity.length; i < il; i++) {
            SpaceTravelOpacity[i].visible = false;
         }
         for (var i = 0, il = EducationOpacity.length; i < il; i++) {
            EducationOpacity[i].visible = false;
         }
         for (var i = 0, il = GameOpacity.length; i < il; i++) {
            GameOpacity[i].visible = false;
         }
         for (var i = 0, il = SecurityOpacity.length; i < il; i++) {
            SecurityOpacity[i].visible = false;
         }
         for (var i = 0, il = FashionOpacity.length; i < il; i++) {
            FashionOpacity[i].visible = true;
         }
         for (var i = 0, il = FoodOpacity.length; i < il; i++) {
            FoodOpacity[i].visible = false;
         }
         for (var i = 0, il = HealthOpacity.length; i < il; i++) {
            HealthOpacity[i].visible = false;
         }
         for (var i = 0, il = MusicOpacity.length; i < il; i++) {
            MusicOpacity[i].visible = false;
         }
         for (var i = 0, il = NoDomainTypeOpacity.length; i < il; i++) {
            NoDomainTypeOpacity[i].visible = false;
         }

      })

      FoodFilter.addEventListener("click", () => {

        let PoliticsOpacity = scene.children.filter(child => child.userData.Domain == "Politics");
        let EnvironmentOpacity = scene.children.filter(child => child.userData.Domain == "Environment");
        let SpaceTravelOpacity  = scene.children.filter(child => child.userData.Domain == "Space Travel");
        let EducationOpacity  = scene.children.filter(child => child.userData.Domain == "Education");
        let GameOpacity = scene.children.filter(child => child.userData.Domain == "Game");
        let SecurityOpacity = scene.children.filter(child => child.userData.Domain == "Security");
        let FashionOpacity = scene.children.filter(child => child.userData.Domain == "Fashion");
        let FoodOpacity = scene.children.filter(child => child.userData.Domain == "Food");
        let HealthOpacity = scene.children.filter(child => child.userData.Domain == "Health");
        let MusicOpacity = scene.children.filter(child => child.userData.Domain == "Music");
        let NoDomainTypeOpacity = scene.children.filter(child => child.userData.Domain == "-na-");

        for (var i = 0, il = PoliticsOpacity.length; i < il; i++) {
            PoliticsOpacity[i].visible = false;
         }
         for (var i = 0, il = EnvironmentOpacity.length; i < il; i++) {
            EnvironmentOpacity[i].visible = false;
         }
         for (var i = 0, il = SpaceTravelOpacity.length; i < il; i++) {
            SpaceTravelOpacity[i].visible = false;
         }
         for (var i = 0, il = EducationOpacity.length; i < il; i++) {
            EducationOpacity[i].visible = false;
         }
         for (var i = 0, il = GameOpacity.length; i < il; i++) {
            GameOpacity[i].visible = false;
         }
         for (var i = 0, il = SecurityOpacity.length; i < il; i++) {
            SecurityOpacity[i].visible = false;
         }
         for (var i = 0, il = FashionOpacity.length; i < il; i++) {
            FashionOpacity[i].visible = false;
         }
         for (var i = 0, il = FoodOpacity.length; i < il; i++) {
            FoodOpacity[i].visible = true;
         }
         for (var i = 0, il = HealthOpacity.length; i < il; i++) {
            HealthOpacity[i].visible = false;
         }
         for (var i = 0, il = MusicOpacity.length; i < il; i++) {
            MusicOpacity[i].visible = false;
         }
         for (var i = 0, il = NoDomainTypeOpacity.length; i < il; i++) {
            NoDomainTypeOpacity[i].visible = false;
         }

      })



      HealthFilter.addEventListener("click", () => {

        let PoliticsOpacity = scene.children.filter(child => child.userData.Domain == "Politics");
        let EnvironmentOpacity = scene.children.filter(child => child.userData.Domain == "Environment");
        let SpaceTravelOpacity  = scene.children.filter(child => child.userData.Domain == "Space Travel");
        let EducationOpacity  = scene.children.filter(child => child.userData.Domain == "Education");
        let GameOpacity = scene.children.filter(child => child.userData.Domain == "Game");
        let SecurityOpacity = scene.children.filter(child => child.userData.Domain == "Security");
        let FashionOpacity = scene.children.filter(child => child.userData.Domain == "Fashion");
        let FoodOpacity = scene.children.filter(child => child.userData.Domain == "Food");
        let HealthOpacity = scene.children.filter(child => child.userData.Domain == "Health");
        let MusicOpacity = scene.children.filter(child => child.userData.Domain == "Music");
        let NoDomainTypeOpacity = scene.children.filter(child => child.userData.Domain == "-na-");

        for (var i = 0, il = PoliticsOpacity.length; i < il; i++) {
            PoliticsOpacity[i].visible = false;
         }
         for (var i = 0, il = EnvironmentOpacity.length; i < il; i++) {
            EnvironmentOpacity[i].visible = false;
         }
         for (var i = 0, il = SpaceTravelOpacity.length; i < il; i++) {
            SpaceTravelOpacity[i].visible = false;
         }
         for (var i = 0, il = EducationOpacity.length; i < il; i++) {
            EducationOpacity[i].visible = false;
         }
         for (var i = 0, il = GameOpacity.length; i < il; i++) {
            GameOpacity[i].visible = false;
         }
         for (var i = 0, il = SecurityOpacity.length; i < il; i++) {
            SecurityOpacity[i].visible = false;
         }
         for (var i = 0, il = FashionOpacity.length; i < il; i++) {
            FashionOpacity[i].visible = false;
         }
         for (var i = 0, il = FoodOpacity.length; i < il; i++) {
            FoodOpacity[i].visible = false;
         }
         for (var i = 0, il = HealthOpacity.length; i < il; i++) {
            HealthOpacity[i].visible = true;
         }
         for (var i = 0, il = MusicOpacity.length; i < il; i++) {
            MusicOpacity[i].visible = false;
         }
         for (var i = 0, il = NoDomainTypeOpacity.length; i < il; i++) {
            NoDomainTypeOpacity[i].visible = false;
         }

      })


      MusicFilter.addEventListener("click", () => {

        let PoliticsOpacity = scene.children.filter(child => child.userData.Domain == "Politics");
        let EnvironmentOpacity = scene.children.filter(child => child.userData.Domain == "Environment");
        let SpaceTravelOpacity  = scene.children.filter(child => child.userData.Domain == "Space Travel");
        let EducationOpacity  = scene.children.filter(child => child.userData.Domain == "Education");
        let GameOpacity = scene.children.filter(child => child.userData.Domain == "Game");
        let SecurityOpacity = scene.children.filter(child => child.userData.Domain == "Security");
        let FashionOpacity = scene.children.filter(child => child.userData.Domain == "Fashion");
        let FoodOpacity = scene.children.filter(child => child.userData.Domain == "Food");
        let HealthOpacity = scene.children.filter(child => child.userData.Domain == "Health");
        let MusicOpacity = scene.children.filter(child => child.userData.Domain == "Music");
        let NoDomainTypeOpacity = scene.children.filter(child => child.userData.Domain == "-na-");

        for (var i = 0, il = PoliticsOpacity.length; i < il; i++) {
            PoliticsOpacity[i].visible = false;
         }
         for (var i = 0, il = EnvironmentOpacity.length; i < il; i++) {
            EnvironmentOpacity[i].visible = false;
         }
         for (var i = 0, il = SpaceTravelOpacity.length; i < il; i++) {
            SpaceTravelOpacity[i].visible = false;
         }
         for (var i = 0, il = EducationOpacity.length; i < il; i++) {
            EducationOpacity[i].visible = false;
         }
         for (var i = 0, il = GameOpacity.length; i < il; i++) {
            GameOpacity[i].visible = false;
         }
         for (var i = 0, il = SecurityOpacity.length; i < il; i++) {
            SecurityOpacity[i].visible = false;
         }
         for (var i = 0, il = FashionOpacity.length; i < il; i++) {
            FashionOpacity[i].visible = false;
         }
         for (var i = 0, il = FoodOpacity.length; i < il; i++) {
            FoodOpacity[i].visible = false;
         }
         for (var i = 0, il = HealthOpacity.length; i < il; i++) {
            HealthOpacity[i].visible = false;
         }
         for (var i = 0, il = MusicOpacity.length; i < il; i++) {
            MusicOpacity[i].visible = true;
         }
         for (var i = 0, il = NoDomainTypeOpacity.length; i < il; i++) {
            NoDomainTypeOpacity[i].visible = false;
         }

      })

      NoDomainFilter.addEventListener("click", () => {

        let PoliticsOpacity = scene.children.filter(child => child.userData.Domain == "Politics");
        let EnvironmentOpacity = scene.children.filter(child => child.userData.Domain == "Environment");
        let SpaceTravelOpacity  = scene.children.filter(child => child.userData.Domain == "Space Travel");
        let EducationOpacity  = scene.children.filter(child => child.userData.Domain == "Education");
        let GameOpacity = scene.children.filter(child => child.userData.Domain == "Game");
        let SecurityOpacity = scene.children.filter(child => child.userData.Domain == "Security");
        let FashionOpacity = scene.children.filter(child => child.userData.Domain == "Fashion");
        let FoodOpacity = scene.children.filter(child => child.userData.Domain == "Food");
        let HealthOpacity = scene.children.filter(child => child.userData.Domain == "Health");
        let MusicOpacity = scene.children.filter(child => child.userData.Domain == "Music");
        let NoDomainTypeOpacity = scene.children.filter(child => child.userData.Domain == "-na-");

        for (var i = 0, il = PoliticsOpacity.length; i < il; i++) {
            PoliticsOpacity[i].visible = false;
         }
         for (var i = 0, il = EnvironmentOpacity.length; i < il; i++) {
            EnvironmentOpacity[i].visible = false;
         }
         for (var i = 0, il = SpaceTravelOpacity.length; i < il; i++) {
            SpaceTravelOpacity[i].visible = false;
         }
         for (var i = 0, il = EducationOpacity.length; i < il; i++) {
            EducationOpacity[i].visible = false;
         }
         for (var i = 0, il = GameOpacity.length; i < il; i++) {
            GameOpacity[i].visible = false;
         }
         for (var i = 0, il = SecurityOpacity.length; i < il; i++) {
            SecurityOpacity[i].visible = false;
         }
         for (var i = 0, il = FashionOpacity.length; i < il; i++) {
            FashionOpacity[i].visible = false;
         }
         for (var i = 0, il = FoodOpacity.length; i < il; i++) {
            FoodOpacity[i].visible = false;
         }
         for (var i = 0, il = HealthOpacity.length; i < il; i++) {
            HealthOpacity[i].visible = false;
         }
         for (var i = 0, il = MusicOpacity.length; i < il; i++) {
            MusicOpacity[i].visible = false;
         }
         for (var i = 0, il = NoDomainTypeOpacity.length; i < il; i++) {
            NoDomainTypeOpacity[i].visible = true;
         }

      })

}

document.addEventListener("click", onMouseClick, false);

function onWindowResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

window.addEventListener("resize", onWindowResize, false);

init();
