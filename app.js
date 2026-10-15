"use strict";

// ==================== CONFIGURACIÓN MULTI-PROFESOR ====================
const scriptsProfesores = {
  "sergiojodral": "https://script.google.com/macros/s/AKfycbxVBtUtfIN50qY2bCz9SPfh7QvFLlCI9I-vt_pMrjtOaBnMf5vmiGrwn9YwmGrSxdoBvA/exec",
  "israeladamuz": "https://script.google.com/macros/s/AKfycbxJf4nyOdlPUY6f-aVgIeUxQtRNm7RFX28JgFtyO49_FbrjZ2nkydhakQu0sHIHbEBD/exec"
};

const parametrosURL = new URLSearchParams(window.location.search);
const profeAsignado = parametrosURL.get('profe');

// Si el alumno entra sin ?profe=... o pone un nombre que no existe, esto quedará vacío
const REGISTRATION_ENDPOINT = scriptsProfesores[profeAsignado];

// ==================== EDITABLE BANK ====================
// Vocabulary creates more than 120 distinct challenge objects (translation and scramble forms).
const vocabulary = {
  numbers: [["one","uno"],["twelve","doce"],["nineteen","diecinueve"],["twenty-one","veintiuno"],["twenty-nine","veintinueve"],["forty","cuarenta"],["fifty","cincuenta"],["one hundred","cien"],["one thousand","mil"],["one hundred thousand","cien mil"],["one million","un millón"],["first","primero"],["third","tercero"],["eighth","octavo"],["twenty-first","vigésimo primero"],["thirtieth","trigésimo"],["fortieth","cuadragésimo"],["hundredth","centésimo"],["thousandth","milésimo"],["millionth","millonésimo"]],
  operations: [["addition","suma"],["sum","suma"],["subtraction","resta"],["difference","diferencia"],["product","producto"],["multiplication","multiplicación"],["division","división"],["quotient","cociente"],["plus","más"],["minus","menos"],["times","por"],["multiplied by","multiplicado por"],["divided by","dividido por"],["equals","igual"],["is equal to","es igual a"],["is approximately equal to","es aproximadamente igual a"],["is greater than","es mayor que"],["is less than","es menor que"],["is greater than or equal to","es mayor o igual que"],["is less than or equal to","es menor o igual que"]],
  divisibility: [["natural number","número natural"],["integer","número entero"],["divisor","divisor"],["multiple","múltiplo"],["divisibility criteria","criterios de divisibilidad"],["prime number","número primo"],["composite number","número compuesto"],["decompose a number into prime factors","descomponer un número en factores primos"],["break a number down into prime factors","descomponer un número en factores primos"],["lowest common multiple","mínimo común múltiplo"],["greatest common divisor","máximo común divisor"]],
  fractions: [["fraction","fracción"],["numerator","numerador"],["denominator","denominador"],["equivalent fractions","fracciones equivalentes"],["simplify","simplificar"],["irreducible fraction","fracción irreducible"],["over","partido por"],["two thirds","dos tercios"],["a half","un medio"],["three halves","tres medios"],["two fourths","dos cuartos"],["two fifths","dos quintos"],["to compare fractions","comparar fracciones"],["order fractions","ordenar fracciones"]],
  geometry: [["geometry","geometría"],["area","área"],["perimeter","perímetro"],["angle","ángulo"],["line","recta"],["ray","semirrecta"],["segment","segmento"],["acute angle","ángulo agudo"],["obtuse angle","ángulo obtuso"],["right angle","ángulo recto"],["straight angle","ángulo llano"],["side","lado"],["polygon","polígono"],["quadrilateral","cuadrilátero"],["equilateral triangle","triángulo equilátero"],["isosceles triangle","triángulo isósceles"],["scalene triangle","triángulo escaleno"],["circumference","circunferencia"],["circle","círculo"],["rectangle","rectángulo"],["square","cuadrado"],["rhombus","rombo"],["rhomboid","romboide"],["trapezium","trapecio"],["trapezoid","trapezoide"],["regular polygon","polígono regular"],["pentagon","pentágono"],["hexagon","hexágono"],["heptagon","heptágono"],["octagon","octógono"],["nonagon","nonágono"],["decagon","decágono"],["length of circumference","longitud de la circunferencia"]],
  percentages: [["percentage","porcentaje"],["percent","por ciento"],["percentage increases","aumentos porcentuales"],["percentage decreases","disminuciones porcentuales"],["discount","descuento"],["tax","impuesto"],["surcharge","recargo"]]
};
const levels = [
  ["Warm Up","Build confidence with essential mathematical vocabulary.","green"], ["Match It","Connect English mathematics with Spanish meaning.","blue"], ["Math Puzzle","Solve expressions, word puzzles, and ordered sequences.","purple"], ["Language Detective","Inspect mathematical statements for clues and mistakes.","orange"], ["Final Challenge","Mix every skill and become a Math English Master.","red"]
];
const sessionSlots = [
  [["numbers",["mc","scramble"]],["operations",["mc","scramble"]],["geometry",["mc","scramble"]],["fractions",["mc","scramble"]],["percentages",["mc","scramble"]]],
  [["divisibility",["matching"]]],
  [["operations",["expression"]],["numbers",["sort"]],["fractions",["scramble","mc"]],["divisibility",["scramble","mc"]],["geometry",["sort","mc"]],["percentages",["expression","mc"]]],
  [["geometry",["mistake"]],["operations",["detective"]],["divisibility",["mistake"]],["fractions",["detective"]],["percentages",["detective"]],["numbers",["mistake"]]],
  [["numbers",["mc"]],["numbers",["scramble","mc"]],["operations",["expression"]],["operations",["scramble","mc"]],["operations",["detective"]],["divisibility",["mc"]],["fractions",["sort","mc"]],["geometry",["matching"]],["geometry",["mc"]],["geometry",["scramble","mc"]],["percentages",["mc"]],["percentages",["scramble","mc"]]]
];
function choice(id, category, type, question, options, answer, difficulty = 2) { return { id, category, type, difficulty, question, data:{ options }, answer }; }
function makeBank() {
  const bank = [];
  Object.entries(vocabulary).forEach(([category, pairs]) => {
    pairs.forEach(([english, spanish], index) => {
      const distractors = pairs.filter(([, value]) => value !== spanish).map(([, value]) => value).slice(0, 3);
      bank.push(choice(`${category}_mc_${index}`, category, "mc", `What does “${english}” mean?`, [spanish, ...distractors], 0, index < 7 ? 1 : 2));
      const word = english.replace(/[^a-z]/gi, "");
      if (word.length >= 3 && word.length <= 14) bank.push({ id:`${category}_scramble_${index}`, category, type:"scramble", difficulty:2, question:"Unscramble this mathematical word.", data:{ word, hint:spanish }, answer:word.toLowerCase() });
    });
    for (let index = 0; index + 3 < pairs.length; index += 4) bank.push({ id:`${category}_match_${index}`, category, type:"matching", difficulty:2, question:"Match every English word with its Spanish meaning.", data:{ pairs:pairs.slice(index, index + 4).map(([english, spanish]) => ({ english, spanish })) }, answer:"all pairs" });
  });
  const expressions = [
    ["operations","8 ______ 2 = 16",["plus","times","minus","divided by"],"times"],["operations","20 ______ 4 = 5",["plus","minus","times","divided by"],"divided by"],["operations","7 ______ 4 = 11",["plus","minus","times","divided by"],"plus"],["operations","The number 12 is ______ than 8.",["less than","greater than","equal to","approximately equal to"],"greater than"],["percentages","A price goes down by 20%. This is a percentage ______.",["increase","decrease","tax","surcharge"],"decrease"],["percentages","A price goes up by 10%. This is a percentage ______.",["decrease","increase","discount","division"],"increase"]
  ];
  expressions.forEach(([category, question, options, answer], index) => bank.push(choice(`${category}_expression_${index}`, category, "expression", question, options, options.indexOf(answer), 2)));
  const sorts = [
    ["numbers","Order the numbers from smallest to largest.",["12","3","8","5"],["3","5","8","12"]],["numbers","Order these ordinal numbers.",["fourth","first","third","second"],["first","second","third","fourth"]],["fractions","Order these fractions from smallest to largest.",["three halves","a half","two thirds","two fifths"],["two fifths","a half","two thirds","three halves"]],["geometry","Order these polygons by number of sides.",["octagon","pentagon","heptagon","hexagon"],["pentagon","hexagon","heptagon","octagon"]],["geometry","Order these angles from smallest to largest.",["right angle","acute angle","straight angle","obtuse angle"],["acute angle","right angle","obtuse angle","straight angle"]]
  ];
  sorts.forEach(([category, question, items, answer], index) => bank.push({ id:`${category}_sort_${index}`, category, type:"sort", difficulty:2, question, data:{ items }, answer }));
  const statements = [
    ["numbers","Twenty-first is written as 21st.",true,"Twenty-first is written as 21st."],["numbers","Forty is written as fourty.",false,"Forty is written with no ‘u’: forty."],["operations","Three times four equals twelve.",true,"Three times four equals twelve."],["operations","Ten divided by two equals seven.",false,"Ten divided by two equals five."],["divisibility","A prime number has exactly two divisors.",true,"A prime number has exactly two divisors."],["divisibility","Twelve is a divisor of three.",false,"Three is a divisor of twelve."],["fractions","Two thirds equals 2/3.",true,"Two thirds equals 2/3."],["fractions","A denominator is the top number of a fraction.",false,"The denominator is the bottom number."],["geometry","A square has four equal sides.",true,"A square has four equal sides."],["geometry","An acute angle is greater than a right angle.",false,"An acute angle is less than a right angle."],["percentages","A discount makes a price lower.",true,"A discount makes a price lower."],["percentages","Tax is a percentage decrease.",false,"Tax is a charge added to a price."]
  ];
  statements.forEach(([category, statement, answer, correction], index) => bank.push({ id:`${category}_mistake_${index}`, category, type:"mistake", difficulty:3, question:"Find the mistake. Is this statement correct?", data:{ statement, correction }, answer }));
  const detective = [
    ["operations","A student says: “Twenty divided by five equals four.” Is the sentence correct?",["YES","NO"],"YES"],["operations","Which word completes: “The result of a division is the ______.”",["quotient","product","sum","difference"],"quotient"],["fractions","A student says: “The numerator is at the top.” Is the sentence correct?",["YES","NO"],"YES"],["fractions","Which word completes: “To put fractions in sequence, ______ fractions.”",["order","tax","multiply","subtract"],"order"],["geometry","A square has four equal sides. Which word is missing?",["side","angle","divisor","fraction"],"side"],["geometry","A student says: “A pentagon has five sides.” Is the sentence correct?",["YES","NO"],"YES"],["numbers","Which word means 1,000?",["one hundred","one thousand","one million","thousandth"],"one thousand"],["divisibility","A student says: “15 is a multiple of 3.” Is the sentence correct?",["YES","NO"],"YES"],["percentages","Which word means a price reduction?",["discount","tax","surcharge","increase"],"discount"],["percentages","A student says: “A surcharge is an extra charge.” Is the sentence correct?",["YES","NO"],"YES"]
  ];
  detective.forEach(([category, question, options, answer], index) => bank.push(choice(`${category}_detective_${index}`, category, "detective", question, options, options.indexOf(answer), 3)));
  return bank;
}
const challengeBank = makeBank();

