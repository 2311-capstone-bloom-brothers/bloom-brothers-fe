import { Sphere } from "@react-three/drei";
import Petals from "./Petals";
import Dahlia from "./Dahlia";
import { useEffect, useState, useRef, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import { CustomShaderMaterial } from '../../functions/CustomShaderMaterial';

const Receptacle = ({ flower, topPoint, bloomAngle, flowerType }) => {
    const [receptRadius, setReceptRadius] = useState();
    const [flowerPetals, setFlowerPetals] = useState();
    const [attachPoint, setAttachPoint] = useState();
    const [scale, setScale] = useState();
    const materialRef = useRef();


    useFrame((state, delta) => {
        // if (materialRef.current) {
        //     materialRef.current.uniforms.uTime.value += delta; // Update the time uniform
        // }
    });

    useEffect(() => {
        if (topPoint) {
            setAttachPoint(topPoint);
        }
    }, [topPoint]);

    const generatePetals = useCallback(() => {
        if (flower) {
            const petalArray = []
            if(flowerType === "flower1"){
                const colorArray = ['blue'];
                let c = 0;

                for (let i = 0; i < flower.petalCount; i += 1) {
                    petalArray.push(
                        <Petals
                            key={i}
                            positionX={0}
                            positionY={0}
                            positionZ={0}
                            rotationX={0}
                            rotationY={i + 10}
                            rotationZ={0}
                            color={colorArray[c]}
                            flower={flower}
                            flowerType={flowerType}
                        />
                    );
                    c = (c + 1) % colorArray.length;
                }
                setFlowerPetals(petalArray);
                setReceptRadius(flower.recRadius);
            } else if(flowerType === "flower2") {
                const newDahlia = <Dahlia flower={flower} />
                setFlowerPetals(newDahlia)
        }
            setScale(1);
        }

    }, [flower]);
    
    useEffect(() => {
        generatePetals();
    }, [flower, generatePetals]);
    
    if (materialRef.current) {
        materialRef.current.uniforms.uColor.value.set('yellow');
    }
    return (
        <>
            <group scale={scale} position={attachPoint} rotation={[bloomAngle, 0, 0]}>
                {flowerPetals && flowerPetals}
                {attachPoint && (
                    <Sphere position={[0, 0, 0]} args={[receptRadius+0.1]}>
                        {/* <meshStandardMaterial color="yellow" /> */}
                        <customShaderMaterial ref={materialRef} />
                    </Sphere>
                )}
            </group>
        </>
    );
};

export default Receptacle;
