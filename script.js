/* ============================================================
   CONFIGURATION
============================================================ */
const GITHUB_RAW_URL = 'https://raw.githubusercontent.com/Makeroad/german-study/main/word.json';
const LS_DATA       = 'de_study_data';
const LS_DATA_TIME  = 'de_study_data_ts';
const LS_WRONG      = 'de_wrong_notes';

/* ============================================================
   DUMMY DATA (GitHub fetch 실패 시 폴백)
============================================================ */
const DUMMY = {
  vocabulary: [
    { id:1,  german:"Hallo",          korean:"안녕하세요",           pronunciation:"할로",      example:{ german:"Hallo, wie geht es dir?",                   korean:"안녕, 어떻게 지내?" } },
    { id:2,  german:"Danke",          korean:"감사합니다",           pronunciation:"당케",      example:{ german:"Danke schön für deine Hilfe!",              korean:"도와줘서 정말 감사해요!" } },
    { id:3,  german:"Entschuldigung", korean:"실례합니다 / 죄송합니다", pronunciation:"엔트슐디궁", example:{ german:"Entschuldigung, wo ist der Bahnhof?",      korean:"실례합니다, 기차역이 어디 있나요?" } },
    { id:4,  german:"Bitte",          korean:"부탁합니다 / 천만에요", pronunciation:"비테",      example:{ german:"Ein Kaffee, bitte.",                        korean:"커피 한 잔 부탁해요." } },
    { id:5,  german:"Wasser",         korean:"물",                  pronunciation:"바서",      example:{ german:"Kann ich bitte ein Glas Wasser haben?",     korean:"물 한 잔 주실 수 있나요?" } },
    { id:6,  german:"Freund",         korean:"친구 (남)",            pronunciation:"프로인트",   example:{ german:"Mein Freund kommt aus Berlin.",              korean:"제 친구는 베를린 출신이에요." } },
    { id:7,  german:"Schön",          korean:"아름다운 / 좋은",       pronunciation:"쉔",        example:{ german:"Das Wetter ist heute sehr schön.",          korean:"오늘 날씨가 정말 좋아요." } },
    { id:8,  german:"Arbeit",         korean:"일 / 직장",            pronunciation:"아르바이트", example:{ german:"Meine Arbeit macht mir Spaß.",               korean:"제 일이 정말 즐거워요." } },
    { id:9,  german:"Essen",          korean:"음식 / 먹다",           pronunciation:"에쎈",      example:{ german:"Das Essen hier ist sehr lecker.",           korean:"여기 음식이 정말 맛있어요." } },
    { id:10, german:"Bahnhof",        korean:"기차역",               pronunciation:"반호프",    example:{ german:"Der Bahnhof ist nicht weit von hier.",      korean:"기차역은 여기서 멀지 않아요." } },
    { id:11, german:"lernen",         korean:"배우다",               pronunciation:"레르넨",    example:{ german:"Ich lerne jeden Tag neue Wörter.",          korean:"나는 매일 새 단어를 배워요." } },
    { id:12, german:"sprechen",       korean:"말하다",               pronunciation:"슈프레헨",  example:{ german:"Sprechen Sie Englisch?",                    korean:"영어를 하실 줄 아세요?" } }
  ],
  conversations: [
    { id:1, title:"카페에서", lines:[
      { speaker:"직원", german:"Guten Morgen! Was darf es sein?",            korean:"좋은 아침이에요! 무엇을 드릴까요?",  role:"other" },
      { speaker:"나",   german:"Ich hätte gerne einen Kaffee, bitte.",       korean:"커피 한 잔 주세요.",               role:"user" },
      { speaker:"직원", german:"Mit Milch und Zucker?",                      korean:"우유와 설탕 넣을까요?",             role:"other" },
      { speaker:"나",   german:"Nur Milch, bitte. Kein Zucker.",             korean:"우유만요. 설탕은 없이요.",          role:"user" },
      { speaker:"직원", german:"Das macht drei Euro fünfzig.",               korean:"3유로 50센트입니다.",               role:"other" },
      { speaker:"나",   german:"Hier, bitte. Behalten Sie das Restgeld.",    korean:"여기요. 거스름돈은 가지세요.",       role:"user" }
    ]},
    { id:2, title:"길 묻기", lines:[
      { speaker:"나",   german:"Entschuldigung, wie komme ich zum Bahnhof?", korean:"실례합니다, 기차역에 어떻게 가나요?", role:"user" },
      { speaker:"행인", german:"Gehen Sie geradeaus und dann links abbiegen.", korean:"직진하다가 왼쪽으로 도세요.",      role:"other" },
      { speaker:"나",   german:"Ist es weit von hier?",                      korean:"여기서 먼가요?",                    role:"user" },
      { speaker:"행인", german:"Nein, nur fünf Minuten zu Fuß.",             korean:"아니요, 걸어서 5분밖에 안 돼요.",   role:"other" },
      { speaker:"나",   german:"Vielen Dank!",                               korean:"정말 감사합니다!",                  role:"user" },
      { speaker:"행인", german:"Kein Problem! Guten Weg!",                   korean:"천만에요! 잘 가세요!",              role:"other" }
    ]},
    { id:3, title:"자기소개", lines:[
      { speaker:"Anna", german:"Hallo! Ich bin Anna. Wie heißen Sie?",       korean:"안녕하세요! 저는 안나예요. 이름이 어떻게 되세요?", role:"other" },
      { speaker:"나",   german:"Ich heiße Min-jun. Ich komme aus Korea.",    korean:"저는 민준이에요. 한국에서 왔어요.",   role:"user" },
      { speaker:"Anna", german:"Oh, interessant! Was machen Sie in Deutschland?", korean:"오, 흥미롭네요! 독일에서 무엇을 하세요?", role:"other" },
      { speaker:"나",   german:"Ich studiere hier Informatik.",               korean:"여기서 컴퓨터공학을 공부하고 있어요.", role:"user" },
      { speaker:"Anna", german:"Wie lange lernen Sie schon Deutsch?",        korean:"독일어를 얼마나 배우셨어요?",         role:"other" },
      { speaker:"나",   german:"Erst seit sechs Monaten.",                   korean:"고작 6개월 됐어요.",                 role:"user" }
    ]}
  ],
  quizzes: [
    { id:1,  type:"fill",     sentence:"Ich ___ aus Korea.",              answer:"komme",  hint:"힌트: '오다'의 1인칭 현재형",          translation:"저는 한국에서 왔어요." },
    { id:2,  type:"multiple", question:"\"감사합니다\"를 독일어로?",        options:["Bitte","Danke","Hallo","Tschüss"],                        answer:1, translation:"Danke" },
    { id:3,  type:"fill",     sentence:"Das ___ hier ist sehr lecker.",  answer:"Essen",  hint:"힌트: '음식'을 뜻하는 명사",             translation:"여기 음식이 정말 맛있어요." },
    { id:4,  type:"multiple", question:"\"안녕히 가세요\"를 독일어로?",    options:["Guten Morgen","Auf Wiedersehen","Entschuldigung","Bitte"], answer:1, translation:"Auf Wiedersehen" },
    { id:5,  type:"fill",     sentence:"Wie ___ du?",                    answer:"heißt",  hint:"힌트: '이름이 ~이다'의 2인칭 현재형",   translation:"너는 이름이 뭐야?" },
    { id:6,  type:"multiple", question:"\"기차역\"을 독일어로?",           options:["Flughafen","Supermarkt","Bahnhof","Krankenhaus"],         answer:2, translation:"Bahnhof" },
    { id:7,  type:"fill",     sentence:"Ich ___ Deutsch seit einem Jahr.", answer:"lerne", hint:"힌트: '배우다'의 1인칭 현재형",          translation:"나는 1년째 독일어를 배우고 있어요." },
    { id:8,  type:"multiple", question:"\"물\"을 독일어로?",               options:["Milch","Bier","Wasser","Saft"],                           answer:2, translation:"Wasser" },
    { id:9,  type:"fill",     sentence:"Das Wetter ist heute sehr ___.", answer:"schön",  hint:"힌트: '좋은, 아름다운'이라는 형용사",    translation:"오늘 날씨가 정말 좋아요." },
    { id:10, type:"multiple", question:"\"실례합니다\"를 독일어로?",       options:["Danke","Bitte","Entschuldigung","Tschüss"],               answer:2, translation:"Entschuldigung" }
  ]
};

