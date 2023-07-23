import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";

interface Pokemon {
  id: number;
  name: string;
  type: string[];
  hp: number;
  attack: number;
  defense: number;
  special_attack: number;
  special_defense: number;
  speed: number;
}

type PokemonState = {
  pokemon: Pokemon[];
  search: string;
};

type PokemonAction =
  | { type: "setPokemon"; payload: Pokemon[] }
  | { type: "setSearch"; payload: string };

function usePokemonSource() {
  // const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  // const [search, setSearch] = useState("");

  const [{ pokemon, search }, dispatch] = useReducer(
    (state: PokemonState, action: PokemonAction) => {
      switch (action.type) {
        case "setPokemon":
          return { ...state, pokemon: action.payload };

        case "setSearch":
          return { ...state, search: action.payload };
      }
    },
    {
      pokemon: [],
      search: "",
    }
  );

  const setSearch = useCallback((search: string) => {
    dispatch({ type: "setSearch", payload: search });
  }, []);

  const filteredPokemon = useMemo(() => {
    return pokemon
      .filter((p) => p.name.toLowerCase().includes(search.toLocaleLowerCase()))
      .slice(0, 20);
  }, [pokemon, search]);

  useEffect(() => {
    fetch("/pokemon.json")
      .then((response) => response.json())
      .then((data: Pokemon[]) =>
        dispatch({ type: "setPokemon", payload: data })
      );
  }, []);

  return { pokemon: filteredPokemon, search, setSearch };
}

const PokemonContext = createContext({} as ReturnType<typeof usePokemonSource>);
export function usePokemon() {
  return useContext(PokemonContext);
}

export function PokemonProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PokemonContext.Provider value={usePokemonSource()}>
        {children}
      </PokemonContext.Provider>
    </>
  );
}
