const pjson = require('./package.json')
const date = new Date()
const month = date.getMonth() + 1
const day = date.getDay() + date.getHours() + date.getMinutes()

let version = pjson.version.split('.')
version[1] = parseInt(version[1]) === month ? parseInt(version[1]) : month
version[2] = parseInt(version[2]) === day ? parseInt(version[2]) : day
const command = `npm version ${version.join('.')} --allow-same-version`
const cmd = `${command} && cd ../app && ${command}`
if (cmd) {
  require('child_process').exec(cmd, (error, stdout, stderr) => {
    if (error) { console.warn(error) }
    console.log(stdout)
    process.exit()
  })
} else {
  process.exit()
}