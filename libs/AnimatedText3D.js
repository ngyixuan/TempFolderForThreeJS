import { Object3D, ShapeGeometry, MeshBasicMaterial, Mesh, FontLoader, Group } from '../libs/three/build/three.module.js';
import { TimelineLite, Back } from '../libs/gsap/TweenMax.js';

import fontFile from '../libs/fontFile.js';

const fontLoader = new FontLoader();
const font = fontLoader.parse(fontFile);

class AnimatedText3D extends Object3D {
  constructor(text, { size = 0.8, letterSpacing = 0.03, color = '#ffffff', duration = 0.6, opacity = 1, wireframe = false } = {}) {
    super();

    this.text = text;

    this.basePosition = 0;
    this.size = size;
    this.color = color;
    this.wireframe = wireframe;
    this.letterSpacing = letterSpacing;
    this.duration = duration;
    this.opacity = opacity;

    // Bind
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
  }

  init() {
    //let group = new Object3D();
    const letters = [...this.text];
    letters.forEach((letter, index) => {
      if (letter === ' ') {
        this.basePosition += this.size * 0.5;
      } else {
        const geom = new ShapeGeometry(
          font.generateShapes(letter, this.size, 1),
        );
        geom.computeBoundingBox();
        const mat = new MeshBasicMaterial({
          color: this.color,
          opacity: 0,
          transparent: true,
          wireframe: this.wireframe,
        });
        const mesh = new Mesh(geom, mat);

        mesh.position.x = this.basePosition;
        this.basePosition += geom.boundingBox.max.x + this.letterSpacing;
        this.add(mesh);
      }
    });

    // Timeline
    this.tm = new TimelineLite({ paused: true });
    this.tm.set({}, {}, `+=${this.duration * 1.1}`)
    this.children.forEach((letter) => {
      const data = {
        opacity: 0,
        position: -0.5,
      };
      this.tm.to(data, this.duration, {
        opacity: this.opacity,
        position: 0,
        ease: Back.easeOut.config(2),
        onUpdate: () => {
          letter.material.opacity = data.opacity;
          letter.position.y = data.position;
          letter.position.z = data.position * 2;
          letter.rotation.x = data.position * 2;
        }
      }, `-=${this.duration - 0.03}`);
    });

    return this;
  }

  show() {
    this.tm.play();
  }

  hide() {
    this.tm.reverse();
  }
}

export default AnimatedText3D;