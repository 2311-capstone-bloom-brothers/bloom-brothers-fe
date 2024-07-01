import React, { useRef, useEffect, useState, useMemo } from 'react';
import * as THREE from 'three';
import { TubeGeometry, CatmullRomCurve3, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import { useCompoundBody, useSphere, useCylinder, useBox, usePointToPointConstraint, useLockConstraint, useDistanceConstraint, useSpring, useConeTwistConstraint } from '@react-three/cannon';
import { Noise } from 'noisejs';
import { Billboard, MeshWobbleMaterial, Text } from '@react-three/drei'
import { Html } from '@react-three/drei';
import {deleteFlower} from '../apiCalls'
import './Flower.css'
import { SquigglyWiggly } from '../functions/SquigglyWiggly';
import FlowerMenu from '../components/FlowerMenu';


const Flower1 = ({ flower, stage, pos, deleteThisFlower, canDelete, usePhysics, selectFlowerToBreed, breedMode, isDragging, setBreedMode, setFlowerToBreed, setSpotlightPos, breed }) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const springRestLength = 1;
  const springStiffness = 100;
  const springDamping = 10;

  const [topPoint, setTopPoint] = useState([0, 0, 0]);

  const noise = useMemo(() => new Noise(123456), [])

  // currentStage is a string and is the name of the stage
  // nextStageData is an object with the flower data
  // currentStageData is an object with the flower data

  const [currentStage, setCurrentStage] = useState(null)
  const [nextStage, setNextStage] = useState(null)
  const [currentStageData, setCurrentStageData] = useState(null)
  const [nextStageData, setNextStageData] = useState(null)
  const [flowerPosition, setFlowerPosition] = useState(null)
  const [stemHeight, setStemHeight] = useState(0.25)
  const [bloomColor, setBloomColor] = useState([0,255,0]) 
  const [flowerId, setFlowerId] = useState()
  const [receptacleRadius, setReceptacleRadius] = useState(0.16)
  const recRef = useRef()
  const bloomRef = useRef()
  const [canBeDeleted, setCanBeDeleted] = useState(false)
  const [ selectedToBreed, setSelectedToBreed ] = useState(false)
  const [flowerPhases, setFlowerPhases] = useState(['seedling', 'blooming', 'thriving', 'wilting', 'dead'])
  const [targetDuration, setTargetDuration] = useState(flower.lifespan / 1000)
  const [displayMenu, setDisplayMenu] = useState(false)
  const [allowMenu, setAllowMenu] = useState(false)

  console.log("breedMode in flower 1", breedMode)

  useEffect(() => {
    
    if (!stage) {

      let foundStage = Math.floor((Math.floor(Date.now() / 1000) - flower.planted) / targetDuration)
      if (foundStage > 3) {
        foundStage = 4
      }
      setCurrentStageData(flower.phases[flowerPhases[foundStage]])
      if (foundStage === 4) {
        setNextStageData(flower.phases[flowerPhases[4]])
        setNextStage(flowerPhases[4])
      } else {
        setNextStageData(flower.phases[flowerPhases[foundStage + 1]])
        setNextStage(flowerPhases[foundStage + 1])
      }
      setCurrentStage(flowerPhases[foundStage])
    } else {
      
    }
    
    if(flower.phases && currentStage){
      // const stageIndex = flowerPhases.indexOf(stage)
      setBloomColor(...flower.phases[currentStage].color)
    }

    if(flower){
      setFlowerId(flower.id)
    }
      //flower, stage, currentStage, targetDuration, flowerPhases
  }, [flower, stage, currentStage, targetDuration, flowerPhases])


  useEffect(() => {
    let height = 0
    if (currentStageData && !stage) {
      for (let i = 0; i < currentStageData.path.length; i++) {
        height += currentStageData.path[i][1]
      }
      setStemHeight(currentStageData.path[currentStageData.path.length-1][1] /1.5) 
    }
    if(currentStageData && currentStage.recRadius){
      setReceptacleRadius(currentStage.recRadius)
    }
    //currentStageData, currentStage, stage
  }, [currentStageData, currentStage, stage])

  useEffect(() => {
    if(currentStageData && bloomRef.current){
      const {noiseImpactX, noiseImpactY, noiseImpactZ} = currentStageData
      const noiseScale = currentStageData.noiseScale * 0.05
      const positions = bloomRef.current.geometry.attributes.position.array
      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const y = positions[i + 1];
        const z = positions[i + 2];

        positions[i] += (noise.perlin3(x * noiseScale, y * noiseScale, z * noiseScale) * noiseImpactX);
        positions[i + 1] += (noise.perlin3(x * noiseScale, y * noiseScale, z * noiseScale) * noiseImpactY);
        positions[i + 2] += (noise.perlin3(x * noiseScale, y * noiseScale, z * noiseScale) * noiseImpactZ);
      }

      bloomRef.current.geometry.attributes.position.needsUpdate = true
      bloomRef.current.geometry.computeVertexNormals()
    }
    //currentStageData, noise
  }, [currentStageData, noise])

  const [flowerObj, flowerObjApi] = useCompoundBody(() => ({
    mass: usePhysics? 0.1 : 0,
    type: 'Static',
    position: flowerPosition ? flowerPosition : [0, 0, 0],
    shapes: [
      {
        type: 'Sphere',
        args: [
          currentStageData ? currentStageData.recRadius : 0.16,
          32,
          32
        ]
      },
      {
        type: 'Cylinder',
        args: [
          currentStageData ? currentStageData.radiusTop : 0.2,
          currentStageData ? currentStageData.radiusBottom : 0.2,
          0.1
        ]
      },
      {
        type: 'Cylinder',
        args: [
          currentStageData ? currentStageData.stemWidth : 0.01,
          currentStageData ? currentStageData.stemWidth : 0.01,
          stemHeight,
          32]
      }
    ]
  }));

  useEffect(() => {
    if (pos && currentStageData) {
      // setFlowerPosition([pos[0], pos[1], pos[2]]);
      flowerObjApi.position.set(pos[0], pos[1], pos[2])
      flowerObj.current.positon = [pos[0], pos[1], pos[2]]
    }
  
  }, [pos, currentStageData, flowerObj, flowerObjApi.position]);

  

  useEffect(() =>{
    if(bloomColor){
      let r,g,b
      const getRandomColor = () => {
        let min = 0
        let max = 1
        return Math.random() * (max - min + 1) + min;
      }
      
      r = getRandomColor()
      g = getRandomColor()
      b = getRandomColor() 
      
      bloomRef.current.material.color.setRGB(r,g,b)
    }    
    
  }, [bloomColor])
  

