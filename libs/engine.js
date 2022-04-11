import {
  WebGLRenderer,
  PerspectiveCamera,
  Color,
  Scene,
  Vector3,
} from '../libs/three/build/three.module.js';

import app from '../libs/app.js';

export default class Engine {
  constructor(w, h, {
    backgroundColor,
    z = 10
  } = {}) {
    //3D配置等
    this.width = w;
    this.height = h;
    this.meshCount = 0;
    this.meshListeners = [];
    this.devicePixelRatio = window.devicePixelRatio ? Math.min(1.6, window.devicePixelRatio) : 1;
    this.renderer = new WebGLRenderer({
      antialias: true,
      alpha: true
    });
    this.renderer.setPixelRatio(this.devicePixelRatio);
    if (backgroundColor !== undefined) {
      this.renderer.setClearColor(new Color(backgroundColor));
    }else{
      this.renderer.setClearColor(new Color("#000000"))
    }
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(50, this.width / this.height, .1, 100000);
    this.camera.position.set(0, 0, z);

    this.dom = this.renderer.domElement;

    this.update = this.update.bind(this);
    this.resize = this.resize.bind(this);

    this.stars = [];

    // Put automaticaly the canvas in background
    this.dom.style.position = 'absolute';
    this.dom.style.top = '0';
    this.dom.style.left = '0';
    this.dom.style.zIndex = '-1';
    document.body.appendChild(this.dom);

    window.addEventListener('resize', this.resize);
    // window.addEventListener('orientationchange', this.resize);
    this.resize();

    this.cameraAmpl = {
      x: 1,
      y: 1
    };
    this.cameraVelocity = 0.1;
    this.lookAt = new Vector3();

    this.mousePosition = { x: 0, y: 0 };
    this.normalizedOrientation = new Vector3();

    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleOrientationMove = this.handleOrientationMove.bind(this);

    if (app.isMobile) {
      window.addEventListener('deviceorientation', this.handleOrientationMove);
    } else {
      window.addEventListener('mousemove', this.handleMouseMove);
    }
  }

  //场景添加删除物体
  add(mesh) {
    this.scene.add(mesh);
    if (!mesh.update) return;
    this.meshListeners.push(mesh.update);
    this.meshCount++;
  }
  remove(mesh) {
    this.scene.remove(mesh);
    if (!mesh.update) return;
    const index = this.meshListeners.indexOf(mesh.update);
    if (index > -1) this.meshListeners.splice(index, 1);
    this.meshCount--;
  }

  start() {
    this.update();
  }

  // 渲染
  update() {
    let i = this.meshCount;
    while (--i >= 0) {
      this.meshListeners[i].apply(this, null);
    }

    this.render();
    // Loop
    requestAnimationFrame(this.update);
  }

  render() {
    this.animateStars();

    this.updateControls();

    this.renderer.render(this.scene, this.camera);
  }

  // 重置大小
  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.resizeRender();
  }

  resizeRender() {
    this.renderer.setSize(this.width, this.height);
  }

  //飞星
  addSphere() {

    // The loop will move from z position of -1000 to z position 1000, adding a random particle at each position. 
    for (var z = -1000; z < 1000; z += 20) {
      // for (let i = 0; i < 300; i++) {
      // Make a sphere (exactly the same as before). 
      var geometry = new THREE.SphereBufferGeometry(2, 2, 2)
      var material = new THREE.MeshNormalMaterial();
      // var material = new THREE.MeshBasicMaterial( { color: 0xECF0F1, transparent: true, opacity: 0.3 });
      var sphere = new THREE.Mesh(geometry, material)

      // // This time we give the sphere random x and y positions between -500 and 500
      sphere.position.x = Math.random() * 1000 - 500;
      sphere.position.y = Math.random() * 1000 - 500;

      // // Then set the z position to where it is in the loop (distance of camera)
      sphere.position.z = z;
      // sphere.position.set(
      //     Math.random() - 0.5,
      //     Math.random() - 0.5,
      //     -Math.random() * 0.5
      //   ).normalize().multiplyScalar(
      //       ()=>{
      //         (Math.random() * (max - min)) + min
      //       }

      //   )


      //   this.t += 0.01;
      // sphere.scale.x = sphere.scale.y = sphere.scale.z = Math.sin( this.t ) + 1;


      // scale it up a bit
      sphere.scale.x = sphere.scale.y = 2;

      //add the sphere to the scene
      this.scene.add(sphere);

      //finally push it to the stars array 
      this.stars.push(sphere);
    }
  }

  //飞星移动
  animateStars() {

    // loop through each star
    for (var i = 0; i < this.stars.length; i++) {
      // for(var i=0; i<300; i++) {
      let star = this.stars[i];

      // and move it forward dependent on the mouseY position. 
      star.position.z += i / 10;


      // if the particle is too close move it to the back
      if (star.position.z > 1000) star.position.z -= 2000;

      // this.t = Math.random() * 10;
      // star.position.set(
      //     Math.random() - 0.5,
      //     Math.random() - 0.5,
      //     -Math.random() * 0.5
      //   )

    }

  }

  //鼠标动作
  handleMouseMove(event) {
    this.mousePosition.x = event.clientX || (event.touches && event.touches[0].clientX) || this.mousePosition.x;
    this.mousePosition.y = event.clientY || (event.touches && event.touches[0].clientY) || this.mousePosition.y;

    this.normalizedOrientation.set(
      -((this.mousePosition.x / this.width) - 0.5) * this.cameraAmpl.x,
      ((this.mousePosition.y / this.height) - 0.5) * this.cameraAmpl.y,
      0.5,
    );
  }

  handleOrientationMove(event) {
    // https://stackoverflow.com/questions/40716461/how-to-get-the-angle-between-the-horizon-line-and-the-device-in-javascript
    const rad = Math.atan2(event.gamma, event.beta);
    if (Math.abs(rad) > 1.5) return;
    this.normalizedOrientation.x = -(rad) * this.cameraAmpl.y;
    // TODO handle orientation.y
  }

  updateControls() {
    this.camera.position.x += (this.normalizedOrientation.x - this.camera.position.x) * this.cameraVelocity;
    this.camera.position.y += (this.normalizedOrientation.y - this.camera.position.y) * this.cameraVelocity;
    this.camera.lookAt(this.lookAt);
  }

}