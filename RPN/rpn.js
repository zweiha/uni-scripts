var priority = {
    "+": 1,
    "-": 1,
    "*": 2,
    "/": 2,
    "^": 3
};

function toRPN(expr) {
    var output = [];
    var stack = [];
    var symbols = expr.match(/\w+|[+\-*/^()]|\d+/g);
    //WSH.echo(symbols);
    if (!symbols) {
        WSH.echo("Empty/wrong expression.");
        return null;
    }
    if (/^[+\-*/^]$/.test(symbols[0]) || /^[+\-*/^]$/.test(symbols[symbols.length-1])) {
        WSH.echo("Wrong order of operators/operands.");
        return null;
    }
    var parentheses = 0;
    var lastSymbol = null;

    for (var i = 0; i < symbols.length; i++) {
        var symbol = symbols[i];
        if (/^[a-zA-Z]+$|^\d+$/.test(symbol)) {
            if (/^[a-zA-Z]+$|^\d+$/.test(lastSymbol) && lastSymbol !== null) { 
                WSH.echo("Wrong order of operators/operands.");
                return null;
            }
            output.push(symbol);
        } else if (symbol === "(") {
            stack.push(symbol);
            parentheses++;
        } else if (symbol === ")") {
            //if (lastSymbol === "(") {
            //    WSH.echo("Empty parentheses.");
            //    return null;
            //}
            if (/^[+\-*/^(]$/.test(lastSymbol) || lastSymbol === null) {
                WSH.echo("Wrong order of operators/operands.");
                return null;
            }
            parentheses--;
            if (parentheses < 0) {
                WSH.echo("Extra closing paarenthesis.");
                return null;
            }
            while (stack.length && stack[stack.length - 1] !== "(") {
                output.push(stack.pop());
            }
            if (!stack.length || stack.pop() !== "(") {
                WSH.echo("Wrong odrer of parentheses.");
                return null;
            }
        } else {
            if (/^[+\-*/^(]$/.test(lastSymbol) || lastSymbol === null) {
                WSH.echo("Wrong order of operators/operands.");
                return null;
            }
            while (stack.length && priority[stack[stack.length - 1]] >= priority[symbol]) {
                output.push(stack.pop());
            }
            stack.push(symbol);
        }
        lastSymbol = symbol; 
    }
    if (parentheses > 0) {
        WSH.echo("Extra opening parenthesis.");
        return null;
    }
    while (stack.length) {
        var operation = stack.pop();
        if (operation === "(" || operation === ")") {
            WSH.echo("Extra parentheses.");
            return null;
        }
        output.push(operation);
    }
    return output;
}

function computeRPN(rpn) {
    var stack = [];
   if (!rpn) {
        WSH.echo("Empty/wrong expression.");
        return NaN;
    }
    for (var i = 0; i < rpn.length; i++) {
        var symbol = rpn[i];
        if (/^\d+$/.test(symbol)) {
            stack.push(parseFloat(symbol));
        } else if (/^[a-zA-Z]+$/.test(symbol)) {
            if (!(symbol in variables)) {
                WSH.echo("Undefined variable.");
                return NaN;
            }
            stack.push(variables[symbol]);
        } else {
            var b = stack.pop();
            var a = stack.pop();
            switch (symbol) {
                case "+": stack.push(a + b); break;
                case "-": stack.push(a - b); break;
                case "*": stack.push(a * b); break;
                case "/":
                    if (b === 0) {
                        WSH.echo("Division by zero.");
                        return NaN;
                    }
                    stack.push(a / b);
                    break;
                case "^": stack.push(Math.pow(a, b)); break;
                default: 
                    WSH.echo("Undefined operation.");
                    return NaN;
            }
        }
    }
    return stack.pop();
}

var fso = new ActiveXObject("Scripting.FileSystemObject");
var file = fso.OpenTextFile("input.txt", iomode=1, create=false);
var expression = file.ReadLine();

var variables = [];
while (!file.AtEndOfStream) {
    var line = file.ReadLine().split("=");
    variables[line[0].replace(/^\s+|\s+$/g, "")] = parseFloat(line[1].replace(/^\s+|\s+$/g, ""));
}
file.Close();

var rpn = toRPN(expression);
if(rpn) WScript.Echo("rpn: " + rpn.join(" "));

var result = computeRPN(rpn);
if (!isNaN(result)) WScript.Echo("result: " + result);


