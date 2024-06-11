import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';

const PokemonContext = createContext();

export const PokemonProvider = ({ children }) => {
  const [pokemon, setPokemon] = useState(null);
  const [error, setError] = useState('');
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [shiny, setShiny] = useState('');
  const [pokemonOfTheDay, setPokemonOfTheDay] = useState(null);
  const [generations, setGenerations] = useState([]);
  const [types, setTypes] = useState([]);

  const fetchPokemon = useCallback(async (query) => {
    setError('');
    setPokemon(null);
    setLoading(true);

    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`);
      setPokemon(response.data);
      setShiny(response.data.sprites.other['official-artwork'].front_shiny);
    } catch (err) {
      setError('Pokémon não encontrado. Tente outro nome ou número.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPokemonDetails = useCallback(async (id) => {
    try {
      const pokemonResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
      
      let flavorEntry = null;
      try {
        const speciesResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
        flavorEntry = speciesResponse.data.flavor_text_entries.find(entry => entry.language.name === 'en');
      } catch (err) {
        if (err.response && err.response.status === 404) {
          console.warn(`Species data for Pokémon with ID ${id} not found.`);
        } else {
          throw err;
        }
      }
  
      return {
        id: pokemonResponse.data.id,
        name: pokemonResponse.data.name,
        sprite: pokemonResponse.data.sprites.front_default,
        shiny: pokemonResponse.data.sprites.front_shiny,
        height: pokemonResponse.data.height,
        weight: pokemonResponse.data.weight,
        flavorText: flavorEntry ? flavorEntry.flavor_text : 'No description available.',
        img: pokemonResponse.data.sprites.other['official-artwork'].front_default,
        img_shiny: pokemonResponse.data.sprites.other['official-artwork'].front_shiny,
        types: pokemonResponse.data.types,
        stats: pokemonResponse.data.stats,
        order: pokemonResponse.data.order,
      };
    } catch (err) {
      console.error('Error fetching Pokémon details:', err);
      throw err;
    }
  }, []);
  
  

  const fetchPokemonList = useCallback(async () => {
    try {
      const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=10000');
      setPokemonList(response.data.results.map(pokemon => pokemon.name));
      //console.log(response.data.results.map(pokemon => pokemon.url.split('/')[6]))
    } catch (err) {
      console.error('Erro ao buscar a lista de Pokémon:', err);
    }
  }, []);

  const fetchRandomPokemon = useCallback(async () => {
    if (pokemonList.length === 0) return;

    const today = new Date().toISOString().slice(0, 10);
    const storedDate = localStorage.getItem('pokemonOfTheDayDate');
    const storedPokemon = localStorage.getItem('pokemonOfTheDay');

    if (storedDate === today && storedPokemon) {
      setPokemonOfTheDay(JSON.parse(storedPokemon));
    } else {
      const randomIndex = Math.floor(Math.random() * pokemonList.length);
      const randomPokemonId = pokemonList[randomIndex];
      console.log(randomPokemonId)

      try {
        const pokeResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomPokemonId}`);
        const spcResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokeResponse.data.id}`);
        const flavorEntry = spcResponse.data.flavor_text_entries.find(entry => entry.language.name === 'en');

        const randomPokemon = {
          id: pokeResponse.data.id,
          name: pokeResponse.data.name,
          sprite: pokeResponse.data.sprites.front_default,
          shiny: pokeResponse.data.sprites.front_shiny,
          height: pokeResponse.data.height,
          weight: pokeResponse.data.weight,
          flavorText: flavorEntry ? flavorEntry.flavor_text : 'No description available.',
          img: pokeResponse.data.sprites.other['official-artwork'].front_default,
          img_shiny: pokeResponse.data.sprites.other['official-artwork'].front_shiny,
          types: pokeResponse.data.types,
          stats: pokeResponse.data.stats,
          order: pokeResponse.data.order,
        };

        //console.log(randomPokemon)
        localStorage.setItem('pokemonOfTheDay', JSON.stringify(randomPokemon));
        localStorage.setItem('pokemonOfTheDayDate', today);



        setPokemonOfTheDay(randomPokemon);
      } catch (err) {
        console.error('Erro ao buscar o Pokémon do dia:', err);
      }
    }
  }, [pokemonList]);

  const fetchGenerations = useCallback(async () => {
    try {
      const response = await axios.get('https://pokeapi.co/api/v2/generation');
      setGenerations(response.data.results);
    } catch (err) {
      console.error('Erro ao buscar as gerações:', err);
    }
  }, []);

  const fetchTypes = useCallback(async () => {
    try {
      const response = await axios.get('https://pokeapi.co/api/v2/type');
      setTypes(response.data.results);
    } catch (err) {
      console.error('Erro ao buscar os tipos:', err);
    }
  }, []);

  useEffect(() => {
    fetchPokemonList();
    fetchGenerations();
    fetchTypes();
  }, [fetchPokemonList, fetchGenerations, fetchTypes]);

  return (
    <PokemonContext.Provider value={{
      pokemon,
      error,
      fetchPokemon,
      fetchPokemonDetails,
      fetchPokemonList,
      pokemonList,
      loading,
      shiny,
      pokemonOfTheDay,
      fetchRandomPokemon,
      generations,
      types
    }}>
      {children}
    </PokemonContext.Provider>
  );
};

export const usePokemon = () => {
  return useContext(PokemonContext);
};
