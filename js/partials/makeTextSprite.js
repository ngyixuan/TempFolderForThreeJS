import * as THREE from "../../libs/three.js/build/three.module.js";
import { FontLoader } from "../../libs/three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "../../libs/three/examples/jsm/geometries/TextGeometry.js";

export default function makeTextSprite(message, parameters) {
  let textGeometry;
  let sprite;
  let fontLoader = new FontLoader();
  let material = new THREE.MeshStandardMaterial();
  material.roughness = 0.4;

  fontLoader.load(
    "./libs/three/examples/fonts/helvetiker_bold.typeface.json",
    function (font) {
      const textGeometry = new TextGeometry("Take Picture", {
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

      console.log(textGeometry);
      sprite = new THREE.Mesh(textGeometry, material);
      console.log(sprite);
    }
  );

  sprite = new THREE.Mesh(textGeometry, material);
}
