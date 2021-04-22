let maxIterations = 10;
let complex = {
  add: function(a, b) {
    return [a[0]+b[0],a[1]+b[1]];
  },
  mult: function(a, b) {
    return [a[0]*b[0]-a[1]*b[1],a[1]*b[0]+a[0]*b[1]];
  },
  distance: function(a) {
    return Math.sqrt(a[0]*a[0]+a[1]*a[1]);
  }
};
let brot = {
  escape(z, c) {
    let i = 0;
    while (i < maxIterations) {
      z = complex.mult(z, z);
      z = complex.add(z, c);
      if (complex.distance(z) > 2) return i;
      i++;
    }
    return null;
  }
};