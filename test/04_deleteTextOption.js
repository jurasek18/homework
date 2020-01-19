const assert = require('assert')

const URL = "https://translate.google.com";
const screenWidth = 1600;
const screenHeight = 900;
const pageTitle = "Google Translate";

const buttonDeleteInput = 'body > div.frame > div.page.tlid-homepage.homepage.translate-text > div.homepage-content-wrap > div.tlid-source-target.main-header > div.source-target-row > div.tlid-input.input > div.source-wrap > div > div > div.source-header > div > div > div';

const pathToScreenshots = "./screenshots/";

const txtAreaInput = '#source';
const textInputDE = "Testen Sie die Option zum Löschen von Text";


describe('TC4: Test the delete text option', () => {
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

    it('delete button is visible when text is entered', async () => {
        await page.keyboard.type(textInputDE); 
        await page.waitForNavigation();   

        const deleteButton = await page.$(buttonDeleteInput);      

        await page.screenshot({ path: pathToScreenshots.concat("deleteButtonIsVisible.png")});
        assert.ok(deleteButton);
    }); 
    
    it('text is deleted after clicking on delete button', async () => {   
        await page.screenshot({ path: pathToScreenshots.concat("textBeforeIsDeleted.png")}); 

        await page.click(buttonDeleteInput);
        await page.screenshot({ path: pathToScreenshots.concat("textIsDeleted.png")});
        const textDeleted = await page.$eval(txtAreaInput, el => el.value);  
        expect(textDeleted).to.equal('');                                                                     // TODO: improve with something like is empty?      
    });     
});