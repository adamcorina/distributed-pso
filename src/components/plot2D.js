import React, { useEffect, useState } from "react";
import * as THREE from "three";

const WIDTH = window.innerWidth,
  HEIGHT = window.innerHeight,
  VIEW_ANGLE = 50,
  ASPECT = WIDTH / HEIGHT,
  NEAR = 0.1,
  FAR = 10000,
  SEGMENTS = 80;

const FunctionPlotter2D = ({ pso }) => {
  let [scene] = useState(new THREE.Scene());
  let [renderer] = useState(new THREE.WebGLRenderer());
  let [camera] = useState(
    new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR)
  );

  useEffect(() => {
    if (pso) {
      window.addEventListener("resize", onWindowResize, false);
      init();
      animate();
      createGraph();
    }
  }, [pso]);

  const init = () => {
    const container = document.getElementById("functionPloterContainer");
    container.appendChild(renderer.domElement);

    renderer.setSize(WIDTH, HEIGHT);
    renderer.setClearColor(0xdddddd, 1);
    renderer.clear();
    scene.add(camera);

    const light = new THREE.PointLight(0xffffff);
    light.position.set(0, 100, 100);
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
  }

  const fitCameraToObject = function(camera, object) {
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

  const getMaxSizeBoundingBox = (object) => {
    const size = object.boundingBox.getSize();
    return Math.max(size.x, size.y, size.z);
  }

  const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  return <div id={"functionPloterContainer"} />;
};

export default FunctionPlotter2D;