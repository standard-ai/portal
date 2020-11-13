import makeAbsolute from "./makeAbsolute";
import auth from "./auth";
import React, { useState } from "react";
import { local } from "brownies";
import useAsyncEffect from "use-async-effect";
import Spinner from "./components/Spinner";
import Login from "./components/Login";
import AuthContext from "./AuthContext";
import Profile from "./Profile";
import getToken from "./getToken";

const { REACT_APP_AUTH_REDIRECT = "/" } = process.env;

const replace = url => window.history.replaceState("", document.title, url);

// There's a url query ?code=... from the redirect
const shouldAuth = url => {
  return (
    url.href.startsWith(makeAbsolute(REACT_APP_AUTH_REDIRECT)) &&
    url.searchParams.has("code")
  );
};

// There's a token in localStorage; so there'll be an API call to verify it
const shouldGetProfile = () => {
  const keys = Object.keys(local);
  return Boolean(keys.find(key => /auth0spajs/.test(key)));
};

// try to parse query param if this is a login callback
const url = new URL(window.location.href);

export default ({ onUser, showProfile = true, children }) => {
  const [user, setUser] = useState(false);
  const [error, setError] = useState(false);
  // If either there is a localStorage token for the user (but no user yet) or
  // there is a hash (after Auth0's redirect), Auth should be considered loding
  const [loading, setLoading] = useState(shouldAuth(url) || shouldGetProfile());

  // Log the user in either from a token or from the hash
  useAsyncEffect(async () => {
    // Already has user, no need to do anything else here
    if (user) return;

    setLoading(true);

    try {
      if (shouldAuth(url)) {
        await auth.handleRedirectCallback(url.href);
        // Redirect if asked to do it, and only if we are not currently there
        if (local.redirect && local.redirect !== url.pathname + url.search) {
          replace(local.redirect);
          delete local.redirect;
        } else {
          replace("/");
        }
      }
    } catch (error) {
      replace("/");
      setError(error.message);
    }

    try {
      const token = await getToken();
      const raw = await auth.getUser();
      if (raw) {
        const profile = {
          id: raw.sub,
          name: raw.name,
          email: raw.email,
          img: raw.picture
        };
        if (onUser) {
          try {
            await onUser(profile, token);
          } catch (error) {
            setError(error);
            throw error;
          }
        }
        setUser(profile);
      }
    } catch (e) {
      // Noop
    } finally {
      setLoading(false);
    }
  }, [user]);

  // This redirects the user to Auth0's page, so the setLoading(true) does not
  // need to be undone since there's a navigation away. It is added though in
  // case the page takes a bit long to load, so that the user knows that the
  // action was executed
  const onLogin = async () => {
    local.redirect = window.location.pathname + window.location.search;
    setLoading(true);
    await auth.login();
  };

  if (user) {
    return (
      <AuthContext.Provider value={user}>
        {showProfile && <Profile />}
        {children}
      </AuthContext.Provider>
    );
  }

  return (
    <>
      <Spinner active={loading} />
      <Login error={error} onLogin={onLogin} />
    </>
  );
};
