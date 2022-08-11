import composotions from './compositions/index.js';

const gradients = [
    {
        color1: "#00D084",
        color2: "#FAAE7B",
    },
    {
        color1: "#0D41E1",
        color2: "#07C8F9",
    },
    {
        color1: "#E85C90",
        color2: "#EDE342",
    },
    {
        color1: "#00D084",
        color2: "#EDE342",
    },
    {
        color1: "#0D41E1",
        color2: "#FAAE7B",
    },
    {
        color1: "#E85C90",
        color2: "#07C8F9",
    }
]

const basicPlaylistName = [
    {
        title1: "Motivation",
        title2: "Yabancı",
        output: "motivation",
        avatar: './tmp/singers/britney.png',
        gradient: gradients[Math.random() * gradients.length | 0],
    },
    {
        title1: "Good Mod",
        title2: "Yabancı",
        output: "good-mod",
        avatar: './tmp/singers/johny.png',
        gradient: gradients[Math.random() * gradients.length | 0],
    },
    {
        title1: "Bad Mod",
        title2: "Yabancı",
        output: "bad-mod",
        avatar: './tmp/singers/michael.png',
        gradient: gradients[Math.random() * gradients.length | 0],
    },
];

async function main() {
    try {
    
         for await (const { title1, title2, output, avatar, gradient } of basicPlaylistName) {
            await composotions.generateBasicTopBand({ 
                title: title1,
                output,
                size: "600x600",
                tag: "nature,water",
                coverBandColor: "#ca2f38",
            });
        }
    
        for await (const { title1, title2, output, avatar, gradient } of basicPlaylistName) {
            await composotions.generateTaggingBand({ 
                title1,
                title2,
                output,
                avatar,

                size: "600x600",
                tag: "nature,water",
                coverBandColor: "#00D084",
                gradient,
            });
        };

    } catch (error) {
        console.log(error);
    }

}

main();
