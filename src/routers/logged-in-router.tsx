import { gql, useQuery } from "@apollo/client";
import React from "react";
import { isLoggedInVar } from "../apollo";

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
  const { data, loading, error } = useQuery(ME_QUERY);
  console.log(data, error);

  const onClick = () => {
    isLoggedInVar(false);
  };

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-xl">Loading...</span>
      </div>
    );
  }

  return (
    <div>
      <h1>Logged In</h1>
      <button onClick={onClick}>Log Out</button>
    </div>
  );
};
