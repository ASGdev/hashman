const commandLineArgs = require('command-line-args')
const path = require('path')
const fs = require('fs')
const os = require('os')
const checksum = require('checksum')
const axios = require('axios')
const readdirp = require('readdirp')

const optionDefinitions = [
	{ name: 'file', alias:'f', defaultOption: true },
	{ name: 'hash', alias:'h', type: String },
	{ name: 'hash-alg', alias:'a', type: String },
	{ name: 'hint', type: String },
	{ name: 'description', alias:'d', type: String },
	{ name: 'location-name', alias:'l', type: String },
	{ name: 'endpoint', alias:'e', type: String },
	{ name: 'key', alias:'k', type: String },
	{ name: 'conf', alias:'c', type: String }
]
const options = commandLineArgs(optionDefinitions);

(async () => {
	let hmf = {}
	
	let fpath = options.file

	if(!path.isAbsolute(fpath)){
		fpath = path.resolve(fpath)
	}

	hmf.p = fpath
	hmf.n = path.basename(fpath)
	
	const isDir = fs.lstatSync(fpath).isDirectory();
	
	if(isDir){
		const entries = await readdirp.promise(fpath, { alwaysStat: true })
		
		console.log(entries.length)
		
		hmf.s = entries.length
		
		hmf.d = []
		for (const entry of entries) {		
			try {
				const hash = await computeHashPromise(entry.fullPath)

				hmf.d.push({
					h: { type: "sha256", value: hash },
					n: entry.basename,
					p: entry.path,
					s: Number(entry.stats.size),
					c: entry.stats.birthtime || entry.stats.mtime
				})
				
			} catch(e){
				console.log("Error getting file data for file " + entry.path)
				console.log(e)
			}
		}
	} else {
		if(!options.hash){
			const halg = (options['hash-alg']) || "sha256"

			console.log("Hash computation requested : " + halg)
		
			const sum = await computeHashPromise(fpath, halg)
		
			console.log(sum)
		
			hmf.h = []
		
			hmf.h.push({ type: halg, value: sum })
		} else {
			const hashType = (options.hash && options['hash-alg']) ? options['hash-alg'] : null
		
			hmf.h = []
		
			hmf.h.push({ type: hashType, value: options.hash })
		}
	
		const stat = fs.statSync(fpath)
	
		hmf.cd = stat.birthtime || stat.mtime
		hmf.s = stat.size
	}

	hmf.ln = options['location-name'] || os.hostname()

	hmf.de = options.description || null
	
	console.log(hmf)
	
	try {
		await send(hmf, isDir)
		
		console.log("Data sent.")
	} catch(e){
		console.log("Error sending data with message : " + e)
	}
	
	process.stdin.resume()
})();

async function send(data, isDir){
	return new Promise(async (resolve, reject) => {	
		let confEndpoint = null
		let confKey = null
		
		if(options.conf){
			try {
				const conf = JSON.parse(fs.readFileSync(options.conf, 'utf8'));
				
				confEndpoint = conf.endpoint || null
				confKey = conf.key || null
			} catch (e){
				if(!options.endpoint){
					reject("Error reading conf file. Please provide endpoint.")
				}
			}
		}
		
		try {
			const response = await axios({
				method: 'post',
				url: options.endpoint || confEndpoint + '/api/' + (isDir ? 'directory' : 'file'),
				headers: {
					'x-api-key': options.key || conf.key || null
				},
				data
			})
			
			switch (response.status) {
				case 200:
					resolve()
					break;
				case 401:
					reject("Unauthorized")
					break;
				default:
					reject("Error with status code : " + response.status)
			}
		} catch (e){
			if(e.response && e.response.status === 401){
				console.log("Failed to send data with error code 401. Have you tried to use provide authentication token using -k or --key ?")
			} else {
				reject(e)
			}
		}
	})
}

function computeHashPromise(file, algorithm){
	return new Promise((resolve, reject) => {
		checksum.file(file, { algorithm }, function response(err, sum) {
			if (err) {
				reject(err)
			} else {
				resolve(sum)
			}
		})
	})
}

process
  .on('unhandledRejection', (reason, p) => {
    console.error(reason, 'Unhandled Rejection at Promise', p);
  })
  .on('uncaughtException', err => {
    console.error(err, 'Uncaught Exception thrown');
    process.exit(1);
  });
