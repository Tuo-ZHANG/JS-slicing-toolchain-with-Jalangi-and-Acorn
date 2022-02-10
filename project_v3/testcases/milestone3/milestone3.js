function sliceMe() {
  var x;
  var y;
  var z;
  x = 1;
  y = 2;
  z = 3;
  if (x < 4) 
    y += 2;
  if (x > 0) 
    z -= 5;
  return y; // slicing criterion
}
sliceMe();
