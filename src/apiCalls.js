function getFlowers() {
  return fetch('http://localhost:3001/api/v1/')
    .then(resp => {
      if (!resp.ok) {
        throw new Error('Failed to load flowers')
      }

      return resp.json()
    })
}

const postFlower = (flower) => {
    return fetch(`https://bloom-brothers-be-c1f874334094.herokuapp.com/api/v0/plants`, {
      method: 'POST',
      body: JSON.stringify(flower),
      headers: {
        'Content-Type': 'application/json',
        'mode': 'no-cors' 
      }
    })
    .then(response => response.json())
    .catch(err => console.log(err))
  }


export { getFlowers, postFlower }