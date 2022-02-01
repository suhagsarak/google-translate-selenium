

exports.extractSource = (stringToTranslate) => {
    const elementsToTranslate = [];
    const transUnitPattern = /<([^\s]+).*?id="([^"]*?)".*?>(.+?)<\/\1>/gm;
    const regex = new RegExp(/<([^\s]+).*?id="([^"]*?)".*?>(.+?)<\/\1>/gm);
    const matches = stringToTranslate.match(regex);
    let source;
    if (matches) {
        for (let ind = 0; ind < matches.length; ind++) {
            const parts = new RegExp(transUnitPattern).exec(matches[ind]);
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
    return elementsToTranslate;
}
