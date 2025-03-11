const sqlite3 = require('sqlite3').verbose();
const zh_db = 'zh.db';
const en_db = 'en.db';
const zhdb = new sqlite3.Database(zh_db);
const endb = new sqlite3.Database(en_db);
const pug = require('pug');

zhdb.serialize(() => {
  const sql = `
    CREATE TABLE IF NOT EXISTS articles
    (id integer primary key, title, content TEXT)
  `;
  zhdb.run(sql);
});

class ZhArticle {
  static all(cb) {
    zhdb.all('SELECT * FROM articles', cb);
  }

  static find(id, cb) {
    zhdb.get('SELECT * FROM articles WHERE id = ?', id, cb);
  }

  static create(data, cb) {
    const sql = 'INSERT INTO articles(title, content) VALUES (?, ?)';
    zhdb.run(sql, data.title, data.content, cb);
  }

  static delete(id, cb) {
    if (!id) return cb(new Error('Please provide an id'));
    zhdb.run('DELETE FROM articles WHERE id = ?', id, cb);
  }

  static search(query, cb) {
    const searchQuery = `%${query}%`;
    zhdb.all('SELECT * FROM articles WHERE title LIKE ?', searchQuery, cb);
  }
}

class EnArticle {
  static find(id, cb) {
    endb.get('SELECT * FROM articles WHERE title = ?', id, cb);
  }

  static search(query, cb) {
      const searchQuery = `${query}%`;
      endb.all('SELECT * FROM articles WHERE title LIKE ? LIMIT 100', [searchQuery], cb);
  }
}

//module.exports = db;
module.exports.ZhArticle = ZhArticle;
module.exports.EnArticle = EnArticle;