// ==================== SESSION GENERATION ====================
function createRandom() { const entropy = new Uint32Array(1); crypto.getRandomValues(entropy); let seed = entropy[0] || Date.now(); return () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }; }
function shuffleArray(items, random) { const result = [...items]; for (let index = result.length - 1; index > 0; index -= 1) { const target = Math.floor(random() * (index + 1)); [result[index], result[target]] = [result[target], result[index]]; } return result; }
function shuffleOptions(challenge, random) { if (!challenge.data.options) return challenge; const packed = shuffleArray(challenge.data.options.map((text, index) => ({ text, correct:index === challenge.answer })), random); return { ...challenge, data:{ ...challenge.data, options:packed.map(item => item.text) }, answer:packed.findIndex(item => item.correct) }; }
function selectRandomQuestions(category, types, used, random) { const candidates = challengeBank.filter(item => item.category === category && types.includes(item.type) && !used.has(item.id)); if (!candidates.length) throw new Error(`Missing challenge for ${category}`); return shuffleArray(candidates, random)[0]; }
function generateGameSession() {
  const random = createRandom(), used = new Set(), challenges = [];
  sessionSlots.forEach((level, levelIndex) => shuffleArray(level, random).forEach(([category, types]) => { let challenge = selectRandomQuestions(category, types, used, random); used.add(challenge.id); challenge = shuffleOptions({ ...challenge, level:levelIndex }, random); if (challenge.type === "scramble") challenge.data = { ...challenge.data, letters:shuffleArray(challenge.data.word.toUpperCase().split(""), random) }; if (challenge.type === "matching") challenge.data = { ...challenge.data, spanishCards:shuffleArray(challenge.data.pairs.map(pair => pair.spanish), random) }; challenges.push(challenge); }));
  return { id:`${Date.now()}-${Math.floor(random() * 100000)}`, challenges, total:challenges.length };
}

