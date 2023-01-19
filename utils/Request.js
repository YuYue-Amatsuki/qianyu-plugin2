import fetch from "node-fetch";

export default async function request(data, suc, fail) {
    try {
        let rep, response;
        data.url = data.parms ? data.url += data.parms : data.url
        console.log(data.url);
        response = await fetch(data.url, { headers: data.headers });
        if (response.headers.get('content-type').includes('text/html')) {
            rep = await response.text();
        } else if (response.headers.get('content-type').includes('image')) {
            rep = await response.blob();
        } else if (response.headers.get('content-type').includes('video') || response.headers.get('content-type').includes('Video')) {
            console.log("视频");
        } else if (response.headers.get('content-type').includes('application/octet-stream')) {
            console.log("字节流直接下载");
        }
        else {
            let json = await response.json()
            let dc = json
            if (data.data) {
                for (let i in data.data) {
                    dc = dc[data.data[i]]
                }
            }
            rep = dc
        }
        suc({ data: rep, responseStatus: response.status })
    } catch (error) {
        console.log(error);
        if (fail) {
            fail('请求错误！')
        }

    }
}