const handleClick = () =>{
    displayMenu ? setDisplayMenu(false) : setDisplayMenu(true)
  }

  return (
    <group position={pos}>
     {displayMenu && flower.name &&
      <FlowerMenu flower={flower} breedMode={breedMode} currentStage={currentStage} setBreedMode={setBreedMode} pos={pos} setFlowerToBreed={setFlowerToBreed} setSpotlightPos={setSpotlightPos} breed={breed} />
     }
      <mesh onClick={(e) => {
            handleClick()
          }}
          castShadow
          position={[0,stemHeight,0]}
          receiveShadow >
        <sphereGeometry args={[
          receptacleRadius,
          32,
          32
        ]} />    
        <meshStandardMaterial color="yellow" />
      </mesh>
      <mesh onClick={(e) => {
              handleClick()
            }}
            ref={bloomRef}
            castShadow
            position={[0,stemHeight,0]}
            receiveShadow >
        <cylinderGeometry args={[
          currentStageData ? currentStageData.radiusTop : 0.2,
          currentStageData ? currentStageData.radiusTop : 0.2,
          0.01
        ]} />
        <MeshWobbleMaterial 
        depth={10} 
        color={'blue'} 
        attach="material"
        speed={1}
        factor={0.6}
        roughness={10}
        metalness={0}
        wireframe={false}
        />
      </mesh>
      <mesh onClick={(e) => {
            handleClick()
            }}
            castShadow
            position={[0,stemHeight / 2,0]}
            receiveShadow>
        <cylinderGeometry args={[
          currentStageData ? currentStageData.stemWidth * 0.1 : 0.01,
          currentStageData ? currentStageData.stemWidth * 0.1 : 0.01,
          stemHeight,
          32]} />
        <MeshWobbleMaterial color="green" />
      </mesh>
    </group>
  );
};

export default Flower1;