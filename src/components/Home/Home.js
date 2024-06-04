import { StyledHome } from "./Home.styled";
import SeedSelector from "../SeedSelector/SeedSelector";
import Flowers from "../Flowers/Flowers";
import { Stats, Float, Plane, DragControls, Html, Billboard, useTexture } from '@react-three/drei';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import * as flowerConverter from '../../functions/convertFlowerObject';
import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Debug, Physics, useCylinder, usePlane, useSphere, useSpring, usePointToPointConstraint, useLockConstraint } from '@react-three/cannon';
import { seedlingsData } from '../../models/seedlings'
import { postFlower, getFlowers } from "../../apiCalls";
import Skybox from '../../models/Sky'
import Environment from '../Environment/Environment'
import DraggableObject from '../DraggableObject/DraggableObject'
import { OrbitControls } from "@react-three/drei";

function CameraAnimation() {
  const { camera } = useThree();
  const targetPosition = useRef([-90, 45, 100]);
  const targetZoom = useRef(80);
  const progress = useRef(0);

  useFrame(() => {
    if (progress.current < 1) {
      progress.current += 0.0005;
      camera.position.lerp({ x: targetPosition.current[0], y: targetPosition.current[1], z: targetPosition.current[2] }, progress.current);
      camera.zoom = camera.zoom + (targetZoom.current - camera.zoom) * 0.01;
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
    }
  });

  return null;
}

const PlantNode = React.forwardRef(({ pos }, ref) => {
  const [node, nodeApi] = useSphere(() => ({
    type: 'Static',
    mass: 0,
    args: [0.1],
    position: pos,
  }));

  useEffect(() => {
    if (ref) {
      ref.current = node.current;
      ref.current.isAttached = false
    }
  }, [node, ref]);

  return (
    <mesh visible={false} ref={node}>
      <sphereGeometry args={[0.15]} />
      <meshLambertMaterial />
    </mesh>
  );
});


const Ground = () => {


  let r = Math.PI / 180;

  const [ground] = usePlane(() => ({
    mass: 1,
    type: 'Static',
    position: [0, 0, 0],
    rotation: [-90 * r, 0, 0],
  }));

  const [ceiling] = usePlane(() => ({
    mass: 1,
    type: 'Static',
    position: [0, 10, 0],
    rotation: [90 * r, 0, 0],
  }));

  const [wall1] = usePlane(() => ({
    mass: 1,
    type: 'Static',
    position: [5, 5, 0],
    rotation: [0, -90 * r, 0],
  }));

  const [wall2] = usePlane(() => ({
    mass: 1,
    type: 'Static',
    position: [-5, 5, 0],
    rotation: [0, 90 * r, 0],
  }));

  const [wall3] = usePlane(() => ({
    mass: 1,
    type: 'Static',
    position: [0, 5, -5],
    rotation: [0, 0, 0],
  }));

  const [wall4] = usePlane(() => ({
    mass: 1,
    type: 'Static',
    position: [0, 5, 5],
    rotation: [r * 180, 0, 0],
  }));


  return (
    <group position={[0, 0, 0]}>
      <mesh receiveShadow ref={ground}>
        <planeGeometry args={[10, 10, 256, 256]} />
        <meshLambertMaterial
          color={'green'}
        />
      </mesh>
    </group>
  )
}



