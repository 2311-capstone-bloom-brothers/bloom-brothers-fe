import React, { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'
import { Noise } from 'noisejs'

function Petals({ color, positionX, positionY, positionZ, flower}) {
const { noiseScale,
        noiseImpactX,
        noiseImpactY,
        noiseImpactZ,
        radiusTop,
        radiusBottom,
        height,
        radialSegments,
        rotation
  } = flower

  const meshRef = useRef()
  const noise = new Noise(123456)
  
  useEffect(() => {
    const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments)

    const positions = geometry.attributes.position.array
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i]
      const y = positions[i + 1]
      const z = positions[i + 2]

      const displacementX = noise.perlin3(x * noiseScale, y * noiseScale, z * noiseScale) * noiseImpactX
      const displacementY = noise.perlin3(x * noiseScale, y * noiseScale, z * noiseScale) * noiseImpactY
      const displacementZ = noise.perlin3(x * noiseScale, y * noiseScale, z * noiseScale) * noiseImpactZ

      positions[i] += displacementX
      positions[i + 1] += displacementY
      positions[i + 2] += displacementZ
    }

    geometry.attributes.position.needsUpdate = true
    geometry.computeVertexNormals()
    geometry.computeBoundingSphere()

    if (meshRef.current) {
      meshRef.current.geometry = geometry
    }
  }, [flower])

  return (
    <mesh
      ref={meshRef}
      rotation={rotation}
      position={[positionX, positionY, positionZ]}
    >
      <meshLambertMaterial attach="material" color={color} />
    </mesh>
  )
}

export default Petals
