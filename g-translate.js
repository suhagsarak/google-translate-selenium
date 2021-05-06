const fs = require('fs');

exports.translate = (elementsToTranslate, textType) => {

    const webdriver = require('selenium-webdriver')
    const By = webdriver.By

    const inLan = [{ name: 'English', locale: 'en' }];

    let outLan = [
        { name: 'German', locale: 'de' },
        { name: 'Spanish', locale: 'es' },
        { name: 'French', locale: 'fr' },
        { name: 'Dutch', locale: 'nl' },
        { name: 'Polish', locale: 'pl' },
        { name: 'Swedish', locale: 'sv' },
    ];

    outXpath = '/html/body/c-wiz/div/div[2]/c-wiz/div[2]/c-wiz/div[1]/div[2]/div[2]/c-wiz[2]/div[5]/div/div[1]/span[1]/span/span';

    let url, outLang, inputForEnglish, outputForTranslation, source, target, outfile, e;

    switch (textType) {
        case 1:
        case 2:
            outfile = './output.txt'
            break;
        case 3:
            outfile = './output.html'
            break;
        case 4:
            outLan = [
                { name: 'English', locale: 'en' },
                { name: 'French', locale: 'fr' },
                { name: 'German', locale: 'de' },
                { name: 'Polish', locale: 'pl' },
                { name: 'Dutch', locale: 'nl' },
                { name: 'Swedish', locale: 'sv' },
                { name: 'Spanish', locale: 'es' },
            ];
            outfile = './output.txt'
            break;
    }

    const driver = new webdriver.Builder().forBrowser('chrome').build();

    async function callAPI() {
        for (let lanNo = 0; lanNo < outLan.length; lanNo++) {
            outLang = outLan[lanNo];
            fs.appendFile(outfile, `\n<!-- ${outLang.name}-${outLang.locale} -->\n`, { 'flag': 'a' }, function (err) {
                if (err) { return console.error(err); }
            });
            url = `https://translate.google.co.in/?sl=${inLan[0].locale}&tl=${outLang.locale}&op=translate`
            await driver.get(url);
            inputForEnglish = await driver.findElement(By.className('er8xn'));

            for (let ind = 0; ind < elementsToTranslate.length; ind++) {

                switch (textType) {
                    case 1:
                        source = elementsToTranslate[ind];
                        await inputForEnglish.clear();
                        await inputForEnglish.sendKeys(source);
                        e = new Date().getTime() + (10 * 1000);
                        while (new Date().getTime() <= e) { }
                        outputForTranslation = await driver.findElement(By.xpath(outXpath));
                        target = await outputForTranslation.getText()
                        writePlain(`${source}\n${target}\n`);
                        break;

                    case 2:
                        source = elementsToTranslate[ind];
                        await inputForEnglish.clear();
                        await inputForEnglish.sendKeys(source);
                        e = new Date().getTime() + (10 * 1000);
                        while (new Date().getTime() <= e) { }
                        outputForTranslation = await driver.findElement(By.xpath(outXpath));
                        target = await outputForTranslation.getText()
                        writePlain(`${source} {${target}}, `);
                        break;

                    case 3:
                        source = elementsToTranslate[ind];
                        await inputForEnglish.clear();
                        await inputForEnglish.sendKeys(source.source);
                        e = new Date().getTime() + (10 * 1000);
                        while (new Date().getTime() <= e) { }
                        outputForTranslation = await driver.findElement(By.xpath(outXpath));
                        target = await outputForTranslation.getText()
                        writeHtml(`
                        <trans-unit id="${source.id}" datatype="html">
                            <source>${source.source}</source>
                            <target>${target}</target>
                        </trans-unit>`);
                        break;

                    case 4:
                        source = elementsToTranslate[ind];
                        await inputForEnglish.clear();
                        await inputForEnglish.sendKeys(source.message);
                        e = new Date().getTime() + (10 * 1000);
                        while (new Date().getTime() <= e) { }
                        outputForTranslation = await driver.findElement(By.xpath(outXpath));
                        target = await outputForTranslation.getText()
                        writePlain(`"${source.literalId}": "${target}",\n`);
                        break;
                }
            }
        }
        fs.appendFile(outfile, '\n', { 'flag': 'a' }, function (err) {
            if (err) { return console.error(err); }
        });
    }

    callAPI()
}


function writePlain(text, file = './output.txt') {
    fs.appendFile(file, text, { 'flag': 'a' }, function (err) {
        if (err) { return console.error(err); }
    });
}

function writeHtml(text, file = './output.html') {
    fs.appendFile(file, text, { 'flag': 'a' }, function (err) {
        if (err) { return console.error(err); }
    });
}