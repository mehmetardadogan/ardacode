import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests/e2e',
    workers: 1,
    timeout: 60000,
    expect: { timeout: 10000 },
    outputDir: process.env.MONITORING_ARTIFACT_DIR || './.playwright-results',
    use: { baseURL: process.env.MONITORING_E2E_URL || 'http://127.0.0.1:8018', channel: 'msedge', headless: true, viewport: { width: 1440, height: 1000 }, trace: 'retain-on-failure' },
});
