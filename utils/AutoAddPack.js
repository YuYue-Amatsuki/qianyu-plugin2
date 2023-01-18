import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { exec } = require('child_process')
import chalk from 'chalk'
async function AddPack(pack) {
    logger.mark(chalk.rgb(0, 255, 0)('使用pnpm安装------'))
    logger.mark(chalk.rgb(0, 255, 0)('正在检测是否安装pnpm！'))
    let pnpm = await checkPnpm()
    if (pnpm != 'pnpm') {
        logger.mark(chalk.rgb(0, 255, 0)('正在安装pnpm,请稍后！'))
        pnpm = await execsync(` npm install pnpm -g`)
    } else {
        logger.mark(chalk.rgb(0, 255, 0)('正在使用pnpm安装依赖！'))
        let pnpmin = await execsync(`pnpm add ${pack} -w`)
        if (!pnpmin.error) {
            logger.mark(chalk.rgb(0, 255, 0)(`pnpm安装依赖${pack}成功！`))
            return true
        } else {
            logger.mark(chalk.rgb(0, 255, 0)(`pnpm安装依赖${pack}失败！摆烂了！你自己手动装吧！`))
            return false
        }
    }
}

async function addAllPack() {
    logger.mark(chalk.rgb(0, 255, 0)('使用pnpm安装------'))
    logger.mark(chalk.rgb(0, 255, 0)('正在检测是否安装pnpm！'))
    let pnpm = await checkPnpm()
    if (pnpm != 'pnpm') {
        logger.mark(chalk.rgb(0, 255, 0)('正在安装pnpm,请稍后！'))
        pnpm = await execsync(` npm install pnpm -g`)
    } else {
        logger.mark(chalk.rgb(0, 255, 0)('正在使用pnpm安装依赖！'))
        let pnpmin = await execsync(`pnpm install -P`)
        if (!pnpmin.error) {
            logger.mark(chalk.rgb(0, 255, 0)(`pnpm安装依赖所有成功！`))
            return true
        } else {
            logger.mark(chalk.rgb(0, 255, 0)(`pnpm安装所有依赖失败！摆烂了！你自己手动装吧！`))
            return false
        }
    }
}

async function restart() {
    logger.mark(chalk.rgb(0, 255, 0)(`开始执行重启，请稍等...`))
    let npm = await checkPnpm()
    try {
        let cm = `${npm} start`
        if (process.argv[1].includes('pm2')) {
            cm = `${npm} run restart`
        }
        exec(cm, (error, stdout, stderr) => {
            if (error) {
                logger.error(`重启失败\n${error.stack}`)
            } else if (stdout) {
                logger.mark(chalk.rgb(0, 255, 0)('重启成功，运行已由前台转为后台'))
                logger.mark(chalk.rgb(0, 255, 0)(`查看日志请用命令：${npm} run log`))
                logger.mark(chalk.rgb(0, 255, 0)(`停止后台运行命令：${npm} stop`))
                process.exit()
            }
        })
    } catch (error) {
        logger.error(`重启失败\n${error.stack}`)
    }

    return true
}

async function checkPnpm() {
    let npm = 'npm'
    let ret = await execsync('pnpm -v')
    if (ret.stdout) npm = 'pnpm'
    return npm
}


async function execsync(cmd) {
    return new Promise((resolve, reject) => {
        exec(cmd, { windowsHide: true }, (error, stdout, stderr) => {
            resolve({ error, stdout, stderr })
        })
    })
}

// let ret = await execsync(`npm config get registry`)
// logger.mark(chalk.rgb(0, 255, 0)('检查npm镜像源是否为淘宝镜像源------'))
// if (!ret.stdout.includes('http://registry.npmmirror.com/')) {
//     logger.mark(chalk.rgb(0, 255, 0)('修改npm镜像源为淘宝镜像源'))
//     await execsync(`npm config set registry http://registry.npmmirror.com`)
// }
// let npm = await execsync(`npm install`)
// if (npm.error) {
//     logger.mark(chalk.rgb(0, 255, 0)('npm安装错误！开始使用cnpm安装！'))
// } else {
//     logger.mark(chalk.rgb(0, 255, 0)('npm安装依赖成功！'))
//     return true
// }
// let iscnpm = await execsync(`cnpm -v`)
// logger.mark(chalk.rgb(0, 255, 0)('正在检测是否安装cnpm！'))
// let cnpm;
// if (iscnpm.error) {
//     logger.mark(chalk.rgb(0, 255, 0)('正在安装cnpm,请稍后！'))
//     cnpm = await execsync(` npm install -g cnpm --registry=http://registry.npmmirror.com`)
//     if (cnpm.error) {
//         logger.mark(chalk.rgb(0, 255, 0)('安装cnpm失败！'))
//     }
// }
// let cret;
// if (!iscnpm.error) {
//     cret = await execsync(` cnpm install `)
//     if (!cret.error) {
//         logger.mark(chalk.rgb(0, 255, 0)('cnpm安装依赖成功！'))
//         return true
//     }
// }

// if (cret.error) {
//     logger.mark(chalk.rgb(0, 255, 0)('cnpm安装依赖失败！'))
// }

export default { AddPack, restart }