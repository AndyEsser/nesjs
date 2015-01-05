var CPU 			= require('./cpu');
var ROM 			= require('./rom');
var IOMapper 		= require('./IOMapper');

function NES () {
// ----------------------------------------------------------------	
	var cpu 		= new CPU(this);
	var rom 		= new ROM(this);
	var io 			= new IOMapper(this);
// ----------------------------------------------------------------	

	_ctor();

// ----------------------------------------------------------------	
	function _ctor() {
		console.log("JavaScript NES Emulator");	
		console.log("Author: Andy Esser (www.andy-esser.co.uk)");
		console.log("");
	}

	function getCPU () {
		return cpu;
	}

	function getROM () {
		return rom;
	}

	function getIO () {
		return io;
	}
// ----------------------------------------------------------------
	this.Init = function () {
		io.Init();
		rom.Init();
		cpu.Init();

		cpu.Run();
	}

	this.Reset = function () {

	}

	this.Load = function (file) {
		rom.Load(file);
	}
// ----------------------------------------------------------------	
};

module.exports = function () {
	return new NES();
};