const SOUND_COUNT = 12;
const DEFAULTS = { enabled: true, sound: 'sounds/audio_01.mp3', volume: 1 };

const enabledEl = document.getElementById('enabled');
const soundEl = document.getElementById('sound');
const volumeEl = document.getElementById('volume');
const testEl = document.getElementById('test');
const statusEl = document.getElementById('status');

function populateSoundOptions() {
  for (let i = 1; i <= SOUND_COUNT; i += 1) {
    const num = String(i).padStart(2, '0');
    const option = document.createElement('option');
    option.value = `sounds/audio_${num}.mp3`;
    option.textContent = `Звук ${i}`;
    soundEl.appendChild(option);
  }
}

function showStatus(text) {
  statusEl.textContent = text;
  setTimeout(() => {
    if (statusEl.textContent === text) statusEl.textContent = '';
  }, 2000);
}

async function init() {
  populateSoundOptions();

  const settings = { ...DEFAULTS, ...(await chrome.storage.local.get(['enabled', 'sound', 'volume'])) };
  enabledEl.checked = settings.enabled;
  soundEl.value = settings.sound;
  volumeEl.value = Math.round(settings.volume * 100);

  enabledEl.addEventListener('change', () => {
    chrome.storage.local.set({ enabled: enabledEl.checked });
  });

  soundEl.addEventListener('change', () => {
    chrome.storage.local.set({ sound: soundEl.value });
  });

  volumeEl.addEventListener('input', () => {
    chrome.storage.local.set({ volume: Number(volumeEl.value) / 100 });
  });

  testEl.addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'test-sound' });
    showStatus('Відтворення...');
  });
}

init();
