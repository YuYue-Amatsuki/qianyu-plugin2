import { segment } from 'oicq';
import config from '../../lib/config.js';
import { addTextOnImage } from '../../component/MakeImg.js'
let filepath = config.qianyuPath + '/resources/img/'
let apps = {
    id: 'makeimg',
    name: '千羽图片生成',
    desc: '千羽图片生成',
    event: 'message',
    rule: []
}


apps.rule.push({
    reg: '^狂粉',
    desc: '图片生成',
    fnc: 'imageGet',
    fuc: imageGet
})

async function imageGet(e) {
    let msg = e.msg.replace("狂粉", "")
    await addTextOnImage({ imgurl: filepath + "表情包模板/狂粉.png", resulturl: filepath + `生成表情包/生成狂粉.png`, context: msg, Twidth: 200, Theight: 200, Tcolor: 'rgb(118, 12, 12)', Tsize: 35, x: -25, y: 45 }, () => {
        e.reply(segment.image(filepath + `生成表情包/生成狂粉.png`))
    });
}




export default apps

