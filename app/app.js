const express = require("express");
const { getTopics, getArticles } = require("./controllers/controllers");

const app = express();
app.use(express.json());

//Requests:---------------------------------------
app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

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
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("Server Error!");
});
//------------------------------------------------
module.exports = { app };
