function initialize(programName) {
	var memory = new Array();
	var contents = "";
	var fso = new ActiveXObject("Scripting.FileSystemObject");
	if (!fso.FileExists(programName)) {
		WSH.echo("The program specified does not exist.");
		WSH.Quit();
	}
	var programFile = fso.OpenTextFile(programName, iomode=1);
	program = programFile.ReadAll();
	programFile.Close();
	var memory = program.split(/\s+/);
	if (memory[memory.length-1] !== "exit") memory.push("exit");
	return memory;
}

function interprete(memory){
	var ip = 0;
	var mode;
	while (true) {
		switch(memory[ip]) {
			//IO
			case "in":
				if (!isNaN(memory[ip+2])){
					memory[memory[ip+1]] = parseInt(memory[ip+2]);
					ip+=3;
					break;
				}
				var input = parseFloat(WScript.StdIn.ReadLine());
				if (input != parseInt(input)){
					WSH.echo("Wrong input");
					WSH.Quit();
				}
				memory[memory[ip+1]] = parseInt(input);
				ip+=2;
				break;
			case "out":
				if (isNaN(memory[parseInt(ip)+1])) {
					WSH.echo(memory[parseInt(ip)+1]);
				} else {
					WSH.echo(memory[memory[parseInt(ip)+1]]);
				}
				ip = parseInt(ip) + 2;
				break;	
			// basic numeric operations	
			case "add":	
				memory[memory[ip+3]] = memory[memory[ip+1]] + memory[memory[ip+2]];
				ip+=4;
				break;
			case "sub":
				memory[memory[ip+3]] = memory[memory[ip+1]] - memory[memory[ip+2]];
				ip+=4;	
				break;
			case "mp":
				memory[memory[ip+3]] = memory[memory[ip+1]] * memory[memory[ip+2]];
				ip+=4;	
				break;
			case "div":
				memory[memory[ip+3]] = Math.floor(memory[memory[ip+1]] / memory[memory[ip+2]]);
				ip+=4;	
				break;
			// flow control	
			case "mov": // more like "copy"
				memory[memory[ip+2]] = memory[memory[ip+1]];
				ip+=3;	
				break;
			case "jmp":
				ip = memory[ip+1];
				break;
			case "jmpz":
				if (memory[memory[parseInt(ip)+1]] != 0) {
					ip = parseInt(ip)+3;
					break;
				}
				ip = memory[parseInt(ip)+2];
				break;
			case "jmpg":
				if (memory[memory[parseInt(ip)+1]] <= memory[memory[parseInt(ip)+2]]) {
					ip = parseInt(ip)+4;
					break;
				}
				ip = memory[parseInt(ip)+3];
				break;
			case "jmpl":
				if (memory[memory[parseInt(ip)+1]] >= memory[memory[parseInt(ip)+2]]) {
					ip = parseInt(ip)+4;
					break;
				}
				ip = memory[parseInt(ip)+3];
				break;
			case "exit":
				WSH.Quit();		
			default: 
				WSH.echo("Syntax error at address " + ip);
				WSH.Quit();		
		}
	}
}
var argument = WScript.arguments(0);
interprete(initialize(argument));
