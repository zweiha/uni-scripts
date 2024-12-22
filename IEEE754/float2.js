function shiftMantissa(mantissa, shift, maxLength) {
    for (var i = 0; i < shift; i++) {
        mantissa = "0" + mantissa;
    }
    return mantissa.substring(0, maxLength);
}

function pad(string, length, mode) {
    while (string.length < length) {
        switch (mode) {
            case "right": {
                string += "0";
                break;
            }
            case "left": {
                string = "0" + string;
                break;
            }
        }
    }
    return string; 
}

function intToBinary(int) {
    if (int === "0") {
        return "0";
    }
    var binary = "";
    while (int) {
        var quotient = "";
        var carry = 0;

        for (var i = 0; i < int.length; i++) {
            var num = carry * 10 + parseInt(int.charAt(i));
            quotient += Math.floor(num / 2).toString(); 
            carry = num % 2; 
        }
        binary = carry.toString() + binary;  
        int = quotient.replace(/^0+/, ""); 
    }
    return binary;
}

function fracToBinary(fraction, precision) {
    var binary = "";
    var count = 0;
    while (fraction && count < precision) {
        var carry = 0;
        var result = "";
        for (var i = fraction.length - 1; i >= 0; i--) {
            var currentDigit = parseInt(fraction.charAt(i), 10) * 2 + carry;
            result = (currentDigit % 10).toString() + result; 
            carry = Math.floor(currentDigit / 10);
        }
        binary += carry.toString();
        fraction = result;
        count++;
    }
    return binary;
}


function decimalToBinary(decimal) {
    var parts = decimal.split(".");
    var integerPart = parts[0];
    var fractionalPart = parts.length > 1 ? parts[1] : null;
    var binaryInteger = intToBinary(integerPart);
    var binaryFraction = fracToBinary(fractionalPart, 250);
    return binaryInteger + (binaryFraction ? "." + binaryFraction : "");
}

function normalizeBinary(binaryStr) {
    var binary = binaryStr.split(".");
    var binaryInt = binary[0];
    var binaryFrac = binary[1] || null;

    var mantissa, exponent = -127;
    if (binaryInt !== "0") {   
        exponent = binaryInt.length-1;
        mantissa = binaryInt.slice(1) + (binaryFrac || "");     
    } else {        
        var firstOneIndex = binaryFrac.indexOf("1");         
        if (firstOneIndex != -1) exponent = -(firstOneIndex + 1);  
        mantissa = binaryFrac.slice(firstOneIndex + 1);     
    }
    mantissa = (mantissa.length > 23) ? mantissa.substring(0,23) : pad(mantissa, 23, "right");
    return {"mantissa": mantissa, "exponent": exponent};
}

function toInternal(number) {
    if (isNaN(number)) return "0 11111111 10000000000000000000000"
    var sign="0", exponent, mantissa;
    if (number.charAt(0) == "-") {
        sign = "1";
        number = number.slice(1);
    }
    var binary = decimalToBinary(number);
    var normalizedBinary = normalizeBinary(binary);
    exponent = parseInt(normalizedBinary.exponent) + 127;
    mantissa = normalizedBinary.mantissa;
    if (exponent >= 255) {
        return sign + " 11111111 00000000000000000000000"
    }
    if (exponent-127 <= -127) {
        mantissa = shiftMantissa(mantissa, Math.abs(exponent+2), 23);
        exponent = 0;
    }
    return sign + " " + pad(exponent.toString(2), 8 ,"left") + " " + mantissa;
}

function fromInternal(internal) {
    var parts = internal.split(" ");
    var sign = parts[0];
    var exponent = parts[1];
    var mantissa = parts[2];

    var exponentValue = parseInt(exponent, 2) - 127;
    var mantissaValue = 1;

    if (exponent === "11111111") {
        if (mantissa !== "00000000000000000000000") {
            return NaN;
        }
        return (sign === "0") ? Infinity : -Infinity;
    }

    if (exponent === "00000000") {
        exponentValue = -126;
        mantissaValue = 0;
    }
    for (var i = 0; i < mantissa.length; i++) {
        mantissaValue += parseInt(mantissa.charAt(i)) * Math.pow(2, -(i + 1));
    }

    var result = Math.pow(2, exponentValue) * mantissaValue;
    
    return (sign === "0") ? result : -result;
}


function addMantissas(m1, m2, sign1, sign2) {
    if (sign1 !== sign2) return subtractMantissas(m1, m2);
    var carry = 0;
    var result = "";

    var maxLength = Math.max(m1.length, m2.length);
    m1 = pad(m1, maxLength, "left");
    m2 = pad(m2, maxLength, "left");

    for (var i = maxLength - 1; i >= 0; i--) {
        var bit1 = parseInt(m1.charAt(i));
        var bit2 = parseInt(m2.charAt(i));

        var sum = bit1 + bit2 + carry;

        if (sum === 2) {
            result = "0" + result;
            carry = 1;
        } else if (sum === 3) {
            result = "1" + result;
            carry = 1;
        } else {
            result = sum + result;
            carry = 0;
        }
    }

    if (carry) {
        result = "1" + result;
    }
    return result;
}

