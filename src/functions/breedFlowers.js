export default function breedFlowers(plant1, plant2) {
    const babyPlant = { ...plant1 }
    babyPlant.phases.stem = breedComponent(plant1.phases.stem, plant2.phases.stem, plant1.mutationRate, 2)
    babyPlant.phases.bloom = breedComponent(plant1.phases.bloom, plant2.phases.bloom, plant2.mutationRate, 2)
    
    function breedComponent(plant1Component, plant2Component, mutationRate, worldToxicity) {
        console.log(plant2Component)
        const babyPlantComponent = { ...plant1Component }
        const plantProperties = Object.keys(plant1Component)
    
        plantProperties.forEach((property) => {
            babyPlantComponent[property].map((prop, index) => {
                if(Math.random() < 0.5) {
                    babyPlantComponent[property].splice(index, 1, plant2Component[property][index])
                }
            })
            
            if(Math.random() < mutationRate) {
                if(typeof babyPlantComponent[property] === 'number') {
                    babyPlantComponent[property] = babyPlantComponent[property] * worldToxicity
                }
            }
        })
    
        return babyPlantComponent
    }
    
    return babyPlant
}
