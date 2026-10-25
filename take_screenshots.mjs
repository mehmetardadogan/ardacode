import { chromium } from 'playwright';

async function main() {
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto('http://127.0.0.1:8000', { waitUntil: 'networkidle' });

    // Contact section screenshot
    const contactEl = await page.$('#iletisim');
    if (contactEl) {
        await contactEl.scrollIntoViewIfNeeded();
        await page.waitForTimeout(500);
        await page.screenshot({ path: 'section-contact.png' });
    }

    // Process section screenshot
    const processEl = await page.$('#surec');
    if (processEl) {
        await processEl.scrollIntoViewIfNeeded();
        await page.waitForTimeout(500);
        await page.screenshot({ path: 'section-process.png' });
    }

    await browser.close();
    console.log('Screenshots complete');
}

main().catch(console.error);