function subtractMantissas(m1, m2) {
    var result = "";
    var borrow = 0;
    var maxLength = Math.max(m1.length, m2.length);
    m1 = pad(m1, maxLength, "left");
    m2 = pad(m2, maxLength, "left");

    for (var i = maxLength - 1; i >= 0; i--) {
        var bit1 = parseInt(m1.charAt(i));
        var bit2 = parseInt(m2.charAt(i));

        var diff = bit1 - bit2 - borrow;
        if (diff < 0) {
            diff += 2;
            borrow = 1;
        } else {
            borrow = 0;
        }
        result = diff + result;
    }
    return result;
}

function addInternal(internal1, internal2, mode) {
    var parts1 = internal1.split(" ");
    var parts2 = internal2.split(" ");
    
    var sign1 = parts1[0], exponent1 = parts1[1], mantissa1 = parts1[2];
    var sign2 = parts2[0], exponent2 = parts2[1], mantissa2 = parts2[2];
    if (mode == "subtract") {
        sign2 = (sign2 === "0") ? "1" : "0";
    }

    if (exponent1 === "11111111") {
        if (mantissa1 !== "00000000000000000000000") return "0 11111111 10000000000000000000000"; // 1st number is NaN
        
        if (exponent2 === "11111111") {
            if (mantissa2 !== "00000000000000000000000") return "0 11111111 10000000000000000000000"; // 2nd number is NaN
            
            if (sign1 === sign2) {
                if (mode == "subtract") return "0 11111111 10000000000000000000000"; // NaN for +inf - +inf or -inf - -inf  
                else return sign1 + " 11111111 00000000000000000000000"; // +-inf for +inf + +inf or -inf + -inf 
            } else {
                if (mode == "subtract") return sign1 + " 11111111 00000000000000000000000"; // +-inf for +inf - -inf or -inf - +inf 
                else return "0 11111111 10000000000000000000000"; // NaN for +inf + -inf or -inf + +inf 
            }
        }
        return sign1 + " 11111111 00000000000000000000000";
    }
    if (exponent2 === "11111111") {
        if (mantissa2 !== "00000000000000000000000") return "0 11111111 10000000000000000000000"; // NaN
        return sign2 + " 11111111 00000000000000000000000";
    }

    if (exponent1 === "00000000" && exponent2 === "00000000") {
        var denormExponent = -126;
        var resultMantissa = addMantissas("0" + mantissa1, "0" + mantissa2, sign1, sign2);

        if (resultMantissa.charAt(0) === "1") {
            var resultExponent = denormExponent + 1;
            resultMantissa = resultMantissa.slice(1, 24);
            return sign1 + " " + pad((resultExponent + 127).toString(2), 8, "left") + " " + resultMantissa;
        } else {
            resultMantissa = resultMantissa.slice(1, 24);
            return sign1 + " 00000000 " + resultMantissa;
        }
    }

    var exp1 = parseInt(exponent1, 2) - 127;
    var exp2 = parseInt(exponent2, 2) - 127;

    var m1 = (exponent1 === "00000000") ? "0" + mantissa1 : "1" + mantissa1;
    var m2 = (exponent2 === "00000000") ? "0" + mantissa2 : "1" + mantissa2;

    var shiftAmount;
    if (exp1 > exp2) {
        shiftAmount = exp1 - exp2;
        m2 = shiftMantissa(m2, shiftAmount, 24);
        exp2 = exp1;
    } else if (exp1 < exp2) {
        shiftAmount = exp2 - exp1;
        m1 = shiftMantissa(m1, shiftAmount, 24);
        exp1 = exp2;
    }

    var resultMantissa = addMantissas(m1, m2, sign1, sign2);

    var resultExponent = exp1;
    if (resultMantissa.length > 24) {
        resultMantissa = resultMantissa.slice(1);
        resultExponent += 1;
    } else if (resultMantissa.indexOf("1") > 0) {
        var shift = resultMantissa.indexOf("1");
        resultMantissa = resultMantissa.slice(shift);
        resultExponent -= shift;
    }

    resultMantissa = resultMantissa.slice(1, 24);

    if (resultExponent + 127 >= 255) {
        return sign1 + " 11111111 00000000000000000000000";
    }

    return sign1 + " " + pad((resultExponent + 127).toString(2), 8, "left") + " " + resultMantissa;
}

var fso = new ActiveXObject("Scripting.FileSystemObject");
var fileInput = fso.OpenTextFile("input.txt", iomode=1, create=false);
var input = fileInput.ReadAll();

var fileOutput = fso.OpenTextFile("out.txt", iomode=2, create=true);

var argument = WScript.arguments(0);
switch (argument) {
    case "conv":
        var number = input.replace(/^\s+|\s+$/g, "");
        var internal = toInternal(number);
        fileOutput.Write(internal);
        fileOutput.Close();
        break;
    case "calc":
        var expression = input.match(/([+-]?\d+(\.\d*)?|\w+) ([+-]) ([+-]?\d+(\.\d*)?)|\w+/);
        var internal1 = toInternal(expression[1].replace(/^\s+|\s+$/g, ""));
        var internal2 = toInternal(expression[4].replace(/^\s+|\s+$/g, ""));
        var operation = (expression[3].replace(/^\s+|\s+$/g, "") === "+") ? "add" : "subtract";
        var result = addInternal(internal1, internal2, operation);
        var resultDecimal = fromInternal(result); 
        fileOutput.Write(internal1 + " ~ " + fromInternal(internal1) + '\n');
        fileOutput.Write(internal2 + " ~ " + fromInternal(internal2) + '\n');      
        fileOutput.Write(result + " ~ " + resultDecimal);
        fileOutput.Close();
        break;   
    default:
        WSH.echo("wrong argument");
        break
}

