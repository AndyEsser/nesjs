var RAM 			= require('./ram');

function CPU (nes) {
// ----------------------------------------------------------------
	var me = this;
	var m_Console 	= nes;	
	var m_Memory	= new RAM();
	var m_Running 	= false;
	var m_OpSize	= new Array();
	var m_OpTable 	= new Array();
	var pc;
	var sp;
	var a;
	var x;
	var y;
	var p;
// ----------------------------------------------------------------
	// ADC
	m_OpSize[0x69] = 2;
	m_OpSize[0x65] = 2;
	m_OpSize[0x75] = 2;
	m_OpSize[0x6D] = 2;
	m_OpSize[0x7D] = 3;
	m_OpSize[0x79] = 3;
	m_OpSize[0x61] = 2;
	m_OpSize[0x71] = 2;

	// AND
	m_OpSize[0x29] = function (addr) { me.ExecuteAND(addr); return 2; };
	m_OpSize[0x25] = function (addr) { me.ExecuteAND(addr); return 3; };
	m_OpSize[0x35] = function (addr) { me.ExecuteAND(addr); return 4; };
	m_OpSize[0x2D] = function (addr) { me.ExecuteAND(addr); return 4; };
	m_OpSize[0x3D] = function (addr) { me.ExecuteAND(addr); return 4; };
	m_OpSize[0x39] = function (addr) { me.ExecuteAND(addr); return 4; };
	m_OpSize[0x21] = function (addr) { me.ExecuteAND(addr); return 6; };
	m_OpSize[0x31] = function (addr) { me.ExecuteAND(addr); return 5; };

	// ASL
	m_OpSize[0x0A] = function (addr) { me.ExecuteASL(addr); return 2; };
	m_OpSize[0x06] = function (addr) { me.ExecuteASL(addr); return 5; };
	m_OpSize[0x16] = function (addr) { me.ExecuteASL(addr); return 6; };
	m_OpSize[0x0E] = function (addr) { me.ExecuteASL(addr); return 6; };
	m_OpSize[0x1E] = function (addr) { me.ExecuteASL(addr); return 7; };
	
	// BCC
	m_OpSize[0x90] = function (addr) { me.ExecuteBCC(addr); return 2; };

	// BCS
	m_OpSize[0xB0] = function (addr) { me.ExecuteBCS(addr); return 2; };

	// BEQ
	m_OpSize[0xF0] = function (addr) { me.ExecuteBEQ(addr); return 2; };

	// BIT
	m_OpSize[0x24] = function (addr) { me.ExecuteBIT(addr); return 3; };
	m_OpSize[0x2C] = function (addr) { me.ExecuteBIT(addr); return 4; };

	// BMI
	m_OpSize[0x30] = function (addr) { me.ExecuteBMI(addr); return 2; };

	// BNE
	m_OpSize[0xD0] = function (addr) { me.ExecuteBNE(addr); return 2; };

	// BPL
	m_OpSize[0x10] = function (addr) { me.ExecuteBPL(addr); return 2; };

	// BRK
	m_OpSize[0x00] = function (addr) { me.ExecuteBRK(addr); return 7; };

	// BVC
	m_OpSize[0x50] = function (addr) { me.ExecuteBVC(addr); return 2; };

	// BVS
	m_OpSize[0x70] = function (addr) { me.ExecuteBVS(addr); return 2; };

	// CLC
	m_OpSize[0x18] = function (addr) { me.ExecuteCLC(addr); return 2; };

	// CLD
	m_OpSize[0xD8] = function (addr) { me.ExecuteCLD(addr); return 2; };

	// CLI
	m_OpSize[0x58] = function (addr) { me.ExecuteCLI(addr); return 2; };

	// CLV
	m_OpSize[0xB8] = function (addr) { me.ExecuteCLV(addr); return 2; };

	// CMP
	m_OpSize[0xC9] = function (addr) { me.ExecuteCMP(addr); return 2; };
	m_OpSize[0xC5] = function (addr) { me.ExecuteCMP(addr); return 3; };
	m_OpSize[0xD5] = function (addr) { me.ExecuteCMP(addr); return 4; };
	m_OpSize[0xCD] = function (addr) { me.ExecuteCMP(addr); return 4; };
	m_OpSize[0xDD] = function (addr) { me.ExecuteCMP(addr); return 4; };
	m_OpSize[0xD9] = function (addr) { me.ExecuteCMP(addr); return 4; };
	m_OpSize[0xC1] = function (addr) { me.ExecuteCMP(addr); return 6; };
	m_OpSize[0xD1] = function (addr) { me.ExecuteCMP(addr); return 5; };

	// CPX
	m_OpSize[0xE0] = function (addr) { me.ExecuteCPX(addr); return 2; };
	m_OpSize[0xE4] = function (addr) { me.ExecuteCPX(addr); return 3; };
	m_OpSize[0xEC] = function (addr) { me.ExecuteCPX(addr); return 4; };

	// CPY
	m_OpSize[0xC0] = function (addr) { me.ExecuteCPY(addr); return 2; };
	m_OpSize[0xC4] = function (addr) { me.ExecuteCPY(addr); return 3; };
	m_OpSize[0xCC] = function (addr) { me.ExecuteCPY(addr); return 4; };

	// DEC
	m_OpSize[0xC6] = function (addr) { me.ExecuteDEC(addr); return 5; };
	m_OpSize[0xD6] = function (addr) { me.ExecuteDEC(addr); return 6; };
	m_OpSize[0xCE] = function (addr) { me.ExecuteDEC(addr); return 6; };
	m_OpSize[0xDE] = function (addr) { me.ExecuteDEC(addr); return 7; };

	// DEX
	m_OpSize[0xCA] = function (addr) { me.ExecuteDEX(addr); return 2; };

	// DEY
	m_OpSize[0x88] = function (addr) { me.ExecuteDEY(addr); return 2; };

	// EOR
	m_OpSize[0x49] = function (addr) { me.ExecuteEOR(addr); return 2; };
	m_OpSize[0x45] = function (addr) { me.ExecuteEOR(addr); return 3; };
	m_OpSize[0x55] = function (addr) { me.ExecuteEOR(addr); return 4; };
	m_OpSize[0x4D] = function (addr) { me.ExecuteEOR(addr); return 4; };
	m_OpSize[0x5D] = function (addr) { me.ExecuteEOR(addr); return 4; };
	m_OpSize[0x59] = function (addr) { me.ExecuteEOR(addr); return 4; };
	m_OpSize[0x41] = function (addr) { me.ExecuteEOR(addr); return 6; };
	m_OpSize[0x51] = function (addr) { me.ExecuteEOR(addr); return 5; };

	// INC
	m_OpSize[0xE6] = function (addr) { me.ExecuteINC(addr); return 5; };
	m_OpSize[0xF6] = function (addr) { me.ExecuteINC(addr); return 6; };
	m_OpSize[0xEE] = function (addr) { me.ExecuteINC(addr); return 6; };
	m_OpSize[0xFE] = function (addr) { me.ExecuteINC(addr); return 7; };

	// INX
	m_OpSize[0xE8] = function (addr) { me.ExecuteINX(addr); return 2; };

	// INY
	m_OpSize[0xC8] = function (addr) { me.ExecuteINY(addr); return 2; };

	// JMP
	m_OpSize[0x4C] = function (addr) { me.ExecuteJMP(addr); return 3; };
	m_OpSize[0x6C] = function (addr) { me.ExecuteJMP(addr); return 5; };

	// JSR
	m_OpSize[0x20] = function (addr) { me.ExecuteJSR(addr); return 6; };

	// LDA
	m_OpSize[0xA9] = function (addr) { me.ExecuteLDA(addr); return 2; };
	m_OpSize[0xA5] = function (addr) { me.ExecuteLDA(addr); return 3; };
	m_OpSize[0xB5] = function (addr) { me.ExecuteLDA(addr); return 4; };
	m_OpSize[0xAD] = function (addr) { me.ExecuteLDA(addr); return 4; };
	m_OpSize[0xBD] = function (addr) { me.ExecuteLDA(addr); return 4; };
	m_OpSize[0xB9] = function (addr) { me.ExecuteLDA(addr); return 4; };
	m_OpSize[0xA1] = function (addr) { me.ExecuteLDA(addr); return 6; };
	m_OpSize[0xB1] = function (addr) { me.ExecuteLDA(addr); return 5; };

	// LDX
	m_OpSize[0xA2] = function (addr) { me.ExecuteLDX(addr); return 2; };
	m_OpSize[0xA6] = function (addr) { me.ExecuteLDX(addr); return 3; };
	m_OpSize[0xB6] = function (addr) { me.ExecuteLDX(addr); return 4; };
	m_OpSize[0xAE] = function (addr) { me.ExecuteLDX(addr); return 4; };
	m_OpSize[0xBE] = function (addr) { me.ExecuteLDX(addr); return 4; };

	// LDY
	m_OpSize[0xA0] = function (addr) { me.ExecuteLDY(addr); return 2; };
	m_OpSize[0xA4] = function (addr) { me.ExecuteLDY(addr); return 3; };
	m_OpSize[0xB4] = function (addr) { me.ExecuteLDY(addr); return 4; };
	m_OpSize[0xAC] = function (addr) { me.ExecuteLDY(addr); return 4; };
	m_OpSize[0xBC] = function (addr) { me.ExecuteLDY(addr); return 4; };

	// LSR
	m_OpSize[0x4A] = function (addr) { me.ExecuteLSR(addr); return 2; };
	m_OpSize[0x46] = function (addr) { me.ExecuteLSR(addr); return 5; };
	m_OpSize[0x56] = function (addr) { me.ExecuteLSR(addr); return 6; };
	m_OpSize[0x4E] = function (addr) { me.ExecuteLSR(addr); return 6; };
	m_OpSize[0x5E] = function (addr) { me.ExecuteLSR(addr); return 7; };

	// NOP
	m_OpSize[0xEA] = function (addr) { me.ExecuteNOP(addr); return 2; };

	// ORA
	m_OpSize[0x09] = function (addr) { me.ExecuteORA(addr); return 2; };
	m_OpSize[0x05] = function (addr) { me.ExecuteORA(addr); return 3; };
	m_OpSize[0x15] = function (addr) { me.ExecuteORA(addr); return 4; };
	m_OpSize[0x0D] = function (addr) { me.ExecuteORA(addr); return 4; };
	m_OpSize[0x1D] = function (addr) { me.ExecuteORA(addr); return 4; };
	m_OpSize[0x19] = function (addr) { me.ExecuteORA(addr); return 4; };
	m_OpSize[0x01] = function (addr) { me.ExecuteORA(addr); return 6; };
	m_OpSize[0x11] = function (addr) { me.ExecuteORA(addr); return 5; };

	// PHA
	m_OpSize[0x48] = function (addr) { me.ExecutePHA(addr); return 3; };

	// PHP
	m_OpSize[0x08] = function (addr) { me.ExecutePHP(addr); return 3; };

	// PLA
	m_OpSize[0x68] = function (addr) { me.ExecutePLA(addr); return 4; };

	// PLP
	m_OpSize[0x28] = function (addr) { me.ExecutePLP(addr); return 4; };

	// ROL
	m_OpSize[0x2A] = function (addr) { me.ExecuteROL(addr); return 2; };
	m_OpSize[0x26] = function (addr) { me.ExecuteROL(addr); return 5; };
	m_OpSize[0x36] = function (addr) { me.ExecuteROL(addr); return 6; };
	m_OpSize[0x2E] = function (addr) { me.ExecuteROL(addr); return 6; };
	m_OpSize[0x3E] = function (addr) { me.ExecuteROL(addr); return 7; };

	// ROR
	m_OpSize[0x6A] = function (addr) { me.ExecuteROR(addr); return 2; };
	m_OpSize[0x66] = function (addr) { me.ExecuteROR(addr); return 5; };
	m_OpSize[0x76] = function (addr) { me.ExecuteROR(addr); return 6; };
	m_OpSize[0x6E] = function (addr) { me.ExecuteROR(addr); return 6; };
	m_OpSize[0x7E] = function (addr) { me.ExecuteROR(addr); return 7; };

	// RTI
	m_OpSize[0x40] = function (addr) { me.ExecuteRTI(addr); return 6; };

	// RTS
	m_OpSize[0x60] = function (addr) { me.ExecutePTS(addr); return 6; };

	// SBC
	m_OpSize[0xE9] = function (addr) { me.ExecuteSBC(addr); return 2; };
	m_OpSize[0xE5] = function (addr) { me.ExecuteSBC(addr); return 3; };
	m_OpSize[0xF5] = function (addr) { me.ExecuteSBC(addr); return 4; };
	m_OpSize[0xED] = function (addr) { me.ExecuteSBC(addr); return 4; };
	m_OpSize[0xFD] = function (addr) { me.ExecuteSBC(addr); return 4; };
	m_OpSize[0xF9] = function (addr) { me.ExecuteSBC(addr); return 4; };
	m_OpSize[0xE1] = function (addr) { me.ExecuteSBC(addr); return 6; };
	m_OpSize[0xE1] = function (addr) { me.ExecuteSBC(addr); return 5; };

	// SEC
	m_OpSize[0x38] = function (addr) { me.ExecuteSEC(addr); return 2; };

	// SED
	m_OpSize[0xF8] = function (addr) { me.ExecuteSED(addr); return 2; };

	// SEI
	m_OpSize[0x78] = function (addr) { me.ExecuteSEI(addr); return 2; };

	// STA
	m_OpSize[0x85] = function (addr) { me.ExecuteSTA(addr); return 3; };
	m_OpSize[0x95] = function (addr) { me.ExecuteSTA(addr); return 4; };
	m_OpSize[0x8D] = function (addr) { me.ExecuteSTA(addr); return 4; };
	m_OpSize[0x9D] = function (addr) { me.ExecuteSTA(addr); return 5; };
	m_OpSize[0x99] = function (addr) { me.ExecuteSTA(addr); return 5; };
	m_OpSize[0x81] = function (addr) { me.ExecuteSTA(addr); return 6; };
	m_OpSize[0x91] = function (addr) { me.ExecuteSTA(addr); return 6; };

	// STX
	m_OpSize[0x86] = function (addr) { me.ExecuteSTX(addr); return 3; };
	m_OpSize[0x96] = function (addr) { me.ExecuteSTX(addr); return 4; };
	m_OpSize[0x8E] = function (addr) { me.ExecuteSTX(addr); return 4; };

	// STY
	m_OpSize[0x84] = function (addr) { me.ExecuteSTY(addr); return 3; };
	m_OpSize[0x94] = function (addr) { me.ExecuteSTY(addr); return 4; };
	m_OpSize[0x8C] = function (addr) { me.ExecuteSTY(addr); return 4; };

	// TAX
	m_OpSize[0xAA] = function (addr) { me.ExecuteTAX(addr); return 2; };

	// TAY
	m_OpSize[0xA8] = function (addr) { me.ExecuteTAY(addr); return 2; };

	// TSX
	m_OpSize[0xBA] = function (addr) { me.ExecuteTSX(addr); return 2; };

	// TXA
	m_OpSize[0x8A] = function (addr) { me.ExecuteTXA(addr); return 2; };

	// TXS
	m_OpSize[0x9a] = function (addr) { me.ExecuteTXS(addr); return 2; };

	// TYA
	m_OpSize[0x98] = function (addr) { me.ExecuteTYA(addr); return 2; };













	// ADC
	m_OpTable[0x69] = function (addr) { me.ExecuteADC(addr); return 2; };
	m_OpTable[0x65] = function (addr) { me.ExecuteADC(addr); return 3; };
	m_OpTable[0x75] = function (addr) { me.ExecuteADC(addr); return 4; };
	m_OpTable[0x6D] = function (addr) { me.ExecuteADC(addr); return 4; };
	m_OpTable[0x7D] = function (addr) { me.ExecuteADC(addr); return 4; };
	m_OpTable[0x79] = function (addr) { me.ExecuteADC(addr); return 4; };
	m_OpTable[0x61] = function (addr) { me.ExecuteADC(addr); return 6; };
	m_OpTable[0x71] = function (addr) { me.ExecuteADC(addr); return 5; };

	// AND
	m_OpTable[0x29] = function (addr) { me.ExecuteAND(addr); return 2; };
	m_OpTable[0x25] = function (addr) { me.ExecuteAND(addr); return 3; };
	m_OpTable[0x35] = function (addr) { me.ExecuteAND(addr); return 4; };
	m_OpTable[0x2D] = function (addr) { me.ExecuteAND(addr); return 4; };
	m_OpTable[0x3D] = function (addr) { me.ExecuteAND(addr); return 4; };
	m_OpTable[0x39] = function (addr) { me.ExecuteAND(addr); return 4; };
	m_OpTable[0x21] = function (addr) { me.ExecuteAND(addr); return 6; };
	m_OpTable[0x31] = function (addr) { me.ExecuteAND(addr); return 5; };

	// ASL
	m_OpTable[0x0A] = function (addr) { me.ExecuteASL(addr); return 2; };
	m_OpTable[0x06] = function (addr) { me.ExecuteASL(addr); return 5; };
	m_OpTable[0x16] = function (addr) { me.ExecuteASL(addr); return 6; };
	m_OpTable[0x0E] = function (addr) { me.ExecuteASL(addr); return 6; };
	m_OpTable[0x1E] = function (addr) { me.ExecuteASL(addr); return 7; };
	
	// BCC
	m_OpTable[0x90] = function (addr) { me.ExecuteBCC(addr); return 2; };

	// BCS
	m_OpTable[0xB0] = function (addr) { me.ExecuteBCS(addr); return 2; };

	// BEQ
	m_OpTable[0xF0] = function (addr) { me.ExecuteBEQ(addr); return 2; };

	// BIT
	m_OpTable[0x24] = function (addr) { me.ExecuteBIT(addr); return 3; };
	m_OpTable[0x2C] = function (addr) { me.ExecuteBIT(addr); return 4; };

	// BMI
	m_OpTable[0x30] = function (addr) { me.ExecuteBMI(addr); return 2; };

	// BNE
	m_OpTable[0xD0] = function (addr) { me.ExecuteBNE(addr); return 2; };

	// BPL
	m_OpTable[0x10] = function (addr) { me.ExecuteBPL(addr); return 2; };

	// BRK
	m_OpTable[0x00] = function (addr) { me.ExecuteBRK(addr); return 7; };

	// BVC
	m_OpTable[0x50] = function (addr) { me.ExecuteBVC(addr); return 2; };

	// BVS
	m_OpTable[0x70] = function (addr) { me.ExecuteBVS(addr); return 2; };

	// CLC
	m_OpTable[0x18] = function (addr) { me.ExecuteCLC(addr); return 2; };

	// CLD
	m_OpTable[0xD8] = function (addr) { me.ExecuteCLD(addr); return 2; };

	// CLI
	m_OpTable[0x58] = function (addr) { me.ExecuteCLI(addr); return 2; };

	// CLV
	m_OpTable[0xB8] = function (addr) { me.ExecuteCLV(addr); return 2; };

	// CMP
	m_OpTable[0xC9] = function (addr) { me.ExecuteCMP(addr); return 2; };
	m_OpTable[0xC5] = function (addr) { me.ExecuteCMP(addr); return 3; };
	m_OpTable[0xD5] = function (addr) { me.ExecuteCMP(addr); return 4; };
	m_OpTable[0xCD] = function (addr) { me.ExecuteCMP(addr); return 4; };
	m_OpTable[0xDD] = function (addr) { me.ExecuteCMP(addr); return 4; };
	m_OpTable[0xD9] = function (addr) { me.ExecuteCMP(addr); return 4; };
	m_OpTable[0xC1] = function (addr) { me.ExecuteCMP(addr); return 6; };
	m_OpTable[0xD1] = function (addr) { me.ExecuteCMP(addr); return 5; };

	// CPX
	m_OpTable[0xE0] = function (addr) { me.ExecuteCPX(addr); return 2; };
	m_OpTable[0xE4] = function (addr) { me.ExecuteCPX(addr); return 3; };
	m_OpTable[0xEC] = function (addr) { me.ExecuteCPX(addr); return 4; };

	// CPY
	m_OpTable[0xC0] = function (addr) { me.ExecuteCPY(addr); return 2; };
	m_OpTable[0xC4] = function (addr) { me.ExecuteCPY(addr); return 3; };
	m_OpTable[0xCC] = function (addr) { me.ExecuteCPY(addr); return 4; };

	// DEC
	m_OpTable[0xC6] = function (addr) { me.ExecuteDEC(addr); return 5; };
	m_OpTable[0xD6] = function (addr) { me.ExecuteDEC(addr); return 6; };
	m_OpTable[0xCE] = function (addr) { me.ExecuteDEC(addr); return 6; };
	m_OpTable[0xDE] = function (addr) { me.ExecuteDEC(addr); return 7; };

	// DEX
	m_OpTable[0xCA] = function (addr) { me.ExecuteDEX(addr); return 2; };

	// DEY
	m_OpTable[0x88] = function (addr) { me.ExecuteDEY(addr); return 2; };

	// EOR
	m_OpTable[0x49] = function (addr) { me.ExecuteEOR(addr); return 2; };
	m_OpTable[0x45] = function (addr) { me.ExecuteEOR(addr); return 3; };
	m_OpTable[0x55] = function (addr) { me.ExecuteEOR(addr); return 4; };
	m_OpTable[0x4D] = function (addr) { me.ExecuteEOR(addr); return 4; };
	m_OpTable[0x5D] = function (addr) { me.ExecuteEOR(addr); return 4; };
	m_OpTable[0x59] = function (addr) { me.ExecuteEOR(addr); return 4; };
	m_OpTable[0x41] = function (addr) { me.ExecuteEOR(addr); return 6; };
	m_OpTable[0x51] = function (addr) { me.ExecuteEOR(addr); return 5; };

	// INC
	m_OpTable[0xE6] = function (addr) { me.ExecuteINC(addr); return 5; };
	m_OpTable[0xF6] = function (addr) { me.ExecuteINC(addr); return 6; };
	m_OpTable[0xEE] = function (addr) { me.ExecuteINC(addr); return 6; };
	m_OpTable[0xFE] = function (addr) { me.ExecuteINC(addr); return 7; };

	// INX
	m_OpTable[0xE8] = function (addr) { me.ExecuteINX(addr); return 2; };

	// INY
	m_OpTable[0xC8] = function (addr) { me.ExecuteINY(addr); return 2; };

	// JMP
	m_OpTable[0x4C] = function (addr) { me.ExecuteJMP(addr); return 3; };
	m_OpTable[0x6C] = function (addr) { me.ExecuteJMP(addr); return 5; };

	// JSR
	m_OpTable[0x20] = function (addr) { me.ExecuteJSR(addr); return 6; };

	// LDA
	m_OpTable[0xA9] = function (addr) { me.ExecuteLDA(addr); return 2; };
	m_OpTable[0xA5] = function (addr) { me.ExecuteLDA(addr); return 3; };
	m_OpTable[0xB5] = function (addr) { me.ExecuteLDA(addr); return 4; };
	m_OpTable[0xAD] = function (addr) { me.ExecuteLDA(addr); return 4; };
	m_OpTable[0xBD] = function (addr) { me.ExecuteLDA(addr); return 4; };
	m_OpTable[0xB9] = function (addr) { me.ExecuteLDA(addr); return 4; };
	m_OpTable[0xA1] = function (addr) { me.ExecuteLDA(addr); return 6; };
	m_OpTable[0xB1] = function (addr) { me.ExecuteLDA(addr); return 5; };

	// LDX
	m_OpTable[0xA2] = function (addr) { me.ExecuteLDX(addr); return 2; };
	m_OpTable[0xA6] = function (addr) { me.ExecuteLDX(addr); return 3; };
	m_OpTable[0xB6] = function (addr) { me.ExecuteLDX(addr); return 4; };
	m_OpTable[0xAE] = function (addr) { me.ExecuteLDX(addr); return 4; };
	m_OpTable[0xBE] = function (addr) { me.ExecuteLDX(addr); return 4; };

	// LDY
	m_OpTable[0xA0] = function (addr) { me.ExecuteLDY(addr); return 2; };
	m_OpTable[0xA4] = function (addr) { me.ExecuteLDY(addr); return 3; };
	m_OpTable[0xB4] = function (addr) { me.ExecuteLDY(addr); return 4; };
	m_OpTable[0xAC] = function (addr) { me.ExecuteLDY(addr); return 4; };
	m_OpTable[0xBC] = function (addr) { me.ExecuteLDY(addr); return 4; };

	// LSR
	m_OpTable[0x4A] = function (addr) { me.ExecuteLSR(addr); return 2; };
	m_OpTable[0x46] = function (addr) { me.ExecuteLSR(addr); return 5; };
	m_OpTable[0x56] = function (addr) { me.ExecuteLSR(addr); return 6; };
	m_OpTable[0x4E] = function (addr) { me.ExecuteLSR(addr); return 6; };
	m_OpTable[0x5E] = function (addr) { me.ExecuteLSR(addr); return 7; };

	// NOP
	m_OpTable[0xEA] = function (addr) { me.ExecuteNOP(addr); return 2; };

	// ORA
	m_OpTable[0x09] = function (addr) { me.ExecuteORA(addr); return 2; };
	m_OpTable[0x05] = function (addr) { me.ExecuteORA(addr); return 3; };
	m_OpTable[0x15] = function (addr) { me.ExecuteORA(addr); return 4; };
	m_OpTable[0x0D] = function (addr) { me.ExecuteORA(addr); return 4; };
	m_OpTable[0x1D] = function (addr) { me.ExecuteORA(addr); return 4; };
	m_OpTable[0x19] = function (addr) { me.ExecuteORA(addr); return 4; };
	m_OpTable[0x01] = function (addr) { me.ExecuteORA(addr); return 6; };
	m_OpTable[0x11] = function (addr) { me.ExecuteORA(addr); return 5; };

	// PHA
	m_OpTable[0x48] = function (addr) { me.ExecutePHA(addr); return 3; };

	// PHP
	m_OpTable[0x08] = function (addr) { me.ExecutePHP(addr); return 3; };

	// PLA
	m_OpTable[0x68] = function (addr) { me.ExecutePLA(addr); return 4; };

	// PLP
	m_OpTable[0x28] = function (addr) { me.ExecutePLP(addr); return 4; };

	// ROL
	m_OpTable[0x2A] = function (addr) { me.ExecuteROL(addr); return 2; };
	m_OpTable[0x26] = function (addr) { me.ExecuteROL(addr); return 5; };
	m_OpTable[0x36] = function (addr) { me.ExecuteROL(addr); return 6; };
	m_OpTable[0x2E] = function (addr) { me.ExecuteROL(addr); return 6; };
	m_OpTable[0x3E] = function (addr) { me.ExecuteROL(addr); return 7; };

	// ROR
	m_OpTable[0x6A] = function (addr) { me.ExecuteROR(addr); return 2; };
	m_OpTable[0x66] = function (addr) { me.ExecuteROR(addr); return 5; };
	m_OpTable[0x76] = function (addr) { me.ExecuteROR(addr); return 6; };
	m_OpTable[0x6E] = function (addr) { me.ExecuteROR(addr); return 6; };
	m_OpTable[0x7E] = function (addr) { me.ExecuteROR(addr); return 7; };

	// RTI
	m_OpTable[0x40] = function (addr) { me.ExecuteRTI(addr); return 6; };

	// RTS
	m_OpTable[0x60] = function (addr) { me.ExecutePTS(addr); return 6; };

	// SBC
	m_OpTable[0xE9] = function (addr) { me.ExecuteSBC(addr); return 2; };
	m_OpTable[0xE5] = function (addr) { me.ExecuteSBC(addr); return 3; };
	m_OpTable[0xF5] = function (addr) { me.ExecuteSBC(addr); return 4; };
	m_OpTable[0xED] = function (addr) { me.ExecuteSBC(addr); return 4; };
	m_OpTable[0xFD] = function (addr) { me.ExecuteSBC(addr); return 4; };
	m_OpTable[0xF9] = function (addr) { me.ExecuteSBC(addr); return 4; };
	m_OpTable[0xE1] = function (addr) { me.ExecuteSBC(addr); return 6; };
	m_OpTable[0xE1] = function (addr) { me.ExecuteSBC(addr); return 5; };

	// SEC
	m_OpTable[0x38] = function (addr) { me.ExecuteSEC(addr); return 2; };

	// SED
	m_OpTable[0xF8] = function (addr) { me.ExecuteSED(addr); return 2; };

	// SEI
	m_OpTable[0x78] = function (addr) { me.ExecuteSEI(addr); return 2; };

	// STA
	m_OpTable[0x85] = function (addr) { me.ExecuteSTA(addr); return 3; };
	m_OpTable[0x95] = function (addr) { me.ExecuteSTA(addr); return 4; };
	m_OpTable[0x8D] = function (addr) { me.ExecuteSTA(addr); return 4; };
	m_OpTable[0x9D] = function (addr) { me.ExecuteSTA(addr); return 5; };
	m_OpTable[0x99] = function (addr) { me.ExecuteSTA(addr); return 5; };
	m_OpTable[0x81] = function (addr) { me.ExecuteSTA(addr); return 6; };
	m_OpTable[0x91] = function (addr) { me.ExecuteSTA(addr); return 6; };

	// STX
	m_OpTable[0x86] = function (addr) { me.ExecuteSTX(addr); return 3; };
	m_OpTable[0x96] = function (addr) { me.ExecuteSTX(addr); return 4; };
	m_OpTable[0x8E] = function (addr) { me.ExecuteSTX(addr); return 4; };

	// STY
	m_OpTable[0x84] = function (addr) { me.ExecuteSTY(addr); return 3; };
	m_OpTable[0x94] = function (addr) { me.ExecuteSTY(addr); return 4; };
	m_OpTable[0x8C] = function (addr) { me.ExecuteSTY(addr); return 4; };

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
		setBreakCommand();
		// TODO: Push values onto stack
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
		// TODO: Push PC-1 onto stack
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
	}

	this.ExecuteNOP = function () {
		// TODO:
	}

	this.ExecuteORA = function (addr) {
		var value = m_Memory.Get(addr);
		a = a | value;
		if(a === 0) { setZeroFlag(); }
		if(a & 128) { setNegativeFlag(); }
	}

	this.ExecutePHA = function () {
		// TODO: Push copy of Accumulator onto Stack
	}

	this.ExecutePHP = function () {
		// TODO: Push status flags onto Stack
	}

	this.ExecutePLA = function () {
		// TODO: Pull value from stack and put into A
	}

	this.ExecutePLP = function () {
		// TODO: Pull value from stack and put into Status
	}

	this.ExecuteROL = function () {
		// TODO:
	}

	this.ExecuteROR = function () {
		// TODO:
	}

	this.ExecuteRTI = function () {
		// TODO:
	}

	this.ExecuteRTS = function () {
		// TODO:
	}

	this.ExecuteSBC = function () {
		// TODO:
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
		if(m_OpTable[opcode] == null || m_OpTable[opcode] === undefined) {
			console.error("Unknown Instruction: " + opcode + " " + addr + " ---- Stopping Execution");
			m_Running = false;
		}

		return cycleCount = m_OpTable[opcode](addr);
	}

	this.Init = function () {
		m_Memory.Init();
		pc = 0;
		sp = 0;
		a = 0;
		x = 0;
		y = 0;
		p = 0;
	}

	this.Reset = function () {

	}

	this.Run = function () {
		m_Running = true;
	}

	this.IsRunning = function () {
		return m_Running;
	}
// ----------------------------------------------------------------
};

module.exports = function (nes) {
	return new CPU(nes);
};