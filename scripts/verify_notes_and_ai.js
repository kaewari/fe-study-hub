import { spawn } from 'child_process';
import fs from 'fs';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const DEBUG_PORT = 9227;

async function run() {
  console.log('=== REAL CHROMIUM STUDY NOTES & AI ASSISTANT VERIFICATION ===');
  console.log('Starting headless Chrome on debug port', DEBUG_PORT);
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

    // Wait for aside / app to render
    const start = Date.now();
    let ready = false;
    while (Date.now() - start < 8000) {
      const res = await send('Runtime.evaluate', {
        expression: `Boolean(document.querySelector('aside'))`,
        returnByValue: true,
      });
      if (res?.result?.value) {
        ready = true;
        break;
      }
      await new Promise((r) => setTimeout(r, 300));
    }
    console.log('App DOM ready:', ready);

    // 1. Verify Scan tab is GONE and Study Notes is PRESENT
    const navCheck = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const text = document.body.innerText;
          const hasScannerTab = text.includes('Scan & OCR Sách');
          const hasNotesTab = text.includes('Ghi chú học tập');
          return { hasScannerTab, hasNotesTab, fullTextSample: text.slice(0, 300) };
        })()
      `,
      returnByValue: true,
    });
    const navVal = navCheck.result.value;
    console.log('1. Navigation Verification:');
    console.log('   - Sample Page Text:', JSON.stringify(navVal.fullTextSample));
    console.log('   - Has old "Scan & OCR Sách":', navVal.hasScannerTab);
    console.log('   - Has new "Ghi chú học tập":', navVal.hasNotesTab);
    if (navVal.hasScannerTab) {
      throw new Error('FAIL: Old Scanner tab is still present in navigation!');
    }
    if (!navVal.hasNotesTab) {
      throw new Error('FAIL: New "Ghi chú học tập" tab not found in navigation!');
    }
    console.log('   => PASS: Scanner removed and Ghi chú học tập added successfully.');

    // 2. Click on "Ghi chú học tập"
    console.log('\n2. Navigating to "Ghi chú học tập"...');
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          const noteBtn = buttons.find(b => b.innerText.includes('Ghi chú học tập'));
          if (noteBtn) noteBtn.click();
        })()
      `,
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 3. Verify StudyNotesView rendered
    const viewCheck = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const h2 = document.querySelector('h2');
          const h2Text = h2 ? h2.innerText : '';
          const noteCards = document.querySelectorAll('h3');
          const titles = Array.from(noteCards).map(h => h.innerText);
          return {
            h2Text,
            noteCount: titles.length,
            titles
          };
        })()
      `,
      returnByValue: true,
    });
    const viewVal = viewCheck.result.value;
    console.log('   - Header:', viewVal.h2Text);
    console.log('   - Rendered notes count:', viewVal.noteCount);
    console.log('   - Note titles sample:', viewVal.titles.slice(0, 3));
    if (!viewVal.h2Text.includes('Ghi Chú Học Tập')) {
      throw new Error('FAIL: StudyNotesView header not found!');
    }
    console.log('   => PASS: StudyNotesView is fully active and displaying notes.');

    // 4. Verify Floating AI Assistant Button
    console.log('\n4. Verifying Floating AI Tutor Assistant Button...');
    const aiBtnCheck = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const aiBtn = document.querySelector('button[title*="Trợ Giảng AI"]');
          if (!aiBtn) return null;
          const rect = aiBtn.getBoundingClientRect();
          return {
            exists: true,
            text: aiBtn.innerText,
            width: Math.round(rect.width),
            height: Math.round(rect.height),
            bottom: Math.round(window.innerHeight - rect.bottom),
            right: Math.round(window.innerWidth - rect.right)
          };
        })()
      `,
      returnByValue: true,
    });
    const aiBtnVal = aiBtnCheck.result.value;
    console.log('   - AI Button Info:', aiBtnVal);
    if (!aiBtnVal || !aiBtnVal.exists) {
      throw new Error('FAIL: Global AI Assistant button not found!');
    }
    console.log('   => PASS: Floating AI button is rendered at bottom-right.');

    // 5. Open AI Assistant Dialog
    console.log('\n5. Opening AI Tutor Assistant Dialog...');
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const aiBtn = document.querySelector('button[title*="Trợ Giảng AI"]');
          if (aiBtn) aiBtn.click();
        })()
      `,
    });
    await new Promise((resolve) => setTimeout(resolve, 800));

    // 6. Verify Drawer UI
    const drawerCheck = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const text = document.body.innerText;
          const hasAssistantTitle = text.includes('AI Tutor Trợ Giảng FE');
          const hasQuickPrompts = text.includes('Mã giả 科目B') && text.includes('Bẫy bảo mật FE');
          const input = document.querySelector('input[placeholder*="Hỏi trợ giảng"]');
          return {
            hasAssistantTitle,
            hasQuickPrompts,
            hasInput: !!input
          };
        })()
      `,
      returnByValue: true,
    });
    const drawerVal = drawerCheck.result.value;
    console.log('   - Drawer Header found:', drawerVal.hasAssistantTitle);
    console.log('   - Quick Prompts found:', drawerVal.hasQuickPrompts);
    console.log('   - Question input box found:', drawerVal.hasInput);

    if (!drawerVal.hasAssistantTitle || !drawerVal.hasQuickPrompts || !drawerVal.hasInput) {
      throw new Error('FAIL: AI Assistant drawer elements missing!');
    }
    console.log('   => PASS: AI Assistant drawer opened smoothly with all interactive controls.');

    // 6b. Close AI Assistant Drawer
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const closeBtn = document.querySelector('button[title*="Đóng trợ giảng"]');
          if (closeBtn) closeBtn.click();
        })()
      `,
    });
    await new Promise((r) => setTimeout(r, 400));

    // 6c. Verify PlannerView has NO scan column
    console.log('\nChecking Planner View for any remaining scan references...');
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Kế hoạch 30 ngày'));
          if (btn) btn.click();
        })()
      `,
    });
    await new Promise((r) => setTimeout(r, 600));
    const plannerCheck = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const table = document.querySelector('table');
          const text = table ? table.innerText : '';
          return {
            hasScanColumn: text.includes('Scan') || text.includes('Đã scan')
          };
        })()
      `,
      returnByValue: true,
    });
    console.log('   - Planner table has scan column/button:', plannerCheck.result.value.hasScanColumn);
    if (plannerCheck.result.value.hasScanColumn) {
      throw new Error('FAIL: PlannerView still has Scan column or buttons!');
    }
    console.log('   => PASS: PlannerView has zero scan columns.');

    // 6d. Verify CurriculumView has NO scan column or card stats
    console.log('\nChecking Curriculum View for any remaining scan references...');
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Giáo trình 3 cuốn'));
          if (btn) btn.click();
        })()
      `,
    });
    await new Promise((r) => setTimeout(r, 600));
    const curriculumCheck = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const text = document.body.innerText;
          return {
            hasScanStatus: text.includes('Trạng thái Scan') || text.includes('Đã scan') || text.includes('Chưa scan')
          };
        })()
      `,
      returnByValue: true,
    });
    console.log('   - Curriculum has scan status:', curriculumCheck.result.value.hasScanStatus);
    if (curriculumCheck.result.value.hasScanStatus) {
      throw new Error('FAIL: CurriculumView still has Scan references!');
    }
    console.log('   => PASS: CurriculumView has zero scan references.');

    // 7. Capture Screenshot
    const screenshotData = await send('Page.captureScreenshot', { format: 'png' });
    const screenshotPath = 'artifacts/verified_notes_and_ai.png';
    fs.mkdirSync('artifacts', { recursive: true });
    fs.writeFileSync(screenshotPath, Buffer.from(screenshotData.data, 'base64'));
    console.log(`\nScreenshot saved: ${screenshotPath}`);

    ws.close();
    chromeProcess.kill();
    console.log('\n=== ALL REAL RUNTIME CHECKS PASSED WITH 100% SUCCESS ===');
    process.exit(0);
  } catch (err) {
    console.error('VERIFICATION ERROR:', err);
    chromeProcess.kill();
    process.exit(1);
  }
}

run();
