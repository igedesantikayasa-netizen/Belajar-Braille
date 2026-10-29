/**
 * quiz.js
 * Permainan Kuis Belajar Braille Interaktif & Aksesibel
 * Fitur:
 * - 3 Mode: Tebak Huruf (Pilihan Ganda), Susun Titik Braille (Hands-on), dan Tebak Kata
 * - Ramah Pembaca Layar (deskripsi titik jelas, aria-live feedback)
 * - Dukungan Penuh Keyboard (1-4 untuk pilihan ganda, Tab, Enter)
 * - Efek Suara Web Audio (Chime & Buzzer)
 * - Penghitung Skor, Streak, dan Penjelasan Tiap Jawaban
 */

class BrailleQuiz {
  constructor() {
    this.currentMode = 'guess-letter'; // 'guess-letter' | 'build-dots' | 'word-puzzle'
    this.currentQuestionIndex = 0;
    this.totalQuestions = 10;
    this.score = 0;
    this.streak = 0;
    this.currentQuestion = null;
    this.isAnswered = false;

    // State untuk mode susun titik
    this.quizActiveDots = new Set();

    this.init();
  }

  init() {
    this.containerEl = document.getElementById('quiz-container');
    this.scoreEl = document.getElementById('quiz-score');
    this.streakEl = document.getElementById('quiz-streak');
    this.progressEl = document.getElementById('quiz-progress');
    this.feedbackEl = document.getElementById('quiz-feedback');
    this.modeSelector = document.getElementById('quiz-mode-select');

    if (this.modeSelector) {
      this.modeSelector.addEventListener('change', (e) => {
        this.currentMode = e.target.value;
        this.startNewGame();
      });
    }

    const restartBtn = document.getElementById('quiz-restart-btn');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => this.startNewGame());
    }

    this.startNewGame();
  }

  startNewGame() {
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.streak = 0;
    this.isAnswered = false;
    this.updateStatsUI();
    this.nextQuestion();
  }

  updateStatsUI() {
    if (this.scoreEl) this.scoreEl.textContent = this.score;
    if (this.streakEl) this.streakEl.textContent = this.streak;
    if (this.progressEl) {
      this.progressEl.textContent = `Soal ${this.currentQuestionIndex + 1} dari ${this.totalQuestions}`;
    }
    const fillEl = document.getElementById('quiz-progress-fill');
    if (fillEl) {
      const pct = Math.min(100, Math.round(((this.currentQuestionIndex + 1) / this.totalQuestions) * 100));
      fillEl.style.width = `${pct}%`;
    }
  }

  generateQuestion() {
    const letters = [...BRAILLE_DATA];
    // Acak huruf
    const targetItem = letters[Math.floor(Math.random() * letters.length)];

    if (this.currentMode === 'guess-letter') {
      // Pilihan ganda: Tampilkan Braille, tebak huruf Latin
      const wrongOptions = letters
        .filter(l => l.letter !== targetItem.letter)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      const options = [targetItem, ...wrongOptions].sort(() => 0.5 - Math.random());

      return {
        type: 'guess-letter',
        target: targetItem,
        options: options
      };
    } else if (this.currentMode === 'build-dots') {
      // Susun titik: Diberi huruf Latin, susun titik 1-6
      return {
        type: 'build-dots',
        target: targetItem
      };
    } else if (this.currentMode === 'word-puzzle') {
      // Tebak huruf yang hilang dari kata singkat
      const wordObj = BRAILLE_WORDS[Math.floor(Math.random() * BRAILLE_WORDS.length)];
      const missingIndex = Math.floor(Math.random() * wordObj.word.length);
      const targetChar = wordObj.word[missingIndex];
      const targetBraille = getBrailleByLetter(targetChar);

      const wrongOptions = letters
        .filter(l => l.letter !== targetChar)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      const options = [targetBraille, ...wrongOptions].sort(() => 0.5 - Math.random());

      return {
        type: 'word-puzzle',
        wordObj: wordObj,
        missingIndex: missingIndex,
        target: targetBraille,
        options: options
      };
    }
  }

  nextQuestion() {
    if (this.currentQuestionIndex >= this.totalQuestions) {
      this.showFinalSummary();
      return;
    }

    this.isAnswered = false;
    this.quizActiveDots.clear();
    this.currentQuestion = this.generateQuestion();
    this.updateStatsUI();

    if (this.feedbackEl) {
      this.feedbackEl.className = 'quiz-feedback';
      this.feedbackEl.innerHTML = '';
      this.feedbackEl.setAttribute('aria-hidden', 'true');
    }

    this.renderQuestion();
  }

  renderQuestion() {
    if (!this.containerEl) return;
    this.containerEl.innerHTML = '';

    const q = this.currentQuestion;

    if (q.type === 'guess-letter') {
      this.renderGuessLetterQuestion(q);
    } else if (q.type === 'build-dots') {
      this.renderBuildDotsQuestion(q);
    } else if (q.type === 'word-puzzle') {
      this.renderWordPuzzleQuestion(q);
    }
  }

  renderGuessLetterQuestion(q) {
    const card = document.createElement('div');
    card.className = 'quiz-question-card';

    const dotsDesc = q.target.description;
    const announceMsg = `Soal ${this.currentQuestionIndex + 1}: Huruf apakah ini? Simbol Braille dengan ${dotsDesc}.`;
    window.a11y.announce(announceMsg);

    card.innerHTML = `
      <div class="quiz-prompt">
        <p class="quiz-prompt-label">Huruf alfabet apakah yang diwakili oleh simbol Braille berikut?</p>
        <div class="quiz-braille-display" aria-label="Simbol Braille ${dotsDesc}">
          ${this.generateBrailleCellHTML(q.target.dots)}
          <span class="quiz-braille-unicode" aria-hidden="true">${q.target.unicode}</span>
        </div>
        <p class="quiz-sr-hint sr-only">${dotsDesc}</p>
        <button type="button" class="btn btn-secondary btn-sm" id="btn-read-prompt">
          <span aria-hidden="true">🔊</span> Dengarkan Deskripsi Titik
        </button>
      </div>
      <div class="quiz-options-grid" role="radiogroup" aria-label="Pilihan jawaban huruf">
        ${q.options.map((opt, idx) => `
          <button type="button" class="quiz-opt-btn" data-letter="${opt.letter}" data-idx="${idx + 1}" role="radio" aria-checked="false">
            <span class="opt-num" aria-hidden="true">${idx + 1}</span>
            <span class="opt-letter">Huruf ${opt.letter}</span>
          </button>
        `).join('')}
      </div>
    `;

    this.containerEl.appendChild(card);

    // Audio listener
    const readBtn = card.querySelector('#btn-read-prompt');
    readBtn.addEventListener('click', () => {
      window.a11y.speak(`Simbol ini memiliki pola ${dotsDesc}. Silakan pilih huruf yang sesuai.`, true);
    });

    // Pilihan listener
    const buttons = card.querySelectorAll('.quiz-opt-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        if (this.isAnswered) return;
        this.handleMultipleChoiceAnswer(btn.getAttribute('data-letter'), q.target.letter, btn);
      });
    });

    // Keyboard 1-4
    card.addEventListener('keydown', (e) => {
      if (this.isAnswered) return;
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= q.options.length) {
        e.preventDefault();
        buttons[num - 1].click();
      }
    });

    // Auto-focus opsi pertama jika bukan interaksi scroll pertama
    if (this.currentQuestionIndex > 0 && buttons.length > 0) {
      setTimeout(() => buttons[0].focus(), 100);
    }
  }

  renderBuildDotsQuestion(q) {
    const card = document.createElement('div');
    card.className = 'quiz-question-card';

    const announceMsg = `Soal ${this.currentQuestionIndex + 1}: Susun pola titik Braille untuk Huruf ${q.target.letter}.`;
    window.a11y.announce(announceMsg);

    card.innerHTML = `
      <div class="quiz-prompt">
        <p class="quiz-prompt-label">Aktifkan titik-titik yang tepat untuk membentuk:</p>
        <div class="quiz-target-letter" aria-label="Huruf target ${q.target.letter}">
          Huruf <strong>${q.target.letter}</strong>
        </div>
        <p class="hint-text">Gunakan tombol titik 1 sampai 6 di bawah ini, lalu tekan "Periksa Jawaban".</p>
      </div>

      <div class="quiz-builder-layout">
        <div class="braille-cell-interactive" role="group" aria-label="Sel Braille untuk kuis">
          <div class="braille-column">
            ${[1, 2, 3].map(n => `
              <button type="button" class="quiz-cell-dot" data-dot="${n}" id="quiz-dot-${n}" role="switch" aria-checked="false" aria-label="Titik ${n}">
                <span class="dot-inner"></span>
                <span class="dot-num-label" aria-hidden="true">${n}</span>
              </button>
            `).join('')}
          </div>
          <div class="braille-column">
            ${[4, 5, 6].map(n => `
              <button type="button" class="quiz-cell-dot" data-dot="${n}" id="quiz-dot-${n}" role="switch" aria-checked="false" aria-label="Titik ${n}">
                <span class="dot-inner"></span>
                <span class="dot-num-label" aria-hidden="true">${n}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <div class="quiz-builder-actions">
          <button type="button" class="btn btn-primary btn-large" id="btn-submit-dots">
            ✓ Periksa Jawaban
          </button>
          <button type="button" class="btn btn-outline" id="btn-clear-quiz-dots">
            ↺ Kosongkan Titik
          </button>
        </div>
      </div>
    `;

    this.containerEl.appendChild(card);

    // Toggle dots
    for (let i = 1; i <= 6; i++) {
      const dotBtn = card.querySelector(`#quiz-dot-${i}`);
      dotBtn.addEventListener('click', () => {
        if (this.isAnswered) return;
        const isActive = !this.quizActiveDots.has(i);
        if (isActive) {
          this.quizActiveDots.add(i);
        } else {
          this.quizActiveDots.delete(i);
        }
        dotBtn.setAttribute('aria-checked', isActive ? 'true' : 'false');
        dotBtn.classList.toggle('is-active', isActive);
        window.a11y.playDotTone(i, isActive);
        window.a11y.announce(`Titik ${i} ${isActive ? 'diaktifkan' : 'dimatikan'}`);
      });
    }

    const clearBtn = card.querySelector('#btn-clear-quiz-dots');
    clearBtn.addEventListener('click', () => {
      this.quizActiveDots.clear();
      card.querySelectorAll('.quiz-cell-dot').forEach(btn => {
        btn.setAttribute('aria-checked', 'false');
        btn.classList.remove('is-active');
      });
      window.a11y.announce('Titik kuis dikosongkan');
    });

    const submitBtn = card.querySelector('#btn-submit-dots');
    submitBtn.addEventListener('click', () => {
      if (this.isAnswered) return;
      this.handleBuildDotsAnswer(q.target);
    });

    // Keyboard support: 1-6 untuk toggle titik, Enter/Space untuk submit
    card.addEventListener('keydown', (e) => {
      if (this.isAnswered) return;
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= 6) {
        e.preventDefault();
        const dotBtn = card.querySelector(`#quiz-dot-${num}`);
        if (dotBtn) dotBtn.click();
      } else if (e.key === 'c' || e.key === 'C') {
        clearBtn.click();
      }
    });

    if (this.currentQuestionIndex > 0) {
      setTimeout(() => {
        const firstDot = card.querySelector('#quiz-dot-1');
        if (firstDot) firstDot.focus();
      }, 100);
    }
  }

  renderWordPuzzleQuestion(q) {
    const card = document.createElement('div');
    card.className = 'quiz-question-card';

    // Buat tampilan kata dengan huruf yang hilang
    const wordDisplay = q.wordObj.word.split('').map((ch, idx) => {
      if (idx === q.missingIndex) {
        return `<span class="missing-char-box" aria-label="Huruf kosong yang harus ditebak">?</span>`;
      }
      const b = getBrailleByLetter(ch);
      return `
        <span class="known-char-box">
          <span class="known-letter">${ch}</span>
          <span class="known-braille" aria-hidden="true">${b ? b.unicode : ''}</span>
        </span>
      `;
    }).join('');

    const announceMsg = `Soal kata: Lengkapi kata ${q.wordObj.word}. Petunjuk: ${q.wordObj.hint}. Huruf apa yang hilang?`;
    window.a11y.announce(announceMsg);

    card.innerHTML = `
      <div class="quiz-prompt">
        <p class="quiz-prompt-label">Lengkapi kata berikut dengan memilih huruf Braille yang tepat:</p>
        <div class="quiz-word-row">
          ${wordDisplay}
        </div>
        <p class="quiz-word-hint"><strong>Petunjuk arti kata:</strong> <em>"${q.wordObj.hint}"</em></p>
      </div>

      <div class="quiz-options-grid" role="radiogroup" aria-label="Pilihan huruf pelengkap kata">
        ${q.options.map((opt, idx) => `
          <button type="button" class="quiz-opt-btn quiz-opt-word" data-letter="${opt.letter}" data-idx="${idx + 1}" role="radio" aria-checked="false">
            <span class="opt-num" aria-hidden="true">${idx + 1}</span>
            <span class="opt-braille-icon" aria-hidden="true">${opt.unicode}</span>
            <span class="opt-letter">Huruf ${opt.letter} (${opt.dots.join(', ')})</span>
          </button>
        `).join('')}
      </div>
    `;

    this.containerEl.appendChild(card);

    const buttons = card.querySelectorAll('.quiz-opt-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        if (this.isAnswered) return;
        this.handleMultipleChoiceAnswer(btn.getAttribute('data-letter'), q.target.letter, btn);
      });
    });

    // Keyboard 1-4 untuk pilihan kata
    card.addEventListener('keydown', (e) => {
      if (this.isAnswered) return;
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= q.options.length) {
        e.preventDefault();
        buttons[num - 1].click();
      }
    });

    if (this.currentQuestionIndex > 0 && buttons.length > 0) {
      setTimeout(() => buttons[0].focus(), 100);
    }
  }

  handleMultipleChoiceAnswer(selectedLetter, correctLetter, selectedBtn) {
    this.isAnswered = true;
    const isCorrect = selectedLetter === correctLetter;
    const targetItem = getBrailleByLetter(correctLetter);

    if (isCorrect) {
      this.score += 10;
      this.streak += 1;
      selectedBtn.classList.add('is-correct');
      window.a11y.playSuccessSound();
      this.showFeedback(true, `Luar biasa, jawaban Anda Benar! Huruf <strong>${correctLetter}</strong> adalah ${targetItem.description}.<br><em>${targetItem.mnemonic}</em>`);
      window.a11y.speak(`Benar! Huruf ${correctLetter}. ${targetItem.description}`, true);
    } else {
      this.streak = 0;
      selectedBtn.classList.add('is-wrong');
      // Berikan tanda ke tombol yang benar
      const buttons = this.containerEl.querySelectorAll('.quiz-opt-btn');
      buttons.forEach(b => {
        if (b.getAttribute('data-letter') === correctLetter) {
          b.classList.add('is-correct');
        }
      });
      window.a11y.playErrorSound();
      this.showFeedback(false, `Kurang tepat. Jawaban yang benar adalah Huruf <strong>${correctLetter}</strong> (${targetItem.description}).<br><em>${targetItem.mnemonic}</em>`);
      window.a11y.speak(`Kurang tepat. Jawaban yang benar adalah huruf ${correctLetter}, yaitu ${targetItem.description}.`, true);
    }

    this.updateStatsUI();
  }

  handleBuildDotsAnswer(targetItem) {
    this.isAnswered = true;
    const activeArray = Array.from(this.quizActiveDots).sort((a,b) => a-b);
    const targetArray = [...targetItem.dots].sort((a,b) => a-b);

    const isCorrect = activeArray.join(',') === targetArray.join(',');

    if (isCorrect) {
      this.score += 10;
      this.streak += 1;
      window.a11y.playSuccessSound();
      this.showFeedback(true, `Tepat sekali! Titik [${targetArray.join(', ')}] membentuk Huruf <strong>${targetItem.letter}</strong>.<br><em>${targetItem.mnemonic}</em>`);
      window.a11y.speak(`Benar sekali! Pola titik Anda membentuk huruf ${targetItem.letter}.`, true);
    } else {
      this.streak = 0;
      window.a11y.playErrorSound();
      const currentGiven = activeArray.length > 0 ? activeArray.join(', ') : 'tidak ada titik';
      this.showFeedback(false, `Kurang tepat. Anda memilih titik [${currentGiven}], sedangkan Huruf <strong>${targetItem.letter}</strong> membutuhkan Titik [${targetArray.join(', ')}].<br><em>${targetItem.mnemonic}</em>`);
      window.a11y.speak(`Belum tepat. Huruf ${targetItem.letter} membutuhkan titik ${targetArray.join(', ')}.`, true);
    }

    this.updateStatsUI();
  }

  showFeedback(isSuccess, messageHTML) {
    if (!this.feedbackEl) return;
    this.feedbackEl.className = `quiz-feedback ${isSuccess ? 'feedback-success' : 'feedback-error'}`;
    this.feedbackEl.removeAttribute('aria-hidden');

    this.feedbackEl.innerHTML = `
      <div class="feedback-content">
        <div class="feedback-badge" aria-hidden="true">${isSuccess ? '✓' : '✗'}</div>
        <div class="feedback-text">${messageHTML}</div>
      </div>
      <button type="button" class="btn btn-primary" id="btn-next-question" autofocus>
        Lanjut ke Soal Berikutnya ➔
      </button>
    `;

    const nextBtn = this.feedbackEl.querySelector('#btn-next-question');
    nextBtn.focus();
    nextBtn.addEventListener('click', () => {
      this.currentQuestionIndex++;
      this.nextQuestion();
    });
  }

  showFinalSummary() {
    if (!this.containerEl) return;
    if (this.feedbackEl) this.feedbackEl.innerHTML = '';

    const maxScore = this.totalQuestions * 10;
    const percentage = Math.round((this.score / maxScore) * 100);

    let message = "Teruslah berlatih! Setiap master dulunya adalah seorang pemula.";
    if (percentage >= 80) {
      message = "Hebat sekali! Anda sudah sangat memahami sistem titik huruf Braille.";
    } else if (percentage >= 50) {
      message = "Bagus! Pemahaman Anda sudah cukup baik, sedikit latihan lagi akan membuat Anda mahir.";
    }

    const summaryHTML = `
      <div class="quiz-summary-card" role="region" aria-label="Hasil Kuis Permainan">
        <h3 class="summary-title">🎉 Kuis Selesai!</h3>
        <p class="summary-score-large">${this.score} <span class="summary-max">/ ${maxScore}</span></p>
        <p class="summary-percentage">Tingkat Akurasi: ${percentage}%</p>
        <p class="summary-message">${message}</p>
        <div class="summary-actions">
          <button type="button" class="btn btn-primary btn-large" id="btn-play-again">
            ↺ Mainkan Lagi
          </button>
        </div>
      </div>
    `;

    this.containerEl.innerHTML = summaryHTML;
    window.a11y.announce(`Kuis selesai! Skor akhir Anda adalah ${this.score} dari ${maxScore}. ${message}`);
    window.a11y.speak(`Kuis selesai! Skor akhir Anda ${this.score} dari ${maxScore}. ${message}`);

    const playAgainBtn = this.containerEl.querySelector('#btn-play-again');
    if (playAgainBtn) {
      playAgainBtn.focus();
      playAgainBtn.addEventListener('click', () => this.startNewGame());
    }
  }

  generateBrailleCellHTML(dotsArray) {
    const activeSet = new Set(dotsArray);
    return `
      <div class="braille-static-cell" aria-hidden="true">
        <div class="cell-col">
          <span class="cell-dot ${activeSet.has(1) ? 'filled' : ''}"></span>
          <span class="cell-dot ${activeSet.has(2) ? 'filled' : ''}"></span>
          <span class="cell-dot ${activeSet.has(3) ? 'filled' : ''}"></span>
        </div>
        <div class="cell-col">
          <span class="cell-dot ${activeSet.has(4) ? 'filled' : ''}"></span>
          <span class="cell-dot ${activeSet.has(5) ? 'filled' : ''}"></span>
          <span class="cell-dot ${activeSet.has(6) ? 'filled' : ''}"></span>
        </div>
      </div>
    `;
  }
}

window.BrailleQuiz = BrailleQuiz;
