import React, { useContext, useState } from "react";
import { local } from "brownies";
import useAsyncEffect from "use-async-effect";
import auth from "./auth";

import Spinner from "./Spinner";
import Login from "./Login";

const AuthContext = React.createContext({});

const url = new URL(window.location.href);

const replace = url => window.history.replaceState("", document.title, url);

// Redirect if asked to do it, and only if we are not currently there
if (local.redirect && local.redirect !== url.pathname + url.search) {
  replace(local.redirect);
  delete local.redirect;
}

const hasHash = text => url.hash && url.hash.includes(text);
const clearHash = () => {
  replace(window.location.pathname + window.location.search);
};

const logout = (url = window.location.pathname) => {
  delete local.token;
  delete local.user;

  // Check it's a string because many times this callback is implemented as
  // <Button onClick={logout}>Logout</Button>
  if (url && typeof url === "string") {
    // The redirect needs to be set here and not in the return url since Auth0
    // does not support dynamic redirect URLs:
    // https://community.auth0.com/t/callback-url-wildcard-to-avoid-explicit-index-html/6992/2
    // https://community.auth0.com/t/back-url-on-logout-and-redirect-to-back-url-after-login/39076/2
    local.redirect = url;
  }

  return auth.logout();
};

export default function Auth({ persist, onUser, children }) {
  const [user, setUser] = useState(false);
  const [error, setError] = useState(false);
  // If either there is a localStorage token for the user (but no user yet) or
  // there is a hash (after Auth0's redirect), Auth should be considered loding
  const [loading, setLoading] = useState((local.token && !user) || hasHash());

  // Log the user in either from a token or from the hash
  useAsyncEffect(async () => {
    // Already has user, no need to do anything else here
    if (user) return;

    try {
      setLoading(true);

      // There was an error in Auth. We don't want to logout since the user is
      // not yet logged in, and we also don't want to redirect anywhere
      if (hasHash("error_description=")) {
        const error = auth.parseHashError(url.hash);
        setError(`Error: ${error}`);
        clearHash();
      }

      // After authentication with Auth0, we have the url with a hash
      if (hasHash("access_token=")) {
        const { accessToken } = await auth.parseHash(url.hash);
        local.token = accessToken;
        clearHash();
      }

      // Finally we have the user, either from Auth0 or a previous session
      if (local.token) {
        const raw = await auth.userInfo(local.token);
        const profile = {
          id: raw.sub,
          name: raw.name,
          email: raw.email,
          img: raw.picture
        };
        local.user = profile;
        setUser(profile);
        if (onUser) onUser(profile);
      }
    } catch (error) {
      logout();
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // This redirects the user to Auth0's page, so the setLoading(true) does not
  // need to be undone since there's a navigation away. It is added though in
  // case the page takes a bit long to load, so that the user knows that the
  // action was executed
  const onLogin = () => {
    local.redirect = window.location.pathname + window.location.search;
    setLoading(true);
    auth.login();
  };

  if (user) {
    return (
      <AuthContext.Provider value={{ user, token: local.token, logout }}>
        {children}
      </AuthContext.Provider>
    );
  }

  return [
    <Spinner active={loading} />,
    <Login error={error} onLogin={onLogin} />
  ];
}

const useAuth = () => useContext(AuthContext);

export { useAuth, Spinner, AuthContext };
