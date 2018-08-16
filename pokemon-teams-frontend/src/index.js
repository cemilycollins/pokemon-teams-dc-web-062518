const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`

document.addEventListener("DOMContentLoaded", () => {
  fetchTrainers()
})

function fetchTrainers() {
  fetch("http://localhost:3000/trainers")
    .then(r => r.json())
    .then(json => {
      json.forEach(trainer => renderTrainer(trainer))
    })
}

function renderTrainer(trainer) {
  let div = document.createElement('div')
  let p = document.createElement('p')
  let button = document.createElement('button')
  let ul = document.createElement('ul')

  div.dataset.id = trainer.id
  div.className = "card"
  p.innerText = trainer.name
  button.dataset.trainerId = trainer.id
  button.innerText = "Add Pokemon"
  button.addEventListener('click', addRandomPokemon)

  if (trainer.pokemons) {
    trainer.pokemons.forEach(pokemon => {
      createLi(ul, pokemon)
    })
  }
  div.append(p, button, ul)
  document.querySelector('main').append(div)
}

function createLi(ul, pokemon) {
  let li = document.createElement('li')
  let releaseButton = document.createElement('button')

  li.innerText = `${pokemon.nickname} (${pokemon.species})`
  releaseButton.className = "release"
  releaseButton.dataset.pokemonId = pokemon.id
  releaseButton.innerText = "Release"
  releaseButton.addEventListener('click', releasePokemon)

  li.append(releaseButton)
  ul.append(li)
}

function addRandomPokemon(e) {
  let div = e.currentTarget.parentNode
  if (div.querySelectorAll('li').length === 6) {
    alert("You already have 6 pokemon! Release some if you want to add more.")
  } else {
    let id = div.dataset.id
    fetch('http://localhost:3000/pokemons', {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({trainer_id: id})
    })
      .then(r => r.json())
      .then(json => {
        createLi(div.querySelector('ul'), json)
      })
  }
}

function releasePokemon(e) {
  let li = e.currentTarget.parentNode
  let id = e.currentTarget.dataset.pokemonId
  fetch(`${POKEMONS_URL}/${id}`, {
    method: "DELETE"
  }).then(r => r.json())
    .then(json => {
      li.remove()
    })
}
