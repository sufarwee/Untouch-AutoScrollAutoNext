# 🚀 Untouch Flow

> **Hands-free, buttery-smooth reading in your browser: blogs, manga, feeds, and documents.**  
> Crafted with **Pure Vanilla JavaScript (Zero Build, Zero Dependencies, <100KB)**.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Pure Vanilla JS](https://img.shields.io/badge/Stack-Vanilla%20JS%20(No%20npm)-f7df1e.svg?logo=javascript&logoColor=black)](content.js)
[![60fps Precision](https://img.shields.io/badge/Physics-60fps%20Sub--Pixel-emerald.svg)](content.js)
[![Universal](https://img.shields.io/badge/Platforms-Chrome%20%7C%20Edge%20%7C%20Firefox%20%7C%20Safari%20iOS%20%7C%20Android-orange.svg)](#-universal-platform-support)
[![Languages](https://img.shields.io/badge/i18n-13%20Languages-indigo.svg)](#-multilingual-out-of-the-box)

---

## 📖 Built For Reading In The Browser

Untouch Flow is made for **reading**: long **blog posts**, **manga & webtoons**, **feeds**, and **documents** you open in a browser tab.

Two modes:
- **Manga Mode**: continuous scrolling, finds the *Next chapter* button (many languages, link/button/icon/class signals) and continues by itself.
- **Reader Mode** (blogs, news, Medium, documents shown in the page, **AI chats** such as ChatGPT, Gemini, Claude, Copilot, DeepSeek, Kimi, Qwen): scrolls the page or the chat pane (picked automatically), stops at the end, never navigates away. It only scrolls the page for you. It does not read, collect, or send your content anywhere.

**Good to know**
- **MangaPlus** (`mangaplus.shueisha.co.jp`) is supported: it finds the "To Chapter #N" button and continues automatically.
- **PDF:** only PDFs shown as a web page work (for example the pdf.js viewer at `mozilla.github.io/pdf.js/web/viewer.html`, then use *Open file*). The built-in PDF viewer of Chrome, Brave and Edge is a protected browser page that extensions cannot scroll.

---

## ⚡ The Story Behind Untouch Flow

Most auto-scroll extensions out there feel clunky, laggy, and bloated. They use crude `setInterval` timers, choke your CPU, and break whenever a manga chapter finishes.

We built **Untouch Flow** because we wanted something genuinely **flawless**:
- 🛑 **Zero Bloatware**: No `npm install`, no 500MB `node_modules`, no Webpack/Vite overhead. Pure modern ES2022.
- ⚡ **Instant Execution**: Loads in under `5ms` and consumes virtually zero memory.
- 🎯 **Total Autonomy**: It scrolls smoothly, waits for lazy-loaded images, finds the next chapter button automatically, and navigates without you ever touching your mouse or trackpad.

Grab your coffee, sit back, and just read.

---

## 🧠 Under The Hood: Why It Feels So Good

Here is what makes Untouch Flow technically distinct from anything else:

### 1. 🏎️ Sub-Pixel 60fps Physics Engine
Standard browser scrollers call `window.scrollBy(0, speed)`. But screens don't render fractional pixels evenly, causing micro-stutter and eye strain.
Untouch Flow implements an **internal sub-pixel accumulator** synchronized directly with your display's vertical refresh cycle via `requestAnimationFrame`:
```javascript
// Real 60fps micro-stepping with sub-pixel preservation
const delta = (ts - this.lastTs) / 1000;
this.subPixelAccumulator += this.speed * delta;
const pixelsToScroll = Math.floor(this.subPixelAccumulator);
this.subPixelAccumulator -= pixelsToScroll;
window.scrollBy(0, pixelsToScroll);
```
Result? **Silky-smooth visual fluidity** that feels like watching a movie camera glide down the page.

### 2. 🛡️ Encapsulated Shadow DOM Architecture
The on-page **MiniTool** floating controller lives inside an isolated `attachShadow({ mode: 'open' })` tree with strict CSS resets. No matter how poorly coded or aggressive the host manga site's stylesheet is, it can **never break or bleed into our UI**.

### 3. 🔍 Smart Heuristic Chapter Detection
Scanlation sites use wildly different CMS engines. Untouch Flow embeds a multi-layered heuristic detector:
1. **CMS Internal Runtime**: Hooks into WordPress MangaReader and `ts_reader.run` configurations for 100% exact next-chapter URLs.
2. **Semantic Rel-Tags**: Inspects `link[rel="next"]` and `a[rel="next"]`.
3. **Multilingual Text Analysis**: Evaluates button contexts in Thai, English, Japanese, and Korean.
4. **URL Pattern Fallback**: Increments chapter slugs when buttons are obfuscated.

### 4. 📐 Manga Width Scaling (Page Zoom)
Reading tall webtoon strips on a 27" or 34" ultrawide monitor is painful because panels stretch edge-to-edge. Untouch Flow injects dynamic container constraints to scale manga imagery (`70%`, `85%`, `100%`, `120%`), locking the artwork squarely within your natural field of view.

---

## 🕹️ Keyboard Shortcuts

| Shortcut | Action | What it does |
| :--- | :--- | :--- |
| <kbd>Space</kbd> / <kbd>Alt + S</kbd> | **Play / Pause** | Instantly start or pause smooth scrolling |
| <kbd>Shift</kbd> + <kbd>↑</kbd> | **Speed +20** | Speed up by 20 px/s on the fly (plain <kbd>↑</kbd>/<kbd>↓</kbd> scroll the page by hand) |
| <kbd>Shift</kbd> + <kbd>↓</kbd> | **Speed -20** | Slow down by 20 px/s |
| <kbd>Alt + H</kbd> | **Toggle MiniTool** | Show or hide the on-screen pill controller |
| <kbd>Esc</kbd> | **Stop** | Stop engine and cancel bottom timer |

---

## 📱 Universal Platform Support

One codebase, everywhere you read:

### 💻 Desktop (Chrome, Brave, Edge, Opera, Vivaldi)
1. Clone or download this repository.
2. Open `chrome://extensions` or `edge://extensions` or `brave://extensions`.
3. Toggle **Developer Mode** on.
4. Click **Load Unpacked** and select this directory. Done!

### 🦊 Mozilla Firefox
Load via `about:debugging#/runtime/this-firefox` ➔ **Load Temporary Add-on...** and pick `manifest.json`.

### 🍎 iPhone & iPad (Safari via Userscripts)
1. Install the free **[Userscripts](https://apps.apple.com/app/userscripts/id1463298887)** extension from the App Store.
2. In the iOS **Files** app, create a folder (e.g. `scripts`) under *On My iPhone / On My iPad* and place [`manga-flow-scroller.user.js`](manga-flow-scroller.user.js) inside it.
3. Go to iOS **Settings** ➔ **Safari** ➔ **Extensions** ➔ tap **Userscripts** ➔ toggle **On** and set permissions to **Always Allow** on All Websites.
4. Open Safari, load any webpage, and press **Refresh**.
5. Tap the **`aA`** or puzzle extension icon (or menu button) beside the address bar ➔ select **Userscripts** ➔ tap **Set Userscripts Directory** ➔ choose the folder created in step 2.
6. Open any manga site — the Untouch Flow MiniTool will appear and scroll automatically!

### 🤖 Android & Smart TV (Kiwi Browser)
Install **Kiwi Browser** (which natively supports desktop extensions), open `chrome://extensions`, and load this folder. Perfect for reading on Android tablets or on your TV with an Air Mouse!

### 🔖 Universal Bookmarklet (Any Device, Zero Install)
Copy the code inside [`bookmarklet.txt`](bookmarklet.txt), create a browser bookmark, and paste it as the URL. Tap it on any webpage to immediately launch Untouch Flow!

---

## 🌍 Multilingual Out of the Box

Switch between 13 languages with zero page reload:
- 🇬🇧 English
- 🇹🇭 ภาษาไทย
- 🇯🇵 日本語
- 🇰🇷 한국어
- 🇨🇳 中文
- 🇸🇦 العربية
- 🇷🇺 Русский
- 🇩🇪 Deutsch
- 🇮🇹 Italiano
- 🇪🇸 Español
- 🇻🇳 Tiếng Việt
- 🇲🇾 Bahasa Melayu
- 🇮🇩 Bahasa Indonesia

---

## 🗂️ Clean Project Layout

```text
Untouch-AutoScrollAutoNext/
├── manifest.json              # WebExtension Manifest V3
├── content.js                 # 60fps Scroller, Auto-Next Detector & MiniTool
├── content.css                # Scroller styles
├── popup.html                 # Minimal Segmented Popup UI
├── popup.css                  # Modern UI tokens & styles
├── popup.js                   # Profile manager & 13-language i18n
├── manga-flow-scroller.user.js # Standalone script for Safari iOS & Tampermonkey
├── bookmarklet.txt            # Zero-install universal bookmarklet
├── icons/                     # Vector-crisp multi-resolution icons
├── INSTALL_GUIDE.md           # Step-by-step installation walkthrough
├── STORE_SUBMISSION_GUIDE.md  # Official store listing copy & metadata
└── README.md                  # You are here
```

---

## ☕ Support the Project

Untouch Flow is 100% open-source and free. If it saved your fingers from endless scrolling, feel free to buy us a coffee!

- **TrueMoney (Thailand)**: [Donate via TrueMoney](https://tmn.app.link/H0zks1aOk8b) · Sufarwee Dunyamat (`sufarweededev`)

---

## 📄 License

Open-sourced under the [MIT License](LICENSE). Feel free to fork, customize, and share!