// ==================== GAME STATE ====================
const state = { session:null, index:0, level:0, correct:0, incorrect:0, streak:0, bestStreak:0, lives:3, stats:{}, completed:[], startedAt:0, elapsedSeconds:0, timerId:null, locked:false, interaction:null, student:"", studentClass:"", studentPin:"", resultSent:false };
const elements = Object.fromEntries(["welcome-screen:welcome","level-screen:levelScreen","game-screen:game","result-screen:result","start-form:form","student-name:name","student-class:studentClass","name-error:nameError","begin-level-button:beginLevel","level-kicker:levelKicker","level-orb:levelOrb","level-title:levelTitle","level-description:levelDescription","level-map-list:levelMap","header-student:headerStudent","level-live-label:levelLive","question-number:questionNumber","challenge-total:challengeTotal","category-label:category","question-text:question","options:options","feedback:feedback","progress-bar:progress","live-correct:liveCorrect","live-incorrect:liveIncorrect","live-streak:liveStreak","lives:lives","result-student:resultStudent","result-class:resultClass","result-date:resultDate","final-correct:finalCorrect","final-total:finalTotal","final-percentage:finalPercentage","final-correct-summary:finalCorrectSummary","final-incorrect-summary:finalIncorrectSummary","final-best-streak:finalBestStreak","final-time:finalTime","category-breakdown:breakdown","completed-levels-list:completedLevels","badge-icon:badgeIcon","badge-title:badgeTitle","confetti:confetti","screenshot-button:screenshot","play-again-button:playAgain","registration-status:registrationStatus"].map(item => { const [id, key] = item.split(":"); return [key, document.getElementById(id)]; }));

