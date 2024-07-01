import React from 'react'
import { Root, Container } from "@react-three/uikit";
import { Html, Billboard } from '@react-three/drei';
import './FlowerMenu.css'
import { useState, useEffect } from 'react';
import { deleteFlower } from '../apiCalls';

const FlowerMenu = ({flower, currentStage, setBreedMode, pos, setFlowerToBreed, setSpotlightPos, breedMode, breed}) => {
    const [infoDisplay, setInfoDisplay] = useState(true)
    const [compostDisplay, setCompostDisplay] = useState(false)
    const [breedDisplay, setBreedDisplay] = useState(false)
    const [thisFlower, setThisFlower] = useState(flower)
    const [flowerStage, setFlowerStage] = useState(currentStage)
    const [activeButton, setActiveButton] = useState('infoButton')

    const handleDisplay = (e) => {
        switch(e.target.id){
            case 'compostButton': {
                setCompostDisplay(true)
                setInfoDisplay(false)
                setBreedDisplay(false)
                }
            break;
            case 'infoButton': {
                setCompostDisplay(false)
                setInfoDisplay(true)
                setBreedDisplay(false)
                }
            break;
            case 'breedButton': {
                setCompostDisplay(false)
                setInfoDisplay(false)
                setBreedDisplay(true)
                }
            break;
        }

        setActiveButton(e.target.id)
    }

  return (
    <group position={[-1.7,5,0]}>
        {!breedMode ? 
            <Html >
                <span className='button-form'>
                    <img className={activeButton === 'compostButton' ? 'menu-buttons, active': 'menu-buttons'} id='compostButton' src={'/assets/compostButton.svg'} onClick={(e) => handleDisplay(e)}></img>
                    <img className={activeButton === 'infoButton' ? 'menu-buttons, active': 'menu-buttons'} id='infoButton' src={'/assets/infoButton.svg'} onClick={(e) => handleDisplay(e)}></img>
                    <img className={activeButton === 'breedButton' ? 'menu-buttons, active': 'menu-buttons'} id='breedButton' src={'/assets/breedButton.svg'} onClick={(e) => handleDisplay(e)}></img>
                </span>
            <group >
                {infoDisplay && <PlantInfo className='display-group' flower={thisFlower} currentStage={flowerStage} />}
                {compostDisplay && <CompostPlant flower={thisFlower}/>}
                {breedDisplay && <BreedPlant flower={thisFlower} setBreedMode={setBreedMode} pos={pos} setFlowerToBreed={setFlowerToBreed} setSpotlightPos={setSpotlightPos}/>}
            </group>
            </Html>
            :
            <Html>
                <BreedSelect flower={flower} breed={breed}/>
            </Html>
        }
    </group>
  )
}

export default FlowerMenu 


const PlantInfo = ({flower, currentStage}) => {
    const timeStamp = new Date(flower.planted * 1000)
    const plantedDate = timeStamp.toLocaleDateString()

    return(
    <>
        <div className='menu-text-container'>
                <h3 className='menu-h3'>{flower.name}</h3>
                <p className='menu-p'>{flower.description}</p>
                <p className='menu-p'>{plantedDate}</p>
                <p className='menu-p'>{currentStage}</p>
        </div>
    </>
    
    )
}

const CompostPlant = ({flower}) => {
    
    return(
    <>
        <div className='menu-text-container'>
                <h3 className='menu-h3'>Would you like to compost {flower.name}?</h3>
                <p className='menu-p'>This will permanently remove 
                this plant from your garden.</p>
        </div>
        <button className='compost-button' onClick={() => deleteFlower(flower.id)} >cOMPOST</button>
    </>
    
    )
}

const BreedPlant = ({flower, setBreedMode, pos, setFlowerToBreed, setSpotlightPos, breed}) => {

    const handleClick = () => {
        setBreedMode(true)
        setFlowerToBreed(flower)
        setSpotlightPos(pos)
    }

    return(
        <>
            <div className='menu-text-container'>
                <h3 className='menu-h3'>Would you like to breed {flower.name}?</h3>
            </div>
            <button className='breed-button' onClick={(e) => handleClick()}>sELECT pARTNER</button>
        </>
        
        )
}

const BreedSelect = ({flower, breed}) => {

    return(
        <>
            <div className='menu-text-container'>
                <h3 className='breed-menu'>Breed with {flower.name}?</h3>
            </div>
            <button className='breed-button' onClick={() => breed(flower)}>bREED!</button>
        </>
    )

}

