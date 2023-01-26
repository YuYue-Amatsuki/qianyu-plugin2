import sharp from "sharp"
export async function addTextOnImage(data, suc) {
  try {
    const width = data.Twidth;
    const height = data.Theight;
    const text = data.context;

    const svgImage = `
      <svg width="${width}" height="${height}">
        <style>
        .title { fill:${data.Tcolor};font-size: ${data.Tsize}px; font-weight: bold; transform: rotate(rote);}
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


export async function addTextOnImageRote(data, suc) {
  try {
    const svgImage = `
    <svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
    <style>
    #text {
        white-space: break-spaces;
        word-wrap: break-word;
        color: red;
    }
</style>
<foreignObject width="120" height="250">
    <body>
        <p id="text">这是一段很长很长很长很长很长很长很长很长很长很长很长很长的文字</p>
    </body>
</foreignObject>
  </svg>
      `;
    const svgBuffer = Buffer.from(svgImage);
    console.log(svgBuffer);
    const image = await sharp(svgBuffer).toFile(data.resulturl).then(() => {
      suc()
    })
  } catch (error) {
    console.log(error);
  }
}



