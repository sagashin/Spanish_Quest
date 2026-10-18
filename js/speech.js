// Vamos! Quest - Speech (TTS + SpeechRecognition) & Game Sound Effects Engine
(function () {
  let audioCtx = null;

  function getAudioCtx() {
    if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      audioCtx = new Ctx();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  }

  // Synthesize sporty game sound effects without external audio assets
  function playSfx(type, soundEnabled = true) {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioCtx();
      if (!ctx) return;
      const now = ctx.currentTime;

      if (type === 'tap') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(680, now + 0.06);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.065);
      } else if (type === 'correct') {
        const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + i * 0.07);
          gain.gain.setValueAtTime(0.16, now + i * 0.07);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.22);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.07);
          osc.stop(now + i * 0.07 + 0.23);
        });
      } else if (type === 'wrong') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(210, now);
        osc.frequency.linearRampToValueAtTime(150, now + 0.22);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'fanfare') {
        const notes = [523.25, 659.25, 783.99, 1046.5, 987.77, 1046.5];
        const times = [0, 0.09, 0.18, 0.27, 0.42, 0.54];
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + times[i]);
          gain.gain.setValueAtTime(0.2, now + times[i]);
          gain.gain.exponentialRampToValueAtTime(0.001, now + times[i] + 0.32);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + times[i]);
          osc.stop(now + times[i] + 0.34);
        });
      }
    } catch (e) {
      // Ignore audio errors
    }
  }

  // Pick best Spanish voice available
  function getSpanishVoice() {
    if (!('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices() || [];
    return (
      voices.find(v => v.lang === 'es-ES' && /Monica|Paulina|Jorge|Google|Microsoft/i.test(v.name)) ||
      voices.find(v => v.lang === 'es-ES') ||
      voices.find(v => v.lang && v.lang.toLowerCase().startsWith('es')) ||
      null
    );
  }

  if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = () => {
      getSpanishVoice();
    };
  }

  // Speak Spanish text using Web Speech API
  function speakSpanish(text, options = {}) {
    const { rate = 0.92, onStart, onEnd } = options;
    if (!('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const cleanText = String(text).replace(/[¡¿]/g, '').trim();
      const utter = new SpeechSynthesisUtterance(cleanText);
      utter.lang = 'es-ES';
      utter.rate = rate;
      utter.pitch = 1.02;
      const esVoice = getSpanishVoice();
      if (esVoice) utter.voice = esVoice;

      if (onStart) utter.onstart = onStart;
      if (onEnd) {
        utter.onend = onEnd;
        utter.onerror = onEnd;
      }
      window.speechSynthesis.speak(utter);
    } catch (e) {
      if (onEnd) onEnd();
    }
  }

  const NUMBER_WORDS_ES = {
    '0': 'cero', '1': 'uno', '2': 'dos', '3': 'tres', '4': 'cuatro',
    '5': 'cinco', '6': 'seis', '7': 'siete', '8': 'ocho', '9': 'nueve',
    '10': 'diez', '11': 'once', '12': 'doce', '13': 'trece', '14': 'catorce',
    '15': 'quince', '16': 'dieciseis', '17': 'diecisiete', '18': 'dieciocho',
    '19': 'diecinueve', '20': 'veinte'
  };

  // Normalize Spanish strings for speech recognition comparison
  function normalizeSpanish(str) {
    return String(str || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // strip accents
      .replace(/[¡!¿?.,;:()"']/g, ' ')
      .replace(/\b([0-9]|1[0-9]|20)\b/g, match => NUMBER_WORDS_ES[match] || match)
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Evaluate similarity between target Spanish and recognized transcript
  function evaluatePronunciation(targetSpanish, recognizedText) {
    const targetNorm = normalizeSpanish(targetSpanish);
    const recNorm = normalizeSpanish(recognizedText);
    if (!recNorm) return { isMatch: false, score: 0 };

    if (recNorm.includes(targetNorm) || targetNorm.includes(recNorm)) {
      return { isMatch: true, score: 100 };
    }

    const targetWords = targetNorm.split(' ').filter(Boolean);
    const recWords = recNorm.split(' ').filter(Boolean);

    let matchedWords = 0;
    targetWords.forEach(tw => {
      const hit = recWords.some(rw => {
        if (rw === tw) return true;
        // Allow small 1-2 char difference for longer words
        if (tw.length >= 4 && (rw.startsWith(tw.slice(0, 3)) || tw.startsWith(rw.slice(0, 3)))) {
          return true;
        }
        return false;
      });
      if (hit) matchedWords++;
    });

    const ratio = targetWords.length > 0 ? matchedWords / targetWords.length : 0;
    const score = Math.round(ratio * 100);
    // Beginner-friendly threshold: >= 50% words matched or single word starts same
    const isMatch = score >= 50 || (targetWords.length === 1 && recWords.some(w => w[0] === targetWords[0][0]));
    return { isMatch, score: Math.max(score, isMatch ? 75 : score) };
  }

  let activeRecognition = null;

  // Start Web Speech API SpeechRecognition
  function startSpeechRecognition({ onResult, onError, onEnd }) {
    // 1. Cancel any active speech synthesis so audio session is freed for recording
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }

    // 2. Abort any previous recognition instance
    if (activeRecognition) {
      try {
        activeRecognition.abort();
      } catch (e) {}
      activeRecognition = null;
    }

    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      if (onError) onError('お使いのブラウザは音声認識（Web Speech API）に未対応です。「タップでクリア」を使ってね！');
      return null;
    }
    try {
      const recognition = new SpeechRec();
      recognition.lang = 'es-ES';
      recognition.interimResults = false;
      recognition.maxAlternatives = 3;

      activeRecognition = recognition;

      recognition.onresult = (event) => {
        const alternatives = [];
        for (let i = 0; i < event.results[0].length; i++) {
          alternatives.push(event.results[0][i].transcript);
        }
        if (onResult) onResult(alternatives[0] || '', alternatives);
      };

      recognition.onerror = (event) => {
        let msg = 'うまく聞き取れませんでした。もう一度マイクを押すか「タップでクリア」を使ってね！';
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          msg = '⚠️ マイクの利用が許可されていません。ブラウザのアドレスバー横の設定（またはスマホ本体の設定）でマイクを「許可」にしてください。';
        } else if (event.error === 'audio-capture') {
          msg = '⚠️ マイク機器が見つかりませんでした。イヤホン（AirPods等）の接続解除やブラウザ再読み込みをお試しください。「タップでクリア」でも進めます！';
        } else if (event.error === 'no-speech') {
          msg = '🎙️ 声が聞き取れませんでした。マイクに近づいてはっきり話してみてね！（iPhoneは設定→一般→キーボードの「音声入力を有効」も確認してね）';
        } else if (event.error === 'network') {
          msg = '📡 音声認識サーバーとの通信エラーが発生しました。通信環境の良いところで試してみてね！';
        }
        if (onError) onError(msg);
      };

      recognition.onend = () => {
        activeRecognition = null;
        if (onEnd) onEnd();
      };

      recognition.start();
      return recognition;
    } catch (err) {
      activeRecognition = null;
      if (onError) onError('音声認識を開始できませんでした。「タップでクリア」を使ってね！');
      return null;
    }
  }

  window.VAMOS_SPEECH = {
    playSfx,
    speakSpanish,
    normalizeSpanish,
    evaluatePronunciation,
    startSpeechRecognition,
    isRecognitionSupported: () => Boolean(window.SpeechRecognition || window.webkitSpeechRecognition)
  };
})();

