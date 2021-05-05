
const { translate } = require('./g-translate');
const { extractSource } = require('./extractTags')

const fs = require('fs');

isNormalText = process.argv[2] ? true : false;

try {
    if (isNormalText) {
        const data = fs.readFileSync('input.txt', 'utf8');
        const stringToTranslate = data.toString();
        translate(stringToTranslate.split('\n'));
    } else {
        const data = fs.readFileSync('input.html', 'utf8');
        const stringToTranslate = data.toString();
        const elementsToTranslate = extractSource(stringToTranslate);
        translate(elementsToTranslate, true);
    }
} catch (e) {
    console.log('Error:', e.stack);
}
