
const express = require('express');
const path = require('path');
const exec = require('child_process');
const app = express();
const port = 8080;
const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-2' });
const ec2 = new AWS.EC2();

app.use(express.static('public'));

const router = express.Router();

app.use('/', router);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.route('/kill').get((req, res) => {
  console.log('button pushed!!');
  res.sendStatus(200);

  var params = {
    InstanceIds: [
      "i-058832be9447e4e5e"
    ]
  };

  ec2.stopInstances(params, function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else console.log(data);           // successful response
  });
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}.`);
});