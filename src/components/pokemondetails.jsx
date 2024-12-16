import { useState, useEffect } from 'react';
import lunr from 'lunr';

const PokemonDetails = (props) => {
  const [movesResults, setMovesResults] = useState([]);
  const [movesQuery, setMovesQuery] = useState('');
  const [lunrIndex, setLunrIndex] = useState(null);

  useEffect(() => {
    if (props.selectedPokemon) {
      console.log('Selected Pokemon:', props.selectedPokemon);

      const index = lunr(function () {
        this.ref('id');
        this.field('name');

        props.selectedPokemon.moves.forEach((move, idx) => {
          this.add({
            id: idx,
            name: move.move.name.toLowerCase(),
            original: move,
          });
        });
      });

      setLunrIndex(index);
      setMovesResults(props.selectedPokemon.moves);
    }
  }, [props]);

  const handleMoveSearch = (e) => {
    const input = e.target.value.trim().toLowerCase();
    setMovesQuery(input);

    if (input && lunrIndex) {
      const wildcardQuery = `${input}*`;
      const results = lunrIndex.search(wildcardQuery);

      if (results.length > 0) {
        const resultIndexes = results.map((res) => res.ref);
        const filteredMoves = resultIndexes.map(
          (idx) => props.selectedPokemon.moves[idx]
        );

        setMovesResults(filteredMoves);
      } else {
        setMovesResults([]);
      }
    } else {
      setMovesResults(props.selectedPokemon.moves);
    }
  };

  if (props.selectedPokemon) {
    return (
      <div className='container'>
        <div className='row'>
          <div className='col'>
            <img
              alt='poke_front'
              src={props.selectedPokemon?.sprites?.front_default || ''}
            />
          </div>
        </div>
        <div className='row'>
          <div className='col'>
            <h1>{props.selectedPokemon.name}</h1>
          </div>
        </div>
        <div className='row'>
          <div className='col'>
            <h2 className='bg-warning rounded'>
              Abilities:{' '}
              {JSON.stringify(
                props.selectedPokemon.abilities.map((a) => a.ability.name)
              ).replace(/"/g, ' ')}
            </h2>
          </div>
        </div>
        <div className='row my-3'>
          <div className='col'>
            <button
              class='btn btn-danger'
              type='button'
              data-bs-toggle='collapse'
              data-bs-target='#collapseMoves'
              aria-expanded='false'
              aria-controls='collapseMoves'
            >
              Vedi move set di {props.selectedPokemon.name}
            </button>
            <div class='collapse my-3' id='collapseMoves'>
              <div class='card card-body'>
                <input
                  type='text'
                  className='form-control mb-3'
                  placeholder='Cerca move...'
                  value={movesQuery}
                  onChange={handleMoveSearch}
                />
                <ul className='list-group'>
                  {movesResults.length > 0 ? (
                    movesResults.map((move, idx) => (
                      <li key={idx} className='list-group-item'>
                        {move.move.name}
                      </li>
                    ))
                  ) : (
                    <li className='list-group-item text-danger'>
                      Nessun move trovato :(
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return 'In caricamento';
  }
};

export default PokemonDetails;
