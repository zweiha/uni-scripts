var fso = new ActiveXObject("Scripting.FileSystemObject");

function encode(string) {
	var i = 0;
	var result = "";
	var count = 0; 
	var countTemp = 0;
	
	while (i<string.length) {
		while (string.charAt(i) === string.charAt(i+count)) {
			count++;
		}
		while (count > 255) {
			result += ("#" + String.fromCharCode(255) + string.charAt(i));
			count -= 255;
			countTemp += 255;
		}	
		if (count > 3 || string.charAt(i) === "#") {
			result += ("#" + String.fromCharCode(count) + string.charAt(i));
		} else {
			result += Array(count+1).join(string.charAt(i));
		}
		countTemp += count;
		count = 0;
		i+=countTemp;
		countTemp = 0;
	}
	return result;
}

function decode(string) {
	var i = 0;
	var result = "";
	var count;

	while (i < string.length) {
		if (string.charAt(i) == "#") {
			count = string.charCodeAt(i+1);
			result += (Array(count+1).join(string.charAt(i+2)));
			i+=3;
		} else {
			result += string.charAt(i);
			i++;
		}
	}
	return result;
}

function encodeJump(string) {
	var i = 0;
	var result = "";
	var count = 0;
	var countTemp = 0;

	while (i<string.length) {
		while (string.charAt(i) === string.charAt(i+count)) {
			count++;
		}
		if (count === 1) {
			while (string.charAt(i+count) !== string.charAt(i+count+1)) {
				count++;
			}
			result += (String.fromCharCode(128 + count) + string.substr(i, count));
		} else {
			while (count > 127) {
				result += ((String.fromCharCode(127) + string.charAt(i)));
				count -= 127;
				countTemp += 127;
			}
			if (count > 0) {
				result += ((String.fromCharCode(count) + string.charAt(i)));
			}
		} 
		countTemp += count;
		i+=countTemp;
		count = 0;
		countTemp = 0;
	}
	return String(result);

}

function decodeJump(string) {
	var i = 0;
	var result = "";
	var count;
	
	while (i < string.length) {
		count = string.charCodeAt(i);
		//WSH.echo(count);
		if (count > 127) {
			result += string.substr(i+1, count-128);
			i+=(count-127);
		} else {
			result += Array(count+1).join(string.charAt(i+1));
			i+=2;
		}

	}
	return result;
}

// ESCAPE
// read initial string from in.txt
var fileInputEncode = fso.OpenTextFile("in.txt", iomode=1, create=false);
var inputEncode = fileInputEncode.ReadAll();
WSH.echo("initial: " + inputEncode);
fileInputEncode.Close();
// encode for the first time and write it to eout1.txt
var outputEncoded = encode(inputEncode);
WSH.echo("encoded 1: " + outputEncoded);
var fileOutputEncoded = fso.OpenTextFile("eout1.txt", iomode=2, create=true, format=-1);
fileOutputEncoded.Write(outputEncoded);
fileOutputEncoded.Close();
// read encoded string from eout1.txt
var fileInputDecode = fso.OpenTextFile("eout1.txt", iomode=1, create=false, format=-1);
var inputDecode = fileInputDecode.ReadAll();
fileInputDecode.Close();
// decode it and qrite it to dout1.txt
var outputDecoded = decode(inputDecode);
WSH.echo("decoded 1: " + outputDecoded);
var fileOutputDecoded = fso.OpenTextFile("dout1.txt", iomode=2, create=true, format=-1);
fileOutputDecoded.Write(outputDecoded);
fileOutputDecoded.Close();

// JUMP
// read initial string from dout1.txt
var fileInputEncode = fso.OpenTextFile("dout1.txt", iomode=1, create=false, format=-1);
var inputEncode = fileInputEncode.ReadAll();
fileInputEncode.Close();
// encode for the first time and write it to eout2.txt
var outputEncoded = encodeJump(inputEncode);
WSH.echo("encoded 2: " + outputEncoded);
var fileOutputEncoded = fso.OpenTextFile("eout2.txt", iomode=2, create=true, format=-1);
fileOutputEncoded.Write(outputEncoded);
fileOutputEncoded.Close();
// read encoded string from eout2.txt
var fileInputDecode = fso.OpenTextFile("eout2.txt", iomode=1, create=false, format=-1);
var inputDecode = fileInputDecode.ReadAll();
//var noHex = fromHex(inputDecode);
fileInputDecode.Close();
// decode it and qrite it to dout2.txt
var outputDecoded = decodeJump(inputDecode);
WSH.echo("decoded 2: " + outputDecoded);
var fileOutputDecoded = fso.OpenTextFile("dout2.txt", iomode=2, create=true, format=-1);
fileOutputDecoded.Write(outputDecoded);
fileOutputDecoded.Close();

