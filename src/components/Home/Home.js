import { StyledHome } from "./Home.styled";
import SeedSelector from "../SeedSelector/SeedSelector";
import Flowers from "../Flowers/Flowers";
import * as flowerConverter from '../../functions/convertFlowerObject';
import { useEffect, useState, useCallback } from "react";
import { seedlingsData } from '../../seedlings-dummy';
import { userFlowers } from '../../userFlowers-dummy';
import { postFlower } from '../../apiCalls'

export default function Home({ seedlings }) {
    const [myFlowers, setMyFlowers] = useState([]);
    const [mySeedlings, setMySeedlings] = useState();
    const [background, setBackground] = useState('1');


    function plantFlower(formData) {
        const newFlower = {
            ...mySeedlings[0],
            name: formData.name,
            description: formData.description,
            planted: Date.now(), //generated in back end
            type: 'flower1'
        };

        postFlower(newFlower)
        .then(data => {
            console.log('data', data)
            // setMyFlowers(prev => [...prev, data.flower]);
        })

        
    }

    function cleanFlowers(flowers) {
        return flowers.map((flower) => {
            return flowerConverter.convertFlowerObject(flower);
        });
    }

    // Memoize getAllSeedlings function using useCallback
    const getAllSeedlings = useCallback(() => {
        const cleanedSeedlings = cleanFlowers(seedlingsData);
        setMySeedlings(cleanedSeedlings);
    }, []);

    // useEffect(() => {
    //     getAllSeedlings();
    //     setBackground('1');
    // }, [getAllSeedlings]);

    useEffect(() => {
        const cleanedFlowers = cleanFlowers(userFlowers)
        setMyFlowers([cleanedFlowers[5]]);
    }, [myFlowers]);

    return (
        <StyledHome className={`styled-home ${background}`}>
            <div className='background-container'>
                <img src={'/assets/waver-background.jpg'} alt='background waves'></img>
            </div>
            {/* <div className='background-container-2'>
                <img src={'/assets/waver-background.jpg'} alt='background waves'></img>
            </div> */}
            <h1>bLOOMbABY</h1>
            {myFlowers.length === 0 ?
                mySeedlings && <SeedSelector className="seed-selector" plantFlower={plantFlower} seedlings={mySeedlings} />
                :
                <Flowers className="flowers" myFlowers={myFlowers} />
            }
        </StyledHome>
    );
}
