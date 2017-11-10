const https = require('https');
const host = 'api-ratp.pierre-grimaud.fr';
const port = 443;

'use strict';
exports.listeStations = (req, res) => {
  let ratp_type = req.body.result.parameters['ratp-type'];
  let code = req.body.result.parameters['number'];  
  
  console.log('Parameters: ratp_type : ' + ratp_type +', code : '+ code);
  
  // Call the weather API
  callListeStations(ratp_type, code).then((output) => {
    // Return the results of the weather API to Dialogflow    
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ 'speech': output, 'displayText': output }));
  }).catch((error) => {
    // If there is an error let the user know
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ 'speech': error, 'displayText': error }));
  });  
  
};

function callListeStations (type, code) {
  return new Promise((resolve, reject) => {
    // Create the path for the HTTP get request to the APi
    let path = '/v3/stations/'+type+'/'+code+'?_format=json';
    console.log('API Request: ' + host + path);
    // Make the HTTP get request to get the API
    https.get({host: host, path: path, port: port}, (res) => {
      let body = ''; // var to store the response chunks
      res.on('data', (d) => { body += d; }); // store each response chunk
      res.on('end', () => {
        // After all the data has been received parse the JSON for desired data
        let stations = JSON.parse(body).result.stations;
        let liste_stations = '';
        for(let station of stations) {
          liste_stations += station.slug+'\n';          
        }
        
        // Create response
        let output = `Voici la liste des stations :\n${liste_stations}`;
        // Resolve the promise with the output text
        console.log(output);
        resolve(output);
      });
      res.on('error', (error) => {
        reject(error);
      });
    });
  });
}

var restify = require('restify');
var lstStation = exports.listeStations;

var server = restify.createServer();

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.post('/listeStations', lstStation);

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
