// need to require in functions in models
const { fetchTopicsData, fetchArticlesData } = require("../models/models");

// Controllers:
const getTopics = (request, response, next) => {
  fetchTopicsData()
    .then((topicsData) => {
      // if (!topicsData) {
      //   return response.status(404).send({ error: "Topics not found" });
      // }
      response.status(200).send(topicsData);
    })
    // .catch(next);
    .catch((err) => {
      next(err);
    });
};

const getArticles = (request, response, next) => {
  fetchArticlesData()
    .then((articlesData) => {
      // if (!articlesData) {
      //   return response.status(404).send({ error: "Articles not found" });
      // }
      // console.log(articlesData, "<-----articlesData");

      response.status(200).send(articlesData);
    })
    // .catch(next);
    .catch((err) => {
      next(err);
    });
};

//---------------------------------------------
module.exports = { getTopics, getArticles };
