const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

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
    // Test 1: Visit page and check initial state
    console.log('\n1. Visiting the page...');
    await page.goto(baseUrl, { waitUntil: 'networkidle' });

    // Wait for the page to fully load
    await page.waitForTimeout(1000);

    // Try to find the language switcher - common selectors
    const possibleSelectors = [
      'button[title*="language"]',
      'button[title*="Language"]',
      'button[aria-label*="language"]',
      'button[aria-label*="Language"]',
      '.language-switcher',
      '.lang-switcher',
      '[data-testid*="language"]',
      '[data-test-id*="language"]',
      'button:has-text("中")',
      'button:has-text("EN")',
      'button:has-text("中文")',
      'button:has-text("English")',
    ];

    let languageSwitcher = null;
    let usedSelector = null;

    for (const selector of possibleSelectors) {
      try {
        const element = await page.$(selector);
        if (element) {
          const isVisible = await element.isVisible();
          if (isVisible) {
            languageSwitcher = element;
            usedSelector = selector;
            console.log(`   Found language switcher with selector: ${selector}`);
            break;
          }
        }
      } catch (e) {
        // Continue to next selector
      }
    }

    if (!languageSwitcher) {
      // If no specific selector found, look for buttons in header/navbar
      console.log('   Trying to find button in header/navbar...');
      const buttons = await page.$$eval('header button, nav button, .navbar button, .header button', buttons =>
        buttons.filter(btn => {
          const text = btn.textContent.trim();
          return text === '中' || text === 'EN' || text === '中文' || text === 'English';
        }).map(btn => ({
          text: btn.textContent.trim(),
          id: btn.id,
          class: btn.className
        }))
      );

      if (buttons.length > 0) {
        console.log(`   Found ${buttons.length} potential language switcher buttons:`);
        buttons.forEach((btn, i) => console.log(`     ${i + 1}. Text: "${btn.text}"`));
      } else {
        console.log('   No language switcher button found. Taking full page screenshot for reference...');
        await page.screenshot({
          path: path.join(screenshotDir, 'full-page-initial.png'),
          fullPage: true
        });
      }
    }

    // Take initial screenshot
    console.log('\n2. Taking initial screenshot...');
    await page.screenshot({
      path: path.join(screenshotDir, 'initial-page.png'),
      fullPage: false
    });

    // Get current language from localStorage
    const currentLang = await page.evaluate(() => {
      return localStorage.getItem('language') || localStorage.getItem('locale') || localStorage.getItem('i18n') || 'unknown';
    });
    console.log(`   Current language from localStorage: ${currentLang}`);

    // Get current URL to check for language prefix
    const currentUrl = page.url();
    console.log(`   Current URL: ${currentUrl}`);

    // Check what text is displayed in language switcher
    if (languageSwitcher) {
      const switcherText = await languageSwitcher.textContent();
      console.log(`   Language switcher text: "${switcherText}"`);
      console.log(`   Expected: "中" (for zh-CN) or "EN" (for en-US)`);

      // Check if it matches expected simplified text
      if (switcherText === '中' || switcherText === 'EN') {
        console.log('   ✓ Language switcher shows CORRECT simplified text');
      } else {
        console.log('   ✗ Language switcher does NOT show simplified text');
      }

      // Take a close-up screenshot of just the language switcher
      await languageSwitcher.screenshot({
        path: path.join(screenshotDir, 'language-switcher-closeup.png')
      });
      console.log('   Saved close-up screenshot of language switcher');
    }

    // Test 2: Try to switch language and verify
    console.log('\n3. Attempting to switch language...');
    if (languageSwitcher) {
      await languageSwitcher.click();
      await page.waitForTimeout(1000);

      // Take screenshot after clicking
      await page.screenshot({
        path: path.join(screenshotDir, 'after-click.png'),
        fullPage: false
      });

      // Check the text again
      const switcherTextAfter = await languageSwitcher.textContent();
      console.log(`   Language switcher text after click: "${switcherTextAfter}"`);

      if (switcherTextAfter === '中' || switcherTextAfter === 'EN') {
        console.log('   ✓ After switch, still shows simplified text');
      } else {
        console.log('   ✗ After switch, text changed to non-simplified');
      }
    }

    // Test 3: Try to visit Chinese URL directly
    console.log('\n4. Testing zh-CN language URL...');
    try {
      await page.goto(`${baseUrl}/zh`, { waitUntil: 'networkidle', timeout: 5000 });
      await page.waitForTimeout(500);

      // Find language switcher again
      for (const selector of possibleSelectors) {
        try {
          const element = await page.$(selector);
          if (element && await element.isVisible()) {
            const text = await element.textContent();
            console.log(`   Language switcher text (zh path): "${text}"`);

            if (text === '中') {
              console.log('   ✓ Correctly shows "中" for zh-CN');
            } else if (text === 'EN') {
              console.log('   ✗ Shows "EN" instead of "中" for zh-CN');
            } else {
              console.log(`   ✗ Shows "${text}" instead of "中"`);
            }

            await page.screenshot({
              path: path.join(screenshotDir, 'zh-language-page.png'),
              fullPage: false
            });
            break;
          }
        } catch (e) {
          // Continue
        }
      }
    } catch (e) {
      console.log(`   Could not visit /zh path: ${e.message}`);
    }

    // Test 4: Try to visit English URL directly
    console.log('\n5. Testing en-US language URL...');
    try {
      await page.goto(`${baseUrl}/en`, { waitUntil: 'networkidle', timeout: 5000 });
      await page.waitForTimeout(500);

      // Find language switcher again
      for (const selector of possibleSelectors) {
        try {
          const element = await page.$(selector);
          if (element && await element.isVisible()) {
            const text = await element.textContent();
            console.log(`   Language switcher text (en path): "${text}"`);

            if (text === 'EN') {
              console.log('   ✓ Correctly shows "EN" for en-US');
            } else if (text === '中') {
              console.log('   ✗ Shows "中" instead of "EN" for en-US');
            } else {
              console.log(`   ✗ Shows "${text}" instead of "EN"`);
            }

            await page.screenshot({
              path: path.join(screenshotDir, 'en-language-page.png'),
              fullPage: false
            });
            break;
          }
        } catch (e) {
          // Continue
        }
      }
    } catch (e) {
      console.log(`   Could not visit /en path: ${e.message}`);
    }

    // Final summary
    console.log('\n' + '='.repeat(60));
    console.log('Test Summary');
    console.log('='.repeat(60));
    console.log(`Screenshots saved to: ${screenshotDir}`);
    console.log('- initial-page.png: First page load');
    console.log('- language-switcher-closeup.png: Close-up of switcher (if found)');
    console.log('- after-click.png: After clicking switcher (if applicable)');
    console.log('- zh-language-page.png: When visiting /zh path');
    console.log('- en-language-page.png: When visiting /en path');

  } catch (error) {
    console.error('Error during testing:', error.message);
  } finally {
    await browser.close();
  }
})();
