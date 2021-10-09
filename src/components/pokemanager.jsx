import React, { Component } from 'react';
import PokemonDetails from './pokemondetails';

import '../component-styles/leftscrollbar.css';
import '../component-styles/pokemanager.css';

class PokeManager extends Component {

    state = {
        pokemons: [],
        selectedPokemon: {
            abilities: []
        },
        selectedImgUrl: "",
        lastLimit: 0,
        lastOffset: 100,
        total: 0,
        catched: [],
        onlyCatched: false
    };

    componentDidMount() {
        fetch("https://pokeapi.co/api/v2/pokemon?limit=" + this.state.lastLimit + "&offset=" + this.state.lastOffset)
        .then(res => res.json())
        .then(payload => {
            fetch(payload.results[0].url)
            .then(res2 => res2.json())
            .then(pokemonDetails => {
                this.setState({
                    pokemons: payload.results,
                    selectedPokemon: pokemonDetails,
                    selectedImgUrl: pokemonDetails.sprites.front_default,
                    total: payload.count
                });
            })
        })
    }

    leftBarClickHandler(pokemonUrl) {
        fetch(pokemonUrl)
        .then(res => res.json())
        .then(payload => {
            this.setState({
                selectedPokemon: payload,
                selectedImgUrl: payload.sprites.front_default
            })
        })
    };

    backward() {
        const newLimit = Math.max(this.state.lastLimit - 100, 0);
        const newOffset = Math.max(this.state.lastOffset - 100, 100);
        fetch("https://pokeapi.co/api/v2/pokemon?limit=" + newLimit + "&offset=" + newOffset)
        .then(res => res.json())
        .then(payload => {
            fetch(payload.results[0].url)
            .then(res2 => res2.json())
            .then(pokemonDetails => {
                this.setState({
                    pokemons: payload.results,
                    selectedPokemon: pokemonDetails,
                    selectedImgUrl: pokemonDetails.sprites.front_default,
                    lastLimit: newLimit,
                    lastOffset: newOffset
                });
            })
        })
    }

    forward() {
        const newLimit = Math.min(this.state.lastLimit + 100, this.state.total - 101);
        const newOffset = Math.min(this.state.lastOffset + 100, this.state.total - 1);
        fetch("https://pokeapi.co/api/v2/pokemon?limit=" + newLimit + "&offset=" + newOffset)
        .then(res => res.json())
        .then(payload => {
            fetch(payload.results[0].url)
            .then(res2 => res2.json())
            .then(pokemonDetails => {
                this.setState({
                    pokemons: payload.results,
                    selectedPokemon: pokemonDetails,
                    selectedImgUrl: pokemonDetails.sprites.front_default,
                    lastLimit: newLimit,
                    lastOffset: newOffset
                });
            })
        })
    }

    search() {
        const searchName = document.getElementById("search-field").value;
        fetch("https://pokeapi.co/api/v2/pokemon/" + searchName)
        .then(res => res.json())
        .then(payload => {
            const pokemons = [payload.forms[0]].map(form => {
                form.url = form.url.replace(/-form/,"");
                return form;
            });
            this.setState({
                pokemons: pokemons,
                selectedImgUrl: payload.sprites.front_default,
                selectedPokemon: payload
            });
        })
    }

    onCatched(name) {
        let catched = this.state.catched;
        if (document.getElementById("check_" + name).checked) {
            catched.push(name);
        }
        else {
            catched = catched.filter(pokemonName => pokemonName !== name)
            if (this.state.onlyCatched) {
                this.setTheFirstCatchedAsSelected();
            }
        }
        this.setState({
            catched: catched
        });
    }

    toggleCatched() {
        this.setState({
            onlyCatched: !this.state.onlyCatched
        });
        this.setTheFirstCatchedAsSelected();
    }

    setTheFirstCatchedAsSelected() {
        const checkPokemons = document.querySelectorAll("input:checked");
        if (checkPokemons.length > 0) {
            checkPokemons[0].parentElement.parentElement.click();
        }
    }

    renderPokemonDetails() {
        if (!this.state.onlyCatched || this.state.catched.includes(this.state.selectedPokemon.forms[0].name))
        return (<React.Fragment>
                   <div className="col-md-12">
                       <img alt="poke_front" src={this.state.selectedImgUrl} />
                   </div>
                   <div className="col-md-12"><PokemonDetails selectedPokemon={this.state.selectedPokemon} /></div>
               </React.Fragment>);

        return "";
    }

    render() { 
        return (
            <React.Fragment>
                <nav className="navbar navbar-light bg-danger rounded-top row">
                    <a className="navbar-brand" href="#"><img onClick={() => this.toggleCatched()} href="#" src="https://icon-library.com/images/pokedex-icon/pokedex-icon-21.jpg" alt="Pokedex" /></a>
                </nav>
                <nav className="row navbar navbar-light bg-danger">
                    <div className="col-md-7 row">
                        <div className="col-md-1"><a onClick={() => this.backward()} className="btn btn-warning">Prev</a></div>
                        <div className="col-md-11"><a onClick={() => this.forward()} className="btn btn-warning">Next</a></div>
                    </div>
                    <div className="col-md-3"><input id="search-field" type="search" placeholder="Search" aria-label="Search" /></div>
                    <div className="col-md-2"><button className="btn btn-warning" onClick={() => this.search()}>Search</button></div>
                </nav>
                <div className="App row">
                    <div className="col-md-4 row">
                        <div className="col-md-12">
                        <div id="leftScrollbar" className="overflow-auto">
                            <div className="list-group">
                                {
                                    this.state.pokemons
                                    .filter(pokemon => {
                                        if (!this.state.onlyCatched) return true;
                                        return this.state.catched.indexOf(pokemon.name) != -1
                                    })
                                    .map(
                                        pokemon => <React.Fragment key={pokemon.name}>
                                                        <div className="list-group-item list-group-item-action hand-cursor" onClick={() => this.leftBarClickHandler(pokemon.url)}>
                                                        <div className="form-check">
                                                            <input className="form-check-input" type="checkbox" value="catched" id={"check_" + pokemon.name} checked={this.state.catched.includes(pokemon.name)} onChange={() => this.onCatched(pokemon.name)} />
                                                            <label className="form-check-label" htmlFor={"check_" + pokemon.name}>
                                                                {pokemon.name}
                                                            </label>
                                                            </div>
                                                        </div>
                                                    </React.Fragment>
                                    )
                                }
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className="col-md-8 row">
                        {this.renderPokemonDetails()}
                    </div>
                </div>
                <footer className="navbar navbar-light bg-danger rounded-bottom row text-center">
                    <a className="navbar-brand" href="#">Pokedex</a>
                </footer>
            </React.Fragment>
        );
    }
}
 
export default PokeManager;