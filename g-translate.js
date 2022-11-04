const fs = require('fs');

exports.translate = (elementsToTranslate, textType, liveLink = '') => {

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

    outXpath = '//*[@id="yDmH0d"]/c-wiz/div/div[2]/c-wiz/div[2]/c-wiz/div[1]/div[2]/div[3]/c-wiz[2]/div/div[8]/div/div[1]/span[1]/span/span'
    gSpecificXpath = '//*[@id="yDmH0d"]/c-wiz/div/div[2]/c-wiz/div[2]/c-wiz/div[1]/div[2]/div[3]/c-wiz[2]/div[6]/div[1]/div[1]/span[1]';

    let url, inputForEnglish, outputForTranslation, source, target, outfile, e;

    switch (textType) {
        case 1:
        case 2:
            outfile = 'output.txt'
            break;
        case 3:
            outfile = 'output.html'
            break;
        case 4:
            outLan = [
                { name: 'French', locale: 'fr' },
                { name: 'German', locale: 'de' },
                { name: 'Polish', locale: 'pl' },
                { name: 'Dutch', locale: 'nl' },
                { name: 'Swedish', locale: 'sv' },
                { name: 'Spanish', locale: 'es' },
            ];
            outfile = 'output.txt'
            break;
    }

    if (liveLink == 'll') {
        outLan = [
            { locale: 'es', name: 'Spanish' },
            { locale: 'pl', name: 'Ploish' },
            { locale: 'pt', name: 'Brazillian portugeze' },
            { locale: 'fr', name: 'Canadian french' },
            { locale: 'de', name: 'German' },
            { locale: 'tr', name: 'Turkish' },
            { locale: 'it', name: 'Italian' },
            { locale: 'cs', name: 'Čeština' },
            { locale: 'fr', name: 'Freanch' },
            { locale: 'ro', name: 'Romanian' },
            { locale: 'nl', name: 'Dutch' }
        ];
    }

    const driver = new webdriver.Builder().forBrowser('chrome').build();

    async function callAPI() {
        for (let outLang of outLan) {

            write(`\n<!-- ${outLang.name}-${outLang.locale} -->\n`, outfile);

            url = `https://translate.google.co.in/?sl=${inLan[0].locale}&tl=${outLang.locale}&op=translate`
            await driver.get(url);
            inputForEnglish = await driver.findElement(By.className('er8xn'));

            for (let eleToTrans of elementsToTranslate) {
                switch (textType) {
                    case 1:
                        source = eleToTrans;
                        await inputForEnglish.clear();
                        await inputForEnglish.sendKeys(source);
                        e = new Date().getTime() + (10 * 1000);
                        while (new Date().getTime() <= e) { }
                        outputForTranslation = null;
                        try {
                            outputForTranslation = await driver.findElement(By.xpath(outXpath));
                        }
                        catch {
                            if (!outputForTranslation)
                                outputForTranslation = await driver.findElement(By.xpath(gSpecificXpath));
                        }
                        target = await outputForTranslation.getText()
                        // writePlain(`${source} ${target}\n`);
                        writePlain(`${source}\n${target}\n`);
                        break;

                    case 2:
                        source = eleToTrans;
                        if (source === '--') {
                            writePlain('\n');
                        } else {
                            await inputForEnglish.clear();
                            await inputForEnglish.sendKeys(source);
                            e = new Date().getTime() + (10 * 1000);
                            while (new Date().getTime() <= e) { }
                            outputForTranslation = null;
                            try {
                                outputForTranslation = await driver.findElement(By.xpath(outXpath));
                            }
                            catch {
                                if (!outputForTranslation)
                                    outputForTranslation = await driver.findElement(By.xpath(gSpecificXpath));
                            }
                            target = await outputForTranslation.getText()
                            writePlain(`${source} {${target}} `);
                        }
                        break;

                    case 3:
                        source = eleToTrans;
                        await inputForEnglish.clear();
                        await inputForEnglish.sendKeys(source.source);
                        e = new Date().getTime() + (10 * 1000);
                        while (new Date().getTime() <= e) {}
                        outputForTranslation = null;
                        try {
                            outputForTranslation = await driver.findElement(By.xpath(outXpath));
                        }
                        catch {
                            if (!outputForTranslation)
                                outputForTranslation = await driver.findElement(By.xpath(gSpecificXpath));
                        }
                        target = await outputForTranslation.getText()
                        writeHtml(
                            '    <trans-unit id="' + source.id + '" datatype="html">\n' +
                            '      <source>' + source.source + '</source>\n' +
                            '      <target>' + target + '</target>\n' +
                            '    </trans-unit>\n'
                        );
                        break;

                    case 4:
                        source = eleToTrans;
                        await inputForEnglish.clear();
                        await inputForEnglish.sendKeys(source.message);
                        e = new Date().getTime() + (10 * 1000);
                        while (new Date().getTime() <= e) { }
                        outputForTranslation = null;
                        try {
                            outputForTranslation = await driver.findElement(By.xpath(outXpath));
                        }
                        catch {
                            if (!outputForTranslation)
                                outputForTranslation = await driver.findElement(By.xpath(gSpecificXpath));
                        }
                        target = await outputForTranslation.getText()
                        // target = `${target}`.replace(/ /g,'')
                        writePlain(`    "${source.literalId}": "${target}",\n`);
                        break;
                }
            }
        }
        await driver.close();
        write(`\n`, outfile);

        if (textType === 4) {
            writePlain(`\n < !--English - en-- >\n`);
            for (let eleToTran of elementsToTranslate) {
                writePlain(`    "${eleToTran.literalId}": "${eleToTran.message}",\n`);
            }
        }
    }

    callAPI()
}


function writePlain(text, file = 'output.txt') {
    write(text, file);
}

function writeHtml(text, file = 'output.html') {
    write(text, file);
}

function write(text, file) {
    fs.appendFileSync(file, text, { 'flag': 'a' }, function (err) {
        if (err) { return console.error(err); }
    });
}