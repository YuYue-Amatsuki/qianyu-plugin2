import ApiMage from "../../component/ApiMage.js";

let apps = {
    id: 'imgApi',
    name: '千羽图片管理器',
    desc: '千羽图片管理器',
    event: 'message',
    rule: []
}


apps.rule.push({
    reg: '^图片接口$',
    desc: '图片接口',
    fnc: 'imageApi',
    fuc: imageApi
})


async function imageApi(e) {
    console.log(this);
    await e.runtime.render('qianyu', `/html/api/api.html`, {
    },
        {
            beforeRender({ data }) {
                let resPath = data.pluResPath
                return {
                    ...data,
                    _res_path: resPath
                }
            }
        }
    )
}

export default apps