/**
 * Untouch Flow (Auto Scroll • Auto Next) - Popup Controller
 * Modern Minimal UI, Profiles Dropdown, Language Flags, Unified Delay
 */
(() => {
  'use strict';

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

  const FLAGS = {
    en: { flag: '🇬🇧', name: 'English' },
    th: { flag: '🇹🇭', name: 'ภาษาไทย' },
    ja: { flag: '🇯🇵', name: '日本語' },
    ko: { flag: '🇰🇷', name: '한국어' },
    zh: { flag: '🇨🇳', name: '中文' },
    ar: { flag: '🇸🇦', name: 'العربية' },
    ru: { flag: '🇷🇺', name: 'Русский' },
    de: { flag: '🇩🇪', name: 'Deutsch' },
    it: { flag: '🇮🇹', name: 'Italiano' },
    es: { flag: '🇪🇸', name: 'Español' },
    vi: { flag: '🇻🇳', name: 'Tiếng Việt' },
    ms: { flag: '🇲🇾', name: 'Bahasa Melayu' },
    id: { flag: '🇮🇩', name: 'Bahasa Indonesia' }
  };

  const I18N = {
    en: {
      statusPlaying: 'Scrolling', statusPaused: 'Paused',
      startBtn: 'Start Scrolling (Space)', pauseBtn: 'Pause (Space)',
      modeManga: 'Manga Mode', modeReader: 'Reader Mode',
      speedLbl: 'Scroll Speed',
      zoomLbl: '🔍 Manga / Page Zoom', zoomSub: 'Scale manga to comfortable reading width',
      nextDelayLbl: 'Next Chapter Delay', nextDelaySub: 'Hold at bottom before advancing to next chapter',
      pdfEndLbl: '📑 Stop at Page (PDF)', pdfEndSub: 'Pause scrolling when reaching page number (0 = all)',
      autoNextLbl: 'Auto-Next', hudLbl: 'MiniTool',
      autoHideHudLbl: 'Dim MiniTool on Scroll', urlFallbackLbl: 'URL Fallback',
      profLbl: 'Profiles',
      donateLbl: '☕ Buy Me a Coffee / Donate',
      donateModalTitle: 'Support Untouch Flow Developer',
      donateDesc: 'If Untouch Flow enhances your reading experience, buying a coffee is greatly appreciated! Thank you for your support ❤️',
      copyBtn: 'Copy', copied: 'Copied!', ppTip: '(Scan via Thai Banking apps)', closeBtn: 'Close',
      saveProf: 'Save Settings', savedOk: 'Saved!',
      sitesInProf: 'Sites linked to this Profile:',
      addCurrSite: (h) => `+ Add ${h} to this Profile`,
      removeCurrSite: (h) => `✓ ${h} is in this Profile (Click to remove)`,
      noCurrSite: 'Not viewing a manga page',
      noSitesYet: 'No sites linked yet (Click below to add)',
      sitesCountTxt: (c) => `${c} site${c === 1 ? '' : 's'}`,
      unitSec: 's', unitPage: 'pg', kPlay: 'Play/Pause', kHud: 'MiniTool', kStop: 'Stop', kSpeed: 'Speed',
      newProfName: (n) => `Profile ${n}`
    },
    th: {
      statusPlaying: 'กำลังเลื่อน', statusPaused: 'หยุดชั่วคราว',
      startBtn: 'เริ่มเลื่อนหน้าจอ (Space)', pauseBtn: 'หยุดชั่วคราว (Space)',
      modeManga: 'โหมดมังงะ', modeReader: 'โหมดอ่านบทความ',
      speedLbl: 'ความเร็ว (Speed)',
      zoomLbl: '🔍 ย่อ/ขยายรูปภาพ (Zoom)', zoomSub: 'ย่อภาพการ์ตูนให้อ่านได้ในระยะสายตา',
      nextDelayLbl: 'ดีเลย์เปลี่ยนตอน (Next Delay)', nextDelaySub: 'หน่วงเวลาเมื่อถึงท้ายตอนก่อนเปิดตอนถัดไปอัตโนมัติ',
      pdfEndLbl: '📑 หยุดอ่านที่หน้า (PDF Stop Page)', pdfEndSub: 'ระบุหน้าที่ต้องการให้อ่านถึงแล้วหยุดนิ่ง (0 = อ่านจนจบ)',
      autoNextLbl: 'ข้ามตอนออโต้', hudLbl: 'ปุ่ม MiniTool',
      autoHideHudLbl: 'จางปุ่ม MiniTool ขณะเลื่อน', urlFallbackLbl: 'URL สำรอง',
      profLbl: 'โปรไฟล์ (Profiles)',
      donateLbl: '☕ สนับสนุนค่ากาแฟ (Buy Me a Coffee)',
      donateModalTitle: 'สนับสนุนผู้พัฒนา Untouch Flow',
      donateDesc: 'หากส่วนขยาย Untouch Flow ช่วยให้คุณอ่านการ์ตูนสะดวกขึ้น สามารถร่วมสนับสนุนค่าน้ำค่ากาแฟ เพื่อเป็นกำลังใจในการพัฒนาต่อไปได้ครับ ขอบคุณมากๆ ครับ ❤️',
      copyBtn: 'คัดลอก', copied: 'คัดลอกแล้ว!', ppTip: '(สแกนผ่านแอปธนาคารได้ทุกธนาคารในไทย)', closeBtn: 'ปิด',
      saveProf: 'บันทึกค่า', savedOk: 'บันทึกแล้ว!',
      sitesInProf: 'เว็บที่ใช้ Profile นี้:',
      addCurrSite: (h) => `+ เพิ่ม ${h} ลงใน Profile นี้`,
      removeCurrSite: (h) => `✓ ${h} อยู่ใน Profile นี้แล้ว (คลิกเพื่อลบออก)`,
      noCurrSite: 'ไม่ได้เปิดหน้าเว็บมังงะ',
      noSitesYet: 'ยังไม่มีเว็บที่ผูกไว้ (กดปุ่มด้านล่างเพื่อเพิ่ม)',
      sitesCountTxt: (c) => `${c} เว็บ`,
      unitSec: 'วิ', unitPage: 'หน้า', kPlay: 'เริ่ม/หยุด', kHud: 'MiniTool', kStop: 'หยุด', kSpeed: 'ความเร็ว',
      newProfName: (n) => `Profile ${n}`
    },
    ja: {
      statusPlaying: 'スクロール中', statusPaused: '一時停止',
      startBtn: 'スクロール開始 (Space)', pauseBtn: '一時停止 (Space)',
      modeManga: 'マンガモード', modeReader: 'リーダーモード',
      speedLbl: 'スクロール速度',
      zoomLbl: '🔍 画像ズーム (Zoom)', zoomSub: '視野に合わせてマンガ画像を縮小/拡大',
      nextDelayLbl: '次の話への待機時間', nextDelaySub: '末尾到達後、次の話を開くまでの待機秒数',
      pdfEndLbl: '📑 停止ページ指定 (PDF)', pdfEndSub: '指定したページに到達したら停止 (0 = 最後まで)',
      autoNextLbl: '次の話へ自動遷移', hudLbl: 'MiniToolボタン',
      autoHideHudLbl: 'スクロール時にMiniToolを薄く表示', urlFallbackLbl: 'URL自動推測',
      profLbl: 'プロファイル',
      donateLbl: '☕ 開発者を支援 (Buy Me a Coffee)',
      donateModalTitle: 'Untouch Flow 開発支援',
      donateDesc: '快適にマンガをお読みいただけましたら、コーヒー一杯のご支援をいただけますと幸いです！応援ありがとうございます ❤️',
      copyBtn: 'コピー', copied: 'コピー完了!', ppTip: '(タイ銀行アプリでスキャン可能)', closeBtn: '閉じる',
      saveProf: '保存', savedOk: '保存完了!',
      sitesInProf: 'このプロファイルに紐付いたサイト:',
      addCurrSite: (h) => `+ ${h} をこのプロファイルに追加`,
      removeCurrSite: (h) => `✓ ${h} は登録済み (クリックで解除)`,
      noCurrSite: 'マンガページを開いていません',
      noSitesYet: '登録されたサイトはありません',
      sitesCountTxt: (c) => `${c} サイト`,
      unitSec: '秒', unitPage: 'ページ', kPlay: '開始/停止', kHud: 'MiniTool', kStop: '停止', kSpeed: '速度',
      newProfName: (n) => `プロファイル ${n}`
    },
    ko: {
      statusPlaying: '스크롤 중', statusPaused: '일시정지',
      startBtn: '스크롤 시작 (Space)', pauseBtn: '일시정지 (Space)',
      modeManga: '웹툰 모드', modeReader: '리더 모드',
      speedLbl: '스크롤 속도',
      zoomLbl: '🔍 이미지 확대/축소 (Zoom)', zoomSub: '시야 범위에 맞춰 웹툰 폭 조절',
      nextDelayLbl: '다음 화 대기시간', nextDelaySub: '하단 도달 후 다음 화로 넘어가기 전 대기시간',
      pdfEndLbl: '📑 정지 페이지 지정 (PDF)', pdfEndSub: '해당 페이지에 도달하면 스크롤 중지 (0 = 끝까지)',
      autoNextLbl: '다음 화 자동이동', hudLbl: 'MiniTool 버튼',
      autoHideHudLbl: '스크롤 시 MiniTool 투명화', urlFallbackLbl: 'URL 자동추정',
      profLbl: '프로필',
      donateLbl: '☕ 개발자 커피 후원 (Buy Me a Coffee)',
      donateModalTitle: 'Untouch Flow 개발 후원',
      donateDesc: '이 확장 프로그램이 편안한 감상에 도움이 되었다면, 커피 한 잔으로 따뜻한 응원을 부탁드립니다! 감사합니다 ❤️',
      copyBtn: '복사', copied: '복사 완료!', ppTip: '(태국 은행 앱으로 스캔 가능)', closeBtn: '닫기',
      saveProf: '설정 저장', savedOk: '저장 완료!',
      sitesInProf: '이 프로필에 등록된 사이트:',
      addCurrSite: (h) => `+ ${h} 사이트 추가`,
      removeCurrSite: (h) => `✓ ${h} 등록됨 (클릭하여 삭제)`,
      noCurrSite: '웹툰 사이트가 아닙니다',
      noSitesYet: '등록된 사이트가 없습니다',
      sitesCountTxt: (c) => `${c}개 사이트`,
      unitSec: '초', unitPage: '페이지', kPlay: '재생/정지', kHud: 'MiniTool', kStop: '중지', kSpeed: '속도',
      newProfName: (n) => `프로필 ${n}`
    },
    zh: {
      statusPlaying: '正在滚动', statusPaused: '已暂停',
      startBtn: '开始滚动 (Space)', pauseBtn: '暂停滚动 (Space)',
      modeManga: '漫画模式', modeReader: '阅读模式',
      speedLbl: '滚动速度',
      zoomLbl: '🔍 图片缩放 (Zoom)', zoomSub: '缩减漫画宽度，尽在视线范围内',
      nextDelayLbl: '翻话延迟时间', nextDelaySub: '到底后自动前往下一话前的停留秒数',
      pdfEndLbl: '📑 停止页码 (PDF)', pdfEndSub: '滚动到指定页码后自动停下 (0 = 读完全部)',
      autoNextLbl: '自动下一话', hudLbl: 'MiniTool悬浮钮',
      autoHideHudLbl: '滚动时半透明MiniTool', urlFallbackLbl: 'URL 自增兜底',
      profLbl: '配置',
      donateLbl: '☕ 请开发者喝杯咖啡 (Donate)',
      donateModalTitle: '赞助 Untouch Flow 开发者',
      donateDesc: '如果这款插件让您的阅读更加顺畅惬意，欢迎请作者喝杯咖啡支持后续维护！衷心感谢 ❤️',
      copyBtn: '复制', copied: '已复制!', ppTip: '(支持 PromptPay / 银行扫码)', closeBtn: '关闭',
      saveProf: '保存设置', savedOk: '已保存!',
      sitesInProf: '绑定到此配置的网站:',
      addCurrSite: (h) => `+ 添加 ${h} 到当前配置`,
      removeCurrSite: (h) => `✓ ${h} 已绑定 (点击移除)`,
      noCurrSite: '未在漫画页面',
      noSitesYet: '暂无绑定网站',
      sitesCountTxt: (c) => `${c} 个网站`,
      unitSec: '秒', unitPage: '页', kPlay: '开始/暂停', kHud: 'MiniTool', kStop: '停止', kSpeed: '速度',
      newProfName: (n) => `配置 ${n}`
    },
    ar: {
      statusPlaying: 'تمرير', statusPaused: 'مؤقت',
      startBtn: 'بدء التمرير (Space)', pauseBtn: 'إيقاف مؤقت (Space)',
      modeManga: 'وضع المانجا', modeReader: 'وضع القراءة',
      speedLbl: 'سرعة التمرير',
      zoomLbl: '🔍 تكبير/تصغير (Zoom)', zoomSub: 'تعديل عرض المانجا ليناسب مدى رؤيتك',
      nextDelayLbl: 'مهلة الفصل التالي', nextDelaySub: 'الانتظار عند نهاية الصفحة قبل فتح الفصل التالي',
      pdfEndLbl: '📑 التوقف عند صفحة (PDF)', pdfEndSub: 'إيقاف التمرير عند الوصول لرقم الصفحة (0 = للآخر)',
      autoNextLbl: 'الفصل التالي تلقائياً', hudLbl: 'أداة MiniTool',
      autoHideHudLbl: 'تلاشي MiniTool أثناء التمرير', urlFallbackLbl: 'تخمين الرابط',
      profLbl: 'الملفات',
      donateLbl: '☕ ادعم المطور (Buy Me a Coffee)',
      donateModalTitle: 'دعم مطور Untouch Flow',
      donateDesc: 'إذا كانت هذه الأداة تجعل قراءتك للمانجا أكثر متعة وسهولة، يسعدنا دعمك لمواصلة التطوير! شكراً جزيلاً ❤️',
      copyBtn: 'نسخ', copied: 'تم النسخ!', ppTip: '(عبر تطبيقات الدفع البنكية)', closeBtn: 'إغلاق',
      saveProf: 'حفظ الإعدادات', savedOk: 'تم الحفظ!',
      sitesInProf: 'المواقع المرتبطة بهذا الملف:',
      addCurrSite: (h) => `+ إضافة ${h} لهذا الملف`,
      removeCurrSite: (h) => `✓ ${h} مسجل بالفعل (انقر للحذف)`,
      noCurrSite: 'الصفحة ليست صفحة مانجا',
      noSitesYet: 'لا توجد مواقع مرتبطة بعد',
      sitesCountTxt: (c) => `${c} مواقع`,
      unitSec: 'ث', unitPage: 'ص', kPlay: 'تشغيل/إيقاف', kHud: 'MiniTool', kStop: 'وقف', kSpeed: 'سرعة',
      newProfName: (n) => `الملف ${n}`
    },
    ru: {
      statusPlaying: 'Прокрутка', statusPaused: 'Пауза',
      startBtn: 'Начать прокрутку (Space)', pauseBtn: 'Пауза (Space)',
      modeManga: 'Режим манги', modeReader: 'Режим чтения',
      speedLbl: 'Скорость прокрутки',
      zoomLbl: '🔍 Масштаб изображений (Zoom)', zoomSub: 'Масштабируйте под комфортную ширину обзора',
      nextDelayLbl: 'Задержка смены главы', nextDelaySub: 'Ожидание внизу страницы перед переходом',
      pdfEndLbl: '📑 Остановка на странице (PDF)', pdfEndSub: 'Остановить автопрокрутку на указанной странице (0 = до конца)',
      autoNextLbl: 'Автопереход на след. главу', hudLbl: 'MiniTool',
      autoHideHudLbl: 'Затемнять MiniTool при скролле', urlFallbackLbl: 'URL инкремент',
      profLbl: 'Профили',
      donateLbl: '☕ Поддержать автора (Buy Me a Coffee)',
      donateModalTitle: 'Поддержка автора Untouch Flow',
      donateDesc: 'Если расширение делает чтение манги комфортнее, вы можете угостить автора чашкой кофе! Спасибо огромное ❤️',
      copyBtn: 'Копировать', copied: 'Скопировано!', ppTip: '(Scan via Thai Banking apps)', closeBtn: 'Закрыть',
      saveProf: 'Сохранить', savedOk: 'Сохранено!',
      sitesInProf: 'Сайты в этом профиле:',
      addCurrSite: (h) => `+ Добавить ${h} в этот профиль`,
      removeCurrSite: (h) => `✓ ${h} добавлен (клик для удаления)`,
      noCurrSite: 'Страница манги не открыта',
      noSitesYet: 'Сайты пока не привязаны',
      sitesCountTxt: (c) => `${c} сайтов`,
      unitSec: 'с', unitPage: 'стр', kPlay: 'Старт/Пауза', kHud: 'MiniTool', kStop: 'Стоп', kSpeed: 'Скорость',
      newProfName: (n) => `Профиль ${n}`
    },
    de: {
      statusPlaying: 'Scrollen', statusPaused: 'Pausiert',
      startBtn: 'Scrollen starten (Space)', pauseBtn: 'Pausieren (Space)',
      modeManga: 'Manga-Modus', modeReader: 'Lesemodus',
      speedLbl: 'Scrollgeschwindigkeit',
      zoomLbl: '🔍 Bildgröße anpassen (Zoom)', zoomSub: 'Manga auf angenehme Sichtbreite skalieren',
      nextDelayLbl: 'Nächstes Kapitel Verzögerung', nextDelaySub: 'Wartezeit am Ende vor dem Weiterblättern',
      pdfEndLbl: '📑 Stopp bei Seite (PDF)', pdfEndSub: 'Hält an, wenn Seitennummer erreicht wird (0 = bis Ende)',
      autoNextLbl: 'Nächstes Kapitel auto', hudLbl: 'MiniTool',
      autoHideHudLbl: 'MiniTool beim Scrollen dimmen', urlFallbackLbl: 'URL-Fallback',
      profLbl: 'Profile',
      donateLbl: '☕ Entwickler unterstützen (Kaffee spendieren)',
      donateModalTitle: 'Untouch Flow Entwickler unterstützen',
      donateDesc: 'Wenn diese Erweiterung dein Leseerlebnis verbessert, freuen wir uns über einen Kaffee! Herzlichen Dank ❤️',
      copyBtn: 'Kopieren', copied: 'Kopiert!', ppTip: '(Scan via Bank-App)', closeBtn: 'Schließen',
      saveProf: 'Speichern', savedOk: 'Gespeichert!',
      sitesInProf: 'Mit diesem Profil verknüpfte Websites:',
      addCurrSite: (h) => `+ ${h} zu diesem Profil hinzufügen`,
      removeCurrSite: (h) => `✓ ${h} ist verknüpft (Klicken zum Entfernen)`,
      noCurrSite: 'Keine Manga-Seite aktiv',
      noSitesYet: 'Noch keine Websites verknüpft',
      sitesCountTxt: (c) => `${c} Seite${c === 1 ? '' : 'n'}`,
      unitSec: 's', unitPage: 'S.', kPlay: 'Start/Pause', kHud: 'MiniTool', kStop: 'Stopp', kSpeed: 'Tempo',
      newProfName: (n) => `Profil ${n}`
    },
    it: {
      statusPlaying: 'Scorrimento', statusPaused: 'In pausa',
      startBtn: 'Avvia scorrimento (Space)', pauseBtn: 'Pausa (Space)',
      modeManga: 'Modalità Manga', modeReader: 'Modalità Lettura',
      speedLbl: 'Velocità scorrimento',
      zoomLbl: '🔍 Zoom immagini (Zoom)', zoomSub: 'Adatta la larghezza dei pannelli al tuo campo visivo',
      nextDelayLbl: 'Ritardo capitolo successivo', nextDelaySub: 'Attesa a fine pagina prima di avanzare',
      pdfEndLbl: '📑 Ferma a pagina (PDF)', pdfEndSub: 'Mette in pausa al raggiungimento della pagina specificata (0 = fine)',
      autoNextLbl: 'Capitolo successivo auto', hudLbl: 'MiniTool',
      autoHideHudLbl: 'Dissolvenza MiniTool allo scorrimento', urlFallbackLbl: 'Fallback URL',
      profLbl: 'Profili',
      donateLbl: '☕ Offri un caffè allo sviluppatore',
      donateModalTitle: 'Supporta lo sviluppatore di Untouch Flow',
      donateDesc: 'Se questa estensione rende la tua lettura più piacevole, un caffè è un grande incoraggiamento! Grazie di cuore ❤️',
      copyBtn: 'Copia', copied: 'Copiato!', ppTip: '(Scansiona con app bancaria)', closeBtn: 'Chiudi',
      saveProf: 'Salva impostazioni', savedOk: 'Salvato!',
      sitesInProf: 'Siti collegati a questo profilo:',
      addCurrSite: (h) => `+ Aggiungi ${h} a questo profilo`,
      removeCurrSite: (h) => `✓ ${h} è registrato (Clicca per rimuovere)`,
      noCurrSite: 'Nessuna pagina manga attiva',
      noSitesYet: 'Nessun sito collegato',
      sitesCountTxt: (c) => `${c} sit${c === 1 ? 'o' : 'i'}`,
      unitSec: 's', unitPage: 'pag', kPlay: 'Avvia/Pausa', kHud: 'MiniTool', kStop: 'Stop', kSpeed: 'Velocità',
      newProfName: (n) => `Profilo ${n}`
    },
    es: {
      statusPlaying: 'Desplazando', statusPaused: 'En pausa',
      startBtn: 'Iniciar desplazamiento (Space)', pauseBtn: 'Pausar (Space)',
      modeManga: 'Modo Manga', modeReader: 'Modo Lector',
      speedLbl: 'Velocidad de desplazamiento',
      zoomLbl: '🔍 Zoom de imágenes (Zoom)', zoomSub: 'Escala el ancho de la viñeta para lectura cómoda',
      nextDelayLbl: 'Retardo del siguiente capítulo', nextDelaySub: 'Espera al final antes de avanzar automáticamente',
      pdfEndLbl: '📑 Parar en página (PDF)', pdfEndSub: 'Pausa el desplazamiento al llegar a la página indicada (0 = final)',
      autoNextLbl: 'Siguiente capítulo auto', hudLbl: 'MiniTool',
      autoHideHudLbl: 'Atenuar MiniTool al desplazar', urlFallbackLbl: 'URL incremental',
      profLbl: 'Perfiles',
      donateLbl: '☕ Invita un café al desarrollador',
      donateModalTitle: 'Apoya al creador de Untouch Flow',
      donateDesc: 'Si esta extensión hace tu lectura más cómoda, ¡un café es una gran motivación para seguir mejorando! Muchas gracias ❤️',
      copyBtn: 'Copiar', copied: '¡Copiado!', ppTip: '(Escanear con app bancaria)', closeBtn: 'Cerrar',
      saveProf: 'Guardar ajustes', savedOk: '¡Guardado!',
      sitesInProf: 'Sitios vinculados a este perfil:',
      addCurrSite: (h) => `+ Añadir ${h} a este perfil`,
      removeCurrSite: (h) => `✓ ${h} vinculado (Clic para quitar)`,
      noCurrSite: 'Página de manga no detectada',
      noSitesYet: 'Aún no hay sitios vinculados',
      sitesCountTxt: (c) => `${c} sitio${c === 1 ? '' : 's'}`,
      unitSec: 's', unitPage: 'pág', kPlay: 'Iniciar/Pausar', kHud: 'MiniTool', kStop: 'Parar', kSpeed: 'Velocidad',
      newProfName: (n) => `Perfil ${n}`
    },
    vi: {
      statusPlaying: 'Đang cuộn', statusPaused: 'Tạm dừng',
      startBtn: 'Bắt đầu cuộn (Space)', pauseBtn: 'Tạm dừng (Space)',
      modeManga: 'Chế độ Truyện tranh', modeReader: 'Chế độ Đọc sách',
      speedLbl: 'Tốc độ cuộn trang',
      zoomLbl: '🔍 Thu phóng hình ảnh (Zoom)', zoomSub: 'Thu nhỏ chiều rộng truyện vừa tầm mắt đọc',
      nextDelayLbl: 'Độ trễ chuyển chương', nextDelaySub: 'Thời gian chờ ở cuối trang trước khi sang chương mới',
      pdfEndLbl: '📑 Dừng tại trang (PDF)', pdfEndSub: 'Dừng cuộn khi đến số trang chỉ định (0 = hết trang)',
      autoNextLbl: 'Tự chuyển chương', hudLbl: 'MiniTool',
      autoHideHudLbl: 'Mờ MiniTool khi cuộn', urlFallbackLbl: 'URL dự phòng',
      profLbl: 'Hồ sơ',
      donateLbl: '☕ Mời ly cà phê (Buy Me a Coffee)',
      donateModalTitle: 'Ủng hộ tác giả Untouch Flow',
      donateDesc: 'Nếu tiện ích Untouch Flow giúp bạn đọc truyện thoải mái hơn, hãy ủng hộ một ly cà phê nhé! Cảm ơn bạn rất nhiều ❤️',
      copyBtn: 'Sao chép', copied: 'Đã chép!', ppTip: '(Quét bằng app ngân hàng)', closeBtn: 'Đóng',
      saveProf: 'Lưu cài đặt', savedOk: 'Đã lưu!',
      sitesInProf: 'Các trang web trong hồ sơ này:',
      addCurrSite: (h) => `+ Thêm ${h} vào hồ sơ này`,
      removeCurrSite: (h) => `✓ ${h} đã có trong hồ sơ (Nhấp để xóa)`,
      noCurrSite: 'Không phải trang đọc truyện',
      noSitesYet: 'Chưa có trang nào được liên kết',
      sitesCountTxt: (c) => `${c} trang`,
      unitSec: 's', unitPage: 'trang', kPlay: 'Bắt đầu/Dừng', kHud: 'MiniTool', kStop: 'Dừng', kSpeed: 'Tốc độ',
      newProfName: (n) => `Hồ sơ ${n}`
    },
    ms: {
      statusPlaying: 'Menatal', statusPaused: 'Dijeda',
      startBtn: 'Mula Menatal (Space)', pauseBtn: 'Jeda (Space)',
      modeManga: 'Mod Manga', modeReader: 'Mod Pembaca',
      speedLbl: 'Kelajuan Menatal',
      zoomLbl: '🔍 Zum Imej (Zoom)', zoomSub: 'Sesuaikan lebar manga mengikut pandangan mata',
      nextDelayLbl: 'Lengah Bab Seterusnya', nextDelaySub: 'Masa menunggu di hujung sebelum ke bab seterusnya',
      pdfEndLbl: '📑 Berhenti di halaman (PDF)', pdfEndSub: 'Jeda penatalan apabila mencapai muka surat tertentu (0 = habis)',
      autoNextLbl: 'Bab seterusnya auto', hudLbl: 'MiniTool',
      autoHideHudLbl: 'Malapkan MiniTool semasa tatal', urlFallbackLbl: 'URL sandaran',
      profLbl: 'Profil',
      donateLbl: '☕ Belanja Kopi (Buy Me a Coffee)',
      donateModalTitle: 'Sokong Pembangun Untouch Flow',
      donateDesc: 'Sekiranya sambungan ini memudahkan bacaan manga anda, sokongan secawan kopi amat dihargai! Terima kasih banyak ❤️',
      copyBtn: 'Salin', copied: 'Disalin!', ppTip: '(Imbas melalui aplikasi bank)', closeBtn: 'Tutup',
      saveProf: 'Simpan Tetapan', savedOk: 'Disimpan!',
      sitesInProf: 'Laman web yang dipautkan:',
      addCurrSite: (h) => `+ Tambah ${h} ke profil ini`,
      removeCurrSite: (h) => `✓ ${h} telah dipautkan (Klik untuk buang)`,
      noCurrSite: 'Bukan halaman manga',
      noSitesYet: 'Tiada laman web dipautkan lagi',
      sitesCountTxt: (c) => `${c} laman`,
      unitSec: 's', unitPage: 'hlm', kPlay: 'Mula/Jeda', kHud: 'MiniTool', kStop: 'Henti', kSpeed: 'Kelajuan',
      newProfName: (n) => `Profil ${n}`
    },
    id: {
      statusPlaying: 'Menggulung', statusPaused: 'Dijeda',
      startBtn: 'Mulai Menggulung (Space)', pauseBtn: 'Jeda (Space)',
      modeManga: 'Mode Manga', modeReader: 'Mode Baca',
      speedLbl: 'Kecepatan Gulir',
      zoomLbl: '🔍 Zoom Gambar (Zoom)', zoomSub: 'Sesuaikan lebar manga agar pas dalam pandangan',
      nextDelayLbl: 'Jeda Chapter Berikutnya', nextDelaySub: 'Waktu tunggu di akhir halaman sebelum chapter baru',
      pdfEndLbl: '📑 Berhenti di halaman (PDF)', pdfEndSub: 'Jeda otomatis saat mencapai halaman tertentu (0 = selesai)',
      autoNextLbl: 'Chapter berikutnya auto', hudLbl: 'MiniTool',
      autoHideHudLbl: 'Redupkan MiniTool saat bergulir', urlFallbackLbl: 'URL cadangan',
      profLbl: 'Profil',
      donateLbl: '☕ Traktir Kopi (Buy Me a Coffee)',
      donateModalTitle: 'Dukung Pengembang Untouch Flow',
      donateDesc: 'Jika ekstensi Untouch Flow membuat membaca komik lebih nyaman, dukungan kopi sangat berarti! Terima kasih banyak ❤️',
      copyBtn: 'Salin', copied: 'Tersalin!', ppTip: '(Scan via aplikasi bank)', closeBtn: 'Tutup',
      saveProf: 'Simpan Pengaturan', savedOk: 'Tersimpan!',
      sitesInProf: 'Situs yang terhubung:',
      addCurrSite: (h) => `+ Tambahkan ${h} ke profil ini`,
      removeCurrSite: (h) => `✓ ${h} sudah terdaftar (Klik untuk hapus)`,
      noCurrSite: 'Bukan halaman manga',
      noSitesYet: 'Belum ada situs terhubung',
      sitesCountTxt: (c) => `${c} situs`,
      unitSec: 's', unitPage: 'hal', kPlay: 'Mulai/Jeda', kHud: 'MiniTool', kStop: 'Berhenti', kSpeed: 'Kecepatan',
      newProfName: (n) => `Profil ${n}`
    }
  };

  let cfg = { ...DEF };
  let currentHost = '';
  let activeTabId = null;
  let activeTabPlaying = false;
  let viewingProfileId = 'p1';

  const $ = id => document.getElementById(id);
  const ui = {
    langSelect: $('langSelect'), langFlagDisplay: $('langFlagDisplay'), langBtn: $('langBtn'),
    statusDot: $('statusDot'), statusTxt: $('statusTxt'),
    donateBtn: $('donateBtn'), donateModal: $('donateModal'),
    closeDonate: $('closeDonate'), doneDonateBtn: $('doneDonateBtn'),
    copyPpBtn: $('copyPpBtn'), ppNum: $('ppNum'),
    tabManga: $('tabManga'), tabReader: $('tabReader'),
    playBtn: $('playBtn'), playIco: $('playIco'), playTxt: $('playTxt'),
    speedSlider: $('speedSlider'), speedNum: $('speedNum'),
    mangaPresets: $('mangaPresets'), readerPresets: $('readerPresets'),
    zoomSlider: $('zoomSlider'), zoomNum: $('zoomNum'),
    zoomMinus: $('zoomMinus'), zoomPlus: $('zoomPlus'), resetZoomBtn: $('resetZoomBtn'),
    mangaTimingSec: $('mangaTimingSec'),
    nextDelaySlider: $('nextDelaySlider'), nextDelayNum: $('nextDelayNum'),
    readerHelperSec: $('readerHelperSec'), pdfEndNum: $('pdfEndNum'),
    autoNextItem: $('autoNextItem'), autoNext: $('autoNext'),
    showHud: $('showHud'), autoHideHud: $('autoHideHud'),
    urlFallback: $('urlFallback'),
    profileSelect: $('profileSelect'), addProfileBtn: $('addProfileBtn'),
    profNameInp: $('profNameInp'), saveProfBtn: $('saveProfBtn'), delProfBtn: $('delProfBtn'),
    chipsWrap: $('chipsWrap'), sitesCount: $('sitesCount'),
    addCurrSiteBtn: $('addCurrSiteBtn'), addCurrTxt: $('addCurrTxt')
  };

  function getProfiles() {
    if (!cfg.profiles || typeof cfg.profiles !== 'object' || Object.keys(cfg.profiles).length === 0) {
      cfg.profiles = { ...DEF.profiles };
    }
    return cfg.profiles;
  }

  function getSortedProfileList() {
    const profs = getProfiles();
    return Object.values(profs).sort((a, b) => {
      const na = parseInt((a.name.match(/\d+/) || [0])[0], 10);
      const nb = parseInt((b.name.match(/\d+/) || [0])[0], 10);
      if (na && nb) return na - nb;
      return a.name.localeCompare(b.name);
    });
  }

  function getCurrentProfile() {
    const profs = getProfiles();
    return profs[viewingProfileId] || Object.values(profs)[0] || DEF.profiles.p1;
  }

  function applyLanguage() {
    const lang = cfg.lang || 'en';
    const dict = I18N[lang] || I18N.en;
    const curFlag = FLAGS[lang] || FLAGS.en;

    if (ui.langFlagDisplay) {
      ui.langFlagDisplay.textContent = curFlag.flag;
      ui.langFlagDisplay.title = curFlag.name;
    }
    if (ui.langSelect) {
      ui.langSelect.value = lang;
      ui.langSelect.title = curFlag.name;
    }
    if (ui.langBtn) {
      ui.langBtn.textContent = lang.toUpperCase();
    }

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (dict[key]) el.textContent = dict[key];
    });
  }

  function renderStatus() {
    const lang = cfg.lang || 'en';
    const dict = I18N[lang] || I18N.en;
    const on = Boolean(activeTabPlaying);
    ui.playBtn.classList.toggle('active', on);
    ui.playIco.textContent = on ? '⏸' : '▶';
    ui.playTxt.textContent = on ? dict.pauseBtn : dict.startBtn;
    ui.statusDot.classList.toggle('on', on);
    ui.statusTxt.textContent = on ? dict.statusPlaying : dict.statusPaused;
  }

  function render() {
    applyLanguage();
    renderStatus();
    const lang = cfg.lang || 'en';
    const dict = I18N[lang] || I18N.en;
    const prof = getCurrentProfile();
    const isReader = cfg.mode === 'reader';

    // Mode Switcher Sync
    ui.tabManga.classList.toggle('active', !isReader);
    ui.tabReader.classList.toggle('active', isReader);
    ui.mangaPresets.classList.toggle('hidden', isReader);
    ui.readerPresets.classList.toggle('hidden', !isReader);
    ui.mangaTimingSec.classList.toggle('hidden', isReader);
    ui.readerHelperSec.classList.toggle('hidden', !isReader);
    ui.autoNextItem.classList.toggle('hidden', isReader);

    // Speed
    const spd = typeof prof.speed === 'number' ? prof.speed : (cfg.speed || 140);
    ui.speedSlider.value = spd;
    ui.speedNum.value = spd;

    // Presets Active States
    const targetPresets = isReader ? ui.readerPresets : ui.mangaPresets;
    targetPresets.querySelectorAll('.p-btn').forEach(b => {
      const match = parseInt(b.dataset.s, 10) === spd;
      b.classList.toggle('active', match && !isReader);
      b.classList.toggle('reader-act', match && isReader);
    });

    // Zoom
    const z = cfg.zoom || 100;
    ui.zoomSlider.value = z;
    ui.zoomNum.value = z;
    document.querySelectorAll('.z-btn[data-z]').forEach(b => {
      b.classList.toggle('active', parseInt(b.dataset.z, 10) === z);
    });

    // Unified Next Delay
    const dVal = typeof prof.nextDelay === 'number' ? prof.nextDelay : (cfg.nextDelay ?? 1.0);
    ui.nextDelaySlider.value = dVal;
    ui.nextDelayNum.value = dVal;
    document.querySelectorAll('.d-btn[data-d]').forEach(b => {
      b.classList.toggle('active', parseFloat(b.dataset.d) === dVal);
    });

    // Reader Mode PDF Stop Page
    ui.pdfEndNum.value = cfg.pdfPageEnd || 0;

    // Toggles
    ui.autoNext.checked = Boolean(prof.autoNext ?? cfg.autoNext ?? true);
    ui.showHud.checked = Boolean(cfg.showHUD !== false);
    ui.autoHideHud.checked = Boolean(cfg.autoHideHUD);
    ui.urlFallback.checked = Boolean(cfg.enableUrlFallback);

    // Profiles Dropdown Render
    renderProfileSelect();
  }

  function renderProfileSelect() {
    const lang = cfg.lang || 'en';
    const dict = I18N[lang] || I18N.en;
    const sortedProfiles = getSortedProfileList();

    // Populate <select>
    ui.profileSelect.innerHTML = '';
    sortedProfiles.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.id;
      opt.textContent = p.name;
      if (p.id === viewingProfileId) opt.selected = true;
      ui.profileSelect.appendChild(opt);
    });

    const prof = getCurrentProfile();
    ui.profNameInp.value = prof.name;

    // Show/hide delete button (can delete if there is more than 1 profile)
    ui.delProfBtn.classList.toggle('hidden', sortedProfiles.length <= 1);

    // Sites in this profile
    const sites = Array.isArray(prof.sites) ? prof.sites : [];
    ui.sitesCount.textContent = dict.sitesCountTxt(sites.length);
    ui.chipsWrap.innerHTML = '';

    if (sites.length === 0) {
      const emptySpan = document.createElement('span');
      emptySpan.className = 'no-sites';
      emptySpan.textContent = dict.noSitesYet;
      ui.chipsWrap.appendChild(emptySpan);
    } else {
      sites.forEach(s => {
        const chip = document.createElement('span');
        chip.className = 'chip';
        chip.innerHTML = `<span>${s}</span><span class="chip-x" data-s="${s}">✕</span>`;
        chip.querySelector('.chip-x').onclick = (e) => {
          e.stopPropagation();
          removeSiteFromProfile(s);
        };
        ui.chipsWrap.appendChild(chip);
      });
    }

    // Current Site Button State
    if (!currentHost) {
      ui.addCurrBtnState(false, dict.noCurrSite, true);
    } else {
      const inThis = sites.includes(currentHost);
      if (inThis) {
        ui.addCurrBtnState(true, dict.removeCurrSite(currentHost), false);
      } else {
        ui.addCurrBtnState(false, dict.addCurrSite(currentHost), false);
      }
    }
  }

  ui.addCurrBtnState = function(isAdded, text, disabled) {
    ui.addCurrBtn.classList.toggle('added', isAdded);
    ui.addCurrBtn.disabled = Boolean(disabled);
    ui.addCurrTxt.textContent = text;
  };

  function removeSiteFromProfile(host) {
    const profs = getProfiles();
    const prof = getCurrentProfile();
    prof.sites = (prof.sites || []).filter(s => s !== host);
    profs[prof.id] = prof;
    save({ profiles: profs });
  }

  function toggleCurrentSiteInProfile() {
    if (!currentHost) return;
    const profs = getProfiles();
    const prof = getCurrentProfile();
    const sites = prof.sites || [];
    if (sites.includes(currentHost)) {
      prof.sites = sites.filter(s => s !== currentHost);
    } else {
      // Remove host from other profiles first so a site only belongs to one profile
      for (const pid in profs) {
        profs[pid].sites = (profs[pid].sites || []).filter(s => s !== currentHost);
      }
      prof.sites.push(currentHost);
    }
    profs[prof.id] = prof;
    save({ profiles: profs });
  }

  function createNewProfile() {
    const profs = getProfiles();
    let maxNum = 0;
    for (const pid in profs) {
      const m = profs[pid].name.match(/Profile\s+(\d+)/i) || profs[pid].id.match(/p(\d+)/i);
      if (m) maxNum = Math.max(maxNum, parseInt(m[1], 10));
    }
    const newNum = maxNum + 1;
    const newId = `p${Date.now()}`;
    const lang = cfg.lang || 'en';
    const dict = I18N[lang] || I18N.en;

    profs[newId] = {
      id: newId,
      name: dict.newProfName(newNum),
      speed: parseInt(ui.speedNum.value, 10) || 140,
      nextDelay: parseFloat(ui.nextDelayNum.value) || 1.0,
      autoNext: ui.autoNext.checked,
      sites: []
    };
    viewingProfileId = newId;
    save({ profiles: profs, activeProfileId: newId });
  }

  function deleteCurrentProfile() {
    const profs = getProfiles();
    const keys = Object.keys(profs);
    if (keys.length <= 1) return;

    delete profs[viewingProfileId];
    viewingProfileId = Object.keys(profs)[0];
    save({ profiles: profs, activeProfileId: viewingProfileId });
  }

  function bindEvents() {
    // Mode Switcher (Manga vs Reader)
    ui.tabManga.onclick = () => save({ mode: 'manga' });
    ui.tabReader.onclick = () => save({ mode: 'reader' });

    // Language Switcher Dropdown
    if (ui.langSelect) {
      ui.langSelect.onchange = () => {
        save({ lang: ui.langSelect.value });
      };
    }
    if (ui.langBtn) {
      ui.langBtn.onclick = () => {
        const order = ['en', 'th', 'ja', 'ko', 'zh', 'ar', 'ru', 'de', 'it', 'es', 'vi', 'ms', 'id'];
        const curIdx = order.indexOf(cfg.lang || 'en');
        const nextLang = order[(curIdx + 1) % order.length];
        save({ lang: nextLang });
      };
    }

    // Donate Modal
    ui.donateBtn.onclick = () => ui.donateModal.classList.remove('hidden');
    ui.closeDonate.onclick = () => ui.donateModal.classList.add('hidden');
    ui.doneDonateBtn.onclick = () => ui.donateModal.classList.add('hidden');
    ui.donateModal.onclick = (e) => {
      if (e.target === ui.donateModal) ui.donateModal.classList.add('hidden');
    };

    // Copy PromptPay Number
    ui.copyPpBtn.onclick = () => {
      const raw = ui.ppNum.textContent.trim();
      navigator.clipboard.writeText(raw).then(() => {
        const lang = cfg.lang || 'en';
        const dict = I18N[lang] || I18N.en;
        ui.copyPpBtn.textContent = dict.copied;
        setTimeout(() => { ui.copyPpBtn.textContent = dict.copyBtn; }, 1500);
      });
    };

    // Main Play/Pause Button
    ui.playBtn.onclick = () => {
      if (!activeTabId) return;
      chrome.tabs.sendMessage(activeTabId, { type: 'MFS_TOGGLE_PLAY' }, r => {
        if (chrome.runtime.lastError) return;
        if (r && typeof r.isPlaying === 'boolean') {
          activeTabPlaying = r.isPlaying;
          renderStatus();
        }
      });
    };

    // Speed Controls
    ui.speedSlider.oninput = () => {
      ui.speedNum.value = ui.speedSlider.value;
      updateSpeed(parseInt(ui.speedSlider.value, 10));
    };
    ui.speedNum.onchange = () => {
      let v = parseInt(ui.speedNum.value, 10);
      if (isNaN(v)) v = 140;
      v = Math.max(10, Math.min(2000, v));
      ui.speedNum.value = v;
      ui.speedSlider.value = Math.min(1000, v);
      updateSpeed(v);
    };

    // Speed Presets
    document.querySelectorAll('.presets .p-btn[data-s]').forEach(b => {
      b.onclick = () => {
        const s = parseInt(b.dataset.s, 10);
        ui.speedSlider.value = Math.min(1000, s);
        ui.speedNum.value = s;
        updateSpeed(s);
      };
    });

    // Zoom Controls
    ui.zoomSlider.oninput = () => {
      ui.zoomNum.value = ui.zoomSlider.value;
      save({ zoom: parseInt(ui.zoomSlider.value, 10) });
    };
    ui.zoomNum.onchange = () => {
      let v = parseInt(ui.zoomNum.value, 10);
      if (isNaN(v)) v = 100;
      v = Math.max(40, Math.min(180, v));
      ui.zoomNum.value = v;
      ui.zoomSlider.value = Math.min(150, Math.max(50, v));
      save({ zoom: v });
    };
    ui.zoomMinus.onclick = () => {
      let v = Math.max(40, (parseInt(ui.zoomNum.value, 10) || 100) - 5);
      ui.zoomNum.value = v;
      ui.zoomSlider.value = Math.min(150, Math.max(50, v));
      save({ zoom: v });
    };
    ui.zoomPlus.onclick = () => {
      let v = Math.min(180, (parseInt(ui.zoomNum.value, 10) || 100) + 5);
      ui.zoomNum.value = v;
      ui.zoomSlider.value = Math.min(150, Math.max(50, v));
      save({ zoom: v });
    };
    document.querySelectorAll('.z-btn[data-z]').forEach(b => {
      b.onclick = () => {
        const z = parseInt(b.dataset.z, 10);
        ui.zoomSlider.value = z;
        ui.zoomNum.value = z;
        save({ zoom: z });
      };
    });
    ui.resetZoomBtn.onclick = () => {
      ui.zoomSlider.value = 100;
      ui.zoomNum.value = 100;
      save({ zoom: 100 });
    };

    // Single Unified Delay Slider & Presets
    ui.nextDelaySlider.oninput = () => {
      ui.nextDelayNum.value = ui.nextDelaySlider.value;
      updateDelay(parseFloat(ui.nextDelaySlider.value));
    };
    ui.nextDelayNum.onchange = () => {
      let v = parseFloat(ui.nextDelayNum.value);
      if (isNaN(v)) v = 1.0;
      v = Math.max(0, Math.min(15, v));
      ui.nextDelayNum.value = v;
      ui.nextDelaySlider.value = Math.min(10, v);
      updateDelay(v);
    };
    document.querySelectorAll('.d-btn[data-d]').forEach(b => {
      b.onclick = () => {
        const d = parseFloat(b.dataset.d);
        ui.nextDelaySlider.value = d;
        ui.nextDelayNum.value = d;
        updateDelay(d);
      };
    });

    // Reader Mode PDF Stop Page
    ui.pdfEndNum.onchange = () => {
      let v = parseInt(ui.pdfEndNum.value, 10);
      if (isNaN(v) || v < 0) v = 0;
      ui.pdfEndNum.value = v;
      save({ pdfPageEnd: v });
    };

    // Toggles
    ui.autoNext.onchange = () => {
      const profs = getProfiles();
      if (profs[viewingProfileId]) {
        profs[viewingProfileId].autoNext = ui.autoNext.checked;
        save({ profiles: profs, autoNext: ui.autoNext.checked });
      } else {
        save({ autoNext: ui.autoNext.checked });
      }
    };
    ui.showHud.onchange = () => save({ showHUD: ui.showHud.checked });
    ui.autoHideHud.onchange = () => save({ autoHideHUD: ui.autoHideHud.checked });
    ui.urlFallback.onchange = () => save({ enableUrlFallback: ui.urlFallback.checked });

    // Profiles Dropdown Selection & Buttons
    ui.profileSelect.onchange = () => {
      viewingProfileId = ui.profileSelect.value;
      save({ activeProfileId: viewingProfileId });
    };
    ui.addProfileBtn.onclick = createNewProfile;
    ui.delProfileBtn.onclick = deleteCurrentProfile;
    ui.addCurrSiteBtn.onclick = toggleCurrentSiteInProfile;

    // Save Profile Settings Button
    ui.saveProfBtn.onclick = () => {
      const profs = getProfiles();
      if (profs[viewingProfileId]) {
        const newName = ui.profNameInp.value.trim() || profs[viewingProfileId].name;
        profs[viewingProfileId].name = newName;
        profs[viewingProfileId].speed = parseInt(ui.speedNum.value, 10) || 140;
        profs[viewingProfileId].nextDelay = parseFloat(ui.nextDelayNum.value) || 1.0;
        profs[viewingProfileId].autoNext = ui.autoNext.checked;
        save({ profiles: profs });

        const lang = cfg.lang || 'en';
        const dict = I18N[lang] || I18N.en;
        ui.saveProfBtn.classList.add('ok');
        ui.saveProfBtn.innerHTML = `<span>✓ ${dict.savedOk}</span>`;
        setTimeout(() => {
          ui.saveProfBtn.classList.remove('ok');
          ui.saveProfBtn.innerHTML = `<span>${dict.saveProf}</span>`;
        }, 1200);
      }
    };
  }

  function updateSpeed(s) {
    const profs = getProfiles();
    if (profs[viewingProfileId]) {
      profs[viewingProfileId].speed = s;
      save({ profiles: profs, speed: s });
    } else {
      save({ speed: s });
    }
  }

  function updateDelay(d) {
    const profs = getProfiles();
    if (profs[viewingProfileId]) {
      profs[viewingProfileId].nextDelay = d;
      save({ profiles: profs, nextDelay: d });
    } else {
      save({ nextDelay: d });
    }
  }

  async function save(p) {
    cfg = { ...cfg, ...p };
    await chrome.storage.local.set(p);
    render();
  }

  async function init() {
    chrome.storage.local.get(null, r => {
      cfg = { ...DEF, ...r };
      // Resolve activeProfileId
      if (cfg.activeProfileId && cfg.profiles && cfg.profiles[cfg.activeProfileId]) {
        viewingProfileId = cfg.activeProfileId;
      } else {
        viewingProfileId = Object.keys(getProfiles())[0] || 'p1';
      }

      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        const t = tabs[0];
        if (t?.id) {
          activeTabId = t.id;
          try {
            if (t.url && (t.url.startsWith('http://') || t.url.startsWith('https://'))) {
              currentHost = new URL(t.url).hostname;
              // Check if current host matches any profile
              const profs = getProfiles();
              for (const pid in profs) {
                if (Array.isArray(profs[pid].sites) && profs[pid].sites.includes(currentHost)) {
                  viewingProfileId = pid;
                  break;
                }
              }
            }
          } catch (e) {}

          chrome.tabs.sendMessage(t.id, { type: 'MFS_GET_STATUS' }, res => {
            if (chrome.runtime.lastError) return;
            if (res && typeof res.isPlaying === 'boolean') {
              activeTabPlaying = res.isPlaying;
            }
            render();
          });
        }
        render();
      });
    });

    chrome.storage.onChanged.addListener((c, a) => {
      if (a !== 'local') return;
      for (const k in c) cfg[k] = c[k].newValue;
      render();
    });

    bindEvents();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
