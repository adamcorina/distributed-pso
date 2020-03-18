import * as THREE from "three";
import { eventBus } from "../../event-bus/eventBus";

const WIDTH = window.innerWidth,
  HEIGHT = window.innerHeight,
  VIEW_ANGLE = 50,
  ASPECT = WIDTH / HEIGHT,
  NEAR = 0.1,
  FAR = 10000,
  SEGMENTS = 80;

class FunctionPlotter2D {
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
        ].domMeshReference.material.color.setHex(0xffe100);
      }
      pso.iterate();
      eventBus.$emit("iteration");
      for (let i = 0; i < pso.particles.length; i++) {
        // move plotted particles to their next position
        pso.particles[i].domMeshReference.position.x =
          pso.particles[i].position[0];
        pso.particles[i].domMeshReference.position.y = pso.particles[i].fitness;
      }
  }

  init() {
    this.renderer.setSize(WIDTH, HEIGHT);
    this.renderer.setClearColor(0xdddddd, 1);
    this.renderer.clear();
    this.scene.add(this.camera);

    const light = new THREE.PointLight(0xffffff);
    light.position.set(0, 0, 100);
    this.scene.add(light);

    this.camera.position.set(0, 0, 100);
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
    mesh.position.set(particle.position[0], particle.fitness, 0);
    particle.domMeshReference = mesh;
    this.scene.add(mesh);
  }

  createGraph(pso) {
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
    this.scene.add(line);

    this.fitCameraToObject(graphGeometry);

    this.initParticles(pso.particles, this.getMaxSizeBoundingBox(graphGeometry) * 0.005);
  }

  fitCameraToObject(object) {
    const center = object.boundingBox.getCenter();

    const maxDim = this.getMaxSizeBoundingBox(object);
    const fov = this.camera.fov * (Math.PI / 180);
    let cameraZ = Math.abs((maxDim / 4) * Math.tan(fov * 2));

    this.camera.position.z = cameraZ;

    const minZ = object.boundingBox.min.z;
    const cameraToFarEdge = minZ < 0 ? -minZ + cameraZ : cameraZ - minZ;

    this.camera.far = cameraToFarEdge * 3;
    this.camera.updateProjectionMatrix();
    this.camera.lookAt(center);

    const axesHelper = new THREE.AxesHelper(maxDim);
    this.scene.add(axesHelper);
  }

  getMaxSizeBoundingBox(object) {
    const size = object.boundingBox.getSize();
    return Math.max(size.x, size.y, size.z);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

export default FunctionPlotter2D;
