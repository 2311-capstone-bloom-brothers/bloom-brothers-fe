import { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sky, OrthographicCamera } from '@react-three/drei';
import { StyledDiv } from './FlowerAssembly.styled';
import Receptacle from "./Receptacle";
import Stem from "./Stem";

function RotatingGroup({ children }) {
    const groupRef = useRef();

    useFrame(() => {
        if (groupRef.current) {
            groupRef.current.rotation.y += 0.005; // Adjust this value to control the speed of rotation
        }
    });

    return <group ref={groupRef} position={[0, -5, 0]}>{children}</group>;
}

export default function FlowerAssembly({ flower, seedling }) {
    const [planted, setPlanted] = useState(Date.now());
    const [currentTime, setCurrentTime] = useState(Date.now());
    const [topPoint, setTopPoint] = useState(null);
    const [bloomAngle, setBloomAngle] = useState(null);
    const [lifeCycle, setLifeCycle] = useState(10000); // Total life cycle duration in milliseconds
    const [stage, setStage] = useState('seedling');
    const [ currentPlants, setCurrentPlants ] = useState(null)

    const stages = ['seedling', 'blooming', 'thriving', 'wilting', 'dead'];
    const stageDurations = lifeCycle / stages.length; // Duration for each stage

    const getCurrentStage = () => {
        const timeElapsed = Date.now() - planted;
        const stageIndex = Math.floor(timeElapsed / stageDurations);
        // console.log(lifeCycle);
        return stages[Math.min(stageIndex, stages.length - 1)];
    };

    // function findCurrentPlantData() {
    //     const stageIndex = Math.floor(timeElapsed / stageDurations);
    //     const percentBetween = Math.round((Date.now - flower.planted - stageIndex) * 100)  
    //     const data1 = getComponentData(flower, 'bloom', stageIndex)
    //     const data2 = getComponentData(flower, 'bloom', stageIndex + 1)
    //     const dataKeys = Object.keys(data1)
    //     const avgData = dataKeys.reduce((acc, dataKey) => {
    //         acc[dataKey] = (data1[dataKey] + (data2[dataKey] - data1[dataKey]) * percentBetween)
        
    //         return acc
    //     }, {})
    // }

    useEffect(() => {
        const interval = setInterval(() => {
            let timeElapsed = Date.now() - planted;
            let stageIndex = Math.floor(timeElapsed / stageDurations);
            if(stageIndex < 5) {
                setCurrentTime(Date.now());
                setStage(getCurrentStage(stageIndex));
            } else {
                stageIndex = 0;
                timeElapsed = Date.now() - planted;
                setPlanted(Date.now());
                setCurrentTime(Date.now());
                setStage(getCurrentStage(stageIndex));
            }
            // console.log(stageIndex);
        }, 1000); // Update every second

        return () => clearInterval(interval);
    }, [planted, lifeCycle]);

    const handleTopPoint = (point, angle) => {
        const bloomAngle = angle - 11;
        setTopPoint(point);
        setBloomAngle(bloomAngle);
    };

    return (
        <StyledDiv>
            {seedling && <p>here's a sEEDbABY:</p>}
            <Canvas className={seedling ? "seedling" : "flower"} id='flowerCanvas'>
                <ambientLight intensity={1} />
                <directionalLight intensity={10} castShadow position={[2, 1, 5]} shadow-mapSize={[1024, 1024]} />
                <OrthographicCamera makeDefault position={[100, 10, 10]} zoom={30} />
                <OrbitControls />
                <Sky
                    distance={450000}
                    sunPosition={[0, 1, 0]}
                    inclination={0.49}
                    azimuth={0.25}
                    turbidity={1}
                    rayleigh={0.1}
                    mieCoefficient={0.005}
                    mieDirectionalG={1}
                />
                <RotatingGroup>
                    {flower &&
                        <>
                            <Receptacle topPoint={topPoint} bloomAngle={bloomAngle} flower={flower.phases[stage]} />
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
        </StyledDiv>
    );
}