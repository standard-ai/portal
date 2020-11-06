import React from "react";
import styled from "styled-components";
import Panel from "./Panel";

const Title = styled.h1`
  margin: 0;
  padding: 0;
`;

const Button = styled.button`
  background: #137bd6;
  padding: 10px 25px;
  border: none;
  font-size: inherit;
  border-radius: 6px;
  color: white;
  cursor: pointer;
`;

const Error = styled.p`
  color: red;
`;

export default ({ error, onLogin }) => (
  <Panel>
    <Title>{document.title || "User Login"}</Title>
    <p>You need an account and to be logged in to use this page:</p>
    <Button onClick={onLogin}>Login</Button>
    {error && <Error>{error}</Error>}
  </Panel>
);
