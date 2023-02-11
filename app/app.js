const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const {
  getTopics,
  getArticles,
  getArticleById,
  getCommentsByArticleId,
  postComment,
  patchVotes,
  getUsers,
  deleteComment,
  getAllEndpoints,
} = require("./controllers/controllers");

const app = express();
app.use(cors());

app.use(express.json());
app.use(bodyParser.json());

//Requests:---------------------------------------
app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles); // accepts query

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", patchVotes);

app.get("/api/users", getUsers);

app.delete("/api/comments/:comment_id", deleteComment);

app.get("/api", getAllEndpoints);

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
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("Server Error!");
});
//------------------------------------------------
module.exports = { app };