/* ============================================================
   STATE
============================================================ */
let DATA = null;

// Vocab
let vCards = [], vIdx = 0, vFlipped = false;
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
  DATA = await loadData();
  initVocab();
  initConv();
  initQuiz();
  initFlipTouch();
  initSwipeGesture();
}

async function loadData() {
  const cached = localStorage.getItem(LS_DATA);
  const ts     = parseInt(localStorage.getItem(LS_DATA_TIME) || '0');
  if (cached && Date.now() - ts < 86_400_000) {
    try {
      setStatus('캐시 데이터', true);
      return JSON.parse(cached);
    } catch {}
  }

  if (GITHUB_RAW_URL) {
    try {
      const res = await fetch(GITHUB_RAW_URL);
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem(LS_DATA,      JSON.stringify(data));
        localStorage.setItem(LS_DATA_TIME, Date.now().toString());
        setStatus('GitHub 최신 데이터', true);
        return data;
      }
    } catch { /* fall through */ }
  }

  setStatus('더미 데이터', false);
  return DUMMY;
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
  vCards   = [...(DATA.vocabulary || [])];
  vIdx     = 0;
  vFlipped = false;
  renderVocabCard();
  updateWrongBadge();
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
  document.getElementById('cf-word').textContent  = c.word   || c.german || '';
  document.getElementById('cb-word').textContent  = c.word   || c.german || '';
  document.getElementById('cb-kr').textContent    = c.korean || c.meaning || '';
  document.getElementById('cb-pron').textContent  = `[${c.pronunciation || ''}]`;
  document.getElementById('cb-ex-de').textContent = (typeof c.example === 'string') ? c.example : (c.example?.german || '');
  document.getElementById('cb-ex-ko').textContent = c.example_translation || c.example?.korean || '';

  const fc = document.getElementById('flashcard');
  fc.style.transform = '';
  fc.classList.remove('flipped');
  vFlipped = false;
}

