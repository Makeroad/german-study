/* ============================================================
   CONFIGURATION
============================================================ */
const VOCAB_URL   = './word.json';
const CONV_URL    = './conversations.json';
const LS_VOCAB    = 'de_vocab_data';
const LS_VOCAB_TS = 'de_vocab_ts';
const LS_CONV     = 'de_conv_data';
const LS_CONV_TS  = 'de_conv_ts';
const LS_WRONG    = 'de_wrong_notes';

/* ============================================================
   STATE
============================================================ */
let vocabData = [];
let convData  = [];

// Vocab
let vCards = [], vIdx = 0, vFlipped = false;
let activeDay = 'all';
let wrongNotes = {};

// Conv
let cTopicIdx = 0, cLineIdx = 0, cRevealed = false;

// Quiz
let qItems = [], qIdx = 0, qScore = 0, qAnswered = false;

/* ============================================================
   INIT
============================================================ */
async function init() {
  wrongNotes = JSON.parse(localStorage.getItem(LS_WRONG) || '{}');

  const [vocab, conv] = await Promise.all([loadVocabData(), loadConvData()]);
  vocabData = vocab;
  convData  = conv;

  initVocab();
  initConv();
  initQuiz();
  initFlipTouch();
  initSwipeGesture();
}

async function loadVocabData() {
  const cached = localStorage.getItem(LS_VOCAB);
  const ts     = parseInt(localStorage.getItem(LS_VOCAB_TS) || '0');
  if (cached && Date.now() - ts < 86_400_000) {
    try { return JSON.parse(cached).vocabulary || []; } catch {}
  }
  try {
    const res = await fetch(VOCAB_URL);
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem(LS_VOCAB,    JSON.stringify(data));
      localStorage.setItem(LS_VOCAB_TS, Date.now().toString());
      setStatus('최신 데이터', true);
      return data.vocabulary || [];
    }
  } catch {}
  setStatus('단어 오프라인', false);
  return [];
}

async function loadConvData() {
  const cached = localStorage.getItem(LS_CONV);
  const ts     = parseInt(localStorage.getItem(LS_CONV_TS) || '0');
  if (cached && Date.now() - ts < 86_400_000) {
    try { return JSON.parse(cached).conversations || []; } catch {}
  }
  try {
    const res = await fetch(CONV_URL);
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem(LS_CONV,    JSON.stringify(data));
      localStorage.setItem(LS_CONV_TS, Date.now().toString());
      return data.conversations || [];
    }
  } catch {}
  return [];
}

function setStatus(label, ok) {
  const el = document.getElementById('data-status');
  el.textContent = ok ? `✓ ${label}` : `⚠ ${label}`;
  el.style.color = ok ? 'rgba(255,255,255,.75)' : '#FCD34D';
}

/* ============================================================
   NAVIGATION
============================================================ */
function switchTab(name) {
  document.querySelectorAll('.tab').forEach((t, i) =>
    t.classList.toggle('active', ['vocab','conv','quiz'][i] === name));
  document.querySelectorAll('.section').forEach(s =>
    s.classList.toggle('active', s.id === name));
}

function switchVocabTab(name) {
  document.querySelectorAll('.subtab').forEach((t, i) =>
    t.classList.toggle('active', ['cards','notes'][i] === name));
  document.getElementById('vocab-cards-panel').style.display = name === 'cards' ? '' : 'none';
  document.getElementById('vocab-notes-panel').style.display = name === 'notes' ? '' : 'none';
  if (name === 'notes') renderWrongNotes();
}

/* ============================================================
   VOCABULARY
============================================================ */
function initVocab() {
  activeDay = 'all';
  renderDayFilter();
  applyDayFilter();
  updateWrongBadge();
}

function renderDayFilter() {
  const days = [...new Set(vocabData.map(v => v.day))].sort((a, b) => a - b);
  const container = document.getElementById('day-filter');
  container.innerHTML =
    `<button class="day-btn active" onclick="setDay('all')">전체</button>` +
    days.map(d => `<button class="day-btn" onclick="setDay(${d})">Day ${d}</button>`).join('');
}

function setDay(day) {
  activeDay = day;
  document.querySelectorAll('.day-btn').forEach(b => {
    const match = day === 'all' ? b.textContent === '전체' : b.textContent === `Day ${day}`;
    b.classList.toggle('active', match);
  });
  applyDayFilter();
}

function applyDayFilter() {
  vCards   = activeDay === 'all' ? [...vocabData] : vocabData.filter(v => v.day === activeDay);
  vIdx     = 0;
  vFlipped = false;
  renderVocabCard();
}

