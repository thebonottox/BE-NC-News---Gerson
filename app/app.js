const express = require("express");

const {
  getTopics,
  getArticles,
  getArticleById,
  getCommentsByArticleId,
  postComment,
} = require("./controllers/controllers");

const app = express();

app.use(express.json());

//Requests:---------------------------------------
app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postComment);

// Customer errors:
app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

//PG errors handler:
app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "Article ID not found." });
  } else next(err);
});

// Internal error handler
// app.use((err, req, res, next) => {
//   res.status(404).send({ msg: "Path not found" });
// });

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("Server Error!");
});
//------------------------------------------------
module.exports = { app };
