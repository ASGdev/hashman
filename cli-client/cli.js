const commandLineArgs = require('command-line-args')
var shell = require('shelljs');
const path = require('path');
const fs = require('fs');

const optionDefinitions = [
	{ name: 'file', defaultOption: true },
	{ name: 'hash', alias:'h', type: String },
	{ name: 'hint', type: String }
]
const options = commandLineArgs(optionDefinitions)

let fpath = options.file

if(!path.isAbsolute(fpath)){
	fpath = path.resolve(fpath)
}

console.log("File path is " + fpath)

await getStats(fpath)

async function send(){
}

async function getStats(fpath){
	
	fs.stat(path, function(err, stats) {
		console.log(path);
		console.log();
		console.log(stats);
		console.log();
 
		console.log('size: ' + stats["size"]);
	});
}

process.exit(0)