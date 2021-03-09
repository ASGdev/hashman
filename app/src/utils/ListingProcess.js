export const ProcessInput = (type, separator, position, data) => {
	console.log("***************")
	console.log(type)
	console.log(separator)
	console.log(position)
	console.log(data)
	console.log("***************")
	
	return new Promise((resolve, reject) => {
		const arr = data.split(/\r?\n/)
		console.log(arr)
		
		const processed = arr.map(item => {
			let itoarr = null
			let o = {}

			switch (separator){
				case 'comma':
					itoarr = item.split(",")
					break;
				case 'tab':
					itoarr = item.split("\t")
					break;
			}
			
			if(itoarr.length < 2){
				reject("Error processing content")
			} else {
				switch (position){
					case 'htf':
						return { p: itoarr[1], h: { type: "sha256", value: itoarr[0] } }
					case 'fth':
						return { p: itoarr[0], h: { type: "sha256", value: itoarr[1] } }
				}
			}
		})

		resolve(processed)
	})
};