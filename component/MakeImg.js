import sharp from "sharp"
export async function addTextOnImage(data, suc) {
    try {
        const width = data.Twidth;
        const height = data.Theight;
        const text = data.context;

        const svgImage = `
      <svg width="${width}" height="${height}">
        <style>
        .title { fill:${data.Tcolor};font-size: ${data.Tsize}px; font-weight: bold; transform: rotate(5);}
        </style>
        <text x="50%" y="50%" text-anchor="middle" class="title">${text}</text>
      </svg>
      `;
        const svgBuffer = Buffer.from(svgImage);
        const image = await sharp(data.imgurl).composite([{ input: svgBuffer, top: data.x, left: data.y, },]).toFile(data.resulturl).then(() => {
            suc()
        })
    } catch (error) {
        console.log(error);
    }
}
