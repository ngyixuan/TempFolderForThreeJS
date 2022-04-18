// import * as THREE from 'three';
import * as THREE from "../../libs/three.js/build/three.module.js";
import { FontLoader } from "../../libs/three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "../../libs/three/examples/jsm/geometries/TextGeometry.js";
import makeTextSprite from "./makeTextSprite.js";
import {
  annotationCallback,
  annotationStyle3D,
  annotations,
} from "./config.js";

export default class Annotations {
  constructor(canvasContainerId) {
    this.canvasContainer = document.getElementById("main");
  }

  // makeTextSprite() {
  //   var gFont, sprite;
  //   var fontLoader = new FontLoader();
  //   var material = new THREE.MeshStandardMaterial();
  //   fontLoader.load(
  //     "../../libs/three.js/src/fonts/helvetiker_bold.typeface.json",
  //     function (font) {
  //       gFont = font;
  //       const textGeometery = new TextGeometry("Take Picture", {
  //         font: font,
  //         size: 0.5,
  //         height: 0.2,
  //         curveSegments: 12,
  //         bevelEnabled: true,
  //         bevelThickness: 0.03,
  //         bevelSize: 0.02,
  //         bevelOffset: 0,
  //         bevelSegments: 5,
  //       });

  //       sprite = new THREE.Mesh(textGeometery, material);
  //     }
  //   );
  // }

  createTHREEAnnotations(scene) {
    annotations.forEach((annotation) => {
      let material = new THREE.MeshStandardMaterial();
      material.roughness = 0.4;

      const sprite = new THREE.Mesh(
        new THREE.SphereBufferGeometry(0.5, 32, 32),
        material
      );

      scene.add(sprite);

      // var material = new THREE.MeshStandardMaterial();
      // material.roughness = 0.4;

      // var gFont, sprite;
      // const fontLoader = new FontLoader();
      // fontLoader.load(
      //   "./libs/three.js/src/fonts/helvetiker_bold.typeface.json",
      //   function (font) {
      //     gFont = font;
      //     const textGeometery = new TextGeometry("NFT ID Card", {
      //       font: font,
      //       size: 0.5,
      //       height: 0.2,
      //       curveSegments: 12,
      //       bevelEnabled: true,
      //       bevelThickness: 0.03,
      //       bevelSize: 0.02,
      //       bevelOffset: 0,
      //       bevelSegments: 5,
      //     });
      //     textGeometery.center();
      //     sprite = new THREE.Mesh(textGeometery, material);
      //     // sprite.position.y = 1;
      //     // sprite.position.set(
      //     //   annotation.position.x,
      //     //   annotation.position.y,
      //     //   annotation.position.z
      //     // );

      //     // sprite.callback = () => {
      //     //   annotationCallback(annotation.number, annotation.link);
      //     //   return annotation.number;
      //     // };
      //     scene.add(sprite);
      //   }
      // );

      sprite.position.set(
        annotation.position.x,
        annotation.position.y,
        annotation.position.z
      );
      sprite.callback = () => {
        annotationCallback(annotation.number, annotation.link);
        return annotation.number;
      };

      // sprite.renderOrder = 1000 + i;
    });
  }

  updatePosition(camera) {
    const self = this;
    annotations.forEach(function (annotation) {
      const vector = annotation.position.clone();
      vector.project(camera);
      const x = Math.round(
        (0.5 + vector.x / 2) *
          (self.canvasContainer.offsetWidth / window.devicePixelRatio)
      );
      const y = Math.round(
        (0.5 - vector.y / 2) *
          (self.canvasContainer.offsetHeight / window.devicePixelRatio)
      );
      const a = document.querySelector(
        `[data-annotation='${annotation.number}']`
      );
      a.style.transform = `translate(${x}px,${y}px)`;
      // a.style.left = `${x}px`;
    });
  }
}
