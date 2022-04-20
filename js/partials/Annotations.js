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

  createTHREEAnnotations(scene) {
    annotations.forEach((annotation) => {
      let material = new THREE.MeshStandardMaterial({
        color: 0xff9292,
      });
      material.roughness = 0.4;

      const sprite = new THREE.Mesh(
        new THREE.BoxBufferGeometry(0.5, 0.1, 0.8),
        material
      );

      scene.add(sprite);

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
