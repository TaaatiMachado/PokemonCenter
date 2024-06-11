import { useEffect, useState } from 'react';
import { usePokemon } from '../../context/Pokemon';
import starsW from '../../assets/shiny.png'
import starsB from '../../assets/shiny-dark.png'
import styles from './Card.module.css'

const Card = ({ pokemonInfo }) => {
  const { fetchPokemonDetails } = usePokemon();
  const [pokemon, setPokemon] = useState(null);
  const [isShiny, setIsShiny] = useState(false)

  useEffect(() => {
    const getPokemonDetails = async () => {
      try {
        const details = await fetchPokemonDetails(pokemonInfo.name);
        setPokemon(details);
      } catch (error) {
        console.error('Error fetching Pokémon details:', error);
      }
    };

    getPokemonDetails();
  }, [pokemonInfo, fetchPokemonDetails]);

  function handleShiny() {
    setIsShiny(!isShiny)
  }

  if (!pokemon) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.poke_wrapper}>
        <div className={styles.poke_pic}>
          <img src={isShiny ? pokemon.img_shiny : pokemon.img} alt={pokemon.name} className={styles.poke_img} />
          <button onClick={handleShiny} className={styles.poke_shiny}><img src={isShiny ? starsW : starsB} /></button>
        </div>
        <div className={styles.poke_info}>
            <h2 className={styles.poke_name}>{pokemon.name.split('-').join(' ')}</h2>
            <p className={styles.poke_desc}>{pokemon.flavorText}</p>
            <p className={styles.poke_height}>Height: {pokemon.height * 10}cm</p>
            <p className={styles.poke_weight}>Weight: {pokemon.weight / 10}kg</p>
            <p className={styles.poke_type}>Type: {pokemon.types.map(typeInfo => typeInfo.type.name).join(', ')}</p>
            <p className={styles.poke_stat}>Stats: {pokemon.stats.map(stat => (<p key={stat.stat.name}>{stat.stat.name.split('-').join(' ')}: {stat.base_stat}</p>))}</p>
          </div>
      </div>
  );
};

export default Card;
