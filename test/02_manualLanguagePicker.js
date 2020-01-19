const assert = require('assert')

const URL = "https://translate.google.com";
const screenWidth = 1600;
const screenHeight = 900;
const pageTitle = "Google Translate";

const buttonSuggestions = 'div.jfk-button';
const buttonDeleteInput = 'body > div.frame > div.page.tlid-homepage.homepage.translate-text > div.homepage-content-wrap > div.tlid-source-target.main-header > div.source-target-row > div.tlid-input.input > div.source-wrap > div > div > div.source-header > div > div > div';
const buttonOpenSourceLanguages = 'body > div.frame > div.page.tlid-homepage.homepage.translate-text > div.homepage-content-wrap > div.tlid-source-target.main-header > div.source-target-row > div.tlid-input.input > div.tlid-language-bar.ls-wrap > div.sl-wrap > div.sl-more.tlid-open-source-language-list';
const buttonOpenTargetLanguages = 'body > div.frame > div.page.tlid-homepage.homepage.translate-text > div.homepage-content-wrap > div.tlid-source-target.main-header > div.source-target-row > div.tlid-input.input > div.tlid-language-bar.ls-wrap > div.tl-wrap > div.tl-more.tlid-open-target-language-list';

const inputSearchLanguageInput = '#sl_list-search-box';
const inputSearchLanguageTranslation = '#tl_list-search-box';

const txtAreaInput = '#source';
const txtAreaTranslation = 'body > div.frame > div.page.tlid-homepage.homepage.translate-text > div.homepage-content-wrap > div.tlid-source-target.main-header > div.source-target-row > div.tlid-results-container.results-container > div.tlid-result.result-dict-wrapper > div.result.tlid-copy-target > div.text-wrap.tlid-copy-target > div';
const textInputManual = "Manual language picking";
const textInputPickFromList = "Picking from the list of languages";
const textInputSearchList = "Search in the list of languages";

function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

