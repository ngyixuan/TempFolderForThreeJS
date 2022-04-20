// import "./style.css";
import * as THREE from "../libs/three.js/build/three.module.js";
import { OrbitControls } from "../libs/three.js/src/jsm/controls/OrbitControls.js";
import { FontLoader } from "../libs/three/examples/jsm/loaders/FontLoader.js";
import * as dat from "../libs/dat.gui/build/dat.gui.module.js";
import { SpotLightHelper } from "../libs/three/src/helpers/SpotLightHelper.js";
import { RectAreaLightUniformsLib } from "../libs/three.js/src/jsm/lights/RectAreaLightUniformsLib.js";
import { TextGeometry } from "../libs/three.js/src/jsm/geometries/TextGeometry.js";
import { OBJLoader } from "../libs/three.js/src/jsm/loaders/OBJLoader.js";
import { FBXLoader } from "../libs/three.js/src/jsm/loaders/FBXLoader.js";
// import { DDSLoader } from "./libs/three.js/src/jsm/loaders/DDSLoader.js";
import { TweenLite } from "../libs/gsap/TweenLite.js";
import Annotations from "./partials/Annotations.js";
import DomEvents from "./partials/domevents.js";
// import SceneHinge from "./SceneHinge.js";

import MenuHinge from "./MenuHinge.js";
import * as CANNON from "../node_modules/cannon-es/dist/cannon-es.js";
import CannonDebugRenderer from "./utils/CannonDebugRenderer.js";
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
pointLight.position.x = 3;
pointLight.position.y = 2;
pointLight.position.z = -0.5;
scene.add(pointLight);

const pointLight2 = new THREE.PointLight(0xff9000, 0.5, 4);
pointLight2.position.x = 3;
pointLight2.position.y = 1;
pointLight2.position.z = 2;
scene.add(pointLight2);

const pointLight3 = new THREE.PointLight(0xff9000, 0.5, 4);
pointLight3.position.x = -3;
pointLight3.position.y = 1;
pointLight3.position.z = 2;
scene.add(pointLight3);

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

// const rectAreaLight2 = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1);
// scene.add(rectAreaLight2);
// rectAreaLight2.position.set(-3, 1, 1.5);

const spotLight2 = new THREE.SpotLight(
  0x78ff00,
  0.5,
  10,
  Math.PI * 0.1,
  0.25,
  1
);
spotLight2.position.set(-1, 0, -1);
scene.add(spotLight2);

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
// gui
//   .add(spotLight2.target.position, "y")
//   .max(2)
//   .min(-2)
//   .step(0.0001)
//   .name("move_spotLight2");

/**
 * 3d menu
 */
var $stage = document.getElementById("puidu-webgl-output");
var world = new CANNON.World();
world.gravity.set(0, -10, 0);
var menu = new MenuHinge(scene, world, camera);

