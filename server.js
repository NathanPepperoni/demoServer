
const express = require('express');
const path = require('path');
const app = express();
const port = 8080;
const AWS = require('aws-sdk');
const awsRegion = 'us-east-2';
AWS.config.update({ region: awsRegion });
const SSM = require('aws-sdk/clients/ssm');

let awsAuthID;
let awsAuthSecret;

app.use(express.static('public'));

const router = express.Router();

app.use('/', router);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.route('/kill').get((req, res) => {
  console.log('button pushed!!');
  res.sendStatus(200);

  AWS.config.update({
    region: awsRegion,
    accessKeyId: awsAuthID,
    secretAccessKey: awsAuthSecret,

  });
  const ec2 = new AWS.EC2();

  var params = {
    Filters: [
      {
        Name: "instance-type",
        Values: [
          "t2.nano"
        ]
      }
    ]
  };
  ec2.describeInstances(params, function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else killWebServerInstance(data);           // successful response
  });
});

function killWebServerInstance(json) {
  reservations = json.Reservations;
  matchedIds = []
  for (let i = 0; i < reservations.length; i++) {
    instance = reservations[i].Instances[0];
    id = instance.InstanceId;
    name = instance.Tags.find(fetchName).Value;

    if (name === 'cool web server') {
      matchedIds.push(id);
    }
  }
  
  if (matchedIds.length == 0) {
    return;
  }
  
  var params = {
    InstanceIds: matchedIds
  };

  const ec2 = new AWS.EC2();
  ec2.terminateInstances(params, function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else console.log(JSON.stringify(data));           // successful response
  });
}

function fetchName(tag) {
  return tag.Key === 'Name';
}

app.listen(port, function () {
  console.log(`Example app listening on port ${port}.`);
});

awslogin();

function awslogin() {

  AWS.config.update({ region: awsRegion });

  const ssm = new SSM()

  var params = {
    Names: [
      '/Robiat/Discord_Auth_Key',
      '/Robiat/AWS_ID',
      '/Robiat/AWS_SECRET',
    ],
    WithDecryption: true
  };

  ssm.getParameters(params, function (err, data) {
    if (err) {
      discordToken = process.env.ROBIAT_AUTH_KEY;
      awsAuthID = process.env.ROBIAT_AWS_ID;
      awsAuthSecret = process.env.ROBIAT_AWS_SECRET;
    }
    else {
      setAuthVariables(data['Parameters']);
    }
  });
};

function setAuthVariables(parameters) {
  const keys = {};

  for (let i = 0; i < parameters.length; i++) {
    const parameter = parameters[i];
    keys[parameter.Name] = parameter.Value;
  }

  discordToken = keys['/Robiat/Discord_Auth_Key'];
  awsAuthID = keys['/Robiat/AWS_ID'];
  awsAuthSecret = keys['/Robiat/AWS_SECRET'];
}