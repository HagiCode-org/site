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

    // Look for the LanguageSwitcher by class name
    console.log('\n2. Looking for LanguageSwitcher component...');

    // Check if element with class "languageSwitcher" exists
    const switcherExists = await page.$('.languageSwitcher');
    console.log(`   Element with class "languageSwitcher" exists: ${switcherExists !== null}`);

    if (switcherExists) {
      // Get the text content
      const text = await switcherExists.textContent();
      const trimmedText = text.trim();
      console.log(`   Language switcher text (trimmed): "${trimmedText}"`);

      // Get the aria-label
      const ariaLabel = await switcherExists.getAttribute('aria-label');
      console.log(`   aria-label: "${ariaLabel}"`);

      // Get the title
      const title = await switcherExists.getAttribute('title');
      console.log(`   title: "${title}"`);

      // Check if it matches expected
      if (trimmedText === '中' || trimmedText === 'EN') {
        console.log('   ✓ Language switcher shows CORRECT simplified text');
      } else {
        console.log('   ✗ Language switcher does NOT show simplified text');
        console.log(`     Expected: "中" or "EN"`);
        console.log(`     Got: "${trimmedText}"`);
      }

      // Take close-up screenshot
      await switcherExists.screenshot({
        path: path.join(screenshotDir, 'language-switcher-closeup.png')
      });
      console.log('   Saved close-up screenshot');
    }

    // Also check the inner span content
    console.log('\n3. Checking inner span content...');
    const innerSpan = await page.$('.languageSwitcher span:not(.sr-only)');
    if (innerSpan) {
      const innerText = await innerSpan.textContent();
      console.log(`   Inner span text: "${innerText.trim()}"`);
    }

    // Take full page screenshot with the element highlighted
    await switcherExists?.evaluate(el => {
      el.style.border = '3px solid red';
    });

    await page.screenshot({
      path: path.join(screenshotDir, 'full-page-highlighted.png'),
      fullPage: true
    });
    console.log('\n   Saved full page screenshot with highlighted element');

    // Test Chinese URL
    console.log('\n4. Testing zh-CN language URL...');
    try {
      await page.goto(`${baseUrl}/zh`, { waitUntil: 'networkidle', timeout: 5000 });
      await page.waitForTimeout(500);

      const zhSwitcher = await page.$('.languageSwitcher');
      if (zhSwitcher) {
        const text = (await zhSwitcher.textContent()).trim();
        console.log(`   Language switcher text at /zh: "${text}"`);
        if (text === '中') {
          console.log('   ✓ Correctly shows "中" for zh-CN');
        } else if (text === 'EN') {
          console.log('   ✗ Shows "EN" instead of "中" for zh-CN');
        } else {
          console.log(`   ✗ Shows "${text}" instead of "中"`);
        }

        await zhSwitcher.screenshot({
          path: path.join(screenshotDir, 'zh-switcher-closeup.png')
        });
      }
    } catch (e) {
      console.log(`   Could not visit /zh: ${e.message}`);
    }

    // Test English URL
    console.log('\n5. Testing en-US language URL...');
    try {
      await page.goto(`${baseUrl}/en`, { waitUntil: 'networkidle', timeout: 5000 });
      await page.waitForTimeout(500);

      const enSwitcher = await page.$('.languageSwitcher');
      if (enSwitcher) {
        const text = (await enSwitcher.textContent()).trim();
        console.log(`   Language switcher text at /en: "${text}"`);
        if (text === 'EN') {
          console.log('   ✓ Correctly shows "EN" for en-US');
        } else if (text === '中') {
          console.log('   ✗ Shows "中" instead of "EN" for en-US');
        } else {
          console.log(`   ✗ Shows "${text}" instead of "EN"`);
        }

        await enSwitcher.screenshot({
          path: path.join(screenshotDir, 'en-switcher-closeup.png')
        });
      }
    } catch (e) {
      console.log(`   Could not visit /en: ${e.message}`);
    }

    // Test clicking the switcher to toggle
    console.log('\n6. Testing click to toggle...');
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    const initialSwitcher = await page.$('.languageSwitcher');
    if (initialSwitcher) {
      const initialText = (await initialSwitcher.textContent()).trim();
      console.log(`   Initial text: "${initialText}"`);

      await initialSwitcher.click();
      await page.waitForTimeout(500);

      const afterClickSwitcher = await page.$('.languageSwitcher');
      if (afterClickSwitcher) {
        const afterClickText = (await afterClickSwitcher.textContent()).trim();
        console.log(`   After click text: "${afterClickText}"`);

        if ((initialText === '中' && afterClickText === 'EN') ||
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