// const aspect = window.innerWidth / window.innerHeight;

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

    if (sprite.callback() == 1) {
      scene.add(takePicMesh);
      initWebcamInput();
    } else if (sprite.callback() == 2) {
      stopWebcamInput();
    } else if (sprite.callback() == 3) {
      scene.remove(takePicMesh);
      getPixelGenerator();
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

const takePicPlaneGeo = new THREE.PlaneBufferGeometry(2, 2.3);
const takePicPlanematerial = new THREE.MeshBasicMaterial({
  map: takePicPlanetexture,
  // side: THREE.DoubleSide,
});

const takePicMesh = new THREE.Mesh(takePicPlaneGeo, takePicPlanematerial);

var takePicMeshPos = {
  takePicMeshPositionX: 0,
  takePicMeshPositionY: 1.4,
  takePicMeshPositionZ: -4.4,
};
takePicMesh.position.set(
  takePicMeshPos.takePicMeshPositionX,
  takePicMeshPos.takePicMeshPositionY,
  takePicMeshPos.takePicMeshPositionZ
);

gui.add(takePicMeshPos, "takePicMeshPositionX", -5, 5);
gui.add(takePicMeshPos, "takePicMeshPositionY", -5, 5);
gui.add(takePicMeshPos, "takePicMeshPositionZ", -5, 5);

initWebcamInput();
function initWebcamInput() {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      video.srcObject = stream;
      video.play();
    });
  }
}
function stopWebcamInput() {
  video.pause();
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
  "./libs/three.js/src/fonts/TsangerYuYangT_W02_Regular.json",
  function (font) {
    gFont = font;
    const textGeometery = new TextGeometry("元宇宙通行证", {
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
 * show metaverse card pixel
 */

//将texture加载到精灵图片
var cardSpriteTexture;
function getTexture() {
  var ran = Math.floor(Math.random() * 3);
  cardSpriteTexture = new THREE.TextureLoader().load(
    "../../../pixelArt_Generator-main/myChar/newMergeChar1+1+2+1.png"
  );
  return cardSpriteTexture;
}
//cardsprite
const cardProfileGeo = new THREE.PlaneBufferGeometry(1.9, 2.3);
const cardProfilematerial = new THREE.MeshBasicMaterial({
  map: getTexture(),
  side: THREE.DoubleSide,
});

const cardProfile = new THREE.Mesh(cardProfileGeo, cardProfilematerial);
var cardProfilePos = {
  cardProfilePosX: 0,
  cardProfilePosY: 1.4,
  cardProfilePosZ: -4.4,
};
cardProfile.position.set(
  cardProfilePos.cardProfilePosX,
  cardProfilePos.cardProfilePosY,
  cardProfilePos.cardProfilePosZ
);

gui.add(cardProfilePos, "cardProfilePosX", -5, 5);
gui.add(cardProfilePos, "cardProfilePosY", -5, 5);
gui.add(cardProfilePos, "cardProfilePosZ", -5, 5);
function getPixelGenerator() {
  scene.add(cardProfile);
}

/**
 * 模型
 */
//卡片1
const manager = new THREE.LoadingManager(loadModel); //加载进度和出错情况
manager.onProgress = function (item, loaded, total) {
  console.log(item, loaded, total);
};
loadFBX(manager);
function loadFBX(manager) {
  var loader = new FBXLoader(manager).load(
    "./models/card1.fbx",
    function (fbx) {
      objectFBX = fbx;
    },
    onProgress,
    onError
  );
}

var objectFBX;
function loadModel() {
  objectFBX.position.set(-3.9, 1.1, -5);

  objectFBX.scale.set(0.01, 0.01, 0.01);
  scene.add(objectFBX);

  scene.add(spotLight2.target);
  spotLight2.lookAt(objectFBX);

  var objectFBXPos = {
    positionX: -3.9,
    positionY: 1.1,
    positionZ: -5,
  };
  objectFBX.position.set(
    objectFBXPos.positionX,
    objectFBXPos.positionY,
    objectFBXPos.positionZ
  );

  gui.add(objectFBXPos, "positionX", -5, 5);
  gui.add(objectFBXPos, "positionY", -5, 5);
  gui.add(objectFBXPos, "positionZ", -5, 5);

  // videoTexture.needsUpdate = true;
  const clock = new THREE.Clock();
  var pos = 0;
  const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Update objects
    pos += 0.005;
    objectFBX.rotation.y = 25 + Math.abs(Math.sin(pos) * -1);
    objectFBX.position.set(
      objectFBXPos.positionX,
      objectFBXPos.positionY,
      objectFBXPos.positionZ
    );

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
  };

  tick();
}

//卡片2
const manager2 = new THREE.LoadingManager(loadModel2); //加载进度和出错情况
manager2.onProgress = function (item, loaded, total) {
  console.log(item, loaded, total);
};
loadFBX2(manager2);
function loadFBX2(manager2) {
  var loader = new FBXLoader(manager2).load(
    "./models/card2.fbx",
    function (fbx2) {
      objectFBX2 = fbx2;
    },
    onProgress,
    onError
  );
}
var objectFBX2;
function loadModel2() {
  objectFBX2.position.set(-5, 1.1, -2.2);
  objectFBX2.scale.set(0.01, 0.01, 0.01);
  scene.add(objectFBX2);

  var objectFBXPos2 = {
    positionX: -5,
    positionY: 1.1,
    positionZ: -2.2,
  };
  objectFBX2.position.set(
    objectFBXPos2.positionX,
    objectFBXPos2.positionY,
    objectFBXPos2.positionZ
  );

  gui.add(objectFBXPos2, "positionX", -5, 5);
  gui.add(objectFBXPos2, "positionY", -5, 5);
  gui.add(objectFBXPos2, "positionZ", -5, 5);

  // videoTexture.needsUpdate = true;
  const clock = new THREE.Clock();
  var pos2 = 0;
  const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Update objects
    pos2 += 0.005;
    objectFBX2.rotation.y = Math.abs(Math.sin(pos2) * -1);
    objectFBX2.position.set(
      objectFBXPos2.positionX,
      objectFBXPos2.positionY,
      objectFBXPos2.positionZ
    );

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
  };

  tick();
}

//卡片3
const manager3 = new THREE.LoadingManager(loadModel3); //加载进度和出错情况
manager3.onProgress = function (item, loaded, total) {
  console.log(item, loaded, total);
};
loadFBX3(manager3);
function loadFBX3(manager3) {
  var loader = new FBXLoader(manager3).load(
    "./models/card3.fbx",
    function (fbx3) {
      objectFBX3 = fbx3;
    },
    onProgress,
    onError
  );
}
var objectFBX3;
function loadModel3() {
  objectFBX3.position.set(5, 1.1, -2.2);
  objectFBX3.scale.set(0.01, 0.01, 0.01);
  scene.add(objectFBX3);

  var objectFBXPos3 = {
    positionX: 5,
    positionY: 1.1,
    positionZ: -2.2,
  };
  objectFBX3.position.set(
    objectFBXPos3.positionX,
    objectFBXPos3.positionY,
    objectFBXPos3.positionZ
  );

  gui.add(objectFBXPos3, "positionX", -5, 5);
  gui.add(objectFBXPos3, "positionY", -5, 5);
  gui.add(objectFBXPos3, "positionZ", -5, 5);

  // videoTexture.needsUpdate = true;
  const clock = new THREE.Clock();
  var pos3 = 0;
  const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Update objects
    pos3 += 0.004;
    objectFBX3.rotation.y = Math.abs(Math.cos(pos3) * -1) - 26.1;
    objectFBX3.position.set(
      objectFBXPos3.positionX,
      objectFBXPos3.positionY,
      objectFBXPos3.positionZ
    );

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
  };

  tick();
}

//卡片4
const manager4 = new THREE.LoadingManager(loadModel4); //加载进度和出错情况
manager4.onProgress = function (item, loaded, total) {
  console.log(item, loaded, total);
};
loadFBX4(manager4);
function loadFBX4(manager4) {
  var loader = new FBXLoader(manager4).load(
    "./models/card4.fbx",
    function (fbx4) {
      objectFBX4 = fbx4;
    },
    onProgress,
    onError
  );
}
var objectFBX4;
function loadModel4() {
  objectFBX4.position.set(5, 1.1, -2.5);
  objectFBX4.scale.set(0.01, 0.01, 0.01);
  scene.add(objectFBX4);

  var objectFBXPos4 = {
    positionX: 3.6,
    positionY: 1.1,
    positionZ: -5,
  };
  objectFBX4.position.set(
    objectFBXPos4.positionX,
    objectFBXPos4.positionY,
    objectFBXPos4.positionZ
  );

  gui.add(objectFBXPos4, "positionX", -5, 5);
  gui.add(objectFBXPos4, "positionY", -5, 5);
  gui.add(objectFBXPos4, "positionZ", -5, 5);

  // videoTexture.needsUpdate = true;
  const clock = new THREE.Clock();
  var pos4 = 0;
  const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Update objects
    pos4 += 0.004;
    objectFBX4.rotation.y = Math.abs(Math.cos(pos4) * -1) - 26.1;
    objectFBX4.position.set(
      objectFBXPos4.positionX,
      objectFBXPos4.positionY,
      objectFBXPos4.positionZ
    );

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
  };

  tick();
}