/* ── Flip ── */
function flipCard() {
  const fc = document.getElementById('flashcard');
  // 인라인 스타일 제거 후 CSS 클래스로만 상태 제어
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

  // 데스크톱 클릭 (touchend에서 이미 처리된 경우 무시)
  overlay.addEventListener('click', () => {
    if (Date.now() - lastTouchFlip > 300) flipCard();
  });
}

/* ── Judge / Reset ── */
function judgeCard(know) {
  const c   = vCards[vIdx];
  const key = c.id || c.word || c.german;

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
        <div class="wn-de">${n.word || n.german || ''}</div>
        <div class="wn-kr">${n.korean || n.meaning || ''} [${n.pronunciation || ''}]</div>
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
    // 오버레이 탭은 flipCard가 처리하므로 스와이프만 추적
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
    // 인라인 스타일 초기화 — CSS 클래스가 transform을 담당
    fc.style.transition = '';
    fc.style.transform  = '';
    document.getElementById('ov-know').style.opacity = 0;
    document.getElementById('ov-dont').style.opacity = 0;
    // 수평 스와이프(60px 이상)만 판정
    if (Math.abs(dx) > Math.abs(dy) * 1.4 && Math.abs(dx) > 60) judgeCard(dx > 0);
  }

  stage.addEventListener('pointerup',     pointerEnd);
  stage.addEventListener('pointercancel', pointerEnd);
}

/* ============================================================
   CONVERSATION
============================================================ */
function initConv() {
  const row   = document.getElementById('topic-row');
  const convs = DATA.conversations || [];
  row.innerHTML = convs.map((c, i) =>
    `<div class="topic-chip ${i === 0 ? 'active' : ''}" onclick="selectTopic(${i})">${c.title}</div>`
  ).join('');
  cTopicIdx = 0; cLineIdx = 0; cRevealed = false;
  if (convs.length) renderConv();
}

function selectTopic(i) {
  document.querySelectorAll('.topic-chip').forEach((c, j) => c.classList.toggle('active', j === i));
  cTopicIdx = i; cLineIdx = 0; cRevealed = false;
  document.getElementById('conv-fb').className = 'conv-fb';
  document.getElementById('conv-input').value = '';
  renderConv();
}

