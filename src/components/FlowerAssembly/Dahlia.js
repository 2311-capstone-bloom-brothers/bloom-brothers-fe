import React, { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { Noise } from 'noisejs';
import { useFrame } from '@react-three/fiber';

function Dahlia({ rotationX = 0, rotationY = 0, rotationZ = 0, scale = [0.25, 0.25, 0.25], flower}) {
  const leafRefs = useRef([]);
  const groupRef = useRef(null);

  const leafShapes = Array.from({ length: flower.d13 }, () => new THREE.Shape());

  let xRotInc = flower.d9
  let yRotInc = Math.PI / (leafShapes.length / 2) + flower.d11
  let zRotInc = flower.d10

  for(var i = 0; i < flower.d13; i++) {
    if(i%2 === 0) {
        const controlPointX = flower.d1;
        const controlPointY = flower.d2;
        const endPointX = flower.d3;
        const endPointY = flower.d4;

        const curve = new THREE.QuadraticBezierCurve(
            new THREE.Vector2(0, 0),
            new THREE.Vector2(controlPointX, controlPointY),
            new THREE.Vector2(endPointX, endPointY)
        );

        const points = curve.getPoints(100);
        leafShapes[i] = new THREE.Shape().setFromPoints(points);
    } else {
      leafShapes[i].quadraticCurveTo(0-flower.d1, flower.d2, flower.d3, flower.d4)
    }
  }


  const leafGeometry1 = new THREE.ExtrudeGeometry(leafShapes[0], {
      steps: 35,
      depth: flower.d12,
      bevelEnabled: true,
      bevelSize: 0.5,
      bevelOffset: 0.5,
      // bevelSegments: 5,
      // bevelThickness: 5
    })
  
  //   function euclideanDistance(x1, y1, z1, x2, y2, z2) {
  //     const dx = x2 - x1;
  //     const dy = y2 - y1;
  //     const dz = z2 - z1;
  //     return Math.sqrt(dx * dx + dy * dy + dz * dz);
  // }
  
  // function getNearestPoint(x, y, z, points) {
  //     let minDistance = Infinity;
  //     for (let i = 0; i < points.length; i++) {
  //         const [px, py, pz] = points[i];
  //         const distance = euclideanDistance(x, y, z, px, py, pz);
  //         minDistance = Math.min(minDistance, distance);
  //     }
  //     return minDistance;
  // }
  
  // function worleyNoise3D(x, y, z, numPoints) {
  //     // Generate random points in 3D space
  //     const points = [];
  //     for (let i = 0; i < numPoints; i++) {
  //         points.push([Math.random(), Math.random(), Math.random()]);
  //     }
  
  //     // Calculate distance to nearest point
  //     return getNearestPoint(x, y, z, points);
  // }



  const noise = new Noise();

  const positions = leafGeometry1.getAttribute('position');

  let noiseScale = flower.d5
  let xNoise = flower.d6
  let yNoise = flower.d7
  let zNoise = flower.d8

  for (let i = 0; i < positions.count; i++) {
      const vertex = new THREE.Vector3();
      vertex.fromBufferAttribute(positions, i);

      const noiseValue = noise.simplex3(vertex.x * 0.1, vertex.y * 0.1, vertex.z * 0.1);
      // const noiseValue = worleyNoise3D(vertex.x * 0.1, vertex.y * 0.1, vertex.z * 0.1, 10);
      vertex.x += noiseValue * xNoise * noiseScale; // Adjust the amplitude of the noise here
      vertex.y += noiseValue * yNoise * noiseScale;
      vertex.z += noiseValue * zNoise * noiseScale;

      positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
  }

  positions.needsUpdate = true;


  return (
    <>
      <group ref={groupRef}>
        {Array.from({ length: flower.d13 }, (_, index) => (
          <mesh
            key={index}
            ref={(ref) => (leafRefs.current[index] = ref)}
            rotation={[rotationX + index * xRotInc, rotationY + index * yRotInc, rotationZ + index * zRotInc]}
            scale={scale}
          >
            <bufferGeometry attach="geometry" {...leafGeometry1} />
            <meshNormalMaterial
              color={index%2 === 0 ? "orange" : "blue"}
                roughness='0.9'
                wireframe='true' // Render the mesh in wireframe mode to emphasize contours
                wireframeLinewidth='2'
              />
          </mesh>
        ))}
      </group>
    </>
  );
}

export default Dahlia;
