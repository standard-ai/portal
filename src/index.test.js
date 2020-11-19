import React from "react";
import $ from "react-test";
import Portal from "./";

it("by default renders the login page", async () => {
  const portal = $(<Portal />);
  expect(portal.find("h1")).toHaveText("User Login");
  expect(portal.find("button")).toHaveText("Login");
});
