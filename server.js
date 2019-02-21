const express = require('express');
const path = require('path');
const app = express();
const http = require('http')
const compression = require('compression');

app.use(compression());
app.use(express.static('build'));
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname + '/build/index.html'));
})

const server = http.createServer(app)
const port = process.env.PORT
server.listen(port, () => {
  console.log(`Server running on port`, port)
})