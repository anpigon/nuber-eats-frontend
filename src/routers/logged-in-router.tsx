import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { useMe } from "../hooks/useMe";
import { Header } from "../components/header";
import { Restaurants } from "../pages/client/restaurants";
import { EditProfile } from "../pages/user/edit-profile";

import { UserRole } from "../__generated__/globalTypes";
import { ConfirmEmail } from "../pages/user/confirm-email";
import { NotFound } from "../pages/404";
import { Search } from "../pages/client/search";
import { Category } from "../pages/client/category";

const ClientRoutes = [
  <Route key="Restaurants" path="/" exact>
    <Restaurants />
  </Route>,
  <Route key="ConfirmEmail" path="/confirm">
    <ConfirmEmail />
  </Route>,
  <Route key="EditProfile" path="/edit-profile">
    <EditProfile />
  </Route>,
  <Route key="search" path="/search">
    <Search />
  </Route>,
  <Route key={5} path="/category/:slug">
    <Category />
  </Route>,
];

export const LoggedInRouter = () => {
  const { data, loading, error } = useMe();
  if (!data || loading || error) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-xl tracking-wide">Loading...</span>
      </div>
    );
  }

  return (
    <Router>
      <Header />
      <Switch>
        {data.me.role === UserRole.Client && ClientRoutes}
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
};
