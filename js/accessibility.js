/**
 * accessibility.js
 * Pengaturan Aksesibilitas Sesuai Standar WCAG 2.1 / 2.2 AA-AAA
 * - Pengelola Kontras & Tema (Standar, Gelap, Kontras Tinggi Kuning-Hitam)
 * - Pengatur Ukuran Teks (Normal, Besar, Ekstra Besar)
 * - Sintesis Suara (Web Speech API) & Audio Sintetis (Web Audio API)
 * - Live Region untuk Pengumuman Pembaca Layar (Screen Reader)
 * - Manajemen Fokus Keyboard
 */

class AccessibilityManager {
  constructor() {
    this.speechEnabled = true;
    this.audioEffectsEnabled = true;
    this.currentTheme = 'default';
    this.currentFontSize = 'normal';
    this.audioCtx = null;
    this.speechSynthesis = window.speechSynthesis || null;

    // Frekuensi nada untuk tiap titik 1-6 (Membantu mengenali titik lewat pendengaran)
    this.dotFrequencies = {
      1: 523.25, // C5
      2: 587.33, // D5
      3: 659.25, // E5
      4: 698.46, // F5
      5: 783.99, // G5
      6: 880.00  // A5
    };

    this.init();
  }

  init() {
    this.liveRegionPolite = document.getElementById('sr-announcer-polite');
    this.liveRegionAssertive = document.getElementById('sr-announcer-assertive');

    // Load saved preferences
    const savedTheme = localStorage.getItem('braille_theme');
    if (savedTheme) this.setTheme(savedTheme, false);

    const savedFontSize = localStorage.getItem('braille_fontsize');
    if (savedFontSize) this.setFontSize(savedFontSize, false);

    const savedSpeech = localStorage.getItem('braille_speech');
    if (savedSpeech !== null) this.speechEnabled = savedSpeech === 'true';

    const savedAudio = localStorage.getItem('braille_audio');
    if (savedAudio !== null) this.audioEffectsEnabled = savedAudio === 'true';

    this.setupEventListeners();
  }

  // Inisialisasi AudioContext dengan interaksi pengguna (kebijakan browser)
  getAudioContext() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  setupEventListeners() {
    // Tombol pengubah tema
    const themeSelect = document.getElementById('select-theme');
    if (themeSelect) {
      themeSelect.value = this.currentTheme;
      themeSelect.addEventListener('change', (e) => {
        this.setTheme(e.target.value);
      });
    }

    // Tombol pengubah ukuran font
    const fontSelect = document.getElementById('select-fontsize');
    if (fontSelect) {
      fontSelect.value = this.currentFontSize;
      fontSelect.addEventListener('change', (e) => {
        this.setFontSize(e.target.value);
      });
    }

    // Toggle Suara / Speech
    const toggleSpeechBtn = document.getElementById('toggle-speech-btn');
    if (toggleSpeechBtn) {
      this.updateSpeechButtonUI(toggleSpeechBtn);
      toggleSpeechBtn.addEventListener('click', () => {
        this.speechEnabled = !this.speechEnabled;
        localStorage.setItem('braille_speech', this.speechEnabled);
        this.updateSpeechButtonUI(toggleSpeechBtn);
        const status = this.speechEnabled ? 'Suara pembaca diaktifkan' : 'Suara pembaca dinonaktifkan';
        this.announce(status);
        if (this.speechEnabled) this.speak(status);
      });
    }

    // Keyboard Shortcuts Global
    window.addEventListener('keydown', (e) => {
      // Jangan ganggu input text aktif
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      // Alt + T: Toggle Kontras Cepat
      if (e.altKey && (e.key === 't' || e.key === 'T')) {
        e.preventDefault();
        const themes = ['default', 'dark', 'high-contrast'];
        const nextTheme = themes[(themes.indexOf(this.currentTheme) + 1) % themes.length];
        this.setTheme(nextTheme);
        if (themeSelect) themeSelect.value = nextTheme;
      }

      // Alt + S: Toggle Suara
      if (e.altKey && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        if (toggleSpeechBtn) toggleSpeechBtn.click();
      }
    });
  }

