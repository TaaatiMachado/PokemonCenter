// src/pages/SearchResult.js
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usePokemon } from '../../context/Pokemon';
import Card from '../../components/Card';
import pokeball from '../../assets/pokeball.gif';

import styles from './SearchResults.module.css'

function SearchResult() {
  const { query } = useParams();
  const { fetchPokemon, loading, error, pokemon } = usePokemon();

  useEffect(() => {
    fetchPokemon(query);
  }, [query, fetchPokemon]);

  return (
    <div className={styles.search_container}>
        {loading && <img src={pokeball} width={50} alt="Loading..." />}
        {!loading && error && <p>{error}</p>}
      {!loading && pokemon && <Card pokemonInfo={pokemon} />}
    </div>
  );
}

export default SearchResult;
