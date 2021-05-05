
const { translate } = require('./translate');
const { stringToTranslate } = require('./stringToTranslate');

const elementsToTranslate = [];


function extractSource() {
    const transUnitPattern = /<([^\s]+).*?id="([^"]*?)".*?>(.+?)<\/\1>/gm;
    const regex = new RegExp(transUnitPattern);
    const matches = stringToTranslate.match(regex);
    let source;
    if (matches) {
        for (match of matches) {
            parts = regex.exec(match);
            if (parts) {
                source = parts[3].replace("<source> ", "").replace(" </source>", "").replace("<source>", "").replace("</source>", "");
                elementsToTranslate.push({
                    id: parts[2],
                    source: source,
                    target: ''
                });
            }
        }
    }
    console.log(elementsToTranslate);
}

extractSource();
translate(elementsToTranslate);