function resetState() { clearInterval(state.timerId); state.session = generateGameSession(); Object.assign(state, { index:0, level:0, correct:0, incorrect:0, streak:0, bestStreak:0, lives:3, stats:{}, completed:[], elapsedSeconds:0, locked:false, interaction:null }); Object.keys(vocabulary).forEach(category => { state.stats[category] = { correct:0, total:0 }; }); state.session.challenges.forEach(challenge => { state.stats[challenge.category].total += 1; }); }
async function startChallenge(event) {
  event.preventDefault();
  const pin = elements.name.value.trim();
  if (!pin) {
    elements.nameError.textContent = "Enter your personal PIN to start.";
    elements.nameError.hidden = false;
    elements.name.focus();
    return;
  }
  const submitButton = elements.form.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.textContent = "CHECKING PIN…";
  elements.nameError.hidden = true;
  try {
    const student = await verifyStudentPin(pin);
    if (!student || !student.valido) throw new Error("PIN not found. Check it and try again.");
    state.studentPin = pin;
    state.student = student.nombre;
    state.studentClass = student.clase;
    resetState();
    state.startedAt = Date.now();
    state.timerId = setInterval(() => { state.elapsedSeconds = Math.floor((Date.now() - state.startedAt) / 1000); }, 1000);
    elements.headerStudent.textContent = state.student;
    elements.challengeTotal.textContent = state.session.total;
    elements.welcome.hidden = true;
    showLevel(0);
  } catch (error) {
    elements.nameError.textContent = error.message || "Could not verify the PIN. Please try again.";
    elements.nameError.hidden = false;
    elements.name.focus();
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = 'START CHALLENGE <span aria-hidden="true">🚀</span>';
  }
}

