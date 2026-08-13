const startDate = new Date('2025-05-10T00:00:00+05:30');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const progress = $('#progress');
const revealItems = $$('.reveal');
const navLinks = $$('.nav a');
const imageModal = $('#imageModal');
const letterModal = $('#letterModal');
const modalImage = $('#modalImage');
const modalCaption = $('#modalCaption');
const toast = $('#toast');
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

function updateProgress() {
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0}%`;
}

function updateNav() {
  const sections = $$('main section[id]');
  const y = window.scrollY + window.innerHeight * 0.32;
  const navMap = { home: 'story', gallery: 'moments' };
  let active = 'story';
  sections.forEach(section => {
    if (y >= section.offsetTop) active = navMap[section.id] || section.id;
  });
  navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${active}`));
}

function revealOnScroll() {
  if ('IntersectionObserver' in window && !reduceMotion) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('visible'));
  }
}

function updateCounter() {
  const now = new Date();
  const diff = Math.max(0, now - startDate);
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  $('#daysTogether').textContent = days.toString();
  $('#counterHours').textContent = String(hours).padStart(2, '0');
  $('#counterMinutes').textContent = String(minutes).padStart(2, '0');
  $('#counterSeconds').textContent = String(seconds).padStart(2, '0');
}

function createHeart(symbol = '♥', countGuard = true) {
  if (countGuard && $$('.floating-heart').length > 16) return;
  const heart = document.createElement('span');
  heart.className = 'floating-heart';
  heart.textContent = symbol;
  heart.style.left = `${Math.random() * 100}vw`;
  heart.style.fontSize = `${10 + Math.random() * 20}px`;
  heart.style.setProperty('--drift', `${-40 + Math.random() * 80}px`);
  heart.style.animationDuration = `${6 + Math.random() * 5}s`;
  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 12000);
}

