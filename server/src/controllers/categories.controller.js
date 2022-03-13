import data from "../../data/categories.json";

const sendData = (req, res) => {
  res.json(data.data);
};

export default { sendData };
