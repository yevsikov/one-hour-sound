chrome.runtime.onMessage.addListener((message) => {
  if (message?.type !== 'play-sound') return;

  const audio = new Audio(message.sound);
  audio.volume = typeof message.volume === 'number' ? message.volume : 1;
  audio.play().catch((err) => console.error('Не вдалося програти звук:', err));
});
