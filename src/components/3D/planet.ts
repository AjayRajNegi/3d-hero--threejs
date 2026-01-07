import gsap from "gsap";
import * as THREE from "three";

import earthVertex from "./shaders/earth/vertex.glsl";
import earthFragment from "./shaders/earth/fragment.glsl";

const initPlanet3D = (): { scene: THREE.Scene } => {
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

  //   Geometry
  const earthGeometry = new THREE.SphereGeometry(2, 64, 64);

  // texture
  const TL = new THREE.TextureLoader();
  const dayTexture = TL.load("../../earth/day.jpg");
  const nightTexture = TL.load("../../earth/night.jpg");
  const specularCloudsTexture = TL.load("../../earth/specularClouds.jpg");

  dayTexture.colorSpace = THREE.SRGBColorSpace;
  nightTexture.colorSpace = THREE.SRGBColorSpace;

  const baseAnisotropy = renderer.capabilities.getMaxAnisotropy();

  dayTexture.anisotropy = baseAnisotropy;
  specularCloudsTexture.anisotropy = baseAnisotropy;
  nightTexture.anisotropy = baseAnisotropy;

  //   Material
  const earthMaterial = new THREE.ShaderMaterial({
    vertexShader: earthVertex,
    fragmentShader: earthFragment,
    transparent: true,
    uniforms: {
      uDayTexture: { value: dayTexture },
      uNightTexture: { value: nightTexture },
      uSpecularCloudsTexture: { value: specularCloudsTexture },
      uSunDirection: { value: new THREE.Vector3(-1, 0, 0) },
      uAtmosphereDayColor: { value: new THREE.Color(0x87ceeb) },
      uAtmosphereTwilightColor: { value: new THREE.Color(0xff8c00) },
    },
  });

  const earth = new THREE.Mesh(earthGeometry, earthMaterial);
  let sunSpherical = new THREE.Spherical(1, Math.PI * 0.48, -1.0);
  const sunDirection = new THREE.Vector3();

  sunDirection.setFromSpherical(sunSpherical);
  earthMaterial.uniforms.uSunDirection.value.copy(sunDirection);

  scene.add(earth);

  //   Animation Loop
  gsap.ticker.add((time) => {
    earth.rotation.y = time * 0.2;
    renderer.render(scene, camera);
  });
  gsap.ticker.lagSmoothing(0);

  window.addEventListener("resize", () => {
    size.width = window.innerWidth;
    size.height = window.innerHeight;
    size.pixelRatio = window.devicePixelRatio;

    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();

    renderer.setSize(size.width, size.height);
    renderer.setPixelRatio(size.pixelRatio);
  });

  return { scene };
};

export default initPlanet3D;
