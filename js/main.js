/**
 * main.js
 * Inisialisasi Aplikasi Utama, Rendering Tabel Huruf A-Z, Pencarian, Filter, dan Navigasi
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Inisialisasi Komponen Simulator & Kuis
  const simulator = new window.BrailleSimulator();
  const quiz = new window.BrailleQuiz();

  // 2. Rendering Tabel / Grid Alfabet Braille
  const alphabetGrid = document.getElementById('alphabet-grid');
  const searchInput = document.getElementById('alphabet-search');
  const groupFilters = document.querySelectorAll('.filter-btn');

  let currentFilterGroup = 'all';
  let searchQuery = '';

  function renderAlphabet() {
    if (!alphabetGrid) return;
    alphabetGrid.innerHTML = '';

    const filtered = BRAILLE_DATA.filter(item => {
      // Filter Kelompok
      const matchesGroup = (currentFilterGroup === 'all') || (item.group.toString() === currentFilterGroup);

      // Pencarian (bisa cari huruf, nomor titik, atau deskripsi)
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        item.letter.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.mnemonic.toLowerCase().includes(q) ||
        item.dots.join(',').includes(q) ||
        item.dots.join(' ').includes(q);

      return matchesGroup && matchesSearch;
    });

    if (filtered.length === 0) {
      alphabetGrid.innerHTML = `
        <div class="no-results-msg" role="status">
          <p>Tidak ditemukan huruf Braille yang sesuai dengan kata kunci "<strong>${escapeHtml(searchQuery)}</strong>".</p>
          <button type="button" class="btn btn-secondary btn-sm" id="btn-reset-search">Bersihkan Pencarian</button>
        </div>
      `;
      const resetBtn = alphabetGrid.querySelector('#btn-reset-search');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          if (searchInput) searchInput.value = '';
          searchQuery = '';
          renderAlphabet();
        });
      }
      return;
    }

    filtered.forEach(item => {
      const card = document.createElement('article');
      card.className = 'braille-card';
      card.setAttribute('aria-label', `Huruf ${item.letter}, ${item.description}`);

      const dotsDesc = item.dots.map(d => `Titik ${d}`).join(', ');

      card.innerHTML = `
        <div class="card-header">
          <div class="card-letter-badge" aria-hidden="true">${item.letter}</div>
          <div class="card-group-tag">Kelompok ${item.group}</div>
        </div>

        <div class="card-braille-visual">
          ${quiz.generateBrailleCellHTML(item.dots)}
          <span class="card-unicode-symbol" aria-hidden="true">${item.unicode}</span>
        </div>

        <div class="card-content">
          <h3 class="card-title">Huruf ${item.letter}</h3>
          <p class="card-dots-info"><strong>Pola:</strong> ${dotsDesc}</p>
          <p class="card-mnemonic"><em>Tip:</em> ${item.mnemonic}</p>
        </div>

        <div class="card-actions">
          <button type="button" class="btn btn-card-audio" aria-label="Dengarkan pelafalan dan titik huruf ${item.letter}">
            <span aria-hidden="true">🔊</span> Dengarkan
          </button>
          <button type="button" class="btn btn-card-simulate" aria-label="Coba huruf ${item.letter} pada Simulator">
            <span aria-hidden="true">⚙️</span> Coba di Simulator
          </button>
        </div>
      `;

      // Event listener tombol dengarkan
      const audioBtn = card.querySelector('.btn-card-audio');
      audioBtn.addEventListener('click', () => {
        const text = `Huruf ${item.letter}. Pola titik: ${item.description}. Tips mengingat: ${item.mnemonic}`;
        window.a11y.speak(text, true);
        window.a11y.announce(`Memutar suara untuk huruf ${item.letter}.`);
      });

      // Event listener tombol buka di simulator
      const simBtn = card.querySelector('.btn-card-simulate');
      simBtn.addEventListener('click', () => {
        simulator.setPattern(item.dots);
        const simSection = document.getElementById('simulator');
        if (simSection) {
          simSection.scrollIntoView({ behavior: 'smooth' });
          const firstDot = document.getElementById('sim-dot-1');
          if (firstDot) firstDot.focus();
        }
        window.a11y.announce(`Pola huruf ${item.letter} dimasukkan ke simulator.`);
      });

      alphabetGrid.appendChild(card);
    });
  }

  // Filter Button Events
  groupFilters.forEach(btn => {
    btn.addEventListener('click', () => {
      groupFilters.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      currentFilterGroup = btn.getAttribute('data-group');
      renderAlphabet();
      window.a11y.announce(`Menampilkan filter: ${btn.textContent}`);
    });
  });

  // Search Input Events
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderAlphabet();
    });
  }

  // Initial render
  renderAlphabet();

  // 3. Tombol Kembali ke Atas (Back to Top)
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const mainHeading = document.querySelector('h1');
      if (mainHeading) mainHeading.focus();
    });
  }

  // 4. Modal Panduan Keyboard
  const modal = document.getElementById('keyboard-modal');
  const openModalBtn = document.getElementById('btn-keyboard-help');
  const closeModalBtn = document.getElementById('btn-close-modal');

  if (modal && openModalBtn && closeModalBtn) {
    let previousActiveElement = null;

    openModalBtn.addEventListener('click', () => {
      previousActiveElement = document.activeElement;
      modal.setAttribute('aria-hidden', 'false');
      modal.classList.add('open');
      closeModalBtn.focus();
      window.a11y.announce("Jendela panduan tombol keyboard terbuka.");
    });

    const closeModal = () => {
      modal.setAttribute('aria-hidden', 'true');
      modal.classList.remove('open');
      if (previousActiveElement) previousActiveElement.focus();
      window.a11y.announce("Jendela panduan tombol keyboard ditutup.");
    };

    closeModalBtn.addEventListener('click', closeModal);

    modal.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    });

    // Tutup saat klik latar belakang luar
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  function escapeHtml(string) {
    if (!string) return '';
    return string.replace(/[&<>"']/g, (m) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[m]);
  }
});
