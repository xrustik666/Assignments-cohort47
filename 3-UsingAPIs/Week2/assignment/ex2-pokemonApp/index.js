'use strict';
/*------------------------------------------------------------------------------
Full description at: https://github.com/HackYourFuture/Assignments/blob/main/3-UsingAPIs/Week2/README.md#exercise-2-gotta-catch-em-all

Complete the four functions provided in the starter `index.js` file:

`fetchData`: In the `fetchData` function, make use of `fetch` and its Promise 
  syntax in order to get the data from the public API. Errors (HTTP or network 
  errors) should be logged to the console.

`fetchAndPopulatePokemons`: Use `fetchData()` to load the pokemon data from the 
  public API and populate the `<select>` element in the DOM.
  
`fetchImage`: Use `fetchData()` to fetch the selected image and update the 
  `<img>` element in the DOM.

`main`: The `main` function orchestrates the other functions. The `main` 
  function should be executed when the window has finished loading.

Use async/await and try/catch to handle promises.

Try and avoid using global variables. As much as possible, try and use function 
parameters and return values to pass data back and forth.
------------------------------------------------------------------------------*/

// Data fetcher
async function fetchData(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}

// Appends select field. Appends pokemons name into select field
async function fetchAndPopulatePokemons(url) {
  try {
    const data = await fetchData(url);
    const results = data.results;

    // Create and append select list
    const select = document.createElement('select');
    document.body.appendChild(select);

    // Create and append options elements with pokemons' names
    for (let i = 0; i < results.length; i++) {
      const option = document.createElement('option');
      option.value = results[i].name;
      option.textContent = results[i].name;
      select.appendChild(option);
    }
  } catch (error) {
    return error;
  }
}

// Gets images addresses
async function fetchPokemonImages(url) {
  const data = await fetchData(url);
  const results = data.results;

  const urls = [];
  for (let i = 0; i < results.length; i++) {
    urls.push(results[i].url);
  }

  async function getImages(array) {
    const sprites = [];
    for (let i = 0; i < array.length; i++) {
      const result = await fetchData(array[i]);

      sprites.push(result.sprites.front_default);
    }

    return sprites;
  }

  return getImages(urls);
}

// Adds events to click on option
async function showImages(url) {
  try {
    await fetchAndPopulatePokemons(url);

    const options = document.querySelectorAll('option');

    const pokemonAvatar = document.createElement('img');
    pokemonAvatar.alt = "Pokemon's avatar";

    for (let i = 0; i < options.length; i++) {
      options[i].addEventListener('click', async function () {
        const images = await fetchPokemonImages(url);
        pokemonAvatar.src = images[i];
        document.body.appendChild(pokemonAvatar);
      });
    }
  } catch (error) {
    return error;
  }
}

// Function caller
function main() {
  const ADDRESS = 'https://pokeapi.co/api/v2/pokemon?limit=151';

  // Create and append button
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = 'Press';
  document.body.appendChild(button);

  button.addEventListener('click', function () {
    if (!document.querySelector('select')) {
      showImages(ADDRESS);
    }
  });
}

window.addEventListener('load', main);
