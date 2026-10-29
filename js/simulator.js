/**
 * simulator.js
 * Simulator Interaktif Sel Braille 6 Titik
 * Memungkinkan pemula mencoba kombinasi titik dan langsung melihat/mendengar hasilnya
 * Memenuhi standar aksesibilitas WCAG: navigasi keyboard (1-6, Spasi, Enter, Esc),
 * status ARIA switch, umpan balik suara, dan kontras tinggi.
 */

class BrailleSimulator {
  constructor() {
    this.activeDots = new Set();
    this.dotButtons = [];
    this.resultCharEl = null;
    this.resultDotsEl = null;
    this.resultDescEl = null;
    this.resetBtn = null;
    this.speakBtn = null;
    this.currentMatch = null;

    this.init();
  }

  init() {
    this.resultCharEl = document.getElementById('sim-result-char');
    this.resultDotsEl = document.getElementById('sim-result-dots');
    this.resultDescEl = document.getElementById('sim-result-desc');
    this.resetBtn = document.getElementById('sim-reset-btn');
    this.speakBtn = document.getElementById('sim-speak-btn');

    // Hubungkan tombol titik 1-6
    for (let i = 1; i <= 6; i++) {
      const btn = document.getElementById(`sim-dot-${i}`);
      if (btn) {
        this.dotButtons[i] = btn;
        btn.addEventListener('click', () => this.toggleDot(i));
        btn.addEventListener('keydown', (e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            this.toggleDot(i);
          }
        });
      }
    }

    // Tombol reset
    if (this.resetBtn) {
      this.resetBtn.addEventListener('click', () => this.clearAll());
    }

    // Tombol bicara ulang hasil
    if (this.speakBtn) {
      this.speakBtn.addEventListener('click', () => {
        if (this.currentMatch) {
          const text = `Huruf ${this.currentMatch.letter}. ${this.currentMatch.description}. ${this.currentMatch.mnemonic}`;
          window.a11y.speak(text, true);
        } else if (this.activeDots.size > 0) {
          const dotsList = Array.from(this.activeDots).sort((a,b) => a-b).join(', ');
          window.a11y.speak(`Titik aktif ${dotsList}. Belum membentuk huruf alfabet A sampai Z standar.`, true);
        } else {
          window.a11y.speak("Semua titik kosong. Silakan tekan titik satu sampai enam untuk mencoba.", true);
        }
      });
    }

    // Dukungan Keyboard Global saat berada di simulator atau shortcut 1-6
    const simSection = document.getElementById('simulator');
    if (simSection) {
      simSection.addEventListener('keydown', (e) => {
        const num = parseInt(e.key, 10);
        if (num >= 1 && num <= 6) {
          e.preventDefault();
          this.toggleDot(num);
          if (this.dotButtons[num]) this.dotButtons[num].focus();
        } else if (e.key === 'c' || e.key === 'C' || e.key === 'Escape') {
          this.clearAll();
        }
      });
    }

    this.updateDisplay();
  }

  toggleDot(num) {
    const isNowActive = !this.activeDots.has(num);
    if (isNowActive) {
      this.activeDots.add(num);
    } else {
      this.activeDots.delete(num);
    }

    // Mainkan audio nada titik (echolocation)
    window.a11y.playDotTone(num, isNowActive);

    // Update ARIA dan visual tombol
    const btn = this.dotButtons[num];
    if (btn) {
      btn.setAttribute('aria-checked', isNowActive ? 'true' : 'false');
      btn.classList.toggle('is-active', isNowActive);
      const dotPositionLabel = this.getDotPositionLabel(num);
      btn.setAttribute('aria-label', `Titik ${num}: ${dotPositionLabel}, status ${isNowActive ? 'aktif' : 'tidak aktif'}`);
    }

    this.updateDisplay(true);
  }

  getDotPositionLabel(num) {
    const positions = {
      1: "Kiri Atas",
      2: "Kiri Tengah",
      3: "Kiri Bawah",
      4: "Kanan Atas",
      5: "Kanan Tengah",
      6: "Kanan Bawah"
    };
    return positions[num] || "";
  }

  clearAll(announce = true) {
    this.activeDots.clear();
    for (let i = 1; i <= 6; i++) {
      const btn = this.dotButtons[i];
      if (btn) {
        btn.setAttribute('aria-checked', 'false');
        btn.classList.remove('is-active');
        const pos = this.getDotPositionLabel(i);
        btn.setAttribute('aria-label', `Titik ${i}: ${pos}, status tidak aktif`);
      }
    }
    this.updateDisplay(announce);
    if (announce) {
      window.a11y.announce("Semua titik telah dibersihkan.");
      window.a11y.speak("Semua titik dibersihkan.");
    }
  }

  setPattern(dotsArray) {
    this.clearAll(false);
    dotsArray.forEach(d => {
      this.activeDots.add(d);
      const btn = this.dotButtons[d];
      if (btn) {
        btn.setAttribute('aria-checked', 'true');
        btn.classList.add('is-active');
        const pos = this.getDotPositionLabel(d);
        btn.setAttribute('aria-label', `Titik ${d}: ${pos}, status aktif`);
      }
    });
    this.updateDisplay(true);
  }

  updateDisplay(announceChange = false) {
    const dotsArray = Array.from(this.activeDots).sort((a, b) => a - b);
    this.currentMatch = getLetterByDots(dotsArray);

    if (this.currentMatch) {
      if (this.resultCharEl) this.resultCharEl.textContent = this.currentMatch.letter;
      if (this.resultDotsEl) this.resultDotsEl.textContent = `Pola: ${this.currentMatch.unicode} (${dotsArray.join(', ')})`;
      if (this.resultDescEl) {
        this.resultDescEl.innerHTML = `<strong>${this.currentMatch.description}</strong><br><em>Tip memori:</em> ${this.currentMatch.mnemonic}`;
      }

      if (announceChange) {
        const textToSpeak = `Huruf ${this.currentMatch.letter}. ${this.currentMatch.description}`;
        window.a11y.announce(`Terbentuk huruf ${this.currentMatch.letter}. Titik aktif: ${dotsArray.join(', ')}`);
        window.a11y.speak(textToSpeak);
      }
    } else if (dotsArray.length > 0) {
      if (this.resultCharEl) this.resultCharEl.textContent = '?';
      if (this.resultDotsEl) this.resultDotsEl.textContent = `Titik aktif: ${dotsArray.join(', ')}`;
      if (this.resultDescEl) {
        this.resultDescEl.textContent = 'Kombinasi titik ini belum merupakan huruf alfabet A-Z standar.';
      }
      if (announceChange) {
        window.a11y.announce(`Titik ${dotsArray.join(', ')} aktif. Belum cocok dengan huruf A sampai Z.`);
      }
    } else {
      if (this.resultCharEl) this.resultCharEl.textContent = '—';
      if (this.resultDotsEl) this.resultDotsEl.textContent = 'Belum ada titik yang ditekan.';
      if (this.resultDescEl) {
        this.resultDescEl.textContent = 'Klik tombol titik 1-6 atau tekan angka 1-6 pada keyboard untuk membentuk huruf.';
      }
    }
  }
}

// Inisialisasi simulator setelah DOM siap
window.BrailleSimulator = BrailleSimulator;
