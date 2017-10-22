const md5File = require('md5-file')
const path = require('path')
const fs = require('fs')

function readDirectory(dir){
    return fs.readdirSync(dir)
}

function md5(file){
    return md5File.sync(file)
}

function main(){
    const dir = './wx-src/pages/resources/'
    const files = readDirectory(dir)
    files.filter((file)=>
        ['ball','ball-big'].indexOf(file.split('.')[0])>=0
    ).forEach((file)=>{
        const oldPath = path.join(dir, file)
        const hash = md5(oldPath).substr(0, 6)
        const fileParts = file.split('.')
        const newPath = path.join(dir, `${fileParts[0]}.${hash}.${fileParts[fileParts.length-1]}`)
        console.log('   \x1b[36mrename\x1b[0m : ', oldPath)
        console.log('   \x1b[36mto\x1b[0m     : ', newPath)
        console.log()
        fs.renameSync(oldPath, newPath)
    })
}

main()

