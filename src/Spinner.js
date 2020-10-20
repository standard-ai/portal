import React from "react";
import styled from "styled-components";

const FullPage = styled.div`
  position: absolute;
  display: flex;
  width: 100%;
  height: 100vh;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  transform: scale(50%);

  background: white;
  opacity: 0;
  pointer-events: none;

  ${p =>
    p.active &&
    `
    opacity: 1;
    transform: scale(100%);
  `}
`;

const Spin = styled.div`
  position: relative;
  font-size: 10px;
  width: 200px;
  height: 200px;

  ::before,
  ::after {
    display: block;
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    border-radius: 50%;
    box-sizing: border-box;
  }

  ::before {
    background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJmZWF0aGVyIGZlYXRoZXItdXNlciI+PHBhdGggZD0iTTIwIDIxdi0yYTQgNCAwIDAgMC00LTRIOGE0IDQgMCAwIDAtNCA0djIiPjwvcGF0aD48Y2lyY2xlIGN4PSIxMiIgY3k9IjciIHI9IjQiPjwvY2lyY2xlPjwvc3ZnPg==");
    ${p => p.img && `background-image: url("${p.img}");`}
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 60px;
  }

  ::after {
    border: 10px solid #137bd633;
    border-top: 10px solid #137bd6;
    // Note: this is only possible because the time of a loop is 1s, so we are
    // syncying with the clock time as well. Otherwise would need to get the
    // second as well and do "full_unix_time%duration"
    animation: spin 1s infinite linear -${p => p.ms}s;
  }

  @keyframes spin {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
`;

export default ({ active = true, img }) => (
  <FullPage active={active}>
    <Spin img={img} ms={new Date().getMilliseconds() / 1000} />
  </FullPage>
);
