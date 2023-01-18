import { createRequire } from 'module'
import { segment } from 'oicq';
import config from '../../lib/config.js';
import sharp from "sharp"

const require = createRequire(import.meta.url)
const fs = require('fs')

let filepath = config.qianyuPath + '/app/Bqb'

// async function getMetadata() {
//     try {
//         const metadata = await sharp(filepath + "/孤独.gif").png( );
//         console.log(metadata);
//     } catch (error) {
//         console.log(`An error occurred during processing: ${error}`);
//     }
// }
// await getMetadata()

let apps = {
    id: 'comimg',
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
    // console.log(await e.group.fs.dir());
    let msg = e.msg.replace("狂粉", "")
    await addTextOnImage(msg, -25, 45, () => {
        e.reply(segment.image(filepath + `/生成狂粉.png`))
    });


}


async function addTextOnImage(context, x, y, suc) {
    try {
        const width = 200;
        const height = 200;
        const text = context;

        const svgImage = `
      <svg width="${width}" height="${height}">
        <style>
        .title { fill: rgb(118, 12, 12);; font-size: 35px; font-weight: bold; transform: rotate(5);border:1px solid red;}
        </style>
        <text x="50%" y="50%" text-anchor="middle" class="title">${text}</text>
      </svg>
      `;
        const svgBuffer = Buffer.from(svgImage);
        const image = await sharp(filepath + "/狂粉.png")
            .composite([
                {
                    input: svgBuffer,
                    top: x,
                    left: y,
                },
            ])
            .toFile(filepath + `/生成狂粉.png`).then((res) => {
                suc()
            })
    } catch (error) {
        console.log(error);
    }
}


export default apps

