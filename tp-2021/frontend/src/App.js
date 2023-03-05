import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./views/Login";
import Register from "./views/Register";
import ForgottenPassword from "./views/ForgottenPassword";
import Profile from "./views/Profile";
import MainPage from "./views/MainPage";
import DetailPage from "./views/DetailPage";
import SubscriptionPage from "./views/SubPage"
import ScrollToTop from "./components/ScrollToTop";

import authContext from "./contexts/authContext";
import userContext from "./contexts/userContext";
import currencyContext from "./contexts/currencyContext";

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [currency, setCurrency] = useState("EUR");
  const [user, setUser] = useState({});

  useEffect(() => {
    document.title = "Crypto Predict";
  }, []);

  return (
    <div className="App" style={{ justifyContent: "center" }}>
      <userContext.Provider value={{ user, setUser }}>
        <authContext.Provider value={{ authenticated, setAuthenticated }}>
          <currencyContext.Provider value={{ currency, setCurrency }}>
            <div
              style={{ minHeight: "calc(100vh - 34px)", marginTop: "120px" }}
            >
              <BrowserRouter>
                <ScrollToTop>
                  <Header />

                  <Switch>
                    <Route exact path="/">
                      <MainPage />
                    </Route>

                    <Route path="/detail-page/:id">
                      <DetailPage />
                    </Route>

                    <Route path="/login">
                      <Login />
                    </Route>
                    <Route path="/register">
                      <Register />
                    </Route>
                    <Route path="/forg-passwrod">
                      <ForgottenPassword />
                    </Route>

                    <Route path="/profile">
                      <Profile />
                    </Route>
                    <Route path="/subscription">
                      <SubscriptionPage />
                    </Route>
                  </Switch>
                </ScrollToTop>
              </BrowserRouter>
            </div>
            <Footer />
          </currencyContext.Provider>
        </authContext.Provider>
      </userContext.Provider>
    </div>
  );
}

export default App;
