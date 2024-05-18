import FlowerAssembly from "../FlowerAssembly/FlowerAssembly"
import { StyledFlowers } from "./Flowers.styled";
import { useState } from 'react'

export default function Flowers({myFlowers}) {
console.log('myFlowers in flowers', myFlowers)

    const flowers = myFlowers.map((flower) => {
        console.log('flower in flower', flower)
        return (
            <>
                <section className="plant-details">
                    <p>this is: {flower.name}</p>
                    <p>{flower.description}</p>
                    <p>they are {Date.now() - parseInt(flower.planted)} miliseconds old</p>
                </section>
                <FlowerAssembly key={flower.id} flower={flower} />
            </>
        )
    })

    return (
        <StyledFlowers>
          {flowers}
        </StyledFlowers>
    )
}
