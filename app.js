/* ============================================================
   OrchOS · Deck — navegação + scaling 16:9
   Vanilla JS, zero dependências.
   Responsabilidades:
     - escala o palco 1920x1080 pra caber na janela (letterbox)
     - navegação: menu, teclado, swipe, wheel, hash + popstate
     - realce do nav ativo, footer NN/12
   ============================================================ */
(function () {
  'use strict';

  var STAGE_W = 1920;
  var STAGE_H = 1080;

  var stage = document.getElementById('stage');
  var viewport = document.getElementById('viewport');
  var navNumbers = document.getElementById('navNumbers');
  var navSection = document.getElementById('navSection');
  var footNum = document.getElementById('footNum');
  var footTotal = document.getElementById('footTotal');

  var slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
  var ids = slides.map(function (s) { return s.id; });        // ["01","02",...]
  var total = slides.length;
  var current = 0;

  /* -------------------------------------------------- *
   *  Scaling 16:9 com letterbox                        *
   * -------------------------------------------------- */
  function fit() {
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var scale = Math.min(vw / STAGE_W, vh / STAGE_H);
    stage.style.transform = 'scale(' + scale + ')';
  }

  /* -------------------------------------------------- *
   *  Nav: monta os números 01..12                      *
   * -------------------------------------------------- */
  function buildNav() {
    var frag = document.createDocumentFragment();
    ids.forEach(function (id, i) {
      var btn = document.createElement('button');
      btn.className = 'deck-nav__num';
      btn.type = 'button';
      btn.textContent = id;
      btn.setAttribute('data-index', String(i));
      btn.addEventListener('click', function () { go(i, true); });
      frag.appendChild(btn);
    });
    navNumbers.appendChild(frag);
    if (footTotal) {
      footTotal.textContent = total < 10 ? '0' + total : String(total);
    }
  }

  function refreshNav() {
    var btns = navNumbers.querySelectorAll('.deck-nav__num');
    for (var i = 0; i < btns.length; i++) {
      if (i === current) btns[i].classList.add('is-active');
      else btns[i].classList.remove('is-active');
    }
    var sec = slides[current].getAttribute('data-section') || '';
    navSection.textContent = sec;
    footNum.textContent = ids[current];
  }

  /* -------------------------------------------------- *
   *  Navegação                                         *
   * -------------------------------------------------- */
  function go(index, pushHash) {
    if (index < 0) index = 0;
    if (index > total - 1) index = total - 1;
    if (index === current && slides[current].classList.contains('is-active')) {
      // ainda assim atualiza hash/nav na primeira carga
    }
    slides[current].classList.remove('is-active');
    current = index;
    slides[current].classList.add('is-active');
    refreshNav();
    if (pushHash) {
      var h = '#' + ids[current];
      if (location.hash !== h) history.pushState({ i: current }, '', h);
    }
  }

  function next() { go(current + 1, true); }
  function prev() { go(current - 1, true); }

  /* -------------------------------------------------- *
   *  Hash inicial / popstate                           *
   * -------------------------------------------------- */
  function indexFromHash() {
    var h = (location.hash || '').replace('#', '');
    var idx = ids.indexOf(h);
    return idx >= 0 ? idx : 0;
  }

  window.addEventListener('popstate', function () {
    go(indexFromHash(), false);
  });

  /* -------------------------------------------------- *
   *  Teclado                                           *
   * -------------------------------------------------- */
  document.addEventListener('keydown', function (e) {
    switch (e.key) {
      case 'ArrowRight':
      case 'PageDown':
      case ' ':
      case 'Spacebar':
        e.preventDefault(); next(); break;
      case 'ArrowLeft':
      case 'PageUp':
        e.preventDefault(); prev(); break;
      case 'Home':
        e.preventDefault(); go(0, true); break;
      case 'End':
        e.preventDefault(); go(total - 1, true); break;
    }
  });

  /* -------------------------------------------------- *
   *  Roda do mouse (debounced)                         *
   * -------------------------------------------------- */
  var wheelLock = false;
  window.addEventListener('wheel', function (e) {
    if (wheelLock) return;
    if (Math.abs(e.deltaY) < 12 && Math.abs(e.deltaX) < 12) return;
    wheelLock = true;
    var d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (d > 0) next(); else prev();
    setTimeout(function () { wheelLock = false; }, 520);
  }, { passive: true });

  /* -------------------------------------------------- *
   *  Swipe (touch)                                     *
   * -------------------------------------------------- */
  var touchX = 0, touchY = 0, touching = false;
  window.addEventListener('touchstart', function (e) {
    if (!e.touches.length) return;
    touchX = e.touches[0].clientX;
    touchY = e.touches[0].clientY;
    touching = true;
  }, { passive: true });
  window.addEventListener('touchend', function (e) {
    if (!touching) return;
    touching = false;
    var t = e.changedTouches[0];
    var dx = t.clientX - touchX;
    var dy = t.clientY - touchY;
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0) next(); else prev();
  }, { passive: true });

  /* -------------------------------------------------- *
   *  Boot                                              *
   * -------------------------------------------------- */
  window.addEventListener('resize', fit);
  fit();
  buildNav();
  go(indexFromHash(), false);
  // garante hash na URL no primeiro load (replace, não push)
  if (!location.hash) history.replaceState({ i: current }, '', '#' + ids[current]);
})();