function verifyStudentPin(pin) {
  return new Promise((resolve, reject) => {
    const callbackName = "__mathPinCallback_" + Math.random().toString(36).slice(2);
    const script = document.createElement("script");
    const timeout = setTimeout(() => finish(new Error("PIN check timed out. Please try again.")), 12000);
    function finish(error, data) {
      clearTimeout(timeout);
      delete window[callbackName];
      script.remove();
      if (error) reject(error); else resolve(data);
    }
    window[callbackName] = data => finish(null, data);
    script.onerror = () => finish(new Error("The registration service is unavailable. Please ask your teacher to enable public access to it."));
    script.src = REGISTRATION_ENDPOINT + "?accion=verificar&pin=" + encodeURIComponent(pin) + "&callback=" + callbackName;
    document.head.appendChild(script);
  });
}

async function registerFinalResult(percentage) {
  if (state.resultSent) return;
  state.resultSent = true;
  elements.registrationStatus.textContent = "Sending your result to your teacher…";

  // Convertimos la nota a texto y cambiamos el punto por la coma para arreglar el error en Google Sheets
  const notaConComa = (state.correct / state.session.total * 10).toFixed(2).replace('.', ',');

  const payload = {
    accion: "guardar",
    pin: state.studentPin,
    notaNumerica: notaConComa,
    aciertos: state.correct,
    errores: state.incorrect,
    porcentaje: percentage,
    duracionSegundos: state.elapsedSeconds,
    totalPreguntas: state.session.total
  };
  try {
    // no-cors allows a static GitHub Pages site to submit the form without a CORS preflight.
    // The opaque response cannot confirm whether Apps Script accepted the write.
    await fetch(REGISTRATION_ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body: new URLSearchParams({ payload: JSON.stringify(payload) })
    });
    elements.registrationStatus.textContent = "Result sent. Your teacher can check the class register. If it does not appear, please show your result screenshot.";
  } catch (error) {
    state.resultSent = false;
    elements.registrationStatus.textContent = "The result could not be sent automatically. Please take a screenshot and submit it on Google Classroom.";
  }
}
function showLevel(index) { state.level = index; state.lives = 3; const [name, description, color] = levels[index]; elements.levelKicker.textContent = index === 4 ? "FINAL LEVEL" : `LEVEL ${index + 1} OF ${levels.length}`; elements.levelOrb.textContent = index + 1; elements.levelOrb.className = `level-orb ${color}`; elements.levelTitle.textContent = name; elements.levelDescription.textContent = description; elements.levelMap.replaceChildren(); levels.forEach(([levelName], levelIndex) => { const row = document.createElement("div"); row.className = `map-item ${levelIndex < index ? "complete" : levelIndex === index ? "current" : ""}`; row.textContent = `${levelIndex < index ? "✓" : levelIndex + 1} ${levelName}`; elements.levelMap.append(row); }); elements.game.hidden = true; elements.levelScreen.hidden = false; }
function beginLevel() { elements.levelScreen.hidden = true; elements.game.hidden = false; renderChallenge(); }

