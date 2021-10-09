import { useState, useEffect } from 'react';
import PokemonDetails from './pokemondetails';

import '../component-styles/leftscrollbar.css';
import '../component-styles/pokemanager.css';

const PokeManager = () => {
  const [pokemons, setPokemons] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState({ abilities: [] });
  const [selectedImgUrl, setSelectedImgUrl] = useState('');
  const [catched, setCatched] = useState([]);
  const [onlyCatched, setOnlyCatched] = useState(false);

  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=0&offset=0')
      .then((res) => res.json())
      .then((payload) => payload.count)
      .then((count) => {
        fetch('https://pokeapi.co/api/v2/pokemon?limit=' + count + '&offset=0')
          .then((res) => res.json())
          .then((payload) =>
            fetch(payload.results[0].url)
              .then((res2) => res2.json())
              .then((pokemonDetails) => {
                setPokemons(payload.results);
                setSelectedPokemon(pokemonDetails);
                setSelectedImgUrl(pokemonDetails.sprites.front_default);
              })
          );
      });
  }, []);

  const leftBarClickHandler = function (pokemonUrl) {
    fetch(pokemonUrl)
      .then((res) => res.json())
      .then((payload) => {
        setSelectedPokemon(payload);
        setSelectedImgUrl(payload.sprites.front_default);
      });
  };


  const search = function () {
    const searchName = document.getElementById('search-field').value;
    fetch('https://pokeapi.co/api/v2/pokemon/' + searchName)
      .then((res) => res.json())
      .then((payload) => {
        const pokemons = [payload.forms[0]].map((form) => {
          form.url = form.url.replace(/-form/, '');
          return form;
        });
        setPokemons(pokemons);
        setSelectedPokemon(payload);
        setSelectedImgUrl(payload.sprites.front_default);
      });
  };

  const onCatched = function (name) {
    let alreadyCatched = catched;
    if (document.getElementById('check_' + name).checked) {
      alreadyCatched.push(name);
    } else {
      alreadyCatched = alreadyCatched.filter(
        (pokemonName) => pokemonName !== name
      );
      if (onlyCatched) {
        setTheFirstCatchedAsSelected();
      }
    }
    setCatched(alreadyCatched);
  };

  const toggleCatched = function () {
    setOnlyCatched(!onlyCatched);
    setTheFirstCatchedAsSelected();
  };

  const resetList = function () {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=0&offset=0')
    .then((res) => res.json())
    .then((payload) => payload.count)
    .then((count) => {
      fetch('https://pokeapi.co/api/v2/pokemon?limit=' + count + '&offset=0')
        .then((res) => res.json())
        .then((payload) =>
          fetch(payload.results[0].url)
            .then((res2) => res2.json())
            .then((pokemonDetails) => {
              setPokemons(payload.results);
              setSelectedPokemon(pokemonDetails);
              setSelectedImgUrl(pokemonDetails.sprites.front_default);
            })
        );
    });
  };

  const setTheFirstCatchedAsSelected = function () {
    const checkPokemons = document.querySelectorAll('input:checked');
    if (checkPokemons.length > 0) {
      checkPokemons[0].parentElement.parentElement.click();
    }
  };

  const renderPokemonDetails = function () {
    if (!onlyCatched || catched.includes(selectedPokemon.forms[0].name))
      return (
        <div>
          <div className='col-md-12'>
            <img alt='poke_front' src={selectedImgUrl} />
          </div>
          <div className='col-md-12'>
            <PokemonDetails selectedPokemon={selectedPokemon} />
          </div>
        </div>
      );

    return '';
  };

  return (
    <div>
      <nav className='navbar navbar-light bg-danger rounded-top row'>
        <a className='navbar-brand' href='#'>
          <img
            onClick={() => resetList()}
            href='#'
            src='https://icon-library.com/images/pokedex-icon/pokedex-icon-21.jpg'
            alt='Pokedex'
          />
        </a>
      </nav>
      <nav className='row navbar navbar-light bg-danger'>
        <div className='col-md-7 row'>
          <div className='col-md-1'>
          <button className='btn btn-warning' onClick={() => toggleCatched()}>
           {onlyCatched ? 'Tutti' : 'Catturati'}
          </button>   
          </div>
          <div className='col-md-11'>
          </div>
        </div>
        <div className='col-md-3'>
          <input
            id='search-field'
            type='search'
            placeholder='Search'
            aria-label='Search'
          />
        </div>
        <div className='col-md-2'>
          <button className='btn btn-warning' onClick={() => search()}>
            Cerca
          </button>
        </div>
      </nav>
      <div className='App row'>
        <div className='col-md-4 row'>
          <div className='col-md-12'>
            <div id='leftScrollbar' className='overflow-auto'>
              <div className='list-group'>
                {pokemons
                  .filter((pokemon) => {
                    if (!onlyCatched) return true;
                    return catched.indexOf(pokemon.name) != -1;
                  })
                  .map((pokemon) => (
                    <div key={pokemon.name}>
                      <div
                        className='list-group-item list-group-item-action hand-cursor'
                        onClick={() => leftBarClickHandler(pokemon.url)}
                      >
                        <div className='form-check'>
                          <input
                            className='form-check-input'
                            type='checkbox'
                            value='catched'
                            id={'check_' + pokemon.name}
                            checked={catched.includes(pokemon.name)}
                            onChange={() => onCatched(pokemon.name)}
                          />
                          <label
                            className='form-check-label'
                            htmlFor={'check_' + pokemon.name}
                          >
                            {pokemon.name}
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
        <div className='col-md-8 row'>{renderPokemonDetails()}</div>
      </div>
      <footer className='navbar navbar-light bg-danger rounded-bottom row text-center'>
        <a className='navbar-brand' href='#'>
          Pokedex
        </a>
      </footer>
    </div>
  );
};

export default PokeManager;
