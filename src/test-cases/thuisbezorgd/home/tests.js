const playwright = require('playwright');

describe('Home page', function () {
    const pageUrl = 'https://www.thuisbezorgd.nl/en/';
    const browsers = [];
    const pages = [];
    const contexts = [];

    beforeAll(async function () {
        for (const browserType of ['chromium', 'firefox', 'webkit']) {
            browsers.push(await playwright[browserType].launch({headless: false}));
        }
    });

    afterAll(async function () {
        for(const browser of browsers) {
            await browser.close();
        }
    });

    beforeEach(async function() {
        for(const browser of browsers) {
            const context = await browser.newContext();
            const page = await context.newPage();
            contexts.push(context);
            pages.push(page);
        }
    });

    afterEach(async function() {
        for(const context of contexts) {
            await context.close();
        }
    });

    it('Checks the response of the search input with a valid address', async function () {
        for(const page of pages) {
            await page.goto(pageUrl);
            await page.type('#imysearchstring', 'Rozengracht 30, Amsterdam');

            const firstAddressItemSelector = '[data-name="Rozengracht 30, Amsterdam"]';

            await page.waitForSelector(firstAddressItemSelector, {timeout: 2000});

            await Promise.all([
                page.waitForNavigation({
                    url: '**/order-takeaway-amsterdam-1016',
                    waitUntil: 'domcontentloaded',
                    timeout: 4000
                }),
                page.click(firstAddressItemSelector)
            ]);
        }
    });
});