// ==================== SEVEN CHALLENGE RENDERERS ====================
function button(text, className, action) { const node = document.createElement("button"); node.type = "button"; node.className = className; node.textContent = text; node.addEventListener("click", action); return node; }
function renderChallenge() { const challenge = state.session.challenges[state.index]; state.locked = false; state.interaction = {}; elements.levelLive.textContent = state.level === 4 ? "FINAL LEVEL" : `LEVEL ${state.level + 1}`; elements.questionNumber.textContent = state.index + 1; elements.category.textContent = `${challenge.type.toUpperCase()} · ${challenge.category.toUpperCase()}`; elements.question.textContent = challenge.question; elements.options.replaceChildren(); elements.feedback.hidden = true; elements.feedback.className = "feedback"; ({ mc:renderChoices, expression:renderChoices, detective:renderChoices, scramble:renderScramble, matching:renderMatching, sort:renderSort, mistake:renderMistake })[challenge.type](challenge); updateLive(); requestAnimationFrame(() => elements.options.querySelector("button")?.focus()); }
function renderChoices(challenge) { challenge.data.options.forEach((option, index) => { const node = button("", "option-button choice-option", () => resolve(index === challenge.answer, challenge.data.options[challenge.answer])); const letter = document.createElement("span"), text = document.createElement("span"); letter.className = "option-letter"; letter.textContent = String.fromCharCode(65 + index); text.textContent = option; node.append(letter, text); elements.options.append(node); }); }
function renderScramble(challenge) { state.interaction.letters = []; const hint = document.createElement("p"), answer = document.createElement("p"), tiles = document.createElement("div"), controls = document.createElement("div"); hint.className = "game-instruction scramble-hint"; hint.textContent = `Hint / Pista: ${challenge.data.hint}`; answer.className = "scramble-answer"; tiles.className = "letter-tiles"; controls.className = "challenge-controls"; const draw = () => { answer.textContent = state.interaction.letters.join("") || "Select the letters in order"; }; challenge.data.letters.forEach(letter => tiles.append(button(letter, "letter-tile", event => { state.interaction.letters.push(letter); event.currentTarget.disabled = true; draw(); }))); controls.append(button("CLEAR", "secondary-button compact", () => { state.interaction.letters = []; tiles.querySelectorAll("button").forEach(tile => { tile.disabled = false; }); draw(); }), button("CHECK", "primary-button compact", () => resolve(state.interaction.letters.join("").toLowerCase() === challenge.answer, challenge.data.word))); elements.options.append(hint, answer, tiles, controls); draw(); }
function renderMatching(challenge) { state.interaction = { english:null, spanish:null, pairs:new Set(), missed:false }; const instruction = document.createElement("p"), board = document.createElement("div"), left = document.createElement("div"), right = document.createElement("div"); instruction.className = "game-instruction"; instruction.textContent = "Select an English card, then its Spanish partner."; board.className = "matching-board"; left.className = right.className = "match-column"; const tryPair = () => { const pick = state.interaction; if (pick.english === null || pick.spanish === null) return; if (challenge.data.pairs[pick.english].spanish === pick.spanish) pick.pairs.add(pick.english); else { pick.missed = true; flash("Not a pair. Try another match."); } pick.english = pick.spanish = null; draw(); if (pick.pairs.size === challenge.data.pairs.length) setTimeout(() => resolve(!pick.missed, "All English-Spanish pairs"), 250); }; const draw = () => { left.replaceChildren(); right.replaceChildren(); challenge.data.pairs.forEach((pair, index) => { const paired = state.interaction.pairs.has(index); const card = button(pair.english, `match-card ${paired ? "paired" : state.interaction.english === index ? "selected" : ""}`, () => { if (!paired) { state.interaction.english = index; draw(); tryPair(); } }); card.disabled = paired; left.append(card); }); challenge.data.spanishCards.forEach(word => { const index = challenge.data.pairs.findIndex(pair => pair.spanish === word), paired = state.interaction.pairs.has(index); const card = button(word, `match-card ${paired ? "paired" : state.interaction.spanish === word ? "selected" : ""}`, () => { if (!paired) { state.interaction.spanish = word; draw(); tryPair(); } }); card.disabled = paired; right.append(card); }); }; board.append(left, right); elements.options.append(instruction, board); draw(); }
function renderSort(challenge) { state.interaction.order = []; const instruction = document.createElement("p"), source = document.createElement("div"), result = document.createElement("div"), controls = document.createElement("div"); instruction.className = "game-instruction"; instruction.textContent = "Tap each item in the correct order. Tap your answer to remove it."; source.className = "sort-source"; result.className = "sort-result"; controls.className = "challenge-controls"; const draw = () => { source.replaceChildren(); result.replaceChildren(); challenge.data.items.forEach(item => { const used = state.interaction.order.includes(item); const tile = button(item, "sort-tile", () => { if (!used) { state.interaction.order.push(item); draw(); } }); tile.disabled = used; source.append(tile); }); state.interaction.order.forEach((item, index) => result.append(button(`${index + 1}. ${item}`, "sort-choice", () => { state.interaction.order.splice(index, 1); draw(); }))); }; controls.append(button("UNDO", "secondary-button compact", () => { state.interaction.order.pop(); draw(); }), button("RESET", "secondary-button compact", () => { state.interaction.order = []; draw(); }), button("CHECK ORDER", "primary-button compact", () => resolve(state.interaction.order.join("|") === challenge.answer.join("|"), challenge.answer.join(" → ")))); elements.options.append(instruction, source, result, controls); draw(); }
function renderMistake(challenge) { const statement = document.createElement("blockquote"), instruction = document.createElement("p"), choices = document.createElement("div"); statement.className = "math-statement"; statement.textContent = `“${challenge.data.statement}”`; instruction.className = "game-instruction"; instruction.textContent = "Decide first. If it is wrong, correct the statement."; choices.className = "two-choice"; choices.append(button("✓ CORRECT", "option-button", () => judgeMistake(true, challenge)), button("✗ INCORRECT", "option-button", () => judgeMistake(false, challenge))); elements.options.append(statement, instruction, choices); }
function judgeMistake(answer, challenge) { if (answer !== challenge.answer) { resolve(false, challenge.answer ? "The statement is correct." : challenge.data.correction); return; } if (answer) { resolve(true, "Correct"); return; } elements.options.replaceChildren(); const prompt = document.createElement("p"); prompt.className = "game-instruction"; prompt.textContent = "Choose the correct version."; elements.options.append(prompt, button(challenge.data.correction, "option-button", () => resolve(true, challenge.data.correction)), button(challenge.data.statement, "option-button", () => resolve(false, challenge.data.correction))); }
function flash(message) { elements.feedback.textContent = message; elements.feedback.className = "feedback bad"; elements.feedback.hidden = false; setTimeout(() => { if (!state.locked) elements.feedback.hidden = true; }, 800); }

