import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:5173';
const ASSETS_DIR = path.resolve('playstore_assets');

// Ensure output directories exist
const DIRS = [
  ASSETS_DIR,
  path.join(ASSETS_DIR, 'phone'),
  path.join(ASSETS_DIR, 'phone_raw'),
  path.join(ASSETS_DIR, 'tablet_7inch'),
  path.join(ASSETS_DIR, 'tablet_10inch'),
];

DIRS.forEach((d) => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

const SVG_LOGO = fs.readFileSync(path.resolve('public/gitaquest_logo.svg'), 'utf8');

async function renderIcon(browser, filename, bgColor, logoScale = 0.72) {
  const page = await browser.newPage();
  await page.setViewport({ width: 512, height: 512, deviceScaleFactor: 1 });

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          width: 512px;
          height: 512px;
          background: ${bgColor};
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .glow {
          position: absolute;
          width: 440px;
          height: 440px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(212, 163, 89, 0.22) 0%, rgba(212, 163, 89, 0) 70%);
        }
        .logo-box {
          position: relative;
          z-index: 2;
          width: ${Math.round(512 * logoScale)}px;
          height: ${Math.round(512 * logoScale)}px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        svg {
          width: 100%;
          height: 100%;
          filter: drop-shadow(0 8px 16px rgba(0,0,0,0.08));
        }
      </style>
    </head>
    <body>
      <div class="glow"></div>
      <div class="logo-box">
        ${SVG_LOGO}
      </div>
    </body>
    </html>
  `;

  await page.setContent(html, { waitUntil: 'load' });
  const outPath = path.join(ASSETS_DIR, filename);
  await page.screenshot({ path: outPath, type: 'png' });
  await page.close();
  console.log(`[✓] Generated App Icon: ${filename} (512x512)`);
}

async function renderFeatureGraphic(browser) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1024, height: 500, deviceScaleFactor: 1 });

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Yatra+One&display=swap" rel="stylesheet">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          width: 1024px;
          height: 500px;
          background: linear-gradient(135deg, #0D2218 0%, #153426 50%, #1A3E2F 100%);
          display: flex;
          align-items: center;
          padding: 0 60px;
          position: relative;
          overflow: hidden;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #FBF8F2;
        }
        /* Background sacred geometry rings */
        .ambient-glow {
          position: absolute;
          left: -40px;
          top: -40px;
          width: 580px;
          height: 580px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(212, 163, 89, 0.18) 0%, rgba(30, 58, 47, 0) 70%);
          pointer-events: none;
        }
        .ambient-glow-right {
          position: absolute;
          right: -80px;
          bottom: -80px;
          width: 460px;
          height: 460px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(224, 122, 40, 0.12) 0%, rgba(30, 58, 47, 0) 70%);
          pointer-events: none;
        }
        .left-col {
          width: 320px;
          height: 320px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 2;
          margin-right: 50px;
        }
        .left-col svg {
          width: 100%;
          height: 100%;
          filter: drop-shadow(0 14px 28px rgba(0, 0, 0, 0.35));
        }
        .right-col {
          flex: 1;
          position: relative;
          z-index: 2;
          display: flex;
          flex-col;
          gap: 12px;
        }
        .kicker {
          font-family: 'Yatra One', cursive;
          font-size: 16px;
          letter-spacing: 2px;
          color: #D4A359;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .kicker::before, .kicker::after {
          content: '•';
          color: #E07A28;
        }
        h1 {
          font-family: 'Cinzel', serif;
          font-size: 58px;
          font-weight: 700;
          letter-spacing: 1px;
          color: #FFFFFF;
          line-height: 1.05;
          text-shadow: 0 4px 16px rgba(0,0,0,0.3);
        }
        .tagline {
          font-size: 20px;
          font-weight: 600;
          color: #E8BD70;
          margin-top: 4px;
        }
        .desc {
          font-size: 14.5px;
          color: #CFDBD5;
          line-height: 1.45;
          max-width: 520px;
          margin-top: 2px;
        }
        .pills {
          display: flex;
          gap: 10px;
          margin-top: 14px;
        }
        .pill {
          padding: 6px 14px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(212, 163, 89, 0.35);
          color: #FBF8F2;
          backdrop-filter: blur(8px);
        }
        .pill.gold {
          background: #FFF5E6;
          color: #4A3828;
          border-color: #F3DCA7;
        }
      </style>
    </head>
    <body>
      <div class="ambient-glow"></div>
      <div class="ambient-glow-right"></div>

      <div class="left-col">
        ${SVG_LOGO}
      </div>

      <div class="right-col">
        <div class="kicker">श्रीमद्भगवद्गीता • Pure Scripture</div>
        <h1>GitaQuest</h1>
        <div class="tagline">Read. Reflect. Grow.</div>
        <p class="desc">
          All 701 sacred verses with authentic Sanskrit shlokas, Hindi arth & English meaning. Complete daily goals, maintain reading streaks, and earn your official completion certificate.
        </p>

        <div class="pills">
          <div class="pill gold">100% Ad-Free & Free</div>
          <div class="pill">701 Authentic Verses</div>
          <div class="pill">Daily Sadhana Streaks</div>
          <div class="pill">Official Certificate</div>
        </div>
      </div>
    </body>
    </html>
  `;

  await page.setContent(html, { waitUntil: 'networkidle0' });
  const outPath = path.join(ASSETS_DIR, 'feature_graphic_1024x500.png');
  await page.screenshot({ path: outPath, type: 'png' });
  await page.close();
  console.log('[✓] Generated Feature Graphic: feature_graphic_1024x500.png (1024x500)');
}

async function captureAppScreens(browser) {
  console.log('Capturing app screens via Puppeteer at high-resolution device scale...');
  const page = await browser.newPage();
  
  // Set viewport to modern Android phone ratio (412 x 915 with DPR 2.625 => exactly 1080 x 2400!)
  await page.setViewport({
    width: 412,
    height: 915,
    deviceScaleFactor: 2.625,
    isMobile: true,
    hasTouch: true,
  });

  await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

  // 1. Inject sample user progress into localStorage for lively store screenshots
  await page.evaluate(() => {
    const today = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const todayKey = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

    // Create 5 consecutive active days
    const dailyHistory = {};
    for (let i = 0; i < 5; i++) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const k = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
      dailyHistory[k] = ['2:47', '2:48', '2:49', '2:50', '2:51'];
    }

    const readVerses = {};
    for (let v = 1; v <= 47; v++) {
      readVerses[`1:${v}`] = true;
      if (v <= 47) readVerses[`2:${v}`] = true;
    }

    const mockProgress = {
      lastRead: { chapter: 2, verse: 47 },
      completedChapters: [1],
      celebratedChapters: [1],
      readVerses,
      dailyHistory,
      bookmarks: [
        {
          id: '2:47',
          chapter: 2,
          verse: 47,
          snippet: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन — You have a right to perform your duty...',
          timestamp: Date.now() - 3600000,
        },
      ],
      notes: {
        '2:47': {
          note: 'True freedom comes when action is offered with devotion without anxiety over outcomes.',
          timestamp: Date.now(),
        },
      },
      dailyGoal: { enabled: true, target: 5, purpose: 'Spiritual Peace & Clarity' },
      streak: { current: 5, longest: 5, lastActiveDate: todayKey },
      userName: 'Arjuna Devotee',
      hasCompletedOnboarding: true,
      certificateUnlockedAt: null,
      settings: {
        fontSize: 'normal',
        theme: 'temple',
        distractionFree: false,
        showTransliteration: true,
        showWordMeaning: false,
        autoMarkRead: true,
        languagePreference: 'all',
        visibleLanguages: {
          sanskrit: true,
          transliteration: true,
          hindi: true,
          english: true,
          wordMeaning: false,
        },
      },
    };

    localStorage.setItem('gitaquest_user_progress_v2', JSON.stringify(mockProgress));
  });

  // Reload to apply mock progress
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 600));

  // Screenshot 1: Home Screen
  const rawHome = path.join(ASSETS_DIR, 'phone_raw', '1_home.png');
  await page.screenshot({ path: rawHome });
  console.log('[✓] Captured Screen 1: Home');

  // Screenshot 2: Reader Screen (Click Continue Reading)
  await page.evaluate(() => {
    const h3 = document.querySelector('h3');
    if (h3) {
      const card = h3.closest('div.cursor-pointer') || h3.closest('div[class*="rounded"]') || h3;
      card.click();
    }
  });
  await new Promise((r) => setTimeout(r, 800));
  const rawReader = path.join(ASSETS_DIR, 'phone_raw', '2_reader.png');
  await page.screenshot({ path: rawReader });
  console.log('[✓] Captured Screen 2: Reader (Chapter 2:47 with Hindi & English)');

  // Close reader via back button
  await page.evaluate(() => {
    const backBtn = document.querySelector('header button');
    if (backBtn) backBtn.click();
  });
  await new Promise((r) => setTimeout(r, 600));

  // Screenshot 3: Chapters Screen
  await page.evaluate(() => {
    const navBtns = document.querySelectorAll('nav button');
    if (navBtns[1]) navBtns[1].click();
  });
  await new Promise((r) => setTimeout(r, 700));
  const rawChapters = path.join(ASSETS_DIR, 'phone_raw', '3_chapters.png');
  await page.screenshot({ path: rawChapters });
  console.log('[✓] Captured Screen 3: Chapters Catalog');

  // Screenshot 4: Journey Screen
  await page.evaluate(() => {
    const navBtns = document.querySelectorAll('nav button');
    if (navBtns[3]) navBtns[3].click();
  });
  await new Promise((r) => setTimeout(r, 700));
  const rawJourney = path.join(ASSETS_DIR, 'phone_raw', '4_journey.png');
  await page.screenshot({ path: rawJourney });
  console.log('[✓] Captured Screen 4: My Journey & Streak');

  // Screenshot 5: Certificate Preview
  await page.evaluate(() => {
    const allDivs = Array.from(document.querySelectorAll('div'));
    const cert = allDivs.find((d) => d.textContent.includes('Certificate of Completion') && d.classList.contains('cursor-pointer'));
    if (cert) cert.click();
  });
  await new Promise((r) => setTimeout(r, 900));
  const rawCert = path.join(ASSETS_DIR, 'phone_raw', '5_certificate.png');
  await page.screenshot({ path: rawCert });
  console.log('[✓] Captured Screen 5: Certificate Modal');

  await page.close();

  // Tablet Screenshots
  await captureTabletScreens(browser);
}

