const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');
const loaderSection = document.getElementById('loader-section');

const maxRecords = 600;
const limit = 30;
let offset = 0;
let isLoading = false;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}" alt="${pokemon.name}">
            </div>
        </li>
    `;
}

function loadPokemonItens(offset, limit) {
    return new Promise((resolve) => {
        pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
            if (pokemons.length > 0) {
                const newHtml = pokemons.map(pokemon => convertPokemonToLi(pokemon)).join('');
                pokemonList.innerHTML += newHtml;
            }
            setTimeout(() => {
                resolve();
            }, 500)
        });
    });
}

loadPokemonItens(offset, limit);

function startLoading() {
    isLoading = true;
    loaderSection.style.display = 'flex';
}

function stopLoading() {
    isLoading = false;
    loaderSection.style.display = 'none';
}

function debounce(fn, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}

window.addEventListener("scroll", debounce(() => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight && !isLoading) {
        startLoading();

        offset += limit;
        const qtdRecordsWithNextPage = offset + limit;

        if (qtdRecordsWithNextPage >= maxRecords) {
            const newLimit = maxRecords - offset;
            loadPokemonItens(offset, newLimit).then(stopLoading);
        } else {
            loadPokemonItens(offset, limit).then(stopLoading);
        }
    }
}, 200));