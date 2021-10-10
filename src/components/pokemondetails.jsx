

const PokemonDetails = (props) => {
        return (<div>
                    <h1>{props.selectedPokemon.name}</h1>
                    <div className="bg-warning rounded">
                        <h2>Abilities: {JSON.stringify((props.selectedPokemon.abilities).map(a => a.ability.name)).replace(/"/g, " ")}</h2>
                    </div>
                </div>);
    
}
 
export default PokemonDetails;