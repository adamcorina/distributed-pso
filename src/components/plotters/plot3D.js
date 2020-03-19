import * as THREE from "three";
const OrbitControls = require("three-orbit-controls")(THREE);
import { eventBus } from "../../event-bus/eventBus";

const WIDTH = window.innerWidth,
  HEIGHT = window.innerHeight,
  VIEW_ANGLE = 50,
  ASPECT = WIDTH / HEIGHT,
  NEAR = 0.1,
  FAR = 100000,
  SEGMENTS = 80;

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
const camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);

class FunctionPlotter3D {
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
      const coordinates = [...particle.position, particle.fitness];
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
  light.position.set(0, 0, 1000);
  scene.add(light);

  new OrbitControls(camera, renderer.domElement);
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
  mesh.position.set(
    particle.position[0],
    particle.position[1],
    particle.fitness
  );
  particle.domMeshReference = mesh;
  scene.add(mesh);
};

const updateParticle = function(mesh, coordinates, color) {
  mesh.position.x = coordinates[0];
  mesh.position.y = coordinates[1];
  mesh.position.z = coordinates[2];
  color && mesh.material.color.setHex(color);
};

const createGraph = function(pso) {
  const xMin = pso.fitnessFunction.dimensions[0].min;
  const xMax = pso.fitnessFunction.dimensions[0].max;
  const yMin = pso.fitnessFunction.dimensions[1].min;
  const yMax = pso.fitnessFunction.dimensions[1].max;

  const xRange = xMax - xMin;
  const yRange = yMax - yMin;
  const zFunc = pso.fitnessFunction.compute;

  const meshFunction = function(x, y, target) {
    x = xRange * x + xMin;
    y = yRange * y + yMin;
    var z = zFunc(x, y);
    target.set(x, y, z);
  };

  const graphGeometry = new THREE.ParametricGeometry(
    meshFunction,
    SEGMENTS,
    SEGMENTS,
    true
  );

  graphGeometry.computeBoundingBox();

  const zMin = graphGeometry.boundingBox.min.z;
  const zMax = graphGeometry.boundingBox.max.z;
  const zRange = zMax - zMin;

  let color, point, face, numberOfSides, vertexIndex;
  let faceIndices = ["a", "b", "c", "d"];

  for (let i = 0; i < graphGeometry.vertices.length; i++) {
    point = graphGeometry.vertices[i];
    color = new THREE.Color(0x0000ff);
    color.setHSL((0.7 * (zMax - point.z)) / zRange, 1, 0.5);
    graphGeometry.colors[i] = color;
  }

  for (let i = 0; i < graphGeometry.faces.length; i++) {
    face = graphGeometry.faces[i];
    numberOfSides = face instanceof THREE.Face3 ? 3 : 4;
    for (let j = 0; j < numberOfSides; j++) {
      vertexIndex = face[faceIndices[j]];
      face.vertexColors[j] = graphGeometry.colors[vertexIndex];
    }
  }

  const wireTexture = new THREE.ImageUtils.loadTexture("images/square.png");
  wireTexture.wrapS = wireTexture.wrapT = THREE.RepeatWrapping;
  wireTexture.repeat.set(40, 40);

  const wireMaterial = new THREE.MeshBasicMaterial({
    map: wireTexture,
    vertexColors: THREE.VertexColors,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.3
  });
  wireMaterial.map.repeat.set(SEGMENTS, SEGMENTS);

  const graphMesh = new THREE.Mesh(graphGeometry, wireMaterial);
  graphMesh.doubleSided = true;
  scene.add(graphMesh);

  fitCameraToObject(graphGeometry, 1.3);
  const scaledParticleDimension = getMaxSizeBoundingBox(graphGeometry) * 0.005;
  initParticles(pso.particles, scaledParticleDimension);
};

const getMaxSizeBoundingBox = function(object) {
  const size = object.boundingBox.getSize();
  return Math.max(size.x, size.y, size.z);
};

const fitCameraToObject = function(object) {
  const center = object.boundingBox.getCenter();

  const maxDim = getMaxSizeBoundingBox(object);
  const fov = camera.fov * (Math.PI / 180);
  let cameraZ = Math.abs((maxDim / 4) * Math.tan(fov * 2));
  cameraZ *= 1.3; // zoom out a little so that objects don't fill the screen

  camera.position.z = cameraZ;

  const minZ = object.boundingBox.min.z;
  const cameraToFarEdge = minZ < 0 ? -minZ + cameraZ : cameraZ - minZ;

  camera.far = cameraToFarEdge * 3;
  camera.updateProjectionMatrix();
  camera.lookAt(center);

  const axesHelper = new THREE.AxesHelper(maxDim);
  scene.add(axesHelper);
};

const onWindowResize = function() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
};

export default FunctionPlotter3D;
