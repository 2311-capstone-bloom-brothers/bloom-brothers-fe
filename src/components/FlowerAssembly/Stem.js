import React, { useRef, useEffect } from 'react';
import * as THREE from 'three'; // Import THREE
import { TubeGeometry, CatmullRomCurve3, Vector3 } from 'three';
import { CustomShaderMaterial } from '../../functions/CustomShaderMaterial';
import { useFrame } from '@react-three/fiber';

const Stem = ({ onTopPointComputed, flower, color }) => {
  const tubeRef = useRef();
  const materialRef = useRef()
    let topPoint;

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += delta;
    }
  });

  useEffect(() => {
    const wiltPath = new CatmullRomCurve3([
      new Vector3(0.5, 0, 0),
      new Vector3(0.5, 0, 0),
      new Vector3(0.5, 0, 0.56),
      new Vector3(0.1, 4.5, 0.88),
      new Vector3(0.1, 7.46, 1.42),
      new Vector3(0.1, 8.34, 1.08),
      new Vector3(0.1, 8.42, 0),
      new Vector3(0.1, 7.08, -0.26)
    ]);
  }, []);

  useEffect(() => {
    let pointsArray = [];
    flower.path.forEach((path) => {
      pointsArray.push(new Vector3(path[0], path[1], path[2]));
    });

    const pathPoints = new CatmullRomCurve3(pointsArray);
    const tubularSegments = 100;
    const radius = 0.14;
    const radialSegments = 8;
    const closed = false;
        topPoint = pathPoints.getPointAt(1);
    const tubeGeometry = new TubeGeometry(pathPoints, tubularSegments, radius, radialSegments, closed);

    if (tubeRef.current) {
      tubeRef.current.geometry = tubeGeometry;
    }

        if (topPoint) {
            // Calculate the direction and angle at the top of the stem
            const lastPoint = pointsArray[pointsArray.length - 1];
            const secondLastPoint = pointsArray[pointsArray.length - 2];
            const direction = new Vector3().subVectors(lastPoint, secondLastPoint).normalize();
            const angle = Math.atan2(direction.y, direction.x);

            // Pass the top point and angle to the parent component
            onTopPointComputed(topPoint, angle);
        }
    }, [flower]);

  return (
    <mesh ref={tubeRef} position={[0, 0, 0]} rotation={[0, 0, 0]}>
      <customShaderMaterial ref={materialRef} />
    </mesh>
  );
};

export default Stem;
