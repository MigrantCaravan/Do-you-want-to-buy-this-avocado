//set up for single component app
import "./App.css";
import * as THREE from "three";
import {
  Canvas,
  useFrame,
  useThree,
  extend,
  useLoader,
} from "react-three-fiber";
import { EffectComposer, DepthOfField, Vignette } from "react-postprocessing";
import { useRef, Suspense } from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Model from "./components/Model";
extend({ OrbitControls });

function Orbit() {
  const { camera, gl } = useThree();
  return <orbitControls args={[camera, gl.domElement]}></orbitControls>;
}

const Box = (props) => {
  const ref = useRef();
  const texture = useLoader(THREE.TextureLoader, "/forest.jpg");
  useFrame((state) => {
    ref.current.rotation.x += 0.01;
    ref.current.rotation.y += 0.01;
  });

  function handlePointerDown(event) {
    event.object.active = true;
    if (window.activeMesh) {
      scaleDown(window.activeMesh);
      window.activeMesh.active = false;
    }
    window.activeMesh = event.object;
  }

  function handlePointerEnter(event) {
    event.object.scale.x = 1.5;
    event.object.scale.y = 1.5;
    event.object.scale.z = 1.5;
  }

  function handlePointerLeave(event) {
    if (!event.object.active) {
      scaleDown(event.object);
    }
  }

  function scaleDown(object) {
    object.scale.x = 1;
    object.scale.y = 1;
    object.scale.z = 1;
  }

  return (
    <mesh
      ref={ref}
      {...props}
      castShadow
      onPointerDown={handlePointerDown}
      onPointerOver={handlePointerEnter}
      onPointerOut={handlePointerLeave}
    >
      <boxBufferGeometry args={[1, 1, 1]} />
      <meshPhysicalMaterial map={texture}></meshPhysicalMaterial>
    </mesh>
  );
};

function Background(props) {
  const texture = useLoader(THREE.TextureLoader, "/garden.jpg");

  const { gl } = useThree();

  const formatted = new THREE.WebGLCubeRenderTarget(
    texture.image.height
  ).fromEquirectangularTexture(gl, texture);
  return <primitive attach="background" object={formatted}></primitive>;
}

function Bulb(props) {
  return (
    <mesh {...props}>
      <pointLight castShadow></pointLight>
      <sphereBufferGeometry args={[0.2, 20, 20]}></sphereBufferGeometry>
      <meshPhongMaterial emissive="yellow"></meshPhongMaterial>
    </mesh>
  );
}

function App() {
  function handleClick(event) {
    if (!window.activeMesh) return;
    window.activeMesh.material.color = new THREE.Color(
      event.target.style.background
    );
  }
  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <div style={{ position: "absolute", zIndex: 1, left: "20%", top: "35%" }}>
        <div
          onClick={handleClick}
          style={{
            height: 400,
            width: 400,
            color: "white",
            fontSize: "50px",
            fontFamily: "Cambria",
          }}
        >
          Do you want to buy this avocado?
        </div>
      </div>
      <Canvas
        shadowMap
        style={{ background: "black" }}
        camera={{ position: [7, 9, 7] }}
      >
        <pointLight position={[10, 10, 10]} />
        <ambientLight intensity={0.5}></ambientLight>
        <Bulb position={[3, 10, 3]}></Bulb>
        <Bulb position={[-3, 10, -3]}></Bulb>
        <Bulb position={[3, -15, -3]}></Bulb>
        <Orbit></Orbit>
        {/* <axesHelper args={[5]}></axesHelper> */}
        <Suspense fallback={null}>
          <Model
            scale={new Array(3).fill(50)}
            path="/food_avocado_01_4k.gltf/food_avocado_01_4k.gltf"
            position={[0, -2, 0]}
          ></Model>
        </Suspense>
        <Suspense fallback={null}>
          <Background></Background>
        </Suspense>
        <EffectComposer>
          <DepthOfField
            focusDistance={0}
            focalLength={0.4}
            bokehScale={2}
            height={480}
          ></DepthOfField>
          {/* <Vignette eskil={false} offset={0.1} darkness={1.1} /> */}
        </EffectComposer>
      </Canvas>
    </div>
  );
}

export default App;
