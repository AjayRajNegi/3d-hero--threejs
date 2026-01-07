import gsap from "gsap";
import * as THREE from "three";

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

  //   Material
  const earthMaterial = new THREE.ShaderMaterial({
    vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main(){
        //Position
        vec4 modelPosition = modelMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * viewMatrix * modelPosition;
    
        //Model Normal
        vec3 modelNormal = (modelMatrix * vec4(normal, 0.0)).xyz;

        //Varying
        vUv = uv;
        vNormal = modelNormal;
        vPosition = modelPosition.xyz;
    }
    `,
    fragmentShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main(){
        vec3 viewDirection = normalize(vPosition - cameraPosition);
        vec3 normal = normalize(vNormal);
        gl_FragColor = vec4(normal, 1.0);
    }
    `,
    transparent: true,
  });

  const earth = new THREE.Mesh(earthGeometry, earthMaterial);

  scene.add(earth);

  //   Animation Loop
  gsap.ticker.add((time) => {
    renderer.render(scene, camera);
  });
  gsap.ticker.lagSmoothing(0);

  return { scene };
};

export default initPlanet3D;
