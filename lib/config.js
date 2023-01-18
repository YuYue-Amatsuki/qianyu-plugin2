//加载配置
// 1.功能配置
// 2.千羽设置
// 3.黑名单检测
import { YamlReader } from "../utils/index.js"

class Config {

    get qianyuPath() {
        return process.cwd() + '/plugins/qianyu/'
    }

    get qianyuVersion() {
        return '2.0.0'
    }

    get qianyuSet() {

    }

    get Blacklist() {
        return new YamlReader(this.qianyuPath + 'resources/data/black.yaml').jsonData
    }




}

export default new Config()
