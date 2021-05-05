const fs = require('fs');

exports.translate = (elementsToTranslate) => {
    const webdriver = require('selenium-webdriver')
    const By = webdriver.By

    inLan = ['en'];
    outLan = ['fr', 'de', 'pl', 'nl', 'sv', 'es']

    outXpath = '/html/body/c-wiz/div/div[2]/c-wiz/div[2]/c-wiz/div[1]/div[2]/div[2]/c-wiz[2]/div[5]/div/div[1]/span[1]/span/span';


    async function callAPI() {

        const driver = new webdriver.Builder().forBrowser('chrome').build();

        let url, lang, outputForTranslation, inTag, text;

        for (let lanNo = 0; lanNo < outLan.length; lanNo++) {

            lang = outLan[lanNo];

            url = `https://translate.google.co.in/?sl=${inLan[0]}&tl=${lang}&op=translate`
            await driver.get(url);

            const inputForEnglish = await driver.findElement(By.className('er8xn'));

            for (let tagNo = 0; tagNo < elementsToTranslate.length; tagNo++) {

                inTag = elementsToTranslate[tagNo];

                await inputForEnglish.clear();

                await inputForEnglish.sendKeys(inTag.source);

                const e = new Date().getTime() + (10 * 1000);
                while (new Date().getTime() <= e) { }

                outputForTranslation = await driver.findElement(By.xpath(outXpath));

                text = await outputForTranslation.getText()
                inTag.target = text;

                const tag = `
                    <trans-unit id=${inTag.id} datatype="html">
                        <source>${inTag.source}</source>
                        <target>${inTag.target}</target>
                    </trans-unit>`;

                fs.appendFile('./output.txt', tag, { 'flag': 'a' }, function (err) {
                    if (err) { return console.error(err); }
                });
            }
            fs.appendFile('./output.txt', '\n', { 'flag': 'a' }, function (err) {
                if (err) { return console.error(err); }
            });
        }
    }

    callAPI()

}