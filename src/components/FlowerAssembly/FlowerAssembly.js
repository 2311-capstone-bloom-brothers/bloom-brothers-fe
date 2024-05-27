import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { OrbitControls, Sky, OrthographicCamera, Billboard, Text } from '@react-three/drei';
import { StyledFlowerAssembly } from './FlowerAssembly.styled';
import Receptacle from "./Receptacle";
import Stem from "./Stem";
import { BoxGeometry } from 'three'; // Import BoxGeometry

extend({ BoxGeometry }); // Extend BoxGeometry

function RotatingGroup({ children }) {
    const groupRef = useRef();
    const materialRef = useRef();

    useFrame((state, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += 0.00; // Adjust this value to control the speed of rotation
        }
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value += delta; // Update the time uniform
        }
    });

    return (
        <group ref={groupRef} position={[0, -5, 0]}>
            {children}
            {/* <mesh>
                <boxGeometry args={[2, 2, 2]} />
                <customShaderMaterial ref={materialRef} />
            </mesh> */}
        </group>
    );
}

export default function FlowerAssembly({ flower, seedling }) {
    const [planted, setPlanted] = useState();
    const [topPoint, setTopPoint] = useState(null);
    const [bloomAngle, setBloomAngle] = useState(null);
    const [lifeCycle, setLifeCycle] = useState();
    const [stage, setStage] = useState();
    const [plantAge, setPlantAge] = useState();
    const [currentTime, setCurrentTime] = useState();

    const stages = useMemo(() => ['seedling', 'blooming', 'thriving', 'wilting', 'dead'], []);
    const stageDurations = useMemo(() => lifeCycle / stages.length, [lifeCycle, stages.length]);

    const getCurrentStage = useCallback(() => {
        const timeElapsed = Date.now() - planted;
        const stageIndex = Math.floor(timeElapsed / stageDurations);
        return stages[Math.min(stageIndex, stages.length - 1)];
    }, [planted, stageDurations, stages]);

    useEffect(() => {
        if (flower) {
            const interval = setInterval(() => {
                const age = Date.now() - parseInt(flower.planted);
                setPlantAge(age / 1000);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [flower]);

    useEffect(() => {
        setPlanted(Date.now());
        setLifeCycle(10000);
        setStage('thriving');
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            const timeElapsed = Date.now() - planted;
            const stageIndex = Math.floor(timeElapsed / stageDurations);
            if (stageIndex < stages.length) {
                setCurrentTime(Date.now());
                setStage(getCurrentStage());
            } else {
                setPlanted(Date.now());
                setCurrentTime(Date.now());
                setStage(getCurrentStage());
                console.log(currentTime);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [planted, lifeCycle, getCurrentStage, stageDurations, stages.length, currentTime]);

    const handleTopPoint = (point, angle) => {
        setTopPoint(point);
        setBloomAngle(angle);
    };

    return (
        <StyledFlowerAssembly className='styled-flower-assembly'>
            {seedling && <p className="flower-assembly">here's a sEEDbABY:</p>}
            <Canvas className={seedling ? "seedling" : "flower"} id='flowerCanvas'>
                <ambientLight intensity={1} />
                <directionalLight intensity={10} castShadow position={[2, 1, 5]} shadow-mapSize={[1024, 1024]} />
                <OrthographicCamera makeDefault position={[100, 10, 10]} zoom={30} />
                {seedling && <OrthographicCamera makeDefault position={[100, 1000, 0]} zoom={40} />}
                <OrbitControls />
                <Sky
                    distance={1000000}
                    sunPosition={[0, 0.25, 0]}
                    inclination={0.49}
                    azimuth={0.25}
                    turbidity={1}
                    rayleigh={0.1}
                    mieCoefficient={0.005}
                    mieDirectionalG={1}
                />
                <RotatingGroup className='rotating-group'>
                    {flower &&
                        <>
                    <Billboard className="billboard"
                        follow={true}
                        lockX={false}
                        lockY={false}
                        lockZ={false}
                    >
                        <Text className="sprite-flower-desc" position={[0, 8, 0]} fontSize={0.5} color={'black'}>{flower && flower.description}</Text>
                        <Text className="sprite-flower-name" position={[0, 8.5, 0]} fontSize={0.5} color={'black'}>{flower && flower.name} is {flower && plantAge} sec old</Text>
                    </Billboard>
                            <Receptacle topPoint={topPoint} bloomAngle={bloomAngle} flower={flower.phases[stage]} flowerType={flower.type} />
                            <Stem onTopPointComputed={handleTopPoint} flower={flower.phases[stage]} />
                        </>
                    }
                    {seedling &&
                        <>
                            <Receptacle topPoint={topPoint} bloomAngle={bloomAngle} flower={seedling.phases['seedling']} />
                            <Stem onTopPointComputed={handleTopPoint} flower={seedling.phases['seedling']} />
                        </>
                    }
                </RotatingGroup>
            </Canvas>
        </StyledFlowerAssembly>
    );
}
