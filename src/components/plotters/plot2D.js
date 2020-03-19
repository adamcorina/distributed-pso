import * as THREE from "three";

const WIDTH = window.innerWidth,
  HEIGHT = window.innerHeight,
  VIEW_ANGLE = 50,
  ASPECT = WIDTH / HEIGHT,
  NEAR = 0.1,
  FAR = 10000,
  SEGMENTS = 80;

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
const camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);

class FunctionPlotter2D {
  initialize(pso) {
    window.addEventListener("resize", onWindowResize, false);
    init();
    animate();
    createGraph(pso);

    return renderer.domElement;
  }

  render(pso) {
    for (let i = 0; i < pso.particles.length; i++) {
      // move plotted particles to their next position
      const particle = pso.particles[i];
      const coordinates = [particle.position[0], particle.fitness];
      updateParticle(particle.domMeshReference, coordinates, particle.isReplaced ? 0xffe100 : null);
    }
  }
}

const init = function() {
  renderer.setSize(WIDTH, HEIGHT);
  renderer.setClearColor(0xdddddd, 1);
  renderer.clear();
  scene.add(camera);

  const light = new THREE.PointLight(0xffffff);
  light.position.set(0, 0, 100);
  scene.add(light);

  camera.position.set(0, 0, 100);
};

const animate = function() {
  requestAnimationFrame(() => animate());
  renderCanvas();
};

const renderCanvas = function() {
  renderer.render(scene, camera);
};

const initParticles = function(particles, dimension) {
  particles.forEach(particle => {
    createParticle(particle, dimension);
  });
  renderCanvas();
};

const createParticle = function(particle, dimension) {
  const geometry = new THREE.SphereGeometry(dimension, 16, 16);
  const material = new THREE.MeshLambertMaterial({ color: 0x530296 });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(particle.position[0], particle.fitness, 0);
  particle.domMeshReference = mesh;
  scene.add(mesh);
};

const updateParticle = function(mesh, coordinates) {
  mesh.position.x = coordinates[0];
  mesh.position.y = coordinates[1];
  color && mesh.material.color.setHex(color);
};

const createGraph = function(pso) {
  const xMin = pso.fitnessFunction.dimensions[0].min;
  const xMax = pso.fitnessFunction.dimensions[0].max;

  const xRange = xMax - xMin;
  const yFunc = pso.fitnessFunction.compute;

  const meshFunction = function(x, z, target) {
    x = xRange * x + xMin;
    var y = yFunc(x);
    target.set(x, y, 0);
  };

  const graphGeometry = new THREE.ParametricGeometry(
    meshFunction,
    SEGMENTS,
    SEGMENTS
  );

  graphGeometry.computeBoundingBox();

  var material = new THREE.LineBasicMaterial({ color: 0x000000 });

  const line = new THREE.Line(graphGeometry, material);
  scene.add(line);

  fitCameraToObject(graphGeometry);

  initParticles(pso.particles, getMaxSizeBoundingBox(graphGeometry) * 0.005);
};

const fitCameraToObject = function(object) {
  const center = object.boundingBox.getCenter();

  const maxDim = getMaxSizeBoundingBox(object);
  const fov = camera.fov * (Math.PI / 180);
  let cameraZ = Math.abs((maxDim / 4) * Math.tan(fov * 2));

  camera.position.z = cameraZ;

  const minZ = object.boundingBox.min.z;
  const cameraToFarEdge = minZ < 0 ? -minZ + cameraZ : cameraZ - minZ;

  camera.far = cameraToFarEdge * 3;
  camera.updateProjectionMatrix();
  camera.lookAt(center);

  const axesHelper = new THREE.AxesHelper(maxDim);
  scene.add(axesHelper);
};

const getMaxSizeBoundingBox = function(object) {
  const size = object.boundingBox.getSize();
  return Math.max(size.x, size.y, size.z);
};

const onWindowResize = function() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
};

export default FunctionPlotter2D;
