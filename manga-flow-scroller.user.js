// ==UserScript==
// @name         Untouch Flow (Auto Scroll • Auto Next)
// @namespace    https://github.com/untouch-flow
// @version      2.0.0
// @description  Silky-smooth auto-scroller for manga, webtoons & web articles with MiniTool, page zoom, multilingual support (13 languages) & auto-next navigation for Safari iOS, iPadOS, Chrome, Firefox, Kiwi Browser
// @author       Untouch Flow Team
// @match        *://*/*
// @grant        none
// @run-at       document-idle
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
      speedMinusTip: "Speed -20 px/s (Arrow Down)",
      speedPlusTip: "Speed +20 px/s (Arrow Up)",
      playTip: "Toggle Play/Pause (Space / Alt+S)",
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
      speedMinusTip: "ลดความเร็ว -20 px/s (ลูกศรลง)",
      speedPlusTip: "เพิ่มความเร็ว +20 px/s (ลูกศรขึ้น)",
      playTip: "เริ่ม/หยุดชั่วคราว (Space / Alt+S)",
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
      speedMinusTip: "速度 -20 px/s (下矢印)",
      speedPlusTip: "速度 +20 px/s (上矢印)",
      playTip: "開始 / 一時停止 (Space / Alt+S)",
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
      speedMinusTip: "속도 -20 px/s (아래 화살표)",
      speedPlusTip: "속도 +20 px/s (위 화살표)",
      playTip: "재생 / 일시정지 (Space / Alt+S)",
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
      speedMinusTip: "减速 -20 px/s (下方向键)",
      speedPlusTip: "加速 +20 px/s (上方向键)",
      playTip: "开始 / 暂停 (Space / Alt+S)",
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
      speedMinusTip: "تقليل السرعة -20 (سهم لأسفل)",
      speedPlusTip: "زيادة السرعة +20 (سهم لأعلى)",
      playTip: "تشغيل / إيقاف مؤقت (Space / Alt+S)",
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
      speedMinusTip: "Скорость -20 px/s (Стрелка вниз)",
      speedPlusTip: "Скорость +20 px/s (Стрелка вверх)",
      playTip: "Старт / Пауза (Space / Alt+S)",
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
      speedMinusTip: "Tempo -20 px/s (Pfeil runter)",
      speedPlusTip: "Tempo +20 px/s (Pfeil hoch)",
      playTip: "Start / Pause (Space / Alt+S)",
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
      speedMinusTip: "Velocità -20 px/s (Freccia giù)",
      speedPlusTip: "Velocità +20 px/s (Freccia su)",
      playTip: "Avvia / Pausa (Space / Alt+S)",
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
      speedMinusTip: "Velocidad -20 px/s (Flecha abajo)",
      speedPlusTip: "Velocidad +20 px/s (Flecha arriba)",
      playTip: "Iniciar / Pausar (Space / Alt+S)",
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
      speedMinusTip: "Giảm tốc -20 px/s (Phím xuống)",
      speedPlusTip: "Tăng tốc +20 px/s (Phím lên)",
      playTip: "Bắt đầu / Tạm dừng (Space / Alt+S)",
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
      speedMinusTip: "Kelajuan -20 px/s (Anak panah bawah)",
      speedPlusTip: "Kelajuan +20 px/s (Anak panah atas)",
      playTip: "Mula / Jeda (Space / Alt+S)",
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
      speedMinusTip: "Kecepatan -20 px/s (Panah bawah)",
      speedPlusTip: "Kecepatan +20 px/s (Panah atas)",
      playTip: "Mulai / Jeda (Space / Alt+S)",
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
        if (!chrome?.storage?.local) {
          try {
            const raw = localStorage.getItem('__MFS_CFG__');
            if (raw) this.cfg = { ...DEF, ...JSON.parse(raw) };
          } catch (e) {}
          return res(this.cfg);
        }
        chrome.storage.local.remove('isPlaying');
        chrome.storage.local.get(null, r => {
          this.cfg = { ...DEF, ...r };
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
      if (chrome?.storage?.local) {
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
      this.neg = /(\b|_)(prev|previous|list|all[\s_-]*chapters)(\b|_)|ก่อนหน้า|ย้อนกลับ|สารบัญ/i;
      this.pos = /(\b|_)(next([\s_-]*(chapter|chap|ch|ep|episode))?|chapter[\s_-]*next)(\b|_)|ตอนต่อไป|ตอนถัดไป|ถัดไป|หน้าถัดไป/i;
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

      // 2. Semantic link or next-rel tag
      const sem = document.querySelector('a[rel="next"], link[rel="next"]');
      if (sem && this.isValid(sem)) return sem;

      // 3. CMS specific next buttons
      const cms = document.querySelectorAll('.next_page, .nav-next a, .ch-next-btn, a.next, a.btn-next, [class*="next-chap"], [class*="next_chap"], [id*="next-chap"], [id*="next_chap"]');
      for (const el of cms) {
        if (this.isVisible(el) && this.isValid(el)) return el;
      }

      // 4. General link/button search with Thai & English positive keywords
      for (const el of document.querySelectorAll('a, button, [role="button"]')) {
        if (!this.isVisible(el) || el.disabled || el.getAttribute('aria-disabled') === 'true') continue;
        const t = `${el.textContent || ''} ${el.getAttribute('aria-label') || ''} ${el.getAttribute('title') || ''}`.trim();
        if (!this.neg.test(t) && this.pos.test(t) && this.isValid(el)) return el;
      }

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
      this.root.innerHTML = `
        <style>
          * {
            box-sizing: border-box; margin: 0; padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
            -webkit-font-smoothing: antialiased;
          }
          :host { all: initial; }
          .p {
            display: inline-flex; align-items: center; gap: 5px;
            background: rgba(15, 23, 42, 0.94);
            backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.16); border-radius: 99px;
            padding: 3px 9px; box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5);
            user-select: none; transition: opacity .25s ease, transform .15s ease, box-shadow .15s ease;
            font-size: 11.5px; color: #f8fafc; cursor: grab;
            max-width: calc(100vw - 16px);
          }
          .p.dimmed { opacity: 0.15 !important; }
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
          .t { font-weight: 600; white-space: nowrap; font-size: 11.5px; max-width: 95px; overflow: hidden; text-overflow: ellipsis; }
          .s { font-size: 10px; font-weight: 700; color: #93c5fd; background: rgba(255, 255, 255, 0.12); padding: 1px 5px; border-radius: 4px; white-space: nowrap; }
          .bs { display: flex; align-items: center; gap: 3px; cursor: default; }
          .b {
            background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.12);
            color: #fff; width: 22px; height: 22px; border-radius: 4px; display: flex;
            align-items: center; justify-content: center; cursor: pointer; font-size: 11px; font-weight: 700;
          }
          .b:hover { background: rgba(255, 255, 255, 0.22); }
          .pb { width: 24px; height: 24px; background: #6366f1; border-color: #818cf8; border-radius: 50%; font-size: 11px; }
          .pb:hover { background: #4f46e5; }
          .zb {
            width: auto; height: 22px; padding: 0 5px; font-size: 10px; font-weight: 700; color: #93c5fd;
            background: rgba(255, 255, 255, 0.08); border-radius: 4px;
          }
          .zb:hover { background: rgba(99, 102, 241, 0.3); border-color: #818cf8; color: #fff; }
          .cb { background: #ef4444; border: 0; color: #fff; padding: 1px 6px; height: 22px; border-radius: 4px; font-size: 10px; font-weight: 600; cursor: pointer; display: none; }
          .hide-btn {
            background: rgba(255, 255, 255, 0.12); border: 1px solid rgba(255, 255, 255, 0.20);
            color: #ffffff; padding: 0 8px; width: auto; height: 22px; border-radius: 5px;
            font-size: 11.5px; font-weight: 700; cursor: pointer; white-space: nowrap;
            display: inline-flex; align-items: center; justify-content: center;
            transition: all .15s ease;
          }
          .hide-btn:hover {
            background: rgba(239, 68, 68, 0.35); border-color: #ef4444; color: #ffffff;
            transform: scale(1.02);
          }
        </style>
        <div class="p" id="p">
          <div class="drag-handle" id="drag" title="${dict.dragTip}">⠿</div>
          <div class="dot" id="d"></div>
          <span class="t" id="t">${dict.paused}</span>
          <span class="s" id="s">140 px/s</span>
          <div class="bs">
            <button class="b" id="m" title="${dict.speedMinusTip}">−</button>
            <button class="b" id="a" title="${dict.speedPlusTip}">+</button>
            <button class="b pb" id="play" title="${dict.playTip}">▶</button>
            <button class="b zb" id="zBtn" title="${dict.zoomTip}">100%</button>
            <button class="cb" id="c">${dict.cancel}</button>
            <button class="hide-btn" id="hBtn" title="${dict.hideTip}">${dict.hideBtn}</button>
          </div>
        </div>
      `;

      const $ = id => this.root.getElementById(id);
      this.el = {
        p: $('p'), d: $('d'), t: $('t'), s: $('s'),
        m: $('m'), a: $('a'), play: $('play'), zBtn: $('zBtn'), c: $('c'),
        hBtn: $('hBtn'), drag: $('drag')
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

      // Draggable Setup
      this.setupDraggable();

      // Apply initial position & visibility
      this.applyPosition(this.storage.get().hudPos);
      this.setVisible(this.storage.get().showHUD);

      // Re-clamp on window resize
      window.addEventListener('resize', () => {
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
        if (e.button !== 0) return;
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;

        const rect = this.host.getBoundingClientRect();
        initialLeft = rect.left;
        initialTop = rect.top;

        this.el.p.classList.add('dragging');
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
        const w = rect.width || 250;
        const h = rect.height || 32;
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
        this.el.p.classList.remove('dragging');
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
        window.removeEventListener('pointercancel', onPointerUp);

        const rect = this.host.getBoundingClientRect();
        this.storage.save({
          hudPos: { x: Math.round(rect.left), y: Math.round(rect.top) }
        });
      };

      this.el.p.addEventListener('pointerdown', onPointerDown);
    }

    applyPosition(pos) {
      if (pos && typeof pos.x === 'number' && typeof pos.y === 'number') {
        const rect = this.host.getBoundingClientRect();
        const w = rect.width > 0 ? rect.width : 250;
        const h = rect.height > 0 ? rect.height : 32;
        const maxX = Math.max(8, window.innerWidth - w - 8);
        const maxY = Math.max(8, window.innerHeight - h - 8);
        const x = Math.max(8, Math.min(maxX, pos.x));
        const y = Math.max(8, Math.min(maxY, pos.y));

        this.host.style.setProperty('left', `${x}px`, 'important');
        this.host.style.setProperty('top', `${y}px`, 'important');
        this.host.style.setProperty('right', 'auto', 'important');
        this.host.style.setProperty('bottom', 'auto', 'important');
      } else {
        this.host.style.setProperty('left', 'auto', 'important');
        this.host.style.setProperty('top', 'auto', 'important');
        this.host.style.setProperty('right', '14px', 'important');
        this.host.style.setProperty('bottom', '14px', 'important');
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

      // Auto-hide dimming when scrolling
      const shouldDim = Boolean(this.storage.get().autoHideHUD && state === 'SCROLLING');
      this.el.p.classList.toggle('dimmed', shouldDim);

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
          this.storage.save({ showHUD: false });
          this.hud.setVisible(false);
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
      if (chrome?.runtime?.onMessage) {
        chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
          if (msg?.type === 'MFS_GET_STATUS') {
            sendResponse({ isPlaying: this.isPlaying, speed: this.speed, state: this.state });
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
    getMetrics() {
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
      const onUser = () => {
        if (this.isProg) return;
        if (this.isPlaying && (this.state === 'SCROLLING' || this.state === 'VERIFYING_BOTTOM')) {
          this.pause('userPaused');
        }
      };
      window.addEventListener('wheel', onUser, { passive: true });
      window.addEventListener('touchstart', onUser, { passive: true });

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
        // Speed adjustments
        else if (this.isPlaying && e.key === 'ArrowUp') {
          e.preventDefault();
          this.adjustSpeed(20);
        } else if (this.isPlaying && e.key === 'ArrowDown') {
          e.preventDefault();
          this.adjustSpeed(-20);
        }
      });
    }
    toggle() { this.isPlaying ? this.pause() : this.play(); }
    play() {
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
      this.storage.save({ speed: n });
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
    step(now) {
      if (!this.isPlaying || this.state !== 'SCROLLING') return;
      if (this.checkPdfPageEnd()) {
        this.pause();
        return;
      }
      const dt = Math.min(now - (this.lastTs || now), 100);
      this.lastTs = now;
      this.subPixelAccumulator += (this.speed * dt) / 1000;
      const px = Math.floor(this.subPixelAccumulator);
      if (px >= 1) {
        this.subPixelAccumulator -= px;
        const m = this.getMetrics();
        this.isProg = true;
        if (m.t === window) window.scrollBy({ top: px, behavior: 'instant' });
        else m.t.scrollTop += px;
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
      if (mode === 'reader') {
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
