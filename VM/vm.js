function initialize(program) {
	var memory = new Array();
	var contents = "";

	var fso = new ActiveXObject("Scripting.FileSystemObject");
	var programFile = fso.OpenTextFile(program, iomode=1);
	while (!programFile.AtEndOfStream) {
		var line = programFile.ReadLine();
		contents += (line + " ");
	}
	programFile.Close();
	contents+=" exit";

	var sContents = contents.split(/\s+/);
	for (var i=0; i < sContents.length; i++) {
		memory.push(sContents[i]);
	}
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
				//WSH.echo(memory);
				break;
			case "out":
				WSH.echo(memory[memory[parseInt(ip)+1]]);
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
				WScript.Quit();	

		}
	}
}

//WSH.echo("input two natural numbers, one per line: ");
//interprete(initialize("gcm.txt"));

WSH.echo("input a natural number: ");
interprete(initialize("factorial.txt"));
