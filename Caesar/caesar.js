var fso = new ActiveXObject("Scripting.FileSystemObject");
var alphabetFile = fso.OpenTextFile("data.txt", iomode=1);

var asciiFrequencies = {};
while (!alphabetFile.AtEndOfStream) {
    var line = alphabetFile.ReadLine();
    line = line.split(":");
    asciiFrequencies[String.fromCharCode(line[0])] = parseFloat(line[1]);
}
alphabetFile.close();

function encrypt(text, shift) {
    var result = "";

    for (var i = 0; i < text.length; i++) {
        var char = text.charCodeAt(i);

        if (char >= 32 && char <= 126) {
            result += String.fromCharCode(((char - 32 + shift) % 94) + 32);
        } else {
            result += String.fromCharCode(char);
        }
    }

    return result;
}

function decrypt(text, shift) {
    return encrypt(text, (94 - shift) % 94);
}

function calculateFrequencies(text) {
    var frequencies = {};
    var total = 0;
    for (var i = 0; i < text.length; i++) {
        var char = text.charAt(i);
        frequencies[char] = (frequencies[char] || 0) + 1;
        total++;
    }
    for (var key in frequencies) {
        frequencies[key] = (frequencies[key] / total);
    }
    return frequencies;
}

function calculateShift(text) {
    var frequencies = calculateFrequencies(text);
    var mn = Infinity;
    var bestShift = 0;

    for (var shift = 1; shift < 94; shift++) {
        var sum = 0;

        for (var char in asciiFrequencies) {
            var shiftedCharCode = ((char.charCodeAt(0) - 32 + shift) % 94) + 32;
            var shiftedChar = String.fromCharCode(shiftedCharCode);
            var GT = frequencies[shiftedChar] || 0;
            var LT = asciiFrequencies[char] || 0;
            sum += Math.pow(GT - LT, 2);
        }

        if (sum < mn) {
            mn = sum;
            bestShift = shift;
        }
    }   

    return bestShift;
}

var stringFile = fso.OpenTextFile("input.txt", iomode=1);
var original = stringFile.ReadAll();
stringFile.close();

var shift = parseInt(WScript.StdIn.ReadLine());
shift = (shift % 94 + 94) % 94;

var encrypted = encrypt(original, shift);

var calcShift = calculateShift(encrypted);
var decrypted = decrypt(encrypted, calcShift);

WScript.Echo("Original: " + original);
WScript.Echo("Encrypted: " + encrypted);
WScript.Echo("Calculated shift: " + calcShift);
WScript.Echo("Decrypted: " + decrypted);