async function captureTabletScreens(browser) {
  // 7-inch tablet (600 x 960 @ 2x => 1200 x 1920)
  const page7 = await browser.newPage();
  await page7.setViewport({ width: 600, height: 960, deviceScaleFactor: 2, isMobile: true });
  await page7.goto(BASE_URL, { waitUntil: 'networkidle0' });
  await page7.screenshot({ path: path.join(ASSETS_DIR, 'tablet_7inch', '1_home_1200x1920.png') });

  await page7.evaluate(() => {
    const nav = document.querySelectorAll('nav button');
    if (nav[1]) nav[1].click();
  });
  await new Promise((r) => setTimeout(r, 600));
  await page7.screenshot({ path: path.join(ASSETS_DIR, 'tablet_7inch', '2_chapters_1200x1920.png') });

  await page7.evaluate(() => {
    const nav = document.querySelectorAll('nav button');
    if (nav[3]) nav[3].click();
  });
  await new Promise((r) => setTimeout(r, 600));
  await page7.screenshot({ path: path.join(ASSETS_DIR, 'tablet_7inch', '3_journey_1200x1920.png') });
  await page7.close();
  console.log('[✓] Captured 7-inch Tablet Screenshots (1200x1920)');

  // 10-inch tablet (800 x 1280 @ 2x => 1600 x 2560)
  const page10 = await browser.newPage();
  await page10.setViewport({ width: 800, height: 1280, deviceScaleFactor: 2, isMobile: true });
  await page10.goto(BASE_URL, { waitUntil: 'networkidle0' });
  await page10.screenshot({ path: path.join(ASSETS_DIR, 'tablet_10inch', '1_home_1600x2560.png') });

  await page10.evaluate(() => {
    const nav = document.querySelectorAll('nav button');
    if (nav[3]) nav[3].click();
  });
  await new Promise((r) => setTimeout(r, 600));
  await page10.screenshot({ path: path.join(ASSETS_DIR, 'tablet_10inch', '2_journey_1600x2560.png') });
  await page10.close();
  console.log('[✓] Captured 10-inch Tablet Screenshots (1600x2560)');
}

