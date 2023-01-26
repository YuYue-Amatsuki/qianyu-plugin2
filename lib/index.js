import config from "./config.js"
import Runtime from "../../../lib/plugins/runtime.js"
import { FileMage, sys, YamlReader } from '../utils/index.js'
import chalk from 'chalk'
const runtime = new Runtime()
const filemage = new FileMage()
class init {
    constructor() {
        this.priority = [] //任务队列
        this.task = [] //定时任务
        this.pack = [] //错误的包
        this.apps = [] //插件功能列表
        this.isadd = false //是否正在安装依赖
        this.watch = {};
        this.noapps = []//不响应列表
    }

    async loader() {
        if (this.CheckBlack) {
            this.DelPlugin()
        }
        await this.GetPlugin()
        this.wirteApp()
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
                    this.apps.push({ filename: j.replace(".js", ""), name: app.name })
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
            logger.mark(`请在千羽插件目录下执行安装依赖命令：${logger.red('cnpm i ' + pack)}`)
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
        if (e.isGroup && e.msg) {
            let groupcofig = runtime.cfg.getGroup(e.group_id)
            if (groupcofig.onlyReplyAt) {
                let isat;
                let msg = '';
                e.message.forEach(item => {
                    if (item.type == 'text') {
                        msg += item.text
                    }
                })
                if (groupcofig.botAlias) {
                    for (let n of groupcofig.botAlias) {
                        if (msg.startsWith(n)) {
                            isat = true
                            break;
                        }
                    }
                }
                if (e.atme) {
                    isat = true
                }
                if (!isat) {
                    return
                }

            }
        }
        for (let p of this.priority) {
            if (p.event !== 'message') {
                eventlist.push(p)
                continue;
            }
            if (this.noapps.includes(p.id)) {
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
        await this.OpenApps(e)
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
            let notice = {
                recall: '群撤回',
                ban: '群禁言',
                increase: '群员新增',
                decrease: '群员减少',
                poke: '群戳一戳'
            }
            for (let event of eventlist) {
                if (event.event === `${e.post_type}.${e[eventMap[e.post_type][1]]}`) {
                    event.fuc[0].fuc(e)
                    logger.mark(chalk.rgb(0, 255, 0)('[千羽插件提示]'), chalk.rgb(255, 192, 119)(`[${event.name}]`), chalk.rgb(255, 255, 0)(`[${event.id}]`), chalk.rgb(128, 255, 0)(`执行了${chalk.rgb(204, 255, 204)(notice[e.sub_type])}的事件`));
                }
            }
        }
    }


    async addPack(e) {
        if (e.msg == '#安装千羽依赖') {
            if (!e.isMaster) {
                return e.reply(`暂无权限！`)
            }
            if (this.isadd) {
                return e.reply(`正在安装中，请勿重复安装!`)
            }
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
                this.isadd = true
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
                this.isadd = false
            })

        }
    }

    async wirteApp() {
        let appcofig = new YamlReader(config.qianyuPath + 'config/apps.yaml')
        let data = appcofig.jsonData || []
        if (data.length == 0) {
            this.apps.forEach(a => {
                if (a.filename != 'help' && a.filename != 'update') {
                    data.push({ filename: a.filename, name: a.name, isopen: false })
                }
            })
            appcofig.setData(data)
            for (let a of data) {
                if (a.filename != 'help' && a.filename != 'update') {
                    this.noapps.push(a.filename)
                }
            }
        } else {
            let ishas = []
            data.forEach(item => {
                ishas.push(item.filename)
            })
            this.apps.forEach(a => {
                if (a.filename != 'help' && !ishas.includes(a.filename) && a.filename != 'update') {
                    data.push({ filename: a.filename, name: a.name, isopen: false })
                }
            })
            for (let d of data) {
                if (!d.isopen) {
                    this.noapps.push(d.filename)
                }
            }
            appcofig.setData(data)
        }

    }


    async OpenApps(e) {
        let reg = '^#响应|^#关闭'
        if (new RegExp(reg).test(e.msg)) {
            if (!e.isMaster) {
                return e.reply("暂无权限！")
            }
            let cofigyaml = new YamlReader(config.qianyuPath + 'config/apps.yaml')
            let data = cofigyaml.jsonData
            if (e.msg.includes("#响应")) {
                let app = e.msg.replace("#响应", '')
                for (let d in data) {
                    if (app == data[d].name) {
                        this.noapps = this.noapps.filter(item => item != data[d].filename)
                        data[d].isopen = true
                        cofigyaml.setData(data)
                        e.reply(`已开启${data[d].name}功能！`)
                    }
                }
            } else {
                let app = e.msg.replace("#关闭", '')
                for (let d in data) {
                    if (app == data[d].name) {
                        this.noapps.push(data[d].filename)
                        data[d].isopen = false
                        cofigyaml.setData(data)
                        e.reply(`已关闭${data[d].name}功能！`)
                    }
                }
            }

        }
    }

    async watchConfig() {

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
        redis.set('qianyu:isblack', 1)
    }
}

export default new init()


// let groupcofig = runtime.cfg.getGroup(644134535)
// if (groupcofig.onlyReplyAt) {
//     let isat;
//     if (groupcofig.botAlias) {
//         for (let n of groupcofig.botAlias) {
//             if (e.msg.startsWith(n)) {
//                 isat = true
//             }
//         }
//     }

// }
// console.log(groupcofig);