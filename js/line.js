const radius = 4;
var scene, camera, renderer = [];
const origin = new THREE.Vector3();
const direction = new THREE.Vector3();
const raycaster = new THREE.Raycaster();
const geometry = new THREE.SphereBufferGeometry(radius, 32, 32, 0, 3.2, 4, 2.1);
const material = new THREE.MeshBasicMaterial({
  wireframe: true,
  visible: false
});
const sphere = new THREE.Mesh(geometry, material);
sphere.position.z = 2;
const COLORS = ['#FFFAFF', '#0A2463', '#3E92CC', '#723bb7', '#efd28e', '#3f9d8c'].map((col) => new THREE.Color(col));
const STATIC_PROPS = {
  transformLineMethod: p => p,
};



function init() {

  //camera
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.z = 5;

  //scene
  scene = new THREE.Scene();

  //renderer
  renderer = new THREE.WebGLRenderer();
  //set the size of the renderer
  renderer.setSize(window.innerWidth, window.innerHeight);

  //add the renderer to the html document body
  document.querySelector('.line').appendChild(renderer.domElement);
}

function addLine() {
  // V1 Regular and symetric lines ---------------------------------------------
  // i += 0.1;
  // let a = i;
  // let y = 12;
  // let incrementation = 0.1;
  // V2 ---------------------------------------------
  let incrementation = 0.1;
  let y = (Math.random() * (radius * 1.8 - (-radius * 0.6)));
  // let y = getRandomFloat(-radius * 0.6, radius * 1.8);
  let a = Math.PI * (-25) / 180;
  let aMax = Math.PI * (200) / 180;

  const points = [];
  while (a < aMax) {
    a += 0.2;
    y -= incrementation;
    //   origin.position.x = radius * Math.cos(a);
    //   origin.position.y = y;
    //   origin.position.z = radius * Math.sin(a);

    origin.set(radius * Math.cos(a), y, radius * Math.sin(a));
    direction.set(-origin.x, 0, -origin.z);
    direction.normalize();
    raycaster.set(origin, direction);

    // save the points
    const intersect = raycaster.intersectObject(sphere, true);
    if (intersect.length) {
      points.push(intersect[0].point.x, intersect[0].point.y, intersect[0].point.z);
    }
  }

  if (points.length === 0) return;

  if (Math.random() > 0.5) {
    // Low lines
    addLineGenerator({
      visibleLength: (Math.random() * (0.2 - 0.01)) + 0.01,
      points,
      speed: (Math.random() * (0.008 - 0.003)) + 0.003,
      color: THREE.COLORS[Math.floor(Math.random() * ((THREE.COLORS.length - 1) - 0 + 1)) + min],



      width: (Math.random() * (0.1 - 0.01)) + 0.01
    });
  } else {
    // Fast lines
    addLineGenerator({
      visibleLength: (Math.random() * (0.2 - 0.01)) + 0.01,
      points,
      speed: (Math.random() * (0.1 - 0.01)) + 0.01,
      color: COLORS[0],
      width: (Math.random() * (0.1 - 0.01)) + 0.01,
    });
  }


}
var i = 0;
var lines = [];
var nbrOfLines = -1;

var update = update.bind(this);
var start = start.bind(this);
var stop = stop.bind(this);

var frequency = frequency;
var lineStaticProps = lineProps;

var isStarted = false;





function start() {
  this.isStarted = true;
}

function stop(callback) {
  this.isStarted = false;
  // TODO callback when all lines are hidden
}

function addLineGenerator(props) {
  const line = new AnimatedMeshLine(Object.assign({}, this.lineStaticProps, props));
  lines.push(line);
  this.add(line);
  this.nbrOfLines++;
  return line;
}

function update() {
  // Add lines randomly
  if (this.isStarted && Math.random() < this.frequency) this.addLine();

  // Update current Lines
  for (this.i = this.nbrOfLines; this.i >= 0; this.i--) {
    this.lines[this.i].update();
  }

  // Filter and remove died lines
  const filteredLines = [];
  for (this.i = this.nbrOfLines; this.i >= 0; this.i--) {
    if (this.lines[this.i].isDied()) {
      this.removeLine(this.lines[this.i]);
    } else {
      filteredLines.push(this.lines[this.i]);
    }
  }
  this.lines = filteredLines;
}

