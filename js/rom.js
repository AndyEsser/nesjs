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
	this.Get = function (addr, len) {
		// if(len == undefined || len === null) {
		// 	len = 1;
		// }
		
		// var tmp;
		// for(var idx = addr; idx < (addr + len); ++idx) {
		// 	//console.log(tmp)
		// 	console.log(idx);
		// 	tmp += m_ROM[idx];
		// }

		
		// return tmp;
		return m_ROM[addr];
	}

	this.Init = function () {
		m_Loaded = false;
	}

	this.Reset = function () {

	}

	this.Load = function (file, fn) {
		m_Loaded = false;
		fs.open(file, 'r', function(err, fd) {
			if(err) {
				fn(true, null);
			}

			var buffer = new Buffer(64 * 1024);
			fs.read(fd, buffer, 0, 64 * 1024, 0, function(err, num) {
				console.log("ROM Loaded (" + parseInt(num / 1024) + "kB)");

				for(var idx = 0; idx < num; ++idx) {
					m_ROM[idx] = buffer[idx];
				}

				m_Loaded = true;
				fn(false, null);
			});
		});
	}
// ----------------------------------------------------------------	
};

module.exports = function (nes) {
	return new ROM(nes);
}