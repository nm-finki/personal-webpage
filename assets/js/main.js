import { INDENTS } from "./constants.js";
import { sleep, getChildElements, typewriter } from "./utils.js";


const elementList = getChildElements(document.getElementById('file-container'));

const dcElements = elementList
    .filter(element => element.element.classList.contains('directory-container'));
for(const { element } of dcElements) {
    element.style.setProperty('--max-height', `${element.offsetHeight + 0.1}px`);
}

const dElements = elementList
    .filter(element => element.element.classList.contains('directory'));
for(const { element, level } of dElements) {
    const indent = parseInt(getComputedStyle(element).getPropertyValue('--indent')) + INDENTS.BASE * level;
    element.style.setProperty('--indent', `${indent}px`);
}

let typeWriterActive = false;
const mainContent = document.querySelector('#main-content');
const mainContentHeader = mainContent.querySelector('#header');
const headerText = mainContentHeader.querySelector('.text');
const headerCursor = mainContentHeader.querySelector('.cursor');
const mainContentContainer = mainContent.querySelector('#body');
const topBarText = document.querySelector('#top-bar .text');
const fElements = elementList
    .filter(element => element.element.classList.contains('file'));
for(const { element, level } of fElements) {
    const indent = parseInt(getComputedStyle(element).getPropertyValue('--indent')) + INDENTS.BASE * level;
    element.style.setProperty('--indent', `${indent}px`);

    element.addEventListener('mouseover', () => {
        element.style.setProperty('--indent', `${indent+INDENTS.HOVER}px`);
    });
    element.addEventListener('mouseout', () => {
        element.style.setProperty('--indent', `${indent}px`);
    });

    const fType = element.dataset.type;
    const fPath = element.dataset.path;
    if(fType === 'html') {
        element.addEventListener('click', () => {
            if(!typeWriterActive) {
                fetch(fPath)
                    .then(response => response.text())
                    .then(text => {
                        const parser = new DOMParser();
                        return parser.parseFromString(text, 'text/html');
                    })
                    .then(async html => {
                        typeWriterActive = true;
                        headerCursor.classList.toggle('active')
                        await sleep(125)
                        mainContent.scrollTo(0,0)
                        topBarText.textContent = element.querySelector('.name').textContent;
                        await typewriter(headerText, html.querySelector('#header').textContent.trim());
                        mainContentContainer.innerHTML = html.querySelector('#body').innerHTML;
                        mainContentContainer.classList.toggle('fade');
                        headerCursor.classList.toggle('active')
                        typeWriterActive = false;
                    });
                mainContentContainer.classList.toggle('fade');
            }
        })
    }
    if(fType === 'code') {
        element.addEventListener('click', () => {
            if(!typeWriterActive) {
                fetch(fPath)
                    .then(response => response.text())
                    .then(raw => hljs.highlightAuto(raw).value)
                    .then(async code => {
                        typeWriterActive = true;
                        headerCursor.classList.toggle('active')
                        await sleep(125)
                        mainContent.scrollTo(0,0)
                        topBarText.textContent = element.querySelector('.name').textContent;
                        await typewriter(headerText, element.querySelector('.name').textContent.trim());
                        mainContentContainer.innerHTML = `<pre><code>${code}</code></pre>`;
                        mainContentContainer.classList.toggle('fade');
                        headerCursor.classList.toggle('active')
                        typeWriterActive = false;
                    });
                mainContentContainer.classList.toggle('fade');
            }
        })
    }
    if(fType === 'image') {
        element.addEventListener('click', () => {
            if(!typeWriterActive) {
                (async () => {
                    typeWriterActive = true;
                    headerCursor.classList.toggle('active')
                    await sleep(125)
                    mainContent.scrollTo(0,0)
                    topBarText.textContent = element.querySelector('.name').textContent;
                    await typewriter(headerText, element.querySelector('.name').textContent.trim());
                    mainContentContainer.innerHTML = `<div class="fullscreen"><img src="${fPath}" alt="${element.querySelector('.name').textContent.trim()}"/></div>`;
                    mainContentContainer.classList.toggle('fade');
                    headerCursor.classList.toggle('active')
                    typeWriterActive = false;
                    })();
                mainContentContainer.classList.toggle('fade');
            }
        })
    }
    if(fType === 'font') {
        //TODO: Implement
    }
}

const ddcElements = elementList
    .filter(element => element.element.classList.contains('directory') || element.element.classList.contains('directory-container'));
for(let i=0; i<ddcElements.length; i++) {
    if(ddcElements[i].element.classList.contains('directory')) {
        const dElement = ddcElements[i].element;
        dElement.addEventListener('click', () => {
            dElement.classList.toggle('collapsed');
        });
        if(ddcElements[i+1].element.classList.contains('directory-container')) {
            const dcElement = ddcElements[i+1].element;
            const dcChildren = getChildElements(dcElement)
                .filter(element => element.element.classList.contains('directory') || element.element.classList.contains('file'))
                .map(element => {
                    return {
                        element: element.element,
                        indent: getComputedStyle(element.element).getPropertyValue('--indent')
                    }
                });
            dElement.addEventListener('click', () => {
                dcElement.classList.toggle('collapsed');
            });
            dElement.addEventListener('mouseover', () => {
                for(const { element, indent } of dcChildren) {
                    element.style.setProperty('--indent',  `${parseInt(indent)+INDENTS.HOVER}px`);
                }
            });
            dElement.addEventListener('mouseout', () => {
                for(const { element, indent } of dcChildren) {
                    element.style.setProperty('--indent', indent);
                }
            });
        }
    }
}

const sidebar = document.querySelector("#sidebar");
const sidebarToggle = sidebar.querySelector('.toggle');
const fdElements = [...fElements, ...dElements]
sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    for(const { element } of fdElements) {
        element.classList.toggle('active');
    }
})
