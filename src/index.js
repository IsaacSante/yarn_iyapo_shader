import {
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
    Mesh,
    MeshLambertMaterial,
    SphereBufferGeometry,
    BoxBufferGeometry,
    DodecahedronBufferGeometry,
    TorusBufferGeometry,
    ConeBufferGeometry,
    HemisphereLight,
    DirectionalLight,
    Clock,
    Raycaster,
    Vector2,
    LineBasicMaterial,
    Line,
    Geometry,
  } from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

let container, scene, camera, renderer, controls, mesh, mouse, INTERSECTED, newMesh, line, lineGeom, lineMat;
let time, clock, repoData, repoLength, raycaster, artifactData; 
let matchesArray;
let animateNotIntersected = true;

fetch('https://iyapo-repo.glitch.me/artifacts', {
mode: 'cors',
headers: {
  'Access-Control-Allow-Origin':'*'
}
}).then(resp => resp.json())
.then(data => {
  artifactData = data;
  fetchDataAll();
}).catch(e => console.error(e));

const spinner = document.getElementById("spinner");
function hideSpinner() {
spinner.classList.add("hide");
}

function init() {
   container = document.querySelector(".container");
   scene = new Scene();
    mouse = new Vector2();
    raycaster = new Raycaster();
    clock = new Clock(true);
    createRenderer();
    createCamera();
    createLights();
    createControls();
    renderer.setAnimationLoop(() => {
         animate();
        renderer.render(scene, camera);
    });
}

function fetchDataAll() {
// adress where data is coming from
//https://glitch.com/edit/#!/iyapo-repo
//fetching manuscript data...
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
   renderer = new WebGLRenderer({ alpha: true , antialias: true});
   renderer.setClearColor(0xfcba03, 0);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.physicallyCorrectLights = true;
    container.appendChild(renderer.domElement);
    renderer.setPixelRatio(window.devicePixelRatio || 1);
}

