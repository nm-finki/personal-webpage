import { TYPEWRITER } from "./constants.js";


export const randomNumber = ((min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
});

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function typewriter(element, text) {
    element.textContent = '';
    for (const char of text) {
        const new_text = element.textContent+char;
        await sleep(randomNumber(TYPEWRITER.MIN, TYPEWRITER.MAX));
        element.textContent = new_text;
    }
}

export const getChildElements = (element, level = 0) => {
    const childElements = [];
    for (const child of element.children) {
        if(child.tagName.toLowerCase() === 'div') {
            childElements.push({ element: child, level });
            childElements.push(...getChildElements(child, level + 1));
        }
    }
    return childElements;
}
