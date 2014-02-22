
/**
 *
 */
function Chord(name, letters) {
  this.name = name;
  this.letters = letters;
}

Chord.prototype.matches = function(notes) {

};

Chord.prototype.toString = function () {
  return this.name;
};


Chord.C = function() {
  return new Chord('C', ['C', 'E', 'G']);
};

Chord.G7 = function() {
  return new Chord('G7', ['B', 'F', 'G']);
};

Chord.F4 = function() {
  return new Chord('G4', ['C', 'F', 'A']);
};
