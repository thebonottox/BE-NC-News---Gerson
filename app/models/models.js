const db = require("../../db/connection");

//Model Functions:

const fetchTopicsData = () => {
  const queryString = `SELECT * FROM topics`;
  return db
    .query(queryString)
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log(err + " in fetchTopicsData");
    });
};

const fetchAllArticles = () => {
  const queryString = `SELECT comments.article_id as article_id,
   articles.author,articles.title, articles.topic,
    articles.created_at, articles.votes,
     articles.article_img_url, COUNT(comments.article_id) as comment_count FROM articles LEFT JOIN comments
      ON articles.article_id = comments.article_id GROUP BY comments.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes,
      articles.article_img_url
      ORDER BY created_at DESC`;
  return db.query(queryString).then((result) => {
    // console.log(result.rows, "<--------result");

    if (!result) {
      return Promise.reject({
        status: 404,
        msg: `Something went wrong`,
      });
    }

    return result.rows;
  });
};

const fetchArticleById = (article_id) => {
  const queryString = `SELECT comments.article_id, articles.*
   FROM articles LEFT JOIN comments
      ON articles.article_id = comments.article_id
      WHERE articles.article_id = $1`;
  return db.query(queryString, [article_id]).then((result) => {
    if (!result) {
      return Promise.reject({
        status: 404,
        msg: `Something went wrong`,
      });
    }
    return result.rows[0];
  });
};

const fetchCommentsByArticleId = (article_id) => {
  const queryString = `SELECT * FROM comments WHERE comments.article_id = $1
   ORDER BY created_at DESC`;
  return db.query(queryString, [article_id]).then(({ rows, rowCount }) => {
    if (rowCount === 0) {
      return Promise.reject({ status: 404, msg: "Article ID not found." });
    }
    return rows;
  });
};

//---------------------------------------------------
module.exports = {
  fetchTopicsData,
  fetchAllArticles,
  fetchArticleById,
  fetchCommentsByArticleId,
};
