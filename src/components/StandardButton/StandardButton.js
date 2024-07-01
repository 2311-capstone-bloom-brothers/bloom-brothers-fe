import './StandardButton.css'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { extend, useFrame } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import { Box3, Vector3 } from 'three';
import { meshTransmissionMaterial, Html } from '@react-three/drei';


import Abril from '../assets/Abril Fatface_Regular.json';

extend({ TextGeometry });

// The breeding functions should come in the form of a closure 
// 
// const breedingFunctions = {
//     toggleBreedMode(),
//     readyToBreed(), 
//     breedFlowers()
// }

export default function StandardButton({ buttonText, goToSeedSelector, breedingFunctions }) {
    const r = Math.PI / 180
    const textRef = useRef(null)

    const font = new FontLoader().parse(Abril);
    const textString = '';

    function handleClick() {
        if (goToSeedSelector) {
            goToSeedSelector()
        }
    }

    return (
        <mesh castShadow receiveShadow
            position={[7, 0, -5]}
            rotation={[0, -Math.PI / 2, 0]}
            renderOrder={0}
            depthTest={false}
            ref={textRef}
        >
            <Html transform zIndexRange={[0, 0]}><button style={{ zIndex: 0 }} className='StandardButton' onClick={handleClick}>{`${buttonText}`}</button></Html>
            <textGeometry args={[textString, { font, size: .5, depth: .2 }]} />
            <meshStandardMaterial color='cyan' />
        </mesh>
    );
}