// ==================== SCORING AND RESULTS ====================
function resolve(correct, answer) { if (state.locked) return; state.locked = true; elements.options.querySelectorAll("button").forEach(node => { node.disabled = true; }); const challenge = state.session.challenges[state.index]; state.stats[challenge.category].correct += correct ? 1 : 0; if (correct) { state.correct += 1; state.streak += 1; state.bestStreak = Math.max(state.bestStreak, state.streak); elements.feedback.textContent = state.streak >= 3 ? `✓ EXCELLENT! 🔥 ${state.streak} STREAK` : "✓ EXCELLENT!"; elements.feedback.className = "feedback good"; } else { state.incorrect += 1; state.streak = 0; state.lives = Math.max(0, state.lives - 1); elements.feedback.textContent = `✗ NOT QUITE. The correct answer is: ${answer}`; elements.feedback.className = "feedback bad"; } elements.feedback.hidden = false; updateLive(); setTimeout(advance, 1350); }
function advance() { state.index += 1; const next = state.session.challenges[state.index]; if (!next) { finish(); return; } if (next.level !== state.level) { state.completed.push(state.level); showLevel(next.level); } else renderChallenge(); }
function updateLive() { const answered = state.correct + state.incorrect; elements.liveCorrect.textContent = state.correct; elements.liveIncorrect.textContent = state.incorrect; elements.liveStreak.textContent = state.streak; elements.lives.textContent = `${"❤️".repeat(state.lives)}${"🖤".repeat(3 - state.lives)}`; elements.progress.style.width = `${(answered / state.session.total) * 100}%`; }
function formatTime(seconds) { return `${String(Math.floor(seconds / 60)).padStart(2,"0")}:${String(seconds % 60).padStart(2,"0")}`; }
function badge(percent) { if (percent === 100) return ["🏆","MATH ENGLISH MASTER"]; if (percent >= 90) return ["🥇","MATH EXPERT"]; if (percent >= 80) return ["🥈","MATH CHALLENGER"]; if (percent >= 70) return ["🥉","MATH EXPLORER"]; return ["🚀","KEEP TRAINING!"]; }
function finish() { clearInterval(state.timerId); state.elapsedSeconds = Math.floor((Date.now() - state.startedAt) / 1000); const percentage = Math.round((state.correct / state.session.total) * 100), [icon, title] = badge(percentage); elements.game.hidden = true; elements.result.hidden = false; elements.resultStudent.textContent = state.student; elements.resultClass.textContent = state.studentClass; elements.resultDate.textContent = new Intl.DateTimeFormat("en-GB", { day:"2-digit", month:"long", year:"numeric" }).format(new Date()); elements.finalCorrect.textContent = state.correct; elements.finalTotal.textContent = state.session.total; elements.finalPercentage.textContent = `${percentage}%`; elements.finalCorrectSummary.textContent = state.correct; elements.finalIncorrectSummary.textContent = state.incorrect; elements.finalBestStreak.textContent = state.bestStreak; elements.finalTime.textContent = formatTime(state.elapsedSeconds); elements.badgeIcon.textContent = icon; elements.badgeTitle.textContent = title; renderBreakdown(); renderLevels(); elements.registrationStatus.textContent = "Sending your result to your teacher…"; registerFinalResult(percentage); if (percentage === 100) confetti(); window.scrollTo({ top:0, behavior:"smooth" }); }
function renderBreakdown() { elements.breakdown.replaceChildren(); Object.keys(vocabulary).forEach(category => { const stat = state.stats[category], percent = Math.round((stat.correct / stat.total) * 100), row = document.createElement("div"), label = document.createElement("span"), track = document.createElement("div"), fill = document.createElement("div"), score = document.createElement("b"); row.className = "breakdown-row"; label.textContent = category[0].toUpperCase() + category.slice(1); track.className = "breakdown-track"; fill.className = "breakdown-fill"; fill.style.width = `${percent}%`; score.textContent = `${stat.correct} / ${stat.total} (${percent}%)`; track.append(fill); row.append(label, track, score); elements.breakdown.append(row); }); }
function renderLevels() { elements.completedLevels.replaceChildren(); levels.forEach(([name]) => { const row = document.createElement("p"); row.textContent = `✓ ${name}`; elements.completedLevels.append(row); }); }
function confetti() { elements.confetti.replaceChildren(); ["#1768ac","#0f887f","#f0b63d","#be4651"].forEach((color, index) => { for (let count = 0; count < 15; count += 1) { const piece = document.createElement("i"); piece.className = "confetti"; piece.style.left = `${(index * 23 + count * 7) % 100}%`; piece.style.background = color; piece.style.animationDelay = `${count / 14}s`; elements.confetti.append(piece); } }); }
function prepareScreenshot() { document.body.classList.add("screenshot-mode"); window.scrollTo({ top:0, behavior:"smooth" }); }
function playAgain() { document.body.classList.remove("screenshot-mode"); clearInterval(state.timerId); elements.result.hidden = true; elements.welcome.hidden = false; elements.name.value = state.studentPin; elements.name.focus(); }
elements.form.addEventListener("submit", startChallenge); elements.name.addEventListener("input", () => { elements.nameError.hidden = true; }); elements.beginLevel.addEventListener("click", beginLevel); elements.screenshot.addEventListener("click", prepareScreenshot); elements.playAgain.addEventListener("click", playAgain); document.addEventListener("keydown", event => { if (event.key === "Escape") document.body.classList.remove("screenshot-mode"); });