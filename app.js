var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var rpio = require('rpio');

// Motor A
rpio.open(12, rpio.PWM);
rpio.open(11, rpio.OUTPUT, rpio.LOW);
rpio.open(13, rpio.OUTPUT, rpio.LOW);

// Motor B
rpio.open(18, rpio.OUTPUT, rpio.HIGH);
rpio.open(15, rpio.OUTPUT, rpio.LOW);
rpio.open(16, rpio.OUTPUT, rpio.LOW);

rpio.pwmSetClockDivider(64);
rpio.pwmSetRange(12, 1024);
rpio.pwmSetData(12, 1024);

app.use(express.static('public'));

http.listen(3000, function(){
  console.log('listening on *:3000');
});

io.on('connection', function(socket){
  console.log('new connection');

  socket.on('LEFT', function(msg){
    rpio.write(15, rpio.HIGH);
    rpio.write(16, rpio.LOW);
  });
  socket.on('RIGHT', function(msg){
    rpio.write(15, rpio.LOW);
    rpio.write(16, rpio.HIGH);
  });
  socket.on('CENTER', function(msg){
    rpio.write(15, rpio.LOW);
    rpio.write(16, rpio.LOW);
  });

  socket.on('FORWARD', function(msg){
    var speed = parseInt(msg);
    rpio.pwmSetData(12, speed);
    
    rpio.write(11, rpio.HIGH);
    rpio.write(13, rpio.LOW);
  });
  socket.on('BACKWARD', function(msg){
    var speed = parseInt(msg);
    rpio.pwmSetData(12, speed);

    rpio.write(11, rpio.LOW);
    rpio.write(13, rpio.HIGH);
  });
  socket.on('STOP', function(msg){
    rpio.write(11, rpio.LOW);
    rpio.write(13, rpio.LOW);
  });

  socket.on('disconnect', function () {
    console.log('disconnected');
    rpio.write(11, rpio.LOW);
    rpio.write(13, rpio.LOW);
    rpio.write(15, rpio.LOW);
    rpio.write(16, rpio.LOW);
  });
});
