import sharp from 'sharp';
import services from '../services/index.js';

async function addTextOnImage(image, text) {
    try {
        const { width, height } = await image.metadata();
        const svgImage = `
            <svg width="${width}" height="${height}">
                <style>
                .title { fill: #001; font-size: ${width * 0.1}px; font-weight: bold; }
                </style>
                <text font-family="Montserrat" x="5%" y="15%" text-anchor="left" class="title">${text}</text>
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

async function addBandOnImage(image, { coverBandColor }) {
    try {
        const { width, height } = await image.metadata();
        const waveOpacity = '0.75';
        const waveColor = coverBandColor || '#FCB900';

        const wave = `
            <svg 
                id="svg"
                width="${width || '500'}"
                height="${height || '500'}"
                fill-opacity="${waveOpacity || '0.75'}"
                viewBox="0 100 700 500"
                xmlns="http://www.w3.org/2000/svg"
                class="transition duration-300 ease-in-out delay-150"
            >
                <path d="M 0,400 C 0,400 0,200 0,200 C 100.04615384615383,218.73846153846154 200.09230769230766,237.4769230769231 274,238 C 347.90769230769234,238.5230769230769 395.6769230769231,220.83076923076922 479,225 C 562.3230769230769,229.16923076923078 681.2,255.2 759,265 C 836.8,274.8 873.523076923077,268.36923076923074 939,243 C 1004.476923076923,217.63076923076926 1098.7076923076925,173.32307692307694 1187,163 C 1275.2923076923075,152.67692307692306 1357.6461538461538,176.33846153846153 1440,200 C 1440,200 1440,400 1440,400 Z" stroke="none" stroke-width="0" fill="${waveColor || '#9900efff'}" class="transition-all duration-300 ease-in-out delay-150 path-0" transform="rotate(-180 720 200)"></path>
            </svg>
        `;

        const svgBuffer = Buffer.from(wave);

        return {
            input: svgBuffer,
            top: 0,
            left: 0,
        };
    } catch (error) {
        console.log(error);
    }
}

async function generateBasicTopBand({ title, output, size, tag, coverBandColor }) {
    try {
        console.log(`${output}, file starting...`);

        let outputFileName = `./tmp/basic-top-band/${output}.png` || "basic-top-band.png";
        size = size || "600x600";
        tag = tag || "blue";

        const response = await services.getRandomBackground({ size, tag });

        let image = await sharp(response);

        console.log(`${output}, generating composites settings`);

        const compositeSettings = [
            await addBandOnImage(image, { coverBandColor }),
            await addTextOnImage(image, title),
        ];

        await image
            .composite(compositeSettings)
            .toFile(outputFileName);


        console.log(`${output}, done`);
        
    } catch (error) {
        console.error(`${output}, fail`, error);
    }
}

export default generateBasicTopBand;
