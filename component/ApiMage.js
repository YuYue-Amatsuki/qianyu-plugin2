import { request, YamlReader } from '../utils/index.js'
import config from '../lib/config.js'

class ApiMage {
    get Videolist() {
        return new YamlReader(config.qianyuPath + 'resources/data/API/video.yaml').jsonData.videoapi
    }
    get Textlist() {
        return new YamlReader(config.qianyuPath + 'resources/data/API/text.yaml').jsonData.textapi
    }
    get Recordlist() {
        return new YamlReader(config.qianyuPath + 'resources/data/API/record.yaml').jsonData.recordapi
    }
    get Imglist() {
        return new YamlReader(config.qianyuPath + 'resources/data/API/image.yaml').jsonData.imagelist
    }

    async GetApiData(data, suc, faith) {
        await request(data, (res) => suc(res), err => faith(err))
    }



}

export default new ApiMage()
