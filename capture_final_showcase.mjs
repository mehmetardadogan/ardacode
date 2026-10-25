import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch();
    
    // 1. Desktop Bento Grid
    const pageDesktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await pageDesktop.goto('http://127.0.0.1:8000', { waitUntil: 'networkidle' });
    const bentoSection = pageDesktop.locator('#projeler');
    await bentoSection.scrollIntoViewIfNeeded();
    await pageDesktop.waitForTimeout(600);
    await bentoSection.screenshot({ path: 'bento-grid-desktop.png' });
    await pageDesktop.close();

    // 2. Mobile Bento Grid
    const pageMobile = await browser.newPage({ viewport: { width: 375, height: 812 } });
    await pageMobile.goto('http://127.0.0.1:8000', { waitUntil: 'networkidle' });
    const bentoMobile = pageMobile.locator('#projeler');
    await bentoMobile.scrollIntoViewIfNeeded();
    await pageMobile.waitForTimeout(600);
    await pageMobile.screenshot({ path: 'bento-grid-mobile.png' });
    await pageMobile.close();

    // 3. Project Detail Page
    const pageDetail = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await pageDetail.goto('http://127.0.0.1:8000/projeler/nova-saas-cloud-analytics', { waitUntil: 'networkidle' });
    await pageDetail.waitForTimeout(500);
    await pageDetail.screenshot({ path: 'project-detail-desktop.png', fullPage: false });
    await pageDetail.close();

    await browser.close();
    console.log('Final showcase screenshots captured successfully.');
})();
