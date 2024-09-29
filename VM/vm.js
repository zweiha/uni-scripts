function initialize(program) {
	var memory = new Array();
	var contents = "";

	var fso = new ActiveXObject("Scripting.FileSystemObject");
	var programFile = fso.OpenTextFile(program, iomode=1);
	while (!programFile.AtEndOfStream) {
		contents += programFile.ReadLine() + " ";
	}
	programFile.Close();
	contents+=" exit";

	var sContents = contents.split(/\s+/); //split by \n and " " (not sure i have to account for \n, doing it just to be sure)
	for (var i=0; i < sContents.length; i++) {
		memory.push(sContents[i]);
	}
	WSH.echo(memory);

	return memory;
}

function interprete(memory){
	var ip = 0;
	//TODO check memory state

	while (true) {
		switch(memory[ip]) {
			case "in":
				memory[memory[ip+1]] = parseInt(WScript.StdIn.ReadLine());
				ip+=2; //TODO check if number
				break;
			case "add":	
				memory[memory[ip+1]] = memory[memory[ip+1]] + memory[memory[ip+2]];
				ip+=3;
				break;
			case "out":
				WSH.echo(memory[memory[ip+1]]);
				ip+=2;
				break;
			case "exit":
				WScript.Quit();	
			case "buh":
				WSH.echo("buh1");	
		}
	}
}


interprete(initialize("program.txt"));