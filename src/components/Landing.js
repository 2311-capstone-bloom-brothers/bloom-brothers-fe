import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { extend, useFrame } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import { Vector3 } from 'three';
import { Float, Html } from '@react-three/drei';
import './Text.css';

import Abril from '../assets/Abril Fatface_Regular.json';

extend({ TextGeometry });

export default function Text({ startGame }) {
    const groupRef = useRef(null);
    const r = Math.PI / 180;

    const textRefs = [
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
    ];

    const font = new FontLoader().parse(Abril);

    useEffect(() => {
        textRefs.forEach(ref => {
            if (ref.current) {
                const geometry = ref.current.geometry;
                geometry.computeBoundingBox();
                const boundingBox = geometry.boundingBox;
                const center = new Vector3();
                boundingBox.getCenter(center);
                geometry.translate(-center.x, -center.y, -center.z);
            }
        });
    }, [textRefs]);

    useFrame(() => {
        textRefs.forEach((ref, index) => {
            if (ref.current) {
                const rotationSpeed = 0.01;
                if ((ref.current.rotation.y < Math.PI + .01) && (ref.current.rotation.y > -Math.PI)) {
                    ref.current.rotation.y += (index % 2 === 0 ? 1 : -1) * rotationSpeed;
                    ref.current.rotation.x += (index % 3 === 0 ? 1 : -1) * rotationSpeed;
                    ref.current.rotation.z += (index % 4 === 0 ? 1 : -1) * rotationSpeed;
                }
            }
        });
    });

    const textStrings = ['b', 'L', 'O', 'O', 'M', 'b', 'A', 'B', 'Y'];
    const colors = [
        '#FF6F61', '#FFB347', '#ffeb3b', '#9ACD32', '#00CED1',
        '#f441a5', '#FFB347', '#FFD700', '#9ACD32'
    ]
    const radius = 4;
    const angleStep = (2 * Math.PI) / textStrings.length;

    function handleClick() {
        startGame();
    }

    return (
        <group position={[0, 0, 0]} ref={groupRef}>
            {textStrings.map((text, index) => {
                const angle = (Math.PI - Math.PI / 10) - index * angleStep;
                const x = radius * Math.cos(angle);
                const y = radius * Math.sin(angle);
                return (
                    <Float
                        speed={10}
                        rotationIntensity={.04}
                        floatIntensity={.06}
                        key={index}
                    >
                        <mesh castShadow receiveShadow
                            position={[x, y, 0]}
                            ref={textRefs[index]}
                        >
                            <textGeometry args={[text, { font, size: 1, depth: 0.73 }]} />
                            <meshStandardMaterial color={colors[index % colors.length]} />
                        </mesh>
                    </Float>
                );
            })}
            <Float
                speed={10}
                rotationIntensity={.04}
                floatIntensity={.06}
            >
                <mesh castShadow receiveShadow
                    position={[0, 0, 0]}
                    rotation={[0, 0, 0]}
                >
                    <Html transform>
                        <button className='select-new-seed-button start-button' onClick={handleClick}>Get<br/>Planting!</button>
                    </Html>
                
                </mesh>
            </Float>
        </group>
    );
}