describe('TC2: Test the manual language picker', () => {
    let page;
  
    before (async function () {
        page = await browser.newPage();
        await page.goto(URL);
        await page.setViewport({ width: screenWidth, height: screenHeight });        
    });
  
    after (async function () {
        await page.close();
    });
    
    afterEach (async function() {
        // make screenshot for failed tests
        if (this.currentTest.state === 'failed') {
            await page.screenshot({
                path: pathToScreenshots.concat(Date.now()).concat("_failure.png"),
                fullPage: true
            });
        }
    });     
  
    it('page should have the correct page title', async function () {
        expect(await page.title()).to.eql(pageTitle);
    });

    it('pick language from suggested languages', async () => {  
        await page.waitForSelector(txtAreaInput);
        await page.keyboard.type(textInputManual); 
        await page.waitForSelector(txtAreaInput);
        
        let suggestions = await page.$$eval(buttonSuggestions, buttons => { return buttons.map(but => but.innerText.toLowerCase()).slice(0, 8)});
        suggestions.splice(4,1);                                    // remove empty value        

        for (let i=1;i<suggestions.length;i++) {                    // skip the english detected option       
            let firstLetterBig = toTitleCase(suggestions[i]);
            const mySelector = "//div[contains(text(), '".concat(firstLetterBig).concat("') and contains(@class, 'jfk-button')]");
            const myLink = await page.$x(mySelector);
    
            if (myLink.length > 0) {
                if ((myLink.length > 1) && (i>=suggestions.length/2)) {             // ugly way how to deal with same language suggested for source and translation
                    await myLink[1].click();    
                }
                else {
                    await myLink[0].click();
                }
            } else throw new Error("Link not found for selector: ".concat(mySelector));            

        }

        await page.waitForSelector(txtAreaTranslation);
        let rightTextTranslated = await page.$eval(txtAreaTranslation, el => el.innerText);                      
        assert.ok(rightTextTranslated)            
    });  

    it('pick language from the list of languages for input', async () => {  
        await page.waitForSelector(buttonDeleteInput);
        await page.click(buttonDeleteInput);
        await page.waitForSelector(txtAreaInput);
        await page.keyboard.type(textInputPickFromList); 

        const myLanguages = ["Slovak", "Czech"];                             // TODO parametrize this
        const myCodes = ["sk", "cs"];
        
        for (let i=0;i<myLanguages.length;i++) {                       
            // open the language list 
            await page.click(buttonOpenSourceLanguages);
            await page.waitForSelector(inputSearchLanguageInput); 

            const mySelector = "//div[contains(text(), '".concat(myLanguages[i]).concat("') and contains(@class, 'language_list_item')]");
            const myLink = await page.$x(mySelector);

            if (myLink.length > 0) {
                await myLink[0].click();                                    
            } else throw new Error("Link not found for selector: ".concat(mySelector));            

            await page.waitForSelector(txtAreaInput);
            let selectedCode = "#sugg-item-".concat(myCodes[i]);
            let selectedLanguage = await page.$eval(selectedCode, el => el.innerText);
            expect(selectedLanguage).to.equal(myLanguages[i].toUpperCase());  
        }                     
    });   
    
    it('pick language from the list of languages for translations', async () => {  
        await page.waitForSelector(buttonDeleteInput);
        await page.click(buttonDeleteInput);
        await page.waitForSelector(txtAreaInput); 
        await page.keyboard.type(textInputPickFromList);         

        const myLanguages = ["Sesotho", "Urdu"];                             // TODO parametrize this
        const myCodes = ["st", "ur"];
        
        for (let i=0;i<myLanguages.length;i++) {                                   
            // open the language list
            await page.click(buttonOpenTargetLanguages);
            await page.waitForSelector(inputSearchLanguageTranslation);
            
            const mySelector = "(//div[contains(text(), '".concat(myLanguages[i]).concat("') and contains(@class, 'language_list_item')])[3]");      //TODO ugly hardcode selector
            const myLink = await page.$x(mySelector);

            if (myLink.length > 0) {
                await myLink[0].click();                                    
            } else throw new Error("Link not found for selector: ".concat(mySelector));            

            await page.waitForSelector(txtAreaInput);
            let selectedCode = "#sugg-item-".concat(myCodes[i]);
            let selectedLanguage = await page.$eval(selectedCode, el => el.innerText);
            expect(selectedLanguage).to.equal(myLanguages[i].toUpperCase());
        }                     
    });   
    
    it('search language in the list for input', async () => {  
        await page.waitForSelector(buttonDeleteInput);
        await page.click(buttonDeleteInput);
        await page.waitForSelector(txtAreaInput); 
        await page.keyboard.type(textInputSearchList);         

        const myLanguages = ["Arabic", "Croatian"];                             // TODO parametrize this
        const myCodes = ["ar","hr"];

        for (let i=0;i<myLanguages.length;i++) {                                   
            // open the language list
            await page.click(buttonOpenSourceLanguages);
            await page.waitForSelector(inputSearchLanguageInput); 
            await page.focus(inputSearchLanguageInput);
            await page.keyboard.type(myLanguages[i]);         
            await page.keyboard.press('Enter');

            await page.waitForSelector(txtAreaInput);
            let selectedCode = "#sugg-item-".concat(myCodes[i]);
            let selectedLanguage = await page.$eval(selectedCode, el => el.innerText);
            expect(selectedLanguage).to.equal(myLanguages[i].toUpperCase());            
        }                     
    });  

    it('search language in the list for translations', async () => {  
        await page.waitForSelector(buttonDeleteInput);
        await page.click(buttonDeleteInput);
        await page.waitForSelector(txtAreaInput); 
        await page.keyboard.type(textInputSearchList);         

        const myLanguages = ["Russian", "Italian"];                             // TODO parametrize this
        const myCodes = ["ru","it"];

        for (let i=0;i<myLanguages.length;i++) {                                   
            // open the language list
            await page.click(buttonOpenTargetLanguages);
            await page.waitForSelector(inputSearchLanguageTranslation);
            await page.focus(inputSearchLanguageTranslation);
            await page.keyboard.type(myLanguages[i]);         
            await page.keyboard.press('Enter');

            await page.waitForSelector(txtAreaInput);
            let selectedCode = "#sugg-item-".concat(myCodes[i]);
            let selectedLanguage = await page.$eval(selectedCode, el => el.innerText);
            expect(selectedLanguage).to.equal(myLanguages[i].toUpperCase());            
        }                     
    });     
});