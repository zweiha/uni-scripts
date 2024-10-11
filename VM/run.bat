@echo off
if "%1"=="" (
	echo Missing program name.
	goto :eof 
) else (
	goto :run
)

:run
cscript /nologo vm.js %1
