
const { translate } = require('./g-translate');
const { extractSource } = require('./extractTags')

const fs = require('fs');

textType = process.argv[2];
let data, stringToTranslate;

try {
    switch (textType) {
        case '1':
            data = fs.readFileSync('input.txt', 'utf8');
            stringToTranslate = data.toString();
            translate(stringToTranslate.split('\n'), 1);
            break;
        case '2':
            data = fs.readFileSync('input.txt', 'utf8');
            stringToTranslate = data.toString();
            translate(stringToTranslate.split('\n'), 2);
            break;
        case '3':
        default:
            data = fs.readFileSync('input.html', 'utf8');
            stringToTranslate = data.toString();
            const elementsToTranslate = extractSource(stringToTranslate);
            translate(elementsToTranslate, 3);
            break;
    }
} catch (e) {
    console.log('Error:', e.stack);
}
