import { createContext } from "react";

const authContext = createContext({
  authenticated: "notDisplayed",
  setAuthenticated: (auth) => {}
});

export default authContext;