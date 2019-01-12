
const express = require('express');
const path = require('path');
const exec = require('child_process');
const app = express();
const port = 8080;

app.use(express.static('public'));

const router = express.Router();

app.use('/', router);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.route('/kill').get((req, res) => {
  console.log('button pushed!!');
  res.sendStatus(200);
  shutdown((output) => {
    console.log(output);
  });
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}.`);
});

function shutdown(callback){
  exec('shutdown now', function(error, stdout, stderr){ callback(stdout); });
}