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

describe("GET: /api/topics", () => {
  test("Responds with 200 and array of objects containing two properties: slug and description", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            }),
          ])
        );
      });
  });
});
