const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(__dirname + '/public'));

app.listen(5000, () => {
  console.log('http://localhost:5000');
});
