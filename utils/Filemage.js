import config from "../lib/config.js"
import fs from 'fs'
export default class FileMage {
    constructor(path) {
        const dirpath = path || config.qianyuPath
        this.path = path ? `${process.cwd()}/${dirpath}` : dirpath
        if (!fs.existsSync(this.path)) {
            fs.mkdirSync(this.path)
        }
    }

    GetFileDataByJson(name) {
        let data;
        if (fs.existsSync(this.path + name)) {
            data = JSON.parse(fs.readFileSync(this.path + name, "utf-8"))
        }
        return data
    }

    WriteFile(name, data) {
        fs.writeFileSync(this.path + name, JSON.stringify(data))
    }

    DeleteFile(name) {
        fs.unlink(this.path + name, (err) => {
            if (err) {
                return false
            } else {
                return true
            }
        })
    }

    DeletePathAllFile(path) {
        let arr = fs.readdirSync(path);
        for (let i = 0; i < arr.length; i++) {
            let stat = fs.statSync(path + '/' + arr[i]);
            if (stat.isDirectory()) {
                del(path + '/' + arr[i]);
            } else {
                fs.unlinkSync(path + '/' + arr[i]);
            }
        }
        fs.rmdirSync(path);
    }

    RemoveFile(file, newfile) {
        fs.rename(file, newfile, err => {
            if (!err) {
                return true
            } else {
                return false
            }
        })
    }

    isExistsFile(path) {
        if (!fs.existsSync(path)) {
            return false
        } else {
            return true
        }

    }

    GetFileList(path) {
        return fs.readdirSync(this.path + path)
    }

}