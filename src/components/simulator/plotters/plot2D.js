import * as THREE from "three";

const OrbitControls = require("three-orbit-controls")(THREE);

import React, { useEffect, useRef } from "react";

export default function FunctionPlotter2D({ population, ff, iteration }) {
  const mount = useRef(null);

  const getMaxSizeBoundingBox = function(object) {
    const size = object.boundingBox.getSize();
    return Math.max(size.x, size.y, size.z);
  };

  const createGraphGeometry = segments => {
    const xMin = ff.dimensions[0].min;
    const xMax = ff.dimensions[0].max;

    const xRange = xMax - xMin;
    const yFunc = ff.compute;

    const meshFunction = function(x, z, target) {
      x = xRange * x + xMin;
      var y = yFunc(x);
      target.set(x, y, 0);
    };

    const graphGeometry = new THREE.ParametricGeometry(
      meshFunction,
      segments,
      segments
    );

    graphGeometry.computeBoundingBox();

    return graphGeometry;
  };

  const plotGraphMesh = (scene, graphGeometry) => {
    var material = new THREE.LineBasicMaterial({ color: 0x000000 });

    const line = new THREE.Line(graphGeometry, material);
    scene.add(line);

    return line;
  };

  const zoomToFitObject = (camera, graphGeometry) => {
    const maxDim = getMaxSizeBoundingBox(graphGeometry);
    const fov = camera.fov * (Math.PI / 180);
    let cameraZ = Math.abs((maxDim / 4) * Math.tan(fov * 2));

    camera.position.z = cameraZ;

    const minZ = graphGeometry.boundingBox.min.z;
    const cameraToFarEdge = minZ < 0 ? -minZ + cameraZ : cameraZ - minZ;

    camera.far = cameraToFarEdge * 3;
    camera.updateProjectionMatrix();

    const center = graphGeometry.boundingBox.getCenter();
    camera.lookAt(center);
  };

  const addParticles = (scene, graphGeometry) => {
    const maxDim = getMaxSizeBoundingBox(graphGeometry);

    population.individuals.forEach(particle => {
      const geometry = new THREE.SphereGeometry(maxDim * 0.005, 16, 16);
      const material = new THREE.MeshLambertMaterial({ color: 0x000000 });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(particle.position[0], particle.fitness, 0);
      particle.domMeshReference = mesh;
      scene.add(mesh);
    });
  };

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
    light.position.set(0, 0, 1000);
    scene.add(light);

    // add controls to zoom in/out and rotate
    new OrbitControls(camera, renderer.domElement);

    const graphGeometry = createGraphGeometry(segments);
    const graphMesh = plotGraphMesh(scene, graphGeometry);

    zoomToFitObject(camera, graphGeometry);

    // add axes
    const axesHelper = new THREE.AxesHelper(
      getMaxSizeBoundingBox(graphGeometry)
    );

    var colors = axesHelper.geometry.attributes.color;
    colors.setXYZ(1, 165, 165, 165);
    colors.setXYZ(3, 165, 165, 165);

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

      graphMesh.material.dispose();
      graphMesh.geometry.dispose();
      scene.remove(graphMesh);

      population.individuals.forEach(particle => {
        particle.domMeshReference.material.dispose();
        particle.domMeshReference.geometry.dispose();
        scene.remove(particle.domMeshReference);
      });

      renderer.renderLists.dispose();
      mount.current.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    const updateParticle = function(mesh, coordinates, color) {
      if (mesh) {
        mesh.position.x = coordinates[0];
        mesh.position.y = coordinates[1];
        color && mesh.material.color.setHex(color);
      }
    };

    for (let i = 0; i < population.individuals.length; i++) {
      // move plotted particles to their next position
      const particle = population.individuals[i];
      const coordinates = [...particle.position, particle.fitness];
      updateParticle(
        particle.domMeshReference,
        coordinates,
        particle.isReplaced ? 0xffe100 : null
      );
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
