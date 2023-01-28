// Require in supertest
const request = require("supertest");
//Require in app.js
const { app } = require("../app/app.js");
// Require in connection file:
const db = require("../db/connection");
// Require in Seed File:
const seed = require("../db/seeds/seed");

//Require in test data:
const {
  articleData,
  commentData,
  topicData,
  userData,
} = require("../db/data/test-data/index");

beforeEach(() => {
  return seed({ articleData, commentData, topicData, userData });
});

afterAll(() => {
  return db.end();
});

// Tests Task 3:---------------------
describe("GET: /api/topics", () => {
  test("Returned array has length of 3", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        expect(response.body.length).toBe(3);
      });
  });
  test("Returned object contains two properties: slug and description", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        response.body.forEach((object) => {
          expect(object).toHaveProperty("slug");
          expect(object.slug).toEqual(expect.any(String));
          expect(object).toHaveProperty("description");
          expect(object.description).toEqual(expect.any(String));
        });
      });
  });
});

// Tests Task 4: -------------------
describe("GET: /api/articles", () => {
  test("Returns array of objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
        expect(typeof response.body[0]).toBe("object");
      });
  });

  test("Returned objects should include all properties but 'body'", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        response.body.forEach((object) => {
          expect(object).not.toHaveProperty("body");
          expect(object).toHaveProperty("author");
          expect(object).toHaveProperty("title");
          expect(object).toHaveProperty("topic");
          expect(object).toHaveProperty("created_at");
          expect(object).toHaveProperty("votes");
          expect(object).toHaveProperty("article_img_url");
        });
      });
  });

  test("Returned objects include an article_id property which will refer to article_id in comments table", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        response.body.forEach((object) => {
          expect(object).toHaveProperty("article_id");
        });
      });
  });
  test("Returned objects should contain a comment_count property with the total count of all the comments with the respective article_id", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        response.body.forEach((object) => {
          expect(object).toHaveProperty("comment_count");
        });
      });
  });
  test("Articles should be sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        response.body.forEach((item, index) => {
          if (index < response.body.length - 1) {
            expect(new Date(item.created_at).getTime()).toBeGreaterThanOrEqual(
              new Date(response.body[index + 1].created_at).getTime()
            );
          }
        });
      });
  });
});

// Test Task 5: --------------------
describe("GET: /api/articles/:article_id", () => {
  test("200: Returns articles object with required properties", () => {
    return request(app)
      .get("/api/articles/4")
      .expect(200)
      .then((response) => {
        const article = response.body.article;
        expect(article).toHaveProperty("author");
        expect(article).toHaveProperty("title");
        expect(article).toHaveProperty("article_id");
        expect(article).toHaveProperty("body");
        expect(article).toHaveProperty("topic");
        expect(article).toHaveProperty("created_at");
        expect(article).toHaveProperty("votes");
        expect(article).toHaveProperty("article_img_url");
      });
  });
  test("Ensure id passed in exists", () => {
    return request(app)
      .get("/api/articles/9")
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty("article");
      });
  });
  test("Ensure passed in value is a number", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then((response) => {
        expect(typeof response.body.article.article_id).toBe("number");
      });
  });
});

// Tests Task 6: -----------------------------
describe("GET: /api/articles/:article_id/comments", () => {
  test("Returns array of objects", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((response) => {
        expect(Array.isArray(response.body)).toBe(true);
        expect(typeof response.body[0]).toBe("object");
      });
  });
  test("Returned objects should include requested properties", () => {
    return request(app)
      .get("/api/articles/9/comments")
      .expect(200)
      .then((response) => {
        response.body.forEach((object) => {
          expect(object).toHaveProperty("comment_id");
          expect(object).toHaveProperty("votes");
          expect(object).toHaveProperty("created_at");
          expect(object).toHaveProperty("author");
          expect(object).toHaveProperty("body");
          expect(object).toHaveProperty("article_id");
        });
      });
  });

  test("Status 400, invalid ID, e.g. string of 'not-an-id'", () => {
    return request(app)
      .get("/api/articles/not-an-id/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test("Status 404, non existent ID, e.g. 0 or 9999", () => {
    return request(app)
      .get("/api/articles/9999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article ID not found.");
      });
  });
});

// Tests Task 7:----------------------------

describe("POST: /api/articles/:article_id/comments", () => {
  test("responds with the inserted comment data", () => {
    return request(app)
      .post("/api/articles/9/comments")
      .expect(201)
      .send({
        username: "butter_bridge",
        body: "I have a body",
      })
      .then((response) => {
        const body = response.body;
        expect(body).toEqual({
          username: "butter_bridge",
          body: "I have a body",
        });
      });
  });

  test("Returned object should include requested properties", () => {
    return request(app)
      .post("/api/articles/9/comments")
      .expect(201)
      .send({
        username: "butter_bridge",
        body: "I have a body",
      })
      .then((response) => {
        // response.body.forEach((object) => {
        expect(response.body).toHaveProperty("username");
        expect(response.body).toHaveProperty("body");
      });
  });

  test("Status 400, invalid ID, e.g. string of 'not-an-id'", () => {
    return request(app)
      .post("/api/articles/not-an-id/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test("Status 404, non existent ID, e.g. 0 or 9999", () => {
    return request(app)
      .post("/api/articles/9999/comments")
      .expect(404)
      .send({
        username: "butter_bridge",
        body: "I have a body",
      })
      .then(({ body }) => {
        expect(body.msg).toBe("Article ID not found.");
      });
  });
});

// Tests Task 8: -----------------------------

describe("PATCH: /api/articles/:article_id", () => {
  test("200: Returns articles object with required properties", () => {
    return request(app)
      .patch("/api/articles/4")
      .expect(200)
      .send({ inc_votes: 10 })
      .then((response) => {
        const article = response.body;
        expect(article).toHaveProperty("author");
        expect(article).toHaveProperty("title");
        expect(article).toHaveProperty("article_id");
        expect(article).toHaveProperty("body");
        expect(article).toHaveProperty("topic");
        expect(article).toHaveProperty("created_at");
        expect(article).toHaveProperty("votes");
        expect(article).toHaveProperty("article_img_url");
      });
  });
  test("Status 400, invalid ID, e.g. string of 'not-an-id'", () => {
    return request(app)
      .get("/api/articles/not-an-id/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test("Status 404, non existent ID, e.g. 0 or 9999", () => {
    return request(app)
      .get("/api/articles/9999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article ID not found.");
      });
  });
});

// Tests Task 9: -----------------------------

describe("GET: /api/users", () => {
  test("Returned array has length of 4", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        expect(response.body.length).toBe(4);
      });
  });

  test("Test that the response is an array of objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        expect(Array.isArray(response.body)).toBe(true);
        expect(typeof response.body[0]).toBe("object");
      });
  });

  test("Returned object contains three properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        response.body.forEach((object) => {
          expect(object).toHaveProperty("username");
          expect(object.username).toEqual(expect.any(String));
          expect(object).toHaveProperty("name");
          expect(object.name).toEqual(expect.any(String));
          expect(object).toHaveProperty("avatar_url");
          expect(object.avatar_url).toEqual(expect.any(String));
        });
      });
  });
});
