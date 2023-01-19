let apps = {
    id: 'help',
    name: '千羽帮助',
    desc: '千羽帮助',
    event: 'message',
    rule: []
}


apps.rule.push({
    reg: '^千羽2帮助$',
    desc: '千羽2帮助',
    fnc: 'help',
    fuc: help
})

async function help(e) {
    e.reply("你的笨比群主还没写帮助")
}

export default apps