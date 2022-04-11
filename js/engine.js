

function init(){
  camera = new PerspectiveCamera(50, window.width / window.height, 1, 1000);
  camera.position.set(0, 0, 5);
  
  scene = new Scene();

  renderer = new WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  meshCount = 0;
  meshListeners = [];


  dom = this.renderer.domElement;

  update = this.update.bind(this);
  resize = this.resize.bind(this);

  document.body.appendChild( renderer.domElement );
  

}
   
  
  


  /**
   * * *******************
   * * SCENE MANAGMENT
   * * *******************
   */
  function add(mesh) {
    scene.add(mesh);
    if (!mesh.update) return;
    meshListeners.push(mesh.update);
    meshCount++;
  }
  function remove(mesh) {
    scene.remove(mesh);
    if (!mesh.update) return;
    const index = meshListeners.indexOf(mesh.update);
    if (index > -1) meshListeners.splice(index, 1);
    meshCount--;
  }

  function start() {
    update();
  }

  // Update render
  function update() {
    let i =meshCount;
    while (--i >= 0) {
      meshListeners[i].apply(this, null);
    }
    render();
    // Loop
    requestAnimationFrame(update);
  }

  function render() {
    renderer.render(this.scene, this.camera);
  }

  // Resize
  function resize(w, h) {
    width = w;
    height = h;
    camera.aspect = this.width / this.height;
    camera.updateProjectionMatrix();
    resizeRender();
  }

  function resizeRender() {
    renderer.setSize(this.width, this.height);
  }
