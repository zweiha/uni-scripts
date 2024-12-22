function searchBruteforce(string, substring) {
	var strLength = string.length;
	var substrLength = substring.length;

	if (!string || !substring || strLength < substrLength) return -1;

    var occurrences = [];

	for (var i=0; i < strLength - substrLength + 1; i++) {
		var found = true;
		for (var j=0; j < substrLength; j++) {
			if (string.charAt(i+j) !== substring.charAt(j)) {
				found = false;
				break;
			}
		}
		if (found) occurrences.push(i);
	}
	return occurrences;
}

function search(string, substring) {
	var strLength = string.length;
	var substrLength = substring.length;

    if (!string || !substring || strLength < substrLength) return { "occurrences": [], "collisions": 0 };

    var hashSubstr = 0, hashString = 0, power = 1, collisions = 0;
    var occurrences = [];

    for (var i = 0; i < substrLength; i++) {
        hashSubstr = hashSubstr * 2 + substring.charCodeAt(i);
        hashString = hashString * 2 + string.charCodeAt(i);
        if (i < substrLength - 1) power *= 2;
    }

    for (var i = 0; i <= strLength - substrLength; i++) {
        if (hashString === hashSubstr) {
            var found = true;
			for (var j=0; j < substrLength; j++) {
				if (string.charAt(i+j) !== substring.charAt(j)) {
					found = false;
					collisions++;
					break;
				}
			}
			if (found) occurrences.push(i);
        }
        if (i < strLength - substrLength) {
            hashString = (hashString - string.charCodeAt(i) * power) * 2 + string.charCodeAt(i + substrLength);
        }
    }
    return { "occurrences": occurrences, "collisions": collisions };
}


function search2(string, substring) {
	var strLength = string.length;
	var substrLength = substring.length;

    if (!string || !substring || strLength < substrLength) return { "occurrences": [], "collisions": 0 };

    var hashSubstr = 0, hashString = 0, power = 1, collisions = 0;
    var occurrences = [];

    for (var i = 0; i < substrLength; i++) {
        hashSubstr += substring.charCodeAt(i) * substring.charCodeAt(i);
        hashString += string.charCodeAt(i) * string.charCodeAt(i);
    }

    for (var i = 0; i <= strLength - substrLength; i++) {
        if (hashString === hashSubstr) {
            var found = true;
			for (var j=0; j < substrLength; j++) {
				if (string.charAt(i+j) !== substring.charAt(j)) {
					found = false;
					collisions++;
					break;
				}
			}
			if (found) occurrences.push(i);
        }
        if (i < strLength - substrLength) {
            hashString = hashString - string.charCodeAt(i)*string.charCodeAt(i) + string.charCodeAt(i + substrLength)*string.charCodeAt(i + substrLength);
        }
    }
    return { "occurrences": occurrences, "collisions": collisions };
}

function search3(string, substring) {
	var strLength = string.length;
	var substrLength = substring.length;

    if (!string || !substring || strLength < substrLength) return { "occurrences": [], "collisions": 0 };

    var hashSubstr = 0, hashString = 0, power = 1, collisions = 0;
    var occurrences = [];

    for (var i = 0; i < substrLength; i++) {
        hashSubstr += substring.charCodeAt(i);
        hashString += string.charCodeAt(i);
    }

    for (var i = 0; i <= strLength - substrLength; i++) {
        if (hashString === hashSubstr) {
            var found = true;
			for (var j=0; j < substrLength; j++) {
				if (string.charAt(i+j) !== substring.charAt(j)) {
					found = false;
					collisions++;
					break;
				}
			}
			if (found) occurrences.push(i);
        }
        if (i < strLength - substrLength) {
            hashString = hashString - string.charCodeAt(i) + string.charCodeAt(i + substrLength);
        }
    }
    return { "occurrences": occurrences, "collisions": collisions };
}

var fso = new ActiveXObject("Scripting.FileSystemObject");
var stringFile = fso.OpenTextFile("a.txt", iomode=1);
var string = stringFile.ReadAll();
stringFile.Close();
	
var substring = "baaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
var startTime = new Date().getTime();
var result = searchBruteforce(string, substring);
var endTime = new Date().getTime();
var executionTime = endTime - startTime;
WSH.echo("found at: ");
//for (var i=0; i < 10; ++i) WSH.echo(result[i]);
WSH.echo("done in ", executionTime, " ms");

startTime = new Date().getTime();
result = search(string, substring);
endTime = new Date().getTime();
executionTime = endTime - startTime;
WSH.echo("found at: ");
//for (var i=0; i < 10; ++i) WSH.echo(result.occurrences[i]);
WSH.echo("collisions ", result.collisions);
WSH.echo("done in ", executionTime, " ms");

startTime = new Date().getTime();
result = search2(string, substring);
endTime = new Date().getTime();
executionTime = endTime - startTime;
WSH.echo("found at: ");
//for (var i=0; i < 10; ++i) WSH.echo(result.occurrences[i]);
WSH.echo("collisions ", result.collisions);
WSH.echo("done in ", executionTime, " ms");

startTime = new Date().getTime();
result = search3(string, substring);
endTime = new Date().getTime();
executionTime = endTime - startTime;
WSH.echo("found at: ");
//for (var i=0; i < 10; ++i) WSH.echo(result.occurrences[i]);
WSH.echo("collisions ", result.collisions);
WSH.echo("done in ", executionTime, " ms");
