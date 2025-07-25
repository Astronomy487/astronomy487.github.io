let fs = require('fs')
let path = require('path')
let dirs = ['noto sans', 'noto emoji', 'noto serif']
let css = ''
let fonts = []

for (let dir of dirs) {
	let files = fs.readdirSync(dir)
	for (let f of files) {
		if (f.endsWith('.ttf') || f.endsWith(".otf")) {
			let name = f.split('.')[0].split('-')[0]
			let src = `${dir}/${f}`
			css += `\t@font-face {\n\t\tfont-family: "${name}";\n\t\tsrc: url("fonts/noto/${src}");\n\t}\n`
			fonts.push(`"${name}"`)
		}
	}
}

fs.writeFileSync('loadnoto.css', css)
console.log(fonts.join(','))