const assert = require('assert')

const URL = "https://translate.google.com";
const screenWidth = 1600;
const screenHeight = 900;
const pageTitle = "Google Translate";

const pathToScreenshots = "./screenshots/";

const buttonText = 'body > div.frame > div.page.tlid-homepage.homepage.translate-docs > div.input-button-container > div > div.tlid-input-button.input-button.header-button.tlid-input-button-text.text-icon > div';
const buttonDocuments = 'body > div.frame > div.page.tlid-homepage.homepage.translate-text > div.input-button-container > div > div.tlid-input-button.input-button.header-button.tlid-input-button-docs.documents-icon > div';
const buttonBrowse = 'body > div.frame > div.page.tlid-homepage.homepage.translate-docs > div.homepage-content-wrap > div.tlid-source-target.main-header > div.tlid-select-file-page-container > div > form > div.tlid-select-file-section.select-file-section > label';
const buttonTranslate = 'body > div.frame > div.page.tlid-homepage.homepage.translate-docs > div.homepage-content-wrap > div.tlid-source-target.main-header > div.tlid-select-file-page-container > div > form > div.tlid-file-selected-section.file-selected-section > div.button-container > input';
const buttonCancelSelectedFile = 'body > div.frame > div.page.tlid-homepage.homepage.translate-docs > div.homepage-content-wrap > div.tlid-source-target.main-header > div.tlid-select-file-page-container > div > form > div.tlid-file-selected-section.file-selected-section > div.file-holder > div.selected-and-cancel > div';

const inputFile = 'body > div.frame > div.page.tlid-homepage.homepage.translate-docs > div.homepage-content-wrap > div.tlid-source-target.main-header > div.tlid-select-file-page-container > div > form > input.tlid-js-input';
const filePathTXT = "./data/testTranslate.txt";
const filePathDOC = "./data/testTranslate.docx";
const filePathPDF = "./data/testTranslate.pdf";
const fileTypeTXT = "txt";
const fileTypeDOC = "doc";
const fileTypePDF = "pdf";
const textOfTXT = 'body > pre';
const textOfDOC = 'body > div:nth-child(4) > p';
const textOfPDF = 'body > font > span > div';
const translatedText = 'This is a test file for translation.';

let page;

async function translateDocument(filename, filetype) {
    await page.waitForSelector(buttonDocuments);       
    await page.click(buttonDocuments); 

    await page.waitForSelector(buttonBrowse);        
    await page.waitForSelector(inputFile);

    // browse for file
    const [fileChooser] = await Promise.all([
        page.waitForFileChooser(),       
        page.click(buttonBrowse)
    ]);
    await fileChooser.accept([filename]);

    await page.click(buttonTranslate);

    //check translation
    switch (filetype) {
        case "txt":
            await page.waitForSelector(textOfTXT);
            await page.waitFor(1000);                                                               //TODO without wait text is returned before translation
            let translatedTXT = await page.$eval(textOfTXT, el => el.innerText);              
            expect(translatedTXT).to.equal(translatedText);
            break;

        case "doc":
            await page.waitForSelector(textOfDOC);
            await page.waitFor(1000);                                                               //TODO without wait text is returned before translation
            let translatedDOC = await page.$eval(textOfDOC, el => el.textContent);   
            expect(translatedDOC).to.equal(translatedText);
            break;

        case "pdf":
            await page.waitForSelector(textOfPDF);
            await page.waitFor(1000);                                                               //TODO without wait text is returned before translation
            let translatedPDF = await page.$eval(textOfPDF, el => el.innerText);              
            expect(translatedPDF).to.equal(translatedText);
            break;

        default:
            throw new Error("Filetype not supported: ".concat(fyletype));            
    }    
   
    //return back and remove file
    await page.goBack();
    await page.click(buttonCancelSelectedFile);        
    await page.click(buttonText);

    return;    
}

describe('TC5: Test the document translation functionality', () => {
    //let page;
  
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

    it('translate .txt file', async () => {
        await translateDocument(filePathTXT,fileTypeTXT);
    }); 

    it('translate .doc file', async () => {
        await translateDocument(filePathDOC, fileTypeDOC);
    });   
    
    it('translate .pdf file', async () => {
        await translateDocument(filePathPDF, fileTypePDF);        
    });     
});