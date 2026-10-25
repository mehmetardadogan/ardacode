import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch();
    const widths = [320, 375, 430, 768, 1024, 1440, 1920];
    
    for (const w of widths) {
        const page = await browser.newPage({ viewport: { width: w, height: 900 } });
        await page.goto('http://127.0.0.1:8000', { waitUntil: 'networkidle' });
        
        const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
        const innerWidth = await page.evaluate(() => window.innerWidth);
        const hasHorizontalOverflow = scrollWidth > innerWidth;
        
        let offendingElements = [];
        if (hasHorizontalOverflow) {
            offendingElements = await page.evaluate(() => {
                const elements = [];
                document.querySelectorAll('*').forEach(el => {
                    const rect = el.getBoundingClientRect();
                    if (rect.right > window.innerWidth + 1) {
                        elements.push({
                            tag: el.tagName,
                            id: el.id,
                            className: el.className ? el.className.toString().slice(0, 100) : '',
                            right: Math.round(rect.right),
                            width: Math.round(rect.width)
                        });
                    }
                });
                return elements.slice(0, 10);
            });
        }
        
        console.log(`Viewport ${w}px: scrollWidth=${scrollWidth}, innerWidth=${innerWidth}, hasOverflow=${hasHorizontalOverflow}`);
        if (offendingElements.length > 0) {
            console.log(`  Offending count: ${offendingElements.length}`, JSON.stringify(offendingElements, null, 2));
        }
        await page.close();
    }
    
    await browser.close();
})();
