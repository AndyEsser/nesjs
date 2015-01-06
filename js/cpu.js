var RAM 			= require('./ram');

function CPU (nes) {
// ----------------------------------------------------------------
	var me 			= this;
	var hz			= 2000;
	var m_Console 	= nes;	
	var m_Memory	= new RAM(nes);
	var m_Running 	= false;
	var m_OpSize	= new Array();
	var m_OpName	= new Array();
	var m_OpTable 	= new Array();
	var m_ROM;
	var pc 			= 0;
	var sp 			= 255;
	var a 			= 0;
	var x 			= 0;
	var y 			= 0;
	var p 			= 32;
// ----------------------------------------------------------------	
	// ADC
	m_OpSize[0x69] 	= 2;
	m_OpSize[0x65]	= 2;
	m_OpSize[0x75]	= 2;
	m_OpSize[0x6D]	= 3;
	m_OpSize[0x7D]	= 3;
	m_OpSize[0x79]	= 3;
	m_OpSize[0x61]	= 2;
	m_OpSize[0x71] 	= 2;

	// AND
	m_OpSize[0x29] 	= 2;
	m_OpSize[0x25] 	= 2;
	m_OpSize[0x35] 	= 2;
	m_OpSize[0x2D] 	= 3;
	m_OpSize[0x3D] 	= 3;
	m_OpSize[0x39] 	= 3;
	m_OpSize[0x21] 	= 2;
	m_OpSize[0x31] 	= 2;

	// ASL
	m_OpSize[0x0A] 	= 1;
	m_OpSize[0x06] 	= 2;
	m_OpSize[0x16] 	= 2;
	m_OpSize[0x0E] 	= 3;
	m_OpSize[0x1E] 	= 3;

	// BCC
	m_OpSize[0x90] 	= 2;

	// BCS
	m_OpSize[0xB0] 	= 2;

	// BEQ
	m_OpSize[0xF0] 	= 2;

	// BIT
	m_OpSize[0x24] 	= 2;
	m_OpSize[0x2C] 	= 3;

	// BMI
	m_OpSize[0x30] 	= 2;

	// BNE
	m_OpSize[0xD0] 	= 2;

	// BPL
	m_OpSize[0x10] 	= 2;

	// BRK
	m_OpSize[0x00] 	= 1;

	// BVC
	m_OpSize[0x50] 	= 2;

	// BVS
	m_OpSize[0x70] 	= 2;

	// CLC
	m_OpSize[0x18] 	= 1;

	// CLD
	m_OpSize[0xD8] 	= 1;

	// CLI
	m_OpSize[0x58] 	= 1;

	// CLV
	m_OpSize[0xB8] 	= 1;

	// CMP
	m_OpSize[0xC9] 	= 2;
	m_OpSize[0xC5] 	= 2;
	m_OpSize[0xD5] 	= 2;
	m_OpSize[0xCD] 	= 3;
	m_OpSize[0xDD] 	= 3;
	m_OpSize[0xD9] 	= 3;
	m_OpSize[0xC1] 	= 2;
	m_OpSize[0xD1] 	= 2;

	// CPX
	m_OpSize[0xE0] 	= 2;
	m_OpSize[0xE4] 	= 2;
	m_OpSize[0xEC] 	= 3;

	// CPY
	m_OpSize[0xC0] 	= 2;
	m_OpSize[0xC4] 	= 2;
	m_OpSize[0xCC] 	= 3;

	// DEC
	m_OpSize[0xC6] 	= 2;
	m_OpSize[0xD6] 	= 2;
	m_OpSize[0xCE] 	= 3;
	m_OpSize[0xDE] 	= 3;

	// DEX
	m_OpSize[0xCA] 	= 1;

	// DEY
	m_OpSize[0x88] 	= 1;

	// EOR
	m_OpSize[0x49] 	= 2;
	m_OpSize[0x45] 	= 2;
	m_OpSize[0x55] 	= 2;
	m_OpSize[0x4D] 	= 3;
	m_OpSize[0x5D] 	= 3;
	m_OpSize[0x59] 	= 3;
	m_OpSize[0x41] 	= 2;
	m_OpSize[0x51] 	= 2;

	// INC
	m_OpSize[0xE6] 	= 2;
	m_OpSize[0xF6] 	= 2;
	m_OpSize[0xEE] 	= 3;
	m_OpSize[0xFE] 	= 3;

	// INX
	m_OpSize[0xE8] 	= 1;

	// INY
	m_OpSize[0xC8] 	= 1;

	// JMP
	m_OpSize[0x4C] 	= 3;
	m_OpSize[0x6C] 	= 3;

	// JSR
	m_OpSize[0x20] 	= 3;

	// LDA
	m_OpSize[0xA9] 	= 2;
	m_OpSize[0xA5] 	= 2;
	m_OpSize[0xB5] 	= 2;
	m_OpSize[0xAD] 	= 3;
	m_OpSize[0xBD] 	= 3;
	m_OpSize[0xB9] 	= 3;
	m_OpSize[0xA1] 	= 2;
	m_OpSize[0xB1] 	= 2;

	// LDX
	m_OpSize[0xA2] 	= 2;
	m_OpSize[0xA6] 	= 2;
	m_OpSize[0xB6] 	= 2;
	m_OpSize[0xAE] 	= 3;
	m_OpSize[0xBE] 	= 3;

	// LDY
	m_OpSize[0xA0] 	= 2;
	m_OpSize[0xA4] 	= 2;
	m_OpSize[0xB4] 	= 2;
	m_OpSize[0xAC] 	= 3;
	m_OpSize[0xBC] 	= 3;	

	// LSR
	m_OpSize[0x4A] 	= 1;
	m_OpSize[0x46] 	= 2;
	m_OpSize[0x56] 	= 2;
	m_OpSize[0x4E] 	= 3;
	m_OpSize[0x5E] 	= 3;

	// NOP
	m_OpSize[0xEA] 	= 1;

	// ORA
	m_OpSize[0x09] 	= 2;
	m_OpSize[0x05] 	= 2;
	m_OpSize[0x15] 	= 2;
	m_OpSize[0x0D] 	= 3;
	m_OpSize[0x1D] 	= 3;
	m_OpSize[0x19] 	= 3;
	m_OpSize[0x01] 	= 2;
	m_OpSize[0x11] 	= 2;

	// PHA
	m_OpSize[0x48] 	= 1;

	// PHP
	m_OpSize[0x08] 	= 1;

	// PLA
	m_OpSize[0x68] 	= 1;

	// PLP
	m_OpSize[0x28] 	= 1;

	// ROL
	m_OpSize[0x2A] 	= 2;
	m_OpSize[0x26] 	= 5;
	m_OpSize[0x36] 	= 6;
	m_OpSize[0x2E] 	= 6;
	m_OpSize[0x3E] 	= 7;

	// ROL
	m_OpSize[0x6A] 	= 2;
	m_OpSize[0x66] 	= 5;
	m_OpSize[0x76] 	= 6;
	m_OpSize[0x6E] 	= 6;
	m_OpSize[0x7E] 	= 7;

	// RTI
	m_OpSize[0x40] 	= 1;

	// RTS
	m_OpSize[0x60] 	= 1;

	// SBC
	m_OpSize[0xE9] 	= 2;
	m_OpSize[0xE5] 	= 2;
	m_OpSize[0xF5] 	= 2;
	m_OpSize[0xED] 	= 3;
	m_OpSize[0xFD] 	= 3;
	m_OpSize[0xF9] 	= 3;
	m_OpSize[0xE1] 	= 2;
	m_OpSize[0xF1] 	= 2;

	// SEC
	m_OpSize[0x38] 	= 1;

	// SED
	m_OpSize[0xF8] 	= 1;

	// SEI
	m_OpSize[0x78] 	= 1;

	// STA
	m_OpSize[0x85] 	= 2;
	m_OpSize[0x95] 	= 2;
	m_OpSize[0x8D] 	= 3;
	m_OpSize[0x9D] 	= 3;
	m_OpSize[0x99] 	= 3;
	m_OpSize[0x81] 	= 2;
	m_OpSize[0x91] 	= 2;

	// STX
	m_OpSize[0x86] 	= 2;
	m_OpSize[0x96] 	= 2;
	m_OpSize[0x8E] 	= 3;

	// STY
	m_OpSize[0x84] 	= 2;
	m_OpSize[0x94] 	= 2;
	m_OpSize[0x8C] 	= 2;

	// TAX
	m_OpSize[0xAA] 	= 1;

	// TAY
	m_OpSize[0xA8] 	= 1;

	// TSX
	m_OpSize[0x38] 	= 1;

	// TXA
	m_OpSize[0x8A] 	= 1;

	// TXS
	m_OpSize[0x9A] 	= 1;

	// TYA
	m_OpSize[0x98] 	= 1;







// ADC
	m_OpName[0x69] 	= "ADC";
	m_OpName[0x65]	= "ADC";
	m_OpName[0x75]	= "ADC";
	m_OpName[0x6D]	= "ADC";
	m_OpName[0x7D]	= "ADC";
	m_OpName[0x79]	= "ADC";
	m_OpName[0x61]	= "ADC";
	m_OpName[0x71] 	= "ADC";

	// AND
	m_OpName[0x29] 	= "AND";
	m_OpName[0x25] 	= "AND";
	m_OpName[0x35] 	= "AND";
	m_OpName[0x2D] 	= "AND";
	m_OpName[0x3D] 	= "AND";
	m_OpName[0x39] 	= "AND";
	m_OpName[0x21] 	= "AND";
	m_OpName[0x31] 	= "AND";

	// ASL
	m_OpName[0x0A] 	= "ASL";
	m_OpName[0x06] 	= "ASL";
	m_OpName[0x16] 	= "ASL";
	m_OpName[0x0E] 	= "ASL";
	m_OpName[0x1E] 	= "ASL";

	// BCC
	m_OpName[0x90] 	= "BCC";

	// BCS
	m_OpName[0xB0] 	= "BCS";

	// BEQ
	m_OpName[0xF0] 	= "BEQ";

	// BIT
	m_OpName[0x24] 	= "BIT";
	m_OpName[0x2C] 	= "BIT";

	// BMI
	m_OpName[0x30] 	= "BMI";

	// BNE
	m_OpName[0xD0] 	= "BNE";

	// BPL
	m_OpName[0x10] 	= "BPL";

	// BRK
	m_OpName[0x00] 	= "BRK";

	// BVC
	m_OpName[0x50] 	= "BVC";

	// BVS
	m_OpName[0x70] 	= "BVS";

	// CLC
	m_OpName[0x18] 	= "CLC";

	// CLD
	m_OpName[0xD8] 	= "CLD";

	// CLI
	m_OpName[0x58] 	= "CLI";

	// CLV
	m_OpName[0xB8] 	= "CLV";

	// CMP
	m_OpName[0xC9] 	= "CMP";
	m_OpName[0xC5] 	= "CMP";
	m_OpName[0xD5] 	= "CMP";
	m_OpName[0xCD] 	= "CMP";
	m_OpName[0xDD] 	= "CMP";
	m_OpName[0xD9] 	= "CMP";
	m_OpName[0xC1] 	= "CMP";
	m_OpName[0xD1] 	= "CMP";

	// CPX
	m_OpName[0xE0] 	= "CPX";
	m_OpName[0xE4] 	= "CPX";
	m_OpName[0xEC] 	= "CPX";

	// CPY
	m_OpName[0xC0] 	= "CPY";
	m_OpName[0xC4] 	= "CPY";
	m_OpName[0xCC] 	= "CPY";

	// DEC
	m_OpName[0xC6] 	= "DEC";
	m_OpName[0xD6] 	= "DEC";
	m_OpName[0xCE] 	= "DEC";
	m_OpName[0xDE] 	= "DEC";

	// DEX
	m_OpName[0xCA] 	= "DEX";

	// DEY
	m_OpName[0x88] 	= "DEY";

	// EOR
	m_OpName[0x49] 	= "EOR";
	m_OpName[0x45] 	= "EOR";
	m_OpName[0x55] 	= "EOR";
	m_OpName[0x4D] 	= "EOR";
	m_OpName[0x5D] 	= "EOR";
	m_OpName[0x59] 	= "EOR";
	m_OpName[0x41] 	= "EOR";
	m_OpName[0x51] 	= "EOR";

	// INC
	m_OpName[0xE6] 	= "INC";
	m_OpName[0xF6] 	= "INC";
	m_OpName[0xEE] 	= "INC";
	m_OpName[0xFE] 	= "INC";

	// INX
	m_OpName[0xE8] 	= "INX";

	// INY
	m_OpName[0xC8] 	= "INY";

	// JMP
	m_OpName[0x4C] 	= "JMP";
	m_OpName[0x6C] 	= "JMP";

	// JSR
	m_OpName[0x20] 	= "JSR";

	// LDA
	m_OpName[0xA9] 	= "LDA";
	m_OpName[0xA5] 	= "LDA";
	m_OpName[0xB5] 	= "LDA";
	m_OpName[0xAD] 	= "LDA";
	m_OpName[0xBD] 	= "LDA";
	m_OpName[0xB9] 	= "LDA";
	m_OpName[0xA1] 	= "LDA";
	m_OpName[0xB1] 	= "LDA";

	// LDX
	m_OpName[0xA2] 	= "LDX";
	m_OpName[0xA6] 	= "LDX";
	m_OpName[0xB6] 	= "LDX";
	m_OpName[0xAE] 	= "LDX";
	m_OpName[0xBE] 	= "LDX";

	// LDY
	m_OpName[0xA0] 	= "LDY";
	m_OpName[0xA4] 	= "LDY";
	m_OpName[0xB4] 	= "LDY";
	m_OpName[0xAC] 	= "LDY";
	m_OpName[0xBC] 	= "LDY";	

	// LSR
	m_OpName[0x4A] 	= "LSR";
	m_OpName[0x46] 	= "LSR";
	m_OpName[0x56] 	= "LSR";
	m_OpName[0x4E] 	= "LSR";
	m_OpName[0x5E] 	= "LSR";

	// NOP
	m_OpName[0xEA] 	= "NOP";

	// ORA
	m_OpName[0x09] 	= "ORA";
	m_OpName[0x05] 	= "ORA";
	m_OpName[0x15] 	= "ORA";
	m_OpName[0x0D] 	= "ORA";
	m_OpName[0x1D] 	= "ORA";
	m_OpName[0x19] 	= "ORA";
	m_OpName[0x01] 	= "ORA";
	m_OpName[0x11] 	= "ORA";

	// PHA
	m_OpName[0x48] 	= "PHA";

	// PHP
	m_OpName[0x08] 	= "PHP";

	// PLA
	m_OpName[0x68] 	= "PLA";

	// PLP
	m_OpName[0x28] 	= "PLP";

	// ROL
	m_OpName[0x2A] 	= "ROL";
	m_OpName[0x26] 	= "ROL";
	m_OpName[0x36] 	= "ROL";
	m_OpName[0x2E] 	= "ROL";
	m_OpName[0x3E] 	= "ROL";

	// ROR
	m_OpName[0x6A] 	= "ROR";
	m_OpName[0x66] 	= "ROR";
	m_OpName[0x76] 	= "ROR";
	m_OpName[0x6E] 	= "ROR";
	m_OpName[0x7E] 	= "ROR";

	// RTI
	m_OpName[0x40] 	= "RTI";

	// RTS
	m_OpName[0x60] 	= "RTS";

	// SBC
	m_OpName[0xE9] 	= "SBC";
	m_OpName[0xE5] 	= "SBC";
	m_OpName[0xF5] 	= "SBC";
	m_OpName[0xED] 	= "SBC";
	m_OpName[0xFD] 	= "SBC";
	m_OpName[0xF9] 	= "SBC";
	m_OpName[0xE1] 	= "SBC";
	m_OpName[0xF1] 	= "SBC";

	// SEC
	m_OpName[0x38] 	= "SEC";

	// SED
	m_OpName[0xF8] 	= "SED";

	// SEI
	m_OpName[0x78] 	= "SEI";

	// STA
	m_OpName[0x85] 	= "STA";
	m_OpName[0x95] 	= "STA";
	m_OpName[0x8D] 	= "STA";
	m_OpName[0x9D] 	= "STA";
	m_OpName[0x99] 	= "STA";
	m_OpName[0x81] 	= "STA";
	m_OpName[0x91] 	= "STA";

	// STX
	m_OpName[0x86] 	= "STX";
	m_OpName[0x96] 	= "STX";
	m_OpName[0x8E] 	= "STX";

	// STY
	m_OpName[0x84] 	= "STY";
	m_OpName[0x94] 	= "STY";
	m_OpName[0x8C] 	= "STY";

	// TAX
	m_OpName[0xAA] 	= "TAX";

	// TAY
	m_OpName[0xA8] 	= "TAY";

	// TSX
	m_OpName[0x38] 	= "TSX";

	// TXA
	m_OpName[0x8A] 	= "TXA";

	// TXS
	m_OpName[0x9A] 	= "TXS";

	// TYA
	m_OpName[0x98] 	= "TYA";









	// ADC
	m_OpTable[0x69] = function (addr) { m_Memory.SetAddressModeImmediate(); 		me.ExecuteADC(addr); return 2; };
	m_OpTable[0x65] = function (addr) { m_Memory.SetAddressModeZeroPage(); 			me.ExecuteADC(addr); return 3; };
	m_OpTable[0x75] = function (addr) { m_Memory.SetAddressModeZeroPageX(x); 		me.ExecuteADC(addr); return 4; };
	m_OpTable[0x6D] = function (addr) { m_Memory.SetAddressModeAbsolute(); 			me.ExecuteADC(addr); return 4; };
	m_OpTable[0x7D] = function (addr) { m_Memory.SetAddressModeAbsoluteX(x); 		me.ExecuteADC(addr); return 4; };
	m_OpTable[0x79] = function (addr) { m_Memory.SetAddressModeAbsoluteY(y); 		me.ExecuteADC(addr); return 4; };
	m_OpTable[0x61] = function (addr) { m_Memory.SetAddressModeIndexedIndirect(x); 	me.ExecuteADC(addr); return 6; };
	m_OpTable[0x71] = function (addr) { m_Memory.SetAddressModeIndirectIndexed(y); 	me.ExecuteADC(addr); return 5; };

	// AND
	m_OpTable[0x29] = function (addr) { m_Memory.SetAddressModeImmediate(); 		me.ExecuteAND(addr); return 2; };
	m_OpTable[0x25] = function (addr) { m_Memory.SetAddressModeZeroPage(); 			me.ExecuteAND(addr); return 3; };
	m_OpTable[0x35] = function (addr) { m_Memory.SetAddressModeZeroPageX(x); 		me.ExecuteAND(addr); return 4; };
	m_OpTable[0x2D] = function (addr) { m_Memory.SetAddressModeAbsolute(); 			me.ExecuteAND(addr); return 4; };
	m_OpTable[0x3D] = function (addr) { m_Memory.SetAddressModeAbsoluteX(x); 		me.ExecuteAND(addr); return 4; };
	m_OpTable[0x39] = function (addr) { m_Memory.SetAddressModeAbsoluteY(y); 		me.ExecuteAND(addr); return 4; };
	m_OpTable[0x21] = function (addr) { m_Memory.SetAddressModeIndexedIndirect(x); 	me.ExecuteAND(addr); return 6; };
	m_OpTable[0x31] = function (addr) { m_Memory.SetAddressModeIndirectIndexed(y); 	me.ExecuteAND(addr); return 5; };

	// ASL
	m_OpTable[0x0A] = function (addr) { m_Memory.SetAddressModeAccumulator(a); 		me.ExecuteASL(addr); return 2; };
	m_OpTable[0x06] = function (addr) { m_Memory.SetAddressModeZeroPage(); 			me.ExecuteASL(addr); return 5; };
	m_OpTable[0x16] = function (addr) { m_Memory.SetAddressModeZeroPageX(x); 		me.ExecuteASL(addr); return 6; };
	m_OpTable[0x0E] = function (addr) { m_Memory.SetAddressModeAbsolute(); 			me.ExecuteASL(addr); return 6; };
	m_OpTable[0x1E] = function (addr) { m_Memory.SetAddressModeAbsoluteX(x); 		me.ExecuteASL(addr); return 7; };
	
	// BCC
	m_OpTable[0x90] = function (addr) { m_Memory.SetAddressModeRelative(); 			me.ExecuteBCC(addr); return 2; };

	// BCS
	m_OpTable[0xB0] = function (addr) { m_Memory.SetAddressModeRelative(); 			me.ExecuteBCS(addr); return 2; };

	// BEQ
	m_OpTable[0xF0] = function (addr) { m_Memory.SetAddressModeRelative(); 			me.ExecuteBEQ(addr); return 2; };

	// BIT
	m_OpTable[0x24] = function (addr) { m_Memory.SetAddressModeZeroPage(); 			me.ExecuteBIT(addr); return 3; };
	m_OpTable[0x2C] = function (addr) { m_Memory.SetAddressModeAbsolute(); 			me.ExecuteBIT(addr); return 4; };

	// BMI
	m_OpTable[0x30] = function (addr) { m_Memory.SetAddressModeRelative(); 			me.ExecuteBMI(addr); return 2; };

	// BNE
	m_OpTable[0xD0] = function (addr) { m_Memory.SetAddressModeRelative(); 			me.ExecuteBNE(addr); return 2; };

	// BPL
	m_OpTable[0x10] = function (addr) { m_Memory.SetAddressModeRelative(); 			me.ExecuteBPL(addr); return 2; };

	// BRK
	m_OpTable[0x00] = function (addr) { me.ExecuteBRK(addr); return 7; };

	// BVC
	m_OpTable[0x50] = function (addr) { m_Memory.SetAddressModeRelative(); 			me.ExecuteBVC(addr); return 2; };

	// BVS
	m_OpTable[0x70] = function (addr) { m_Memory.SetAddressModeRelative(); 			me.ExecuteBVS(addr); return 2; };

	// CLC
	m_OpTable[0x18] = function (addr) { me.ExecuteCLC(addr); return 2; };

	// CLD
	m_OpTable[0xD8] = function (addr) { me.ExecuteCLD(addr); return 2; };

	// CLI
	m_OpTable[0x58] = function (addr) { me.ExecuteCLI(addr); return 2; };

	// CLV
	m_OpTable[0xB8] = function (addr) { me.ExecuteCLV(addr); return 2; };

	// CMP
	m_OpTable[0xC9] = function (addr) { m_Memory.SetAddressModeImmediate(); 		me.ExecuteCMP(addr); return 2; };
	m_OpTable[0xC5] = function (addr) { m_Memory.SetAddressModeZeroPage(); 			me.ExecuteCMP(addr); return 3; };
	m_OpTable[0xD5] = function (addr) { m_Memory.SetAddressModeZeroPageX(x); 		me.ExecuteCMP(addr); return 4; };
	m_OpTable[0xCD] = function (addr) { m_Memory.SetAddressModeAbsolute(); 			me.ExecuteCMP(addr); return 4; };
	m_OpTable[0xDD] = function (addr) { m_Memory.SetAddressModeAbsoluteX(x); 		me.ExecuteCMP(addr); return 4; };
	m_OpTable[0xD9] = function (addr) { m_Memory.SetAddressModeAbsoluteY(y); 		me.ExecuteCMP(addr); return 4; };
	m_OpTable[0xC1] = function (addr) { m_Memory.SetAddressModeIndexedIndirect(x); 	me.ExecuteCMP(addr); return 6; };
	m_OpTable[0xD1] = function (addr) { m_Memory.SetAddressModeIndirectIndexed(y); 	me.ExecuteCMP(addr); return 5; };

	// CPX
	m_OpTable[0xE0] = function (addr) { m_Memory.SetAddressModeImmediate(); 		me.ExecuteCPX(addr); return 2; };
	m_OpTable[0xE4] = function (addr) { m_Memory.SetAddressModeZeroPage(); 			me.ExecuteCPX(addr); return 3; };
	m_OpTable[0xEC] = function (addr) { m_Memory.SetAddressModeAbsolute(); 			me.ExecuteCPX(addr); return 4; };

	// CPY
	m_OpTable[0xC0] = function (addr) { m_Memory.SetAddressModeImmediate(); 		me.ExecuteCPY(addr); return 2; };
	m_OpTable[0xC4] = function (addr) { m_Memory.SetAddressModeZeroPage(); 			me.ExecuteCPY(addr); return 3; };
	m_OpTable[0xCC] = function (addr) { m_Memory.SetAddressModeAbsolute(); 			me.ExecuteCPY(addr); return 4; };

	// DEC
	m_OpTable[0xC6] = function (addr) { m_Memory.SetAddressModeZeroPage(); 			me.ExecuteDEC(addr); return 5; };
	m_OpTable[0xD6] = function (addr) { m_Memory.SetAddressModeZeroPageX(x); 		me.ExecuteDEC(addr); return 6; };
	m_OpTable[0xCE] = function (addr) { m_Memory.SetAddressModeAbsolute(); 			me.ExecuteDEC(addr); return 6; };
	m_OpTable[0xDE] = function (addr) { m_Memory.SetAddressModeAbsoluteX(x); 		me.ExecuteDEC(addr); return 7; };

	// DEX
	m_OpTable[0xCA] = function (addr) { me.ExecuteDEX(addr); return 2; };

	// DEY
	m_OpTable[0x88] = function (addr) { me.ExecuteDEY(addr); return 2; };

	// EOR
	m_OpTable[0x49] = function (addr) { m_Memory.SetAddressModeImmediate(); 		me.ExecuteEOR(addr); return 2; };
	m_OpTable[0x45] = function (addr) { m_Memory.SetAddressModeZeroPage(); 			me.ExecuteEOR(addr); return 3; };
	m_OpTable[0x55] = function (addr) { m_Memory.SetAddressModeZeroPageX(x); 		me.ExecuteEOR(addr); return 4; };
	m_OpTable[0x4D] = function (addr) { m_Memory.SetAddressModeAbsolute(); 			me.ExecuteEOR(addr); return 4; };
	m_OpTable[0x5D] = function (addr) { m_Memory.SetAddressModeAbsoluteX(x); 		me.ExecuteEOR(addr); return 4; };
	m_OpTable[0x59] = function (addr) { m_Memory.SetAddressModeAbsoluteY(y); 		me.ExecuteEOR(addr); return 4; };
	m_OpTable[0x41] = function (addr) { m_Memory.SetAddressModeIndexedIndirect(x); 	me.ExecuteEOR(addr); return 6; };
	m_OpTable[0x51] = function (addr) { m_Memory.SetAddressModeIndirectIndexed(y); 	me.ExecuteEOR(addr); return 5; };

	// INC
	m_OpTable[0xE6] = function (addr) { m_Memory.SetAddressModeZeroPage(); 			me.ExecuteINC(addr); return 5; };
	m_OpTable[0xF6] = function (addr) { m_Memory.SetAddressModeZeroPageX(x); 		me.ExecuteINC(addr); return 6; };
	m_OpTable[0xEE] = function (addr) { m_Memory.SetAddressModeAbsolute(); 			me.ExecuteINC(addr); return 6; };
	m_OpTable[0xFE] = function (addr) { m_Memory.SetAddressModeAbsoluteX(x); 		me.ExecuteINC(addr); return 7; };

	// INX
	m_OpTable[0xE8] = function (addr) { me.ExecuteINX(addr); return 2; };

	// INY
	m_OpTable[0xC8] = function (addr) { me.ExecuteINY(addr); return 2; };

	// JMP
	m_OpTable[0x4C] = function (addr) { m_Memory.SetAddressModeAbsolute(); 			me.ExecuteJMP(addr); return 3; };
	m_OpTable[0x6C] = function (addr) { m_Memory.SetAddressModeIndirect(); 			me.ExecuteJMP(addr); return 5; };

	// JSR
	m_OpTable[0x20] = function (addr) { m_Memory.SetAddressModeAbsolute(); 			me.ExecuteJSR(addr); return 6; };

	// LDA
	m_OpTable[0xA9] = function (addr) { m_Memory.SetAddressModeImmediate(); 		me.ExecuteLDA(addr); return 2; };
	m_OpTable[0xA5] = function (addr) { m_Memory.SetAddressModeZeroPage(); 			me.ExecuteLDA(addr); return 3; };
	m_OpTable[0xB5] = function (addr) { m_Memory.SetAddressModeZeroPageX(x); 		me.ExecuteLDA(addr); return 4; };
	m_OpTable[0xAD] = function (addr) { m_Memory.SetAddressModeAbsolute(); 			me.ExecuteLDA(addr); return 4; };
	m_OpTable[0xBD] = function (addr) { m_Memory.SetAddressModeAbsoluteX(x); 		me.ExecuteLDA(addr); return 4; };
	m_OpTable[0xB9] = function (addr) { m_Memory.SetAddressModeAbsoluteY(y); 		me.ExecuteLDA(addr); return 4; };
	m_OpTable[0xA1] = function (addr) { m_Memory.SetAddressModeIndexedIndirect(x); 	me.ExecuteLDA(addr); return 6; };
	m_OpTable[0xB1] = function (addr) { m_Memory.SetAddressModeIndirectIndexed(y); 	me.ExecuteLDA(addr); return 5; };

	// LDX
	m_OpTable[0xA2] = function (addr) { m_Memory.SetAddressModeImmediate(); 		me.ExecuteLDX(addr); return 2; };
	m_OpTable[0xA6] = function (addr) { m_Memory.SetAddressModeZeroPage(); 			me.ExecuteLDX(addr); return 3; };
	m_OpTable[0xB6] = function (addr) { m_Memory.SetAddressModeZeroPageY(y); 		me.ExecuteLDX(addr); return 4; };
	m_OpTable[0xAE] = function (addr) { m_Memory.SetAddressModeAbsolute(); 			me.ExecuteLDX(addr); return 4; };
	m_OpTable[0xBE] = function (addr) { m_Memory.SetAddressModeAbsoluteY(y); 		me.ExecuteLDX(addr); return 4; };

	// LDY
	m_OpTable[0xA0] = function (addr) { m_Memory.SetAddressModeImmediate(); 		me.ExecuteLDY(addr); return 2; };
	m_OpTable[0xA4] = function (addr) { m_Memory.SetAddressModeZeroPage(); 			me.ExecuteLDY(addr); return 3; };
	m_OpTable[0xB4] = function (addr) { m_Memory.SetAddressModeZeroPageX(x); 		me.ExecuteLDY(addr); return 4; };
	m_OpTable[0xAC] = function (addr) { m_Memory.SetAddressModeAbsolute(); 			me.ExecuteLDY(addr); return 4; };
	m_OpTable[0xBC] = function (addr) { m_Memory.SetAddressModeAbsoluteX(x); 		me.ExecuteLDY(addr); return 4; };

	// LSR
	m_OpTable[0x4A] = function (addr) { m_Memory.SetAddressModeAccumulator(a); 		me.ExecuteLSR(addr); return 2; };
	m_OpTable[0x46] = function (addr) { m_Memory.SetAddressModeZeroPage(); 			me.ExecuteLSR(addr); return 5; };
	m_OpTable[0x56] = function (addr) { m_Memory.SetAddressModeZeroPageX(x); 		me.ExecuteLSR(addr); return 6; };
	m_OpTable[0x4E] = function (addr) { m_Memory.SetAddressModeAbsolute(); 			me.ExecuteLSR(addr); return 6; };
	m_OpTable[0x5E] = function (addr) { m_Memory.SetAddressModeAbsoluteX(x); 		me.ExecuteLSR(addr); return 7; };

	// NOP
	m_OpTable[0xEA] = function (addr) { me.ExecuteNOP(addr); return 2; };

	// ORA
	m_OpTable[0x09] = function (addr) { m_Memory.SetAddressModeImmediate(); 		me.ExecuteORA(addr); return 2; };
	m_OpTable[0x05] = function (addr) { m_Memory.SetAddressModeZeroPage(); 			me.ExecuteORA(addr); return 3; };
	m_OpTable[0x15] = function (addr) { m_Memory.SetAddressModeZeroPageX(x); 		me.ExecuteORA(addr); return 4; };
	m_OpTable[0x0D] = function (addr) { m_Memory.SetAddressModeAbsolute(); 			me.ExecuteORA(addr); return 4; };
	m_OpTable[0x1D] = function (addr) { m_Memory.SetAddressModeAbsoluteX(x); 		me.ExecuteORA(addr); return 4; };
	m_OpTable[0x19] = function (addr) { m_Memory.SetAddressModeAbsoluteY(y); 		me.ExecuteORA(addr); return 4; };
	m_OpTable[0x01] = function (addr) { m_Memory.SetAddressModeIndexedIndirect(x); 	me.ExecuteORA(addr); return 6; };
	m_OpTable[0x11] = function (addr) { m_Memory.SetAddressModeIndirectIndexed(y); 	me.ExecuteORA(addr); return 5; };

	// PHA
	m_OpTable[0x48] = function (addr) { me.ExecutePHA(addr); return 3; };

	// PHP
	m_OpTable[0x08] = function (addr) { me.ExecutePHP(addr); return 3; };

	// PLA
	m_OpTable[0x68] = function (addr) { me.ExecutePLA(addr); return 4; };

	// PLP
	m_OpTable[0x28] = function (addr) { me.ExecutePLP(addr); return 4; };

	// ROL
	m_OpTable[0x2A] = function (addr) { m_Memory.SetAddressModeAccumulator(a); 		me.ExecuteROL(addr); return 2; };
	m_OpTable[0x26] = function (addr) { m_Memory.SetAddressModeZeroPage(); 			me.ExecuteROL(addr); return 5; };
	m_OpTable[0x36] = function (addr) { m_Memory.SetAddressModeZeroPageX(x); 		me.ExecuteROL(addr); return 6; };
	m_OpTable[0x2E] = function (addr) { m_Memory.SetAddressModeAbsolute(); 			me.ExecuteROL(addr); return 6; };
	m_OpTable[0x3E] = function (addr) { m_Memory.SetAddressModeAbsoluteX(x); 		me.ExecuteROL(addr); return 7; };

	// ROR
	m_OpTable[0x6A] = function (addr) { m_Memory.SetAddressModeAccumulator(a); 		me.ExecuteROR(addr); return 2; };
	m_OpTable[0x66] = function (addr) { m_Memory.SetAddressModeZeroPage(); 			me.ExecuteROR(addr); return 5; };
	m_OpTable[0x76] = function (addr) { m_Memory.SetAddressModeZeroPageX(x); 		me.ExecuteROR(addr); return 6; };
	m_OpTable[0x6E] = function (addr) { m_Memory.SetAddressModeAbsolute(); 			me.ExecuteROR(addr); return 6; };
	m_OpTable[0x7E] = function (addr) { m_Memory.SetAddressModeAbsoluteX(x); 		me.ExecuteROR(addr); return 7; };

	// RTI
	m_OpTable[0x40] = function (addr) { me.ExecuteRTI(addr); return 6; };

	// RTS
	m_OpTable[0x60] = function (addr) { me.ExecutePTS(addr); return 6; };

	// SBC
	m_OpTable[0xE9] = function (addr) { m_Memory.SetAddressModeImmediate(); 		me.ExecuteSBC(addr); return 2; };
	m_OpTable[0xE5] = function (addr) { m_Memory.SetAddressModeZeroPage(); 			me.ExecuteSBC(addr); return 3; };
	m_OpTable[0xF5] = function (addr) { m_Memory.SetAddressModeZeroPageX(x); 		me.ExecuteSBC(addr); return 4; };
	m_OpTable[0xED] = function (addr) { m_Memory.SetAddressModeAbsolute(); 			me.ExecuteSBC(addr); return 4; };
	m_OpTable[0xFD] = function (addr) { m_Memory.SetAddressModeAbsoluteX(x); 		me.ExecuteSBC(addr); return 4; };
	m_OpTable[0xF9] = function (addr) { m_Memory.SetAddressModeAbsoluteY(y); 		me.ExecuteSBC(addr); return 4; };
	m_OpTable[0xE1] = function (addr) { m_Memory.SetAddressModeAbsolute(); 			me.ExecuteSBC(addr); return 6; };
	m_OpTable[0xE1] = function (addr) { m_Memory.SetAddressModeAbsoluteX(x); 		me.ExecuteSBC(addr); return 5; };

	// SEC
	m_OpTable[0x38] = function (addr) { me.ExecuteSEC(addr); return 2; };

	// SED
	m_OpTable[0xF8] = function (addr) { me.ExecuteSED(addr); return 2; };

	// SEI
	m_OpTable[0x78] = function (addr) { me.ExecuteSEI(addr); return 2; };

	// STA
	m_OpTable[0x85] = function (addr) { m_Memory.SetAddressModeZeroPage(); 			me.ExecuteSTA(addr); return 3; };
	m_OpTable[0x95] = function (addr) { m_Memory.SetAddressModeZeroPageX(x); 		me.ExecuteSTA(addr); return 4; };
	m_OpTable[0x8D] = function (addr) { m_Memory.SetAddressModeAbsolute(); 			me.ExecuteSTA(addr); return 4; };
	m_OpTable[0x9D] = function (addr) { m_Memory.SetAddressModeAbsoluteX(x); 		me.ExecuteSTA(addr); return 5; };
	m_OpTable[0x99] = function (addr) { m_Memory.SetAddressModeAbsoluteY(y); 		me.ExecuteSTA(addr); return 5; };
	m_OpTable[0x81] = function (addr) { m_Memory.SetAddressModeIndexedIndirect(x); 	me.ExecuteSTA(addr); return 6; };
	m_OpTable[0x91] = function (addr) { m_Memory.SetAddressModeIndirectIndexed(y); 	me.ExecuteSTA(addr); return 6; };

	// STX
	m_OpTable[0x86] = function (addr) { m_Memory.SetAddressModeZeroPage(); 			me.ExecuteSTX(addr); return 3; };
	m_OpTable[0x96] = function (addr) { m_Memory.SetAddressModeZeroPageY(y); 		me.ExecuteSTX(addr); return 4; };
	m_OpTable[0x8E] = function (addr) { m_Memory.SetAddressModeAbsolute(); 			me.ExecuteSTX(addr); return 4; };

	// STY
	m_OpTable[0x84] = function (addr) { m_Memory.SetAddressModeZeroPage(); 			me.ExecuteSTY(addr); return 3; };
	m_OpTable[0x94] = function (addr) { m_Memory.SetAddressModeZeroPageX(x); 		me.ExecuteSTY(addr); return 4; };
	m_OpTable[0x8C] = function (addr) { m_Memory.SetAddressModeAbsolute(); 			me.ExecuteSTY(addr); return 4; };

	// TAX
	m_OpTable[0xAA] = function (addr) { me.ExecuteTAX(addr); return 2; };

	// TAY
	m_OpTable[0xA8] = function (addr) { me.ExecuteTAY(addr); return 2; };

	// TSX
	m_OpTable[0xBA] = function (addr) { me.ExecuteTSX(addr); return 2; };

	// TXA
	m_OpTable[0x8A] = function (addr) { me.ExecuteTXA(addr); return 2; };

	// TXS
	m_OpTable[0x9a] = function (addr) { me.ExecuteTXS(addr); return 2; };

	// TYA
	m_OpTable[0x98] = function (addr) { me.ExecuteTYA(addr); return 2; };

	var insCount = 0;
	for(var idx = 0; idx < m_OpTable.length; ++idx) {
		if(m_OpTable[idx] != null || m_OpTable != undefined) {
			insCount++;
		}
	}

	console.log(insCount + " Instructions");
// ----------------------------------------------------------------
	function stackPush (value) {
		var addr = sp + 256;
		m_Memory.Set(addr, value & 255);
		sp--;
		sp &= 255;
	}

	function stackPop () {
		sp++;
		sp &= 255;
		var addr = sp + 256;
		return m_Memory.Get(addr);
	}

	function stackPushWord (value) {
		stackPush((value >> 8) & 255);
		stackPush((value & 255));
	}

	function stackPopWord () {
		var value = stackPop();
		value += 256 * stackPop();
		return z;
	}

	function setCarryFlag () {
		p = p | 1;
	}

	function unsetCarryFlag () {
		p = p & ~1;
	}

	function setZeroFlag () {
		p = p | 2;
	}

	function unsetZeroFlag () {
		p = p & ~2;
	}

	function setInterruptDisable () {
		p = p | 4;
	}

	function unsetInterruptDisable () {
		p = p & ~4;
	}

	function setDecimalMode () {
		p = p | 8;
	}

	function unsetDecimalMode () {
		p = p &~ 8;
	}

	function setBreakCommand () {
		p = p | 16;
	}

	function unsetBreakCommand () {
		p = p & ~16;
	}

	function setOverflowFlag () {
		p = p | 64;
	}

	function unsetOverflowFlag () {
		p = p & ~64;
	}

	function setNegativeFlag () {
		p = p | 128;
	}

	function unsetNegativeFlag () {
		p = p & ~128;
	}

	function isCarrySet () {
		return (p & 1) === 1;
	}

	function isZeroSet () {
		return (p & 2) === 1;
	}

	function isInterruptDisableSet () {
		return (p & 4) === 1;
	}

	function isDecimalModeSet () {
		return (p & 8) === 1;
	}

	function isBreakFlagSet () {
		return (p & 16) === 1;
	}

	function isOverflowFlagSet () {
		return (p & 64) === 1;
	}	

	function isNegativeFlagSet () {
		return (p & 128) === 1;
	}

	function convertToHex(value) {
		if(value === undefined || value == null) {
			return "0000";
		}
		var str = value.toString(16).toUpperCase();
		var len = str.length;
		var n = 4;
		return len >= n ? str : new Array(n - len + 1).join(0) + str;
	}

// ----------------------------------------------------------------

	this.ExecuteADC = function (addr) {
		var value = m_Memory.Get(addr);					// Get value of memory address
		a = a + value + (p & 0);						// Add Accumulator to value and Carry Flag value
		var sign = a & 128;
		if(a > 255) { setCarryFlag(); }					// Greater than 255 - set Carry Flag
		if(a & 128) { setNegativeFlag(); }				// Negative number - set Negative Flag
		if(a === 0) { setZeroFlag(); }					// Value is zero - set Zero Flag
		if((a & 128) != sign) { setOverflowFlag(); } 	// Sign is incorrect - set Overflow flag
	}

	this.ExecuteAND = function (addr) {
		var value = m_Memory.Get(addr);
		a = a & value;
		if(a === 0) { setZeroFlag(); }
		if(a & 128) { setNegativeFlag(); }
	}

	this.ExecuteASL = function (addr) {
		var value = m_Memory.Get(addr);
		a = value * 2;
		(value & 128) === 0 ? unsetCarryFlag() : setCarryFlag();
		if(value & 128) { setNegativeFlag(); }
		if(a === 0) { setZeroFlag(); }
	}

	this.ExecuteBCC = function (value) {
		if(!isCarrySet()) {
			pc += value;
		}
	}

	this.ExecuteBCS = function (value) {
		if(isCarrySet()) {
			pc += value;
		}
	}

	this.ExecuteBEQ = function (value) {
		if(isZeroSet()) {
			pc += value;
		}
	}

	this.ExecuteBIT = function (addr) {
		var value = m_Memory.Get(addr);
		var tmp = p & value;
		if(tmp === 0) { setZeroFlag(); }
		(value & 64) === 0 ? unsetOverflowFlag() : setOverflowFlag();
		(value & 128) === 0 ? unsetNegativeFlag() : setNegativeFlag();
	}

	this.ExecuteBMI = function (value) {
		if(isNegativeFlagSet()) {
			pc += value;
		}
	}

	this.ExecuteBNE = function (value) {
		if(!isZeroSet()) {
			pc += value;
		}
	}

	this.ExecuteBPL = function (value) {
		if(!isNegativeFlagSet()) {
			pc += value;
		}
	}

	this.ExecuteBRK = function () {
		stackPush(pc);
		stackPush(p);		
		pc = m_Memory.Get(0xFFFE);
		setBreakCommand();
	}

	this.ExecuteBVC = function (value) {
		if(!isOverflowFlagSet()) {
			pc += value;
		}
	}

	this.ExecuteBVS = function () {
		if(isOverflowFlagSet()) {
			pc += value;
		}
	}

	this.ExecuteCLC = function () {
		unsetCarryFlag();
	}

	this.ExecuteCLD = function () {
		unsetDecimalMode();
	}

	this.ExecuteCLI = function () {
		unsetInterruptDisable();
	}

	this.ExecuteCLV = function () {
		unsetOverflowFlag();
	}

	this.ExecuteCMP = function (addr) {
		var value = m_Memory.Get(addr);
		a = a - value;
		if(a >= value) { setCarryFlag(); }
		if(a == value) { setZeroFlag(); }
		if(a < 0) { setNegativeFlag(); }
	}

	this.ExecuteCPX = function (addr) {
		var value = m_Memory.Get(addr);
		x = x - value;
		if(x >= value) { setCarryFlag(); }
		if(x == value) { setZeroFlag();	}
		if(x < 0) { setNegativeFlag(); }
	}

	this.ExecuteCPY = function (addr) {
		var value = m_Memory.Get(addr);
		y = y - value;
		if(y >= value) { setCarryFlag(); }
		if(y == value) { setZeroFlag();	}
		if(y < 0) { setNegativeFlag(); }
	}

	this.ExecuteDEC = function (addr) {
		var value = m_Memory.Get(addr);
		value--;
		if(value === 0) { setZeroFlag(); }
		if(value < 0) { setNegativeFlag(); }
		m_Memory.Set(addr, value);
	}

	this.ExecuteDEX = function () {
		x--;
		if(x === 0) { setZeroFlag(); }
		if(x < 0) { setNegativeFlag(); }
	}

	this.ExecuteDEY = function () {
		y--;
		if(y === 0) { setZeroFlag(); }
		if(y < 0) { setNegativeFlag(); }
	}

	this.ExecuteEOR = function () {
		var value = m_Memory.Get(addr);
		a = a ^ value;
		if(a === 0) { setZeroFlag(); }
		if(a & 128) { setNegativeFlag(); }
	}

	this.ExecuteINC = function (addr) {
		var value = m_Memory.Get(addr);
		value++;
		if(value === 0) { setZeroFlag(); }
		if(value < 0) { setNegativeFlag(); }
		m_Memory.Set(addr, value);
	}

	this.ExecuteINX = function () {
		x++;
		if(x === 0) { setZeroFlag(); }
		if(x < 0) { setNegativeFlag(); }
	}

	this.ExecuteINY = function () {
		y++;
		if(y === 0) { setZeroFlag(); }
		if(y < 0) { setNegativeFlag(); }
	}

	this.ExecuteJMP = function (value) {
		pc = value;
	}

	this.ExecuteJSR = function (addr) {
		stackPush(pc -1);
		pc = m_Memory.Get(addr);
	}

	this.ExecuteLDA = function (addr) {
		a = m_Memory.Get(addr);
		if(a === 0) { setZeroFlag(); }
		if(a < 0) { setNegativeFlag(); }
	}

	this.ExecuteLDX = function (addr) {
		x = m_Memory.Get(addr);
		if(x === 0) { setZeroFlag(); }
		if(x < 0) { setNegativeFlag(); }
	}

	this.ExecuteLDY = function (addr) {
		y = m_Memory.Get(addr);
		if(y === 0) { setZeroFlag(); }
		if(y < 0) { setNegativeFlag(); }
	}

	this.ExecuteLSR = function () {
		// TODO:
		console.log("$LSR: TODO");
	}

	this.ExecuteNOP = function () {
		
	}

	this.ExecuteORA = function (addr) {
		var value = m_Memory.Get(addr);
		a = a | value;
		if(a === 0) { setZeroFlag(); }
		if(a & 128) { setNegativeFlag(); }
	}

	this.ExecutePHA = function () {
		stackPush(a);
	}

	this.ExecutePHP = function () {
		stackPush(p);
	}

	this.ExecutePLA = function () {
		a = stackPop();
	}

	this.ExecutePLP = function () {
		p = stackPop();
	}

	this.ExecuteROL = function () {
		// TODO:
		console.log("$ROL: TODO");
	}

	this.ExecuteROR = function () {
		// TODO:
		console.log("$ROR: TODO");
	}

	this.ExecuteRTI = function () {
		p = stackPop();
		pc = stackPop();
	}

	this.ExecuteRTS = function () {
		pc = stackPop();
	}

	this.ExecuteSBC = function () {
		// TODO:
		console.log("$SBC: TODO");
	}

	this.ExecuteSEC = function () {
		setCarryFlag();
	}

	this.ExecuteSED = function () {
		setDecimalMode();
	}

	this.ExecuteSEI = function () {
		setInterruptDisable();
	}

	this.ExecuteSTA = function (addr) {
		m_Memory.Set(addr, a);
	}

	this.ExecuteSTX = function () {
		m_Memory.Set(addr, x);
	}

	this.ExecuteSTY = function () {
		m_Memory.Set(addr, y);
	}

	this.ExecuteTAX = function () {
		x = a;
		if(x === 0) { setZeroFlag(); }
		if(x < 0) { setNegativeFlag(); }
	}

	this.ExecuteTAY = function () {
		y = a;
		if(y === 0) { setZeroFlag(); }
		if(y < 0) { setNegativeFlag(); }		
	}

	this.ExecuteTSX = function () {
		x = sp;
		if(x === 0) { setZeroFlag(); }
		if(x < 0) { setNegativeFlag(); }		
	}

	this.ExecuteTXA = function () {
		a = x;
		if(a === 0) { setZeroFlag(); }
		if(a < 0) { setNegativeFlag(); }		
	}

	this.ExecuteTXS = function () {
		sp = x;

	}

	this.ExecuteTYA = function () {
		a = y;
		if(a === 0) { setZeroFlag(); }
		if(a < 0) { setNegativeFlag(); }
	}

	this.ExecuteInstruction = function (opcode, addr) {
		if(addr === undefined || addr == null) {
			console.log("Executing: " + pc + " $" + m_OpName[opcode] + " 0x" + opcode.toString(16).toUpperCase());
		} else {
			console.log("Executing: " + pc + " $" + m_OpName[opcode] + " 0x" + opcode.toString(16).toUpperCase() + " [0x" + convertToHex(addr.toString(16).toUpperCase()) + "]");	
		}
		
		if(m_OpTable[opcode] == null || m_OpTable[opcode] === undefined) {
			console.error("Unknown Instruction: 0x" + opcode.toString(16).toUpperCase() + " " + addr + " ---- Stopping Execution");
			console.error("PC: " + pc + " X: " + x + " Y: " + y + " SP: " + sp + " P: " + p);
			m_Running = false;
			process.exit();
		}

		return cycleCount = m_OpTable[opcode](addr);
	}

	this.Init = function () {
		m_Memory.Init();
		
	}

	this.Reset = function () {

	}

	this.Execute = function () {		
		var instr = m_ROM.Get(pc);
		if(instr == undefined || instr === null) {
			return 0;
		}		
		var cycles;
		if(m_OpSize[instr] === 1) {
			cycles = this.ExecuteInstruction(instr);
		} else if (m_OpSize[instr] === 2) {
			cycles = this.ExecuteInstruction(instr, m_ROM.Get(pc + 1));
		} else if (m_OpSize[instr] === 3) {			
			cycles = this.ExecuteInstruction(instr, m_ROM.Get(pc + 2) + m_ROM.Get(pc + 1));
		}

		pc += m_OpSize[instr];
		return cycles;
	}

	this.ExecuteLoop = function () {
		var delay = 1000 / hz;	// Get the delay between cycles based on Hz of simulation
		var cycles = me.Execute();
		if (cycles === 0) {
			return;
		}
		setTimeout(me.ExecuteLoop, delay * cycles);
	}

	this.Run = function () {
		m_Running = true;
		m_ROM = m_Console.ROM();
		console.log("Number of 16kB ROM Banks: " + m_ROM.Get(4));
		console.log("Number of 8kB ROM Banks: " + m_ROM.Get(5));
		console.log("Number of 8kB RAM Banks: " + m_ROM.Get(8));
		console.log(m_ROM.Get(9) & 0x1 == 1 ? "Format: PAL" : "Format: NTSC");
		var lowerMapper = m_ROM.Get(6) >> 4;
		var upperMapper = m_ROM.Get(7) >> 4;
		var mapperType = lowerMapper + upperMapper;
		if (mapperType === 0) {
			console.log("No Mapper Required by ROM");
		}

		var pc1 = m_Memory.Get(0xFFFC);	// Get RESET Vector
		var pc2 = m_Memory.Get(0xFFFD);
		pc = pc2 + pc1;

		this.ExecuteLoop();
	}

	this.IsRunning = function () {
		return m_Running;
	}
// ----------------------------------------------------------------
};

module.exports = function (nes) {
	return new CPU(nes);
};