// need to require in functions in models
const {
  fetchTopicsData,
  fetchAllArticles,
  fetchArticleById,
  fetchCommentsByArticleId,
  updateVotesByArticleId,
  addComment,
  fetchAllUsers,
  removeComment,
  fetchAllEndpoints,
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
  const { topic, sort_by, order } = request.query;
  fetchAllArticles(topic, sort_by, order)
    .then((articles) => {
      response.status(200).send(articles);
    })
    .catch((err) => {
      next(err);
    });
}; // accepts topic query

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

const postComment = (request, response, next) => {
  const { article_id } = request.params;
  const newComment = request.body;
  addComment(newComment, article_id)
    .then((rows) => {
      const sendBack = { username: rows[0].author, body: rows[0].body };
      response.status(201).send(sendBack);
    })
    .catch((err) => {
      next(err);
    });
};

const patchVotes = (request, response, next) => {
  const { article_id } = request.params;
  const { inc_votes } = request.body;
  updateVotesByArticleId(article_id, inc_votes).then((updatedArticle) => {
    response.status(200).send(updatedArticle);
  });
};

const getUsers = (request, response, next) => {
  fetchAllUsers()
    .then((users) => {
      response.status(200).send(users);      
    })
    .catch((err) => {
      next(err);
    });
};

const deleteComment = (request, response, next) => {
  const { comment_id } = request.params;
  removeComment(comment_id)
    .then((comment) => {
      response.status(204).send(comment);
    })
    .catch((err) => {
      next(err);
    });
};

// const endpointsData = require("../endpoints");

const getAllEndpoints = (request, response) => {
  fetchAllEndpoints((err, data) => {
    if (err) {
      response.status(500).send({ error: "Error reading file" });
    } else {
      response.status(200).send(data);
    }
  });
};

//---------------------------------------------

module.exports = {
  getTopics,
  getArticles,
  getArticleById,
  getCommentsByArticleId,
  postComment,
  patchVotes,
  getUsers,
  deleteComment,
  getAllEndpoints,
};
