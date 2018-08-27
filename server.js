const fs = require('fs');

const Start = () => {
	const Server = require('./dist').default;
	Server('test', 'data');
};

function getFile(file, timeout) {
	const exists = fs.existsSync(file);
	if (exists) {
		Start();
	} else {
		const stopTimer = setInterval(function() {
			const fileExists = fs.existsSync(file);
			console.log('Checking for: ', file);
			console.log('Exists: ', fileExists);
			if (fileExists) {
				clearInterval(stopTimer);
				Start();
			}
		}, timeout);
	}
}
getFile('./dist', 1000);
