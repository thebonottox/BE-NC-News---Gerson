# Northcoders News API

## .ENV Files

You will need to create two .env files for your project: .env.test and .env.development. Into each, add PGDATABASE=<database_name_here>, with the correct database name for that environment (see /db/setup.sql for the database names)


## Link to hosted version:
https://be-nc-news-gerson.onrender.com

## Summary of the project:
This is an API for managing and retrieving data related to articles from different subjects.
Developers are able to access information such as:
all articles, articles by article_id, comments by article_id, comment count for each article as well as using queries for topic, sort_by and order (asc or desc).
It is also possible to post new comments to an article and patch the number of votes for any article using the article_id property.
Lastly, users can also delete comments using the comment_id property,

# The link below shows each of the endpoints available in the api with examples of response for each of them:
https://be-nc-news-gerson.onrender.com/api


## Running the project locally:

1. Clone the repository: https://github.com/thebonottox/BE-NC-News---Gerson.git

2. Install dependencies: npm install

3. Seed the local database: npm run seed

4. Run the tests: npm test

5. Minimum versions required:
Node.js:">=6.0.0"
Postgrees: "^8.7.3"