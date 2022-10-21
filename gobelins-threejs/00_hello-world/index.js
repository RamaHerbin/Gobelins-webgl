import * as THREE from "../__common/libs/three.module";
import * as dat from "../__common/libs/dat.gui.min.js";
import OrbitControls from "../__common/libs/orbitcontrols";

import Engine from "../__common/engine";
import Cone from "./Cone";

import vertexShader from "./basic.vert";
import fragShader from "./basic.frag";


import vertexParticulesShader from "./particules.vert";
import fragParticulesShader from "./particules.frag";

let scene = null;
let camera = null;
let cube = null;
let gui = null;
let fSettings = null;
let material = null;
let customMaterial = null;
let time = 0;

// Pour nous faciliter la vie : s'occupe du resize de la window auto
// et de creer notre THREE.WebGLRenderer
const engine = new Engine();

function setup() {
  // On a besoin d'une scene
  scene = new THREE.Scene();

  // Et d'une camera
  camera = new THREE.PerspectiveCamera(
    50,
    engine.width / engine.height,
    0.1,
    1000
  );
  camera.position.z = 10;
  new OrbitControls(camera, engine.renderer.domElement);
}

function createGUI() {
  gui = new dat.GUI();

  fSettings = gui.addFolder("Settings");
  fSettings.open();
}

function setupScene() {
  const ambient = new THREE.AmbientLight(0xaafff0);
  scene.add(ambient);

  const lightBehind = new THREE.PointLight(0xff00ff, 1);
  lightBehind.position.x = 5;
  lightBehind.position.y = 5;
  lightBehind.position.z = -5;

  scene.add(lightBehind);
  scene.add(new THREE.PointLightHelper(lightBehind, 0.2));

  const lightFront = new THREE.PointLight(0x00ffff, 0.5);
  lightFront.position.x = -5;
  lightFront.position.y = -5;
  lightFront.position.z = 5;

  scene.add(lightFront);
  scene.add(new THREE.PointLightHelper(lightFront, 0.2));
}

function createMesh() {
  // Et si on veut voir quelque chose on aura aussi besoin
  // d'ajouter un Mesh (fait d'une geometry et d'un material)
  // a notre scene.
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  material = new THREE.MeshPhysicalMaterial({
    color: 0x444444,
    metalness: 0.1,
    roughness: 0.5,
  });
  cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  //   GUI
  const fMaterial = fSettings.addFolder("Material");
  fMaterial.add(material, "metalness", 0, 1, 0.01);
  fMaterial.add(material, "roughness", 0, 1, 0.01);
  fMaterial.add(material, "reflectivity", 0, 1, 0.01);
  fMaterial.open();
}

let countCones = 4;
let cones = [];

function createCones() {
  for (let i = 0; i < countCones; i++) {
    const cone = new Cone(cube, material);
    scene.add(cone);
    const box = new THREE.BoxHelper(cone);
    scene.add(box);

    cones.push(cone);
  }
}
let materialNew;
function createSphereCustomMat() {
  const geometry = new THREE.SphereGeometry(1.4, 32, 32);

  materialNew = new THREE.RawShaderMaterial({
    uniforms: {
      uTime: { value: time },
      uColor: { value: new THREE.Color(0xff00ff) },
      uStrengh: {value: 10},
      uScale: {value : 10}
    },
    vertexShader: vertexShader,
    fragmentShader: fragShader,
    transparent: true,
  });

  const sphere = new THREE.Mesh(geometry, materialNew);
  scene.add(sphere);

  const fCustom = fSettings.addFolder('Custom');
  fCustom.add(materialNew.uniforms.uStrengh, 'value', 0.1, 10., .2);
  fCustom.add(materialNew.uniforms.uScale, 'value', 0.1, 10., .2);
  fCustom.open();

}

function createParticules() {
  // geometry
  // material
  const nbParticles = 10000;
  const vertices = [];
  const colors = [];
  const randoms = [];

  for (let i = 0; i < nbParticles; i++) {
    // Position x y z 
    const x = Math.random() * 100 - 50;
    const y = Math.random() * 100 - 50;
    const z = Math.random() * 100 - 50;
    vertices.push(x, y, z);

    const r = Math.random() * 1
    const g = Math.random() * 1
    const b = Math.random() * 1
    colors.push(r,g,b);

    randoms.push(Math.random());
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.setAttribute('random', new THREE.Float32BufferAttribute(randoms, 1));

  // const material = new THREE.PointsMaterial({
  //   color: Math.random() * 0xffffff
  // }) 

  customMaterial = new THREE.RawShaderMaterial({
    uniforms: {
      uTime: {value: 0}
    },
    vertexShader: vertexParticulesShader,
    fragmentShader: fragParticulesShader,
  })

  const points = new THREE.Points(geometry, customMaterial);
  scene.add(points);
}

setup();
createGUI();
setupScene();
createMesh();
// createCones();
createSphereCustomMat();
createParticules();

function render() {
  // Update ce qu'il faut
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  time += 0.01;
  materialNew.uniforms.uTime.value = time;
  customMaterial.uniforms.uTime.value = time;

  // for (const cone of cones) {
  //   cone._updatePosition();
  // }

  // Render la scene
  engine.renderer.render(scene, camera);
}

// Notre frame loop
function onFrame() {
  requestAnimationFrame(onFrame);
  render();
}

onFrame();
