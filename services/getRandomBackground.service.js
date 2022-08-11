import fetch from 'node-fetch';

const getRandomBackground = async ({ size, tag }) => {
    const response = await fetch(
        `https://source.unsplash.com/${size || "500x500"}/?${tag}` // tag = "nature,water"
    );
    const data = await response.buffer();
    return data;
}
export default getRandomBackground;