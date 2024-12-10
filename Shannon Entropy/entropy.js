function getAlphabet(input) {
    var alphabet = new Array();
    for(var i = 0; i < input.length; i++) 
        alphabet[input.charAt(i)] = 0;
    for(var i = 0; i < input.length; i++) {
        alphabet[input.charAt(i)]++;
    }
    return alphabet;
}

function entropy(alphabet, length) {
    var entropy = 0;
    if (length == 1) return entropy;
    var lengthLog = Math.log(length);
    for (char in alphabet) {
        entropy += -(alphabet[char] / inputLen) * (Math.log(alphabet[char] / inputLen) / lengthLog);
    }    
    return entropy;
}

var fso = new ActiveXObject('Scripting.FileSystemObject');
var file = fso.OpenTextFile('input.txt');
var input = file.ReadAll();
file.close();

var inputLen = input.length;
var alphabet = getAlphabet(input);
var alphLength = 0;
for (char in alphabet) {
    WSH.echo("Symbol: ", char, "Frequency: ", alphabet[char] / inputLen);
    alphLength++;
}
var entropy = entropy(alphabet, alphLength);
WSH.echo("entropy: ", entropy);
