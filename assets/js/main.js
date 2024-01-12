// Get references to HTML elements
const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');
const maxRecords = 151;
const limit = 10;
let offset = 0;

// Function to toggle the display of a navigation menu
function toggleMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.style.display = (navMenu.style.display === 'block') ? 'none' : 'block';
}

// Function to load Pokémon items and update the HTML
function loadPokemonItens(limit, offset) {
    // Fetch Pokémon data using pokeApi.getPokemons() method
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        // Generate HTML for each Pokémon and append it to the pokemonList element
        const newHtml = pokemons.map((pokemon) => `
            <li class="pokemon ${pokemon.type}" data-pokemon-id="${pokemon.number}">
                <span class="number">#${pokemon.number}</span>
                <span class="name">${pokemon.name}</span>
                <div class="detail">
                    <ol class="types">
                        ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                    </ol>
                    <img src="${pokemon.photo}" alt="${pokemon.name}">
                </div>
            </li>
        `).join('');
        pokemonList.innerHTML += newHtml;

        // Add click event listeners to each Pokémon for opening popups
        const pokemonElements = document.querySelectorAll('.pokemon');
        pokemonElements.forEach((element) => {
            element.addEventListener('click', () => {
                const pokemonId = element.dataset.pokemonId;
                openPopup(pokemonId);
            });
        });
    });
}

// Function to open a popup with detailed Pokémon information
function openPopup(pokemonId) {
    // Remove any existing popup
    const previousPopup = document.querySelector('.popup-container');
    if (previousPopup) {
        previousPopup.remove();
    }

    // Fetch detailed Pokémon data using pokeApi.getPokemonsDetail() method
    pokeApi.getPokemonsDetail({ url: `https://pokeapi.co/api/v2/pokemon/${pokemonId}/` })
        .then((pokemon) => {
            // Generate HTML for the popup
            const popupContent = `
                <div class="popup-container custom-popup">
                    <button class="close-button">&times;</button>
                    <span class="number">#${pokemon.number}</span>
                    <img src="${pokemon.photo}" alt="${pokemon.name}" class="popup-image">
                    <div class="popup-details">
                        <span class="name">${pokemon.name}</span>
                        <div class="detail">
                            <ol class="types">
                                ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                            </ol>
                            <div class="description">
                                <p><strong>Height:</strong> ${pokemon.height} dm</p>
                                <p><strong>Weight:</strong> ${pokemon.weight} hectograms</p>
                                <p><strong>Abilities:</strong> ${pokemon.abilities.join(', ')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Insert the popup HTML into the document body
            document.body.insertAdjacentHTML('beforeend', popupContent);

            // Add click event listener to the close button
            const closeButton = document.querySelector('.close-button');
            if (closeButton) {
                closeButton.addEventListener('click', (event) => {
                    event.stopPropagation();
                    closePopup();
                });
            }

            // Add click event listener to close the popup when clicking outside it
            document.body.addEventListener('click', closePopup);
        })
        .catch((error) => console.error(error));
}

// Function to close the currently open popup
function closePopup() {
    const popupContainer = document.querySelector('.popup-container');
    if (popupContainer) {
        popupContainer.remove();
        document.body.removeEventListener('click', closePopup);
    }
}

// Initial loading of Pokémon items
loadPokemonItens(limit, offset);

// Add click event listener to the "Load More" button
loadMoreButton.addEventListener('click', () => {
    // Update offset for the next batch of Pokémon
    offset += limit;

    const qtdRecordNextPage = offset + limit;

    // Check if we have reached the maximum number of records
    if (qtdRecordNextPage >= maxRecords) {
        // If reached, load the remaining Pokémon and remove the "Load More" button
        const newLimit = maxRecords - offset;
        loadPokemonItens(limit, newLimit);

        loadMoreButton.parentElement.removeChild(loadMoreButton);
    } else {
        // If not reached, load the next batch of Pokémon
        loadPokemonItens(limit, offset);
    }
});
