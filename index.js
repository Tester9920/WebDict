const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const ZhArticle = require('./db').ZhArticle;
const EnArticle = require('./db').EnArticle;
const read = require('node-readability');
const buildHtml = require('./buildHtml');
const buildIndexHtml = require('./indexTemplate');
const logger = require('./logger');
const { error } = require('console');
const log4js = require('log4js');

app.use(log4js.connectLogger(logger.AccessLogger, { level: 'info' }));
app.use(express.static('files'));

app.set('port', process.env.PORT || 80);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send(buildIndexHtml());
});

app.get('/articles', (req, res, next) => {
  const searchQuery = req.query.q;
  const searchQueryRaw = req.query.rawq;
  const langParam = req.query.l;
  try {
    // define searchQuery if conditions
    if (searchQuery && langParam == 'en') {
      EnArticle.search(searchQuery, (err, articles) => {
        res.send(buildHtml.manyEnArticles(articles));
      });
  } else if (searchQuery && langParam == 'zh') {
    ZhArticle.search(searchQuery, (err, articles) => {
      res.send(buildHtml.manyZhArticles(articles));
    });
  }
    else if (searchQuery && (langParam == null ||     langParam == undefined)) {
      // if no lang param, search in English by default
    EnArticle.search(searchQuery, (err, articles) => {
      res.send(buildHtml.manyEnArticles(articles));
    });
  } else {
      // define SearchQueryRaw if conditions
    if (searchQueryRaw && langParam == 'zh') {
    ZhArticle.search(searchQueryRaw, (err, articles) => {
      res.send(articles);
    });
  } else if (searchQueryRaw && langParam == 'en') {
    EnArticle.search(searchQueryRaw, (err, articles) => {
      res.send(articles);
    });
  } else if (searchQueryRaw && (langParam == null || langParam == undefined)) {
    EnArticle.search(searchQueryRaw, (err, articles) => {
      res.send(articles);
    });
  } else {
      if (!searchQueryRaw) {
    console.error(langParam);
    res.status(500).send('A search term is invaild. Please try again.');
  }}}} catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).send('An error occurred while fetching articles. Please try again later.');
}});

app.get('/articles/:query', (req, res, next) => {
  const query = req.params.query;
  if (!isNaN(Number(query)) && Number.isInteger(Number(query))) {
    ZhArticle.find(query, (err, article) => {
      try {
        if (!article) {
          console.log(article);
          return res.status(404).send('Article not found');
        }
        res.send(buildHtml.oneZhArticle(article));
      } catch (error) {
        console.error('Error fetching article:', error);
        res.status(500).send('An error occurred while fetching the article. Please try again later.');
      }
    });
  } else {
    const query = req.params.query;
    EnArticle.find(query, (err, article) => {
      try {
        if (!article) {
          console.log(article);
          return res.status(404).send('Article not found');
        }
        res.send(buildHtml.oneEnArticle(article));
      } catch (error) {
        console.error('Error fetching article:', error);
        res.status(500).send('An error occurred while fetching the article. Please try again later.');
      }
    });
  }
});

app.listen(app.get('port'), () => {
  console.log('App started on port', app.get('port'));
});

module.exports = app;