function openImage(src, caption) {
  modalImage.src = src;
  modalImage.alt = caption || 'Memory';
  modalCaption.textContent = caption || '';
  imageModal.classList.add('open');
  imageModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

function closeImage() {
  imageModal.classList.remove('open');
  imageModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  setTimeout(() => {
    if (!imageModal.classList.contains('open')) modalImage.src = '';
  }, 280);
}

function openLetter(type) {
  const letters = {
    sad: {
      title: 'When you are sad',
      body: 'You do not have to turn every bad day into a good one. You can just have the bad day.\n\nAnd somewhere inside it, please remember that there is someone who is always cheering for you, always thinking about you, and always ready to listen. ❤️'
    },
    miss: {
      title: 'When you miss me',
      body: 'Imagine I am sitting beside you, probably stealing a little bit of your space and smiling at you.\n\nUntil the next time we meet, keep one tiny hug reserved for me. I am keeping one reserved for you too. 💗'
    },
    sleep: {
      title: "When you can't sleep",
      body: 'Close your eyes. Breathe slowly. Let today be done.\n\nTomorrow gets another chance, and so do we. For tonight, just rest. You are loved. 🌙'
    },
    smile: {
      title: 'When you need a smile',
      body: 'Emergency reminder: you are ridiculously cute. This message is legally binding and cannot be appealed.\n\nAlso, yes, I am smiling while writing this. 😌'
    }
  };
  const letter = letters[type];
  if (!letter) return;
  $('#letterTitle').textContent = letter.title;
  $('#letterBody').textContent = letter.body;
  letterModal.classList.add('open');
  letterModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

function closeLetter() {
  letterModal.classList.remove('open');
  letterModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

$$('.memory-card, .gallery-item').forEach(card => {
  card.addEventListener('click', event => {
    if (event.target.closest('button.photo-open') || card.classList.contains('gallery-item')) {
      const src = card.dataset.gallery;
      const caption = card.dataset.caption;
      if (src) openImage(src, caption);
    }
  });
});

$$('.photo-open').forEach(button => {
  button.addEventListener('click', event => {
    event.stopPropagation();
    const card = button.closest('.memory-card');
    if (card) openImage(card.dataset.gallery, card.dataset.caption);
  });
});

$('#modalClose').addEventListener('click', closeImage);
imageModal.addEventListener('click', event => {
  if (event.target === imageModal) closeImage();
});
$('#letterClose').addEventListener('click', closeLetter);
letterModal.addEventListener('click', event => {
  if (event.target === letterModal) closeLetter();
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    closeImage();
    closeLetter();
  }
});

const reasonMessages = [
  'Because your smile can make an ordinary moment feel important.',
  'Because the way you care makes me feel seen.',
  'Because the little things you do become my favorite details.',
  'Because with you, quiet moments do not feel empty. They feel peaceful.'
];
$$('.reason-card').forEach((card, index) => {
  card.addEventListener('click', () => {
    $('#reasonNote').textContent = reasonMessages[index];
  });
});

$$('.letter-card').forEach(card => {
  card.addEventListener('click', () => openLetter(card.dataset.letter));
});

$('#surpriseBtn').addEventListener('click', () => {
  const messages = [
    'Plot twist: I would choose you again. ❤️',
    'Officially my favorite person. No appeals accepted. 😌💗',
    'Somewhere between May 10 and now, you became home. 🥹',
    'Next chapter unlocked: even more memories. ✨'
  ];
  showToast(messages[Math.floor(Math.random() * messages.length)]);
  for (let i = 0; i < 8; i++) createHeart(i % 2 ? '♡' : '♥', false);
});

$('#ambientHeartBtn').addEventListener('click', () => {
  for (let i = 0; i < 5; i++) createHeart(i % 2 ? '♡' : '♥', false);
  showToast('A little extra love, just because. 💗');
});

let secretTaps = 0;
$('#secretTrigger').addEventListener('click', () => {
  secretTaps += 1;
  if (secretTaps < 5) {
    showToast(`${5 - secretTaps} more little secret tap${5 - secretTaps === 1 ? '' : 's'}... 👀`);
    return;
  }
  secretTaps = 0;
  showToast('You found the tiny secret: I would still choose you. ❤️');
  for (let i = 0; i < 14; i++) createHeart(i % 3 === 0 ? '✦' : '♥', false);
});

$('#restartBtn').addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

const audio = $('#audioPlayer');
const defaultSong = 'our-song.mp3';
const playBtn = $('#playBtn');
const seekBar = $('#seekBar');
const currentTime = $('#currentTime');
const duration = $('#duration');
const uploadBtn = $('#musicUploadBtn');
const musicFile = $('#musicFile');
const musicTrackName = $('#musicTrackName');
const musicHint = $('#musicHint');
const musicArt = $('#musicArt');
const miniPlayer = $('#miniPlayer');
const miniPlay = $('#miniPlay');
const miniTrack = $('#miniTrack');
const miniState = $('#miniState');
const miniDisc = $('#miniDisc');
let selectedObjectUrl = null;
let defaultSongFailed = false;

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}

function setPlayerVisibility(show) {
  miniPlayer.classList.toggle('show', show);
  miniPlayer.setAttribute('aria-hidden', String(!show));
}

function setPlayingState(isPlaying) {
  const icon = isPlaying ? '❚❚' : '▶';
  const label = isPlaying ? 'Pause our song' : 'Play our song';
  playBtn.textContent = icon;
  miniPlay.textContent = icon;
  playBtn.setAttribute('aria-label', label);
  miniPlay.setAttribute('aria-label', label);
  miniState.textContent = isPlaying ? 'Now playing' : (audio.currentTime > 0 ? 'Paused' : 'Ready');
  musicArt.classList.toggle('playing', isPlaying);
  miniDisc.classList.toggle('playing', isPlaying);
}

function markDefaultSongReady() {
  defaultSongFailed = false;
  musicTrackName.textContent = 'our-song.mp3';
  miniTrack.textContent = 'our-song.mp3';
  musicHint.textContent = 'Your song is ready. Press play whenever you’re ready. 🎵';
  setPlayerVisibility(true);
}

function markDefaultSongFailed() {
  defaultSongFailed = true;
  musicTrackName.textContent = 'our-song.mp3 not found';
  miniTrack.textContent = 'Song not found';
  musicHint.textContent = 'Put our-song.mp3 beside index.html, then refresh the page. 🎵';
  setPlayerVisibility(false);
  setPlayingState(false);
}

async function toggleMusic() {
  if (!selectedObjectUrl && (defaultSongFailed || audio.error)) {
    showToast('our-song.mp3 could not be loaded. Put it beside index.html and refresh. 🎵');
    return;
  }
  if (!selectedObjectUrl && audio.readyState < HTMLMediaElement.HAVE_METADATA) {
    showToast('The song is still loading. Try again in a moment. 🎵');
    return;
  }
  try {
    if (audio.paused) {
      await audio.play();
    } else {
      audio.pause();
    }
  } catch {
    showToast('The browser could not start playback. Tap play again.');
  }
}

function useAudioFile(file) {
  if (!file) return;
  const looksAudio = file.type.startsWith('audio/') || /\.(mp3|wav|m4a|aac|ogg|oga|flac|webm)$/i.test(file.name);
  if (!looksAudio) {
    showToast('Please choose an audio file. 🎵');
    return;
  }
  if (selectedObjectUrl) URL.revokeObjectURL(selectedObjectUrl);
  selectedObjectUrl = URL.createObjectURL(file);
  defaultSongFailed = false;
  audio.src = selectedObjectUrl;
  audio.load();
  musicTrackName.textContent = file.name;
  miniTrack.textContent = file.name;
  musicHint.textContent = 'Your song is loaded locally in this browser — nothing was uploaded. ✨';
  setPlayerVisibility(true);
  audio.play().then(() => setPlayingState(true)).catch(() => {
    setPlayingState(false);
    showToast('The file loaded. Press play to start it. 🎵');
  });
}

playBtn.addEventListener('click', toggleMusic);
miniPlay.addEventListener('click', toggleMusic);
uploadBtn.addEventListener('click', () => musicFile.click());
musicFile.addEventListener('change', event => useAudioFile(event.target.files?.[0]));

audio.addEventListener('loadedmetadata', () => {
  duration.textContent = formatTime(audio.duration);
  if (!selectedObjectUrl) markDefaultSongReady();
});
audio.addEventListener('canplay', () => {
  if (!selectedObjectUrl) markDefaultSongReady();
  setPlayerVisibility(true);
});
audio.addEventListener('play', () => setPlayingState(true));
audio.addEventListener('pause', () => setPlayingState(false));
audio.addEventListener('timeupdate', () => {
  currentTime.textContent = formatTime(audio.currentTime);
  seekBar.value = audio.duration ? String((audio.currentTime / audio.duration) * 100) : '0';
});
audio.addEventListener('ended', () => {
  setPlayingState(false);
  seekBar.value = '0';
  currentTime.textContent = '0:00';
});
audio.addEventListener('error', () => {
  if (!selectedObjectUrl) markDefaultSongFailed();
  else {
    setPlayingState(false);
    showToast('The selected audio file could not be played. Please choose another file.');
  }
});
seekBar.addEventListener('input', () => {
  if (Number.isFinite(audio.duration) && audio.duration > 0) {
    audio.currentTime = (Number(seekBar.value) / 100) * audio.duration;
  }
});

musicTrackName.textContent = 'our-song.mp3';
miniTrack.textContent = 'our-song.mp3';
setPlayingState(false);
audio.load();

window.addEventListener('scroll', () => {
  updateProgress();
  updateNav();
}, { passive: true });

updateProgress();
updateNav();
revealOnScroll();
updateCounter();
setInterval(updateCounter, 1000);
if (!reduceMotion) setInterval(() => createHeart(), 1600);
