import React, { useEffect, useState } from "react";
import * as THREE from "three";

const WIDTH = 2000,
  HEIGHT = 1000,
  VIEW_ANGLE = 50,
  ASPECT = WIDTH / HEIGHT,
  NEAR = 0.1,
  FAR = 100;

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
      initParticles(pso.particles);
    }
  }, [pso]);

  useEffect(() => {
    if (canvasParticles.length) {
      const intervalId = setInterval(() => {
        if (pso.iterationNum < 100) {
          pso.iterate();
          canvasParticles.forEach(particle=>{
              particle.position.x+=1;
          })
        } else {
          clearInterval(intervalId);
        }
      }, 50);
    }
  }, [canvasParticles]);

  const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  const init = () => {
    const container = document.getElementById("functionPloterContainer");
    container.appendChild(renderer.domElement);

    renderer.setSize(WIDTH, HEIGHT);
    renderer.setClearColor(0xdddddd, 1);
    renderer.clear();

    camera.position.set(5, 5, 50);
    scene.add(camera);

    const light = new THREE.PointLight(0xffffff);
    light.position.set(0, 100, 100);
    scene.add(light);
  };

  const animate = () => {
    requestAnimationFrame(animate);
    renderCanvas();
  };

  const renderCanvas = () => {
    renderer.render(scene, camera);
  };

  const initParticles = particles => {
    const particlesToAdd = [];
    particles.forEach(particle => {
      const particleToAdd = createParticle(...particle.position);
      particlesToAdd.push(particleToAdd);
      scene.add(particleToAdd);
    });
    setCanvasParticles(particlesToAdd);
    renderCanvas();
  };

  const createParticle = (x, y, z) => {
    const geometry = new THREE.SphereGeometry(1, 16, 16);
    const material = new THREE.MeshLambertMaterial({ color: 0x00ccff });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    return mesh;
  };

  return <div id={"functionPloterContainer"} />;
};

export default FunctionPlotter;
