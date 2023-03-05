import { createContext } from "react";

const cardContext = createContext({
  card: [],
  setCard: (card) => []
});

export default cardContext;