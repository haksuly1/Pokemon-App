
let pokemonRepository = (function () {
  let pokemonList = [];
  let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

  function add(pokemon) {
    if (
      typeof pokemon === "object" &&
      "name" in pokemon
    ) {
      pokemonList.push(pokemon);
    }else {
      console.log("pokemon is not correct");
    }
  }

  function getAll() {
    return pokemonList;
  }

  function addListItem(pokemon) {
    let pokemonList = document.querySelector(".pokemon-list");
    let listPokemon = document.createElement("li");
    listPokemon.classList.add('group-list-item');

    let button = document.createElement("button");
    button.innerText = pokemon.name;
    button.classList.add("button-class");
    button.setAttribute('data-toggle', 'modal');
    button.setAttribute('data-target', '#exampleModal');

    listPokemon.appendChild(button);
    pokemonList.appendChild(listPokemon);

    button.addEventListener("click", function(event) {
      showDetails(pokemon);
    });
  }

  function loadList () {
    return fetch(apiUrl).then(function (response) {
      return response.json();
    }).then(function (json) {
      json.results.forEach(function (item) {
        let pokemon = {
          name: item.name,
          detailsUrl: item.url,
        };
        add(pokemon);
        console.log(pokemon);
      });
    }).catch(function (e) {
      console.error(e);
    })
  }

  function loadDetails(item) {
    let url = item.detailsUrl;
    return fetch(url).then(function (response) {
      return response.json();
    }).then(function (details) {
      //add details to the item
      item.imageUrlFront = details.sprites.front_default;
      item.imageUrlBack = details.sprites.back_default;
      item.height = details.height;
      item.types = details.types;
      item.weight = details.weight;
      item.weaknesses = details.weaknesses;
      item.category = details.category;
    }).catch(function (e) {
      console.error(e);
    });
  }

  function showDetails(item) {
    pokemonRepository.loadDetails(item).then(function ()
    {
      showModal(item);
    });
  }

  function showModal(pokemon) {
    let modalBody = $(".modal-body");
    let modalTitle = $(".modal-title");
    let modalHeader = $(".modal-header");
    //let modalContainer = $("#modal-container");
    //clear existing contents of the modal
    //modalHeader.empty();
    modalTitle.empty();
    modalBody.empty();

        //creating element for name in modal content
    let nameElement = $("<h1>" + pokemon.name + "</h1>");

      //creating img in modal content
    let imageElementFront = $('<img class="modal-img" style="width:50%">');
    imageElementFront.attr("src", pokemon.imageUrlFront);

    let imageElementBack = $('<img class="modal-img" style="width:50%">');
    imageElementBack.attr("src", pokemon.imageUrlBack);

      //creating element for height in modal content
    let heightElement = $("<p>" + "Height : " + pokemon.height + "</p>");

      //creating element for weightElement
    let weightElement = $("<p>" + "weight : " + pokemon.weight + "</p>");

      //creating element for categoryElement
    let categoryElement = $("<p>" + "Category : " + pokemon.category + "</p>");

      // Store types names as one string.
    let typesAsString = '';

    if (pokemon.types) {
      for (let i = 0; i < pokemon.types.length; i++){
         typesAsString = typesAsString + pokemon.types[i].type.name

          //Separate names with ", " if not the end of array
        if (pokemon.types.length !== i + 1) {
          typesAsString = typesAsString + ", "
        }
      }
    }

    //creating element for type in modal content
    let typesElement = $("<p>" + "Types : " + typesAsString + "</p>");

    modalTitle.append(nameElement);
    modalBody.append(imageElementFront);
    modalBody.append(imageElementBack);
    modalBody.append(heightElement);
    modalBody.append(typesElement);
    modalBody.append(weightElement);
    modalBody.append(categoryElement);
    //creating element for type and append it on the body modal ---> We need to loop through types as it is an array
  }

return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails,
    showDetails: showDetails
  };
})();

//console.log(pokemonRepository.getAll());
pokemonRepository.loadList().then(function() {
  pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});
