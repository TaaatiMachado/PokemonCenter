import { useEffect, useState } from 'react';
import { usePokemon } from '../../context/Pokemon';
import pokeball from '../../assets/pokeball.gif'
import Card from '../../components/Card';

import styles from './Home.module.css'

function Home() {
  const { pokemonOfTheDay, fetchRandomPokemon } = usePokemon();

  useEffect(() => {
    fetchRandomPokemon();
  }, [fetchRandomPokemon]);


  //console.log(pokemonOfTheDay)
  return (
    <div className={styles.home_container}>
      <h2 className={styles.home_title}>Pokémon of the day</h2>
      {pokemonOfTheDay ? (
        <Card pokemonInfo={pokemonOfTheDay}/>
      ) : (
        <img src={pokeball} width={50} />
      )}
    </div>
  );
}

export default Home;
