import React from "react";
import { useRef } from "react";
import { useLoader, useFrame } from "react-three-fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default function Model(props) {
  const model = useLoader(GLTFLoader, props.path);
  const ref = useRef();
  useFrame((state) => {
    ref.current.rotation.y += 0.01;
  });
  return <primitive ref={ref} {...props} object={model.scene}></primitive>;
}
