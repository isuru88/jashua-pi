var rpio = require('rpio');

rpio.open(5, rpio.OUTPUT, rpio.LOW);
rpio.open(7, rpio.OUTPUT, rpio.LOW);
rpio.open(8, rpio.OUTPUT, rpio.LOW);
rpio.open(19, rpio.OUTPUT, rpio.LOW);
rpio.open(21, rpio.OUTPUT, rpio.LOW);
rpio.open(22, rpio.OUTPUT, rpio.LOW);

var first = false;
var second = false;
var third = false;

var stdin = process.stdin;
stdin.setRawMode( true );
stdin.resume();

stdin.setEncoding( 'utf8' );

stdin.on( 'data', function( key ){
  if ( key === '\u0003' ) {
    rpio.write(5, rpio.LOW);
    rpio.write(7, rpio.LOW);
    rpio.write(8, rpio.LOW);
    rpio.write(19, rpio.LOW);
    rpio.write(21, rpio.LOW);
    rpio.write(22, rpio.LOW);

    process.exit();
  }

  if ( key === '1' ) {
    first = !first;

    if (first) {
      rpio.write(5, rpio.HIGH);
      rpio.write(19, rpio.HIGH);
    }
    else { 
      rpio.write(5, rpio.LOW);
      rpio.write(19, rpio.LOW); 
    }
  }

  if ( key === '2' ) {
    second = !second;

    if (second) {
      rpio.write(7, rpio.HIGH);
      rpio.write(21, rpio.HIGH);
    }
    else {
      rpio.write(7, rpio.LOW);
      rpio.write(21, rpio.LOW);
    }
  }

  if ( key === '3' ) {
    third = !third;

    if (third) { 
      rpio.write(8, rpio.HIGH);
      rpio.write(22, rpio.HIGH);
    }
    else {
      rpio.write(8, rpio.LOW);
      rpio.write(22, rpio.LOW);
    }
  }


});