async function composeShowcaseSlides(browser) {
  console.log('Composing 1080x2400 Play Store Showcase Slides...');

  const slides = [
    {
      title: 'DAILY SHLOKA & SADHANA',
      sub: 'Read, reflect and cultivate inner peace daily',
      raw: 'phone_raw/1_home.png',
      out: 'phone/1_home_1080x2400.png',
      accent: '#D4A359',
    },
    {
      title: 'TRIPLE-LANGUAGE MEANING',
      sub: 'Pure Sanskrit shloka, Hindi arth & English meaning',
      raw: 'phone_raw/2_reader.png',
      out: 'phone/2_reader_1080x2400.png',
      accent: '#64B587',
    },
    {
      title: 'ALL 18 SACRED CHAPTERS',
      sub: 'All 701 authentic verses indexed chapter-by-chapter',
      raw: 'phone_raw/3_chapters.png',
      out: 'phone/3_chapters_1080x2400.png',
      accent: '#D4A359',
    },
    {
      title: 'TRACK HABITS & STREAKS',
      sub: 'Daily reading streaks and 7-day Sadhana activity matrix',
      raw: 'phone_raw/4_journey.png',
      out: 'phone/4_journey_1080x2400.png',
      accent: '#E07A28',
    },
    {
      title: 'OFFICIAL CERTIFICATE',
      sub: 'Earn a personalized milestone for completing all 18 chapters',
      raw: 'phone_raw/5_certificate.png',
      out: 'phone/5_certificate_1080x2400.png',
      accent: '#D4A359',
    },
  ];

  for (const s of slides) {
    const rawData = fs.readFileSync(path.join(ASSETS_DIR, s.raw));
    const base64Img = `data:image/png;base64,${rawData.toString('base64')}`;

    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 2400, deviceScaleFactor: 1 });

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet">
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            width: 1080px;
            height: 2400px;
            background: linear-gradient(180deg, #10241A 0%, #153426 30%, #FBF8F2 75%, #F4EFE6 100%);
            font-family: 'Plus Jakarta Sans', sans-serif;
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          /* Top background decorative glow */
          .glow {
            position: absolute;
            top: -120px;
            width: 800px;
            height: 800px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(212, 163, 89, 0.22) 0%, rgba(16, 36, 26, 0) 70%);
          }
          .header-box {
            position: relative;
            z-index: 2;
            width: 900px;
            text-align: center;
            padding-top: 110px;
            margin-bottom: 50px;
          }
          .kicker {
            font-family: 'Cinzel', serif;
            font-size: 32px;
            letter-spacing: 4px;
            color: ${s.accent};
            font-weight: 700;
            text-transform: uppercase;
            margin-bottom: 12px;
          }
          .subtitle {
            font-size: 27px;
            font-weight: 500;
            color: #CFDBD5;
            line-height: 1.35;
          }
          /* Phone Frame Container */
          .phone-frame {
            position: relative;
            z-index: 3;
            width: 880px;
            height: 1950px;
            background: #FFFFFF;
            border-radius: 52px 52px 0 0;
            box-shadow: 0 30px 90px rgba(0, 0, 0, 0.45), 0 0 0 12px #26382E;
            overflow: hidden;
            border-top: 8px solid rgba(255, 255, 255, 0.2);
          }
          .phone-frame img {
            width: 100%;
            height: auto;
            display: block;
          }
        </style>
      </head>
      <body>
        <div class="glow"></div>
        <div class="header-box">
          <div class="kicker">${s.title}</div>
          <div class="subtitle">${s.sub}</div>
        </div>
        <div class="phone-frame">
          <img src="${base64Img}" alt="Screenshot" />
        </div>
      </body>
      </html>
    `;

    await page.setContent(html, { waitUntil: 'load' });
    const outPath = path.join(ASSETS_DIR, s.out);
    await page.screenshot({ path: outPath, type: 'png' });
    await page.close();
    console.log(`[✓] Generated Showcase Slide: ${s.out} (1080x2400)`);
  }
}

async function main() {
  console.log('======================================================');
  console.log('   GitaQuest Google Play Store Graphics Generator     ');
  console.log('======================================================');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    // 1. App Icons
    await renderIcon(browser, 'icon_512x512.png', '#FBF8F2', 0.72);
    await renderIcon(browser, 'icon_dark_512x512.png', '#132B20', 0.72);

    // 2. Feature Graphic Banner
    await renderFeatureGraphic(browser);

    // 3. Capture App Screens
    await captureAppScreens(browser);

    // 4. Compose Google Play Showcase Slides
    await composeShowcaseSlides(browser);

    console.log('\n======================================================');
    console.log(' [✓] ALL GOOGLE PLAY STORE ASSETS GENERATED!          ');
    console.log('======================================================');
    console.log(`Assets Folder: ${ASSETS_DIR}`);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error('Fatal error during assets generation:', err);
  process.exit(1);
});
