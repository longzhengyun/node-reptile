import puppeteer from 'puppeteer';

import targetConfig from './target';

(async (): Promise<void> => {
    const browser = await puppeteer.launch();

    try {
        const page = await browser.newPage();

        await page.goto(`${targetConfig.targetUrl}/article/63`);
        await page.waitForSelector(targetConfig.selectDom);
        await page.exposeFunction('formatHtml', (content: string): string => {
            return targetConfig.formatHtml(content);
        })

        const content = await page.evaluate((selector: string, resultType: number): string => {
            const element = document.querySelector(selector);

            let result = '';
            switch (resultType) {
                case 1:
                    result = element ? element.innerHTML : '';
                    break;
                default:
                    result = element ? element.innerText : '';
                    break;
            }

            result = window.formatHtml(result);

            return result;
        });
        console.log(content);
    } catch (error) {
        console.log(error);
    }

    browser.close();
})();