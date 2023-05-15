import { useRouter } from 'next/router';
import Link from "next/link";
export default function PokemonInfo({ pokemonData }) {
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <Link href='/'>
        <button>Back</button>
      </Link>
      <div>
        <h2>ID: {pokemonData.id}</h2>
        <h2>Name: {pokemonData.name}</h2>
        <h2>Type: {pokemonData.types}</h2>
        <h2>Weak against: {pokemonData.weakAgainst}</h2>
        <h2>Strong against: {pokemonData.strongAgainst}</h2>
        <img src={pokemonData.image} alt={pokemonData.image} />
      </div>
      <div>
        {id > 1 ? 
          <Link href={{
            pathname: '/pokemon/pokemonInfo',
            query: { id: parseInt(id) - 1 }
          }}>
            <button>Previous</button>
          </Link> : 
          null}
        <Link href={{
          pathname: '/pokemon/pokemonInfo',
          query: { id: parseInt(id) + 1 }
        }}>
          <button>Next</button>
        </Link>
      </div>
    </>
  );
}

// make a call to the type endpoint to get the pokemon's weakness and strength
const getTypeRelationship = async (types) => {
  const weakAgainst = [];
  const strongAgainst = [];

  for (const type of types) {
    const resType = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
    const resInfo = await resType.json();

    resInfo.damage_relations.double_damage_from.map(type => {
      weakAgainst.push(type.name);
    });

    resInfo.damage_relations.double_damage_to.map(type => {
      strongAgainst.push(type.name);
    });
  }

  // put it in a set to avoid duplicates
  return [Array.from(new Set(weakAgainst)), Array.from(new Set(strongAgainst))];
}


// make a call according to this id
export async function getServerSideProps(context) {
  const { id } = context.query;
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const pokemon = await res.json();
  
  const types = pokemon.types.map(index => {
    return index.type.name;
  });

  const abilities = pokemon.abilities.map(index => {
    return index.ability.name;
  });

  const possibleMoves = pokemon.moves.map(index => {
    return index.move.name.replace('-', ' ');
  });

  const typeRel = await getTypeRelationship(types);

  const pokemonData = {
    id: pokemon.id,
    name: pokemon.name,
    height: pokemon.height,
    types: types.join(', '),
    image: pokemon.sprites.front_default,
    weakAgainst: typeRel[0].join(', '),
    strongAgainst: typeRel[1].join(', '),
  }

  return {
    props: {
      pokemonData,
    },
  };
}