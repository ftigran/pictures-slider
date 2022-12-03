console.log(423);
const fs = require('fs');

const data = {};

const initialPath = './public/slides';
const stack = [initialPath];
// stack.pop();
// /[^/]+$/
while (stack.length) {
	console.log(stack.length);
	const path = stack.pop();
	console.log(path, stack.length);
	let shortPath = path === initialPath ? './' : path.replace(/public\//, '') + '/';
	fs.readdirSync(path).forEach((name) => {
		// console.log(fs.readdirSync('./public/'+name))
		// console.log(name.isBlockDevice)
		const isPicture = () => /\.(?:jpg|gif|png)/.test(name);

		const pathWithName = `${path}/${name}`;
		const isFolder = () => fs.lstatSync(pathWithName).isDirectory();
		console.log(name, fs.lstatSync(path + '/' + name).isDirectory());
		if (isFolder()) {
			stack.push(pathWithName);
		} else if (isPicture()) {
			if (!data[path]) {
				data[path] = [];
			}
			data[path].push(shortPath + name);
		}
	});
}
// console.log(data)
console.log(/^[^.]+$/.test('irine_meier_98341330_259039055216712_4563721877990660746_n.jpg'));
fs.writeFileSync('./src/data.json', JSON.stringify(data));
