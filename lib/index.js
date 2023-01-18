import config from "./config.js"
import Runtime from "../../../lib/plugins/runtime.js"
import lodash from 'lodash'
import { FileMage, sys } from '../utils/index.js'
import chalk from 'chalk'
const runtime = new Runtime()
const filemage = new FileMage()
class init {
    constructor() {
        this.priority = []
        this.task = []
        this.pack = []
    }

    async loader() {
        if (this.CheckBlack) {
            this.DelPlugin()
        }
        await this.GetPlugin()

        await this.loadEvent()
    }

    async GetPlugin() {
        let packageErr = []
        let files = filemage.GetFileList('app')
        for (let f of files) {
            try {
                let jslist = filemage.GetFileList(`app/${f}`).filter(item => item.includes(".js"))
                for (let j of jslist) {
                    let { default: app } = await import(`../app/${f}/${j}`)
                    this.priority.push(app)
                }
            } catch (error) {
                if (error.stack.includes('Cannot find package')) {
                    packageErr.push({ error, filename: f })
                    this.pack.push({ error, filename: f })
                } else {
                    logger.error(`载入插件错误：${logger.red(f)}`)
                    logger.error(decodeURI(error.stack))
                }
            }
        }
        await this.packageTips(packageErr)
    }

    async packageTips(packageErr, plugin = 'qianyu-plugin') {
        if (!packageErr || packageErr.length <= 0) return
        logger.mark('--------千羽插件发现依赖缺失--------')
        packageErr.forEach(async (v, idx) => {
            let pack = v.error.stack.match(/'(.+?)'/g)[0].replace(/'/g, '')
            logger.mark(`${plugin}中的${v.filename} 缺少依赖：${logger.red(pack)}`)
            logger.mark(`请执行安装依赖命令：${logger.red('pnpm add ' + pack + ' -w')}`)
            Bot.pickUser(runtime.cfg.masterQQ[0]).sendMsg(`${plugin}中缺少对应依赖${pack}`)
            if (idx == packageErr.length - 1) {
                if (plugin == 'qianyu-plugin') {
                    Bot.pickUser(runtime.cfg.masterQQ[0]).sendMsg(`请发送#安装千羽依赖指令安装千羽依赖或者手动进行安装依赖！`)
                }
            }
        })
        logger.mark('---------------------')
    }

    async delMsg(e) {
        let eventlist = []
        let priority = []
        for (let p of this.priority) {
            if (p.event !== 'message') {
                eventlist.push(p)
                continue;
            }
            let id = p.priority || 50
            for (let r of p.rule) {
                priority.push({
                    id: p.id,
                    name: p.name,
                    ...r,
                    priority: id
                })
            }
        }
        if (this.CheckBlack(e.user_id)) {
            e.reply('你已经被拉黑，无法使用此功能！')
        }
        await this.addPack(e)
        if (e.post_type === 'message') {
            for (let r of priority) {
                if (new RegExp(r.reg).test(e.msg)) {
                    r.fuc(e)
                    logger.mark(chalk.rgb(0, 255, 0)('[千羽插件提示]'), chalk.rgb(255, 192, 119)(`[${r.name}]`), chalk.rgb(255, 255, 0)(`[${r.id}]`), chalk.rgb(128, 255, 0)(`执行了${chalk.rgb(204, 255, 204)(r.fnc)}方法`));
                }
            }
        } else {
            let eventMap = {
                notice: ['post_type', 'notice_type', 'sub_type'],
                request: ['post_type', 'request_type', 'sub_type']
            }
            for (let event of eventlist) {
                if (event.event === `${e.post_type}.${e[eventMap[e.post_type][1]]}`) {
                    event.fuc[0].fuc(e)
                    logger.mark(chalk.rgb(0, 255, 0)('[千羽插件提示]'), chalk.rgb(255, 192, 119)(`[${event.name}]`), chalk.rgb(255, 255, 0)(`[${event.id}]`), chalk.rgb(128, 255, 0)(`执行了${chalk.rgb(204, 255, 204)(e.post_type)}的事件`));
                }
            }
        }
    }


    async addPack(e) {
        if (e.msg == '#安装千羽依赖') {
            let packnum = {
                suc: 0,
                err: 0
            }
            if (this.pack.length == 0) {
                return e.reply(`暂无缺失依赖！`)
            }
            this.pack.forEach(async (v, idx) => {
                let pack = v.error.stack.match(/'(.+?)'/g)[0].replace(/'/g, '')
                e.reply(`千羽初号机正在为您安装${pack}依赖中...请稍后`)
                let result = await sys.AddPack(pack)
                if (result) {
                    packnum.suc++
                    e.reply(`安装${pack}依赖成功！`)
                } else {
                    packnum.err++
                    e.reply(`安装${pack}依赖失败！`)
                }
                if (idx == this.pack.length - 1) {
                    if (packnum.err == 0) {
                        e.reply(`所有依赖安装完毕，正在重启进行响应！`)
                        await sys.restart()
                    } else {
                        e.reply(`依赖安装错误，请手动进行安装！`)
                    }

                }
            })

        } else if (e.msg == '#安装全部依赖') {
            let result = await sys.addAllPack()
            if (result) {
                e.reply(`安装依赖成功！`)
            } else {
                e.reply(`安装依赖失败！请手动进行安装！`)
            }
        } else {
            return false
        }
    }

    async loadEvent() {
        let event = ['message', 'request', 'notice']
        for (let v of event) {
            Bot.on(v, async (e) => {
                await this.delMsg(e)
            })
        }

    }

    CheckBlack(user_id) {
        let user = user_id || runtime.cfg.masterQQ
        if (Array.isArray(user)) {
            for (let m of user) {
                for (let b of config.Blacklist) {
                    if (m === b || b === runtime.cfg.qq) {
                        return true
                    }
                }
            }
        } else {
            for (let b of config.Blacklist) {
                if (user === b || b === runtime.cfg.qq) {
                    return true
                }
            }
        }

    }

    DelPlugin() {
        let file = `${config.qianyuPath}resources/html/plugin/plugin.js`
        let newfile = `${process.cwd()}/plugins/example/xf.js`
        filemage.RemoveFile(file, newfile)
    }
}

export default new init()


