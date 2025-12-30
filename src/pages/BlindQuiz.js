import { useState, useEffect } from "react";
import pokemon from "pokemon";
import classes from "./BlindQuiz.module.css";
const pokemonAll = pokemon.all();
const pokemonLength = pokemonAll.length;
const BlindQuiz = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [pokemonData, setPokemonData] = useState([]);
  const [btnText, setBtnText] = useState("Get Answer!");
  const clickHandler = async () => {
    if (btnText === "Get Answer!") {
      setBtnText("Next");
    } else if (btnText === "Next") {
      if (!pokemonData.length) {
        setIsFetching(true);
      }
      setPokemonData((prev) => prev.slice(1));
      setBtnText("Get Answer!");
    }
  };
  console.log(pokemonData);
  useEffect(() => {
    const getProps = async () => {
      const { props } = await getServerSideProps();
      const { name, imgUrl } = props;
      setPokemonData((prev) => prev.concat({ name, imgUrl }));
    };
    if (pokemonData.length < 10) {
      getProps();
    } else if (pokemonData.length) {
      setIsFetching(false);
    }
  }, [pokemonData.length]);

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
                {pokemonData[0].name[0].toUpperCase() +
                  pokemonData[0].name.slice(1)}
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

export async function getServerSideProps(context) {
  const randomPokemon =
    pokemonAll[Math.trunc(Math.random() * pokemonLength)].toLowerCase();

  const fetchData = async () => {
    const res = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${randomPokemon}/`
    );
    const data = await res.json();
    return data.sprites.other["official-artwork"]["front_default"];
  };
  let imgUrl = await fetchData();
  while (!imgUrl) {
    imgUrl = await fetchData();
  }

  // const imgUrl = data.sprites.other["official-artwork"]["front_default"];

  return {
    props: {
      name: randomPokemon,
      imgUrl,
    },
  };
}

export default BlindQuiz;
