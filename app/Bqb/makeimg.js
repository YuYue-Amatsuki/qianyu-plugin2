import { segment } from 'oicq';
import config from '../../lib/config.js';
import { addTextOnImage, addTextOnImageRote } from '../../component/MakeImg.js'
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

const faceData = {
    狂粉: { imgurl: filepath + "表情包模板/狂粉.png", resulturl: filepath + `生成表情包/生成狂粉.png`, Twidth: 200, Theight: 200, Tcolor: 'rgb(118, 12, 12)', Tsize: 35, x: -25, y: 45, rotate: 5 },
    举牌: { imgurl: filepath + "表情包模板/举牌.png", resulturl: filepath + `生成表情包/生成举牌.png`, Twidth: 1380, Theight: 1380, Tcolor: 'rgb(118, 12, 12)', Tsize: 150, x: -70, y: 520, rotate: 21 }
}


async function imageGet(e) {
    let fdata = {}
    for (let f in faceData) {
        if (e.msg.includes(f)) {
            fdata = faceData[f]
            fdata.context = e.msg.replace(f, "")
        }
    }
    if (!fdata) return
    await addTextOnImage(fdata, () => {
        e.reply(segment.image(fdata.resulturl))
    });
}
let fdata = faceData['举牌']
fdata.context = '测试'
await addTextOnImageRote(fdata, () => {
    // e.reply(segment.image(fdata.resulturl))
});


export default apps

