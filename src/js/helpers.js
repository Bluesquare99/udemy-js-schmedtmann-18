import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]); // by putting 'url' in input you can reuse it in various ways
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    // By throwing an error, the promise will reject!
    // This allows us to handle it in the catch block of the model.js file
    throw err;
  }
};

/* 

export const getJSON = async function (url) {
  try {
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]); // by putting 'url' in input you can reuse it in various ways
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    // By throwing an error, the promise will reject!
    // This allows us to handle it in the catch block of the model.js file
    throw err;
  }
};

export const sendJSON = async function (url, uploadData) {
  try {
    const res = await Promise.race([
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(uploadData),
      }),
      timeout(TIMEOUT_SEC),
    ]); // by putting 'url' in input you can reuse it in various ways
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    // By throwing an error, the promise will reject!
    // This allows us to handle it in the catch block of the model.js file
    throw err;
  }
};

*/