  updateSpeechButtonUI(btn) {
    if (!btn) return;
    btn.setAttribute('aria-pressed', this.speechEnabled ? 'true' : 'false');
    btn.innerHTML = this.speechEnabled
      ? `<span class="icon" aria-hidden="true">🔊</span> <span>Suara: ON</span>`
      : `<span class="icon" aria-hidden="true">🔇</span> <span>Suara: OFF</span>`;
  }

  setTheme(themeName, shouldAnnounce = true) {
    document.documentElement.setAttribute('data-theme', themeName);
    this.currentTheme = themeName;
    localStorage.setItem('braille_theme', themeName);

    const themeNames = {
      'default': 'Tema Terang Standar',
      'dark': 'Tema Gelap Ramah Mata',
      'high-contrast': 'Tema Kontras Tinggi Kuning Hitam'
    };

    if (shouldAnnounce) {
      const msg = `Tema diubah ke ${themeNames[themeName] || themeName}`;
      this.announce(msg);
      this.speak(msg);
    }
  }

  setFontSize(sizeName, shouldAnnounce = true) {
    document.documentElement.setAttribute('data-font-size', sizeName);
    this.currentFontSize = sizeName;
    localStorage.setItem('braille_fontsize', sizeName);

    const sizeLabels = {
      'normal': 'Ukuran teks normal',
      'large': 'Ukuran teks besar',
      'xlarge': 'Ukuran teks ekstra besar'
    };

    if (shouldAnnounce) {
      const msg = sizeLabels[sizeName] || 'Ukuran teks diubah';
      this.announce(msg);
      this.speak(msg);
    }
  }

  // Pengumuman ke Screen Reader melalui ARIA live region
  announce(message, assertive = false) {
    const region = assertive ? this.liveRegionAssertive : this.liveRegionPolite;
    if (region) {
      region.textContent = '';
      // Sedikit jeda agar pembaca layar mendeteksi perubahan DOM
      setTimeout(() => {
        region.textContent = message;
      }, 50);
    }
  }

  // Suara sintesis teks (Text to Speech)
  speak(text, priority = false) {
    if (!this.speechEnabled || !this.speechSynthesis) return;

    if (priority) {
      this.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Fallback jika suara id-ID ada di browser
    const voices = this.speechSynthesis.getVoices();
    const idVoice = voices.find(v => v.lang.startsWith('id') || v.lang.includes('IND'));
    if (idVoice) utterance.voice = idVoice;

    this.speechSynthesis.speak(utterance);
  }

  // Nada khusus untuk titik 1 sampai 6 (Echolocation / Acoustic feedback)
  playDotTone(dotNumber, isActive) {
    if (!this.audioEffectsEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const freq = this.dotFrequencies[dotNumber] || 440;

      // Jika diaktifkan: nada naik sedikit; jika dimatikan: nada turun
      osc.type = 'sine';
      osc.frequency.setValueAtTime(isActive ? freq : freq * 0.75, ctx.currentTime);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.16);
    } catch (e) {
      // Silently fail if audio not allowed yet
    }
  }

  // Suara keberhasilan kuis
  playSuccessSound() {
    if (!this.audioEffectsEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // Arpeggio C mayor C5, E5, G5, C6
      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + index * 0.08);

        gain.gain.setValueAtTime(0.15, now + index * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.08 + 0.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + index * 0.08);
        osc.stop(now + index * 0.08 + 0.22);
      });
    } catch (e) {}
  }

  // Suara kesalahan kuis
  playErrorSound() {
    if (!this.audioEffectsEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.25);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.26);
    } catch (e) {}
  }
}

// Inisialisasi global helper
window.a11y = new AccessibilityManager();
