// import "./style.css";
import * as THREE from "../libs/three.js/build/three.module.js";
import { OrbitControls } from "../libs/three.js/src/jsm/controls/OrbitControls.js";
import { FontLoader } from "../libs/three/examples/jsm/loaders/FontLoader.js";
import * as dat from "../libs/dat.gui/build/dat.gui.module.js";
import { SpotLightHelper } from "../libs/three/src/helpers/SpotLightHelper.js";
import { TextGeometry } from "../libs/three.js/src/jsm/geometries/TextGeometry.js";
import { OBJLoader } from "../libs/three.js/src/jsm/loaders/OBJLoader.js";
// import { FBXLoader } from "../libs/three/examples/jsm/loaders/FBXLoader.js";
// import { DDSLoader } from "./libs/three.js/src/jsm/loaders/DDSLoader.js";
import { TweenLite } from "../libs/gsap/TweenLite.js";
import Annotations from "./partials/Annotations.js";
import DomEvents from "./partials/domevents.js";
/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Scene
const scene = new THREE.Scene();

// // Canvas
// const canvas = document.querySelector("canvas.webgl");

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0;
camera.position.y = 1;
camera.position.z = 5;

scene.add(camera);

/**
 * Renderer
 */
var renderer = new THREE.WebGLRenderer({});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);
/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.3);
scene.add(directionalLight);
directionalLight.position.set(1, 0.25, 0);
const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.5);
scene.add(hemisphereLight);

const pointLight = new THREE.PointLight(0xff9000, 0.5, 4);
pointLight.position.x = 1;
pointLight.position.y = -0.5;
pointLight.position.z = 1;
scene.add(pointLight);

const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1);
scene.add(rectAreaLight);
rectAreaLight.position.set(-1.5, 0, 1.5);
rectAreaLight.lookAt(new THREE.Vector3());

const spotLight = new THREE.SpotLight(
  0x78ff00,
  0.5,
  10,
  Math.PI * 0.1,
  0.25,
  1
);
spotLight.position.set(0, 3, 1);
scene.add(spotLight);
scene.add(spotLight.target);

gui
  .add(ambientLight, "intensity")
  .max(1)
  .min(0)
  .step(0.0001)
  .name("amb_intensity");
gui
  .add(directionalLight, "intensity")
  .max(1)
  .min(0)
  .step(0.0001)
  .name("dir_intensity");
gui
  .add(hemisphereLight, "intensity")
  .max(1)
  .min(0)
  .step(0.0001)
  .name("hemi_intensity");
gui
  .add(pointLight, "intensity")
  .max(1)
  .min(0)
  .step(0.0001)
  .name("point_intensity");
gui
  .add(rectAreaLight, "intensity")
  .max(10)
  .min(0)
  .step(0.0001)
  .name("rectarea_intensity");
gui
  .add(spotLight, "intensity")
  .max(1)
  .min(0)
  .step(0.0001)
  .name("spotLight_intensity");
gui
  .add(spotLight.target.position, "x")
  .max(2)
  .min(-2)
  .step(0.0001)
  .name("move_spotLight");

/**
 * 3d menu
 */

/**
 *Annotations
 */

let domEvents, annotationsGroup;

domEvents = new DomEvents.DomEvents(camera, renderer.domElement);
annotationsGroup = new THREE.Group();
let hovering = 0;
const annotations = new Annotations("puidu-webgl-output");
const canvasContainer = document.getElementById("puidu-webgl-output");
annotations.createTHREEAnnotations(annotationsGroup);
scene.add(annotationsGroup);
annotationsGroup.children.forEach((sprite) => {
  let toggle = false;
  let initialScale = sprite.scale.x;
  domEvents.addEventListener(sprite, "mouseover", function (event) {
    event.stopPropagation();
    hovering++;
    canvasContainer.style.cursor = "pointer";
    console.log("clicked");

    sprite.scale.x = sprite.scale.y = sprite.scale.z = initialScale * 1.5;
  });
  domEvents.addEventListener(sprite, "mouseout", function (event) {
    event.stopPropagation();
    if (hovering === 1) {
      canvasContainer.style.cursor = "default";
    }
    hovering--;
    sprite.scale.x = sprite.scale.y = sprite.scale.z = initialScale;
  });
  domEvents.addEventListener(sprite, "click", function (e) {
    console.log(e);
    sprite.callback();
    console.log(sprite.callback());
    // console.log(annotation.number);

    if (!toggle && sprite.callback() == 1) {
      toggle = true;
      scene.add(takePicMesh);
    } else if (toggle && sprite.callback() == 1) {
      scene.remove(takePicMesh);
      toggle = false;
    }
    // console.log("true");
  });
});

