const express = require("express");
const {
  getTopics,
  getArticles,
  getCommentsByArticleId,
} = require("./controllers/controllers");

const app = express();
//Requests:---------------------------------------
app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

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
  } else next(err);
});

// Internal error handler
app.use((req, res, next) => {
  res.status(404).send({ msg: "Path not found" });
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("Server Error!");
});
//------------------------------------------------
module.exports = { app };
