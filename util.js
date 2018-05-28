module.exports.sumObjectsByKey = sumObjectsByKey
module.exports.get = get
const request = require('async-request')

const saveFile = (fileName, data) => { // duplicated func from pull data, got to clean this up and throw it in a util.js
	fs.writeFile(fileName, JSON.stringify(data,null), err => {
		if(err) {
			throw err
		}
	})
	console.log("printed to ", fileName)
}

function sumObjectsByKey(...objs) {
  return objs.reduce((a, b) => {
    for (let k in b) {
      if (b.hasOwnProperty(k))
        a[k] = (a[k] || 0) + b[k]
    }
    return a
  }, {})
}


async function get(url) {
  try {
    return await request(url)
  } catch (e) {
    throw e
  }
}