exports.ratpAgent = function ratpAgent (req, res) {
  
  var http = require('https');
  var _ = require('underscore');

  var options = {
    host: 'api-ratp.pierre-grimaud.fr',
    port: 443,
    path: '/v3/schedules/bus/58/hopitaux+broussais+et+saint+joseph/A',
    method: 'GET'      
  };
  var response = "";
  var req = http.request(options, function(res) {
    var body = '';  
  
    res.on('data', function(chunk) {
      body += chunk;
    });

    res.on('end', function() {
      var schedules = JSON.parse(body).result.schedules;
      _.each(schedules, function(data){
        response += "Prochain bus direction "+data.destination+" : "+data.message+". "
        //console.log("Prochain bus direction "+data.destination+" : "+data.message);  
      })
         
    });
  }).end();

  //response = "This is a sample response from your webhook!" //Default response from the webhook to show it's working

  res.setHeader('Content-Type', 'application/json'); //Requires application/json MIME type
  res.send(JSON.stringify({ "speech": response, "displayText": response 
  //"speech" is the spoken version of the response, "displayText" is the visual version
  }));
};
