const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');
const maxRecords = 151;
const limit = 10;
let offset = 0;

function toggleMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.style.display = (navMenu.style.display === 'block') ? 'none' : 'block';
}


function loadPokemonItens(limit, offset) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
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

        // Adicione um event listener para cada elemento Pokemon
        const pokemonElements = document.querySelectorAll('.pokemon');
        pokemonElements.forEach((element) => {
            element.addEventListener('click', () => {
                const pokemonId = element.dataset.pokemonId;
                openPopup(pokemonId);
            });
        });
    });
}

function openPopup(pokemonId) {
    // Remova o popup anterior, se existir
    const previousPopup = document.querySelector('.popup-container');
    if (previousPopup) {
        previousPopup.remove();
    }

    pokeApi.getPokemonsDetail({ url: `https://pokeapi.co/api/v2/pokemon/${pokemonId}/` })
        .then((pokemon) => {
            const popupContent = `
            <div class="popup-container">
            <button class="close-button">&times;</button>
            <img src="${pokemon.photo}" alt="${pokemon.name}" class="popup-image">
            <div class="popup-details">
                <span class="number">#${pokemon.number}</span>
                <span class="name">${pokemon.name}</span>
                <div class="detail">
                    <ol class="types">
                        ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                    </ol>
                    <p><strong>Height:</strong> ${pokemon.height} dm</p>
                    <p><strong>Weight:</strong> ${pokemon.weight} hectograms</p>
                    <p><strong>Abilities:</strong> ${pokemon.abilities.join(', ')}</p>
                </div>
            </div>
        </div>
        `;

            // Adicione o conteúdo do popup ao body
            document.body.insertAdjacentHTML('beforeend', popupContent);

            // Adicione um event listener para fechar o popup ao clicar no botão de fechar
            const closeButton = document.querySelector('.close-button');
            if (closeButton) {
                closeButton.addEventListener('click', (event) => {
                    event.stopPropagation(); // Impede a propagação do evento para o body
                    closePopup();
                });
            }

            // Adicione um event listener para fechar o popup ao clicar fora dele
            document.body.addEventListener('click', closePopup);
        })
        .catch((error) => console.error(error));
}



function closePopup() {
    const popupContainer = document.querySelector('.popup-container');
    if (popupContainer) {
        popupContainer.remove();
        // Remova o event listener após fechar o popup
        document.body.removeEventListener('click', closePopup);
    }
}



loadPokemonItens(limit, offset);

loadMoreButton.addEventListener('click', () => {
    offset += limit;

    const qtdRecordNextPage = offset + limit;

    if (qtdRecordNextPage >= maxRecords) {
        const newLimit = maxRecords - offset;
        loadPokemonItens(limit, newLimit);

        loadMoreButton.parentElement.removeChild(loadMoreButton);
    } else {
        loadPokemonItens(limit, offset);
    }
});