function createGeometries() {
    const geometry = new BoxBufferGeometry(3, 3, 3);
    const geometry2 = new SphereBufferGeometry(3, 3, 3);
    const geometry3 = new DodecahedronBufferGeometry(3, 3, 3);
    const geometry4 = new ConeBufferGeometry(5, 4, 3);
    const geometry5 = new TorusBufferGeometry( 3, 1, 16, 100 );
    const material = new MeshLambertMaterial({
        color: 0xff0000,
        opacity: 1,
        transparent: true,
      });
      const material2 = new MeshLambertMaterial({
        color: 0xFFFF00,
        opacity: 1,
        transparent: true,
      });
      const material3 = new MeshLambertMaterial({
        color: 0x0000FF,
        opacity: 1,
        transparent: true,
      });
      const material4 = new MeshLambertMaterial({
        color: 0x00FF00,
        opacity: 1,
        transparent: true,
      });
      const material5 = new MeshLambertMaterial({
        color: 0x6D8C2D,
        opacity: 1,
        transparent: true,
      });
    const Apocalyptic = repoData.filter(child => child.Narrative == "Apocalyptic");
    const Utopian = repoData.filter(child => child.Narrative == "Utopian");
    const Dystopian = repoData.filter(child => child.Narrative == "Dystopian");
    const Revolutionary = repoData.filter(child => child.Narrative == "Revolutionary");
    const NoDomain = repoData.filter(child => child.Narrative == "-na-");
    for ( let i = 0; i < Apocalyptic.length; i ++ ){
     mesh = new Mesh(geometry, material);
     mesh.position.x = Math.random() * 50 - 50;
     mesh.position.y = Math.random() * 10 - 10;
     mesh.position.z = Math.random() * 6 - 1;
     mesh.userData = Apocalyptic[i]
     mesh.name = 'ApoGeo';
     scene.add(mesh);
    }
    for ( let i = 0; i < Utopian.length; i ++ ){
        mesh = new Mesh(geometry2, material2);
        mesh.position.x = Math.random() * 50 - 50;
        mesh.position.y = Math.random() * 10 - 10;
        mesh.position.z = Math.random() * 6 - 1;
        mesh.userData = Utopian[i]
         mesh.name = 'UtoGeo';
         scene.add(mesh);
    }
    for ( let i = 0; i < Dystopian.length; i ++ ){
        mesh = new Mesh(geometry3, material3);
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
        mesh = new Mesh(geometry4, material4);
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
    createArtifacts(artifactData)
}

function createArtifacts(artifactData){
   let ArtifactGeo = new SphereBufferGeometry(1.5, 32, 32);
      let Artifactmaterial = new MeshLambertMaterial({
            color: 0xFFFFFF,
            opacity: 1,
            transparent: true,
      });
      let geoFilter = scene.children.filter(x => x.type == "Mesh"); 
      for(let a = 0; a < artifactData.length; a++){
           newMesh = new Mesh(ArtifactGeo, Artifactmaterial);
           newMesh.name = 'Artifacts';
           newMesh.userData = artifactData[a]
           scene.add(newMesh);
           let arrayMatches = geoFilter.filter(y => y.userData.manid == artifactData[a].manid);
               for(let b = 0; b < arrayMatches.length; b++) {
                     lineGeom = new Geometry();
                     lineGeom.vertices.push(newMesh.position);
                     lineGeom.vertices.push(arrayMatches[b].position);
                        lineMat = new LineBasicMaterial({
                        color: "white"
                        });
                     line = new Line(lineGeom, lineMat);
                     scene.add(line);
                     matchesArray = arrayMatches[b].position;
               }
      }
   }


function BoxDefaultMovement(){
    let sphere = scene.children.filter(child => child.type == "Mesh");
    for (var i = 0, il = sphere.length; i < il; i++) {
      sphere[i].position.x = 50 * Math.tan(time + i); 
      sphere[i].position.y = 50 * Math.cos(time + i * 1.1);
      sphere[i].position.z = 50 * Math.cos(time + i * 1); 
     }
}

function animate(){
   time = 0.0001 * Date.now();
    BoxDefaultMovement();
    if (matchesArray){
      newMesh.position.set(matchesArray)
    }
    controls.update();
    renderer.render(scene, camera)
    if (line){
      let LineArray = scene.children.filter(child => child.type == "Line");
      for (var i = 0, il = LineArray.length; i < il; i++) {
         LineArray[i].geometry.verticesNeedUpdate = true;
      }
    }
}

function createControls() {
    controls = new OrbitControls(camera, renderer.domElement);
}

function DisplayInfo(){
    let modal = document.getElementById("newcont")
    modal.classList.add("show");
    let close = document.getElementById("close");
    close.addEventListener("click", () => {
        modal.classList.remove("show");
    });
    let modal_name = document.getElementById("name");
    let modal_title = document.getElementById("title");
    let modal_desc = document.getElementById("desc");
    let modal_img = document.getElementById("modal-img");   
    let modal_narrative = document.getElementById("narrative");
    let modal_view = document.getElementById("view");
    modal_view.innerHTML = 'An Iyapo Repository manuscript';
    modal_title.innerHTML = 'Title : ' + INTERSECTED.userData.artid;
    modal_name.innerHTML = 'Author : ' + INTERSECTED.userData.aname;
    modal_narrative.innerHTML = 'Narrative: ' + INTERSECTED.userData.Narrative; 
    modal_desc.innerHTML = 'Description: '+ INTERSECTED.userData.artdes;
    modal_img.src = INTERSECTED.userData.manimg;

    if (INTERSECTED.userData.artid){
      modal_view.innerHTML = 'An Iyapo Repository artifact';
      modal_title.innerHTML = INTERSECTED.userData.artid;
      modal_name.innerHTML = INTERSECTED.userData.artname;
      modal_narrative.innerHTML = 'From: ' + INTERSECTED.userData.manid; 
      modal_desc.innerHTML = '';
    }

    if (INTERSECTED.userData.jpg){
      modal_img.src = INTERSECTED.userData.jpg
    }

}
function filterObjects() {
    //Narrative Buttons//
    const AllManuscripts = document.getElementById("all narratives");
    const ApocalypticFilter = document.getElementById("apocalyptic narratives");
    const UtopianFilter = document.getElementById("utopian narratives");
    const DystopianFilter = document.getElementById("dystopian narratives");
    const RevolutionaryFilter = document.getElementById("revolutionary narratives");
    const Unfiltered = document.getElementById("no narrative");
    //Domain Buttons//
    const AllDomainsFilter = document.getElementById("all domains");
    const PoliticsFilter  = document.getElementById("politics domain");
    const EnvironmentFilter = document.getElementById("environment domain");
    const SpaceTravelFilter  = document.getElementById("space travel domain");
    const EducationFilter = document.getElementById("education domain");
    const GameFilter = document.getElementById("game domain");
    const SecurityFilter = document.getElementById("security domain");
    const FashionFilter = document.getElementById("fashion domain");
    const FoodFilter = document.getElementById("food domain");
    const HealthFilter = document.getElementById("health domain");
    const MusicFilter = document.getElementById("music domain");
    const NoDomainFilter = document.getElementById("no domains");

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

init();

function onMouseClick(event) {
   event.preventDefault();
   mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
   mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
   raycaster.setFromCamera(mouse, camera);
   let sphere = scene.children.filter(child => child.type == "Mesh");
  let intersects = raycaster.intersectObjects(sphere);
  if (intersects.length > 0){
   if (INTERSECTED != intersects[0].object) {
       INTERSECTED = intersects[0].object;
       console.log(INTERSECTED.userData)
       DisplayInfo();
       renderer.setAnimationLoop(null);
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
filterObjects();


let currentText = document.getElementById('current');
const wrapper = document.getElementById('filterMenu');

wrapper.addEventListener('click', (event) => {
//   const isButton = event.target.nodeName === 'li';
//   if (!isButton) {
//     return;
//   }
// currentText.innerHTML = event.target.id
})

// const wrapper2 = document.getElementById('DomainMenu');

// wrapper2.addEventListener('click', (event) => {
//   const isButton = event.target.nodeName === 'BUTTON';
//   if (!isButton) {
//     return;
//   }
//   currentText.innerHTML = event.target.id
// })


let closeButton = document.getElementById('close') 
closeButton.addEventListener('click', () => {
   renderer.setAnimationLoop(() => {
         animate();
        renderer.render(scene, camera);
    });
})


