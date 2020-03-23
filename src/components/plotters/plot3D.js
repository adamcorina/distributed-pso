import * as THREE from "three";
const OrbitControls = require("three-orbit-controls")(THREE);

import React, { useEffect, useRef } from "react";

export default function FunctionPlotter3D({ population, ff, iteration }) {
  const mount = useRef(null);

  const getMaxSizeBoundingBox = function(object) {
    const size = object.boundingBox.getSize();
    return Math.max(size.x, size.y, size.z);
  };

  const createGraphGeometry = (segments) => {
    const xMin = ff.dimensions[0].min;
    const xMax = ff.dimensions[0].max;
    const yMin = ff.dimensions[1].min;
    const yMax = ff.dimensions[1].max;

    const xRange = xMax - xMin;
    const yRange = yMax - yMin;
    const zFunc = ff.compute;

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

    return graphGeometry;
  }

  const plotGraphMesh = (scene, graphGeometry, segments) => {
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
  }

  const zoomToFitScreen = (camera, graphGeometry) => {
    const maxDim = getMaxSizeBoundingBox(graphGeometry);

    const fov = camera.fov * (Math.PI / 180);
    let cameraZ = Math.abs((maxDim / 4) * Math.tan(fov * 2));
    cameraZ *= 1.3; 

    camera.position.z = cameraZ;

    const minZ = graphGeometry.boundingBox.min.z;
    const cameraToFarEdge = minZ < 0 ? -minZ + cameraZ : cameraZ - minZ;

    camera.far = cameraToFarEdge * 3;
    camera.updateProjectionMatrix();

    const center = graphGeometry.boundingBox.getCenter();
    camera.lookAt(center);
  }

  const addParticles = (scene, graphGeometry) => {
    const maxDim = getMaxSizeBoundingBox(graphGeometry);

    population.particles.forEach(particle => {
      const geometry = new THREE.SphereGeometry(maxDim * 0.005, 16, 16);
      const material = new THREE.MeshLambertMaterial({ color: 0x530296 });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(
        particle.position[0],
        particle.position[1],
        particle.fitness
      );
      particle.domMeshReference = mesh;
      scene.add(mesh);
    });
  }

  useEffect(() => {
    const width = mount.current.clientWidth;
    const height = mount.current.clientHeight;
    let frameId;
    const segments = 80;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    const renderScene = () => {
      renderer.render(scene, camera);
    };

    renderer.setSize(width, height);
    renderer.setClearColor(0xdddddd, 1);
    renderer.clear();
    scene.add(camera);

    const light = new THREE.PointLight(0xffffff);
    light.position.set(0, 0, 10000);
    scene.add(light);

    // add controls to zoom in/out and rotate
    new OrbitControls(camera, renderer.domElement);

    const graphGeometry = createGraphGeometry(segments);
    plotGraphMesh(scene, graphGeometry, segments);

    zoomToFitScreen(camera, graphGeometry);
    
    // add axes
    const axesHelper = new THREE.AxesHelper(getMaxSizeBoundingBox(graphGeometry));
    scene.add(axesHelper);

    addParticles(scene, graphGeometry);

    const handleResize = () => {
      const width = mount.current.clientWidth;
      const height = mount.current.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderScene();
    };

    const animate = () => {
      renderScene();
      frameId = window.requestAnimationFrame(animate);
    };

    const start = () => {
      if (!frameId) {
        frameId = requestAnimationFrame(animate);
      }
    };

    const stop = () => {
      cancelAnimationFrame(frameId);
      frameId = null;
    };

    mount.current.appendChild(renderer.domElement);
    window.addEventListener("resize", handleResize);
    start();

    return () => {
      stop();
      window.removeEventListener("resize", handleResize);
      mount.current.removeChild(renderer.domElement);

      scene.remove(graphMesh);
      geometry.dispose();
      material.dispose();
    };
  }, []);

  useEffect(() => {
    const updateParticle = function(mesh, coordinates, color) {
      mesh.position.x = coordinates[0];
      mesh.position.y = coordinates[1];
      mesh.position.z = coordinates[2];
      color && mesh.material.color.setHex(color);
    };

    for (let i = 0; i < population.particles.length; i++) {
      // move plotted particles to their next position
      const particle = population.particles[i];
      const coordinates = [...particle.position, particle.fitness];
      updateParticle(particle.domMeshReference, coordinates, particle.isReplaced ? 0xffe100 : null);
    }
  }, [iteration]);

  return (
    <div
      className="vis"
      ref={mount}
      style={{ position: "fixed", top: 0, right: 0, bottom: 0, left: 0 }}
    />
  );
}