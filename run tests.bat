@echo off
cmd /c dalek ./tests/suite/defaultMap.js -l 2
if errorlevel 1 goto end
cmd /c dalek ./tests/suite/options.js -l 2
if errorlevel 1 goto end
cmd /c dalek ./tests/suite/tickets.js -l 2
:end
pause
