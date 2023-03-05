import { createContext } from "react";

const userContext = createContext({
  user: {
      accountBalance: 0,
      alternativeEmail: "",
      azureId: "",
      isic: "",
      role: "",
      school: {},
      username: "",
      id: null,
      name: "",
  },
  setUser: (user) => {}
});

export default userContext;
