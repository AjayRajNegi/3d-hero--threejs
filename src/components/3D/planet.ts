import gsap from "gsap";
import * as THREE from "three";
const initPlanet = (): { scene: THREE.Scene } => {
  const canvas = document.querySelector(
    "canvas.planet-3D"
  ) as HTMLCanvasElement;

  //   Scene
  const scene = new THREE.Scene();

  const size = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: window.devicePixelRatio,
  };

  //   Camera
  const camera = new THREE.PerspectiveCamera(
    15,
    size.width / size.height,
    0.1,
    10000
  );

  camera.position.x = 0;
  camera.position.y = 0.1;
  camera.position.z = 19;

  scene.add(camera);

  //   Renderer
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(size.width, size.height);
  renderer.setPixelRatio(size.pixelRatio);
  renderer.setClearColor(0x0000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  //   Animation Loop
  gsap.ticker.add((time) => {
    renderer.render(scene, camera);
  });
  gsap.ticker.lagSmoothing(0);

  return { scene };
};

export default initPlanet;
