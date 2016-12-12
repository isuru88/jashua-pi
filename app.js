var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var rpio = require('rpio');
var path = require('path');
var shell = require('shell');

rpio.init({gpiomem: false});

//Lights
rpio.open(5, rpio.OUTPUT, rpio.LOW);
rpio.open(7, rpio.OUTPUT, rpio.LOW);
rpio.open(8, rpio.OUTPUT, rpio.LOW);
rpio.open(19, rpio.OUTPUT, rpio.LOW);
rpio.open(21, rpio.OUTPUT, rpio.LOW);
rpio.open(22, rpio.OUTPUT, rpio.LOW);

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

var blue = false;
var green = false;
var red = false;

app.use(express.static(path.resolve(__dirname, 'public')));

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
  
  socket.on('BLUE', function(msg){
    blue = !blue;

    if (blue) {
      rpio.write(5, rpio.HIGH);
      rpio.write(19, rpio.HIGH);
    }
    else { 
      rpio.write(5, rpio.LOW);
      rpio.write(19, rpio.LOW); 
    }
  });
  socket.on('GREEN', function(msg){
    green = !green;

    if (green) {
      rpio.write(7, rpio.HIGH);
      rpio.write(21, rpio.HIGH);
    }
    else {
      rpio.write(7, rpio.LOW);
      rpio.write(21, rpio.LOW);
    }
  });
  socket.on('RED', function(msg){
    red = !red;

    if (red) { 
      rpio.write(8, rpio.HIGH);
      rpio.write(22, rpio.HIGH);
    }
    else {
      rpio.write(8, rpio.LOW);
      rpio.write(22, rpio.LOW);
    }
  }); 

  socket.on('SHUTDOWN', function(msg){
    shell.exec('sudo shutdown -h now');
  });


  socket.on('disconnect', function () {
    console.log('disconnected');
    rpio.write(11, rpio.LOW);
    rpio.write(13, rpio.LOW);
    rpio.write(15, rpio.LOW);
    rpio.write(16, rpio.LOW);
    rpio.write(5, rpio.LOW);
    rpio.write(7, rpio.LOW);
    rpio.write(8, rpio.LOW);
    rpio.write(19, rpio.LOW);
    rpio.write(21, rpio.LOW);
    rpio.write(22, rpio.LOW);
  });
});
