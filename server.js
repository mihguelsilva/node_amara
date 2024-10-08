"use-strict";
let mime;
let dirname = process.cwd();
import http from "node:http";
import qs from "node:querystring";
import path from "node:path";
import fs from "node:fs";
try {
    mime = fs.readFileSync(path.join(dirname, '/types.json'));
    mime = JSON.parse(mime);
} catch(e) {
    console.error('Error mimeType File JSON Code: ', e.code);
    console.error('Error mimeType File JSON Message: ', e.message);
}
const server = http.createServer().listen(8080);
server.on('error', function(e) {
    console.error('Error Server Code: ', e.code);
    console.error('Error Server Message: ', e.message);
});
server.on('request', function(req, res) {
    if (req.url == "/") req.url = '/page/index.html';
    let basename = dirname + req.url,
	ext = path.extname(basename);
    fs.stat(basename, function(err, stats) {
	if (err) {
	    res.writeHead(404);
	    res.write('The page requested could not be found');
	    res.end();
	} else if (stats.isFile()) {
	    let type = mime[ext] || 'text/plain';
	    console.log(type);
	    res.setHeader('Content-type', type);
	    let file = fs.createReadStream(basename);
	    file.on('open', function() {
		res.statusCode = 200;
		file.pipe(res);
	    });
	    file.on('error', function(e) {
		console.error(e);
		res.statusCode = 403;
		res.write('File permission');
		res.end();
	    });
	} else {
	    res.writeHead(403);
	    res.write('Directory access is fobidden');
	    res.end();
	}
    });
});
