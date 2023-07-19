import { useEffect, useState } from "react";




function usePokemon() {
  const [pokemon, setPokemon] = useState([]);

  useEffect(() => {
    fetch("/pokemon.json")
      .then((response) => response.json())
      .then((data) => setPokemon(data));
  }, []);
}

function App() {
  return <></>;
}

export default App;
