import React, { useEffect, useState } from "react";
import * as THREE from "three";
const OrbitControls = require('three-orbit-controls')(THREE);


const WIDTH = window.innerWidth,
  HEIGHT = window.innerHeight,
  VIEW_ANGLE = 90,
  ASPECT = WIDTH / HEIGHT,
  NEAR = 50,
  FAR = 0;

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
        if (pso.iterationNum < 200) {
          pso.iterate();
          for (let i = 0; i < pso.particles.length; i++) {
              if(canvasParticles[i]){
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

    camera.position.set(1, 1, 60);
    scene.add(camera);

    const light = new THREE.PointLight(0xffffff);
    light.position.set(0, 100, 100);
    scene.add(light);

    const axesHelper = new THREE.AxesHelper( 100 );
    scene.add( axesHelper );

    new OrbitControls( camera, renderer.domElement );
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
      const particleToAdd = createParticle(...particle.position, particle.fitness);
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

  const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  return <div id={"functionPloterContainer"} />;
};

export default FunctionPlotter;
