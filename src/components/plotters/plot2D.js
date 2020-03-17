import React, { useEffect, useState } from "react";
import * as THREE from "three";
import { eventBus } from "../../event-bus/eventBus";

const WIDTH = window.innerWidth,
  HEIGHT = window.innerHeight,
  VIEW_ANGLE = 50,
  ASPECT = WIDTH / HEIGHT,
  NEAR = 0.1,
  FAR = 10000,
  SEGMENTS = 80;

const FunctionPlotter2D = ({
  pso,
  timeBetweenIterations
}) => {
  let [scene] = useState(new THREE.Scene());
  let [renderer] = useState(new THREE.WebGLRenderer());
  let [camera] = useState(
    new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR)
  );
  let [canvasParticles, setCanvasParticles] = useState([]);

  useEffect(() => {
    if (pso) {
      window.addEventListener("resize", onWindowResize, false);
      init();
      animate();
      createGraph();
    }
  }, [pso]);

  useEffect(() => {
    if (canvasParticles.length) {
      // start iterations for population
      setInterval(() => {
        const introducedColaborativeBest = pso.introduceColaborativeBest();
        if (introducedColaborativeBest) {
          canvasParticles[introducedColaborativeBest.index].position.x =
            introducedColaborativeBest.position[0];
          canvasParticles[introducedColaborativeBest.index].position.y =
            introducedColaborativeBest.position[1];
          canvasParticles[
            introducedColaborativeBest.index
          ].material.color.setHex(0xffe100);
        }
        pso.iterate();
        eventBus.$emit("iteration");
        for (let i = 0; i < pso.particles.length; i++) {
          if (canvasParticles[i]) {
            // move plotted particles to their next position
            canvasParticles[i].position.x = pso.particles[i].position[0];
            canvasParticles[i].position.y = pso.particles[i].fitness;
          }
        }
      }, timeBetweenIterations);
    }
  }, [canvasParticles]);

  const init = () => {
    const container = document.getElementById("functionPloterContainer");
    container.appendChild(renderer.domElement);

    renderer.setSize(WIDTH, HEIGHT);
    renderer.setClearColor(0xdddddd, 1);
    renderer.clear();
    scene.add(camera);

    const light = new THREE.PointLight(0xffffff);
    light.position.set(0, 0, 100);
    scene.add(light);

    camera.position.set(0, 0, 100);
  };

  const animate = () => {
    requestAnimationFrame(animate);
    renderCanvas();
  };

  const renderCanvas = () => {
    renderer.render(scene, camera);
  };

  const initParticles = (particles, dimension) => {
    const particlesToAdd = [];
    particles.forEach(particle => {
      const particleToAdd = createParticle(
        ...particle.position,
        particle.fitness,
        dimension
      );
      particlesToAdd.push(particleToAdd);
      scene.add(particleToAdd);
    });
    setCanvasParticles(particlesToAdd);
    renderCanvas();
  };

  const createParticle = (x, y, dimension) => {
    const geometry = new THREE.SphereGeometry(dimension, 16, 16);
    const material = new THREE.MeshLambertMaterial({ color: 0x530296 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, 0);
    return mesh;
  };

  function createGraph() {
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

    fitCameraToObject(camera, graphGeometry);

    initParticles(pso.particles, getMaxSizeBoundingBox(graphGeometry) * 0.005);
  }

  const fitCameraToObject = function(camera, object) {
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

  const getMaxSizeBoundingBox = object => {
    const size = object.boundingBox.getSize();
    return Math.max(size.x, size.y, size.z);
  };

  const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  return <div id={"functionPloterContainer"} />;
};

export default FunctionPlotter2D;
