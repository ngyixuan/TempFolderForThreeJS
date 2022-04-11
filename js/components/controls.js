import * as THREE from "../../libs/three.js/build/three.module.js";
import { OrbitControls } from "../../libs/three.js/src/jsm/controls/OrbitControls.js";

class Controls {
  constructor(sketch, settings) {
    this.sketch = sketch;
    this.settings = { ...settings };

    this.controls = new OrbitControls(
      this.sketch.defaultCamera,
      this.sketch.renderer.domElement
    );

    return this.controls;
  }
}
export default Controls;
