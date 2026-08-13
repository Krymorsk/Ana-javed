/*
  Ana & Arish — production-ready site logic
  Flat-file architecture: add media files beside index.html.

  To add a future memory, add one object to MEMORY_DATA.
  To add a future song, add one object to PLAYLIST.
*/

(() => {
  'use strict';

  const START_DATE = '2025-05-10T00:00:00+05:30';
  const START_MS = new Date(START_DATE).getTime();
  const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let reduceMotion = reduceMotionQuery.matches;

  const MEMORY_DATA = [
    {
      id: 'may-10-2025',
      date: 'May 10, 2025',
      chapter: 'Chapter 01',
      title: 'The beginning.',
      location: 'Phoenix United Mall',
      image: 'may11.jpg',
      imageAlt: 'Our first meeting',
      shortDate: 'May 10',
      text: 'Maybe neither of us knew how important that little moment would become. But somehow, my heart noticed.'
    },
    {
      id: 'jun-03-2025',
      date: 'June 3, 2025',
      chapter: 'Chapter 02',
      title: 'A little closer.',
      location: 'Shalimar Gateway Mall',
      image: 'june3.jpg',
      imageAlt: 'Our second meeting',
      shortDate: 'June 3',
      text: "Another day together, another beautiful chapter. The kind of day that makes ordinary places feel special simply because you're there."
    },
    {
      id: 'jul-19-2025',
      date: 'July 19, 2025',
      chapter: 'Chapter 03',
      title: 'My favorite chapter.',
      location: 'Shalimar Gateway Mall',
      image: 'july19.jpg',
      imageAlt: 'Our third meeting',
      shortDate: 'July 19',
      text: 'By now, I knew. Somewhere between all the conversations and little moments, my heart had quietly chosen you.'
    }
  ];

  const PLAYLIST = [
    {
      id: 'our-song',
      title: 'Our Song',
      artist: 'Ana & Arish',
      src: 'our-song.mp3',
      note: 'A little soundtrack for us.'
    }
  ];

  const REASONS = [
    { title: 'Your smile.', teaser: 'It changes the whole mood of a room.', note: 'Because somehow your smile can make an ordinary moment feel important.' },
    { title: 'The way you care.', teaser: 'Even in the tiniest little ways.', note: 'Because the little things you do make me feel seen, remembered, and loved.' },
    { title: 'Your little habits.', teaser: 'The details nobody else notices.', note: 'Because the tiny details become the things I remember most when I miss you.' },
    { title: 'How you feel like home.', teaser: 'The easiest place to be myself.', note: 'Because with you, quiet moments do not feel empty. They feel peaceful.' }
  ];

  const LETTERS = {
    sad: {
      icon: '✉', title: 'When you are sad', body: 'You do not have to turn every bad day into a good one. You can just have the bad day.\n\nAnd somewhere inside it, please remember that there is someone who is always cheering for you, always thinking about you, and always ready to listen. ❤️'
    },
    miss: {
      icon: '♡', title: 'When you miss me', body: 'Imagine I am sitting beside you, probably stealing a little bit of your space and smiling at you.\n\nUntil the next time we meet, keep one tiny hug reserved for me. I am keeping one reserved for you too. 💗'
    },
    sleep: {
      icon: '☾', title: "When you can't sleep", body: 'Close your eyes. Breathe slowly. Let today be done.\n\nTomorrow gets another chance, and so do we. For tonight, just rest. You are loved. 🌙'
    },
    smile: {
      icon: '✦', title: 'When you need a smile', body: 'Emergency reminder: you are ridiculously cute. This message is legally binding and cannot be appealed.\n\nAlso, yes, I am smiling while writing this. 😌'
    }
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const required = (selector, root = document) => {
    const node = $(selector, root);
    if (!node) throw new Error(`Missing required element: ${selector}`);
    return node;
  };

  const els = {
    progress: required('#progress'),
    header: required('#siteHeader'),
    timeline: required('#timeline'),
    galleryGrid: required('#galleryGrid'),
    reasonGrid: required('#reasonGrid'),
    letterGrid: required('#letterGrid'),
    memoryCount: required('#memoryCount'),
    chapterCount: required('#chapterCount'),
    storyYears: required('#storyYears'),
    daysTogether: required('#daysTogether'),
    counterHours: required('#counterHours'),
    counterMinutes: required('#counterMinutes'),
    counterSeconds: required('#counterSeconds'),
    reasonNote: required('#reasonNote'),
    imageModal: required('#imageModal'),
    modalImage: required('#modalImage'),
    modalCaption: required('#modalCaption'),
    modalClose: required('#modalClose'),
    modalPrev: required('#modalPrev'),
    modalNext: required('#modalNext'),
    letterModal: required('#letterModal'),
    letterTitle: required('#letterTitle'),
    letterBody: required('#letterBody'),
    letterClose: required('#letterClose'),
    letterCloseAction: required('#letterCloseAction'),
    shortcutModal: required('#shortcutModal'),
    shortcutClose: required('#shortcutClose'),
    musicModal: required('#musicModal'),
    musicModalClose: required('#musicModalClose'),
    toast: required('#toast'),
    surpriseBtn: required('#surpriseBtn'),
    ambientHeartBtn: required('#ambientHeartBtn'),
    secretTrigger: required('#secretTrigger'),
    restartBtn: required('#restartBtn'),
    audio: required('#audioPlayer'),
    musicArt: required('#musicArt'),
    musicLiveBadge: required('#musicLiveBadge'),
    trackTitle: required('#trackTitle'),
    trackArtist: required('#trackArtist'),
    trackIndex: required('#trackIndex'),
    seekBar: required('#seekBar'),
    currentTime: required('#currentTime'),
    duration: required('#duration'),
    playBtn: required('#playBtn'),
    prevBtn: required('#prevBtn'),
    nextBtn: required('#nextBtn'),
    muteBtn: required('#muteBtn'),
    volumeBar: required('#volumeBar'),
    musicStatus: required('#musicStatus'),
    playlistList: required('#playlistList'),
    playlistCount: required('#playlistCount'),
    musicUploadBtn: required('#musicUploadBtn'),
    musicFile: required('#musicFile'),
    musicFileNote: required('#musicFileNote'),
    miniPlayer: required('#miniPlayer'),
    miniOpen: required('#miniOpen'),
    miniDisc: required('#miniDisc'),
    miniTrack: required('#miniTrack'),
    miniState: required('#miniState'),
    miniProgressBar: required('#miniProgressBar'),
    miniPlay: required('#miniPlay')
  };

  let toastTimer = 0;
  let revealObserver = null;
  let counterTimer = 0;
  let heartTimer = 0;
  let currentMemoryIndex = 0;
  let activeLetterType = null;
  let activeModal = null;
  let modalPreviousFocus = null;
  let selectedObjectUrl = null;
  let currentTrackIndex = 0;
  let isDefaultTrackFailed = false;
  let isLocalTrack = false;
  let localTrackName = '';
  let lastVolume = Number(els.volumeBar.value) || 0.8;

  const memoryById = new Map(MEMORY_DATA.map((memory, index) => [memory.id, index]));
  const playlistById = new Map(PLAYLIST.map((track, index) => [track.id, index]));

  function showToast(message, duration = 3200) {
    els.toast.textContent = message;
    els.toast.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => els.toast.classList.remove('show'), duration);
  }

  function setText(node, value) {
    node.textContent = String(value);
  }

  function formatNumber(value) {
    return new Intl.NumberFormat('en-IN').format(value);
  }

  function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return hours > 0 ? `${hours}:${String(minutes).padStart(2, '0')}:${secs}` : `${minutes}:${secs}`;
  }

  function addClass(node, name, enabled) {
    node.classList.toggle(name, Boolean(enabled));
  }

  function updateScrollProgress() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
    els.progress.style.transform = `scaleX(${ratio})`;
  }

  function getNavTargetForSection(sectionId) {
    return sectionId === 'home' ? 'story' : sectionId === 'gallery' ? 'moments' : sectionId;
  }

  function updateActiveNav() {
    const links = $$('.nav a');
    const sections = $$('main section[id]');
    const anchor = window.scrollY + window.innerHeight * 0.33;
    let active = 'story';
    for (const section of sections) {
      if (anchor >= section.offsetTop) active = getNavTargetForSection(section.id);
    }
    links.forEach(link => {
      const target = link.getAttribute('href')?.slice(1);
      const isActive = target === active;
      link.classList.toggle('active', isActive);
      if (isActive) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }

  function refreshRevealTargets() {
    $$('.reveal:not([data-reveal-observed])').forEach(item => {
      item.setAttribute('data-reveal-observed', 'true');
      if (revealObserver) revealObserver.observe(item);
      else item.classList.add('visible');
    });
  }

  function initReveal() {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      $$('.reveal').forEach(item => item.classList.add('visible'));
      return;
    }
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    refreshRevealTargets();
  }

  function updateCounter() {
    const diff = Math.max(0, Date.now() - START_MS);
    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    setText(els.daysTogether, formatNumber(days));
    setText(els.counterHours, String(hours).padStart(2, '0'));
    setText(els.counterMinutes, String(minutes).padStart(2, '0'));
    setText(els.counterSeconds, String(seconds).padStart(2, '0'));
  }

  function createImageWithFallback(src, alt, className = '') {
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.loading = 'lazy';
    img.decoding = 'async';
    if (className) img.className = className;
    img.addEventListener('error', () => {
      const fallback = document.createElement('div');
      fallback.className = 'photo-fallback';
      fallback.setAttribute('role', 'img');
      fallback.setAttribute('aria-label', `Photo unavailable: ${alt}`);
      fallback.textContent = `Photo unavailable — ${src}`;
      img.replaceWith(fallback);
    }, { once: true });
    return img;
  }

  function renderMemories() {
    els.timeline.replaceChildren();
    els.galleryGrid.replaceChildren();

    MEMORY_DATA.forEach((memory, index) => {
      const card = document.createElement('article');
      card.className = 'memory-card reveal';
      card.dataset.memoryId = memory.id;

      const photo = document.createElement('div');
      photo.className = 'memory-photo';
      const image = createImageWithFallback(memory.image, memory.imageAlt);
      photo.appendChild(image);

      const open = document.createElement('button');
      open.type = 'button';
      open.className = 'photo-open';
      open.textContent = 'View memory ↗';
      open.setAttribute('aria-label', `Open ${memory.title.replace('.', '')}`);
      open.addEventListener('click', () => openImageModal(index));
      photo.appendChild(open);

      const copy = document.createElement('div');
      copy.className = 'memory-copy';
      copy.innerHTML = `
        <p class="date"></p>
        <h3></h3>
        <p class="place"></p>
        <p></p>
        <span class="chapter-no"></span>
      `;
      $('.date', copy).textContent = `${memory.date} · ${memory.chapter}`;
      $('h3', copy).textContent = memory.title;
      $('.place', copy).textContent = `📍 ${memory.location}`;
      $('p:last-of-type', copy).textContent = memory.text;
      $('.chapter-no', copy).textContent = String(index + 1).padStart(2, '0');

      card.append(photo, copy);
      els.timeline.appendChild(card);

      const galleryButton = document.createElement('button');
      galleryButton.type = 'button';
      galleryButton.className = `gallery-item reveal${index > 0 ? ` reveal-delay-${Math.min(index, 3)}` : ''}`;
      galleryButton.dataset.memoryId = memory.id;
      const galleryImage = createImageWithFallback(memory.image, memory.imageAlt);
      galleryButton.appendChild(galleryImage);
      const label = document.createElement('span');
      label.textContent = memory.shortDate;
      galleryButton.appendChild(label);
      galleryButton.addEventListener('click', () => openImageModal(index));
      els.galleryGrid.appendChild(galleryButton);
    });

    setText(els.memoryCount, MEMORY_DATA.length);
    setText(els.chapterCount, MEMORY_DATA.length);
    const elapsedYears = Math.max(0, new Date().getFullYear() - new Date(START_DATE).getFullYear());
    setText(els.storyYears, elapsedYears);
    refreshRevealTargets();
  }

  function renderReasons() {
    els.reasonGrid.replaceChildren();
    REASONS.forEach((reason, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `reason-card reveal${index > 0 ? ` reveal-delay-${Math.min(index, 3)}` : ''}`;
      button.innerHTML = `<span>${String(index + 1).padStart(2, '0')}</span><strong></strong><em></em>`;
      $('strong', button).textContent = reason.title;
      $('em', button).textContent = reason.teaser;
      button.addEventListener('click', () => {
        setText(els.reasonNote, reason.note);
      });
      els.reasonGrid.appendChild(button);
    });
    refreshRevealTargets();
  }

  function renderLetters() {
    els.letterGrid.replaceChildren();
    Object.entries(LETTERS).forEach(([key, letter], index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `letter-card reveal${index > 0 ? ` reveal-delay-${Math.min(index, 3)}` : ''}`;
      button.dataset.letter = key;
      button.innerHTML = `<span class="envelope"></span><strong></strong><small>open gently</small>`;
      $('.envelope', button).textContent = letter.icon;
      $('strong', button).textContent = letter.title.replace(/^When /, '');
      button.addEventListener('click', () => openLetter(key));
      els.letterGrid.appendChild(button);
    });
    refreshRevealTargets();
  }

  function createHeart(symbol = '♥', force = false) {
    if (!force && $$('.floating-heart').length > 16) return;
    const heart = document.createElement('span');
    heart.className = 'floating-heart';
    heart.textContent = symbol;
    heart.style.left = `${Math.random() * 100}vw`;
    heart.style.fontSize = `${10 + Math.random() * 20}px`;
    heart.style.setProperty('--drift', `${-40 + Math.random() * 80}px`);
    heart.style.animationDuration = `${6 + Math.random() * 5}s`;
    document.body.appendChild(heart);
    window.setTimeout(() => heart.remove(), 12000);
  }

  function openModal(modal, focusTarget) {
    if (activeModal && activeModal !== modal) closeModal(activeModal);
    modalPreviousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    activeModal = modal;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    (focusTarget || $('.modal-close', modal))?.focus();
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    if (activeModal === modal) activeModal = null;
    if (!$('.modal.open')) document.body.classList.remove('modal-open');
    window.setTimeout(() => modalPreviousFocus?.focus?.(), reduceMotion ? 0 : 180);
  }

  function trapModalFocus(event) {
    if (event.key !== 'Tab' || !activeModal) return;
    const focusables = $$('button, a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])', activeModal)
      .filter(node => node.offsetParent !== null || node === document.activeElement);
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function openImageModal(index) {
    if (!MEMORY_DATA[index]) return;
    currentMemoryIndex = index;
    const memory = MEMORY_DATA[index];
    els.modalImage.src = memory.image;
    els.modalImage.alt = memory.imageAlt;
    els.modalCaption.textContent = `${memory.date} · ${memory.location}`;
    els.modalImage.onerror = () => {
      els.modalCaption.textContent = `Photo unavailable — ${memory.image}`;
      els.modalImage.removeAttribute('src');
    };
    openModal(els.imageModal, els.modalClose);
  }

  function moveImageModal(direction) {
    if (!MEMORY_DATA.length) return;
    const nextIndex = (currentMemoryIndex + direction + MEMORY_DATA.length) % MEMORY_DATA.length;
    openImageModal(nextIndex);
  }

  function openLetter(type) {
    const letter = LETTERS[type];
    if (!letter) return;
    activeLetterType = type;
    els.letterTitle.textContent = letter.title;
    els.letterBody.textContent = letter.body;
    openModal(els.letterModal, els.letterClose);
  }

  function openMusicPlayer() {
    openModal(els.musicModal, els.musicModalClose);
  }

  function renderPlaylist() {
    els.playlistList.replaceChildren();
    setText(els.playlistCount, `${PLAYLIST.length} ${PLAYLIST.length === 1 ? 'track' : 'tracks'}`);
    PLAYLIST.forEach((track, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'playlist-item';
      button.dataset.trackId = track.id;
      button.innerHTML = `
        <span class="playlist-number"></span>
        <span class="playlist-title"><strong></strong><span></span></span>
        <span class="playlist-duration" data-duration-for="${track.id}">--:--</span>
      `;
      $('.playlist-number', button).textContent = String(index + 1).padStart(2, '0');
      $('.playlist-title strong', button).textContent = track.title;
      $('.playlist-title span', button).textContent = track.artist;
      button.addEventListener('click', () => loadTrack(index, { autoplay: true }));
      els.playlistList.appendChild(button);
    });
    syncPlaylistActiveState();
  }

  function syncPlaylistActiveState() {
    $$('.playlist-item', els.playlistList).forEach(item => {
      const active = item.dataset.trackId === PLAYLIST[currentTrackIndex]?.id;
      item.classList.toggle('active', active);
      item.setAttribute('aria-current', active ? 'true' : 'false');
    });
  }

  function setMusicStatus(status, tone = 'ready') {
    els.musicStatus.textContent = status;
    els.musicLiveBadge.classList.remove('playing', 'loading', 'error');
    if (tone !== 'ready') els.musicLiveBadge.classList.add(tone);
    els.musicLiveBadge.textContent = tone === 'playing' ? 'PLAYING' : tone === 'loading' ? 'LOADING' : tone === 'error' ? 'ERROR' : 'READY';
  }

  function updateMusicUI() {
    const track = PLAYLIST[currentTrackIndex];
    if (!track) return;
    if (isLocalTrack) {
      const localTitle = localTrackName || 'Local track';
      setText(els.trackTitle, localTitle);
      setText(els.trackArtist, 'Local file');
      setText(els.trackIndex, 'Local');
      setText(els.miniTrack, localTitle);
    } else {
      setText(els.trackTitle, track.title);
      setText(els.trackArtist, track.artist);
      setText(els.trackIndex, `${currentTrackIndex + 1} / ${PLAYLIST.length}`);
      setText(els.miniTrack, track.title);
    }
    syncPlaylistActiveState();

    const isPlaying = !els.audio.paused && !els.audio.ended;
    els.playBtn.textContent = isPlaying ? '❚❚' : '▶';
    els.playBtn.setAttribute('aria-label', isPlaying ? 'Pause track' : 'Play track');
    els.miniPlay.textContent = isPlaying ? '❚❚' : '▶';
    els.miniPlay.setAttribute('aria-label', isPlaying ? 'Pause track' : 'Play track');
    els.musicArt.classList.toggle('playing', isPlaying);
    els.miniDisc.classList.toggle('playing', isPlaying);
    els.miniState.textContent = isPlaying ? 'Now playing' : els.audio.currentTime > 0 ? 'Paused' : 'Ready';
    const duration = Number(els.audio.duration) || 0;
    const progress = duration > 0 ? Math.min(100, Math.max(0, (els.audio.currentTime / duration) * 100)) : 0;
    els.miniProgressBar.style.width = `${progress}%`;
    els.muteBtn.textContent = els.audio.muted || els.audio.volume === 0 ? '🔇' : '🔊';
    els.muteBtn.setAttribute('aria-label', els.audio.muted || els.audio.volume === 0 ? 'Unmute audio' : 'Mute audio');
    els.miniPlayer.classList.toggle('show', Boolean(els.audio.src));
    els.miniPlayer.setAttribute('aria-hidden', String(!els.audio.src));
  }

  function clearObjectUrl() {
    if (selectedObjectUrl) {
      URL.revokeObjectURL(selectedObjectUrl);
      selectedObjectUrl = null;
    }
  }

  function setAudioSource(src, useObjectUrl = false) {
    clearObjectUrl();
    if (useObjectUrl) selectedObjectUrl = src;
    els.audio.src = src;
    els.audio.load();
  }

  async function loadTrack(index, options = {}) {
    if (!PLAYLIST[index]) return;
    currentTrackIndex = index;
    isDefaultTrackFailed = false;
    isLocalTrack = false;
    localTrackName = '';
    const track = PLAYLIST[index];
    setMusicStatus('Loading track…', 'loading');
    els.musicFileNote.innerHTML = 'The playlist track is <strong>configured in script.js</strong>.';
    updateMusicUI();
    setAudioSource(track.src);

    if (options.autoplay) {
      try {
        await waitForMetadata(els.audio, 5500);
        await els.audio.play();
      } catch (error) {
        if (error?.name === 'NotAllowedError') {
          showToast('The browser blocked autoplay. Press play to start the track. 🎵');
          setMusicStatus('Ready to play');
        } else {
          handleAudioError();
        }
      }
    }
  }

  function waitForMetadata(audio, timeout = 5000) {
    if (audio.readyState >= HTMLMediaElement.HAVE_METADATA) return Promise.resolve();
    return new Promise((resolve, reject) => {
      let timer = 0;
      const cleanup = () => {
        window.clearTimeout(timer);
        audio.removeEventListener('loadedmetadata', onReady);
        audio.removeEventListener('error', onError);
      };
      const onReady = () => { cleanup(); resolve(); };
      const onError = () => { cleanup(); reject(new Error('Audio metadata failed to load.')); };
      timer = window.setTimeout(() => { cleanup(); reject(new Error('Audio metadata timed out.')); }, timeout);
      audio.addEventListener('loadedmetadata', onReady, { once: true });
      audio.addEventListener('error', onError, { once: true });
    });
  }

  async function togglePlayback() {
    if (!els.audio.src) {
      await loadTrack(currentTrackIndex);
    }
    try {
      if (els.audio.paused) await els.audio.play();
      else els.audio.pause();
    } catch (error) {
      if (error?.name === 'NotAllowedError') showToast('Press the play button again to start the music. 🎵');
      else handleAudioError();
    }
  }

  async function nextTrack({ autoplay = false } = {}) {
    if (!PLAYLIST.length) return;
    const next = (currentTrackIndex + 1) % PLAYLIST.length;
    await loadTrack(next, { autoplay });
  }

  async function previousTrack({ autoplay = false } = {}) {
    if (!PLAYLIST.length) return;
    if (els.audio.currentTime > 3) {
      els.audio.currentTime = 0;
      return;
    }
    const previous = (currentTrackIndex - 1 + PLAYLIST.length) % PLAYLIST.length;
    await loadTrack(previous, { autoplay });
  }

  function seekBy(delta) {
    if (!Number.isFinite(els.audio.duration)) return;
    els.audio.currentTime = Math.min(els.audio.duration, Math.max(0, els.audio.currentTime + delta));
  }

  function setVolume(value) {
    const normalized = Math.min(1, Math.max(0, Number(value)));
    els.audio.volume = normalized;
    els.volumeBar.value = String(normalized);
    if (normalized > 0) lastVolume = normalized;
    if (normalized === 0) els.audio.muted = true;
    else if (els.audio.muted) els.audio.muted = false;
    updateMusicUI();
  }

  function toggleMute() {
    if (els.audio.muted || els.audio.volume === 0) {
      els.audio.muted = false;
      setVolume(lastVolume || 0.8);
    } else {
      lastVolume = els.audio.volume || lastVolume;
      els.audio.muted = true;
    }
    updateMusicUI();
  }

  function updateMediaSession() {
    const track = PLAYLIST[currentTrackIndex];
    if (!('mediaSession' in navigator) || !track) return;
    const title = isLocalTrack ? (localTrackName || 'Local track') : track.title;
    const artist = isLocalTrack ? 'Local file' : track.artist;
    navigator.mediaSession.metadata = new MediaMetadata({ title, artist, album: 'Ana & Arish' });
    const actions = {
      play: togglePlayback,
      pause: togglePlayback,
      previoustrack: () => previousTrack({ autoplay: true }),
      nexttrack: () => nextTrack({ autoplay: true }),
      seekbackward: () => seekBy(-10),
      seekforward: () => seekBy(10)
    };
    Object.entries(actions).forEach(([action, handler]) => {
      try { navigator.mediaSession.setActionHandler(action, handler); } catch { /* unsupported action */ }
    });
  }

  function handleAudioError() {
    const track = PLAYLIST[currentTrackIndex];
    setMusicStatus(`Couldn't load ${track?.src || 'the track'}.`, 'error');
    els.musicFileNote.textContent = `Check that ${track?.src || 'the audio file'} is beside index.html and named exactly as configured.`;
    els.musicLiveBadge.classList.add('error');
    els.audio.pause();
    updateMusicUI();
    if (!selectedObjectUrl) isDefaultTrackFailed = true;
    showToast(`Music couldn't load. Check ${track?.src || 'the configured audio file'}.`, 4300);
  }

  function useLocalAudioFile(file) {
    if (!file) return;
    const valid = file.type.startsWith('audio/') || /\.(mp3|wav|m4a|aac|ogg|oga|flac|webm)$/i.test(file.name);
    if (!valid) {
      showToast('Please choose an audio file. 🎵');
      return;
    }
    clearObjectUrl();
    isLocalTrack = true;
    localTrackName = file.name.replace(/\.[^.]+$/, '');
    selectedObjectUrl = URL.createObjectURL(file);
    els.audio.src = selectedObjectUrl;
    els.audio.load();
    els.musicFileNote.textContent = `Playing ${file.name} locally in this browser. Nothing was uploaded.`;
    setMusicStatus('Loading local track…', 'loading');
    setText(els.trackTitle, localTrackName);
    setText(els.trackArtist, 'Local file');
    setText(els.trackIndex, 'Local');
    updateMediaSession();
    syncPlaylistActiveState();
    els.miniTrack.textContent = file.name;
    els.miniPlayer.classList.add('show');
    els.miniPlayer.setAttribute('aria-hidden', 'false');
    els.audio.play().then(() => {
      setMusicStatus('Playing local file', 'playing');
      updateMusicUI();
    }).catch(() => {
      setMusicStatus('Local file ready');
      updateMusicUI();
      showToast('The local file is loaded. Press play when you are ready. 🎵');
    });
  }

  function updateTrackDurationFromMetadata() {
    setText(els.duration, formatTime(els.audio.duration));
    const item = $(`[data-duration-for="${CSS.escape(PLAYLIST[currentTrackIndex].id)}"]`, els.playlistList);
    if (item) item.textContent = formatTime(els.audio.duration);
  }

  function updateTimeUI() {
    const current = els.audio.currentTime || 0;
    const total = els.audio.duration || 0;
    setText(els.currentTime, formatTime(current));
    const progress = total > 0 ? Math.min(100, Math.max(0, (current / total) * 100)) : 0;
    els.miniProgressBar.style.width = `${progress}%`;
    els.seekBar.value = total > 0 ? String((current / total) * 100) : '0';
    if ('mediaSession' in navigator && Number.isFinite(total) && total > 0) {
      try { navigator.mediaSession.setPositionState({ duration: total, playbackRate: els.audio.playbackRate || 1, position: Math.min(current, total) }); } catch { /* unsupported */ }
    }
  }

  function initMusic() {
    els.audio.volume = lastVolume;
    els.audio.preload = 'metadata';
    renderPlaylist();
    loadTrack(0, { autoplay: false });

    els.playBtn.addEventListener('click', togglePlayback);
    els.miniOpen.addEventListener('click', openMusicPlayer);
    els.miniPlay.addEventListener('click', togglePlayback);
    els.prevBtn.addEventListener('click', () => previousTrack({ autoplay: !els.audio.paused }));
    els.nextBtn.addEventListener('click', () => nextTrack({ autoplay: !els.audio.paused }));
    els.muteBtn.addEventListener('click', toggleMute);
    els.musicUploadBtn.addEventListener('click', () => els.musicFile.click());
    els.musicFile.addEventListener('change', event => {
      useLocalAudioFile(event.target.files?.[0]);
      event.target.value = '';
    });
    els.seekBar.addEventListener('input', () => {
      const total = els.audio.duration;
      if (Number.isFinite(total) && total > 0) els.audio.currentTime = (Number(els.seekBar.value) / 100) * total;
    });
    els.volumeBar.addEventListener('input', event => setVolume(event.target.value));

    els.audio.addEventListener('loadstart', () => setMusicStatus('Loading track…', 'loading'));
    els.audio.addEventListener('loadedmetadata', () => {
      isDefaultTrackFailed = false;
      updateTrackDurationFromMetadata();
      setMusicStatus('Ready to play');
      updateMusicUI();
      updateMediaSession();
    });
    els.audio.addEventListener('canplay', () => {
      setMusicStatus(els.audio.paused ? 'Ready to play' : 'Playing', els.audio.paused ? 'ready' : 'playing');
      updateMusicUI();
    });
    els.audio.addEventListener('waiting', () => setMusicStatus('Buffering…', 'loading'));
    els.audio.addEventListener('stalled', () => setMusicStatus('Waiting for audio…', 'loading'));
    els.audio.addEventListener('play', () => {
      setMusicStatus('Playing', 'playing');
      updateMusicUI();
    });
    els.audio.addEventListener('pause', () => {
      if (!els.audio.ended) setMusicStatus(els.audio.currentTime > 0 ? 'Paused' : 'Ready to play');
      updateMusicUI();
    });
    els.audio.addEventListener('timeupdate', updateTimeUI);
    els.audio.addEventListener('volumechange', updateMusicUI);
    els.audio.addEventListener('ratechange', updateTimeUI);
    els.audio.addEventListener('ended', async () => {
      updateTimeUI();
      const shouldContinue = PLAYLIST.length > 1;
      if (shouldContinue) await nextTrack({ autoplay: true });
      else {
        setMusicStatus('Finished — press play to hear it again');
        updateMusicUI();
      }
    });
    els.audio.addEventListener('error', () => {
      if (selectedObjectUrl) {
        showToast('The selected local audio could not be played. Please choose another file.');
      }
      handleAudioError();
    });
    updateMediaSession();
  }

  function handleKeyboard(event) {
    trapModalFocus(event);
    if (event.key === 'Escape') {
      if (activeModal) closeModal(activeModal);
      return;
    }
    if (activeModal) return;

    const target = event.target;
    const isFormControl = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement || target?.isContentEditable;
    if (isFormControl) return;

    if (event.key === ' ' || event.code === 'Space') {
      event.preventDefault();
      togglePlayback();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      seekBy(-5);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      seekBy(5);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setVolume((els.audio.volume || lastVolume) + 0.05);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      setVolume((els.audio.volume || lastVolume) - 0.05);
    } else if (event.key.toLowerCase() === 'm') {
      toggleMute();
    } else if (event.key === '[') {
      previousTrack({ autoplay: !els.audio.paused });
    } else if (event.key === ']') {
      nextTrack({ autoplay: !els.audio.paused });
    } else if (event.key === '?') {
      openModal(els.shortcutModal, els.shortcutClose);
    }
  }

  function initGlobalInteractions() {
    $$('.nav a').forEach(link => {
      link.addEventListener('click', () => {
        window.setTimeout(updateActiveNav, 120);
      });
    });

    els.ambientHeartBtn.addEventListener('click', () => {
      if (reduceMotion) {
        showToast('A little extra love, just because. 💗');
        return;
      }
      for (let i = 0; i < 5; i += 1) createHeart(i % 2 ? '♡' : '♥', true);
      showToast('A little extra love, just because. 💗');
    });

    els.surpriseBtn.addEventListener('click', () => {
      const messages = [
        'Plot twist: I would choose you again. ❤️',
        'Officially my favorite person. No appeals accepted. 😌💗',
        'Somewhere between May 10 and now, you became home. 🥹',
        'Next chapter unlocked: even more memories. ✨'
      ];
      showToast(messages[Math.floor(Math.random() * messages.length)]);
      if (!reduceMotion) for (let i = 0; i < 8; i += 1) createHeart(i % 2 ? '♡' : '♥', true);
    });

    let secretTaps = 0;
    let secretReset = 0;
    els.secretTrigger.addEventListener('click', () => {
      secretTaps += 1;
      window.clearTimeout(secretReset);
      secretReset = window.setTimeout(() => { secretTaps = 0; }, 1800);
      if (secretTaps < 5) {
        showToast(`${5 - secretTaps} more little secret tap${5 - secretTaps === 1 ? '' : 's'}… 👀`);
        return;
      }
      secretTaps = 0;
      showToast('You found the tiny secret: I would still choose you. ❤️');
      if (!reduceMotion) for (let i = 0; i < 14; i += 1) createHeart(i % 3 === 0 ? '✦' : '♥', true);
    });

    els.restartBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });

    els.modalClose.addEventListener('click', () => closeModal(els.imageModal));
    els.modalPrev.addEventListener('click', () => moveImageModal(-1));
    els.modalNext.addEventListener('click', () => moveImageModal(1));
    els.letterClose.addEventListener('click', () => closeModal(els.letterModal));
    els.letterCloseAction.addEventListener('click', () => closeModal(els.letterModal));
    els.shortcutClose.addEventListener('click', () => closeModal(els.shortcutModal));
    els.musicModalClose.addEventListener('click', () => closeModal(els.musicModal));

    [els.imageModal, els.letterModal, els.shortcutModal, els.musicModal].forEach(modal => {
      modal.addEventListener('click', event => {
        if (event.target === modal) closeModal(modal);
      });
    });

    document.addEventListener('keydown', handleKeyboard);
  }

  function initBackgroundMotion() {
    if (reduceMotion) return;
    heartTimer = window.setInterval(() => createHeart(), 1900);
    const onVisibility = () => {
      if (document.hidden) {
        window.clearInterval(heartTimer);
      } else {
        window.clearInterval(heartTimer);
        heartTimer = window.setInterval(() => createHeart(), 1900);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
  }

  function init() {
    if (!Number.isFinite(START_MS)) throw new Error('Invalid story start date.');
    if (!MEMORY_DATA.length) throw new Error('Memory data is empty.');
    if (!PLAYLIST.length) throw new Error('Playlist is empty.');

    renderMemories();
    renderReasons();
    renderLetters();
    initReveal();
    initMusic();
    initGlobalInteractions();
    initBackgroundMotion();

    updateCounter();
    counterTimer = window.setInterval(updateCounter, 1000);
    updateScrollProgress();
    updateActiveNav();
  }

  reduceMotionQuery.addEventListener?.('change', event => {
    reduceMotion = event.matches;
    if (reduceMotion && heartTimer) {
      window.clearInterval(heartTimer);
      heartTimer = 0;
    } else if (!reduceMotion && !heartTimer) {
      heartTimer = window.setInterval(() => createHeart(), 1900);
    }
  });

  window.addEventListener('scroll', () => {
    updateScrollProgress();
    updateActiveNav();
  }, { passive: true });

  window.addEventListener('error', event => {
    if (event?.error instanceof Error) console.error('[A&A] Runtime error:', event.error);
  });
  window.addEventListener('unhandledrejection', event => {
    console.error('[A&A] Unhandled promise rejection:', event.reason);
  });

  try {
    init();
  } catch (error) {
    console.error('[A&A] Initialization failed:', error);
    document.body.dataset.initializationError = 'true';
    showToast('A part of the page could not initialize. Please refresh the page.', 5000);
  }

  window.addEventListener('pagehide', () => {
    window.clearInterval(counterTimer);
    window.clearInterval(heartTimer);
    clearObjectUrl();
  }, { once: true });
})();
