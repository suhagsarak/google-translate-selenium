
const { translate } = require('./g-translate');
const { extractSource } = require('./extractTags')

const fs = require('fs');

try {
    const data = fs.readFileSync('input.txt', 'utf8');
    const stringToTranslate = data.toString();
    const elementsToTranslate = extractSource(stringToTranslate);
    translate(elementsToTranslate);
} catch (e) {
    console.log('Error:', e.stack);
}