function renderConv() {
  const conv  = DATA.conversations[cTopicIdx];
  const lines = conv.lines;
  const chat  = document.getElementById('chat-wrap');

  let html = '';
  for (let i = 0; i <= Math.min(cLineIdx, lines.length - 1); i++) {
    const ln  = lines[i];
    const cls = ln.role === 'user' ? 'user' : 'other';
    const de  = ln.german || ln.word || '';
    const ko  = ln.korean || '';

    if (i < cLineIdx || cRevealed) {
      html += `
        <div class="bub-row ${cls} anim-in">
          <div class="bub-name">${ln.speaker}</div>
          <div class="bub ${cls}">${de}</div>
          <div class="bub-tr">${ko}</div>
        </div>`;
    } else {
      html += `
        <div class="bub-row ${cls} anim-in">
          <div class="bub-name">${ln.speaker}</div>
          <div class="bub ${cls} hidden-bub">${de}</div>
          <div class="bub-tr">${ko}</div>
        </div>`;
    }
  }
  if (!html) html = '<div class="empty-state" style="margin:auto"><div class="ei">💬</div><div>첫 번째 대사를 맞춰보세요!</div></div>';
  chat.innerHTML = html;
  chat.scrollTop = chat.scrollHeight;

  const done = cLineIdx >= lines.length;
  document.getElementById('conv-input-row').style.display = done ? 'none' : 'flex';
  document.getElementById('conv-hint-row').style.display  = done ? 'none' : 'flex';
  document.getElementById('conv-done').style.display      = done ? 'block' : 'none';
  if (!done) {
    const cur = lines[cLineIdx];
    document.getElementById('conv-input').placeholder = `${cur.speaker}의 독일어 대사를 입력하세요…`;
  }
}

function checkConvAnswer() {
  const conv = DATA.conversations[cTopicIdx];
  if (cLineIdx >= conv.lines.length) return;
  const val = document.getElementById('conv-input').value.trim();
  if (!val) return;

  const cur       = conv.lines[cLineIdx];
  const de        = cur.german || cur.word || '';
  const normalize = s => s.toLowerCase().replace(/[!?,.'";]/g, '').trim();
  const fb        = document.getElementById('conv-fb');

  if (normalize(val) === normalize(de)) {
    fb.className   = 'conv-fb ok';
    fb.textContent = '정답입니다! ';
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
  const len = DATA.conversations[cTopicIdx].lines.length;
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
   QUIZ
============================================================ */
function initQuiz() {
  qItems    = shuffle([...(DATA.quizzes || [])]);
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
    document.getElementById('q-question').textContent    = '퀴즈 데이터가 없습니다.';
    document.getElementById('q-hint').textContent        = '';
    document.getElementById('q-body').innerHTML          = '';
    return;
  }

  document.getElementById('quiz-prog-lbl').textContent = `${qIdx + 1} / ${total}`;

  const q     = qItems[qIdx];
  const badge = document.getElementById('q-type-badge');
  badge.className   = `qtype-badge ${q.type === 'fill' ? 'qtype-fill' : 'qtype-multi'}`;
  badge.textContent = q.type === 'fill' ? '빈칸 채우기' : '4지선다';

  if (q.type === 'fill') {
    document.getElementById('q-question').textContent = q.sentence;
    document.getElementById('q-hint').textContent     = q.hint || '';
    document.getElementById('q-body').innerHTML =
      `<input class="fill-input" id="fill-input" type="text" placeholder="빈칸을 채우세요" autocomplete="off">`;
    document.getElementById('fill-input').addEventListener('keydown', e => {
      if (e.key === 'Enter') submitFill();
    });
    setTimeout(() => document.getElementById('fill-input').focus(), 50);
  } else {
    document.getElementById('q-question').textContent = q.question;
    document.getElementById('q-hint').textContent     = '';
    document.getElementById('q-body').innerHTML = `<div class="options">${
      q.options.map((o, i) =>
        `<button class="opt" onclick="selectOpt(${i})">${o}</button>`
      ).join('')
    }</div>`;
  }

  const card = document.getElementById('quiz-card');
  card.classList.remove('anim-in');
  void card.offsetWidth;
  card.classList.add('anim-in');
}

function submitFill() {
  if (qAnswered) return;
  const q   = qItems[qIdx];
  const inp = document.getElementById('fill-input');
  const val = inp.value.trim();
  if (!val) return;

  const ok = val.toLowerCase() === q.answer.toLowerCase();
  inp.classList.add(ok ? 'ok' : 'err');
  inp.disabled = true;
  showQuizResult(ok, q.answer);
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
