var express = require('express');
var app = express();

var http = require('http');
var server = http.Server(app);

app.use(express.static('client'));

var io = require('socket.io')(server);

var isQuestion = (message) => { 
  return message.match (/\?$/); 
}
function askingTime(msg){return msg.match(/time/i);}

var askingWeather = (message) =>{return message.match(/weather/i);}

function getWeather (callback){ var request= require('request');
request.get("https://www.metaweather.com/api/location/4118/", function(error, response){
  if (!error && response.statusCode === 200) { var data= JSON.parse(response.body);
  callback (data.consolidated_weather[0].weather_state_name);}
})}

io.on('connection', function (socket) {
  
  socket.on('message', function (msg) {
    console.log('Received Message: ', msg);
    if (!isQuestion(msg)) {
      io.emit('message', msg);
    } else if (askingTime(msg)) {
      io.emit('message', new Date); } 
      else if (askingWeather(msg)){getWeather(function(weather)
        { io.emit('message',weather)})}
      else {io.emit('message','That is a question!')}
    }
  );
});

server.listen(8080, function() {
  console.log('Chat server running');
});