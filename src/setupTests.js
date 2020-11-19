import regeneratorRuntime from "regenerator-runtime";
import crypto from "crypto";

Object.defineProperty(global.self, "crypto", {
  value: {
    getRandomValues: arr => crypto.randomBytes(arr.length)
  }
});

global.crypto.subtle = {};
