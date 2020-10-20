import Auth0 from "auth0-js";
import makeAbsolute from "./makeAbsolute";

const {
  REACT_APP_AUTH_DOMAIN,
  REACT_APP_AUTH_CLIENT_ID,
  REACT_APP_AUTH_AUDIENCE,
  REACT_APP_AUTH_REDIRECT = "/",
  REACT_APP_AUTH_RETURN_TO = "/",
  REACT_APP_AUTH_RESPONSE_TYPE = "token id_token",
  REACT_APP_AUTH_SCOPE = "openid profile email"
} = process.env;

const auth = new Auth0.WebAuth({
  domain: REACT_APP_AUTH_DOMAIN,
  clientID: REACT_APP_AUTH_CLIENT_ID,
  audience: REACT_APP_AUTH_AUDIENCE,
  redirectUri: makeAbsolute(REACT_APP_AUTH_REDIRECT),
  responseType: REACT_APP_AUTH_RESPONSE_TYPE,
  scope: REACT_APP_AUTH_SCOPE
});

const userInfo = token => {
  return new Promise((done, fail) => {
    auth.client.userInfo(token, (error, data) =>
      error ? fail(error) : done(data)
    );
  });
};

// Check if there's any error in the URL hash
const parseHashError = hash => {
  const encoded = hash
    .slice(1)
    .split("&")
    .find(err => err.includes("error_description"))
    .split("=")
    .pop();
  return decodeURIComponent(encoded);
};

const parseHash = hash => {
  return new Promise((done, fail) => {
    auth.parseHash({ hash }, (error, data) =>
      error ? fail(error) : done(data)
    );
  });
};

const login = () => auth.authorize();

const logout = () => {
  return auth.logout({
    clientID: REACT_APP_AUTH_CLIENT_ID,
    returnTo: makeAbsolute(REACT_APP_AUTH_RETURN_TO)
  });
};

export default { login, logout, userInfo, parseHashError, parseHash };
