var fs = require('fs');

function ROM (nes) {
// ----------------------------------------------------------------	
	var me = this;
	var m_Console 	= nes;
	var m_ROM		= new Array();
	var m_Loaded 	= false;
// ----------------------------------------------------------------

// ----------------------------------------------------------------

// ----------------------------------------------------------------
	this.Get = function (addr) {
		return m_ROM[addr];
	}

	this.Init = function () {
		m_Loaded = false;
	}

	this.Reset = function () {

	}

	this.Load = function (file) {
		m_Loaded = false;
		
		fs.open(file, 'r', function(status, fd) {
			if(status) {
				console.error(status.message);
				return;
			}

			var buffer = new Buffer(64 * 1024);
			fs.read(fd, buffer, 0, 64 * 1024, 0, function(err, num) {
				console.log("ROM Loaded (" + parseInt(num / 1024) + "kB)");

				for(var idx = 0; idx < num; ++idx) {
					m_ROM[idx] = buffer[idx];
				}			
			});
		});
	}
// ----------------------------------------------------------------	
};

module.exports = function (nes) {
	return new ROM(nes);
}