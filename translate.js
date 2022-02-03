
const { translate } = require('./g-translate');
const { extractSource } = require('./extractTags')
const { literals } = require('./input.js')

const fs = require('fs');

textType = process.argv[2];
liveLink = process.argv[3];

let data, stringToTranslate;
// 1.Text 2.Dropdown 3.Tag 4.JSON
try {
    switch (textType) {
        case '1':
            data = fs.readFileSync('inputtext.html', 'utf8');
            stringToTranslate = data.toString();
            translate(stringToTranslate.split('\n'), 1);
            break;
        case '2':
            data = fs.readFileSync('inputtext.html', 'utf8');
            stringToTranslate = data.toString();
            translate(stringToTranslate.split('\n'), 2);
            break;
        case '3':
            data = fs.readFileSync('input.html', 'utf8');
            stringToTranslate = data.toString();
            const elementsToTranslate = extractSource(stringToTranslate);
            translate(elementsToTranslate, 3);
            break;
        case '4':
            // literals = []
            // for (let key of Object.keys(tim)) {
            //     literals.push({
            //         message: tim[key].label,
            //         literalId: 'timezone-' + tim[key].label.toLowerCase().replace('/', '-')
            //     })
            // }
            translate(literals, 4, liveLink);
            break;
    }
} catch (e) {
    console.log('Error:', e.stack);
}
