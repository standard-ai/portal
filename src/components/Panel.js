import React from "react";
import styled from "styled-components";

const FullPage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  width: 100%;
  height: 100vh;
  align-items: center;
  justify-content: center;
  background-color: rgb(243, 249, 253);
`;

const Panel = styled.div`
  box-sizing: border-box;
  max-width: 450px;
  padding: 30px 40px;
  font-size: 18px;
  color: #333;
  background: #fff;
  border: 3px solid #eee;
`;

export default ({ loading, children }) => (
  <FullPage className="standard-portal">
    <Panel>{children}</Panel>
  </FullPage>
);
