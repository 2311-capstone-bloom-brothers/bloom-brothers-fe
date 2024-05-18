import { StyledHome } from "./Home.styled";
import SeedSelector from "../SeedSelector/SeedSelector";
import Flowers from "../Flowers/Flowers";
import * as flowerConverter from '../../functions/convertFlowerObject'
import { useEffect, useState } from "react";
import { seedlingsData } from '../../seedlings-dummy'

export default function Home({ seedlings }) {
    const [ myFlowers, setMyFlowers ] = useState([])
    const [ mySeedlings, setMySeedlings ] = useState()
    const [ background, setBackground ] = useState('1')

    function plantFlower(formData) {
        const newFlower = {
            ...mySeedlings[0],
            name: formData.name,
            description: formData.description,
            planted: Date.now(), //generated in back end
            type: 'flower1'
        }

        // postFlower()
        setMyFlowers(prev => [...prev, newFlower])
    }

    function cleanFlowers(flowers) {
        return flowers.map((flower) => {
            console.log('cleanFlowers', flowerConverter.convertFlowerObject(flower))
            return flowerConverter.convertFlowerObject(flower)
        })
    }

    function getAllFlowers() {
        // getFlowers().then()
        const cleanedFlowers = cleanFlowers(seedlings)
        setMyFlowers(cleanedFlowers)
    }

    function getAllSeedlings() {
        // getFlowers().then()
        console.log('here')
        const cleanedSeedlings = cleanFlowers(seedlingsData)
        setMySeedlings(cleanedSeedlings)
    }

    useEffect(() => {
        console.log('in here')
        // getAllFlowers()
        getAllSeedlings()
    }, [])

    return (
        <StyledHome className={`background${background}`}>
            <h1>bLOOMbABY</h1>
            {myFlowers.length === 0 ?
             mySeedlings && <SeedSelector plantFlower={plantFlower} seedlings={mySeedlings}/>
            :
            <Flowers myFlowers={myFlowers} />}
        </StyledHome>
    )
}