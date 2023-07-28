/* eslint-disable no-restricted-globals */
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getUserAccessToken, GrantType } from "../services/spotify-auth";
import queryString from "query-string";

const CallbackPage = () => {
  const [successfulSignIn, setSuccessfulSignIn] = useState(false);
  useEffect(() => {
    const queryParams = queryString.parse(location.search);

    if (queryParams.code && queryParams.state) {
      getUserAccessToken(
        GrantType.AUTH,
        queryParams.state as string,
        queryParams.code as string
      ).then((success) => {
        setSuccessfulSignIn(success);
      });
    }
  }, []);

  return (
    <>{successfulSignIn ? <Navigate to="/" /> : (
      <div className="flex items-center justify-center h-full w-full bg-indigo-50 font-montserrat">
        <h1 className="text-xl font-extrabold leading-none tracking-tight md:text-2xl lg:text-3xl animate-pulse">Connecting with <mark className="px-2 text-white bg-spotify-green rounded">Spotify</mark>...</h1>
      </div>)}</>
  );
};

export default CallbackPage;
