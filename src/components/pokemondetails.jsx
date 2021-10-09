import React, { Component } from 'react';

class PokemonDetails extends Component {
    render() { 
        return (<div>
                    <h1>{this.props.selectedPokemon.name}</h1>
                    <div className="bg-warning rounded">
                        <h2>Abilities: {JSON.stringify((this.props.selectedPokemon.abilities).map(a => a.ability.name)).replace(/\"/g, " ")}</h2>
                    </div>
                </div>);
    }
}
 
export default PokemonDetails;