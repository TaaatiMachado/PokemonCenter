import { useEffect, useRef, useState } from 'react';
import { usePokemon } from '../../context/Pokemon';
import Card from '../Card'
import styles from './Modal.module.css'

const Modal = ({ pokeInfo, closeModal }) => {
  const { fetchPokemonDetails } = usePokemon();
  const [pokemon, setPokemon] = useState(null);
  const modalRef = useRef(null);

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      closeModal();
    }
  };

  useEffect(() => {
    const getPokemonDetails = async () => {
      try {
        const details = await fetchPokemonDetails(pokeInfo.id);
        setPokemon(details);
        //console.log(pokemon)
      } catch (error) {
        console.error('Error fetching Pokémon details:', error);
      }
    };

    getPokemonDetails();

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [pokeInfo, fetchPokemonDetails]);

  if (!pokemon) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.modal_overlay}>
      <div className={styles.modal_content} ref={modalRef}>
        <button onClick={closeModal} className={styles.close_btn}> &#x2715; </button>
        <Card pokemonInfo={pokeInfo}/>
      </div>
    </div>
  );
};

export default Modal;
