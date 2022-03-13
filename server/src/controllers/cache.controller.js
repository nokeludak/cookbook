import cachedUser from "../../../cache/cachedUser";

const getCache = (req, res) => {
  res.status(200).json(cachedUser);
};

export default { getCache };
