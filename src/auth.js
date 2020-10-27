// This is a thin wrapper around auth0.js to handle all of the environment
// variables properly
import makeAbsolute from "./makeAbsolute";
import { Auth0Client } from "@auth0/auth0-spa-js";

const {
  REACT_APP_AUTH_DOMAIN,
  REACT_APP_AUTH_CLIENT_ID,
  REACT_APP_AUTH_AUDIENCE,
  REACT_APP_AUTH_RETURN_TO = "/",
  REACT_APP_AUTH_REDIRECT = "/"
} = process.env;

const auth0 = new Auth0Client({
  domain: REACT_APP_AUTH_DOMAIN,
  client_id: REACT_APP_AUTH_CLIENT_ID,
  audience: REACT_APP_AUTH_AUDIENCE,
  redirect_uri: makeAbsolute(REACT_APP_AUTH_REDIRECT),
  useRefreshTokens: true,
  cacheLocation: "localstorage"
});

const auth = {};

// Extend the auth0 object
for (let key in auth0) {
  auth[key] = (...args) => auth0[key](...args);
}

// Extend how auth0 handles global variables and such
auth.login = () => {
  return auth0.loginWithRedirect();
};

auth.logout = () => {
  return auth0.logout({
    client_id: REACT_APP_AUTH_CLIENT_ID,
    returnTo: makeAbsolute(REACT_APP_AUTH_RETURN_TO)
  });
};

export default auth;
