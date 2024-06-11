import { useState } from 'react';
import html2canvas from 'html2canvas';
import { usePokemon } from '../../context/Pokemon';
import SearchForm from '../../components/SearchForm';
import './Team.css'


const Teams = () => {
  const { fetchPokemonDetails } = usePokemon();
  const [team, setTeam] = useState([]);
  const [teamName, setTeamName] = useState([]);


  const addPokemonToTeam = async (pokemonName) => {
    if (team.length < 6 && !team.some(pokemon => pokemon.name.toLowerCase() === pokemonName.toLowerCase())) {
      try {
        const pokemonDetails = await fetchPokemonDetails(pokemonName.toLowerCase());
        setTeam([...team, pokemonDetails]);
      } catch (error) {
        console.error('Error adding Pokémon to team:', error);
      }
    } else {
      alert("You can't add more Pokémon or Pokémon is already in the team");
    }
  };

  const removePokemonFromTeam = (pokemonName) => {
    setTeam(team.filter(pokemon => pokemon.name.toLowerCase() !== pokemonName.toLowerCase()));
  };

  const exportTeamAsImage = async () => {
    const buttons = document.querySelectorAll('.remove-button');
    buttons.forEach(button => button.classList.add('hidden'));

    const canvas = await html2canvas(document.getElementById('team-container'), { letterRendering: 1, allowTaint: false, useCORS: true, });
    const image = canvas.toDataURL('image/png');

    const link = document.createElement('a');
    link.href = image;
    link.download = 'pokemon-team.png';
    link.click();

    buttons.forEach(button => button.classList.remove('hidden'));
    setTeamName('')
  };
  console.log(teamName)
  return (
    <div className='team-container'>
      <h1>Build your pokémon team!</h1>

      <label>Team's name</label>
      <input
        type="text"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
        placeholder="Type your team name..."
        className='form-input team-input'
      />
      <label>Team's Pokémon</label>

      <SearchForm onPokemonSelected={addPokemonToTeam} />
      <div id="team-container" className='team-wrapper'>
        {team.length > 0 && (
          <>
            <div className='team-pokemon'>
              <h2 className='team-name'>{teamName}</h2>
              {team.map(pokemon => (
                <div key={pokemon.id} className='team-item'>
                  <img src={pokemon.sprite} alt={pokemon.name} className='poke-img' />
                  <p className='poke-id'>#{pokemon.id}</p>
                  <p className='poke-name'>{pokemon.name}</p>
                  <button className='remove-button' onClick={() => removePokemonFromTeam(pokemon.name)}>Remover</button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <button onClick={exportTeamAsImage} className='export-btn'>
        Export team
      </button>
    </div>
  );
};

export default Teams;
