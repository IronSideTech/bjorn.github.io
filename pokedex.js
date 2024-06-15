// Document selectors
const output = document.getElementById("output");
const searchButton = document.getElementById("search-button");
const loadMoreButton = document.getElementById("load-more");
const popUpWindow = document.getElementById("pop-up-window");
const input = document.getElementById("search-input");
// Utility variables
let startIndex = 1;
let endIndex = 50;
let isLoading = false;
// Takes a request in the form of a pokemon name/ID, loads requested pokemon's data
const dataFetch = async (request) => {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${request}`);
        if (!response.ok) throw new Error("Pokemon not found");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("An error occurred:", error);
        throw error;
    }
};
// Dynamic .pokemon-tile generator for the #output element. 
const createPokemonTile = (data) => {
    const tile = document.createElement('div');
    tile.className = `pokemon-tile ${data.types[0].type.name}-radial`;
    tile.innerHTML = `
        <img src="${data.sprites.front_default}" id="${data.id}" class="pop-up">
        <p class="name">${data.name.toUpperCase()} #${data.id}</p>
        <div class="type">
            <span class="type-span ${data.types[0].type.name}-radial">
                ${data.types[0].type.name.toUpperCase()}
            </span>
            <span class="type-span ${data.types.length === 2 ? data.types[1].type.name : "display-none"}-radial">
                ${data.types.length === 2 ? data.types[1].type.name.toUpperCase() : ""}
            </span>
        </div>
    `;
    return tile;
};
// Requests pokemon data from the API, for the CreatePokemonTile function, for 50 pokemons, using the dataFetch function when the window loads.
const windowOnLoadPokemons = async () => {
    if (isLoading) return; 
    isLoading = true; 
    for (let i = startIndex; i < endIndex; i++) {
        try {
            const data = await dataFetch(i);
            output.appendChild(createPokemonTile(data));
        } catch (error) {
            console.error(error);
        }
    }
    startIndex = endIndex;
    endIndex += 50;
    isLoading = false;
};
// Sends data request to the fetchData function, with user keyword in the form a pokemon name/ID. 
// Sends pokemon data to the displayPokemon function if found.
const searchPokemon = async (event) => {
    event.preventDefault();
    const requestedPokemon = input.value.toLowerCase();
    if (!requestedPokemon) {
        alert("Please provide a Pokemon name or ID");
        return;
    }
    try {
        await displayPokemon(requestedPokemon);
    } catch (error) {
        alert("Pokemon not found");
    }
};
// Displays selected- or searched for pokemon- on the pop up window
const displayPokemon = async (request) => {
    try {
        const data = await dataFetch(request);
        popUpWindow.style.display = "block";
        output.style.display = "none";
        popUpWindow.innerHTML = `
        <div id="pop-up-window-content" ${data.id}">
        <img src="${data.sprites.front_default}" id="sprite">
    <div id="pokemon-name">
        <button id="previous" class="btn btn-dark">
        <i class="bi bi-caret-left-fill"></i>
        </button>
        <p>${data.name.toUpperCase()}</p>
        <p>#${data.id}</p>
        <button id="next" class="btn btn-dark">
        <i class="bi bi-caret-right-fill"></i>
        </button>
    </div>
    
    <div class="type">
        <span class="type-span ${data.types[0].type.name}-radial">
            ${data.types[0].type.name.toUpperCase()}
        </span>
        <span class="type-span ${data.types.length === 2 ? data.types[1].type.name : "display-none"}-radial">
            ${data.types.length === 2 ? data.types[1].type.name.toUpperCase() : ""}
        </span> 
    </div>
    <button id="close-pop-up-window-button" class="btn btn-dark">
    <i class="bi bi-x-lg"></i>
    </button>
    <div id="pop-up-window-content-bottom">
        
        <div id="stats-wrapper">
            <div id="height">
                <p>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-rulers" viewBox="0 0 16 16">
                        <path d="M1 0a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h5v-1H2v-1h4v-1H4v-1h2v-1H2v-1h4V9H4V8h2V7H2V6h4V2h1v4h1V4h1v2h1V2h1v4h1V4h1v2h1V2h1v4h1V1a1 1 0 0 0-1-1z"/>
                    </svg>
                    ${data.height}
                </p>
                <p>Height</p>
            </div>
            <div id="weight">
                <p>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-activity" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M6 2a.5.5 0 0 1 .47.33L10 12.036l1.53-4.208A.5.5 0 0 1 12 7.5h3.5a.5.5 0 0 1 0 1h-3.15l-1.88 5.17a.5.5 0 0 1-.94 0L6 3.964 4.47 8.171A.5.5 0 0 1 4 8.5H.5a.5.5 0 0 1 0-1h3.15l1.88-5.17A.5.5 0 0 1 6 2"/>
                    </svg>
                    ${data.weight}
                </p>
                <p>Weight</p>
            </div>
            <div id="ability">
                <p>${data.abilities[0].ability.name}</p>
                <p>Ability</p>
            </div>
            <div id="stats-window">
            <div>
            <p>HP: ${data.stats[0].base_stat}</p>
        </div>
            <div>
            <p>Attack: ${data.stats[1].base_stat}</p>
        </div>
        <div>
            <p>Defense: ${data.stats[2].base_stat}</p>
        </div>
        <div>
            <p>Special-attack: ${data.stats[3].base_stat}</p>
        </div>
        <div>
            <p>Special-defense: ${data.stats[4].base_stat}</p>
        </div>
        <div>
            <p>Speed: ${data.stats[5].base_stat}</p>
        </div>
        </div>
        </div>
    </div>
</div>
        `;
        addPopUpEventListeners(data);
    } catch (error) {
        console.error(error);
        alert("Pokemon not found");
    }
};
// Event handlers for all the buttons
const addPopUpEventListeners = (data) => {
    document.getElementById("sprite").addEventListener("click", () => switchSprite(data));
    document.getElementById("close-pop-up-window-button").addEventListener("click", closePopUpWindow);
    document.getElementById("previous").addEventListener("click", () => displayPokemon(data.id - 1));
    document.getElementById("next").addEventListener("click", () => displayPokemon(data.id + 1));
    window.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closePopUpWindow();
    });
};
// Makes the picture of the pokemon on the pop up window turn around when clicked
const switchSprite = (data) => {
    const sprite = document.getElementById("sprite");
    sprite.src = sprite.src === data.sprites.front_default ? data.sprites.back_default : data.sprites.front_default;
};
// Closes the pop up window
const closePopUpWindow = () => {
    popUpWindow.innerHTML = "";
    popUpWindow.style.display = "none";
    output.style.display = "grid";
};
// Makes pokemon on the starting screen clickable
output.addEventListener("click", (event) => {
    if (event.target.classList.contains("pop-up")) {
        displayPokemon(event.target.id);
    }
});
// Some more event handlers
loadMoreButton.addEventListener("click", windowOnLoadPokemons);
searchButton.addEventListener("click", searchPokemon);
// Cals windowOnLoadPokemons function when window loads
window.onload = windowOnLoadPokemons;





