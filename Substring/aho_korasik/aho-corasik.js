function getAlphabet(substring) {
  var substrLen = substring.length;
  var alph = {};
  for (var i = 0; i < substrLen; i++) {
    alph[substring.charAt(i)] = 0;
  }
  return alph;
}

function formTable(substring, alphabet) {
  var substrLen = substring.length;
  var table = new Array(substrLen + 1);
  for (var j = 0; j <= substrLen; j++) {
    table[j] = {};
    for (var c in alph) {
        table[j][c] = 0;
    }
  }

  for (var j = 0; j < substrLen; j++) {
    var char = substring.charAt(j);
    var prev = table[j][char];
    table[j][char] = j + 1;
    for (var c in alph) {
        table[j + 1][c] = table[prev][c]; 
    }
  }
  return table;
}

function search(string, substring, alph, table) {
  var strLen = string.length;
  var substrLen = substring.length;
  var state = 0;
  var result = [];
  for (var i = 0; i < strLen; i++) {
    var char = string.charAt(i);
    if (char in alph) {
        state = table[state][char];
    } else {
        state = 0;
    }
    if (state === substrLen) {
        result.push(i - substrLen + 1);
    }
  }
  return result;
}

var fso = new ActiveXObject("Scripting.FileSystemObject");
var stringFile = fso.OpenTextFile("../hash_bf/wpn-1_4.txt", iomode=1);
var string = stringFile.ReadAll();
stringFile.Close();

var substring = "adfkgadkjlgnlkg";
var startTime = new Date().getTime();
var alph = getAlphabet(substring);
var table = formTable(substring, alph);
var result = search(string, substring, alph, table);
var endTime = new Date().getTime();
var executionTime = endTime - startTime;
WSH.echo("found at: ");
for (var i=0; i < 10; ++i) WSH.echo(result[i]);
WSH.echo("done in ", executionTime, " ms");

