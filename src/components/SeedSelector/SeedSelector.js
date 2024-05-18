import { StyledSeedSelector } from "./SeedSelector.styled";
import FlowerAssembly from "../FlowerAssembly/FlowerAssembly"
import { useState } from 'react'
import NewPlantForm from "../../NewPlantForm/NewPlantForm";

export default function SeedSelector({ plantFlower, seedlings }) {
    const [ newPlant, setNewPlant ] = useState()

    function handleClick() {
        plantFlower()
    }

    const seedlingComponents = seedlings.map((seedling) => {
        return (
            <FlowerAssembly key={seedling.id} seedling={seedling} flower={null} />
        )
    })

    console.log('seedlings', seedlings)

    return (
        <StyledSeedSelector>
            {seedlingComponents}
            <NewPlantForm plantFlower={plantFlower}/>
        </StyledSeedSelector>
    )
}