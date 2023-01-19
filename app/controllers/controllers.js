// need to require in functions in models
const {
  fetchTopicsData,
  fetchAllArticles,
  fetchCommentsByArticleId,
} = require("../models/models");

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
  fetchAllArticles()
    .then((articles) => {
      // if (!articlesData) {
      //   return response.status(404).send({ error: "Articles not found" });
      // }
      // console.log(articlesData, "<-----articlesData");

      response.status(200).send(articles);
    })
    // .catch(next);
    .catch((err) => {
      next(err);
    });
};

const getCommentsByArticleId = (request, response, next) => {
  const { article_id } = request.params;
  fetchCommentsByArticleId(article_id)
    .then((comments) => {
      response.status(200).send(comments);
    })
    .catch((err) => {
      next(err);
    });
};
//---------------------------------------------
module.exports = { getTopics, getArticles, getCommentsByArticleId };
