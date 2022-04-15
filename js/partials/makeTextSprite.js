import * as THREE from "../../libs/three.js/build/three.module.js";
import { FontLoader } from "../../libs/three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "../../libs/three/examples/jsm/geometries/TextGeometry.js";
// var sprite;
// var gFont, sprite;
// var fontLoader = new FontLoader();
// var material = new THREE.MeshStandardMaterial();
// fontLoader.load(
//   "../../libs/three.js/src/fonts/helvetiker_bold.typeface.json",
//   function (font) {
//     gFont = font;
//     const textGeometery = new TextGeometry("Take Picture", {
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

//     sprite = new THREE.Mesh(textGeometery, material);
//   }
// );
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

  // console.log(sprite);

  // if (parameters === undefined) parameters = {};
  // const fontface = parameters.hasOwnProperty("fontFace")
  //   ? parameters["fontFace"]
  //   : "Arial";
  // const fontsize = parameters.hasOwnProperty("fontSize")
  //   ? parameters["fontSize"]
  //   : 2;
  // const borderThickness = parameters.hasOwnProperty("borderThickness")
  //   ? parameters["borderThickness"]
  //   : 2;
  // const borderColor = parameters.hasOwnProperty("borderColor")
  //   ? parameters["borderColor"]
  //   : { r: 0, g: 0, b: 0, a: 1.0 };
  // const backgroundColor = parameters.hasOwnProperty("backgroundColor")
  //   ? parameters["backgroundColor"]
  //   : { r: 255, g: 255, b: 255, a: 1.0 };
  // const textColor = parameters.hasOwnProperty("textColor")
  //   ? parameters["textColor"]
  //   : { r: 0, g: 0, b: 0, a: 1.0 };
  // const canvas = document.createElement("canvas");
  // const context = canvas.getContext("2d");
  // const offset = 32;
  // canvas.height = offset * 2;
  // canvas.width = offset * 2;
  // const radius = 5;
  // context.fillStyle =
  //   "rgba(" +
  //   backgroundColor.r +
  //   "," +
  //   backgroundColor.g +
  //   "," +
  //   backgroundColor.b +
  //   "," +
  //   backgroundColor.a +
  //   ")";
  // context.beginPath();
  // context.arc(offset, offset, radius, 0, 2 * Math.PI);
  // context.fill();
  // context.strokeStyle =
  //   "rgba(" +
  //   borderColor.r +
  //   "," +
  //   borderColor.g +
  //   "," +
  //   borderColor.b +
  //   "," +
  //   borderColor.a +
  //   ")";
  // context.lineWidth = borderThickness;
  // context.beginPath();
  // context.arc(offset, offset, radius, 0, 2 * Math.PI);
  // context.stroke();
  // context.fillStyle =
  //   "rgba(" +
  //   textColor.r +
  //   "," +
  //   textColor.g +
  //   "," +
  //   textColor.b +
  //   "," +
  //   textColor.a +
  //   ")";
  // context.font = fontsize + "px " + fontface;
  // context.textAlign = "center";
  // context.textBaseline = "middle";
  // context.fillText(message, offset, offset);
  // var cubeGeo = new THREE.BoxGeometry(1, 1, 1);
  // var cubeMaterial = new THREE.MeshBasicMaterial({
  //   color: 0x00ee00,
  // });
  // const sprite = new THREE.Mesh(cubeGeo, cubeMaterial);
  // textGeometery.center();
  // text.position.y = 1;
  // scene.add(cubeMesh);
  // const texture = new THREE.Texture(canvas);
  // texture.needsUpdate = true;
  // const spriteMaterial = new THREE.SpriteMaterial({
  //   map: texture,
  //   depthTest: true,
  // });
  // const sprite = new THREE.Sprite(spriteMaterial);
  // sprite.center = new THREE.Vector2(0.5, 0.5 );
  // sprite.scale.set(2, 2, 2);
}
