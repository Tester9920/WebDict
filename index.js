const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const Article = require('./db').Article;
const read = require('node-readability');
const buildHtml = require('./buildHtml');
const buildIndexHtml = require('./indexTemplate');
const logger = require('./logger');
const { error } = require('console');
const log4js = require('log4js');

app.use(log4js.connectLogger(logger.AccessLogger, { level: 'info' }));
app.use(express.static('files'));

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send(buildIndexHtml());
});

app.get('/articles', (req, res, next) => {
  try {
  const searchQuery = req.query.q;
  const searchQueryRaw = req.query.rawq;
  if (searchQuery) {
    Article.search(searchQuery, (err, articles) => {
      res.send(buildHtml.manyArticles(articles));
    });
  } else if (searchQueryRaw) {
    Article.search(searchQueryRaw, (err, articles) => {
      res.send(articles);
    });
  } else {
    Article.all((err, articles) => {
      res.send(articles);
    });
  }} catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).send('An error occurred while fetching articles. Please try again later.');
}});

app.get('/articles/:id', (req, res, next) => {
  const id = req.params.id;
  Article.find(id, (err, article) => {
    try {
      if (!article) {
        console.log(article);
        return res.status(404).send('Article not found');
      }
      res.send(buildHtml.oneArticle(article));
    } catch (error) {
      console.error('Error fetching article:', error);
      res.status(500).send('An error occurred while fetching the article. Please try again later.');
    }
  });
  });

app.listen(app.get('port'), () => {
  console.log('App started on port', app.get('port'));
});

module.exports = app;