function renderVocabCard() {
  const total = vCards.length;
  document.getElementById('vp-fill').style.width = total ? `${(vIdx / total) * 100}%` : '0%';
  document.getElementById('vp-text').textContent  = `${vIdx} / ${total}`;

  const done    = document.getElementById('vocab-done');
  const stage   = document.getElementById('card-stage');
  const swipeBt = document.getElementById('swipe-btns');

  if (vIdx >= total) {
    done.style.display    = 'block';
    stage.style.display   = 'none';
    swipeBt.style.display = 'none';
    return;
  }

  done.style.display    = 'none';
  stage.style.display   = 'block';
  swipeBt.style.display = 'flex';

  const c = vCards[vIdx];
  document.getElementById('cf-word').textContent  = c.word || '';
  document.getElementById('cb-word').textContent  = c.word || '';
  document.getElementById('cb-kr').textContent    = c.meaning || '';
  document.getElementById('cb-pron').textContent  = `[${c.pronunciation || ''}]`;
  document.getElementById('cb-ex-de').textContent = c.example || '';
  document.getElementById('cb-ex-ko').textContent = c.example_translation || '';

  const fc = document.getElementById('flashcard');
  fc.style.transform = '';
  fc.classList.remove('flipped');
  vFlipped = false;
}

/* ── Flip ── */
function flipCard() {
  const fc = document.getElementById('flashcard');
  fc.style.transform = '';
  fc.classList.toggle('flipped');
  vFlipped = !vFlipped;
}

function initFlipTouch() {
  let startX, startY, lastTouchFlip = 0;
  const overlay = document.getElementById('card-tap-overlay');

  overlay.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  overlay.addEventListener('touchend', e => {
    const dx = Math.abs(e.changedTouches[0].clientX - startX);
    const dy = Math.abs(e.changedTouches[0].clientY - startY);
    if (dx < 10 && dy < 10) {
      e.preventDefault();
      lastTouchFlip = Date.now();
      flipCard();
    }
  });

  // click은 모바일 터치 후 합성 이벤트 방지용으로만 사용 (데스크톱은 pointerEnd에서 처리)
  overlay.addEventListener('click', e => {
    if (e.pointerType !== 'touch' && e.pointerType !== '') return;
    if (Date.now() - lastTouchFlip > 300) flipCard();
  });
}

/* ── Judge / Reset ── */
function judgeCard(know) {
  const c   = vCards[vIdx];
  const key = c.word || '';

  if (!know) {
    if (!wrongNotes[key]) wrongNotes[key] = { ...c, count: 0 };
    wrongNotes[key].count++;
  } else if (wrongNotes[key]) {
    wrongNotes[key].count = Math.max(0, wrongNotes[key].count - 1);
    if (wrongNotes[key].count === 0) delete wrongNotes[key];
  }
  localStorage.setItem(LS_WRONG, JSON.stringify(wrongNotes));
  updateWrongBadge();

  const ov = document.getElementById(know ? 'ov-know' : 'ov-dont');
  ov.style.opacity = '1';
  setTimeout(() => { ov.style.opacity = '0'; vIdx++; renderVocabCard(); }, 380);
}

function resetVocab() { vIdx = 0; renderVocabCard(); }

function updateWrongBadge() {
  document.getElementById('wrong-badge').textContent = Object.keys(wrongNotes).length;
}

function renderWrongNotes() {
  const el    = document.getElementById('wn-list');
  const notes = Object.values(wrongNotes).sort((a, b) => b.count - a.count);
  if (!notes.length) {
    el.innerHTML = '<div class="empty-state"><div class="ei">🎯</div><div>아직 오답이 없어요!</div></div>';
    return;
  }
  el.innerHTML = notes.map(n => `
    <div class="wn-item">
      <div>
        <div class="wn-de">${n.word || ''}</div>
        <div class="wn-kr">${n.meaning || ''} [${n.pronunciation || ''}]</div>
      </div>
      <div class="wn-cnt">틀린 횟수 ${n.count}</div>
    </div>`).join('');
}

function clearWrongNotes() {
  if (!Object.keys(wrongNotes).length) return;
  wrongNotes = {};
  localStorage.removeItem(LS_WRONG);
  updateWrongBadge();
  renderWrongNotes();
}

