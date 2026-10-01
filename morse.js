// --- LÓGICA DE CÓDIGO MORSE Y AUDIO ---

const morseCodeMap = {
  'A': '.-',    'B': '-...',  'C': '-.-.',  'D': '-..',   'E': '.',
  'F': '..-.',  'G': '--.',   'H': '....',  'I': '..',    'J': '.---',
  'K': '-.-',   'L': '.-..',  'M': '--',    'N': '-.',    'O': '---',
  'P': '.--.',  'Q': '--.-',  'R': '.-.',   'S': '...',   'T': '-',
  'U': '..-',   'V': '...-',  'W': '.--',   'X': '-..-',  'Y': '-.--',
  'Z': '--..',  '1': '.----', '2': '..---', '3': '...--', '4': '....-',
  '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
  '0': '-----', ' ': '/'
};

const inputText = document.getElementById('inputText');
const morseOutput = document.getElementById('morseOutput');
const playBtn = document.getElementById('playBtn');
const stopBtn = document.getElementById('stopBtn');

let audioCtx = null;
let isPlaying = false;
let shouldStop = false;

// Traducción en tiempo real
if (inputText) {
  inputText.addEventListener('input', () => {
    const text = inputText.value.toUpperCase();
    const translated = text.split('').map(char => morseCodeMap[char] || char).join(' ');
    morseOutput.textContent = translated || '...';
  });
}

// Emisor de sonido de tono web
function playTone(duration, freq = 600) {
  return new Promise(resolve => {
    if (shouldStop) return resolve();
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.value = 0.1;

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    setTimeout(() => {
      osc.stop();
      setTimeout(resolve, 60);
    }, duration);
  });
}

// Reproducción secuencial de morse
async function playMorse() {
  const code = morseOutput.textContent;
  if (!code || code === '...') return;

  isPlaying = true;
  shouldStop = false;
  playBtn.disabled = true;
  stopBtn.disabled = false;

  const dotDuration = 80;

  for (let char of code) {
    if (shouldStop) break;
    if (char === '.') {
      await playTone(dotDuration);
    } else if (char === '-') {
      await playTone(dotDuration * 3);
    } else if (char === ' ') {
      await new Promise(r => setTimeout(r, dotDuration * 2));
    } else if (char === '/') {
      await new Promise(r => setTimeout(r, dotDuration * 5));
    }
  }

  isPlaying = false;
  playBtn.disabled = false;
  stopBtn.disabled = true;
}

if (playBtn && stopBtn) {
  playBtn.addEventListener('click', playMorse);
  stopBtn.addEventListener('click', () => {
    shouldStop = true;
    playBtn.disabled = false;
    stopBtn.disabled = true;
  });
}
