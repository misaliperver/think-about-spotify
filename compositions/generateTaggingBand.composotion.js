import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const getRandomEffect = () => {
    const MAIN_FOLDER_SRC = './tmp/effects';

    const MAIN_FOLDER = fs.readdirSync(MAIN_FOLDER_SRC);
    
    const length = MAIN_FOLDER.length;
    const randomIndex = Math.floor(Math.random() * length);

    const dirs = MAIN_FOLDER
        .map(file => {
            return path.join(MAIN_FOLDER_SRC, file);
        });

    return dirs[randomIndex];
};

async function addTextOnImage(image, text, { fontSize, fontColor, anchor, x, y }) {
    try {
        const { width, height } = await image.metadata();
        const svgImage = `
            <svg width="${width}" height="${height}">
                <style>
                .title { fill: ${fontColor || 'white'}; font-size: ${fontSize}px; font-weight: bold; }
                </style>
                <text x="${x}%" y="${y}%" font-family="Montserrat" text-anchor="${anchor || 'middle'}" class="title">${text}</text>
            </svg>
        `;

        const svgBuffer = Buffer.from(svgImage);

        return  {
            input: svgBuffer,
            top: 0,
            left: 0,
        };
    } catch (error) {
      console.log(error);
    }
}

async function createGradientBackground(image, { color1, color2, colorSize}) {
    const { width, height } = await image.metadata();

    const svgImage = `
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${width} ${height}" version="1.1">
            <defs>
                <linearGradient id="my-gradient" gradientTransform="rotate(90)">
                    <stop stop-color="${color1}" offset="${colorSize}%"/>
                    <stop stop-color="${color2}" offset="${100-colorSize}%"/>
                </linearGradient>
            </defs>
            
            <rect width="${width}" height="${height}" fill="url(#my-gradient)"/>
        </svg>
    `;

    const svgBuffer = Buffer.from(svgImage);

    return  {
        input: svgBuffer,
        top: 0,
        left: 0,
    };
}

async function addBackgroundEffectOnImage(image) {
    const { width, height } = await image.metadata();

    const generatedHeight = height * 0.7;

    const randomEffectPath = getRandomEffect();

    let sharpImage = await sharp(randomEffectPath)
        .resize({ height: generatedHeight })
        .toBuffer();

    sharpImage = await sharp(sharpImage);
    
    const metadata = await sharpImage.metadata();

    sharpImage = await sharpImage.toBuffer();

    return  {
        input: sharpImage,
        top: height - generatedHeight,
        left: Math.floor(width / 2 - metadata.width / 2),
    };
}

async function addAvatarOnImage(image, avatar) {
    const { width, height } = await image.metadata();

    const generatedHeight = height * 0.7;

    let sharpImage = await sharp(avatar)
        .resize({ height: generatedHeight })
        .toBuffer();

    sharpImage = await sharp(sharpImage);

    const metadata = await sharpImage.metadata();

    sharpImage = await sharpImage.toBuffer();

    return  {
        input: sharpImage,
        top: height - generatedHeight,
        left: Math.floor(width / 2 - metadata.width / 2),
    };
}

async function generateTaggingBand({ title1, title2, output, avatar, gradient, size, tag, coverBandColor }) {
    try {
        console.log(`${output}, file starting...`);

        let outputFileName = `./tmp/tagging-band/${output}.png` || "basic-top-band.png";
        size = size || "600x600";
        tag = tag || "blue";
        const { color1, color2 } = gradient;

        const width = Number(size.split("x")[0]); // 600
        const height = Number(size.split("x")[1]); // 600

        // const response = await services.getRandomBackground({ size, tag });

        let image = await sharp({
            create: {
                width,
                height,
                channels: 4,
                background: { r: 255, g: 255, b: 255, alpha: 1 }
            }
        });

        

        console.log(`${output}, generating composites settings`);

        const compositeSettings = [
            // await addBandOnImage(image, { coverBandColor }),
            await createGradientBackground(image, { color1, color2, colorSize: '5' }),
            await addBackgroundEffectOnImage(image),
            await addAvatarOnImage(image, avatar),
            await addTextOnImage(image, title1, { fontSize: width * 0.1, fontColor: '#ffffff', anchor: 'middle', x: 50, y: 20 }),
            await addTextOnImage(image, title2, { fontSize: width * 0.08, fontColor: 'black', anchor: 'left', x: 5, y: 90 }),
        ];

        await image
            .composite(compositeSettings)
            .toFile(outputFileName);


        console.log(`${output}, done`);
        
    } catch (error) {
        console.error(`${output}, fail`, error);
    }
}

export default generateTaggingBand;
