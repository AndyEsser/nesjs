function RAM (nes) {
// ----------------------------------------------------------------	
	// Address Modes:
	/*
	0 - Accumulator
	1 - Immediate
	2 - Zero Page
	3 - Zero Page, X
	4 - Zero Page, Y
	5 - Relative
	6 - Absolute
	7 - Absolute, X
	8 - Absolute, Y
	9 - Indirect
	10 - Indexed Indirect
	11 - Indirect Indexed
	*/
	var me = this;
	var MAX_RAM 				= 64 * 1024;
	var m_Console 				= nes;
	var m_Memory				= new Array();	
	var m_CurrentAddressMode 	= 1;
	var m_Idx					= 0;
// ----------------------------------------------------------------

// ----------------------------------------------------------------
	function clearMemory () {
		for(var idx = 0; idx < MAX_RAM; ++idx) {
			m_Memory[idx] = 0;
		}
	}

	function getRealAddress (addr) {
		switch(m_CurrentAddressMode) {
			case 0:
				// Accumulator
			break;

			case 1:
				// Immediate
				return addr;
			break;

			case 2:
				// Zero Page
				return addr;
			break;

			case 3:
				// Zero Page, X
				return addr + m_Idx;
			break;

			case 4:
				// Zero Page, Y
				return addr + m_Idx;
			break;

			case 5:
				// Relative
				return addr;
			break;

			case 6:
				// Absolute
				return addr;
			break;

			case 7:
				// Absolute, X
				return addr + m_Idx;
			break;

			case 8:
				// Absolute, Y
				return addr + m_Idx;
			break;

			case 9:
				// Indirect
				return m_Memory[addr];
			break;

			case 10:
				// Indexed Indirect
				return addr + (m_Idx % 255);
			break;

			case 11:
				// Indirect Indexed
				return m_Memory[addr] + m_Idx;
			break;
		}
	}
// ----------------------------------------------------------------
	this.SetAddressModeAccumulator = function (a) {
		m_CurrentAddressMode = 0;
		m_Idx = a;
	}

	this.SetAddressModeImmediate = function () {
		m_CurrentAddressMode = 1;
	}

	this.SetAddressModeZeroPage = function () {
		m_CurrentAddressMode = 2;
	}

	this.SetAddressModeZeroPageX = function (x) {
		m_CurrentAddressMode = 3;
		m_Idx = x;
	}

	this.SetAddressModeZeroPageY = function (y) {
		m_CurrentAddressMode = 4;
		m_Idx = y;
	}

	this.SetAddressModeRelative = function () {
		m_CurrentAddressMode = 5;	
	}

	this.SetAddressModeAbsolute = function () {
		m_CurrentAddressMode = 6;	
	}

	this.SetAddressModeAbsoluteX = function (x) {
		m_CurrentAddressMode = 7;
		m_Idx = x;
	}

	this.SetAddressModeAbsoluteY = function (y) {
		m_CurrentAddressMode = 8;
		m_Idx = y;
	}

	this.SetAddressModeIndirect = function () {
		m_CurrentAddressMode = 9;
	}

	this.SetAddressModeIndexedIndirect = function (x) {
		m_CurrentAddressMode = 10;
		m_Idx = x;
	}

	this.SetAddressModeIndirectIndexed = function (y) {
		m_CurrentAddressMode = 11;
		m_Idx = y;
	}

	this.Get = function (addr) {
		var realAddress = getRealAddress(addr);

		if(realAddress <= 0x10000 && realAddress > 0xC000) {
			// Upper Bank of Cartridge ROM
			var rom = nes.ROM();
			var relativeAddress = 0x10000 - realAddress;
			return rom.Get(16 + relativeAddress);
		} else if(realAddress <= 0xC000 && realAddress > 0x8000) {
			// Lower Bank of Cartridge ROM
			var rom = nes.ROM();
			var relativeAddress = 0xC000 - realAddress;
			return rom.Get(16 + relativeAddress);
		} else if(realAddress <= 0x8000 && realAddress > 0x6000) {
			// Cartridge RAM
			var rom = nes.ROM();
			var relativeAddress = 0x8000 - realAddress;
			return rom.Get(16 + relativeAddress);
		} else if(realAddress <= 0x6000 && realAddress > 0x5000) {
			// Expansion Modules
			return 0x0;
		} else if(realAddress <= 0x5000 && realAddress > 0x2000) {
			// Input/Output
			return 0x0;
		} else if(realAddress <= 0x2000 && realAddress > 0x0000) {
			return m_Memory[realAddress];
		}		
	}

	this.Set = function (addr, value) {
		var realAddress = addr;
		
		if(realAddress <= 0x10000 && realAddress > 0xC000) {
			// Upper Bank of Cartridge ROM
			var rom = nes.ROM();
			var relativeAddress = 0x10000 - realAddress;
			rom.Set(16 + relativeAddress, value);
		} else if(realAddress <= 0xC000 && realAddress > 0x8000) {
			// Lower Bank of Cartridge ROM
			var rom = nes.ROM();
			var relativeAddress = 0xC000 - realAddress;
			rom.Set(16 + relativeAddress, value);
		} else if(realAddress <= 0x8000 && realAddress > 0x6000) {
			// Cartridge RAM
			var rom = nes.ROM();
			var relativeAddress = 0x8000 - realAddress;
			rom.Set(16 + relativeAddress, value);
		} else if(realAddress <= 0x6000 && realAddress > 0x5000) {
			// Expansion Modules
			
		} else if(realAddress <= 0x5000 && realAddress > 0x2000) {
			// Input/Output
			
		} else if(realAddress <= 0x2000 && realAddress > 0x0000) {
			m_Memory[realAddress] = value;
		}				
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