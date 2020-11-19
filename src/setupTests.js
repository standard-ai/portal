import regeneratorRuntime from "regenerator-runtime";
import crypto from "crypto";

// https://stackoverflow.com/q/52612122/12271991
const getRandomValues = arr => crypto.randomBytes(arr.length);
Object.defineProperty(global.self, "crypto", { value: { getRandomValues } });

global.crypto.subtle = {};
