// Tells content scripts the tab's browser-zoom factor so the HUD can stay a constant size.
const api = globalThis.browser || chrome;
api.runtime.onMessage.addListener((m, s, reply) => {
  if (m && m.type === 'MFS_ZOOM_Q' && s.tab) {
    api.tabs.getZoom(s.tab.id).then(reply, () => reply(1));
    return true;
  }
});
api.tabs.onZoomChange.addListener(i => {
  Promise.resolve(api.tabs.sendMessage(i.tabId, { type: 'MFS_ZOOM', z: i.newZoomFactor })).catch(() => {});
});
