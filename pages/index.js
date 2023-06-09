import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { useEffect, useState } from 'react';
import SearchTerm from './components/searchTerm';
import Cards from './components/cards';
import Dropdown from './components/dropdown';

const PAGE_SIZE = 10;

export default function Home({ pokemons }) {

  // for filtering using the search bar
  const [searchTerm, setSearchTerm] = useState('');

  // the pokemons to be displayed are the filtered list of pokemon
  const [ pokemonCards, setPokemonCards ] = useState(pokemons);
  const [ originalData, setOriginalData ] = useState(pokemons);

  const handleSearchTerm = (event) => {
    setSearchTerm(event.target.value);
  };

  // for dropdown
  const options = [
    { value: 'ID', label: 'ID' },
    { value: 'Name', label: 'Name' },
  ];

  // initially set to ID
  const [dropdownOption, setDropdownOption] = useState(options[0].value);
  // when dropdown value is triggered, do the sort according to the
  // new value of the dropdown
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
    // then update the (ordering) of the pokemons
    // trigering a rerender
    setPokemonCards(pokemonCards);
    setDropdownOption(event.target.value);
  }

  // for loading more pokemon
  const [page, setPage] = useState(1);
  const loadMore = async () => {
    setPage(page + 1);
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${page * PAGE_SIZE}&limit=${PAGE_SIZE}`);
    const data = await res.json();
    const pokemons = await evaluateData(data);
    // after loading more data, append it to the current cards of pokemon
    setPokemonCards([...pokemonCards, ...pokemons]);
    setOriginalData([...pokemonCards, ...pokemons]);
  }

  // update the cards whenever the value of the search term changes
  useEffect(() => {
    const filteredPokemons = originalData.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      pokemon.id.toString().includes(searchTerm)
    );
    if (searchTerm === "") {
      setPokemonCards(originalData);
    } else {
      setPokemonCards(filteredPokemons)
    }
  }, [searchTerm]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Pokedex</title>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Pokedex
        </h1>

        <div className={`${styles.filters}`}>
          <SearchTerm value={searchTerm} onChange={handleSearchTerm} styles={styles} />
          <Dropdown value={dropdownOption} onChange={handleDropdown} options={options} />
        </div>

        <Cards pokemons={pokemonCards} />

        <div className={`${styles.center}`}>
          <button onClick={loadMore}>Load More</button>
        </div>
      </main>
    </div>
  )
}

// a helper function
const evaluateData = async (data) => {
  const pokemons = [];

  // fetch further info because each element of data.result is only { name, url }
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

