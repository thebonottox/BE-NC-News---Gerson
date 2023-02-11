const db = require("../../db/connection");
const fs = require("fs");

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

const fetchAllArticles = (topic) => {
  let queryValues = [];
  let queryString = `SELECT comments.article_id as article_id,
   articles.author,articles.title, articles.topic,
    articles.created_at, articles.votes,
     articles.article_img_url, COUNT(comments.article_id) as comment_count FROM articles LEFT JOIN comments
      ON articles.article_id = comments.article_id `;
  if (topic !== undefined) {
    queryString += "WHERE articles.topic = $1";
    queryValues.push(topic);
  }
  queryString += `GROUP BY comments.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes,
      articles.article_img_url
      ORDER BY created_at DESC`;
  return db.query(queryString, queryValues).then((result) => {
    if (!result) {
      return Promise.reject({
        status: 404,
        msg: `Something went wrong`,
      });
    }

    return result.rows;
  });
}; // accepts topic query

const fetchArticleById = (article_id) => {
  const queryString = `SELECT articles.*,
     COUNT(comments.article_id) AS comment_count
   FROM articles LEFT JOIN comments
      ON articles.article_id = comments.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id`;
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

const addComment = (newComment, article_id) => {
  const insertQuery = `INSERT INTO comments
  (author, body, article_id)
  VALUES ($1, $2, $3)
  RETURNING *`;
  return db
    .query(insertQuery, [newComment.username, newComment.body, article_id])
    .then(({ rows }) => {
      return rows;
    });
};

const updateVotesByArticleId = (article_id, inc_votes) => {
  const updateQuery = `UPDATE articles SET votes = votes + $1 WHERE articles.article_id = $2 RETURNING*`;
  return db.query(updateQuery, [inc_votes, article_id]).then((result) => {
    return result.rows[0];
  });
};

const fetchAllUsers = () => {
  const queryString = `SELECT * FROM users`;
  return db
    .query(queryString)
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log(err + " in fetchAllUsers");
    });
};

const removeComment = (comment_id) => {
  const queryString = `DELETE FROM comments WHERE comments.comment_id = $1 RETURNING*`;
  return db.query(queryString, [comment_id]).then((result) => {
    console.log(result.rows);
    return result.rows;
  });
};

const fetchAllEndpoints = (callback) => {
  fs.readFile(`endpoints.json`, "utf-8", (err, data) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, JSON.parse(data));
    }
  });
};
//---------------------------------------------------
module.exports = {
  fetchTopicsData,
  fetchAllArticles,
  fetchArticleById,
  fetchCommentsByArticleId,
  updateVotesByArticleId,
  addComment,
  fetchAllUsers,
  removeComment,
  fetchAllEndpoints,
};
