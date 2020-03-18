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

class FunctionPlotter3D {
  constructor() {
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer();
    this.camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
  }

  initialize(pso) {
    window.addEventListener("resize", this.onWindowResize, false);
    this.init();
    this.animate();
    this.createGraph(pso);

    return this.renderer.domElement;
  }

  iterate(pso) {
    const introducedColaborativeBest = pso.introduceColaborativeBest();
    if (introducedColaborativeBest) {
      pso.particles[
        introducedColaborativeBest.index
      ].domMeshReference.position.x = introducedColaborativeBest.position[0];
      pso.particles[
        introducedColaborativeBest.index
      ].domMeshReference.position.y = introducedColaborativeBest.position[1];
      pso.particles[
        introducedColaborativeBest.index
      ].domMeshReference.position.z = introducedColaborativeBest.position[2];
      pso.particles[
        introducedColaborativeBest.index
      ].domMeshReference.material.color.setHex(0xffe100);
    }
    pso.iterate();
    eventBus.$emit("iteration");
    for (let i = 0; i < pso.particles.length; i++) {
      // move plotted particles to their next position
      pso.particles[i].domMeshReference.position.x =
        pso.particles[i].position[0];
      pso.particles[i].domMeshReference.position.y =
        pso.particles[i].position[1];
      pso.particles[i].domMeshReference.position.z = pso.particles[i].fitness;
    }
  }

  init() {
    this.renderer.setSize(WIDTH, HEIGHT);
    this.renderer.setClearColor(0xdddddd, 1);
    this.renderer.clear();
    this.scene.add(this.camera);

    const light = new THREE.PointLight(0xffffff);
    light.position.set(0, 0, 1000);
    this.scene.add(light);

    new OrbitControls(this.camera, this.renderer.domElement);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.renderCanvas();
  }

  renderCanvas() {
    this.renderer.render(this.scene, this.camera);
  }

  initParticles(particles, dimension) {
    particles.forEach(particle => {
      this.createParticle(particle, dimension);
    });
    this.renderCanvas();
  }

  createParticle(particle, dimension) {
    const geometry = new THREE.SphereGeometry(dimension, 16, 16);
    const material = new THREE.MeshLambertMaterial({ color: 0x530296 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(
      particle.position[0],
      particle.position[1],
      particle.fitness
    );
    particle.domMeshReference = mesh;
    this.scene.add(mesh);
  }

  createGraph(pso) {
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
    this.scene.add(graphMesh);

    this.fitCameraToObject(graphGeometry, 1.3);
    const scaledParticleDimension =
      this.getMaxSizeBoundingBox(graphGeometry) * 0.005;
    this.initParticles(pso.particles, scaledParticleDimension);
  }

  getMaxSizeBoundingBox(object) {
    const size = object.boundingBox.getSize();
    return Math.max(size.x, size.y, size.z);
  }

  fitCameraToObject(object) {
    const center = object.boundingBox.getCenter();

    const maxDim = this.getMaxSizeBoundingBox(object);
    const fov = this.camera.fov * (Math.PI / 180);
    let cameraZ = Math.abs((maxDim / 4) * Math.tan(fov * 2));
    cameraZ *= 1.3; // zoom out a little so that objects don't fill the screen

    this.camera.position.z = cameraZ;

    const minZ = object.boundingBox.min.z;
    const cameraToFarEdge = minZ < 0 ? -minZ + cameraZ : cameraZ - minZ;

    this.camera.far = cameraToFarEdge * 3;
    this.camera.updateProjectionMatrix();
    this.camera.lookAt(center);

    const axesHelper = new THREE.AxesHelper(maxDim);
    this.scene.add(axesHelper);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

export default FunctionPlotter3D;
