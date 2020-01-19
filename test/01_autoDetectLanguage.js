const assert = require('assert')

const URL = "https://translate.google.com";
const screenWidth = 1600;
const screenHeight = 900;
const pageTitle = "Google Translate";

const buttonDetectLanguage = 'body > div.frame > div.page.tlid-homepage.homepage.translate-text > div.homepage-content-wrap > div.tlid-source-target.main-header > div.source-target-row > div.tlid-input.input > div.tlid-language-bar.ls-wrap > div.sl-wrap > div.sl-sugg > div.sl-sugg-button-container > div.goog-inline-block.jfk-button.jfk-button-standard.jfk-button-collapse-right.jfk-button-checked';
const buttonDeleteInput = 'body > div.frame > div.page.tlid-homepage.homepage.translate-text > div.homepage-content-wrap > div.tlid-source-target.main-header > div.source-target-row > div.tlid-input.input > div.source-wrap > div > div > div.source-header > div > div > div';

const pathToScreenshots = "./screenshots/";

const txtAreaInput = '#source';

const textDetectLanguage = "DETECT LANGUAGE";
const textInputSK = "Skuska autodetekcie";
const textDetectedSK = "SLOVAK - DETECTED";
const textInputCZ = "Zkouska autodetekce";
const textDetectedCZ = "CZECH - DETECTED";

let page;

async function autodetectLanguage(textInput, expectedLanguage) {
    await page.waitForSelector(txtAreaInput);
    await page.keyboard.type(textInput);                                    

    await page.waitForSelector(buttonDetectLanguage);         
    await page.waitFor(1000);                                                        // TODO how to wait until the button text is updated?
    let detectedText = await page.$eval(buttonDetectLanguage, el => el.innerText);          

    await page.screenshot({ path: pathToScreenshots.concat("detectLanguage.png")});        
    expect(detectedText).to.equal(expectedLanguage);   
    
    await page.click(buttonDeleteInput);
    await page.waitForSelector(txtAreaInput);

    return;    
}

describe('TC1: Test the automatic language recognition for two languages', () => {
  
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

    it('detect language is enabled', async () => {        
        const textOfButton = await page.$eval(buttonDetectLanguage, el => el.innerText);                  
        await page.screenshot({ path: pathToScreenshots.concat("detectLanguageEnabled.png")});        
        expect(textOfButton).to.equal(textDetectLanguage);               
    }); 

    it('autodetect Slovak language', async () => {                                       
        await autodetectLanguage(textInputSK, textDetectedSK);                              
    }); 

    it('autodetect Czech language', async () => {                                       
        await autodetectLanguage(textInputCZ, textDetectedCZ);                         
    });     
       
});