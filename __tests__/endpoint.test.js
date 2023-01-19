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

// Errors -----------------------------
describe("app", () => {
  test("404 invalid path", () => {
    return request(app)
      .get("/invalid-path")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found");
      });
  });
});

// Tests Task 3:---------------------
describe("GET: /api/topics", () => {
  test("Returned array has length of 3", () => {
    const response = request(app)
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

// Tests Task 6: -----------------
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
});
