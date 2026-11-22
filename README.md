# Untouch Flow (Auto Scroll • Auto Next)

<p align="center">
  <img src="icons/icon128.png" alt="Untouch Flow Logo" width="96" height="96">
</p>

<p align="center">
  <strong>Silky-smooth hands-free auto-scroller for Manga, Webtoons, Light Novels, and Articles.</strong><br>
  Featuring 60fps sub-pixel scrolling, smart auto-next chapter detection, manga page zoom, and compact on-page MiniTool.
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#installation">Installation</a> •
  <a href="#supported-platforms">Platforms</a> •
  <a href="#shortcuts">Shortcuts</a> •
  <a href="#github-topics--tags">Tags</a> •
  <a href="#privacy--license">License</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Version-2.0.0-indigo.svg" alt="Version">
  <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License">
  <img src="https://img.shields.io/badge/Stack-Vanilla%20JS%20(Zero--Build)-green.svg" alt="Stack">
  <img src="https://img.shields.io/badge/Browsers-Chrome%20%7C%20Edge%20%7C%20Firefox%20%7C%20Safari-orange.svg" alt="Browsers">
  <img src="https://img.shields.io/badge/Languages-13%20Languages-violet.svg" alt="Languages">
  <img src="https://img.shields.io/badge/Size-%3C100KB-success.svg" alt="Size">
</p>

---

## 🌟 Why Untouch Flow?

Tired of manually scrolling hundreds of long webtoon panels and hunting for the "Next Chapter" button at the bottom of every page? 

**Untouch Flow** is built from the ground up to deliver a truly hands-free, ergonomic reading experience across desktop computers, tablets, smartphones, and even Smart TVs.

---

## ✨ Key Features

### 1. 🚀 60fps Sub-Pixel Scrolling Engine
- Smooth, micro-step scrolling powered by `requestAnimationFrame`.
- Sub-pixel accumulator eliminates jitter and eye fatigue.
- Granular speed control from `10` to `2000` px/s with instant presets.

### 2. ⏩ Smart Auto-Next Chapter Navigator
- Automatically scans and verifies bottom lazy-loaded images.
- Intelligently detects next-chapter links (`MangaReader CMS`, `ts_reader`, `WordPress`, semantic links, and URL increment fallback).
- Configurable **Next Chapter Delay** (default: `1s`) with live countdown and one-click abort.

### 3. 🔍 Manga Page Zoom & Width Scaling
- Built specifically for wide desktop monitors.
- Scale manga panels (`70%`, `85%`, `100%`, `120%`) to keep imagery centered in your direct vision without neck strain or eye-scanning fatigue.
- Instant zoom cycle button directly on the floating MiniTool (`100%` ➔ `85%` ➔ `70%` ➔ `120%`).

### 4. 📖 Dedicated Manga & Reader Modes
- **🖼️ Manga Mode**: Vertical continuous reading with smart chapter advance.
- **📖 Reader Mode**: Perfect for web novels, news articles, and web PDFs. Disables chapter jumping, switches to relaxed reading speeds (`35-150` px/s), and supports PDF stop-page limits.

### 5. 🎛️ On-Page MiniTool Controller
- Ultra-compact floating pill (~240px) that stays seamlessly on top of reading content.
- Fully draggable with intelligent **Responsive Auto-Clamping** (never clips or overflows off-screen when resizing or zooming).
- **Dim on Scroll**: Automatically dims to 15% opacity during active reading so panels and dialogue remain unobstructed.

### 6. 📁 Multi-Profile System
- Create and customize profiles (`Profile 1`, `Profile 2`, etc.) with independent speeds, delays, and modes.
- Link website domains to profiles for automatic per-site recall.
- Clean dropdown selector that never clutters the interface.

### 7. 🌐 Built-in 13 Languages
Instant flag-switcher supporting:
🇬🇧 English • 🇹🇭 ไทย • 🇯🇵 日本語 • 🇰🇷 한국어 • 🇨🇳 中文 • 🇸🇦 العربية • 🇷🇺 Русский • 🇩🇪 Deutsch • 🇮🇹 Italiano • 🇪🇸 Español • 🇻🇳 Tiếng Việt • 🇲🇾 Bahasa Melayu • 🇮🇩 Bahasa Indonesia

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action | Description |
| :--- | :--- | :--- |
| <kbd>Space</kbd> / <kbd>Alt + S</kbd> | **Play / Pause** | Toggle scrolling on/off immediately |
| <kbd>↑</kbd> (Arrow Up) | **Speed +20** | Increase scroll speed by 20 px/s |
| <kbd>↓</kbd> (Arrow Down) | **Speed -20** | Decrease scroll speed by 20 px/s |
| <kbd>Alt + H</kbd> | **Toggle MiniTool** | Hide or show the on-page floating controller |
| <kbd>Esc</kbd> | **Stop** | Stop scrolling and reset bottom verification |

