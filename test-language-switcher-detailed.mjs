import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const baseUrl = 'http://localhost:31264';
  const screenshotDir = path.join(__dirname, 'language-switcher-test-screenshots');

  // Create screenshot directory if it doesn't exist
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  console.log('='.repeat(60));
  console.log('Testing Language Switcher Button');
  console.log('='.repeat(60));

  try {
    // Visit page
    console.log('\n1. Visiting the page...');
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Get all button text content in the page
    console.log('\n2. Finding all buttons and their text:');
    const allButtons = await page.$$eval('button', buttons =>
      buttons.map(btn => ({
        text: btn.textContent.trim(),
        html: btn.innerHTML,
        id: btn.id,
        class: btn.className,
        ariaLabel: btn.getAttribute('aria-label'),
        title: btn.getAttribute('title')
      }))
    );

    // Filter for buttons that might be language switchers
    const potentialSwitchers = allButtons.filter(btn => {
      const text = btn.text.toLowerCase();
      return text === 'en' || text === 'zh' || text === '中' ||
             text.includes('language') || text.includes('lang') ||
             btn.ariaLabel?.toLowerCase().includes('language') ||
             btn.title?.toLowerCase().includes('language') ||
             btn.class?.toLowerCase().includes('lang');
    });

    console.log(`   Found ${allButtons.length} total buttons`);
    console.log(`   Found ${potentialSwitchers.length} potential language switcher buttons:`);
    potentialSwitchers.forEach((btn, i) => {
      console.log(`     ${i + 1}. Text: "${btn.text}"`);
      console.log(`        HTML: ${btn.html.substring(0, 100)}`);
      console.log(`        Class: ${btn.class}`);
      if (btn.ariaLabel) console.log(`        aria-label: ${btn.ariaLabel}`);
      if (btn.title) console.log(`        Title: ${btn.title}`);
    });

    // Now let's look for buttons specifically containing "中" or "EN"
    console.log('\n3. Looking for buttons with "中" or "EN":');
    const languageButtons = await page.$$eval('button', buttons =>
      buttons
        .filter(btn => btn.textContent.includes('中') || btn.textContent.includes('EN'))
        .map(btn => ({
          text: btn.textContent.trim(),
          fullText: btn.textContent,
          html: btn.innerHTML,
          id: btn.id,
          class: btn.className,
          ariaLabel: btn.getAttribute('aria-label'),
          title: btn.getAttribute('title'),
          rect: btn.getBoundingClientRect()
        }))
    );

    if (languageButtons.length > 0) {
      console.log(`   Found ${languageButtons.length} language-related buttons:`);
      languageButtons.forEach((btn, i) => {
        console.log(`     ${i + 1}. Text: "${btn.text}"`);
        console.log(`        Full text: "${btn.fullText.substring(0, 50)}..."`);
      });

      // Get the first language button and take screenshot
      const languageSelector = 'button:has-text("EN"), button:has-text("中")';
      const languageBtn = await page.$(languageSelector);

      if (languageBtn) {
        const text = await languageBtn.textContent();
        const trimmedText = text.trim();
        console.log(`\n   Language switcher text (trimmed): "${trimmedText}"`);

        // Check if it matches expected
        if (trimmedText === '中' || trimmedText === 'EN') {
          console.log('   ✓ Language switcher shows CORRECT simplified text');
        } else {
          console.log('   ✗ Language switcher does NOT show simplified text');
          console.log(`     Expected: "中" or "EN"`);
          console.log(`     Got: "${trimmedText}"`);
        }

        // Take close-up screenshot
        await languageBtn.screenshot({
          path: path.join(screenshotDir, 'language-button-closeup.png')
        });
        console.log('   Saved close-up screenshot');
      }
    } else {
      console.log('   No buttons found with "中" or "EN" text');
    }

    // Take full page screenshot
    await page.screenshot({
      path: path.join(screenshotDir, 'full-page.png'),
      fullPage: true
    });
    console.log('\n   Saved full page screenshot');

    // Test Chinese URL
    console.log('\n4. Testing zh-CN language URL...');
    try {
      await page.goto(`${baseUrl}/zh`, { waitUntil: 'networkidle', timeout: 5000 });
      await page.waitForTimeout(500);

      const zhBtn = await page.$('button:has-text("中"), button:has-text("EN")');
      if (zhBtn) {
        const text = (await zhBtn.textContent()).trim();
        console.log(`   Language switcher text at /zh: "${text}"`);
        if (text === '中') {
          console.log('   ✓ Correctly shows "中" for zh-CN');
        } else if (text === 'EN') {
          console.log('   ✗ Shows "EN" instead of "中" for zh-CN');
        } else {
          console.log(`   ✗ Shows "${text}" instead of "中"`);
        }
      }
    } catch (e) {
      console.log(`   Could not visit /zh: ${e.message}`);
    }

    // Test English URL
    console.log('\n5. Testing en-US language URL...');
    try {
      await page.goto(`${baseUrl}/en`, { waitUntil: 'networkidle', timeout: 5000 });
      await page.waitForTimeout(500);

      const enBtn = await page.$('button:has-text("中"), button:has-text("EN")');
      if (enBtn) {
        const text = (await enBtn.textContent()).trim();
        console.log(`   Language switcher text at /en: "${text}"`);
        if (text === 'EN') {
          console.log('   ✓ Correctly shows "EN" for en-US');
        } else if (text === '中') {
          console.log('   ✗ Shows "中" instead of "EN" for en-US');
        } else {
          console.log(`   ✗ Shows "${text}" instead of "EN"`);
        }
      }
    } catch (e) {
      console.log(`   Could not visit /en: ${e.message}`);
    }

    console.log('\n' + '='.repeat(60));
    console.log('Test Summary');
    console.log('='.repeat(60));
    console.log(`Screenshots saved to: ${screenshotDir}`);

  } catch (error) {
    console.error('Error during testing:', error);
    console.error(error.stack);
  } finally {
    await browser.close();
  }
})();