var video;
video = document.getElementById("video");
const takePicPlanetexture = new THREE.VideoTexture(video);
takePicPlanetexture.minFilter = THREE.LinearFilter;
takePicPlanetexture.magFilter = THREE.LinearFilter;
takePicPlanetexture.format = THREE.RGBFormat;

const takePicPlaneGeo = new THREE.PlaneBufferGeometry(4, 3);
const takePicPlanematerial = new THREE.MeshBasicMaterial({
  map: takePicPlanetexture,
  // side: THREE.DoubleSide,
});

const takePicMesh = new THREE.Mesh(takePicPlaneGeo, takePicPlanematerial);
takePicMesh.position.x = -6;
takePicMesh.rotation.x = 0.5;
takePicMesh.rotation.y = 0.7;
takePicMesh.rotation.z = -0.3;
takePicMesh.position.y = 1;
takePicMesh.position.z = -2;

initWebcamInput();
function initWebcamInput() {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      video.srcObject = stream;
      video.play();
    });
  }
}
/**
 * Objects
 */
/**
 * helper
//  */
// const hLHelper = new THREE.HemisphereLightHelper()
// scene.add(hLHelper)

// Material
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.4;
gui.add(material, "roughness").max(1).min(0).step(0.001);
gui.add(material, "metalness").max(1).min(0).step(0.001);

// Objects
const sphere = new THREE.Mesh(
  new THREE.SphereBufferGeometry(0.5, 32, 32),
  material
);
sphere.position.x = -1.5;

const cube = new THREE.Mesh(
  new THREE.BoxBufferGeometry(0.75, 0.75, 0.75),
  material
);

const torus = new THREE.Mesh(
  new THREE.TorusBufferGeometry(0.3, 0.2, 32, 64),
  material
);
torus.position.x = 1.5;

const plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(15, 15), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.65;

scene.add(sphere, cube, torus, plane);

var gFont;
const fontLoader = new FontLoader();
fontLoader.load(
  "./libs/three.js/src/fonts/helvetiker_bold.typeface.json",
  function (font) {
    gFont = font;
    const textGeometery = new TextGeometry("NFT ID Card", {
      font: font,
      size: 0.5,
      height: 0.2,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 5,
    });
    textGeometery.center();
    const text = new THREE.Mesh(textGeometery, material);
    text.position.y = 1;
    scene.add(text);
  }
);

/**
 * 模型
 */
// const url = "../models/swordCard.fbx";
// const fbxloader = new THREE.FBXLoader();
// fbxloader.load(url, function (loadedModel) {
//   const textureLoader = new THREE.TextureLoader();
//   //  const textureUrl = "../model/fbx/beats耳机/textures/beats_red.png";
//   //  const textureNormal = textureLoader.load(textureUrl);
//   mesh = loadedModel.children[0].clone();
//   //  mesh.material.map = textureNormal;
//   //  mesh.material.shininess = 15;
//   //  console.log(loadedModel.children[0]);
//   scene.add(mesh);
// });
window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.update();

/**
 * Animate
 */

// videoTexture.needsUpdate = true;
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  sphere.rotation.y = 0.1 * elapsedTime;
  cube.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;
  cube.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  //update canvas
  // var canvas_context = canvas.getContext("2d");
  // canvas_context.drawImage(video, 0, 0, 320, 240);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
