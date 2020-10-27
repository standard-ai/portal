import React, { useState } from "react";
import styled from "styled-components";

import logout from "./logout";
import useProfile from "./useProfile";

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
  pointer-events: none;
  ${p =>
    p.visible &&
    `
    opacity: 1;
    transform: translateY(0);
    pointer-events: all;
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
  const user = useProfile();
  const [show, setShow] = useState(false);
  return (
    <Floating>
      <Picture onClick={() => setShow(!show)} src={user.img} />
      <Box visible={show}>
        <div>{user.name}</div>
        <Link onClick={() => logout("/")}>Logout</Link>
      </Box>
    </Floating>
  );
}
