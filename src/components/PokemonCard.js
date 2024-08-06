import { memo, useEffect, useState, Fragment } from "react";

import ImageContainer from "../UI/ImageContainer";
import PokemonImage from "./PokemonImage";
import PokemonInfo from "./PokemonInfo";

import classes from "./PokemonCard.module.css";

const PokemonCard = (props) => {
  // state for storing the each pokemon's data that got from pokeapi
  const [pokemonData, setPokemonData] = useState([]);
  // state for controlling visibility of modal
  const [showPokemonInfo, setShowPokemonInfo] = useState(false);

  // handlers for chainging showPokemonInfo's state
  const showPokemonInfoHandler = () => {
    setShowPokemonInfo(true);
  };

  const hidePokemonInfoHandler = () => {
    setShowPokemonInfo(false);
  };

  // when getting url from Pokedex component, fetching each Pokemon's data from pokeapi by the urls from Pokedex component
  useEffect(() => {
    const fetchPokemonInfo = async () => {
      try {
        fetch(props.url)
          .then((res) => res.json())
          .then((data) => {
            const types = data.types.map((data) =>
              data.type.name.toLowerCase()
            );

            setPokemonData({
              name: data.name[0].toUpperCase() + data.name.slice(1),
              imgUrl: data.sprites.other["official-artwork"]["front_default"],
              types,
              height: data.height,
              weight: data.weight,
            });
          });
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchPokemonInfo();
  }, [props.url]);

  return (
    <Fragment>
      {showPokemonInfo && (
        <PokemonInfo
          onClose={hidePokemonInfoHandler}
          pokemonData={pokemonData}
          showPokemonInfo={showPokemonInfo}
        />
      )}
      <div
        className={classes["card--container"]}
        onClick={showPokemonInfoHandler}
      >
        <ImageContainer color={props.color}>
          <PokemonImage imgUrl={pokemonData.imgUrl} name={pokemonData.name} />
        </ImageContainer>
        {/* <NameContainer>
          <PokemonName name={pokemonData.name} />
        </NameContainer> */}
      </div>
    </Fragment>
  );
};

export default memo(PokemonCard);
