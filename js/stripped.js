import * as THREE from "../libs/three.js/build/three.module.js";
// import * as TWEEN from "../libs/TweenJS-1.0.0/lib/tweenjs.js";
import { GLTFLoader } from "../libs/three.js/src/jsm/loaders/GLTFLoader.js";

import gui from "./components/gui.js";
import Scene from "./components/scene.js";
import Renderer from "./components/renderer.js";
import Controls from "./components/controls.js";
import Camera from "./components/camera.js";
import Lights from "./components/lights.js";
import Events from "./components/events.js";
import Animator from "./components/animator.js";
import { Object3D } from "../libs/three.js/src/core/Object3D.js";

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
      // STAGE
      this.stage = gltf.scene;
      this.stage.position.x = 0;
      this.stage.rotation.y = 90;
      this.scene.add(this.stage);
    });

    document.getElementById("main").appendChild(this.renderer.domElement);

    this.animator.animate();
  }
  addObjects() {
    console.log("clicked");
    const target = new Object3D();
    let position = {
      x: (target.position.x = 0),
      y: (target.position.y = 2),
    };
    // target.position.x = 0;
    // target.position.y = 2;
    this.scene.add(target);
    // this.defaultCamera.lookAt(target.position);
    let tween = new TWEEN.Tween(this.defaultCamera.position).to(
      target.position,
      3000
    );
    tween.start();

    // this.animator.animate();
    // let tween1 = new TWEEN.Tween(this.controls.target).to(target.position, 3000)

    // SET UP CURVE FOR CAMERA TO FOLLOW
    // const bezier = new THREE.CubicBezierCurve3(
    //   new THREE.Vector3(-0.5, 0.55, 0),
    //   new THREE.Vector3(-0.5, 0.1, 0),
    //   new THREE.Vector3(-0.45, 0.1, 0),
    //   new THREE.Vector3(0, 0.1, 0)
    // );

    // // SET UP TARGET
    // const target = new Object3D();
    // target.position.x = 45;
    // target.position.y = 30;
    // this.scene.add(target);

    // target = this.stage;
    // target.position = this.stage.position;
    // this.scene.add(target);

    // this.animator.add(() => {
    //   const playhead = this.settings.playhead;

    // UPDATE TARGET
    // target.position.x = Math.sqrt(playhead) - 0.5;

    // UPDATE CAMERA
    // this.defaultCamera.lookAt(stage.position);
    // const pos = bezier.getPoint(playhead);
    // this.defaultCamera.position.set(pos.x, pos.y, pos.z);
    // });
  }
}

export default Sketch;
