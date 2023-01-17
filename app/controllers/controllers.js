// need to require in functions in models
const { fetchTopicsData } = require("../models/models");

// Controllers:
const getTopics = (request, response, next) => {
  fetchTopicsData()
    .then((topicsData) => {
      if (!topicsData) {
        return response.status(404).send({ error: "Topics not found" });
      }
      response.status(200).send(topicsData);
    })
    .catch(next);
};

//---------------------------------------------
module.exports = { getTopics };
