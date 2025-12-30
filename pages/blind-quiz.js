import { useState, useEffect, useCallback } from "react";
import pokemon from "pokemon";
import classes from "../src/pages/BlindQuiz.module.css";

const pokemonAll = pokemon.all();
const pokemonLength = pokemonAll.length;

const BlindQuiz = ({ initialPokemon }) => {
  const [isFetching, setIsFetching] = useState(false);
  const [pokemonData, setPokemonData] = useState(initialPokemon ? [initialPokemon] : []);
  const [btnText, setBtnText] = useState("Get Answer!");

  const fetchRandomPokemon = useCallback(async () => {
    const randomPokemon = pokemonAll[Math.trunc(Math.random() * pokemonLength)].toLowerCase();
    
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomPokemon}/`);
      const data = await res.json();
      const imgUrl = data.sprites.other["official-artwork"]["front_default"];
      
      if (imgUrl) {
        return { name: randomPokemon, imgUrl };
      }
      // If no image, try again
      return await fetchRandomPokemon();
    } catch (error) {
      console.error('Error fetching pokemon:', error);
      return await fetchRandomPokemon();
    }
  }, []);

  const clickHandler = async () => {
    if (btnText === "Get Answer!") {
      setBtnText("Next");
    } else if (btnText === "Next") {
      if (pokemonData.length <= 1) {
        setIsFetching(true);
        // Fetch new pokemon
        const newPokemon = await fetchRandomPokemon();
        setPokemonData([newPokemon]);
        setIsFetching(false);
      } else {
        setPokemonData((prev) => prev.slice(1));
      }
      setBtnText("Get Answer!");
    }
  };

  useEffect(() => {
    const loadMorePokemon = async () => {
      if (pokemonData.length < 5) {
        const newPokemon = await fetchRandomPokemon();
        setPokemonData(prev => [...prev, newPokemon]);
      }
    };

    if (!isFetching && pokemonData.length > 0) {
      loadMorePokemon();
    }
  }, [pokemonData.length, isFetching, fetchRandomPokemon]);

  return (
    <div className={classes.scroll}>
      <div className={classes["quiz-container"]}>
        <div className={classes["image-container"]}>
          <div className={classes.image}>
            {isFetching || !pokemonData.length ? (
              <i className={`fas fa-spinner ${classes.loading}`}></i>
            ) : (
              <img
                className={`${classes.img} ${
                  btnText === "Next" && classes.reveal
                }`}
                src={pokemonData[0].imgUrl}
                alt={pokemonData[0].name}
              />
            )}
          </div>
          {btnText === "Get Answer!" || (btnText === "Next" && isFetching) ? (
            <p>Who&apos;s that pokemon?</p>
          ) : (
            <p>
              It&apos;s{" "}
              <span>
                {pokemonData[0]?.name[0].toUpperCase() +
                  pokemonData[0]?.name.slice(1)}
              </span>
              !
            </p>
          )}
        </div>

        <button className={classes.btn} onClick={clickHandler}>
          {btnText}
        </button>
      </div>
    </div>
  );
};

export async function getServerSideProps() {
  const randomPokemon = pokemonAll[Math.trunc(Math.random() * pokemonLength)].toLowerCase();

  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomPokemon}/`);
    const data = await res.json();
    let imgUrl = data.sprites.other["official-artwork"]["front_default"];
    
    // If no image, try a few more times
    let attempts = 0;
    while (!imgUrl && attempts < 5) {
      const newRandomPokemon = pokemonAll[Math.trunc(Math.random() * pokemonLength)].toLowerCase();
      const newRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${newRandomPokemon}/`);
      const newData = await newRes.json();
      imgUrl = newData.sprites.other["official-artwork"]["front_default"];
      attempts++;
    }

    return {
      props: {
        initialPokemon: {
          name: randomPokemon,
          imgUrl: imgUrl || '/placeholder-pokemon.png', // fallback
        },
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      props: {
        initialPokemon: null,
      },
    };
  }
}

export default BlindQuiz;