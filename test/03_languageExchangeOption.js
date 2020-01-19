const assert = require('assert')

const URL = "https://translate.google.com";
const screenWidth = 1600;
const screenHeight = 900;
const pageTitle = "Google Translate";

const buttonOpenSourceLanguages = 'body > div.frame > div.page.tlid-homepage.homepage.translate-text > div.homepage-content-wrap > div.tlid-source-target.main-header > div.source-target-row > div.tlid-input.input > div.tlid-language-bar.ls-wrap > div.sl-wrap > div.sl-more.tlid-open-source-language-list';
const buttonOpenTargetLanguages = 'body > div.frame > div.page.tlid-homepage.homepage.translate-text > div.homepage-content-wrap > div.tlid-source-target.main-header > div.source-target-row > div.tlid-input.input > div.tlid-language-bar.ls-wrap > div.tl-wrap > div.tl-more.tlid-open-target-language-list';
const buttonSwapLanguages = 'body > div.frame > div.page.tlid-homepage.homepage.translate-text > div.homepage-content-wrap > div.tlid-source-target.main-header > div.source-target-row > div.tlid-input.input > div.tlid-language-bar.ls-wrap > div.swap-wrap > div';

const pathToScreenshots = "./screenshots/";

const inputSearchLanguageInput = '#sl_list-search-box';
const inputSearchLanguageTranslation = '#tl_list-search-box';

const txtAreaInput = '#source';
const txtAreaTranslation = 'body > div.frame > div.page.tlid-homepage.homepage.translate-text > div.homepage-content-wrap > div.tlid-source-target.main-header > div.source-target-row > div.tlid-results-container.results-container > div.tlid-result.result-dict-wrapper > div.result.tlid-copy-target > div.text-wrap.tlid-copy-target > div';

const textInputCZ = "srdce";
const textOutputEN = "heart";

describe('TC3: Test the Language exchange option', () => {
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

    it('exchange button swaps input and output', async () => {      
        // select czech for input
        await page.waitForSelector(txtAreaInput);
        await page.click(buttonOpenSourceLanguages);
        await page.waitForSelector(inputSearchLanguageInput); 
        await page.focus(inputSearchLanguageInput);
        await page.keyboard.type("Czech");         
        await page.keyboard.press('Enter');

        // select english for translation        
        await page.click(buttonOpenTargetLanguages);
        await page.waitForSelector(inputSearchLanguageTranslation);
        await page.focus(inputSearchLanguageTranslation);
        await page.keyboard.type("English");         
        await page.keyboard.press('Enter');
    
        await page.waitForSelector(txtAreaInput);
        await page.keyboard.type(textInputCZ);        
        await page.waitForSelector(txtAreaInput);

        // check sides before the exchange
        await page.screenshot({ path: pathToScreenshots.concat("beforelanguageExchange.png")});        
        await page.waitForSelector(txtAreaInput);                
        let leftTextBefore = await page.$eval(txtAreaInput, el => el.value);          
        expect(leftTextBefore).to.equal(textInputCZ);         

        await page.waitForSelector(txtAreaTranslation);                
        let rightTextBefore = await page.$eval(txtAreaTranslation, el => el.innerText);          
        expect(rightTextBefore).to.equal(textOutputEN);         

        // exchange sides
        await page.waitForSelector(buttonSwapLanguages);
        await page.click(buttonSwapLanguages);
        
        // check sides after the exchange
        await page.screenshot({ path: pathToScreenshots.concat("afterlanguageExchange.png")});        
        await page.waitForSelector(txtAreaInput);                
        let leftTextAfter = await page.$eval(txtAreaInput, el => el.value);          
        expect(leftTextAfter).to.equal(textOutputEN);         

        await page.waitForSelector(txtAreaTranslation);                
        let rightTextAfter = await page.$eval(txtAreaTranslation, el => el.innerText);          
        expect(rightTextAfter).to.equal(textInputCZ);       
    });  

    it('repeat language swap again', async () => {        

        // check sides before the exchange
        await page.screenshot({ path: pathToScreenshots.concat("beforelanguageExchangeRepeated.png")});        
        await page.waitForSelector(txtAreaInput);                
        let leftTextBefore = await page.$eval(txtAreaInput, el => el.value);          
        expect(leftTextBefore).to.equal(textOutputEN);         

        await page.waitForSelector(txtAreaTranslation);                
        let rightTextBefore = await page.$eval(txtAreaTranslation, el => el.innerText);          
        expect(rightTextBefore).to.equal(textInputCZ);         

        // exchange sides
        await page.waitForSelector(buttonSwapLanguages);
        await page.click(buttonSwapLanguages);
        
        // check sides after the exchange
        await page.screenshot({ path: pathToScreenshots.concat("afterlanguageExchangeRepeated.png")});        
        await page.waitForSelector(txtAreaInput);                
        let leftTextAfter = await page.$eval(txtAreaInput, el => el.value);          
        expect(leftTextAfter).to.equal(textInputCZ);         

        await page.waitForSelector(txtAreaTranslation);                
        let rightTextAfter = await page.$eval(txtAreaTranslation, el => el.innerText);          
        expect(rightTextAfter).to.equal(textOutputEN);
    });     

});