width = 0.1,
  speed = 0.01,
  visibleLength = 0.5,
  color = new Color('#000000'),
  opacity = 1,
  position = new Vector3(0, 0, 0),

  // Array of points already done
  points = false,
  // Params to create the array of points
  length = 2,
  nbrOfPoints = 3,
  orientation = new Vector3(1, 0, 0),
  turbulence = new Vector3(0, 0, 0),
  transformLineMethod = false,

  function render() {
    //get the frame
    requestAnimationFrame(render);

    //render the scene
    renderer.render(scene, camera);
    addLine();

  }

let linePoints = [];
if (!points) {
  const currentPoint = new Vector3();
  // The size of each segment oriented in the good directon
  const segment = orientation.normalize().multiplyScalar(length / nbrOfPoints);
  linePoints.push(currentPoint.clone());
  for (let i = 0; i < nbrOfPoints - 1; i++) {
    // Increment the point depending to the orientation
    currentPoint.add(segment);
    // Add turbulence to the current point
    linePoints.push(currentPoint.clone().set(
      currentPoint.x + getRandomFloat(-turbulence.x, turbulence.x),
      currentPoint.y + getRandomFloat(-turbulence.y, turbulence.y),
      currentPoint.z + getRandomFloat(-turbulence.z, turbulence.z),
    ));
  }
  // Finish the curve to the correct point without turbulence
  linePoints.push(currentPoint.add(segment).clone());
  // * ******************************
  // * Smooth the line
  // TODO 3D spline curve https://math.stackexchange.com/questions/577641/how-to-calculate-interpolating-splines-in-3d-space
  // TODO https://github.com/mrdoob/three.js/blob/master/examples/webgl_geometry_nurbs.html
  const curve = new SplineCurve(linePoints);
  linePoints = new Geometry().setFromPoints(curve.getPoints(50));
} else {
  linePoints = points;
}



// * ******************************
// * Create the MeshLineGeometry
const line = new MeshLine();
line.setGeometry(linePoints, transformLineMethod);
const geometry = line.geometry;

// * ******************************
// * Create the Line Material
// dashArray - the length and space between dashes. (0 - no dash)
// dashRatio - defines the ratio between that is visible or not (0 - more visible, 1 - more invisible).
// dashOffset - defines the location where the dash will begin. Ideal to animate the line.
// DashArray: The length of a dash = dashArray * length.
// Here 2 mean a cash is 2 time longer that the original length
const dashArray = 2;
// Start to 0 and will be decremented to show the dashed line
const dashOffset = 0;
// The ratio between that is visible and other
const dashRatio = 1 - (visibleLength * 0.5); // Have to be between 0.5 and 1.

const material = new MeshLineMaterial({
  lineWidth: width,
  dashArray,
  dashOffset,
  dashRatio, // The ratio between that is visible or not for each dash
  opacity,
  transparent: true,
  depthWrite: false,
  color,
});

// * ******************************
// * Init
super(geometry, material);
this.position.copy(position);

this.speed = speed;
this.voidLength = dashArray * dashRatio; // When the visible part is out
this.dashLength = dashArray - this.voidLength;

this.dyingAt = 1;
this.diedAt = this.dyingAt + this.dashLength;

// Bind
this.update = this.update.bind(this);




function AnimatedUpdate() {
  // Increment the dash
  this.material.uniforms.dashOffset.value -= this.speed;

  // TODO make that into a decorator
  // Reduce the opacity then the dash start to desapear
  if (this.isDying()) {
    this.material.uniforms.opacity.value = 0.9 + ((this.material.uniforms.dashOffset.value + 1) / this.dashLength);
  }
}

function isDied() {
  return this.material.uniforms.dashOffset.value < -this.diedAt;
}

function isDying() {
  return this.material.uniforms.dashOffset.value < -this.dyingAt;
}

init()
addLine()
render()
console.log("loading line")

// class CustomLineGenerator extends LineGenerator {

// }
// const lineGenerator = new CustomLineGenerator({
//   frequency: 0.99,
// }, STATIC_PROPS);
// engine.add(lineGenerator);