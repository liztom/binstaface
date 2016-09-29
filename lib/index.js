const fs = require('fs');
const http = require('http');
const path = require('path');
const zlib = require('zlib');
const url = require('url')

const mime = require('mime');
const chalk = require('chalk');

const localDir = path.join(__dirname);

http.createServer((req, res) => {
    const gzip = zlib.createGzip();
    const filePath = path.join(localDir, req.url);
    
    fs.readFile(filePath, function(error, data) {
	    if(error) {
	        console.error(chalk.magenta(error));
	        res.writeHead(404, {'Content-Type': 'text/plain'});
	        return;
	    }
		res.writeHead(200, {'Content-Type': mime.lookup(filePath)});
		res.end(data.toString());
	});
    
}).listen(1337, '127.0.0.1');

console.log(chalk.blue('Server running at:', chalk.green('http://127.0.0.1:1337/')));
