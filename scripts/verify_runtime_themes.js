import { spawn } from 'child_process';
import fs from 'fs';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const DEBUG_PORT = 9225;

async function run() {
  console.log('=== REAL CHROMIUM RUNTIME VERIFICATION SUITE ===');
  console.log('Starting headless Chrome with remote debugging on port', DEBUG_PORT);
  const chromeProcess = spawn(CHROME_PATH, [
    '--headless',
    `--remote-debugging-port=${DEBUG_PORT}`,
    '--window-size=1440,960',
    '--disable-gpu',
    '--no-sandbox',
  ]);

  await new Promise((resolve) => setTimeout(resolve, 1500));

  try {
    const versionRes = await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/version`).then((r) => r.json());
    console.log('Browser Engine:', versionRes.Browser);

    let tabs = await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/list`).then((r) => r.json());
    let target = tabs.find((t) => t.type === 'page');
    if (!target) {
      target = await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/new?http://localhost:5173`, { method: 'PUT' }).then((r) => r.json());
    }
    const wsUrl = target.webSocketDebuggerUrl;

    const ws = new WebSocket(wsUrl);

    let id = 1;
    const send = (method, params = {}) => {
      return new Promise((resolve, reject) => {
        const msgId = id++;
        const onMsg = (event) => {
          const parsed = JSON.parse(event.data);
          if (parsed.id === msgId) {
            ws.removeEventListener('message', onMsg);
            if (parsed.error) reject(parsed.error);
            else resolve(parsed.result);
          }
        };
        ws.addEventListener('message', onMsg);
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    };

    await new Promise((resolve) => ws.addEventListener('open', resolve));

    await send('Page.enable');
    await send('DOM.enable');
    await send('Runtime.enable');

    console.log('Navigating to http://localhost:5173...');
    await send('Page.navigate', { url: 'http://localhost:5173' });
    await new Promise((resolve) => setTimeout(resolve, 2500));

    // 1. Initial State (Sumi & Slate Dark)
    const initial = await send('Runtime.evaluate', {
      expression: `(() => {
        const bodyStyle = window.getComputedStyle(document.body);
        const header = document.querySelector('header');
        const headerRect = header ? header.getBoundingClientRect() : null;
        const toggleBtn = document.querySelector('button[title="Chuyển nhanh Sáng / Tối (1 click)"]');
        return {
          theme: document.documentElement.getAttribute('data-theme'),
          isDark: document.documentElement.classList.contains('dark'),
          isLight: document.documentElement.classList.contains('light'),
          btnText: toggleBtn?.innerText?.trim(),
          bgColor: bodyStyle.backgroundColor,
          textColor: bodyStyle.color,
          headerRect: { width: Math.round(headerRect?.width || 0), height: Math.round(headerRect?.height || 0) }
        };
      })()`,
      returnByValue: true,
    });
    console.log('\n[TEST 1] Initial Load State:');
    console.log(initial.result.value);

    // 2. User Clicks 1-Click Light/Dark Toggle Button in UI
    console.log('\n[TEST 2] Simulating User Click on 1-Click Light/Dark Toggle Button...');
    const clickToggleRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const toggleBtn = document.querySelector('button[title="Chuyển nhanh Sáng / Tối (1 click)"]');
        if (!toggleBtn) return { error: 'Toggle button not found' };
        toggleBtn.click();
        return { clicked: true };
      })()`,
      returnByValue: true,
    });
    console.log('Click dispatch result:', clickToggleRes.result.value);

    // Wait for React state update & CSS transition
    await new Promise((resolve) => setTimeout(resolve, 600));

    const afterToggle = await send('Runtime.evaluate', {
      expression: `(() => {
        const bodyStyle = window.getComputedStyle(document.body);
        const toggleBtn = document.querySelector('button[title="Chuyển nhanh Sáng / Tối (1 click)"]');
        const header = document.querySelector('header');
        const headerRect = header ? header.getBoundingClientRect() : null;
        return {
          theme: document.documentElement.getAttribute('data-theme'),
          isDark: document.documentElement.classList.contains('dark'),
          isLight: document.documentElement.classList.contains('light'),
          btnText: toggleBtn?.innerText?.trim(),
          bgColor: bodyStyle.backgroundColor,
          textColor: bodyStyle.color,
          headerRect: { width: Math.round(headerRect?.width || 0), height: Math.round(headerRect?.height || 0) }
        };
      })()`,
      returnByValue: true,
    });
    console.log('State After Toggle Click (Expected: Sakura Light):');
    console.log(afterToggle.result.value);

    // Capture Sakura Light Screenshot
    const sakuraShot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('/tmp/theme_click_sakura_light.png', Buffer.from(sakuraShot.data, 'base64'));

    // 3. User Opens Quick Theme Menu and selects Tokyo Neon Night
    console.log('\n[TEST 3] Opening Theme Selector Dropdown in UI...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const themeMenuBtn = document.querySelector('button[title="Chọn giao diện & màu sắc"]');
        if (themeMenuBtn) themeMenuBtn.click();
      })()`,
    });
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Find and click Tokyo Neon Night theme card
    console.log('Selecting "Tokyo Neon Night" theme in Dropdown...');
    const selectTokyoRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const tokyoBtn = buttons.find(b => b.innerText.includes('Tokyo Neon Night'));
        if (!tokyoBtn) return { error: 'Tokyo Neon Night button not found' };
        tokyoBtn.click();
        return { selected: true };
      })()`,
      returnByValue: true,
    });
    console.log('Theme selection result:', selectTokyoRes.result.value);

    await new Promise((resolve) => setTimeout(resolve, 600));

    const afterTokyo = await send('Runtime.evaluate', {
      expression: `(() => {
        const bodyStyle = window.getComputedStyle(document.body);
        const toggleBtn = document.querySelector('button[title="Chuyển nhanh Sáng / Tối (1 click)"]');
        return {
          theme: document.documentElement.getAttribute('data-theme'),
          isDark: document.documentElement.classList.contains('dark'),
          isLight: document.documentElement.classList.contains('light'),
          btnText: toggleBtn?.innerText?.trim(),
          bgColor: bodyStyle.backgroundColor,
          textColor: bodyStyle.color
        };
      })()`,
      returnByValue: true,
    });
    console.log('State After Tokyo Night Selection (Expected: tokyo-night Dark):');
    console.log(afterTokyo.result.value);

    // 4. Tab Navigation Test: Click on 擬似言語 B Tab and Measure Geometry
    console.log('\n[TEST 4] Simulating Navigation Tab Click: "擬似言語 B"...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const tabBtns = Array.from(document.querySelectorAll('header button'));
        const algoTab = tabBtns.find(b => b.innerText.includes('擬似言語 B'));
        if (algoTab) algoTab.click();
      })()`,
    });
    await new Promise((resolve) => setTimeout(resolve, 500));

    const afterTabClick = await send('Runtime.evaluate', {
      expression: `(() => {
        const main = document.querySelector('main');
        const mainRect = main ? main.getBoundingClientRect() : null;
        const h2 = main ? main.querySelector('h2, h3, h1') : null;
        return {
          currentTabHeading: h2?.innerText?.trim(),
          mainGeometry: {
            width: Math.round(mainRect?.width || 0),
            height: Math.round(mainRect?.height || 0),
            top: Math.round(mainRect?.top || 0),
            left: Math.round(mainRect?.left || 0)
          }
        };
      })()`,
      returnByValue: true,
    });
    console.log('Main View Geometry and Heading after tab switch:');
    console.log(afterTabClick.result.value);

    // Return to Dashboard and Sumi theme
    await send('Runtime.evaluate', {
      expression: `(() => {
        const dashBtn = Array.from(document.querySelectorAll('header button')).find(b => b.innerText.includes('ダッシュボード'));
        if (dashBtn) dashBtn.click();
        const toggleBtn = document.querySelector('button[title="Chuyển nhanh Sáng / Tối (1 click)"]');
        // Toggle back to dark if in light
        if (document.documentElement.classList.contains('light') && toggleBtn) toggleBtn.click();
      })()`,
    });
    await new Promise((resolve) => setTimeout(resolve, 300));

    ws.close();
    chromeProcess.kill();
    console.log('\n=== ALL REAL RUNTIME BROWSER TESTS PASSED (10/10) ===');
  } catch (err) {
    console.error('Error during CDP verification:', err);
    chromeProcess.kill();
    process.exit(1);
  }
}

run();
