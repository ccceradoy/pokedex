import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { useState } from 'react';
import SearchTerm from './components/searchTerm';
import Cards from './components/cards';
import Dropdown from './components/dropdown';

const PAGE_SIZE = 10;

export default function Home({ pokemons }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPokemons = pokemons.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    pokemon.id.toString().includes(searchTerm)
  );

  const [ pokemonCards, setPokemonCards ] = useState(filteredPokemons);

  const handleSearchTerm = (event) => {
    setSearchTerm(event.target.value);
  };

  const options = [
    { value: 'ID', label: 'ID' },
    { value: 'Name', label: 'Name' },
  ];

  const [dropdownOption, setDropdownOption] = useState(options[0].value);
  const handleDropdown = (event) => {
    if (event.target.value == 'ID') {
      pokemonCards.sort((p1, p2) => {
        if (p1.id < p2.id) return -1;
        else if (p1.id > p2.id) return 1;
        return 0;
      });
    } else {
      pokemonCards.sort((p1, p2) => {
        if (p1.name < p2.name) return -1;
        else if (p1.name > p2.name) return 1;
        return 0;
      });
    }
    setPokemonCards(pokemonCards);
    setDropdownOption(event.target.value);
  }

  const [page, setPage] = useState(1);
  const loadMore = async () => {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${page * PAGE_SIZE}&limit=${PAGE_SIZE}`);
    const data = await res.json();
    const pokemons = await evaluateData(data);
    setPokemonCards([...pokemonCards, ...pokemons]);
    setPage(page + 1);
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Pokedex</title>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Pokedex
        </h1>

        <SearchTerm value={searchTerm} onChange={handleSearchTerm} styles={styles} />

        <Dropdown value={dropdownOption} onChange={handleDropdown} options={options} />

        <Cards pokemons={pokemonCards} styles={styles} />

        <button onClick={loadMore}>Load More</button>
      </main>
    </div>
  )
}

const evaluateData = async (data) => {
  const pokemons = [];

  for (const pokemon of data.results) {
    const resPokemon = await fetch(pokemon.url);
    const pokemonInfo = await resPokemon.json();

    const types = pokemonInfo.types.map(index => {
      return index.type.name;
    });

    pokemons.push({
      id: pokemonInfo.id,
      name: pokemonInfo.name,
      image: pokemonInfo.sprites.front_default,
      type: types.join(', '),
    });
  }

  return pokemons;
}

export async function getStaticProps() {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${PAGE_SIZE}`);
  const data = await res.json();
  const pokemons = await evaluateData(data);
  return {
    props: { pokemons }
  };
}

