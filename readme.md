# Standard Portal

This is a React + Auth0 library to easily handle authentication for internal apps with minimal overhead. We made it because we have multiple apps that use Auth, and it's a lot easier to create a reusable module based on some conventions than doing it from scratch every time or maintaining copies. It includes:

- Automatic configuration from environment variables
- Shows "Login Page" and blocks children until the user has logged in
- Top-right default mini profile once logged in for easy session management
- Refresh token and all other nice Auth0 logic included
- React Hooks and some other useful API elements for light customization

Portal preview:

<table>
  <tr>
    <th>
      Portal home page
    </th>
    <th>
      Logged-in profile
    </th>
  </tr>
  <tr>
    <td>
      <img src="./assets/home-login.jpg" width="600px" />
    </td>
    <td>
      <img src="./assets/profile.gif" width="300px" />
    </td>
  </tr>
</table>

```js
// App.js - The code for the screenshot above:
import Portal from "@standard/portal";

// Just a plain <Auth> wrapper includes a lot of goodies:
export default () => (
  <Portal>
    <div>Your normal App code here...</div>
  </Portal>
);
```

If you don't like e.g. the default profile on the top-right, you can easily remove it and provide your own:

```js
// App.js
import Portal, { useProfile } from "@standard/portal";

const Greeting = () => {
  const user = useProfile();
  return (
    <div class="CustomProfile">
      <p>Hi {user.name}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default () => (
  <Portal showProfile={false}>
    <Greeting />
    <div>Your normal App code here...</div>
  </Portal>
);
```

## Getting started

This is the _quick guide_ on how to get started. First install this library:

```bash
npm i @standard/portal
```

Then provide the Auth0 config as environment variables:

```
# Find this in Auth0
REACT_APP_AUTH_CLIENT_ID=
REACT_APP_AUTH_DOMAIN=
REACT_APP_AUTH_AUDIENCE=
```

Finally set it up. Normally just dropping it on your `App.js` it's enough!

```js
// App.js
import Portal from "@standard/portal";

export default () => (
  <Portal>
    <div>Your normal App code here...</div>
  </Portal>
);
```

Finally put an image on your `/portal-background.jpg` to use as the fullscreen background of the portal.

This so far will only provide a plain frontend-only auth. But your data should be locked up behind auth, so you will need to pass the auth token at least to the API. For this you would usually use either the [`<Portal onUser={fn}>...</Portal>`](#portal) callback, or the [`await getToken()`](#await-gettoken) exported function.

## Configuration

The configuration is automatically read from the **environment variables**. These are all of the variables that you can setup:

```
# Required variables from Auth0:
REACT_APP_AUTH_CLIENT_ID=
REACT_APP_AUTH_DOMAIN=
REACT_APP_AUTH_AUDIENCE=

# Optional variables with their defaults:
REACT_APP_AUTH_REDIRECT=/
REACT_APP_AUTH_RESPONSE_TYPE=token id_token
REACT_APP_AUTH_SCOPE=openid profile email
REACT_APP_AUTH_RETURN_TO=/
```

## API

```js
import Portal, { useProfile, getToken, logout, AuthContext } from '@standard/portal';
<Portal onUser={fn} showProfile={true}>   // A component that accepts an `onUser` function and showProfile boolean
const profile = useProfile();  // A React Hook
const { id, name, email, img } = useProfile();  // A React Hook
await logout();      // A function that will log the user out
```

The main portal _title_ will be taken from the `<head><title>...</title></head>`, and the background image must be available under the route `/portal-background.jpg`.

### <Portal />

It also exposes a single event, `onUser`, for whenever a user logs in. This is useful for e.g. attaching the user to Sentry:

```js
import Portal from "@standard/portal";
import * as Sentry from "@sentry/browser";

// Register the user on Sentry
const onUser = ({ name, email }, token) => {
  Sentry.configureScope(function(scope) {
    scope.setUser({ username: name, email });
  });
};

export default () => (
  <Portal onUser={onUser}>
    <div>Your normal App code here...</div>
  </Portal>
);
```

### useProfile()

### await getToken()

### await logout()

### AuthContext

## Examples

### API token

### Sentry integration

We can register the user on Sentry (error reporting) taking advantage of `onUser`:

```js
import React from "react";
import Portal from "@standard/portal";
import * as Sentry from "@sentry/browser";

// Register the user on Sentry
const onUser = ({ name, email }, token) => {
  Sentry.configureScope(function(scope) {
    scope.setUser({ username: name, email });
  });
};

export default () => (
  <Portal onUser={onUser}>
    <div>Your normal App code here...</div>
  </Portal>
);
```

### Custom Profile

### Loading
