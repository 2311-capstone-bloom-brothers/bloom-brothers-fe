import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { extend, useFrame } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import { Box3, Vector3 } from 'three';
import { meshTransmissionMaterial, Html } from '@react-three/drei';
import './Text.css'

import Abril from '../assets/Abril Fatface_Regular.json';

extend({ TextGeometry });

export default function BreedButton({ toggleBreedMode, readyToBreed, breedFlowers }) {
  const r = Math.PI / 180
  const textRef = useRef(null)

  const font = new FontLoader().parse(Abril);
  const textString = '';

  function handleClick() {
    if (readyToBreed) {
      breedFlowers()
    } else {
      toggleBreedMode()
    }
  }

  return (
    <mesh castShadow receiveShadow
      position={[7, 0, 0]}
      rotation={[0, -Math.PI / 2, 0]}
      renderOrder={0}
      depthTest={false}
      ref={textRef}
    >
      <Html transform><button className='select-new-seed-button breed-button' onClick={handleClick}>
        {readyToBreed ? 'BREED!!!!!' : 'select plants to breed'}</button></Html>
      <textGeometry args={[textString, { font, size: .5, depth: .2 }]} />
      <meshStandardMaterial color='cyan' />
    </mesh>
  );
}
