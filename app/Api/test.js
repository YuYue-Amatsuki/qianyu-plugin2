import ApiMage from "../../component/ApiMage.js";
import { request } from '../../utils/index.js'
import { core } from 'oicq'
let apps = {
    id: 'test',
    name: '千羽音乐管理器',
    desc: '千羽音乐管理器',
    event: 'message',
    rule: []
}


apps.rule.push({
    reg: '^发个音乐$',
    desc: '图片接口',
    fnc: 'music',
    fuc: music
})


async function music(e) {
    let id = 1996929972
    // await request({ url: `http://music.163.com/api/song/detail/?id=${id}&ids=[${id}]`, headers: { responseType: "json" } }, (res => {
    //     rsp = res.data.songs[0]
    //     console.log();
    //     let data = {
    //         title: rsp.name,
    //         singer: rsp.artists[0].name,
    //         jumpUrl: "https://y.music.163.com/m/song/" + id,
    //         musicUrl: "http://music.163.com/song/media/outer/url?id=" + id,
    //         preview: rsp.album.picUrl,
    //     };
    // }))

    // if (e.isGroup) {
    //     return
    // }
    const body = {
        '1': 100495085,
        '2': 1,
        '3': 4,
        '5': {
            '1': 1,
            '2': '0.0.0',
            '3': 'com.netease.cloudmusic',
            '4': 'da6b069da1e2982db3e386233f68d76d'
        },
        '10': 1,
        '11': 256469453,
        '12': {
            '10': '想要变得可爱呢！！！',
            '11': 'HoneyWorks',
            '12': '[分享]就像这样改了',
            '13': 'https://vdse.bdstatic.com/192d9a98d782d9c74c96f09db9378d93.mp4',
            '14': 'http://p1.music.126.net/KKSGkw5ysUBLjwTY0FNmJg==/109951168045166620.jpg',
            '16': 'http://music.163.com/song/media/outer/url?id=1996929972'
        }
    }
    let data = {
        "app": "com.tencent.structmsg",
        "desc": "音乐",
        "view": "music",
        "ver": "0.0.0.1",
        "prompt": "[分享]可愛くてごめん",
        "meta": {
            "music": {
                "action": "",
                "android_pkg_name": "",
                "app_type": 1,
                "appid": 100495085,
                "ctime": 1674053717,
                "desc": "HoneyWorks",
                "jumpUrl": "https:\/\/y.music.163.com\/m\/song\/1996929972",
                "musicUrl": "http:\/\/music.163.com\/song\/media\/outer\/url?id=1996929972",
                "preview": "http:\/\/p2.music.126.net\/KKSGkw5ysUBLjwTY0FNmJg==\/109951168045166620.jpg",
                "sourceMsgId": "0",
                "source_icon": "https:\/\/i.gtimg.cn\/open\/app_icon\/00\/49\/50\/85\/100495085_100_m.png",
                "source_url": "",
                "tag": "网易云音乐",
                "title": "可愛くてごめん",
                "uin": 2548285036
            }
        },
        "config": {
            "ctime": 1674053717,
            "forward": true,
            "token": "21e5eeacb6af4e582606afe475e4789d",
            "type": "normal"
        }
    }

    let data2 = { "app": "com.tencent.structmsg", "desc": "新闻", "view": "messages", "ver": "0.0.0.1", "prompt": "[聊天记录]", "meta": { "messages": { "action": "", "android_pkg_name": "", "app_type": 1, "appid": 100446242, "ctime": 1673963424, "desc": "dhbf: [图片]\ndhbf: [图片]\n叶:太涩了，举办了！", "jumpUrl": "https:\/\/vdse.bdstatic.com\/192d9a98d782d9c74c96f09db9378d93.mp4", "preview": "", "source_icon": "", "source_url": "", "tag": "查看8条转发消息", "title": "群聊的聊天记录", "uin": 0 } }, "config": { "ctime": 1673964813, "forward": true, "token": "f01705ad86f98cf538ea50856a3d36df", "type": "normal" } }

    e.reply(await makeGroupMsg('测试', [data, data2], '测试', e))


    // await Bot.sendOidb("OidbSvc.0xb77_9", core.pb.encode(body));
    // e.friend.shareMusic('163', id)
}


async function makeGroupMsg(title, msg, end, e) {
    console.log(msg);
    console.log(e);
    let nickname = Bot.nickname
    if (e.isGroup) {
        let info = await Bot.getGroupMemberInfo(e.group_id, Bot.uin)
        nickname = info.card ?? info.nickname
    }
    let userInfo = {
        user_id: Bot.uin,
        nickname: '测试'
    }

    let forwardMsg = []
    if (title) {
        forwardMsg.push({
            ...userInfo,
            message: title
        })
    }
    msg.forEach(item => {
        forwardMsg.push({
            ...userInfo,
            message: item
        })
    });

    if (end) {
        forwardMsg.push({
            ...userInfo,
            message: end
        })
    }
    console.log(forwardMsg);
    /** 制作转发内容 */
    if (e.isGroup) {
        forwardMsg = await e.group.makeForwardMsg(forwardMsg)
    } else {
        forwardMsg = await e.friend.makeForwardMsg(forwardMsg)
    }

    /** 处理描述 */
    forwardMsg.data = forwardMsg.data
        .replace(/\n/g, '')
        .replace(/<title color="#777777" size="26">(.+?)<\/title>/g, '___')
        .replace(/___+/, `<title color="#777777" size="26">${title}</title>`)

    return forwardMsg
}

export default apps