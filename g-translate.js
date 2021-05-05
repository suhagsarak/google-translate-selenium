const fs = require('fs');

exports.translate = (elementsToTranslate, isAngularTag = false) => {
    const webdriver = require('selenium-webdriver')
    const By = webdriver.By

    inLan = [{ name: 'English', locale: 'en' }];

    outLan = [
        { name: 'German', locale: 'de' },
        { name: 'Spanish', locale: 'es' },
        { name: 'French', locale: 'fr' },
        { name: 'Dutch', locale: 'nl' },
        { name: 'Polish', locale: 'pl' },
        { name: 'Swedish', locale: 'sv' },
    ];

    outXpath = '/html/body/c-wiz/div/div[2]/c-wiz/div[2]/c-wiz/div[1]/div[2]/div[2]/c-wiz[2]/div[5]/div/div[1]/span[1]/span/span';

    async function callAPI() {

        const driver = new webdriver.Builder().forBrowser('chrome').build();

        let url, lang, outputForTranslation, source, target;

        for (let lanNo = 0; lanNo < outLan.length; lanNo++) {

            lang = outLan[lanNo];

            fs.appendFile(isAngularTag ? './output.html' : './output.txt', `\n<!-- ${lang.name}-${lang.locale} -->\n`, { 'flag': 'a' }, function (err) {
                if (err) { return console.error(err); }
            });

            url = `https://translate.google.co.in/?sl=${inLan[0].locale}&tl=${lang.locale}&op=translate`
            await driver.get(url);

            const inputForEnglish = await driver.findElement(By.className('er8xn'));

            for (let ind = 0; ind < elementsToTranslate.length; ind++) {

                source = elementsToTranslate[ind];
                if (isAngularTag) source = source.source;

                await inputForEnglish.clear();
                await inputForEnglish.sendKeys(source);

                const e = new Date().getTime() + (10 * 1000);
                while (new Date().getTime() <= e) { }

                outputForTranslation = await driver.findElement(By.xpath(outXpath));
                target = await outputForTranslation.getText()

                if (isAngularTag) {
                    processAndOutputAngularTag(source, target);
                } else {
                    processAndOutputPlaneText(source, target);
                }
            }
            fs.appendFile('./output.html', '\n', { 'flag': 'a' }, function (err) {
                if (err) { return console.error(err); }
            });
        }
    }

    callAPI()

}


function processAndOutputAngularTag(source, target) {
    tag = `
    <trans-unit id="${source.id}" datatype="html">
        <source>${source.source}</source>
        <target>${target}</target>
    </trans-unit>`;

    fs.appendFile('./output.html', tag, { 'flag': 'a' }, function (err) {
        if (err) { return console.error(err); }
    });
}

function processAndOutputPlaneText(source, target) {
    fs.appendFile('./output.txt', `\n${source} \n${target}\n`, { 'flag': 'a' }, function (err) {
        if (err) { return console.error(err); }
    });
}