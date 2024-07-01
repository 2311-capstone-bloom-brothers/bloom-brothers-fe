export default function reverseConvertPlantObj(plant) {
    const phases = ['seedling', 'blooming', 'thriving', 'wilting', 'dead'];
    const newPhases = {
      stem: {
        stemColor: [],
        stemWidth: [],
        path: []
      },
      bloom: {
        bloomColor: [],
        petalCount: [],
        noiseScale: [],
        noiseImpactX: [],
        noiseImpactY: [],
        noiseImpactZ: [],
        depth: [],
        rotIncX: [],
        rotIncY: [],
        rotIncZ: [],
        scaleX: [],
        scaleY: [],
        scaleZ: [],
      }
    };
  
    phases.forEach(phase => {
      const phaseData = plant.phases[phase];
      console.log(phaseData)
  
      newPhases.stem.stemColor.push(phaseData.stemColor);
      newPhases.stem.stemWidth.push(phaseData.stemWidth);
      newPhases.stem.path.push(phaseData.path);
  
      newPhases.bloom.bloomColor.push(phaseData.color);
      newPhases.bloom.petalCount.push(1); // Assuming petalCount is always 1
      newPhases.bloom.noiseScale.push(phaseData.noiseScale);
      newPhases.bloom.noiseImpactX.push(phaseData.noiseImpactX);
      newPhases.bloom.noiseImpactY.push(phaseData.noiseImpactY);
      newPhases.bloom.noiseImpactZ.push(phaseData.noiseImpactZ);
      newPhases.bloom.depth.push(phaseData.depth);
      newPhases.bloom.rotIncX.push(phaseData.rotIncX);
      newPhases.bloom.rotIncY.push(phaseData.rotIncY);
      newPhases.bloom.rotIncZ.push(phaseData.rotIncZ);
      newPhases.bloom.scaleX.push(phaseData.scaleX);
      newPhases.bloom.scaleY.push(phaseData.scaleY);
      newPhases.bloom.scaleZ.push(phaseData.scaleZ)
    });
  
    return {
      name: plant.name,
      id: plant.id,
      description: plant.description,
      phases: newPhases,
      lifespan: plant.lifespan,
      planted: plant.planted,
      position: plant.position
    };
  }