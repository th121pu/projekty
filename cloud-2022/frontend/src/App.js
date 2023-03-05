import React, { useContext, useState, useEffect } from "react";
import { PageLayout } from "./components/PageLayout";
import { useIsAuthenticated } from "@azure/msal-react";
import Routing from "./views/Routing";
import userContext from "./contexts/userContext";
import cardContext from  './contexts/cardContext';
import { BrowserRouter } from "react-router-dom";

function App() {
  const [user, setUser] = useState({});
  const [card, setCard] = useState({});
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    document.title = "Uni Canteen"
 }, []);

  return (
    <userContext.Provider value={{ user, setUser }}>
      <cardContext.Provider value={{ card, setCard }}>
      <BrowserRouter>
        <PageLayout>
          {isAuthenticated ? (
            <Routing></Routing>
          ) : (
            <p>You are not signed in! Please sign in.</p>
          )}
        </PageLayout>
      </BrowserRouter>
      </cardContext.Provider>
    </userContext.Provider>
  );
}
export default App;
