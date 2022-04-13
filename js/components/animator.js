import * as THREE from "../../libs/three.js/build/three.module.js";
import { TWEEN } from "../../libs/three/examples/jsm/libs/tween.module.min.js";
import { EffectComposer } from "../../libs/three.js/src/jsm/postprocessing/EffectComposer.js";
class Animator {
  constructor(sketch, settings) {
    this.sketch = sketch;
    this.settings = { ...settings };

    this.tasks = [];
  }
  add(fn) {
    this.tasks.push(fn);
  }
  animate(composer) {
    TWEEN.update();
    // console.log(this.sketch.composer);

    requestAnimationFrame(this.animate.bind(this));

    this.tasks.forEach((task) => task());

    this.sketch.renderer.update();
    this.sketch.composer.render();
  }
}
export default Animator;
