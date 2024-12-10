var fso = new ActiveXObject("Scripting.FileSystemObject");

function Node(name, freq, used, code, left, right) {
	this.name = name;
	this.freq = freq;
	this.used = used;
	this.code = code;
	this.left = left;
	this.right = right;
}

function getAlphabet(input) {
    var alphabet = new Array();
    for(var i = 0; i < input.length; i++) 
        alphabet[input.charAt(i)] = 0;
    for(var i = 0; i < input.length; i++) {
        alphabet[input.charAt(i)]++;
    }
    return alphabet;
}

function combineNodes(tree, unused) {
	if (tree.length < 2) return;

	var first = -1, second = -1;

	for (var i = 0; i < tree.length; i++) {
		if (!tree[i].used){
			if (first == -1 || tree[i].freq < tree[first].freq) {
				second = first; 
				first = i;
			} else if ( second == -1 || tree[i].freq < tree[second].freq) {
				second = i;
			}
		}
	}

	var node = new Node(tree[first].name+tree[second].name, tree[first].freq+tree[second].freq, 0, "", first, second);
	tree.push(node);
	tree[first].used = 1;
	tree[second].used = 1;
	tree[first].code = "0";
	tree[second].code = "1";
	return unused-1;
}

function assignCodes(tree, nodeIndex, code) {
	var node = tree[nodeIndex];
	node.code = code;

	if (node.left == -1 && node.right == -1) return;

	if (node.left != -1) assignCodes(tree, node.left, code + "0");

	if (node.right != -1) assignCodes(tree, node.right, code + "1");
}


//var string = "aaaaaaa";
var fileInputEncode = fso.OpenTextFile("in.txt", iomode=1, create=false);
var inputEncode = fileInputEncode.ReadAll();
WSH.echo("initial: " + inputEncode);
fileInputEncode.Close();

var alphabet = getAlphabet(inputEncode);
tree = new Array();	

// construct the initial tree
for (letter in alphabet) {
	var node = new Node(letter, alphabet[letter], 0, "", -1,-1);
	tree.push(node);;
}


// populate the tree
var unused = tree.length;
if (unused == 1) tree[0].code = "0"; //handle strings consisting of a single character
else {
	while(unused > 1) {
		unused = combineNodes(tree, unused);
	}
	assignCodes(tree, tree.length-1, "");
}

// output alphabet and create a separate letter+code, code+letter arrays
var encodedAlphabet = new Array();
var reverseAlphabet = new Array();
for (node in tree) {
	if (tree[node].left == -1 && tree[node].right == -1) {
		encodedAlphabet[tree[node].name] = tree[node].code;
		reverseAlphabet[tree[node].code] = tree[node].name;
		WSH.echo(tree[node].name, " - ", tree[node].freq, " - ", tree[node].code );
	}
}

// encode...
var splitString = inputEncode.split("");
var encodedString = "";
for (letter in splitString) {
	encodedString += encodedAlphabet[splitString[letter]];
}
WSH.echo("encoded string: ", encodedString);

var fileOutputEncoded = fso.OpenTextFile("eout1.txt", iomode=2, create=true, format=-1);
fileOutputEncoded.Write(encodedString);
fileOutputEncoded.Close();

// ...and decode the string

var fileInputDecode = fso.OpenTextFile("eout1.txt", iomode=1, create=false, format=-1);
var inputDecode = fileInputDecode.ReadAll();
fileInputDecode.Close();

var decodedString = "";
	var currentCode = "";
	for (var i = 0; i < inputDecode.length; i++) {
		currentCode += inputDecode.charAt(i);

		if (currentCode in reverseAlphabet) {
			decodedString += reverseAlphabet[currentCode];
			currentCode = "";
		}
	}
WSH.echo("decoded string: ", decodedString);

var fileOutputDecoded = fso.OpenTextFile("dout1.txt", iomode=2, create=true, format=-1);
fileOutputDecoded.Write(decodedString);
fileOutputDecoded.Close();

