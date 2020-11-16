import auth from "./auth";

export default (url = window.location.pathname) => {
  // Check it's a string because many times this callback is implemented as
  // <Button onClick={logout}>Logout</Button>
  if (url && typeof url === "string") {
    // The redirect needs to be set here and not in the return url since Auth0
    // does not support dynamic redirect URLs:
    // https://community.auth0.com/t/callback-url-wildcard-to-avoid-explicit-index-html/6992/2
    // https://community.auth0.com/t/back-url-on-logout-and-redirect-to-back-url-after-login/39076/2
    localStorage.redirect = url;
  }

  // This redirects to the Auth0 page and then back, so there's always a refresh
  // which means no setUser(false) is needed
  return auth.logout();
};
