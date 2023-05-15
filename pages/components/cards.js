import Link from "next/link";
import styles from "../../styles/Cards.module.css"

const Cards = ({ pokemons }) => {
  return (
    <div className={styles.grid}>
      {pokemons.map((pokemon) => (
        <Link href={{
          pathname: '/pokemon/pokemonInfo',
          query: { id: pokemon.id }
        }}>
          <div className={styles.card} key={pokemon.id}>
            <h2>ID: {pokemon.id}</h2>
            <h2>Name: {pokemon.name}</h2>
            <h2>Type: {pokemon.type}</h2>
            <img src={pokemon.image} alt={pokemon.name} />
          </div>
        </Link>
      ))}
    </div>
  )
}

export default Cards;