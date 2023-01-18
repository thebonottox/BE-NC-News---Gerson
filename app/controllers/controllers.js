// need to require in functions in models
const {
  fetchTopicsData,
  fetchAllArticles,
  fetchArticleById,
} = require("../models/models");

// Controllers:
const getTopics = (request, response, next) => {
  fetchTopicsData()
    .then((topicsData) => {
      response.status(200).send(topicsData);
    })
    .catch((err) => {
      next(err);
    });
};

const getArticles = (request, response, next) => {
  fetchAllArticles()
    .then((articles) => {
      response.status(200).send(articles);
    })
    .catch((err) => {
      next(err);
    });
};

const getArticleById = (request, response, next) => {
  const { article_id } = request.params;
  fetchArticleById(article_id)
    .then((article) => {
      response.status(200).send({ article });
      // console.log(article, "<------------");
    })
    .catch((err) => {
      next(err);
    });
};

//---------------------------------------------
module.exports = { getTopics, getArticles, getArticleById };
