var NES 		= require('./console');
var nes;

function convertToBytes(value) {
	var str = value.toString(2).toUpperCase();
	var len = str.length;
	var n = 8;
	return len >= n ? str : new Array(n - len + 1).join(0) + str;
}

function init() {	
	nes = new NES();
	nes.Init();
	nes.Load("rom/01-basics.nes");
};

init();