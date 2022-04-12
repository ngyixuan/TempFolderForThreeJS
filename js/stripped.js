import * as THREE from "../libs/three.js/build/three.module.js";
// import * as TWEEN from "../libs/tween.js";
// import * as TWEEN from "../node_modules/@tweenjs/tween.js/dist/tween.amd.js";
// import * as TWEEN from "../node_modules/@tweenjs/tween.js/tween.amd.js";
// import * as TWEEN from "../node_modules/@tweenjs/tween.js/tween.amd.js";
// import * as TWEEN from "../node_modules/@tweenjs/tween.js/tween.amd.js";
import { TWEEN } from "../libs/three/examples/jsm/libs/tween.module.min.js";
import { GLTFLoader } from "../libs/three.js/src/jsm/loaders/GLTFLoader.js";
// var TWEEN = require("@tweenjs/tween.js");
import gui from "./components/gui.js";
import Scene from "./components/scene.js";
import Renderer from "./components/renderer.js";
import Controls from "./components/controls.js";
import Camera from "./components/camera.js";
import Lights from "./components/lights.js";
import Events from "./components/events.js";
import Animator from "./components/animator.js";
import { Object3D } from "../libs/three.js/src/core/Object3D.js";

import { TweenLite } from "../libs/gsap/TweenLite.js";
import Annotations from "./partials/Annotations.js";
import DomEvents from "./partials/domevents.js";

class Sketch {
  constructor() {
    this.gui = gui;
    this.animator = new Animator(this);
    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    this.scene = new Scene(this);
    this.renderer = new Renderer(this);
    this.defaultCamera = new Camera(this);
    this.lights = new Lights(this);
    this.controls = new Controls(this);
    // controls.target = new THREE.Vector3(0, 0, 0)
    this.events = new Events(this);
    this.clock = new THREE.Clock();
    this.clock.start();
    this.activeCamera = this.defaultCamera;

    this.settings = {
      playhead: 0.001,
    };
    // this.gui.add(this.settings, "playhead", 0.001, 1, 0.001);
  }
  init() {
    const gltfLoader = new GLTFLoader();
    gltfLoader.load("./models/scene.gltf", (gltf) => {
      // this.defaultCamera.position.x = 2;
      // console.log(this.defaultCamera);
      // STAGE
      this.stage = gltf.scene;
      this.stage.position.x = 0;
      this.stage.rotation.y = 90;
      this.scene.add(this.stage);
    });

    console.log(this.defaultCamera);

    document.getElementById("main").appendChild(this.renderer.domElement);

    let domEvents, annotationsGroup;

    domEvents = new DomEvents.DomEvents(
      this.defaultCamera,
      this.renderer.domElement
    );
    annotationsGroup = new THREE.Group();
    let hovering = 0;
    const annotations = new Annotations("main");
    const canvasContainer = document.getElementById("main");
    annotations.createTHREEAnnotations(annotationsGroup);
    this.scene.add(annotationsGroup);
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
      });
    });

    this.animator.animate();
  }

  animateCamera(sketch) {
    let that = this;
    let angel = Math.PI / 5;
    let newPos = {
      x: 2,
      y: 1,
      z: 2,
    };
    console.log(sketch.defaultCamera);
    let oldCameraPosition = sketch.defaultCamera.position;
    // let oldCameraPosition = {
    //   x: sketch.defaultCamera.position.x + Math.cos(angel) * 10,
    //   y: sketch.defaultCamera.position.y,
    //   z: sketch.defaultCamera.position.z + Math.sin(angel) * 10,
    // };
    console.log(oldCameraPosition);

    let tween1 = new TWEEN.Tween(oldCameraPosition).to(newPos, 3000);
    tween1.start();
    tween1.onComplete(function () {
      console.log("tween--finish");
    });

    // let tween = new TWEEN.Tween({
    //   phi: sketch.controls.getPolarAngle(),
    //   theta: sketch.controls.getAzimuthalAngle(),
    // }).to({ phi: Math.PI / 2, theta: Math.PI / 2 }, 3000);
    // tween.easing(TWEEN.Easing.Cubic.InOut);
    // tween.onUpdate(function () {
    //   sketch.controls.setAngle(this.phi, this.theta);
    // });

    // sketch.defaultCamera.lookAt(sketch.stage);
    // console.log(oldCameraPosition);

    // console.log(tween1);
    // tween1.onUpdate(function () {
    //   sketch.defaultCamera.position.x = pos.x;
    //   // oldCameraPosition.position.y = 6;
    //   // oldCameraPosition.position.z = 0;
    //   console.log(sketch.defaultCamera.position.x);
    // }, 3000);
    // console.log(newPos);

    // tween1.easing(TWEEN.Easing.Sinusoidal.InOut);
    // console.log(tween1);

    // console.log(tween1);
    // TWEEN.update();
    // tween1.onComplete(function () {
    //   console.log("tween--finish");
    // });
  }
}

export default Sketch;
