const db = require("../../db/connection");

//Model Functions:

const fetchTopicsData = () => {
  const queryString = `SELECT * FROM topics`;
  return db
    .query(queryString)
    .then((result) => {
      //   console.log(result.rows, "<--------result seems right");
      return result.rows;
    })
    .catch((err) => {
      console.log(err + " in fetchTreasures");
    });
};

//---------------------------------------------------
module.exports = {
  fetchTopicsData,
};
