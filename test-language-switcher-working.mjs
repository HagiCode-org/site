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

    // Look for the LanguageSwitcher by class name (hashed)
    console.log('\n2. Looking for LanguageSwitcher component with hashed class...');

    // Try the hashed class name
    const switcher = await page.$('button[class*="languageSwitcher"]');
    console.log(`   Element with class containing "languageSwitcher" exists: ${switcher !== null}`);

    if (switcher) {
      // Get the text content
      const text = await switcher.textContent();
      const trimmedText = text.trim();
      console.log(`   Language switcher text (trimmed): "${trimmedText}"`);

      // Get the aria-label
      const ariaLabel = await switcher.getAttribute('aria-label');
      console.log(`   aria-label: "${ariaLabel}"`);

      // Get the title
      const title = await switcher.getAttribute('title');
      console.log(`   title: "${title}"`);

      // Get the inner HTML
      const innerHTML = await switcher.innerHTML();
      console.log(`   inner HTML: "${innerHTML}"`);

      // Check if it matches expected
      if (trimmedText.includes('中') || trimmedText.includes('EN')) {
        console.log('   ✓ Language switcher shows CORRECT simplified text');
      } else {
        console.log('   ✗ Language switcher does NOT show simplified text');
      }

      // Highlight the element
      await switcher.evaluate(el => {
        el.style.border = '4px solid #00ff00';
        el.style.zIndex = '9999';
      });

      // Take close-up screenshot
      await switcher.screenshot({
        path: path.join(screenshotDir, 'language-switcher-closeup.png')
      });
      console.log('   Saved close-up screenshot');

      // Take full page screenshot with highlighted element
      await page.screenshot({
        path: path.join(screenshotDir, 'full-page-highlighted.png'),
        fullPage: true
      });
      console.log('   Saved full page screenshot with highlighted element');
    }

    // Test Chinese URL
    console.log('\n3. Testing zh-CN language URL...');
    try {
      await page.goto(`${baseUrl}/zh`, { waitUntil: 'networkidle', timeout: 5000 });
      await page.waitForTimeout(500);

      const zhSwitcher = await page.$('button[class*="languageSwitcher"]');
      if (zhSwitcher) {
        const text = (await zhSwitcher.textContent()).trim();
        console.log(`   Language switcher text at /zh: "${text}"`);
        if (text === '中' || text.includes('中')) {
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
    console.log('\n4. Testing en-US language URL...');
    try {
      await page.goto(`${baseUrl}/en`, { waitUntil: 'networkidle', timeout: 5000 });
      await page.waitForTimeout(500);

      const enSwitcher = await page.$('button[class*="languageSwitcher"]');
      if (enSwitcher) {
        const text = (await enSwitcher.textContent()).trim();
        console.log(`   Language switcher text at /en: "${text}"`);
        if (text === 'EN') {
          console.log('   ✓ Correctly shows "EN" for en-US');
        } else if (text === '中' || text.includes('中')) {
          console.log('   ✗ Shows "中" instead of "EN" for en-US');
        } else {
          console.log(`   ✗ Shows "${text}" instead of "EN"`);
        }

        // Take screenshot
        await enSwitcher.screenshot({
          path: path.join(screenshotDir, 'en-switcher-closeup.png')
        });
      }
    } catch (e) {
      console.log(`   Could not visit /en: ${e.message}`);
    }

    // Test clicking the switcher to toggle
    console.log('\n5. Testing click to toggle...');
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    const initialSwitcher = await page.$('button[class*="languageSwitcher"]');
    if (initialSwitcher) {
      const initialText = (await initialSwitcher.textContent()).trim();
      console.log(`   Initial text: "${initialText}"`);

      await initialSwitcher.click();
      await page.waitForTimeout(1000);

      const afterClickSwitcher = await page.$('button[class*="languageSwitcher"]');
      if (afterClickSwitcher) {
        const afterClickText = (await afterClickSwitcher.textContent()).trim();
        console.log(`   After click text: "${afterClickText}"`);

        if ((initialText === '中' && afterClickText === 'EN') ||
            (initialText.includes('中') && afterClickText === 'EN') ||
            (initialText === 'EN' && afterClickText === '中')) {
          console.log('   ✓ Language toggle works correctly');
        } else {
          console.log('   ✗ Language toggle does not work as expected');
        }
      }
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
