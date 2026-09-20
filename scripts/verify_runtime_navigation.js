import { spawn } from 'child_process';
import fs from 'fs';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const DEBUG_PORT = 9226;

async function run() {
  console.log('=== REAL CHROMIUM NAVIGATION & LAYOUT VERIFICATION ===');
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
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 1. Verify that the old horizontal overflowing tab bar is gone
    const oldTabBarCheck = await send('Runtime.evaluate', {
      expression: `Boolean(document.querySelector('.overflow-x-auto.scrollbar-none.py-1\\\\.5'))`,
      returnByValue: true,
    });
    console.log('Old horizontal overflowing tab bar exists:', oldTabBarCheck.result.value);
    if (oldTabBarCheck.result.value) {
      throw new Error('FAILED: Old horizontal overflowing tab bar is still present!');
    }

    // 2. Verify sidebar exists and measure initial expanded geometry
    const expandedSidebarGeometry = await send('Runtime.evaluate', {
      expression: `(() => {
        const aside = document.querySelector('aside');
        if (!aside) return null;
        const rect = aside.getBoundingClientRect();
        return {
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          left: Math.round(rect.left),
          top: Math.round(rect.top),
        };
      })()`,
      returnByValue: true,
    });
    console.log('Expanded Sidebar Geometry:', expandedSidebarGeometry.result.value);
    if (!expandedSidebarGeometry.result.value || expandedSidebarGeometry.result.value.width < 200) {
      throw new Error(`FAILED: Expanded sidebar width is unexpected: ${JSON.stringify(expandedSidebarGeometry.result.value)}`);
    }

    // 3. Verify section categories and lack of duplicate emojis
    const navContentCheck = await send('Runtime.evaluate', {
      expression: `(() => {
        const aside = document.querySelector('aside');
        const text = aside.innerText;
        const buttons = Array.from(aside.querySelectorAll('button')).map(b => b.innerText.trim());
        const hasDoubleEmojiCamera = text.includes('📷') || buttons.some(b => b.includes('📷'));
        const hasDoubleEmojiBooks = text.includes('📚') || buttons.some(b => b.includes('📚'));
        const hasDoubleEmojiLaptop = text.includes('💻') || buttons.some(b => b.includes('💻'));
        const hasDoubleEmojiGear = text.includes('⚙️') || buttons.some(b => b.includes('⚙️'));
        const lower = text.toLowerCase();
        const hasOverview = lower.includes('tổng quan');
        const hasCore = lower.includes('luyện thi chuyên sâu');
        const hasMaterials = lower.includes('giáo trình & từ vựng');
        const hasTools = lower.includes('công cụ & ôn tập');
        const hasSystem = lower.includes('hệ thống');

        return {
          hasDoubleEmoji: hasDoubleEmojiCamera || hasDoubleEmojiBooks || hasDoubleEmojiLaptop || hasDoubleEmojiGear,
          sections: { hasOverview, hasCore, hasMaterials, hasTools, hasSystem },
          sampleButtons: buttons.slice(0, 4)
        };
      })()`,
      returnByValue: true,
    });
    console.log('Nav Content & Emoji Inspection:', navContentCheck.result.value);
    if (navContentCheck.result.value.hasDoubleEmoji) {
      throw new Error('FAILED: Redundant duplicate emojis are still present in navigation items!');
    }
    const { hasOverview, hasCore, hasMaterials, hasTools, hasSystem } = navContentCheck.result.value.sections;
    if (!hasOverview || !hasCore || !hasMaterials || !hasTools || !hasSystem) {
      throw new Error('FAILED: Categorized sections are missing from sidebar!');
    }

    // Take screenshot of expanded sidebar layout
    const expandedScreenshot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('/Users/hoangson/.gemini/antigravity-ide/brain/53155373-5ff4-4157-8a32-29acbb7e74db/sidebar_expanded.png', Buffer.from(expandedScreenshot.data, 'base64'));
    console.log('Saved expanded sidebar screenshot to sidebar_expanded.png');

    // 4. Measure main content width before collapse
    const mainWidthBefore = await send('Runtime.evaluate', {
      expression: `Math.round(document.querySelector('main').getBoundingClientRect().width)`,
      returnByValue: true,
    });
    console.log('Main view width before collapse:', mainWidthBefore.result.value);

    // 5. Test sidebar collapse via toggle button
    console.log('Clicking sidebar collapse button...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const collapseBtn = document.querySelector('button[title*="Thu gọn thanh điều hướng"]');
        if (collapseBtn) {
          collapseBtn.click();
          return true;
        }
        const bottomCollapseBtn = document.querySelector('button[title*="Thu gọn sidebar"]');
        if (bottomCollapseBtn) {
          bottomCollapseBtn.click();
          return true;
        }
        return false;
      })()`,
    });
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Measure collapsed sidebar geometry
    const collapsedSidebarGeometry = await send('Runtime.evaluate', {
      expression: `(() => {
        const aside = document.querySelector('aside');
        const rect = aside.getBoundingClientRect();
        return {
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        };
      })()`,
      returnByValue: true,
    });
    console.log('Collapsed Sidebar Geometry:', collapsedSidebarGeometry.result.value);
    if (collapsedSidebarGeometry.result.value.width > 70) {
      throw new Error(`FAILED: Sidebar did not collapse properly, width is ${collapsedSidebarGeometry.result.value.width}`);
    }

    const mainWidthAfter = await send('Runtime.evaluate', {
      expression: `Math.round(document.querySelector('main').getBoundingClientRect().width)`,
      returnByValue: true,
    });
    console.log('Main view width after collapse:', mainWidthAfter.result.value);
    if (mainWidthAfter.result.value <= mainWidthBefore.result.value) {
      throw new Error('FAILED: Main view width did not expand when sidebar collapsed!');
    }

    // Take screenshot of collapsed sidebar dock layout
    const collapsedScreenshot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('/Users/hoangson/.gemini/antigravity-ide/brain/53155373-5ff4-4157-8a32-29acbb7e74db/sidebar_collapsed.png', Buffer.from(collapsedScreenshot.data, 'base64'));
    console.log('Saved collapsed sidebar screenshot to sidebar_collapsed.png');

    // 6. Test tab navigation while collapsed (click Algorithm Workshop)
    console.log('Navigating to Algorithm Workshop in collapsed dock...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btn = document.querySelector('button[title*="Thuật toán"]');
        if (btn) btn.click();
      })()`,
    });
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Verify breadcrumb updated in top navbar
    const breadcrumbCheck = await send('Runtime.evaluate', {
      expression: `(() => {
        const header = document.querySelector('header');
        return header ? header.innerText : '';
      })()`,
      returnByValue: true,
    });
    console.log('Top Navbar text contains breadcrumb:', breadcrumbCheck.result.value.includes('Thuật toán & Trace B'));
    if (!breadcrumbCheck.result.value.includes('Thuật toán & Trace B')) {
      throw new Error('FAILED: Breadcrumb was not updated in top navbar!');
    }

    // Expand sidebar back
    await send('Runtime.evaluate', {
      expression: `(() => {
        const expandBtn = document.querySelector('button[title*="Mở rộng"]');
        if (expandBtn) expandBtn.click();
      })()`,
    });
    await new Promise((resolve) => setTimeout(resolve, 400));

    console.log('ALL RUNTIME VERIFICATION CHECKS PASSED WITH FLYING COLORS!');
    ws.close();
  } finally {
    chromeProcess.kill();
  }
}

run().catch((err) => {
  console.error('ERROR in verification suite:', err);
  process.exit(1);
});
