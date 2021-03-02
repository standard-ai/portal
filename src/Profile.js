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
  position: absolute;
  right: 0;
  top: 0;
  width: 100%;
  border-radius: 50%;
  float: right;
  cursor: pointer;
`;

const Box = styled.div`
  position: absolute;
  top: calc(100% + 5px);
  right: 0;
  width: 300%;

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
    /* width / 3 = width of img */
    /* width / 3 - 16px (self-width) - 2px (margin) */
    right: calc(33.33% / 2 - 14px);
    border-width: 0 8px 8px 8px;
    border-color: transparent transparent #ccc transparent;
  }
`;

const P = styled.p`
  margin: 0;
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
    <Floating className="standard-portal">
      <Picture onClick={() => setShow(!show)} src={user.img} />
      <Box visible={show}>
        <P>{user.name}</P>
        <Link onClick={() => logout("/")}>Logout</Link>
      </Box>
    </Floating>
  );
}
