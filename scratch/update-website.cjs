const fs = require('fs');
const path = require('path');

const srcDir = '/Users/apple/Documents/dinelabs/Dinelabs Website Design';
let homeHtml = fs.readFileSync(path.join(srcDir, 'Dinelabs Website.dc.html'), 'utf8');
let demoHtml = fs.readFileSync(path.join(srcDir, 'Book a Demo.dc.html'), 'utf8');

// Update links in homeHtml
homeHtml = homeHtml.replace(/href=["']Book%20a%20Demo\.dc\.html["']/g, 'href="/book-a-demo"');
homeHtml = homeHtml.replace(/href=["']Book a Demo\.dc\.html["']/g, 'href="/book-a-demo"');
homeHtml = homeHtml.replace(/src=["']\.\/support\.js["']/g, 'src="/support.js"');
homeHtml = homeHtml.replace(/src=["']translations\.js["']/g, 'src="/translations.js"');
homeHtml = homeHtml.replace(/src=["']assets\//g, 'src="/assets/');

// Update links in demoHtml
demoHtml = demoHtml.replace(/href=["']Dinelabs%20Website\.dc\.html["']/g, 'href="/"');
demoHtml = demoHtml.replace(/href=["']Dinelabs Website\.dc\.html["']/g, 'href="/"');
demoHtml = demoHtml.replace(/src=["']\.\/support\.js["']/g, 'src="/support.js"');
demoHtml = demoHtml.replace(/src=["']translations\.js["']/g, 'src="/translations.js"');
demoHtml = demoHtml.replace(/src=["']assets\//g, 'src="/assets/');

// Autofill CSS override
const oldAutofillCss = 'input:-webkit-autofill,textarea:-webkit-autofill{-webkit-text-fill-color:#fff;transition:background-color 99999s ease-in-out 0s}';
const newAutofillCss = 'input:-webkit-autofill,input:-webkit-autofill:hover,input:-webkit-autofill:focus,textarea:-webkit-autofill,textarea:-webkit-autofill:hover,textarea:-webkit-autofill:focus{-webkit-text-fill-color:#ffffff !important;-webkit-box-shadow:0 0 0px 1000px #18181b inset !important;box-shadow:0 0 0px 1000px #18181b inset !important;transition:background-color 50000s ease-in-out 0s !important;caret-color:#ffffff !important;}';

homeHtml = homeHtml.replace(oldAutofillCss, newAutofillCss);
demoHtml = demoHtml.replace(oldAutofillCss, newAutofillCss);

// Add videoUrl property to renderVals in homeHtml
const videoUrlExpr = "videoUrl: this.state.lang === 'ka' ? 'https://pub-9d959c9510754a61931824831d10774c.r2.dev/Dinelabs%20-%20Video%20GE%20Fixed.mp4' : 'https://pub-9d959c9510754a61931824831d10774c.r2.dev/Dinelabs%20-%20Video%20English.mp4',";
homeHtml = homeHtml.replace('rootRef: this.rootRef,', 'rootRef: this.rootRef,\n      ' + videoUrlExpr);

// Update openVideo / closeVideo implementation to stop playback on close
const oldCloseVideo = `closeVideo = () => {
    document.body.style.overflow = '';
    this.setState({ videoOpen: false });
  };`;

const newCloseVideo = `closeVideo = () => {
    document.body.style.overflow = '';
    try {
      const vs = document.querySelectorAll('.video-modal-box video');
      vs.forEach(v => { v.pause(); v.currentTime = 0; });
    } catch (_) {}
    this.setState({ videoOpen: false });
  };`;

homeHtml = homeHtml.replace(oldCloseVideo, newCloseVideo);

// Update Hero Visual button to include video element background preview
const oldHeroVisual = `<div data-reveal data-reveal-from="right" data-r="herovisual" style="position:relative;aspect-ratio:16/9;width:100%">
        <button onClick="{{ openVideo }}" aria-label="Play Dinelabs explainer video" style="position:absolute;inset:0;border:1px solid var(--line);border-radius:18px;overflow:hidden;padding:0;cursor:pointer;background:linear-gradient(135deg,#1a1a1f 0%,#2a2a32 55%,#3a2820 100%);box-shadow:0 40px 80px -36px rgba(17,17,20,.5),0 12px 28px -14px rgba(17,17,20,.18)" style-hover="transform:translateY(-2px)">`;

const newHeroVisual = `<div data-reveal data-reveal-from="right" data-r="herovisual" style="position:relative;aspect-ratio:16/9;width:100%">
        <button onClick="{{ openVideo }}" aria-label="Play Dinelabs explainer video" style="position:absolute;inset:0;border:1px solid var(--line);border-radius:18px;overflow:hidden;padding:0;cursor:pointer;background:#000;box-shadow:0 40px 80px -36px rgba(17,17,20,.5),0 12px 28px -14px rgba(17,17,20,.18)" style-hover="transform:translateY(-2px)">
          <video autoplay="autoplay" loop="loop" muted="muted" playsinline="playsinline" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0.65" src="{{ videoUrl }}"></video>`;

homeHtml = homeHtml.replace(oldHeroVisual, newHeroVisual);

// Update Video Modal content to include full controls and stopBubble container class
const oldModalContent = `<div style="position:absolute;inset:0;background:radial-gradient(140% 90% at 50% 20%,#1c1c22,#0a0a0c 70%)"></div>
        <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;color:#9a9aa1;text-align:center;padding:32px">
          <div style="width:88px;height:88px;border-radius:50%;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);display:flex;align-items:center;justify-content:center"><svg viewBox="0 0 24 24" width="36" height="36" fill="#fff" style="margin-left:3px"><path d="M8 5v14l11-7z"/></svg></div>
          <div style="font-size:20px;color:#fff;font-weight:700;letter-spacing:-.01em">Video placeholder</div>
          <div style="font-size:15px;font-weight:500;max-width:380px;line-height:1.45">Drop the Dinelabs explainer video here. Press Esc or click outside to close.</div>
        </div>`;

const newModalContainer = `<div className="video-modal-box" onClick="{{ stopBubble }}" style="position:relative;width:100%;max-width:1080px;aspect-ratio:16/9;border-radius:20px;background:#000;overflow:hidden;box-shadow:0 60px 140px -20px rgba(0,0,0,.6);animation:modalIn .4s cubic-bezier(.2,.7,.2,1)">
        <video controls="controls" autoplay="autoplay" playsinline="playsinline" style="width:100%;height:100%;object-fit:contain;background:#000;outline:none" src="{{ videoUrl }}"></video>
      </div>`;

homeHtml = homeHtml.replace('<div onClick="{{ stopBubble }}" style="position:relative;width:100%;max-width:1080px;aspect-ratio:16/9;border-radius:20px;background:#0a0a0c;overflow:hidden;box-shadow:0 60px 140px -20px rgba(0,0,0,.6);animation:modalIn .4s cubic-bezier(.2,.7,.2,1)">\n        ' + oldModalContent + '\n      </div>', newModalContainer);

// Enhance onSubmit in demoHtml
const oldOnSubmit = `onSubmit: (e) => {
        e.preventDefault();
        let nm = '';
        try { nm = (e.target.querySelector('[name=name]') || {}).value || ''; } catch (_) {}
        this.setState({ submitted: true, name: nm.trim().split(' ')[0] });
        try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (_) {}
      },`;

const newOnSubmit = `onSubmit: (e) => {
        e.preventDefault();
        let nm = '', em = '', ph = '', biz = '', loc = '';
        try {
          const form = e.target;
          nm = (form.querySelector('[name=name]') || {}).value || '';
          em = (form.querySelector('[name=email]') || {}).value || '';
          ph = (form.querySelector('[name=phone]') || {}).value || '';
          biz = (form.querySelector('[name=business]') || {}).value || '';
          loc = (form.querySelector('[name=location]') || {}).value || '';
        } catch (_) {}
        try {
          fetch('/api/support', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ticketNo: 'DEMO-' + Math.floor(1000 + Math.random() * 9000),
              name: nm,
              reachMethod: 'email',
              phone: ph,
              email: em,
              message: 'BOOK A DEMO REQUEST. Store: ' + biz + '. Location: ' + loc
            })
          });
        } catch (_) {}
        this.setState({ submitted: true, name: nm.trim().split(' ')[0] });
        try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (_) {}
      },`;

demoHtml = demoHtml.replace(oldOnSubmit, newOnSubmit);

// Add Favicon link elements in head or helmet
const faviconTags = `<link rel="icon" type="image/svg+xml" href="/assets/dinelabs-logo.svg">\n<link rel="alternate icon" type="image/png" href="/assets/dinelabs-logo.png">\n<title>Dinelabs — Restaurant Operating System</title>`;
const demoFaviconTags = `<link rel="icon" type="image/svg+xml" href="/assets/dinelabs-logo.svg">\n<link rel="alternate icon" type="image/png" href="/assets/dinelabs-logo.png">\n<title>Book a Demo — Dinelabs</title>`;

homeHtml = homeHtml.replace('<head>', '<head>\n' + faviconTags);
demoHtml = demoHtml.replace('<head>', '<head>\n' + demoFaviconTags);
homeHtml = homeHtml.replace('<helmet>', '<helmet>\n' + faviconTags);
demoHtml = demoHtml.replace('<helmet>', '<helmet>\n' + demoFaviconTags);

const outDir = '/Users/apple/Documents/dinelabs/public/website-processed';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'home.html'), homeHtml, 'utf8');
fs.writeFileSync(path.join(outDir, 'demo.html'), demoHtml, 'utf8');
console.log('Successfully updated home.html and demo.html with video controls and stop playback on close!');
