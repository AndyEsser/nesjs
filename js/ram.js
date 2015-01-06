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
		if(addr <= 0x10000 && addr > 0xC000) {
			// Upper Bank of Cartridge ROM
			var rom = nes.ROM();
			var relativeAddress = 0x10000 - addr;
			return rom.Get(16 + relativeAddress);
		} else if(addr <= 0xC000 && addr > 0x8000) {
			// Lower Bank of Cartridge ROM
			var rom = nes.ROM();
			var relativeAddress = 0xC000 - addr;
			return rom.Get(16 + relativeAddress);
		} else if(addr <= 0x8000 && addr > 0x6000) {
			// Cartridge RAM
			var rom = nes.ROM();
			var relativeAddress = 0x8000 - addr;
			return rom.Get(16 + relativeAddress);
		} else if(addr <= 0x6000 && addr > 0x5000) {
			// Expansion Modules
			return 0x0;
		} else if(addr <= 0x5000 && addr > 0x2000) {
			// Input/Output
			return 0x0;
		} else if(addr <= 0x2000 && addr > 0x0000) {
			return m_Memory[addr];
		}		
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