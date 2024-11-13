const express = require('express');
const app = express();
const PORT = 3333;

const database = require('./database');

const postStatus = async (req, res) => {
  try {
    const { gametype, username, mean } = req.body;

    const userRank = await new Promise((resolve, reject) => {
      database.getUserRank(gametype, username, (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      });
    });

    if (!userRank) {
      database.putStatus(gametype, username, mean);
    } else if (userRank.mean > mean) {
      database.updateStatus(gametype, username, mean);
    }

    console.log(userRank, mean);

    res.send('ok');
  } catch (err) {
    console.error(err);
  }
};

const getTopRank = async (req, res) => {
  try {
    const { gametype } = req.query;
    console.log(gametype);

    const topRank = await new Promise((resolve, reject) => {
      database.getTopRank(gametype, (err, result) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve(result);
      });
    });

    if (topRank) {
      res.json(topRank);
    } else {
      res.status(404).json('notfound');
    }
  } catch (err) {
    console.error(err);
  }
};

const getUserRank = async (req, res) => {
  try {
    const { gametype, username } = req.query;
    console.log(gametype, username);

    const userRank = await new Promise((resolve, reject) => {
      database.getUserRank(gametype, username, (err, result) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve(result);
      });
    });

    if (userRank) {
      res.json(userRank);
    } else {
      res.status(404).json('notfound');
    }
  } catch (error) {
    console.error(error);
  }
};

app.use(express.json());

app.use('/', (req, res, next) => {
  console.log(`Incoming request: ${req.ip} ${req.method} ${req.url}`);
  next();
});

app.post('/status', postStatus);
app.get('/rank', getTopRank);
app.get('/rank/user', getUserRank);

app.listen(PORT, () => {
  console.log(`Server opened in localhost:${PORT}`);
  database.createTable();
});
