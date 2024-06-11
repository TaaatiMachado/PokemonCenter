import { useState, useEffect } from 'react';
import { usePokemon } from '../../context/Pokemon';
import pokeball from '../../assets/pokeball.gif';
import axios from 'axios';
import Modal from '../../components/Modal';
import styles from './Listing.module.css'


const Listing = () => {
  const { generations, types, loading, fetchPokemonDetails} = usePokemon();
  const [selectedGeneration, setSelectedGeneration] = useState('generation-i');
  const [selectedType, setSelectedType] = useState('');
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState(null);


  useEffect(() => {
    const fetchDetails = async (pokemon) => {
      const promises = pokemon.map(pokemon => fetchPokemonDetails(pokemon));
      const responses = await Promise.all(promises);
      return responses;
    };

    const fetchPokemonByGeneration = async (generationUrl) => {
      const response = await axios.get(generationUrl);
      return response.data.pokemon_species.map(p => p.url.split('/')[6]);
    };

    const fetchPokemonByType = async (typeUrl) => {
      const response = await axios.get(typeUrl);
      return response.data.pokemon.map(p => p.pokemon.url.split('/')[6]);
    };

    const fetchFilteredPokemon = async () => {
      let generationPokemon = [];
      let typePokemon = [];
      
      if (selectedGeneration) {
        const generationUrl = generations.find(g => g.name === selectedGeneration)?.url;
        if (generationUrl) {
          generationPokemon = await fetchPokemonByGeneration(generationUrl);
        }
      }

      if (selectedType) {
        const typeUrl = types.find(t => t.name === selectedType)?.url;
        if (typeUrl) {
          typePokemon = await fetchPokemonByType(typeUrl);
        }
      }

      let commonPokemon;
      if (selectedGeneration && selectedType) {
        commonPokemon = generationPokemon.filter(p => typePokemon.includes(p));
      } else if (selectedGeneration) {
        commonPokemon = generationPokemon;
      } else if (selectedType) {
        commonPokemon = typePokemon;
      } else {
        commonPokemon = [];
      }

      const detailedPokemon = await fetchDetails(commonPokemon);
      detailedPokemon.sort((a, b) => a.id - b.id);
      setFilteredPokemon(detailedPokemon);
    };

    fetchFilteredPokemon();
  }, [selectedGeneration, selectedType, generations, types, fetchPokemonDetails]);

  const handlePokemonClick = (pokemon) => {
    setSelectedPokemon(pokemon);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPokemon(null);
  };
  return (
    <div className={styles.listing_container}>
      <div className={styles.gen_wrapper}>
        <label>Generation:</label>
        <select onChange={e => setSelectedGeneration(e.target.value)} value={selectedGeneration}>
          {generations.map((generation, index) => (
            <option key={generation.name} value={generation.name}>Gen {index + 1}</option>
          ))}
        </select>
      </div>
      <div className={styles.type_wrapper}>
        <label>Type:</label>
        <select onChange={e => setSelectedType(e.target.value)} value={selectedType}>
          <option value="">All types</option>
          {types.map(type => (
            <option key={type.name} value={type.name}>{type.name}</option>
          ))}
        </select>
      </div>
      <div className={styles.list_wrapper}>
        {loading && <img src={pokeball} width={50} alt="Loading..." />}
        {filteredPokemon.length > 0 ? (
          <div className={styles.pokemon_list}>
            {filteredPokemon.map((pokemon) => (
              <div key={pokemon.id} className={styles.pokemon_item} onClick={() => handlePokemonClick(pokemon)}>
                <img src={pokemon.sprite} alt={pokemon.name} />
                <p>#{pokemon.id}</p>
                <p>{pokemon.name.split('-').join(' ')}</p>
              </div>
            ))}
          </div>
        ) : (
          <img src={pokeball} width={50} />
        )}
      </div>
      {showModal && <Modal pokeInfo={selectedPokemon} closeModal={closeModal}/>}
    </div>
  );
};

export default Listing;
