// Define an object to encapsulate Pokémon-related API functions
const pokeApi = {}

// Function to convert PokeAPI details into a custom Pokemon object
function convertPokeApiDetailPokemon(pokeDetail) {
    // Create a new Pokemon object
    const pokemon = new Pokemon()

    // Extract relevant information from the PokeAPI response
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    // Extract types and set the primary type
    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type

    // Set the photo of the Pokemon
    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

    // Set height and weight
    pokemon.height = pokeDetail.height
    pokemon.weight = pokeDetail.weight

    // Extract abilities
    pokemon.abilities = pokeDetail.abilities.map((abilitySlot) => abilitySlot.ability.name);

    return pokemon
}

// Function to get detailed information about a specific Pokemon from the PokeAPI
pokeApi.getPokemonsDetail = (pokemon) => {
    // Fetch data for a specific Pokemon from the provided URL
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailPokemon)
}

// Function to get a list of Pokemon from the PokeAPI, with optional offset and limit parameters
pokeApi.getPokemons = (offset = 0, limit = 10) => {
    // Construct the URL for fetching a list of Pokemon
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

    // Fetch the list of Pokemon from the PokeAPI
    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        // Fetch detailed information for each Pokemon in the list
        .then((pokemons) => pokemons.map(pokeApi.getPokemonsDetail))
        // Wait for all detailed information requests to complete
        .then((detailRequests) => Promise.all(detailRequests))
        // Return the array of detailed Pokemon information
        .then((PokemonsDetail) => PokemonsDetail)
        .catch((error) => console.error(error))
}
