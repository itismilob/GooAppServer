const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'appData.db');
const db = new sqlite3.Database(dbPath);

exports.createTable = () => {
  db.run(`
  CREATE TABLE IF NOT EXISTS APP(
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    gametype INTEGER,
    username TEXT,
    mean REAL
  );
`);
};

exports.putStatus = (gameType, username, mean) => {
  db.run(
    `INSERT INTO APP(
        gametype, username, mean) VALUES (?, ?, ?)`,
    [gameType, username, mean]
  );
};

exports.updateStatus = (gameType, username, mean) => {
  db.run(`UPDATE APP SET mean = ? WHERE gametype = ? AND username = ?`, [
    mean,
    gameType,
    username,
  ]);
};

exports.getTopRank = (gameType, callback) => {
  db.all(
    `SELECT
     RANK() OVER (ORDER BY mean ASC) AS rank,
     username,
     mean
    FROM APP WHERE gametype = ? ORDER BY mean ASC LIMIT 100;`,
    [gameType],
    (err, result) => {
      callback(err, result);
    }
  );
};

exports.getUserRank = (gametype, username, callback) => {
  db.get(
    `SELECT 
      RANK() OVER (ORDER BY mean ASC) AS rank,
      username,
      mean
     FROM APP WHERE gametype = ? AND username = ?`,
    [gametype, username],
    (err, result) => {
      callback(err, result);
    }
  );
};
