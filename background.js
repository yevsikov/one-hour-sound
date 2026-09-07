const TICK_ALARM = 'minute-tick';
const OFFSCREEN_URL = 'offscreen.html';
const DEFAULTS = { enabled: true, sound: 'sounds/audio_01.mp3', volume: 1 };

chrome.runtime.onInstalled.addListener(setupAlarm);
chrome.runtime.onStartup.addListener(setupAlarm);

function setupAlarm() {
  chrome.alarms.create(TICK_ALARM, { periodInMinutes: 1 });
}

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === TICK_ALARM) checkHour();
});

async function checkHour() {
  const now = new Date();
  if (now.getMinutes() !== 0) return;

  const { enabled, lastPlayedKey } = await chrome.storage.local.get(['enabled', 'lastPlayedKey']);
  if (enabled === false) return;

  const hourKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours()}`;
  if (hourKey === lastPlayedKey) return;

  await chrome.storage.local.set({ lastPlayedKey: hourKey });
  playSound();
}

async function playSound() {
  const { sound, volume } = { ...DEFAULTS, ...(await chrome.storage.local.get(['sound', 'volume'])) };
  await ensureOffscreenDocument();
  chrome.runtime.sendMessage({ type: 'play-sound', sound: chrome.runtime.getURL(sound), volume });
}

async function ensureOffscreenDocument() {
  const existingContexts = await chrome.runtime.getContexts({
    contextTypes: ['OFFSCREEN_DOCUMENT'],
  });
  if (existingContexts.length > 0) return;

  await chrome.offscreen.createDocument({
    url: OFFSCREEN_URL,
    reasons: ['AUDIO_PLAYBACK'],
    justification: 'Програвання щогодинного звукового нагадування',
  });
}

chrome.runtime.onMessage.addListener((message) => {
  if (message?.type === 'test-sound') {
    playSound();
  }
});
