require('dotenv').config();

const express = require('express');
const { Server } = require('http');
const bodyParser = require('body-parser');

const router = express.Router();
const app = express();
const http = Server(app);

const PORT = process.env.SERVER_PORT || 3000;

router.post('/presto/login', (req, res) => {
  console.log(req.body);
  res.sendStatus(200);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/v1', router);

app.get('/', (req, res) => {
  res.send('PrestoAnalytics server running...');
});

http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
