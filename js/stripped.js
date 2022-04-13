import * as THREE from "../libs/three.js/build/three.module.js";

import { TWEEN } from "../libs/three/examples/jsm/libs/tween.module.min.js";
import { GLTFLoader } from "../libs/three.js/src/jsm/loaders/GLTFLoader.js";
// var TWEEN = require("@tweenjs/tween.js");
import gui from "./components/gui.js";
import * as dat from "../libs/dat.gui/build/dat.gui.module.js";
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

import { EffectComposer } from "../libs/three.js/src/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "../libs/three.js/src/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "../libs/three.js/src/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "../libs/three.js/src/jsm/postprocessing/ShaderPass.js";

class Sketch {
  constructor() {
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
    this.composer = new EffectComposer(this.renderer);
    this.settings = {
      playhead: 0.001,
    };
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

    document.body.appendChild(this.renderer.domElement);
    // this.scene.add(new THREE.AmbientLight(0x404040));

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

    //发光
    const pointLight = new THREE.PointLight(0xffffff, 1);
    this.defaultCamera.add(pointLight);

    const params = {
      exposure: 1,
      bloomStrength: 1.5,
      bloomThreshold: 0,
      bloomRadius: 0,
    };
    const renderScene = new RenderPass(this.scene, this.defaultCamera);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5,
      0.4,
      0
    );
    bloomPass.threshold = params.bloomThreshold;
    bloomPass.strength = params.bloomStrength;
    bloomPass.radius = params.bloomRadius;
    this.composer.renderToScreen = false;
    this.composer.addPass(renderScene);
    this.composer.addPass(bloomPass);

    console.log(this.renderer);

    const gltfLoader2 = new GLTFLoader();
    gltfLoader2.load("./models/PrimaryIonDrive.glb", (gltf) => {
      this.stage2 = gltf.scene;
      this.stage2.position.x = 0;
      this.stage2.position.y = 0;
      this.scene.add(this.stage2);
      // let mixer = new THREE.AnimationMixer(this.stage2);
      // const clip = gltf.animations[0];
      // mixer.clipAction(clip.optimize()).play();

      // this.composer.render();
    });

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xffff00,
      linewidth: 60,
      linecap: "round", //ignored by WebGLRenderer
      linejoin: "round", //ignored by WebGLRenderer
    });
    const points = [];
    points.push(new THREE.Vector3(-10, 0, 0));
    points.push(new THREE.Vector3(0, 10, 0));
    points.push(new THREE.Vector3(10, 0, 0));

    // const lineGeo = new THREE.BufferGeometry().setFromPoints(points);

    // Create Tube Geometry
    const tubeGeometry = new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(points),
      3, // path segments
      0.1, // THICKNESS
      10, //Roundness of Tube
      false //closed
    );

    const line = new THREE.Line(tubeGeometry, lineMaterial);
    const line2 = new THREE.Line(tubeGeometry, lineMaterial);
    line2.position.z = 4;
    this.scene.add(line);
    this.scene.add(line2);

    //create refelction plane
    var groundGeo = new THREE.PlaneGeometry(10, 20, 4, 4);
    var groundMaterial = new THREE.MeshBasicMaterial({ color: 0xc0c0c0 });
    var groundMesh = new THREE.Mesh(groundGeo, groundMaterial);
    groundMesh.rotation.x = -Math.PI / 2;
    // groundMesh.position.x = -20;
    this.scene.add(groundMesh);

    //contorl bloom
    const ENTIRE_SCENE = 0,
      BLOOM_SCENE = 1;
    const bloomLayer = new THREE.Layers();
    bloomLayer.set(BLOOM_SCENE);

    // const gui = new GUI();

    // gui.add(params, "exposure", 0.1, 2).onChange(function (value) {
    //   this.renderer.toneMappingExposure = Math.pow(value, 4.0);
    // });

    // gui.add(params, "bloomThreshold", 0.0, 1.0).onChange(function (value) {
    //   bloomPass.threshold = Number(value);
    // });

    // gui.add(params, "bloomStrength", 0.0, 3.0).onChange(function (value) {
    //   bloomPass.strength = Number(value);
    // });

    // gui
    //   .add(params, "bloomRadius", 0.0, 1.0)
    //   .step(0.01)
    //   .onChange(function (value) {
    //     bloomPass.radius = Number(value);
    //   });

    // const delta = thisclock.getDelta();

    // mixer.update(delta);

    // stats.update();
    this.animator.animate(this.composer);
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
