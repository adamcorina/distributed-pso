import React, { useEffect, useState } from "react";
import * as THREE from "three";
const OrbitControls = require("three-orbit-controls")(THREE);

const WIDTH = window.innerWidth,
  HEIGHT = window.innerHeight,
  VIEW_ANGLE = 50,
  ASPECT = WIDTH / HEIGHT,
  NEAR = 0.1,
  FAR = 100000,
  segments = 80;

const FunctionPlotter = ({ pso }) => {
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
      const intervalId = setInterval(() => {
        if (pso.iterationNum < 500) {
          pso.iterate();
          for (let i = 0; i < pso.particles.length; i++) {
            if (canvasParticles[i]) {
              canvasParticles[i].position.x = pso.particles[i].position[0];
              canvasParticles[i].position.y = pso.particles[i].position[1];
              canvasParticles[i].position.z = pso.particles[i].fitness;
            }
          }
        } else {
          clearInterval(intervalId);
        }
      }, 200);
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
    light.position.set(0, 100, 100);
    scene.add(light);

    new OrbitControls(camera, renderer.domElement);
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

  const createParticle = (x, y, z, dimension) => {
    const geometry = new THREE.SphereGeometry(dimension, 16, 16);
    const material = new THREE.MeshLambertMaterial({ color: 0x00ccff });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    return mesh;
  };

  function createGraph() {
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
      segments,
      segments,
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
    wireMaterial.map.repeat.set(segments, segments);

    const graphMesh = new THREE.Mesh(graphGeometry, wireMaterial);
    graphMesh.doubleSided = true;
    scene.add(graphMesh);

    fitCameraToObject(camera, graphGeometry, 1.3);


    const size = graphGeometry.boundingBox.getSize();
    const maxDim = Math.max(size.x, size.y, size.z);

    initParticles(pso.particles, maxDim * 0.003);
  }

  const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  const fitCameraToObject = function(camera, object) {
    const center = object.boundingBox.getCenter();
    const size = object.boundingBox.getSize();

    // get the max side of the bounding box (fits to width OR height as needed )
    const maxDim = Math.max(size.x, size.y, size.z);
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

  return <div id={"functionPloterContainer"} />;
};

export default FunctionPlotter;