---

## 📱 Supported Platforms & Installation

Untouch Flow provides 100% coverage across all devices:

### 1. Desktop (Chrome, Brave, Edge, Opera, Vivaldi)
1. Download or clone this repository.
2. Navigate to `chrome://extensions` or `edge://extensions` or `brave://extensions`.
3. Enable **Developer mode** (top right).
4. Click **Load unpacked** and select the repository root directory.
5. Pin the extension to your toolbar.

### 2. Mozilla Firefox (Desktop & Android Nightly)
1. Download `for-firefox/manga-flow-scroller-firefox.zip` from this repo.
2. In Firefox, visit `about:debugging#/runtime/this-firefox`.
3. Click **Load Temporary Add-on...** and select the zip file.
*(Or install directly once published on Mozilla Add-ons AMO)*.

### 3. iPhone & iPad (Safari via Userscripts)
1. Install **Userscripts** (Free on Apple App Store).
2. Enable Userscripts in Safari Settings: `Settings > Safari > Extensions > Userscripts > Allow`.
3. Tap the Userscripts extension in Safari and place [manga-flow-scroller.user.js](manga-flow-scroller.user.js) into your Userscripts directory.
4. Open any manga site in Safari — Untouch Flow will activate automatically!

### 4. iPhone & iPad (Orion Browser)
1. Install **Orion Browser** from App Store.
2. Go to `Settings > Extensions > Install Chrome / Firefox Extension`.
3. Load Untouch Flow to enjoy desktop-class extension support on iOS!

### 5. Android Phone, Tablet & Android TV (Kiwi Browser)
1. Install **Kiwi Browser** (supports desktop Chrome extensions).
2. Visit `chrome://extensions`, enable **Developer mode**, and select **(from .zip / .crx / dir)**.
3. Perfect for reading webtoons on Android tablets and TV Boxes using an Air Mouse or remote control.

### 6. Universal Bookmarklet (Any Browser / Any Device)
No extensions required! Works on any browser:
1. Open [bookmarklet.txt](bookmarklet.txt) and copy the entire `javascript:...` code.
2. Create a new bookmark in your browser, set the URL to the copied code.
3. Tap the bookmark on any webpage to instantly launch the MiniTool!

---

## 🏗️ Technical Architecture

Untouch Flow is strictly engineered with **zero build dependencies**:
- **Vanilla ES2022 JavaScript** (No Webpack, No Vite, No Babel, No npm dependencies).
- **Shadow DOM Isolation**: The MiniTool is mounted inside a closed/isolated Shadow Root, preventing website CSS conflicts.
- **Chrome Storage API with LocalStorage Fallback**: Works transparently as an unpacked extension, a Userscript, or a Bookmarklet.
- Total package size is **under 100 KB** for instant loading and zero memory overhead.

```text
Untouch-AutoScrollAutoNext/
├── manifest.json              # WebExtension Manifest V3
├── content.js                 # 60fps Scroller, Auto-Next Detector & MiniTool
├── content.css                # Scroller styles
├── popup.html                 # Modern Minimal Popup UI
├── popup.css                  # Popup styles & segmented controls
├── popup.js                   # Popup controller & 13-language i18n
├── manga-flow-scroller.user.js # Standalone script for Safari iOS & Tampermonkey
├── bookmarklet.txt            # Zero-install universal bookmarklet
├── for-firefox/               # Packaged zip for Firefox AMO
├── icons/                     # Multi-resolution icons (16, 48, 128)
├── INSTALL_GUIDE.md           # Comprehensive multi-platform installation manual
├── STORE_SUBMISSION_GUIDE.md  # Microsoft Edge & Firefox store listing metadata
└── README.md                  # Project overview
```

---

## 🏷️ GitHub Topics / Tags

When creating the repository on GitHub, add these topics in the **About** settings (gear icon) on the repository page:

```text
manga-reader, auto-scroll, webtoon, manga, autoscroll, chrome-extension, edge-extension, firefox-addon, safari-ios, userscript, bookmarklet, reader-mode, light-novel, accessibility, touchless
```

---

## 🔒 Privacy Policy

Untouch Flow respects your privacy:
- **No Tracking**: No telemetry, tracking, or remote network requests.
- **Local Only**: All settings and profiles are stored locally via `chrome.storage.local`.
- Read the full [Privacy Policy in STORE_SUBMISSION_GUIDE.md](STORE_SUBMISSION_GUIDE.md).

---

## ☕ Support & Donations

Untouch Flow is open-source and free for all readers. If this extension brings convenience to your reading routine, you can support further development:

- **PromptPay (Thailand)**: Scan via mobile banking app
- **Buy Me a Coffee**: [buymeacoffee.com](https://www.buymeacoffee.com)

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for details.