//卡片5
const manager5 = new THREE.LoadingManager(loadModel5); //加载进度和出错情况
manager5.onProgress = function (item, loaded, total) {
  console.log(item, loaded, total);
};
loadFBX5(manager5);
function loadFBX5(manager5) {
  var loader = new FBXLoader(manager5).load(
    "./models/card5.fbx",
    function (fbx5) {
      objectFBX5 = fbx5;
    },
    onProgress,
    onError
  );
}
var objectFBX5;
function loadModel5() {
  objectFBX5.position.set(0, 1.1, -5);
  objectFBX5.scale.set(0.01, 0.01, 0.01);
  scene.add(objectFBX5);

  var objectFBXPos5 = {
    positionX: 0,
    positionY: 1.1,
    positionZ: -5,
  };
  objectFBX5.position.set(
    objectFBXPos5.positionX,
    objectFBXPos5.positionY,
    objectFBXPos5.positionZ
  );

  gui.add(objectFBXPos5, "positionX", -5, 5);
  gui.add(objectFBXPos5, "positionY", -5, 5);
  gui.add(objectFBXPos5, "positionZ", -5, 5);

  const tick = () => {
    objectFBX5.position.set(
      objectFBXPos5.positionX,
      objectFBXPos5.positionY,
      objectFBXPos5.positionZ
    );

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
  };
  tick();
}

//加载进度
function onProgress(xhr) {
  if (xhr.lengthComputable) {
    const percentComplete = (xhr.loaded / xhr.total) * 100;
    console.log("model" + Math.round(percentComplete, 2) + "% downloaded");
  }
}

function onError() {}

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

  takePicMesh.position.set(
    takePicMeshPos.takePicMeshPositionX,
    takePicMeshPos.takePicMeshPositionY,
    takePicMeshPos.takePicMeshPositionZ
  );

  cardProfile.position.set(
    cardProfilePos.cardProfilePosX,
    cardProfilePos.cardProfilePosY,
    cardProfilePos.cardProfilePosZ
  );

  // Update controls
  controls.update();

  menu.update();

  world.step(1 / 60);
  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
