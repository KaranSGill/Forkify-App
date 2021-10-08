import { TIMEOUT_SEC } from "./config.js";
import { async } from "regenerator-runtime";

const timeout = function (s) {
    return new Promise(function (_, reject) {
      setTimeout(function () {
        reject(new Error(`Request took too long! Timeout after ${s} second`));
      }, s * 1000);
    });
  };

export const getJSON = async function (url) {
  try {
      // We are using Pormise.race([]) to put a fetch and timeout which ever wins is seen on the screen
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
    const result = await res.json();

    if (!res.ok) throw new Error(`${result.message} (${res.status})`);
    // console.log(res);

    return result;
  } catch (err) {
    throw err;
  }
};
