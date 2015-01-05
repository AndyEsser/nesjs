function RAM (nes) {
// ----------------------------------------------------------------	
	var m_Console 	= nes;
	var m_Memory	= new Array();
	var MAX_RAM 	= 64 * 1024;
// ----------------------------------------------------------------

// ----------------------------------------------------------------
	function clearMemory () {
		for(var idx = 0; idx < MAX_RAM; ++idx) {
			m_Memory[idx] = 0;
		}
	}
// ----------------------------------------------------------------
	this.Get = function (addr) {
		return m_Memory[addr];
	}

	this.Set = function (addr, value) {
		m_Memory[addr] = value;
	}

	this.Init = function () {
		clearMemory();
		console.log("Device has " + m_Memory.length + " bytes (" + (m_Memory.length / 1024)  + "kB) of RAM");
	}

	this.Reset = function () {
		clearMemory();
	}
// ----------------------------------------------------------------	
}

module.exports = function (nes) {
	return new RAM(nes);
}