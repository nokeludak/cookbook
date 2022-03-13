import base from "../config";

const list = () => {
  return fetch(`${base}/recipe`, { method: "GET" })
    .then((response) => response.json())
    .catch((err) => console.log(err));
};

export { list };
