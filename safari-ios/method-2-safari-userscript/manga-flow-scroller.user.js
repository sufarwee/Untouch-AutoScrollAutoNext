// ==UserScript==
// @name         Untouch Flow (Auto Scroll • Auto Next)
// @namespace    https://github.com/untouch-flow
// @version      2.2.0
// @description  Silky-smooth auto-scroller for manga, webtoons & web articles with MiniTool, page zoom, multilingual support (13 languages) & auto-next navigation for Safari iOS, iPadOS, Chrome, Firefox, Kiwi Browser
// @author       Sufarwee Dunyamat (sufarweededev)
// @match        *://*/*
// @noframes
// @grant        none
// @run-at       document-end
// ==/UserScript==

(() => {
  'use strict';
  if (window.__MFS__) return;
  window.__MFS__ = true;

  const DEF = {
    mode: 'manga', // 'manga' | 'reader'
    speed: 140, autoNext: true,
    nextDelay: 1.0,
    zoom: 100, pdfPageEnd: 0,
    showHUD: true, autoHideHUD: false, enableUrlFallback: false,
    lang: 'en', hudPos: null,
    activeProfileId: 'p1',
    profiles: {
      'p1': {
        id: 'p1',
        name: 'Profile 1 (Default)',
        speed: 140,
        nextDelay: 1.0,
        autoNext: true,
        sites: []
      },
      'p2': {
        id: 'p2',
        name: 'Profile 2',
        speed: 260,
        nextDelay: 1.0,
        autoNext: true,
        sites: []
      }
    },
    siteOverrides: {}
  };

  const TEXTS = {
    en: {
      scrolling: "Scrolling",
      paused: "Paused",
      checking: "Checking images...",
      countdown: (s) => `Next in ${s}s...`,
      endOfSeries: "End of Series / Latest Chapter",
      stabilizing: "Stabilizing page...",
      userPaused: "Paused (User scrolled)",
      tabAway: "Paused (Switched tab)",
      cancel: "Cancel",
      hideBtn: "✕ Hide",
      hideTip: "Hide this HUD (Restore via Extension menu or press Alt+H)",
      dragTip: "Click and drag to reposition",
      speedMinusTip: "Speed -20 px/s (Shift+↓)",
      speedPlusTip: "Speed +20 px/s (Shift+↑)",
      playTip: "Toggle Play/Pause (Space / Alt+S)",
      noChat: "Nothing to scroll here",
      zoomTip: "Zoom images (Click to cycle 100% -> 85% -> 70% -> 120%)"
    },
    th: {
      scrolling: "กำลังเลื่อน",
      paused: "หยุดชั่วคราว",
      checking: "รอโหลดรูปท้ายตอน...",
      countdown: (s) => `ตอนต่อไปใน ${s}วิ...`,
      endOfSeries: "จบบริบูรณ์ / ตอนล่าสุดแล้ว",
      stabilizing: "เตรียมหน้าเว็บ...",
      userPaused: "หยุดชั่วคราว (เลื่อนมือ)",
      tabAway: "หยุดชั่วคราว (สลับแท็บ)",
      cancel: "ยกเลิก",
      hideBtn: "✕ ซ่อน",
      hideTip: "ซ่อนปุ่มนี้ (เปิดใหม่ได้ในเมนู Extension หรือกด Alt+H)",
      dragTip: "คลิกลากเพื่อย้ายตำแหน่ง",
      speedMinusTip: "ลดความเร็ว -20 px/s (Shift+↓)",
      speedPlusTip: "เพิ่มความเร็ว +20 px/s (Shift+↑)",
      playTip: "เริ่ม/หยุดชั่วคราว (Space / Alt+S)",
      noChat: "ไม่พบส่วนที่เลื่อนได้",
      zoomTip: "ย่อ/ขยายรูปภาพ (คลิกเพื่อสลับ 100% -> 85% -> 70% -> 120%)"
    },
    ja: {
      scrolling: "スクロール中",
      paused: "一時停止",
      checking: "最後の画像を読み込み中...",
      countdown: (s) => `次の話まで ${s}秒...`,
      endOfSeries: "最終話 / 最新話に到達",
      stabilizing: "ページ準備中...",
      userPaused: "手動操作で一時停止",
      tabAway: "タブ切替で一時停止",
      cancel: "キャンセル",
      hideBtn: "✕ 非表示",
      hideTip: "ボタンを非表示 (Alt+H または設定で再表示)",
      dragTip: "ドラッグして位置を変更",
      speedMinusTip: "速度 -20 px/s (Shift+↓)",
      speedPlusTip: "速度 +20 px/s (Shift+↑)",
      playTip: "開始 / 一時停止 (Space / Alt+S)",
      noChat: "Nothing to scroll here",
      zoomTip: "画像の拡大縮小 (100% -> 85% -> 70% -> 120%)"
    },
    ko: {
      scrolling: "스크롤 중",
      paused: "일시정지",
      checking: "마지막 이미지 로딩 확인 중...",
      countdown: (s) => `다음 화까지 ${s}초...`,
      endOfSeries: "완결 / 최신 화입니다",
      stabilizing: "페이지 준비 중...",
      userPaused: "수동 조작으로 일시정지",
      tabAway: "탭 전환으로 일시정지",
      cancel: "취소",
      hideBtn: "✕ 숨기기",
      hideTip: "버튼 숨기기 (Alt+H 또는 메뉴에서 복원)",
      dragTip: "드래그하여 위치 이동",
      speedMinusTip: "속도 -20 px/s (Shift+↓)",
      speedPlusTip: "속도 +20 px/s (Shift+↑)",
      playTip: "재생 / 일시정지 (Space / Alt+S)",
      noChat: "Nothing to scroll here",
      zoomTip: "이미지 확대/축소 (100% -> 85% -> 70% -> 120%)"
    },
    zh: {
      scrolling: "正在滚动",
      paused: "已暂停",
      checking: "检查尾页图片中...",
      countdown: (s) => `下一话倒计时 ${s}秒...`,
      endOfSeries: "全书完 / 已是最新话",
      stabilizing: "页面准备中...",
      userPaused: "手动操作暂停",
      tabAway: "切后台暂停",
      cancel: "取消",
      hideBtn: "✕ 隐藏",
      hideTip: "隐藏此悬浮球 (按 Alt+H 或在插件菜单中恢复)",
      dragTip: "按住拖动位置",
      speedMinusTip: "减速 -20 px/s (Shift+↓)",
      speedPlusTip: "加速 +20 px/s (Shift+↑)",
      playTip: "开始 / 暂停 (Space / Alt+S)",
      noChat: "Nothing to scroll here",
      zoomTip: "缩放图片 (切换 100% -> 85% -> 70% -> 120%)"
    },
    ar: {
      scrolling: "تمرير مستمر",
      paused: "مؤقت",
      checking: "جاري تحميل الصور الأخيرة...",
      countdown: (s) => `الفصل التالي خلال ${s} ث...`,
      endOfSeries: "نهاية السلسلة / أحدث فصل",
      stabilizing: "تهيئة الصفحة...",
      userPaused: "مؤقت (تمرير يدوي)",
      tabAway: "مؤقت (تبديل التبويب)",
      cancel: "إلغاء",
      hideBtn: "✕ إخفاء",
      hideTip: "إخفاء الزر العائم (استعادة عبر Alt+H أو القائمة)",
      dragTip: "سحب لتحريك الموضع",
      speedMinusTip: "تقليل السرعة -20 (Shift+↓)",
      speedPlusTip: "زيادة السرعة +20 (Shift+↑)",
      playTip: "تشغيل / إيقاف مؤقت (Space / Alt+S)",
      noChat: "Nothing to scroll here",
      zoomTip: "تكبير/تصغير الصور (100% -> 85% -> 70% -> 120%)"
    },
    ru: {
      scrolling: "Прокрутка",
      paused: "Пауза",
      checking: "Проверка загрузки страниц...",
      countdown: (s) => `След. глава через ${s}с...`,
      endOfSeries: "Конец тайтла / Последняя глава",
      stabilizing: "Подготовка страницы...",
      userPaused: "Пауза (ручной скролл)",
      tabAway: "Пауза (смена вкладки)",
      cancel: "Отмена",
      hideBtn: "✕ Скрыть",
      hideTip: "Скрыть кнопку (восстановить через меню или Alt+H)",
      dragTip: "Зажмите для перемещения",
      speedMinusTip: "Скорость -20 px/s (Shift+↓)",
      speedPlusTip: "Скорость +20 px/s (Shift+↑)",
      playTip: "Старт / Пауза (Space / Alt+S)",
      noChat: "Nothing to scroll here",
      zoomTip: "Масштаб манги (100% -> 85% -> 70% -> 120%)"
    },
    de: {
      scrolling: "Scrollen",
      paused: "Pausiert",
      checking: "Lade letzte Bilder...",
      countdown: (s) => `Nächstes Kapitel in ${s}s...`,
      endOfSeries: "Reihe beendet / Neuestes Kapitel",
      stabilizing: "Seite wird vorbereitet...",
      userPaused: "Pausiert (Manuelles Scrollen)",
      tabAway: "Pausiert (Tab gewechselt)",
      cancel: "Abbrechen",
      hideBtn: "✕ Ausblenden",
      hideTip: "Button ausblenden (wiederherstellen via Menü oder Alt+H)",
      dragTip: "Ziehen zum Verschieben",
      speedMinusTip: "Tempo -20 px/s (Shift+↓)",
      speedPlusTip: "Tempo +20 px/s (Shift+↑)",
      playTip: "Start / Pause (Space / Alt+S)",
      noChat: "Nothing to scroll here",
      zoomTip: "Bildgröße (100% -> 85% -> 70% -> 120%)"
    },
    it: {
      scrolling: "Scorrimento",
      paused: "In pausa",
      checking: "Controllo ultime immagini...",
      countdown: (s) => `Prossimo capitolo in ${s}s...`,
      endOfSeries: "Fine serie / Ultimo capitolo",
      stabilizing: "Preparazione pagina...",
      userPaused: "In pausa (Scorrimento manuale)",
      tabAway: "In pausa (Scheda cambiata)",
      cancel: "Annulla",
      hideBtn: "✕ Nascondi",
      hideTip: "Nascondi pulsante (ripristina via menu o Alt+H)",
      dragTip: "Trascina per riposizionare",
      speedMinusTip: "Velocità -20 px/s (Shift+↓)",
      speedPlusTip: "Velocità +20 px/s (Shift+↑)",
      playTip: "Avvia / Pausa (Space / Alt+S)",
      noChat: "Nothing to scroll here",
      zoomTip: "Zoom immagini (100% -> 85% -> 70% -> 120%)"
    },
    es: {
      scrolling: "Desplazando",
      paused: "En pausa",
      checking: "Cargando últimas imágenes...",
      countdown: (s) => `Siguiente capítulo en ${s}s...`,
      endOfSeries: "Fin de la serie / Último capítulo",
      stabilizing: "Preparando página...",
      userPaused: "En pausa (Desplazamiento manual)",
      tabAway: "En pausa (Cambio de pestaña)",
      cancel: "Cancelar",
      hideBtn: "✕ Ocultar",
      hideTip: "Ocultar botón (restaurar con Alt+H o menú)",
      dragTip: "Arrastrar para mover",
      speedMinusTip: "Velocidad -20 px/s (Shift+↓)",
      speedPlusTip: "Velocidad +20 px/s (Shift+↑)",
      playTip: "Iniciar / Pausar (Space / Alt+S)",
      noChat: "Nothing to scroll here",
      zoomTip: "Zoom de imágenes (100% -> 85% -> 70% -> 120%)"
    },
    vi: {
      scrolling: "Đang cuộn",
      paused: "Tạm dừng",
      checking: "Đang tải ảnh cuối trang...",
      countdown: (s) => `Chương tiếp sau ${s}s...`,
      endOfSeries: "Đã hết truyện / Chương mới nhất",
      stabilizing: "Đang chuẩn bị trang...",
      userPaused: "Tạm dừng (cuộn tay)",
      tabAway: "Tạm dừng (chuyển tab)",
      cancel: "Hủy",
      hideBtn: "✕ Ẩn",
      hideTip: "Ẩn nút này (bật lại qua menu Extension hoặc Alt+H)",
      dragTip: "Nhấp và kéo để đổi vị trí",
      speedMinusTip: "Giảm tốc -20 px/s (Shift+↓)",
      speedPlusTip: "Tăng tốc +20 px/s (Shift+↑)",
      playTip: "Bắt đầu / Tạm dừng (Space / Alt+S)",
      noChat: "Nothing to scroll here",
      zoomTip: "Thu nhỏ/phóng to ảnh (100% -> 85% -> 70% -> 120%)"
    },
    ms: {
      scrolling: "Menatal",
      paused: "Dijeda",
      checking: "Memeriksa imej hujung...",
      countdown: (s) => `Bab seterusnya dalam ${s}s...`,
      endOfSeries: "Tamat Siri / Bab Terkini",
      stabilizing: "Menyediakan halaman...",
      userPaused: "Dijeda (tatal manual)",
      tabAway: "Dijeda (tukar tab)",
      cancel: "Batal",
      hideBtn: "✕ Sembunyi",
      hideTip: "Sembunyi butang ini (buka semula via menu atau Alt+H)",
      dragTip: "Klik dan seret untuk ubah kedudukan",
      speedMinusTip: "Kelajuan -20 px/s (Shift+↓)",
      speedPlusTip: "Kelajuan +20 px/s (Shift+↑)",
      playTip: "Mula / Jeda (Space / Alt+S)",
      noChat: "Nothing to scroll here",
      zoomTip: "Zum imej (100% -> 85% -> 70% -> 120%)"
    },
    id: {
      scrolling: "Menggulung",
      paused: "Dijeda",
      checking: "Memeriksa gambar akhir...",
      countdown: (s) => `Chapter selanjutnya dalam ${s}s...`,
      endOfSeries: "Tamat / Chapter Terbaru",
      stabilizing: "Menyiapkan halaman...",
      userPaused: "Dijeda (scroll manual)",
      tabAway: "Dijeda (pindah tab)",
      cancel: "Batal",
      hideBtn: "✕ Sembunyikan",
      hideTip: "Sembunyikan tombol (buka kembali via menu atau Alt+H)",
      dragTip: "Klik dan seret untuk pindah posisi",
      speedMinusTip: "Kecepatan -20 px/s (Shift+↓)",
      speedPlusTip: "Kecepatan +20 px/s (Shift+↑)",
      playTip: "Mulai / Jeda (Space / Alt+S)",
      noChat: "Nothing to scroll here",
      zoomTip: "Zoom gambar (100% -> 85% -> 70% -> 120%)"
    },
  };

  /** 1. Storage Manager */
  class StorageManager {
    constructor() {
      this.cfg = { ...DEF };
      this.host = location.hostname;
      this.fns = new Set();
    }
    async init() {
      return new Promise(res => {
        if (typeof chrome === 'undefined' || !chrome?.storage?.local) {
          try {
            const raw = localStorage.getItem('__MFS_CFG__');
            if (raw) this.cfg = { ...DEF, ...JSON.parse(raw) };
            if (this.cfg.mode === 'chat') this.cfg.mode = 'reader';
          } catch (e) {}
          return res(this.cfg);
        }
        chrome.storage.local.remove('isPlaying');
        chrome.storage.local.get(null, r => {
          this.cfg = { ...DEF, ...r };
          if (this.cfg.mode === 'chat') this.cfg.mode = 'reader';
          res(this.cfg);
        });
        chrome.storage.onChanged.addListener((c, a) => {
          if (a !== 'local') return;
          for (const k in c) this.cfg[k] = c[k].newValue;
          this.fns.forEach(fn => fn(this.cfg, c));
        });
      });
    }
    get() { return this.cfg; }
    getEffectiveProfile() {
      const host = this.host;
      const profiles = this.cfg.profiles || {};
      for (const pid in profiles) {
        const p = profiles[pid];
        if (Array.isArray(p.sites) && p.sites.some(s => s && (s === host || host.endsWith(s)))) {
          return p;
        }
      }
      if (this.cfg.siteOverrides && typeof this.cfg.siteOverrides[host] === 'number') {
        return { speed: this.cfg.siteOverrides[host] };
      }
      if (this.cfg.activeProfileId && profiles[this.cfg.activeProfileId]) {
        return profiles[this.cfg.activeProfileId];
      }
      return Object.values(profiles)[0] || { speed: this.cfg.speed || 140 };
    }
    getEffectiveSpeed() {
      const prof = this.getEffectiveProfile();
      return typeof prof.speed === 'number' ? prof.speed : this.cfg.speed;
    }
    async save(p) {
      this.cfg = { ...this.cfg, ...p };
      if (typeof chrome !== 'undefined' && chrome?.storage?.local) {
        await chrome.storage.local.set(p);
      } else {
        try {
          localStorage.setItem('__MFS_CFG__', JSON.stringify(this.cfg));
        } catch (e) {}
      }
    }
    onChange(fn) { this.fns.add(fn); }
  }

  /** 1.5 Zoom Manager */
  class ZoomManager {
    constructor() {
      this.styleEl = null;
    }
    apply(zoomLevel) {
      const z = Math.max(40, Math.min(200, parseInt(zoomLevel, 10) || 100));
      if (!this.styleEl) {
        this.styleEl = document.createElement('style');
        this.styleEl.id = 'mfs-zoom-style';
        (document.head || document.documentElement).appendChild(this.styleEl);
      }
      if (z === 100) {
        this.styleEl.textContent = '';
        return;
      }
      this.styleEl.textContent = `
        #readerarea img, #chapter-images img, .reading-content img, .entry-content img,
        [class*="reader"] img, [class*="viewer"] img, .comic-page img, article img,
        #readerarea, .reading-content, #chapter-images {
          max-width: ${z}% !important;
          margin-left: auto !important;
          margin-right: auto !important;
          display: block !important;
          transition: max-width .2s ease !important;
        }
      `;
    }
  }

  /** 2. Next Chapter Finder */
  class NextChapterFinder {
    constructor(storage) {
      this.storage = storage;
      // Words meaning "next" / "previous" in many languages (non-Latin scripts need no word boundary)
      this.nextWords = /(^|[^a-z])(next|nxt|forward|siguiente|pr[oó]ximo|seguinte|suivant|suivante|prochain|prochaine|n[aä]chst|weiter|volgende|successiv|prossim|avanti|selanjutnya|berikutnya|seterusnya|lanjut|sonraki|ileri|nast[eę]pn|kolejn|dalej)|ถัดไป|ต่อไป|次の|次へ|次話|次章|次回|次ページ|다음|下一|下[页頁章话話集回]|后一|後一|التالي|التالى|التالية|अगला|अगले|הבא|بعدی|επόμενο|следующ|далее|вперёд|наступн|tiếp theo|chương sau|chương tiếp|tập sau|trang sau/i;
      this.prevWords = /(^|[^a-z])(prev|previous|back|older|before|earlier|anterior|pr[eé]c[eé]dent|zur[uü]ck|vorherig|precedente|indietro|sebelum|trước|[oö]nceki|poprzedni|list|all[\s_-]*chapters|index|menu|comment|share|home|bookmark)|ก่อนหน้า|ย้อนกลับ|หน้าก่อน|ตอนก่อน|สารบัญ|前の|前話|前章|前回|前へ|一覧|이전|뒤로|목록|上一|前一|上[页頁]|目录|目錄|السابق|предыдущ|назад/i;
      this.nextClass = /(^|[\s_-])(next|nxt)([\s_-]|$)|nextep|next-?chap|next-?page|btn-?next|link_?next|pg_?next|chapter-?next|(^|[\s_-])forward([\s_-]|$)/i;
      this.nextIcon = '[class*="arrow-right"],[class*="right-arrow"],[class*="chevron-right"],[class*="angle-right"],[class*="caret-right"],[class*="icon-next"],[class*="next-icon"]';
    }
    findTsReaderInfo() {
      // Direct detection of WordPress MangaReader / ts_reader configuration
      try {
        for (const s of document.querySelectorAll('script')) {
          const txt = s.textContent;
          if (txt && txt.includes('ts_reader.run')) {
            const m = txt.match(/"nextUrl"\s*:\s*"([^"]*)"/);
            if (m) {
              const u = m[1].replace(/\\/g, '').trim();
              if (!u) {
                return { isLast: true }; // Explicitly latest chapter on this series!
              }
              return { isUrl: true, href: u };
            }
          }
        }
      } catch (e) {}
      return null;
    }
    findNext() {
      // 1. Check ts_reader config first (very high accuracy on MangaReader CMS sites like up-manga, go-manga)
      const ts = this.findTsReaderInfo();
      if (ts) {
        if (ts.isLast) return { isLast: true };
        return ts;
      }

      // MangaPlus: the next-chapter control is a plain <div> ("To Chapter #003"), chapter ids in the URL are not sequential
      if (location.hostname === 'mangaplus.shueisha.co.jp') {
        const cur = parseInt((document.querySelector('[class*="chapterTitle"]')?.textContent.match(/#\s*(\d+)/) || [])[1], 10);
        if (cur >= 0) {
          for (const el of document.querySelectorAll('div,a,button')) {
            if (el.children.length > 2 || el.closest('[class*="eader"],nav')) continue;
            const m = (el.textContent || '').trim().match(/^\D{0,40}#\s*(\d+)\s*$/);
            if (m && parseInt(m[1], 10) === cur + 1 && this.isVisible(el)) return el;
          }
        }
      }

      // 2. Semantic link or next-rel tag
      const sem = document.querySelector('a[rel="next"], link[rel="next"]');
      if (sem && this.isValid(sem)) return sem;

      // 3. CMS specific next buttons
      const cms = document.querySelectorAll('.next_page, .nav-next a, .ch-next-btn, a.next, a.btn-next, [class*="next-chap"], [class*="next_chap"], [class*="link_next"], [id*="next-chap"], [id*="next_chap"]');
      for (const el of cms) {
        if (this.isVisible(el) && this.isValid(el)) return el;
      }

      // 4. Score every link/button on several signals (text, aria-label, title, icon alt, class/id, arrow symbols); highest wins, ties go to the later one
      let best = null, bestScore = 0;
      for (const el of document.querySelectorAll('a, button, [role="button"], [role="link"], input[type="button"]')) {
        if (!this.isVisible(el) || el.disabled || el.getAttribute('aria-disabled') === 'true' || !this.isValid(el)) continue;
        const sc = this.scoreNext(el);
        if (sc >= bestScore && sc >= 4) { best = el; bestScore = sc; }
      }
      if (best) return best;

      // 5. URL fallback increment (if enabled in settings)
      if (this.storage.get().enableUrlFallback) {
        const m = location.href.match(/((?:chapter|chap|ch)[-_/]?)(\d+)/i);
        if (m) {
          const u = location.href.replace(m[0], `${m[1]}${parseInt(m[2], 10) + 1}`);
          if (u !== location.href) return { isUrl: true, href: u };
        }
      }
      return null;
    }
    scoreNext(el) {
      const txt = (el.textContent || '').replace(/\s+/g, ' ').trim();
      const short = txt.length <= 50 ? txt : '';
      const alt = [...el.querySelectorAll('img[alt],svg title')].map(n => n.getAttribute('alt') || n.textContent).join(' ');
      const attrs = `${el.getAttribute('aria-label') || ''} ${el.getAttribute('title') || ''} ${el.getAttribute('value') || ''} ${alt}`;
      const ci = `${typeof el.className === 'string' ? el.className : ''} ${el.id || ''}`;
      if (this.prevWords.test(`${short} ${attrs} ${ci}`)) return 0;
      let sc = 0;
      if (short && this.nextWords.test(short)) sc += 5;
      if (this.nextWords.test(attrs)) sc += 5;
      if (this.nextClass.test(ci)) sc += 4;
      if (/^[\s›»→⇒▶►▷>⟩❯❱]+$/.test(short) && short) sc += 3;
      if (el.querySelector(this.nextIcon)) sc += 3;
      if (sc && el.getBoundingClientRect().top > window.innerHeight * 0.4) sc += 1;
      return sc;
    }
    isVisible(el) {
      if (!el) return false;
      const r = el.getBoundingClientRect(), s = getComputedStyle(el);
      return s.display !== 'none' && s.visibility !== 'hidden' && s.opacity !== '0' && r.width > 0 && r.height > 0;
    }
    isValid(el) {
      if (!el) return false;
      if (el.disabled || el.getAttribute('aria-disabled') === 'true' || el.classList?.contains('disabled')) return false;
      if (el.tagName === 'A') {
        const href = el.getAttribute('href');
        if (!href || !href.trim() || href === '#' || href.startsWith('javascript:')) return false;
        if (href === location.href) return false;
        if (href === '#/next/' || href === '/next/') {
          const ts = this.findTsReaderInfo();
          if (ts?.isLast) return false;
        }
      }
      return true;
    }
    execute(target) {
      if (!target) return;
      sessionStorage.setItem('mfs_next_resume', 'true');
      this.storage.save({ nextResume: { host: location.hostname, time: Date.now() } });

      if (target.isUrl && target.href) {
        location.href = target.href;
        return;
      }
      if (target.tagName === 'A' && target.href && !target.href.startsWith('javascript:')) {
        if (target.getAttribute('href') !== '#/next/' && !target.getAttribute('href')?.startsWith('#')) {
          location.href = target.href;
          return;
        }
        target.click();
        setTimeout(() => {
          if (target.href && !target.href.includes('#/next/') && location.href !== target.href) {
            location.href = target.href;
          }
        }, 300);
      } else if (typeof target.click === 'function') {
        target.click();
      }
    }
  }

  /** 3. Floating HUD with Draggable Repositioning & Complete Hide Support */
  class FloatingHUD {
    constructor(cb, storage) {
      this.cb = cb;
      this.storage = storage;
      this.fade = null;
      this.lastStatusKey = 'paused';

      // Ensure host fixed styling is always present (for extension, userscript, and bookmarklet)
      if (!document.getElementById('mfs-host-style')) {
        const s = document.createElement('style');
        s.id = 'mfs-host-style';
        s.textContent = `
          #mfs-host {
            position: fixed !important;
            z-index: 2147483647 !important;
            pointer-events: auto !important;
            display: block !important;
          }
          #mfs-host.mfs-hidden {
            display: none !important;
            visibility: hidden !important;
          }
        `;
        (document.head || document.documentElement).appendChild(s);
      }

      // Remove any duplicate or legacy HUD hosts
      document.querySelectorAll('#manga-flow-scroller-host, #mfs-host').forEach(el => el.remove());

      const host = document.createElement('div');
      host.id = 'mfs-host';
      (document.body || document.documentElement).appendChild(host);
      this.host = host;

      const dict = this.getDict();

      this.root = host.attachShadow({ mode: 'open' });
      // Built with createElement (no HTML parsing) so strict Trusted Types pages such as Gemini do not block the HUD
      const css = `
          * {
            box-sizing: border-box; margin: 0; padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
            -webkit-font-smoothing: antialiased;
          }
          :host { all: initial; }
          .p {
            display: inline-flex; flex-direction: column; align-items: center; gap: 5px; width: 52px;
            background: rgba(15, 23, 42, 0.94);
            backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.16); border-radius: 18px;
            padding: 7px 4px; box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5);
            user-select: none; -webkit-user-select: none;
            touch-action: none; -webkit-touch-callout: none;
            transition: opacity .25s ease, transform .15s ease, box-shadow .15s ease;
            font-size: 11.5px; color: #f8fafc; cursor: grab;
            max-width: calc(100vw - 16px);
          }
          .p.dimmed { opacity: 0.5 !important; }
          .p.dimmed:hover { opacity: 1 !important; }
          .p.dragging {
            cursor: grabbing !important;
            box-shadow: 0 12px 32px rgba(0, 0, 0, 0.7) !important;
            transform: scale(1.02);
          }
          .drag-handle {
            cursor: grab; color: #64748b; padding: 0 2px 0 0; font-size: 12px;
            display: flex; align-items: center; justify-content: center;
            user-select: none; transition: color .15s;
          }
          .drag-handle:hover { color: #93c5fd; }
          .dot { width: 6px; height: 6px; border-radius: 50%; background: #94a3b8; flex-shrink: 0; }
          .dot.act { background: #10b981; box-shadow: 0 0 6px #10b981; animation: pl 1.5s infinite; }
          .dot.chk { background: #f59e0b; box-shadow: 0 0 6px #f59e0b; }
          .dot.cd { background: #8b5cf6; box-shadow: 0 0 6px #8b5cf6; }
          .dot.end { background: #ef4444; box-shadow: 0 0 6px #ef4444; }
          @keyframes pl { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.2)} }
          .t { font-weight: 600; white-space: nowrap; font-size: 9px; max-width: 100%; overflow: hidden; text-overflow: ellipsis; }
          .s { font-size: 9px; text-align: center; font-weight: 700; color: #93c5fd; background: rgba(255, 255, 255, 0.12); padding: 1px 5px; border-radius: 4px; white-space: nowrap; }
          .bs { display: flex; flex-direction: column; align-items: center; gap: 5px; cursor: default; }
          .b {
            background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.12);
            color: #fff; width: 34px; height: 30px; border-radius: 8px; display: flex;
            align-items: center; justify-content: center; cursor: pointer; font-size: 11px; font-weight: 700;
          }
          .b:hover { background: rgba(255, 255, 255, 0.22); }
          .pb { width: 34px; height: 34px; background: #6366f1; border-color: #818cf8; border-radius: 50%; font-size: 11px; }
          .pb:hover { background: #4f46e5; }
          .zb {
            width: 34px; height: 26px; padding: 0; font-size: 9px; font-weight: 700; color: #93c5fd;
            background: rgba(255, 255, 255, 0.08); border-radius: 4px;
          }
          .zb:hover { background: rgba(99, 102, 241, 0.3); border-color: #818cf8; color: #fff; }
          .cb { background: #ef4444; border: 0; color: #fff; padding: 1px 6px; height: 22px; border-radius: 4px; font-size: 10px; font-weight: 600; cursor: pointer; display: none; }
          .hide-btn {
            background: rgba(255, 255, 255, 0.12); border: 1px solid rgba(255, 255, 255, 0.20);
            color: #ffffff; padding: 0; width: 34px; height: 24px; border-radius: 8px;
            font-size: 9px; font-weight: 700; cursor: pointer; white-space: nowrap;
            display: inline-flex; align-items: center; justify-content: center;
            transition: all .15s ease;
          }
          .mini {
            display: none; width: 36px; height: 36px; border-radius: 50%;
            background: rgba(15, 23, 42, 0.85); border: 1px solid rgba(255, 255, 255, 0.3);
            box-shadow: 0 4px 14px rgba(0, 0, 0, 0.5); opacity: 0.85;
            align-items: center; justify-content: center; cursor: grab;
            touch-action: none; -webkit-user-select: none; user-select: none; -webkit-touch-callout: none;
          }
          .mini.dragging { transform: scale(1.1); opacity: 1; }
          .mini { position: relative; }
          .mini::after {
            content: 'DoubleClick'; position: absolute; bottom: calc(100% + 6px); left: 50%; transform: translateX(-50%);
            padding: 3px 7px; border-radius: 5px; background: #0f172a; color: #fff;
            font: 700 11px/1.4 sans-serif; white-space: nowrap; pointer-events: none; display: none;
          }
          .mini:hover::after { display: block; }
          .mini.tip-left::after { left: 0; transform: none; }
          .mini.tip-right::after { left: auto; right: 0; transform: none; }
          .mini.tip-below::after { bottom: auto; top: calc(100% + 6px); }
          .mini.dragging::after { display: none; }
          .md { width: 10px; height: 10px; border-radius: 50%; background: #94a3b8; }
          .mini.act .md { background: #10b981; box-shadow: 0 0 6px #10b981; }
          .hide-btn:hover {
            background: rgba(239, 68, 68, 0.35); border-color: #ef4444; color: #ffffff;
            transform: scale(1.02);
          }
        `;
      const mk = (tag, attrs, ...kids) => {
        const e = document.createElement(tag);
        for (const k in attrs) e.setAttribute(k, attrs[k]);
        e.append(...kids);
        return e;
      };
      const styleEl = document.createElement('style');
      styleEl.textContent = css;
      this.root.append(
        styleEl,
        mk('div', { class: 'p', id: 'p' },
          mk('div', { class: 'drag-handle', id: 'drag', title: dict.dragTip }, '⠿'),
          mk('div', { class: 'dot', id: 'd' }),
          mk('span', { class: 't', id: 't' }, dict.paused),
          mk('span', { class: 's', id: 's' }, '140 px/s'),
          mk('div', { class: 'bs' },
            mk('button', { class: 'b', id: 'm', title: dict.speedMinusTip }, '−'),
            mk('button', { class: 'b', id: 'a', title: dict.speedPlusTip }, '+'),
            mk('button', { class: 'b pb', id: 'play', title: dict.playTip }, '▶'),
            mk('button', { class: 'b zb', id: 'zBtn', title: dict.zoomTip }, '100%'),
            mk('button', { class: 'cb', id: 'c' }, dict.cancel),
            mk('button', { class: 'hide-btn', id: 'hBtn', title: dict.hideTip }, dict.hideBtn))),
        mk('div', { class: 'mini', id: 'mini', 'aria-label': 'DoubleClick' }, mk('span', { class: 'md' })));

      const $ = id => this.root.getElementById(id);
      this.el = {
        p: $('p'), d: $('d'), t: $('t'), s: $('s'),
        m: $('m'), a: $('a'), play: $('play'), zBtn: $('zBtn'), c: $('c'),
        hBtn: $('hBtn'), drag: $('drag'), mini: $('mini')
      };

      this.el.m.onclick = e => { e.stopPropagation(); this.cb.onSpeed(-20); };
      this.el.a.onclick = e => { e.stopPropagation(); this.cb.onSpeed(20); };
      this.el.play.onclick = e => { e.stopPropagation(); this.cb.onPlay(); };
      this.el.zBtn.onclick = e => { e.stopPropagation(); this.cb.onZoomCycle(); };
      this.el.c.onclick = e => { e.stopPropagation(); this.cb.onCancel(); };

      // Explicit Hide button on the pill
      this.el.hBtn.onclick = e => {
        e.stopPropagation();
        this.cb.onHide();
      };
      // Minimized dot: double-tap to expand (drag to move it)
      let miniDown = null, lastTap = 0;
      // Keep the tooltip on screen when the dot sits near an edge
      this.el.mini.addEventListener('pointerenter', () => {
        const r = this.el.mini.getBoundingClientRect(), c = this.el.mini.classList;
        c.toggle('tip-left', r.left < 40);
        c.toggle('tip-right', window.innerWidth - r.right < 40);
        c.toggle('tip-below', r.top < 36);
      });
      this.el.mini.addEventListener('pointerdown', e => { miniDown = { x: e.clientX, y: e.clientY }; });
      this.el.mini.addEventListener('pointerup', e => {
        if (!miniDown || Math.hypot(e.clientX - miniDown.x, e.clientY - miniDown.y) > 8) { miniDown = null; lastTap = 0; return; }
        miniDown = null;
        const now = Date.now();
        if (now - lastTap < 400) {
          lastTap = 0;
          this.setMinimized(false);
          this.storage.save({ hudMin: false });
          this.applyPosition(this.storage.get().hudPos);
        } else lastTap = now;
      });

      // Draggable Setup
      this.setupDraggable();

      // Apply initial position & visibility
      this.applyPosition(this.storage.get().hudPos);
      this.setVisible(this.storage.get().showHUD);
      this.setMinimized(Boolean(this.storage.get().hudMin));

      // Any mouse/touch movement brings a dimmed HUD back to full opacity for 2.5s
      const wake = () => {
        if (!this.wantDim) return;
        this.awake = true; this.el.p.classList.remove('dimmed');
        clearTimeout(this.awakeT);
        this.awakeT = setTimeout(() => { this.awake = false; this.el.p.classList.toggle('dimmed', Boolean(this.wantDim)); }, 2500);
      };
      window.addEventListener('mousemove', wake, { passive: true });
      window.addEventListener('touchstart', wake, { passive: true });
      // Keep HUD the same visual size when the browser is zoomed (Cmd/Ctrl +/-)
      this.fixScale();
      // Re-clamp on window resize
      window.addEventListener('resize', () => {
        this.fixScale();
        const pos = this.storage.get().hudPos;
        if (pos) this.applyPosition(pos);
      });
    }

    setupDraggable() {
      let isDragging = false;
      let startX = 0, startY = 0;
      let initialLeft = 0, initialTop = 0;

      const onPointerDown = e => {
        if (e.target.closest('button')) return;
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;

        const rect = this.host.getBoundingClientRect();
        initialLeft = rect.left;
        initialTop = rect.top;

        this.el.p.classList.add('dragging'); this.el.mini.classList.add('dragging');
        window.addEventListener('pointermove', onPointerMove, { passive: false });
        window.addEventListener('pointerup', onPointerUp, { passive: false });
        window.addEventListener('pointercancel', onPointerUp, { passive: false });
      };

      const onPointerMove = e => {
        if (!isDragging) return;
        e.preventDefault();
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        const rect = this.host.getBoundingClientRect();
        const w = rect.width || 46;
        const h = rect.height || 250;
        const maxX = Math.max(8, window.innerWidth - w - 8);
        const maxY = Math.max(8, window.innerHeight - h - 8);

        const newX = Math.max(8, Math.min(maxX, initialLeft + dx));
        const newY = Math.max(8, Math.min(maxY, initialTop + dy));

        this.host.style.setProperty('left', `${newX}px`, 'important');
        this.host.style.setProperty('top', `${newY}px`, 'important');
        this.host.style.setProperty('right', 'auto', 'important');
        this.host.style.setProperty('bottom', 'auto', 'important');
      };

      const onPointerUp = () => {
        if (!isDragging) return;
        isDragging = false;
        this.el.p.classList.remove('dragging'); this.el.mini.classList.remove('dragging');
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
        window.removeEventListener('pointercancel', onPointerUp);

        const rect = this.host.getBoundingClientRect();
        this.storage.save({
          hudPos: { x: Math.round(rect.left), y: Math.round(rect.top) }
        });
      };

      this.el.p.addEventListener('pointerdown', onPointerDown);
      this.el.mini.addEventListener('pointerdown', onPointerDown);
    }

    fixScale(z) {
      // z = real browser zoom from the background script; without it (userscript) guess from window sizes
      if (typeof z === 'number' && z > 0) this.zf = z;
      let step = this.zf;
      if (!step) {
        const r = window.outerWidth / window.innerWidth;
        step = [0.25, 0.33, 0.5, 0.67, 0.75, 0.8, 0.9, 1, 1.1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4, 5].find(v => Math.abs(r - v) / v < 0.04) || 1;
      }
      this.host.style.setProperty('transform', Math.abs(step - 1) < 0.01 ? 'none' : `scale(${1 / step})`, 'important');
      const pos = this.storage.get().hudPos;
      if (pos) this.applyPosition(pos);
    }
    applyPosition(pos) {
      if (pos && typeof pos.x === 'number' && typeof pos.y === 'number') {
        const rect = this.host.getBoundingClientRect();
        const w = rect.width > 0 ? rect.width : 46;
        const h = rect.height > 0 ? rect.height : 250;
        const maxX = Math.max(8, window.innerWidth - w - 8);
        const maxY = Math.max(8, window.innerHeight - h - 8);
        const x = Math.max(8, Math.min(maxX, pos.x));
        const y = Math.max(8, Math.min(maxY, pos.y));

        this.host.style.setProperty('left', `${x}px`, 'important');
        this.host.style.setProperty('top', `${y}px`, 'important');
        this.host.style.setProperty('right', 'auto', 'important');
        this.host.style.setProperty('bottom', 'auto', 'important');
        this.host.style.setProperty('transform-origin', 'top left', 'important');
      } else {
        this.host.style.setProperty('transform-origin', 'bottom right', 'important');
        this.host.style.setProperty('left', 'auto', 'important');
        this.host.style.setProperty('top', 'auto', 'important');
        this.host.style.setProperty('right', 'calc(14px + env(safe-area-inset-right, 0px))', 'important');
        this.host.style.setProperty('bottom', 'calc(120px + env(safe-area-inset-bottom, 0px))', 'important');
      }
    }

    getDict() {
      const lang = this.storage.get().lang || 'en';
      return TEXTS[lang] || TEXTS.en;
    }

    update(state, isPlaying, spd, statusKey) {
      if (this.fade) { clearTimeout(this.fade); this.fade = null; this.el.p.style.opacity = '1'; }
      const dict = this.getDict();
      this.el.s.textContent = `${Math.round(spd)} px/s`;
      this.el.play.textContent = isPlaying ? '⏸' : '▶';
      this.el.c.style.display = 'none';
      this.el.c.textContent = dict.cancel;
      this.el.hBtn.textContent = dict.hideBtn;
      this.el.hBtn.title = dict.hideTip;
      this.el.drag.title = dict.dragTip;
      this.el.m.title = dict.speedMinusTip;
      this.el.a.title = dict.speedPlusTip;
      this.el.play.title = dict.playTip;
      if (this.el.zBtn) {
        this.el.zBtn.textContent = `${this.storage.get().zoom || 100}%`;
        this.el.zBtn.title = dict.zoomTip;
      }
      this.el.d.className = 'dot';
      this.el.mini.classList.toggle('act', state === 'SCROLLING');

      // Auto-hide dimming when scrolling
      const shouldDim = Boolean(this.storage.get().autoHideHUD && state === 'SCROLLING');
      this.wantDim = shouldDim;
      this.el.p.classList.toggle('dimmed', shouldDim && !this.awake);

      if (statusKey) {
        this.lastStatusKey = statusKey;
      } else if (state === 'SCROLLING') {
        this.lastStatusKey = 'scrolling';
      } else if (state === 'VERIFYING_BOTTOM') {
        this.lastStatusKey = 'checking';
      } else if (state === 'END_OF_SERIES') {
        this.lastStatusKey = 'endOfSeries';
      } else {
        this.lastStatusKey = 'paused';
      }

      const txt = typeof dict[this.lastStatusKey] === 'function'
        ? dict[this.lastStatusKey]()
        : (dict[this.lastStatusKey] || this.lastStatusKey);

      this.el.t.textContent = txt;

      if (state === 'SCROLLING') {
        this.el.d.classList.add('act');
      } else if (state === 'VERIFYING_BOTTOM') {
        this.el.d.classList.add('chk');
      } else if (state === 'COUNTDOWN_NEXT') {
        this.el.d.classList.add('cd');
        this.el.c.style.display = 'inline-block';
      } else if (state === 'END_OF_SERIES') {
        this.el.d.classList.add('end');
        this.fade = setTimeout(() => { this.el.p.style.opacity = '0'; }, 5000);
      }
    }

    setCountdown(sec) {
      const dict = this.getDict();
      this.el.t.textContent = dict.countdown(sec);
      this.el.d.className = 'dot cd';
      this.el.c.style.display = 'inline-block';
      this.el.c.textContent = dict.cancel;
      this.el.hBtn.textContent = dict.hideBtn;
      this.el.p.classList.remove('dimmed');
    }

    setMinimized(v) {
      if (!this.el) return;
      this.el.p.style.display = v ? 'none' : '';
      this.el.mini.style.display = v ? 'flex' : 'none';
    }
    setVisible(v) {
      if (this.host) {
        this.host.classList.toggle('mfs-hidden', !v);
        this.host.style.setProperty('display', v ? 'block' : 'none', 'important');
        this.host.style.setProperty('visibility', v ? 'visible' : 'hidden', 'important');
      }
    }
  }

  /** 4. Manga Scroll Engine */
  class MangaScrollEngine {
    constructor() {
      this.storage = new StorageManager();
      this.finder = new NextChapterFinder(this.storage);
      this.zoomManager = new ZoomManager();
      this.hud = null;
      this.state = 'IDLE';
      this.isPlaying = false;
      this.speed = 140;
      this.subPixelAccumulator = 0;
      this.lastTs = 0;
      this.rafId = null;
      this.verifyTimer = null;
      this.verifyStartH = 0;
      this.observer = null;
      this.cdInterval = null;
      this.lastUrl = location.href;
      this.isProg = false;
      this.wasPlayingBeforeHidden = false;
      this.touching = false; this.settling = false;
    }
    async start() {
      await this.storage.init();
      this.speed = this.storage.getEffectiveSpeed();
      this.zoomManager.apply(this.storage.get().zoom);
      this.hud = new FloatingHUD({
        onPlay: () => this.toggle(),
        onSpeed: d => this.adjustSpeed(d),
        onCancel: () => this.cancelCountdown(),
        onHide: () => {
          // Minimize to a small edge tab (tap it to restore) instead of vanishing, so touch users can bring it back
          this.hud.setMinimized(true);
          this.storage.save({ hudMin: true });
        },
        onZoomCycle: () => {
          const cycles = [100, 85, 70, 120];
          const cur = this.storage.get().zoom || 100;
          const next = cycles[(cycles.indexOf(cur) + 1) % cycles.length];
          this.storage.save({ zoom: next });
          this.zoomManager.apply(next);
          this.hud.update(this.state, this.isPlaying, this.speed);
        }
      }, this.storage);

      this.hud.setVisible(this.storage.get().showHUD);
      this.hud.update(this.state, this.isPlaying, this.speed);
      this.bindEvents();
      this.bindStorage();
      this.bindSPA();
      this.bindMessages();
      try { chrome.runtime.sendMessage({ type: 'MFS_ZOOM_Q' }, z => { void chrome.runtime.lastError; if (typeof z === 'number') this.hud.fixScale(z); }); } catch (_) {}

      // Only resume if coming from an auto-next navigation on the same manga domain!
      const shouldResume = sessionStorage.getItem('mfs_next_resume') === 'true' ||
        (this.storage.get().nextResume?.host === location.hostname && Date.now() - (this.storage.get().nextResume?.time || 0) < 15000);

      if (shouldResume && this.storage.get().autoNext) {
        sessionStorage.removeItem('mfs_next_resume');
        this.storage.save({ nextResume: null });
        this.hud.update('IDLE', true, this.speed, 'stabilizing');
        setTimeout(() => this.play(), 1200);
      }
    }
    bindMessages() {
      if (typeof chrome !== 'undefined' && chrome?.runtime?.onMessage) {
        chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
          if (msg?.type === 'MFS_GET_STATUS') {
            sendResponse({ isPlaying: this.isPlaying, speed: this.speed, state: this.state });
          } else if (msg?.type === 'MFS_ZOOM') {
            this.hud.fixScale(msg.z);
          } else if (msg?.type === 'MFS_TOGGLE_PLAY') {
            this.toggle();
            sendResponse({ isPlaying: this.isPlaying, speed: this.speed, state: this.state });
          }
          return true;
        });
      }
    }
    bindStorage() {
      this.storage.onChange((cfg, c) => {
        if ('showHUD' in c) {
          this.hud.setVisible(cfg.showHUD);
        }
        if ('hudMin' in c) {
          this.hud.setMinimized(Boolean(cfg.hudMin));
        }
        if ('hudPos' in c) {
          this.hud.applyPosition(cfg.hudPos);
        }
        if ('speed' in c || 'siteOverrides' in c || 'profiles' in c || 'activeProfileId' in c) {
          this.speed = this.storage.getEffectiveSpeed();
          this.hud.update(this.state, this.isPlaying, this.speed);
        }
        if ('lang' in c || 'autoHideHUD' in c) {
          this.hud.update(this.state, this.isPlaying, this.speed);
        }
        if ('zoom' in c) {
          this.zoomManager.apply(cfg.zoom);
          this.hud.update(this.state, this.isPlaying, this.speed);
        }
        if ('mode' in c) {
          this.hud.update(this.state, this.isPlaying, this.speed);
        }
      });
    }
    bindSPA() {
      const check = () => {
        if (location.href !== this.lastUrl) {
          this.lastUrl = location.href;
          this.subPixelAccumulator = 0;
          if (this.isPlaying) {
            this.hud.update('IDLE', true, this.speed, 'stabilizing');
            setTimeout(() => { if (this.isPlaying) this.play(); }, 1200);
          }
        }
      };
      const wrap = t => {
        const o = history[t];
        return function(...args) { const r = o.apply(this, args); check(); return r; };
      };
      history.pushState = wrap('pushState');
      history.replaceState = wrap('replaceState');
      window.addEventListener('popstate', check);
      setInterval(check, 1000);
    }
    getChatScroller() {
      const now = performance.now();
      if (this.chatEl && this.chatEl.isConnected && now - (this.chatElAt || 0) < 1500) return this.chatEl;
      this.chatElAt = now;
      let best = null, bestH = 0;
      // Longest big scrollable box = the conversation pane; any tag since Gemini uses a custom <infinite-scroller> (re-checked every 1.5s)
      for (const el of document.querySelectorAll('*')) {
        const h = el.scrollHeight;
        if (h <= bestH || h <= el.clientHeight + 50) continue;
        if (el.clientHeight < window.innerHeight * 0.4 || el.clientWidth < window.innerWidth * 0.4) continue;
        const o = getComputedStyle(el).overflowY;
        if (o === 'auto' || o === 'scroll' || o === 'overlay') { best = el; bestH = h; }
      }
      this.chatEl = best;
      return best;
    }
    isReaderMode() {
      const m = this.storage.get().mode;
      return m === 'reader' || m === 'chat'; // 'chat' = legacy value from v2.2.0 test builds
    }
    getMetrics() {
      if (this.isReaderMode()) {
        // Reader: article pages scroll the window; AI chats scroll an inner pane. Pick whichever has more to scroll.
        const el = this.getChatScroller();
        const winRange = document.documentElement.scrollHeight - window.innerHeight;
        if (el && el.scrollHeight - el.clientHeight > Math.max(winRange, 50)) {
          return { t: el, y: el.scrollTop, vh: el.clientHeight, h: el.scrollHeight };
        }
      }
      if (document.documentElement.scrollHeight > window.innerHeight + 10) {
        return {
          t: window,
          y: window.scrollY || document.documentElement.scrollTop || 0,
          vh: window.innerHeight,
          h: Math.max(document.documentElement.scrollHeight, document.body?.scrollHeight || 0)
        };
      }
      for (const el of document.querySelectorAll('[class*="reader"],[class*="viewer"],[id*="reader"],[id*="viewer"],main,article,div')) {
        const s = getComputedStyle(el);
        if ((s.overflowY === 'auto' || s.overflowY === 'scroll') && el.scrollHeight > el.clientHeight + 50) {
          return { t: el, y: el.scrollTop, vh: el.clientHeight, h: el.scrollHeight };
        }
      }
      return { t: window, y: window.scrollY || 0, vh: window.innerHeight, h: document.documentElement.scrollHeight };
    }
    bindEvents() {
      // User manual scroll interruption
      const onUser = (e) => {
        if (this.isProg) return;
        if (e && e.composedPath && e.composedPath().some(el => el === this.hud?.host || (el && el.id === 'mfs-host'))) return;
        if (this.isPlaying && (this.state === 'SCROLLING' || this.state === 'VERIFYING_BOTTOM')) {
          this.pause('userPaused');
        }
      };
      window.addEventListener('wheel', onUser, { passive: true });
      // Touch: finger down = user takes over (so a swipe can speed things up);
      // auto-scroll resumes once momentum settles. Two-finger tap = pause/resume.
      const inHud = e => e.composedPath && e.composedPath().some(el => el === this.hud?.host || (el && el.id === 'mfs-host'));
      let tap = null;
      window.addEventListener('touchstart', e => {
        if (inHud(e)) return;
        this.touching = true; this.settling = false;
        if (e.touches.length === 2) tap = { t: Date.now() };
        else if (e.touches.length > 2) tap = null;
      }, { passive: true });
      window.addEventListener('touchmove', () => { tap = null; }, { passive: true });
      const onTouchEnd = e => {
        if (e.touches && e.touches.length > 0) return;
        this.touching = false;
        if (tap && Date.now() - tap.t < 350) {
          tap = null;
          if (this.state === 'COUNTDOWN_NEXT') this.cancelCountdown(); else this.toggle();
          return;
        }
        tap = null;
        this.settling = true; this.settleY = null; this.lastMoveTs = performance.now();
      };
      window.addEventListener('touchend', onTouchEnd, { passive: true });
      window.addEventListener('touchcancel', onTouchEnd, { passive: true });

      // Tab visibility: auto-pause when leaving tab, auto-resume when returning!
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          if (this.isPlaying) {
            this.wasPlayingBeforeHidden = true;
            this.pause('tabAway');
          }
        } else {
          if (this.wasPlayingBeforeHidden) {
            this.wasPlayingBeforeHidden = false;
            this.play();
          }
        }
      });

      // Keyboard shortcuts
      window.addEventListener('keydown', e => {
        const tag = e.target?.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || e.target?.isContentEditable) return;

        // Spacebar: Toggle Play / Pause or Cancel countdown
        if (e.code === 'Space' || e.key === ' ' || e.keyCode === 32) {
          // Never hijack Space on tabs where the user hasn't started Untouch Flow (YouTube, Spotify, etc.)
          let armed = false; try { armed = sessionStorage.getItem('mfs_armed') === '1'; } catch (_) {}
          if (!this.isPlaying && !armed && this.state !== 'COUNTDOWN_NEXT') return;
          e.preventDefault();
          if (this.state === 'COUNTDOWN_NEXT') {
            this.cancelCountdown();
          } else {
            this.toggle();
          }
          return;
        }

        // Alt + S: Toggle Play/Pause
        if (e.altKey && (e.key === 's' || e.key === 'S')) {
          e.preventDefault();
          this.toggle();
        }
        // Alt + H: Toggle Floating HUD Show/Hide
        else if (e.altKey && (e.key === 'h' || e.key === 'H')) {
          e.preventDefault();
          const nextVal = !this.storage.get().showHUD;
          this.storage.save({ showHUD: nextVal });
          this.hud.setVisible(nextVal);
        }
        // Escape: Stop
        else if (e.key === 'Escape') {
          if (this.state === 'COUNTDOWN_NEXT') this.cancelCountdown();
          else this.pause();
        }
        // Plain Up/Down while playing: jump ~30% of the viewport per press (native arrow scroll is only ~40px). Engine re-syncs to the new position like after a swipe.
        else if (this.isPlaying && !e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
          e.preventDefault();
          const m = this.getMetrics(), d = Math.round(m.vh * 0.3) * (e.key === 'ArrowDown' ? 1 : -1);
          if (m.t === window) window.scrollBy(0, d); else m.t.scrollTop += d;
        }
        // Speed: Shift+Arrow only; plain arrows stay native so the user can scroll by hand while playing
        else if (this.isPlaying && e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey && e.key === 'ArrowUp') {
          e.preventDefault();
          this.adjustSpeed(20);
        } else if (this.isPlaying && e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey && e.key === 'ArrowDown') {
          e.preventDefault();
          this.adjustSpeed(-20);
        }
      }, true); // capture: sites often swallow arrow keys
    }
    toggle() { this.isPlaying ? this.pause() : this.play(); }
    play() {
      try { sessionStorage.setItem('mfs_armed', '1'); } catch (_) {}
      this.isPlaying = true;
      this.state = 'SCROLLING';
      this.lastTs = performance.now();
      this.subPixelAccumulator = 0;
      this.hud.update(this.state, true, this.speed);
      if (this.rafId) cancelAnimationFrame(this.rafId);
      this.rafId = requestAnimationFrame(this.step.bind(this));
    }
    pause(msg) {
      this.isPlaying = false;
      this.state = 'IDLE';
      if (this.rafId) cancelAnimationFrame(this.rafId);
      this.cleanVerification();
      this.cleanCountdown();
      this.hud.update(this.state, false, this.speed, msg);
    }
    adjustSpeed(d) {
      const n = Math.max(10, Math.min(2000, this.speed + d));
      this.speed = n;
      // Effective speed comes from profile/site override, so write there or onChanged resets it
      const st = this.storage, cfg = st.get(), eff = st.getEffectiveProfile(), patch = { speed: n };
      const pid = Object.keys(cfg.profiles || {}).find(k => cfg.profiles[k] === eff);
      if (pid) patch.profiles = { ...cfg.profiles, [pid]: { ...eff, speed: n } };
      else if (cfg.siteOverrides && typeof cfg.siteOverrides[st.host] === 'number') patch.siteOverrides = { ...cfg.siteOverrides, [st.host]: n };
      st.save(patch);
      this.hud.update(this.state, this.isPlaying, this.speed);
    }
    getReaderContainer() {
      return document.querySelector('#readerarea, #chapter-images, .reading-content, .entry-content, [class*="readerarea"], [class*="reading-content"], .comic-page, .chapter-container');
    }
    getBottomNavigationElement() {
      const navBottom = document.querySelector('.chnav.cbot, .btm-np, .chapter-navigation:last-of-type, .nav-links:last-of-type, [class*="nav-bottom"], [class*="bottom-nav"]');
      if (navBottom && this.finder.isVisible(navBottom)) return navBottom;

      const reader = this.getReaderContainer();
      const nextBtns = document.querySelectorAll('.ch-next-btn, a[rel="next"], .next_page, a.btn-next, [class*="next-chap"]');
      const docH = Math.max(document.documentElement.scrollHeight, document.body?.scrollHeight || 0);

      for (const btn of nextBtns) {
        if (!this.finder.isVisible(btn)) continue;
        if (reader) {
          try {
            if (reader.compareDocumentPosition(btn) & Node.DOCUMENT_POSITION_FOLLOWING) {
              return btn;
            }
          } catch (e) {}
        } else {
          const topAbs = btn.getBoundingClientRect().top + (window.scrollY || 0);
          if (topAbs > 500 && (topAbs > docH * 0.35 || topAbs > window.innerHeight * 1.5)) {
            return btn;
          }
        }
      }
      return null;
    }
    getCommentBoundary() {
      const el = document.querySelector('#comments, #respond, .comments-area, #disqus_thread, .fb-comments, #commentform, .entry-comments');
      if (el && this.finder.isVisible(el)) {
        const reader = this.getReaderContainer();
        if (reader) {
          try {
            if (reader.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING) return el;
          } catch (e) {}
        } else {
          const topAbs = el.getBoundingClientRect().top + (window.scrollY || 0);
          if (topAbs > 500) return el;
        }
      }
      return null;
    }
    getLastMangaImage() {
      const reader = this.getReaderContainer();
      let imgs = [];
      if (reader) {
        imgs = reader.querySelectorAll('img');
      }
      if (!imgs.length) {
        imgs = Array.from(document.querySelectorAll('img')).filter(img => {
          const r = img.getBoundingClientRect();
          return r.width > 250 || (img.naturalWidth > 250 && img.naturalHeight > 250);
        });
      }
      return imgs.length > 0 ? imgs[imgs.length - 1] : null;
    }
    isEndOfContentReached(cur) {
      if (this.isReaderMode() && cur.t !== window) return cur.y + cur.vh >= cur.h - 15; // inner pane (AI chat): plain bottom
      const hasScrolled = cur.y > 250;

      // 1. Bottom chapter navigation or Next button has entered comfortably into viewport
      const bottomNav = this.getBottomNavigationElement();
      if (bottomNav && hasScrolled) {
        const r = bottomNav.getBoundingClientRect();
        if (r.top <= cur.vh * 0.82 && r.bottom >= -50) {
          return true;
        }
      }

      // 2. Comment section reached (stop BEFORE scrolling into comments!)
      const comments = this.getCommentBoundary();
      if (comments && hasScrolled) {
        const r = comments.getBoundingClientRect();
        if (r.top <= cur.vh * 0.85) {
          return true;
        }
      }

      // 3. Last manga image scrolled past
      const lastImg = this.getLastMangaImage();
      if (lastImg && hasScrolled) {
        const r = lastImg.getBoundingClientRect();
        if (r.height > 100 && r.bottom <= cur.vh * 0.70) {
          return true;
        }
      }

      // 4. Document absolute bottom fallback
      if (cur.y + cur.vh >= cur.h - 15) {
        return true;
      }

      return false;
    }
    checkPdfPageEnd() {
      const endPage = parseInt(this.storage.get().pdfPageEnd, 10);
      if (endPage > 0) {
        const pageEl = document.querySelector(`[data-page-number="${endPage}"], #pageContainer${endPage}, .page[data-page-number="${endPage}"]`);
        if (pageEl) {
          const r = pageEl.getBoundingClientRect();
          if (r.bottom <= window.innerHeight + 10) {
            return true;
          }
        }
      }
      return false;
    }
    holdForTouch(now) {
      const y = this.getMetrics().y;
      const hold = () => { this.pos = y; this.lastSetY = null; this.lastTs = now; this.subPixelAccumulator = 0; return true; };
      if (this.touching) { this.lastMoveTs = now; return hold(); }
      if (this.settling) {
        if (this.settleY != null && Math.abs(y - this.settleY) > 0.5) this.lastMoveTs = now;
        this.settleY = y;
        if (now - this.lastMoveTs < 250) return hold();
        this.settling = false;
      }
      return false;
    }
    step(now) {
      if (!this.isPlaying || this.state !== 'SCROLLING') return;
      if (this.holdForTouch(now)) { this.rafId = requestAnimationFrame(this.step.bind(this)); return; }
      if (this.checkPdfPageEnd()) {
        this.pause();
        return;
      }
      const dt = Math.min(now - (this.lastTs || now), 100);
      this.lastTs = now;
      this.subPixelAccumulator += (this.speed * dt) / 1000;
      const px = this.subPixelAccumulator;
      if (px >= 0.05) {
        this.subPixelAccumulator = 0;
        const m = this.getMetrics();
        this.isProg = true;
        if (m.t === window) {
          // iOS WebKit drops small relative scrollBy deltas; track a float target and scroll absolutely
          const y = window.scrollY || 0;
          if (this.lastSetY == null || Math.abs(y - this.lastSetY) > 6) this.pos = y;
          this.pos += px;
          this.lastSetY = this.pos;
          window.scrollTo(0, this.pos);
        } else {
          if (this.lastTarget !== m.t) { this.lastTarget = m.t; this.lastSetY = null; }
          const y = m.t.scrollTop;
          if (this.lastSetY == null || Math.abs(y - this.lastSetY) > 6) this.pos = y;
          this.pos += px;
          this.lastSetY = this.pos;
          m.t.scrollTop = this.pos;
        }
        requestAnimationFrame(() => { this.isProg = false; });
      }
      const cur = this.getMetrics();
      if (this.isEndOfContentReached(cur)) {
        this.handleBottom();
        return;
      }
      this.rafId = requestAnimationFrame(this.step.bind(this));
    }
    handleBottom() {
      if (this.isReaderMode() && !this.getChatScroller() && document.documentElement.scrollHeight <= window.innerHeight + 10) return this.pause('noChat');
      this.cleanVerification();
      this.cleanCountdown();
      this.subPixelAccumulator = 0;
      this.verifyStartH = this.getMetrics().h;

      // Check if page expands (lazy loaded images at bottom)
      this.observer = new MutationObserver(() => {
        if (this.getMetrics().h - this.verifyStartH > 20) this.resumeScrolling();
      });
      this.observer.observe(document.body || document.documentElement, {
        childList: true, subtree: true, attributes: true,
        attributeFilter: ['src', 'data-src', 'style', 'class']
      });

      const mode = this.storage.get().mode || 'manga';
      if (this.isReaderMode()) {
        return this.pause();
      }

      const prof = this.storage.getEffectiveProfile();
      const autoNext = prof.autoNext ?? this.storage.get().autoNext ?? true;
      if (!autoNext) {
        return this.pause();
      }

      const next = this.finder.findNext();
      if (!next || next.isLast) {
        this.state = 'END_OF_SERIES';
        this.isPlaying = false;
        this.hud.update(this.state, false, this.speed);
        return;
      }

      const delay = typeof prof.nextDelay === 'number' ? prof.nextDelay : (this.storage.get().nextDelay ?? 1.0);
      if (delay <= 0) {
        this.cleanVerification();
        this.finder.execute(next);
        return;
      }

      this.state = 'COUNTDOWN_NEXT';
      let sec = Math.ceil(delay);
      this.hud.setCountdown(sec);

      this.cdInterval = setInterval(() => {
        sec -= 1;
        if (sec > 0) {
          this.hud.setCountdown(sec);
        } else {
          this.cleanVerification();
          this.cleanCountdown();
          this.finder.execute(next);
        }
      }, 1000);
    }
    resumeScrolling() {
      this.cleanVerification();
      this.cleanCountdown();
      this.state = 'SCROLLING';
      this.lastTs = performance.now();
      this.hud.update(this.state, true, this.speed);
      this.rafId = requestAnimationFrame(this.step.bind(this));
    }
    cleanVerification() {
      if (this.verifyTimer) { clearTimeout(this.verifyTimer); this.verifyTimer = null; }
      if (this.observer) { this.observer.disconnect(); this.observer = null; }
    }
    confirmEnd() {
      this.cleanVerification();
      this.cleanCountdown();
      this.pause();
    }
    cancelCountdown() {
      this.cleanCountdown();
      this.pause('cancel');
    }
    cleanCountdown() {
      if (this.cdInterval) { clearInterval(this.cdInterval); this.cdInterval = null; }
    }
  }

  const run = () => {
    const engine = new MangaScrollEngine();
    engine.start().catch(e => console.error(e));
    window.__MFS_ENGINE__ = engine;
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