/* ── Swipe gesture ── */
function initSwipeGesture() {
  let sx = 0, sy = 0, drag = false;
  const stage = document.getElementById('card-stage');

  stage.addEventListener('pointerdown', e => {
    if (e.target.closest('button')) return;
    if (e.pointerType === 'touch') return; // touch는 initFlipTouch에서 처리
    sx = e.clientX; sy = e.clientY; drag = true;
    stage.setPointerCapture(e.pointerId);
  });

  stage.addEventListener('pointermove', e => {
    if (!drag) return;
    const dx = e.clientX - sx;
    const fc = document.getElementById('flashcard');
    const base = vFlipped ? 'rotateY(180deg) ' : '';
    fc.style.transition = 'none';
    fc.style.transform  = `${base}translateX(${dx * 0.4}px) rotate(${dx * 0.025}deg)`;
    document.getElementById('ov-know').style.opacity = dx > 20 ? Math.min((dx - 20) / 90, 1) : 0;
    document.getElementById('ov-dont').style.opacity = dx < -20 ? Math.min((-dx - 20) / 90, 1) : 0;
  });

  function pointerEnd(e) {
    if (!drag) return;
    drag = false;
    const dx = e.clientX - sx;
    const dy = e.clientY - sy;
    const fc = document.getElementById('flashcard');
    fc.style.transition = '';
    fc.style.transform  = '';
    document.getElementById('ov-know').style.opacity = 0;
    document.getElementById('ov-dont').style.opacity = 0;
    if (Math.abs(dx) > Math.abs(dy) * 1.4 && Math.abs(dx) > 60) {
      judgeCard(dx > 0);
    } else if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
      flipCard(); // 탭(클릭) → 카드 뒤집기
    }
  }

  stage.addEventListener('pointerup',     pointerEnd);
  stage.addEventListener('pointercancel', pointerEnd);
}

/* ============================================================
   CONVERSATION
============================================================ */
function initConv() {
  const row = document.getElementById('topic-row');
  row.innerHTML = convData.map((c, i) =>
    `<div class="topic-chip ${i === 0 ? 'active' : ''}" onclick="selectTopic(${i})">
      <span class="topic-id">${c.id}</span>${c.title}
    </div>`
  ).join('');
  cTopicIdx = 0; cLineIdx = 0; cRevealed = false;
  if (convData.length) renderConv();
}

function selectTopic(i) {
  document.querySelectorAll('.topic-chip').forEach((c, j) => c.classList.toggle('active', j === i));
  cTopicIdx = i; cLineIdx = 0; cRevealed = false;
  document.getElementById('conv-fb').className = 'conv-fb';
  document.getElementById('conv-input').value  = '';
  renderConv();
}

function renderConv() {
  const conv  = convData[cTopicIdx];
  const lines = conv.lines;
  const chat  = document.getElementById('chat-wrap');

  let html = '';
  for (let i = 0; i <= Math.min(cLineIdx, lines.length - 1); i++) {
    const ln  = lines[i];
    const cls = ln.speaker === 'A' ? 'user' : 'other';
    const de  = ln.german || '';
    const ko  = ln.korean || '';
    const pr  = ln.pronunciation || '';

    const bubContent = `${de}<div class="bub-pron">${pr}</div>`;
    const revealed   = i < cLineIdx || cRevealed;

    html += `
      <div class="bub-row ${cls} anim-in">
        <div class="bub-name">${ln.speaker}</div>
        <div class="bub ${cls}${revealed ? '' : ' hidden-bub'}">${bubContent}</div>
        <div class="bub-tr">${ko}</div>
      </div>`;
  }

  if (!html) html = '<div class="empty-state" style="margin:auto"><div class="ei">💬</div><div>첫 번째 대사를 맞춰보세요!</div></div>';
  chat.innerHTML = html;
  chat.scrollTop = chat.scrollHeight;

  const done = cLineIdx >= lines.length;
  document.getElementById('conv-input-row').style.display = done ? 'none' : 'flex';
  document.getElementById('conv-hint-row').style.display  = done ? 'none' : 'flex';
  document.getElementById('conv-done').style.display      = done ? 'block' : 'none';
  if (!done) {
    document.getElementById('conv-input').placeholder =
      `${lines[cLineIdx].speaker}의 독일어 대사를 입력하세요…`;
  }
}

function checkConvAnswer() {
  const conv = convData[cTopicIdx];
  if (cLineIdx >= conv.lines.length) return;
  const val = document.getElementById('conv-input').value.trim();
  if (!val) return;

  const cur       = conv.lines[cLineIdx];
  const de        = cur.german || '';
  const normalize = s => s.toLowerCase().replace(/[!?,.'";]/g, '').trim();
  const fb        = document.getElementById('conv-fb');

  if (normalize(val) === normalize(de)) {
    fb.className   = 'conv-fb ok';
    fb.textContent = '정답입니다!';
    cRevealed      = true;
    renderConv();
  } else {
    fb.className   = 'conv-fb err';
    fb.textContent = `틀렸어요 — 정답: "${de}"`;
    const inp = document.getElementById('conv-input');
    inp.classList.remove('do-shake');
    void inp.offsetWidth;
    inp.classList.add('do-shake');
  }
}

function revealConvLine() {
  cRevealed = true;
  document.getElementById('conv-fb').className = 'conv-fb';
  renderConv();
}

function nextConvLine() {
  const len = convData[cTopicIdx].lines.length;
  cRevealed = false;
  cLineIdx  = Math.min(cLineIdx + 1, len);
  document.getElementById('conv-fb').className = 'conv-fb';
  document.getElementById('conv-input').value  = '';
  renderConv();
}

function restartConv() { selectTopic(cTopicIdx); }

document.getElementById('conv-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') checkConvAnswer();
});

