import { createContext } from "react";

const userContext = createContext({
  user: {
      id: null,
      name: "",
      email: ""
  },
  setUser: (user) => {}
});

export default userContext;