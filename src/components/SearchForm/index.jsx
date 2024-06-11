// src/components/PokemonForm.js
import { useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { usePokemon } from '../../context/Pokemon';
import pokeball from '/poke_icon.png'

import './SearchForm.css'

const SearchForm = ({ onPokemonSelected }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const { fetchPokemon, pokemonList } = usePokemon();
  const navigate = useNavigate();

  useEffect(() => {
    if (query.length > 1) {
      const filteredSuggestions = pokemonList.filter(pokemon =>
        pokemon.toLowerCase().startsWith(query.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [query, pokemonList]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (query) {
      await fetchPokemon(query);
      if (onPokemonSelected) {
        onPokemonSelected(query);
      } else {
        navigate(`/search/${query}`)
    
      }
      setQuery('');
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setSuggestions([]);
    if (onPokemonSelected) {
      onPokemonSelected(suggestion);
    } else {
      navigate(`/search/${suggestion}`);
    }
    setQuery('');
    setSuggestions([]);
  };

  return (
    <div className='form-wrapper'>
      <form onSubmit={handleSubmit} className='form'>
        <input 
          type="text" 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
          placeholder="Search here..."
          className='form-input'
        />
        <button type="submit" className='form-btn'><img src={pokeball}/></button>
      </form>
      {suggestions.length > 0 && (
        <ul className='form-suggestions'>
          {suggestions.map(suggestion => (
            <li key={suggestion} onClick={() => handleSuggestionClick(suggestion)}>
              {suggestion.split('-').join(' ')}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};


export default SearchForm;
