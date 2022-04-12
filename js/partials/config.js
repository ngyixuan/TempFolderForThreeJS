import * as THREE from "../../libs/three.js/build/three.module.js";

// function below triggers when an annotation is clicked
export const annotationCallback = (number, link) => {
  console.log("You clicked annotation number ", number);
  window.open(link, "_blank");
  return false;
};

// setting style of annotations
export const annotationStyle3D = {
  // fontSize: 15,
  // fontFace: "sans-serif",
  // textColor: { r: 255, g: 255, b: 255, a: 1.0 },
  // borderColor: { r: 0, g: 255, b: 20, a: 1.0 },
  // backgroundColor: { r: 0, g: 0, b: 0, a: 0.5 },
};

// setting the number and link for each annotation
export const annotations = [
  {
    number: 1,
    position: new THREE.Vector3(-2, 3, 2),
    link: "http://www.baidu.com",
  },

  {
    number: 2,
    position: new THREE.Vector3(2, 2, 2),
    link: "http://www.expensive.toys/mandala/",
  },

  {
    number: 3,
    position: new THREE.Vector3(5, 4, 3),
    link: "http://www.expensive.toys/mandala/",
  },
];
