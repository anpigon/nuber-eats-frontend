import { gql, useQuery } from "@apollo/client";
import React from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";

import { useMe } from "../hooks/useMe";
import { Header } from "../components/header";
import { Restaurants } from "../pages/client/restaurants";
import { UserRole } from "../__generated__/globalTypes";
import { meQuery } from "../__generated__/meQuery";

const ClientRoutes = (
  <Route path="/" exact>
    <Restaurants />
  </Route>
);

const ME_QUERY = gql`
  query meQuery {
    me {
      id
      email
      role
      verified
    }
  }
`;

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
        <Redirect to="/" />
      </Switch>
    </Router>
  );
};
