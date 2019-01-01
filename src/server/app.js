require('dotenv').config();

const app = require('express')();
const http = require('http').Server(app);

const PORT = process.env.SERVER_PORT || 3000;

app.get('/', (req, res) => {
  res.send('PrestoAnalytics server running...');
});

http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
