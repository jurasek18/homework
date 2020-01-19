# HomeWork

to have fun during weekend while testing Google Translator (https://translate.google.com) functionalities.

I decided to use Puppeteer/Mocha/Chai stack for imlementation in order to prove that i can quickly learn/adapt to new technologies. I am aware it is not the most elegant solution and it is far far away from best practices, but it wasn't easy to built everything from scratch. My focus was to make it work first and it took me more time than i expected :). 

Areas for improvements:
- separate locators, constants, common functions and data inputs into separate files
- handle exceptions with own messages, e.g. if element is not found, return name of the missing element instead of timeout
- implement Page Object Pattern
- even though tests are passing sometimes an error appears (probably related to asynchronous running): The process with PID 3348 (child process of PID 3024) could not be terminated.
- replace waitFor(time) if possible

# Installation

Clone this repository and run tests with `npm` command.

```bash
git clone https://github.com/jurasek18/homework
cd homework
npm i
```

# Execution

Run all tests with `npm test` command or run specific test with `npm run single-test <path-to-testfile>` command. 

```bash
npm test
npm run single-test ./test/05_documentTranslate.js
```

## 1. Test the automatic language recognition for two languages
Test cases:
- page should have the correct page title
- detect language is enabled
- autodetect Slovak language
- autodetect Czech language

[test/01_autoDetectLanguage.js](https://github.com/jurasek18/homework/blob/master/test/01_autoDetectLanguage.js)

## 2. Test the manual language picker
Test cases:
- page title
- pick language from suggested languages
- pick language from the list of languages for input
- pick language from the list of languages for translations
- search language in the list for input
- search language in the list for translations

[test/02_manualLanguagePicker.js](https://github.com/jurasek18/homework/blob/master/test/02_manualLanguagePicker.js)

## 3. Test the Language exchange option
Test cases:
- page should have the correct page title
- exchange button swaps input and output
- repeat language swap again

[test/03_languageExchangeOption.js](https://github.com/jurasek18/homework/blob/master/test/03_languageExchangeOption.js)

## 4. Test the delete text option
Test cases:
- page should have the correct page title
- delete button is visible when text is entered
- text is deleted after clicking on delete button

[test/04_deleteTextOption.js](https://github.com/jurasek18/homework/blob/master/test/04_deleteTextOption.js)

## 5. Test the document translation functionality
Test cases:
- page should have the correct page title
- translate .txt file
- translate .txt file
- translate .txt file

[test/05_documentTranslate.js](https://github.com/jurasek18/homework/blob/master/test/05_documentTranslate.js)