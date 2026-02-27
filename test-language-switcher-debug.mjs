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

    // Get all elements with aria-label containing 'language'
    console.log('\n2. Looking for elements with language-related aria-label...');

    const langElements = await page.$$eval('[aria-label*="language" i]', elements =>
      elements.map(el => ({
        tag: el.tagName,
        ariaLabel: el.getAttribute('aria-label'),
        title: el.getAttribute('title'),
        text: el.textContent.trim(),
        class: el.className,
        html: el.innerHTML
      }))
    );

    console.log(`   Found ${langElements.length} elements with language in aria-label:`);
    langElements.forEach((el, i) => {
      console.log(`     ${i + 1}. <${el.tag}> aria-label="${el.ariaLabel}"`);
      console.log(`        title="${el.title}"`);
      console.log(`        text="${el.text}"`);
      console.log(`        class="${el.class}"`);
    });

    // Also look for buttons with language in title
    console.log('\n3. Looking for buttons with language in title...');

    const titleElements = await page.$$eval('button[title*="language" i], button[title*="语言" i]', elements =>
      elements.map(el => ({
        tag: el.tagName,
        ariaLabel: el.getAttribute('aria-label'),
        title: el.getAttribute('title'),
        text: el.textContent.trim(),
        class: el.className,
        html: el.innerHTML
      }))
    );

    console.log(`   Found ${titleElements.length} elements with language in title:`);
    titleElements.forEach((el, i) => {
      console.log(`     ${i + 1}. <${el.tag}> title="${el.title}"`);
      console.log(`        text="${el.text}"`);
    });

    // Look for buttons containing "中" or "EN" directly
    console.log('\n4. Looking for buttons containing "中" or "EN"...');

    const buttonsWithLangText = await page.$$eval('button', buttons =>
      buttons
        .filter(btn => {
          const text = btn.textContent;
          return text.includes('中') || text.includes('EN');
        })
        .map(btn => ({
          text: btn.textContent.trim(),
          fullText: btn.textContent,
          class: btn.className,
          html: btn.innerHTML,
          ariaLabel: btn.getAttribute('aria-label'),
          title: btn.getAttribute('title')
        }))
    );

    console.log(`   Found ${buttonsWithLangText.length} buttons with language text:`);
    buttonsWithLangText.forEach((btn, i) => {
      console.log(`     ${i + 1}. text="${btn.text}"`);
      console.log(`        class="${btn.class}"`);
    });

    // Get all button classes
    console.log('\n5. Getting all button classes to find language switcher...');
    const allButtonClasses = await page.$$eval('button', buttons =>
      buttons
        .map(btn => btn.className)
        .filter(cls => cls && cls.length > 0)
    );

    // Find classes that might be related to language
    const possibleLangClasses = allButtonClasses.filter(cls =>
      cls.toLowerCase().includes('lang') ||
      cls.toLowerCase().includes('language') ||
      cls.toLowerCase().includes('locale') ||
      cls.toLowerCase().includes('i18n')
    );

    console.log(`   Found ${possibleLangClasses.length} classes with language-related keywords:`);
    possibleLangClasses.forEach((cls, i) => {
      console.log(`     ${i + 1}. ${cls}`);
    });

    // Check localStorage for language
    console.log('\n6. Checking localStorage...');
    const localStorageData = await page.evaluate(() => {
      const result = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          result[key] = localStorage.getItem(key) || '';
        }
      }
      return result;
    });

    console.log('   localStorage contents:');
    Object.entries(localStorageData).forEach(([key, value]) => {
      console.log(`     ${key}: ${value}`);
    });

    // Take screenshot
    await page.screenshot({
      path: path.join(screenshotDir, 'final-page.png'),
      fullPage: true
    });
    console.log('\n   Saved full page screenshot');

    // Highlight all buttons in a screenshot
    await page.$$eval('button', buttons =>
      buttons.forEach((btn, i) => {
        btn.style.outline = '2px solid ' + (i % 2 === 0 ? 'red' : 'blue');
      })
    );

    await page.screenshot({
      path: path.join(screenshotDir, 'buttons-highlighted.png'),
      fullPage: true
    });
    console.log('   Saved screenshot with all buttons highlighted');

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