/* ============================================================
   QUIZ (단어장 기반 자동 생성)
============================================================ */
function buildQuizItems() {
  if (vocabData.length < 4) return [];
  const pool   = shuffle([...vocabData]).slice(0, Math.min(10, vocabData.length));
  return pool.map(q => {
    const wrongs = shuffle(vocabData.filter(v => v.word !== q.word)).slice(0, 3).map(v => v.meaning);
    const opts   = shuffle([q.meaning, ...wrongs]);
    return {
      type: 'multiple',
      question: `"${q.word}"의 뜻은?`,
      options: opts,
      answer: opts.indexOf(q.meaning),
      translation: q.meaning
    };
  });
}

function initQuiz() {
  qItems    = buildQuizItems();
  qIdx      = 0;
  qScore    = 0;
  qAnswered = false;
  document.getElementById('quiz-card').style.display   = 'block';
  document.getElementById('quiz-result-lbl').className = 'quiz-result-lbl';
  document.getElementById('quiz-nav').style.display    = 'flex';
  document.getElementById('quiz-final').style.display  = 'none';
  renderQuiz();
}

function renderQuiz() {
  const total = qItems.length;
  document.getElementById('quiz-score-lbl').textContent  = `${qScore}점`;
  document.getElementById('quiz-result-lbl').className   = 'quiz-result-lbl';
  document.getElementById('quiz-next-btn').style.display = 'none';
  qAnswered = false;

  if (!total) {
    document.getElementById('quiz-prog-lbl').textContent = '0 / 0';
    document.getElementById('q-type-badge').textContent  = '';
    document.getElementById('q-question').textContent    = '단어 데이터가 없습니다.';
    document.getElementById('q-hint').textContent        = '';
    document.getElementById('q-body').innerHTML          = '';
    return;
  }

  document.getElementById('quiz-prog-lbl').textContent = `${qIdx + 1} / ${total}`;

  const q = qItems[qIdx];
  const badge = document.getElementById('q-type-badge');
  badge.className   = 'qtype-badge qtype-multi';
  badge.textContent = '4지선다';

  document.getElementById('q-question').textContent = q.question;
  document.getElementById('q-hint').textContent     = '';
  document.getElementById('q-body').innerHTML = `<div class="options">${
    q.options.map((o, i) =>
      `<button class="opt" onclick="selectOpt(${i})">${o}</button>`
    ).join('')
  }</div>`;

  const card = document.getElementById('quiz-card');
  card.classList.remove('anim-in');
  void card.offsetWidth;
  card.classList.add('anim-in');
}

function selectOpt(i) {
  if (qAnswered) return;
  qAnswered = true;
  const q = qItems[qIdx];
  document.querySelectorAll('.opt').forEach((b, j) => {
    b.disabled = true;
    if (j === q.answer) b.classList.add('ok');
    if (j === i && i !== q.answer) b.classList.add('err');
  });
  showQuizResult(i === q.answer, q.options[q.answer]);
}

function showQuizResult(ok, answer) {
  qAnswered = true;
  if (ok) qScore += 10;
  document.getElementById('quiz-score-lbl').textContent = `${qScore}점`;

  const lbl = document.getElementById('quiz-result-lbl');
  lbl.className   = `quiz-result-lbl ${ok ? 'ok' : 'err'}`;
  lbl.textContent = ok ? '정답! +10점 🎉' : `오답 — 정답: ${answer}`;

  document.getElementById('quiz-next-btn').style.display = 'block';
}

function skipQuiz() { advance(); }
function nextQuiz()  { advance(); }

function advance() {
  if (qIdx < qItems.length - 1) { qIdx++; renderQuiz(); }
  else showFinalScore();
}

function showFinalScore() {
  const max = qItems.length * 10;
  const pct = Math.round((qScore / max) * 100);
  document.getElementById('quiz-card').style.display   = 'none';
  document.getElementById('quiz-result-lbl').className = 'quiz-result-lbl';
  document.getElementById('quiz-nav').style.display    = 'none';
  document.getElementById('quiz-final').style.display  = 'block';
  document.getElementById('final-score').textContent   = qScore;
  document.getElementById('final-max').textContent     = `/ ${max}점`;
  document.getElementById('final-msg').textContent     =
    pct >= 90 ? '완벽해요! 🏆' :
    pct >= 70 ? '잘 했어요! 👍' :
    pct >= 50 ? '조금만 더 연습해요! 💪' : '다시 도전해봐요! 🔄';
}

function resetQuiz() { initQuiz(); }

/* ============================================================
   UTILS
============================================================ */
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/* ── Start ── */
init();