export default function Home({ seedlings }) {
  const [myFlowers, setMyFlowers] = useState([]);
  const [mySeedlings, setMySeedlings] = useState();
  const [background, setBackground] = useState('1');
  const [leafDimensions, setLeafDimensions] = useState({ d1: 9, d2: 18, d3: 0, d4: 9, d5: 0, d6: 0, d7: 0, d8: 0, d9: 0, d10: 0, d11: 0, d12: 0, d13: 2, d14: 0.25, d15: 0.25, d16: 0.25 });
  const [numStored, setNumStored] = useState(1);
  const [storedFlowers, setStoredFlowers] = useState([]);
  const [animate, setAnimate] = useState(false);
  const [cameraRotation, setCameraRotation] = useState([0, 0, 0]);
  const lookAtTarget = useRef([0, 0, 0]);
  const lightRef = useRef()

  let r = Math.PI / 180;


  function plantFlower(formData) {
    const newFlower = {
      "name": formData.name,
      "description": formData.description,
      type: 'flower1'
    };

    postFlower(newFlower)
      .then(data => {
        const cleanedNewFlower = flowerConverter.convertFlowerObject(data.data.attributes)

        setMyFlowers(prev => [...prev, cleanedNewFlower])
      })
  }

  function cleanFlowers(flowers) {
    return flowers.map((flower) => {
      return flowerConverter.convertFlowerObject(flower.attributes)
    })
  }


  const getAllSeedlings = () => {
    const cleanedSeedlings = cleanFlowers(seedlingsData)
    setMySeedlings(cleanedSeedlings)
  }

  const getAllFlowers = () => {
    getFlowers()
      .then(data => {
        // const cleanedFlowers = cleanFlowers(data.data)
        // setMyFlowers(cleanedFlowers)
      })
  }

  useEffect(() => {
    getAllSeedlings()
    getAllFlowers()
    setBackground('1')
  }, [])

  function storeFlower() {
    setStoredFlowers(prev => [...prev, { [`flower${numStored}`]: leafDimensions }]);
    setNumStored(prev => prev + 1);
  }

  function handleChange(event) {
    setLeafDimensions(prev => ({
      ...prev,
      [event.target.id]: event.target.value,
    }));
  }

  function handleAnimate() {
    setAnimate(true);
  }

  const positions = [];
  const plantNodes = useMemo(() => {
    const frows = 5;
    const fcolumns = 5;
    const fspacing = 2;
    const frowOffset = (frows - 1) / 2;
    const fcolOffset = (fcolumns - 1) / 2;
    const nodes = [];
    for (let row = -frowOffset; row <= frowOffset; row++) {
      for (let col = -fcolOffset; col <= fcolOffset; col++) {
        const pos = [col * fspacing, -0.1, row * fspacing];
        const nodeRef = React.createRef();
        nodes.push({ id: `${row}${col}`, position: pos, ref: nodeRef });
        positions.push(<PlantNode key={`${row}${col}`} pos={pos} ref={nodeRef} />);
      }
    }
    return nodes;
  }, []);


  const flowerArray = []
  const flowerObjects = useMemo(() => {
    const count = 1
    const nodes = positions
    for (let i = 0; i < count; i++) {
      flowerArray.push(<DraggableObject key={i} leafDimensions={leafDimensions} plantNodes={plantNodes} />)
    }
  }, [])


  // const handleCamera = (e, axis) => {
  //   const value = e.target.value * r; 
  //   setCameraRotation(prev => {
  //     const newRotation = [...prev];
  //     if (axis === 'x') newRotation[0] = value;
  //     if (axis === 'y') newRotation[1] = value;
  //     if (axis === 'z') newRotation[2] = value;
  //     return newRotation;
  //   });
  // };

  // console.log('myFlowers', myFlowers)

  return (
    <StyledHome className={`home ${background}`}>
      <button onClick={handleAnimate}>Animate Camera</button>
        <Canvas  id="canvas" style={{ background: 'skyblue' }} shadows orthographic camera={{ zoom: 80, position: [0, 20, 100] }}>
        {/* {myFlowers.length === 0 ?
          mySeedlings && <SeedSelector onPointerDown={() => {console.log('clicked in Seed Selector')}} className="seed-selector" plantFlower={plantFlower} seedlings={mySeedlings} />
          :
          <Flowers className="flowers" myFlowers={myFlowers} />
        } */}
        {/* {/* <Stats showPanel={0} className="stats" /> */}
        <Physics onClick={(e) => {console.log('clicked physics', e.target)}} gravity={[0, -0.8, 0]}>
          {
            mySeedlings && <SeedSelector onClick={(e) => {console.log('clicked ss', e.target)}} className="seed-selector" plantFlower={plantFlower} seedlings={mySeedlings} />
          }
          {animate && <CameraAnimation />}
          <ambientLight intensity={1} position={[0, 2, 0]} />
          <pointLight position={[-2, 20, 10]} intensity={30} />
          <directionalLight castShadow ref={lightRef} position={[-2, 20, 10]} intensity={1} />
          {lightRef.current && <directionalLightHelper args={[lightRef.current, 5, 'red']} />}
          <Skybox />
          {/* <group>  
            <Debug>
            {positions}
            {flowerArray}
            </Debug>
          </group> */}
          <Ground />
        </Physics>
      </Canvas>
    </StyledHome>
  );
}
