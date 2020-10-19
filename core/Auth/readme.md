# Standard Gateway

This is a React wrapper component that will required the user to be authenticated before displaying anything else. Usage is simple:

```js
// App.js
import React from "react";
import Auth, { useAuth } from "./Auth";

const Logout = () => {
  const { user, logout } = useAuth();
  return <button onClick={logout}>{user.name} Logout</button>;
};

export default () => (
  <Auth>
    <div>Your normal App code here...</div>
  </Auth>
);
```

It will read your environment variables to find the proper Auth ones:

```
# Required variables
REACT_APP_AUTH_CLIENT_ID=
REACT_APP_AUTH_DOMAIN=
REACT_APP_AUTH_AUDIENCE=

# Optional variables with their defaults:
REACT_APP_AUTH_REDIRECT=/
REACT_APP_AUTH_RESPONSE_TYPE=token id_token
REACT_APP_AUTH_SCOPE=openid profile email
REACT_APP_AUTH_RETURN_TO=https://homepage.com/
```

### API

```js
import Auth, { useAuth } from './Auth';
<Auth onUser={fn}>
const { user, token, logout } = useAuth();  // A Hook
user.id;
user.name;
user.email;
user.img;
await logout();
```

It also exposes a single event, `onUser`, for whenever a user logs in. This is useful for e.g. attaching the user to Sentry:

```js
import React from "react";
import Auth from "./Auth";
import * as Sentry from "@sentry/browser";

// Register the user on Sentry
const onUser = ({ name, email }, token) => {
  Sentry.configureScope(function(scope) {
    scope.setUser({ username: name, email });
  });
};

export default () => (
  <Auth onUser={onUser}>
    <div>Your normal App code here...</div>
  </Auth>
);
```

If you want to add a listener to both login and logout, your best bet for now is using a listener just below:

```js
const UserListener = () => {
  const { token } = useAuth();
  useEffect(() => {});
};

export default () => (
  <Auth onUser={onUser}>
    <UserListener />
    <div>Your normal App code here...</div>
  </Auth>
);
```

## Profile

A fully working example implementation of a user profile:

```js
import React, { useState } from "react";
import styled from "styled-components";

import { useAuth } from "./Auth";

const Floating = styled.div`
  position: fixed;
  top: 10px;
  right: 10px;
  width: 60px;
  height: 60px;
  background: white;
  border-radius: 50%;
  z-index: 100;
`;

const Picture = styled.img`
  width: 100%;
  border-radius: 50%;
  float: right;
  cursor: pointer;
`;

const Box = styled.div`
  position: fixed;
  top: 80px;
  right: 10px;
  border: 2px solid #ccc;
  background: white;
  border-radius: 4px;
  padding: 10px 15px;
  opacity: 0;
  transform: translateY(-10px);
  transition: all 0.3s ease;

  ${p =>
    p.visible &&
    `
    opacity: 1;
    transform: translateY(0);
  `}

  &::before {
    position: fixed;
    content: "";
    display: block;
    width: 0;
    height: 0;
    border: 8px solid black;
    top: -8px;
    right: 20px;
    border-width: 0 8px 8px 8px;
    border-color: transparent transparent #ccc transparent;
  }
`;

const Link = styled.button`
  background-color: transparent;
  border: none;
  color: #0645ad;
  cursor: pointer;
  text-decoration: underline;
  font-size: inherit;
  display: inline;
  margin: 0;
  padding: 0;
`;

export default function Profile() {
  const { user, logout } = useAuth();
  const [show, setShow] = useState(false);
  return (
    <Floating>
      <Picture onClick={() => setShow(!show)} src={user.img} />
      <Box visible={show}>
        <div>{user.name}</div>
        <Link onClick={logout}>Logout</Link>
      </Box>
    </Floating>
  );
}
```
