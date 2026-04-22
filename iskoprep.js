/* ============================================================
   ISKOPREP — MAIN JAVASCRIPT
   ============================================================ */

/* ============================================================
   FIREBASE INTEGRATION GUIDE
   ============================================================
   To connect this app to Firebase tomorrow, follow these steps:

   1. ADD to iskoprep.html <head> (before iskoprep.js script tag):
      <script type="module">
        import { initializeApp } from "https://www.gstatic.com/firebasejs/10.x.x/firebase-app.js";
        import { getAuth, onAuthStateChanged, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.x.x/firebase-auth.js";
        import { getFirestore, collection, getDocs, doc, setDoc, getDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.x.x/firebase-firestore.js";

        const firebaseConfig = { apiKey: "...", authDomain: "...", projectId: "..." }; // Paste full Firebase config here
        window.firebaseApp = initializeApp(firebaseConfig);
        window.db = getFirestore(window.firebaseApp);
        window.auth = getAuth(window.firebaseApp);
      </script>

   2. Each section below marked with FIREBASE: shows where to plug in
      Firestore reads/writes and Auth checks.

   3. QUESTIONS can stay hardcoded OR be fetched from:
      Firestore collection: "questions" > document per subject key
   ============================================================ */

/* ---- QUIZ DATA ---- */
/* FIREBASE: To load questions dynamically from Firestore, replace this object
   with a fetch from the "questions" collection on app init:
     const snap = await getDocs(collection(window.db, "questions"));
     snap.forEach(doc => { QUESTIONS[doc.id] = doc.data(); });
   Until then, questions are hardcoded below for offline use. */
var QUESTIONS = {
  /* ---- ENGLISH (50 items / 20 mins) ---- */
  eng_grammar: {
    lesson: 'Correct Grammar Usage', subject: 'English', subKey: 'eng', timer: 60,
    q: [
      { q: 'Choose the correct sentence: "She ___ to school every day."', o: ['go', 'goes', 'going', 'gone'], a: 1 },
      { q: '"Neither of the students ___ fully prepared." Choose the correct verb.', o: ['were', 'is', 'are', 'have been'], a: 1 }
    ]
  },
  eng_vocabulary: {
    lesson: 'Vocabulary', subject: 'English', subKey: 'eng', timer: 60,
    q: [
      { q: 'What does "benevolent" mean?', o: ['Strict and harsh', 'Kind and generous', 'Indifferent', 'Clever'], a: 1 },
      { q: '"Reserved" most closely means:', o: ['Bold and outgoing', 'Shy and quiet', 'Loud and proud', 'Angry'], a: 1 }
    ]
  },
  eng_idioms: {
    lesson: 'Idiomatic Expressions', subject: 'English', subKey: 'eng', timer: 60,
    q: [
      { q: 'What does "break a leg" mean?', o: ['To literally injure yourself', 'Good luck', 'To run fast', 'To dance'], a: 1 },
      { q: '"Hit the sack" means:', o: ['Punch a punching bag', 'Go to sleep', 'Go shopping', 'Start working'], a: 1 }
    ]
  },
  eng_analogy: {
    lesson: 'Word Analogy', subject: 'English', subKey: 'eng', timer: 60,
    q: [
      { q: 'Hot : Cold :: Day : ___', o: ['Sun', 'Night', 'Light', 'Warm'], a: 1 },
      { q: 'Teacher : School :: Doctor : ___', o: ['Medicine', 'Hospital', 'Patient', 'Clinic'], a: 1 }
    ]
  },
  eng_reading: {
    lesson: 'Reading Comprehension', subject: 'English', subKey: 'eng', timer: 60,
    q: [
      { q: 'Passage: "Maria studies every night. She reads and practices problems. Her hard work paid off when she aced the exam." What is the main idea?', o: ['Maria reads textbooks', 'Hard work leads to success', 'Maria takes exams', 'Maria studies at night'], a: 1 },
      { q: 'What can be inferred? "The streets were empty, shops were closed, and only a few street lights flickered."', o: ['It was morning', 'It was a busy holiday', 'It was late at night', 'It was a festival'], a: 2 }
    ]
  },

  /* ---- INTEGRATED SCIENCE (40 items / 25 mins) ---- */
  sci_general: {
    lesson: 'General Science', subject: 'Integrated Science', subKey: 'sci', timer: 60,
    q: [
      { q: 'What is the basic unit of matter?', o: ['Molecule', 'Atom', 'Cell', 'Element'], a: 1 },
      { q: 'Which type of energy is stored in food?', o: ['Kinetic energy', 'Chemical energy', 'Nuclear energy', 'Mechanical energy'], a: 1 }
    ]
  },
  sci_cells: {
    lesson: 'Cells', subject: 'Integrated Science', subKey: 'sci', timer: 60,
    q: [
      { q: 'What organelle controls all cell activities?', o: ['Mitochondria', 'Nucleus', 'Ribosome', 'Vacuole'], a: 1 },
      { q: 'Plant cells have ___ that animal cells do not.', o: ['Nucleus', 'Cell membrane', 'Cell wall', 'Ribosome'], a: 2 }
    ]
  },
  sci_gravitation: {
    lesson: 'Law of Universal Gravitation', subject: 'Integrated Science', subKey: 'sci', timer: 60,
    q: [
      { q: 'Newton\'s Law of Universal Gravitation states that gravity depends on:', o: ['Speed and direction', 'Mass and distance', 'Color and size', 'Temperature and pressure'], a: 1 },
      { q: 'What happens to gravitational force when the distance between two objects doubles?', o: ['It doubles', 'It stays the same', 'It becomes four times less', 'It becomes twice as strong'], a: 2 }
    ]
  },
  sci_physics: {
    lesson: 'Physics', subject: 'Integrated Science', subKey: 'sci', timer: 60,
    q: [
      { q: 'What is the SI unit of force?', o: ['Joule', 'Watt', 'Newton', 'Pascal'], a: 2 },
      { q: 'An object at rest tends to stay at rest. This is an example of:', o: ['Newton\'s 2nd Law', 'Newton\'s 1st Law (Inertia)', 'Newton\'s 3rd Law', 'Law of Gravity'], a: 1 }
    ]
  },
  sci_newtonian: {
    lesson: 'Newtonian Mechanics', subject: 'Integrated Science', subKey: 'sci', timer: 60,
    q: [
      { q: 'F = ma is known as Newton\'s:', o: ['First Law', 'Second Law', 'Third Law', 'Law of Gravitation'], a: 1 },
      { q: '"For every action, there is an equal and opposite reaction." This is Newton\'s:', o: ['First Law', 'Second Law', 'Third Law', 'Law of Universal Gravitation'], a: 2 }
    ]
  },
  sci_optics: {
    lesson: 'Optics', subject: 'Integrated Science', subKey: 'sci', timer: 60,
    q: [
      { q: 'A pencil looks bent when placed in water. This is due to:', o: ['Reflection', 'Refraction', 'Diffraction', 'Absorption'], a: 1 },
      { q: 'A concave lens causes light rays to:', o: ['Converge', 'Diverge', 'Reflect', 'Stop'], a: 1 }
    ]
  },
  sci_wave: {
    lesson: 'Wave, Motion, and Acoustic', subject: 'Integrated Science', subKey: 'sci', timer: 60,
    q: [
      { q: 'Sound travels fastest through:', o: ['Vacuum', 'Air', 'Water', 'Solids'], a: 3 },
      { q: 'The number of waves that pass a point per second is called:', o: ['Amplitude', 'Wavelength', 'Frequency', 'Period'], a: 2 }
    ]
  },
  sci_thermo: {
    lesson: 'Thermodynamics and Heat', subject: 'Integrated Science', subKey: 'sci', timer: 60,
    q: [
      { q: 'Heat naturally flows from:', o: ['Cold to hot', 'Hot to cold', 'High to low pressure', 'Low to high pressure'], a: 1 },
      { q: 'What is the SI unit of temperature?', o: ['Celsius', 'Fahrenheit', 'Kelvin', 'Joule'], a: 2 }
    ]
  },
  sci_electro: {
    lesson: 'Electromagnetism and Electronics', subject: 'Integrated Science', subKey: 'sci', timer: 60,
    q: [
      { q: 'In Ohm\'s Law (V = IR), R stands for:', o: ['Radiation', 'Resistance', 'Reactance', 'Resonance'], a: 1 },
      { q: 'A transformer is used to:', o: ['Generate electricity', 'Change AC voltage levels', 'Store electrical energy', 'Convert AC to DC'], a: 1 }
    ]
  },
  sci_chemistry: {
    lesson: 'Chemistry', subject: 'Integrated Science', subKey: 'sci', timer: 60,
    q: [
      { q: 'The atomic number of an element represents the number of:', o: ['Neutrons', 'Protons', 'Electrons only', 'Nucleons'], a: 1 },
      { q: 'A substance that releases H⁺ ions in water is called a(n):', o: ['Base', 'Salt', 'Acid', 'Neutral compound'], a: 2 }
    ]
  },
  sci_analysis: {
    lesson: 'Analysis and Application', subject: 'Integrated Science', subKey: 'sci', timer: 60,
    q: [
      { q: 'A ball is dropped from rest. After 2 seconds (g = 10 m/s²), its speed is:', o: ['5 m/s', '10 m/s', '20 m/s', '40 m/s'], a: 2 },
      { q: 'Which of the following is a chemical change?', o: ['Cutting wood', 'Melting ice', 'Burning paper', 'Bending a wire'], a: 2 }
    ]
  },
  sci_knowledge: {
    lesson: 'Comprehension and Knowledge', subject: 'Integrated Science', subKey: 'sci', timer: 60,
    q: [
      { q: 'Photosynthesis is best described as:', o: ['Breakdown of glucose for energy', 'Production of food using light energy', 'Exchange of gases in lungs', 'Process of cell division'], a: 1 },
      { q: 'Which of the following is NOT a renewable energy source?', o: ['Solar', 'Wind', 'Coal', 'Hydroelectric'], a: 2 }
    ]
  },

  /* ---- INTEGRATED MATHEMATICS (40 items / 40 mins) ---- */
  math_basic: {
    lesson: 'Basic Operations', subject: 'Integrated Mathematics', subKey: 'math', timer: 60,
    q: [
      { q: 'What is 15 × 24?', o: ['300', '360', '340', '380'], a: 1 },
      { q: 'What is 1,440 ÷ 36?', o: ['30', '40', '45', '50'], a: 1 }
    ]
  },
  math_statistics: {
    lesson: 'Statistics', subject: 'Integrated Mathematics', subKey: 'math', timer: 60,
    q: [
      { q: 'The mean of 10, 20, 30, 40, 50 is:', o: ['25', '30', '35', '40'], a: 1 },
      { q: 'In the data set {3, 5, 5, 7, 9}, the mode is:', o: ['3', '5', '7', '9'], a: 1 }
    ]
  },
  math_algebra: {
    lesson: 'Algebra', subject: 'Integrated Mathematics', subKey: 'math', timer: 60,
    q: [
      { q: 'If 3x + 6 = 21, what is x?', o: ['3', '5', '6', '9'], a: 1 },
      { q: 'Simplify: 4x + 2x − 3x', o: ['3x', '4x', '5x', '6x'], a: 0 }
    ]
  },
  math_geometry: {
    lesson: 'Geometry', subject: 'Integrated Mathematics', subKey: 'math', timer: 60,
    q: [
      { q: 'The area of a circle with radius 7 is (use π ≈ 3.14):', o: ['43.96', '153.86', '21.98', '49'], a: 1 },
      { q: 'How many degrees are in a right angle?', o: ['45°', '90°', '180°', '360°'], a: 1 }
    ]
  },
  math_trig: {
    lesson: 'Trigonometry', subject: 'Integrated Mathematics', subKey: 'math', timer: 60,
    q: [
      { q: 'In a right triangle, sin(angle) = ?', o: ['Adjacent / Hypotenuse', 'Opposite / Adjacent', 'Opposite / Hypotenuse', 'Hypotenuse / Opposite'], a: 2 },
      { q: 'cos(60°) = ?', o: ['1', '√3/2', '1/2', '0'], a: 2 }
    ]
  },
  math_verbal: {
    lesson: 'Verbal Problem Analysis', subject: 'Integrated Mathematics', subKey: 'math', timer: 60,
    q: [
      { q: 'A train travels at 60 km/h. How long does it take to travel 180 km?', o: ['2 hours', '3 hours', '4 hours', '5 hours'], a: 1 },
      { q: 'Ana has 3 times as many books as Ben. If Ben has 12, how many does Ana have?', o: ['4', '15', '36', '48'], a: 2 }
    ]
  },
  math_unitcircle: {
    lesson: 'Unit Circle', subject: 'Integrated Mathematics', subKey: 'math', timer: 60,
    q: [
      { q: 'On the unit circle, the coordinates at 90° are:', o: ['(1, 0)', '(0, 1)', '(−1, 0)', '(0, −1)'], a: 1 },
      { q: 'The sine of 0° is:', o: ['0', '1', '−1', '√2/2'], a: 0 }
    ]
  },

  /* ---- FILIPINO (30 items / 15 mins) ---- */
  fil_gamit: {
    lesson: 'Wastong Gamit ng Salita', subject: 'Filipino', subKey: 'fil', timer: 60,
    q: [
      { q: 'Piliin ang tamang salita: "Ang bata ___ naglalaro sa labas."', o: ['ay', 'si', 'ang', 'ng'], a: 0 },
      { q: 'Alin ang wastong gamit? "Siya ___ pumunta sa paaralan kahapon."', o: ['ay', 'ay nagtayo', 'ay nagpunta', 'nagdating'], a: 2 }
    ]
  },
  fil_istruktura: {
    lesson: 'Istruktura ng Pangungusap', subject: 'Filipino', subKey: 'fil', timer: 60,
    q: [
      { q: 'Alin sa mga sumusunod ang isang kumpletong pangungusap?', o: ['Si Maria sa tindahan.', 'Ang magandang bulaklak.', 'Pumunta si Maria sa tindahan.', 'Kahit saan man.'], a: 2 },
      { q: 'Anong bahagi ng pangungusap ang "kumain" sa "Kumain ang bata ng mansanas"?', o: ['Simuno', 'Panaguri', 'Katuwang', 'Layon'], a: 1 }
    ]
  },
  fil_ugat: {
    lesson: 'Pagtukoy sa Salitang Ugat', subject: 'Filipino', subKey: 'fil', timer: 60,
    q: [
      { q: 'Ano ang salitang ugat ng "pagtuturo"?', o: ['turo', 'pagtu', 'tuturo', 'ugat'], a: 0 },
      { q: 'Ano ang salitang ugat ng "nagtatakbo"?', o: ['nag', 'takbo', 'tatakbo', 'takbuhan'], a: 1 }
    ]
  },
  fil_idyoma: {
    lesson: 'Idyoma at Talasalitaan', subject: 'Filipino', subKey: 'fil', timer: 60,
    q: [
      { q: 'Ano ang kahulugan ng idyomang "magpakawala ng luha"?', o: ['Magpahinga', 'Umiyak', 'Matulog', 'Sumigaw'], a: 1 },
      { q: 'Ano ang ibig sabihin ng "balat-sibuyas"?', o: ['Matapang', 'Madaling masaktan o mapikon', 'Masayahin', 'Matalino'], a: 1 }
    ]
  },
  fil_pagsunod: {
    lesson: 'Pagsusunod-sunod ng Talata at Pangungusap', subject: 'Filipino', subKey: 'fil', timer: 60,
    q: [
      { q: 'Ayusin ang mga pangungusap: 1-Kumain siya. 2-Nagutom siya. 3-Pumunta siya sa kusina.', o: ['1-2-3', '2-3-1', '3-1-2', '1-3-2'], a: 1 },
      { q: 'Alin ang dapat na unang pangungusap? "___ Kaya pumunta siya sa doktor."', o: ['Masaya siya.', 'Nagkasakit siya.', 'Nanalo siya.', 'Nagtrabaho siya.'], a: 1 }
    ]
  },
  fil_unawa: {
    lesson: 'Pag-unawa sa Binasa', subject: 'Filipino', subKey: 'fil', timer: 60,
    q: [
      { q: 'Talata: "Si Pedro ay isang masisipag na mag-aaral. Araw-araw, pinag-aaralan niya ang kanyang mga aralin." Ano ang katangian ni Pedro?', o: ['Tamad', 'Masisipag', 'Matalino', 'Masaya'], a: 1 },
      { q: 'Ano ang pangunahing ideya? "Ang pag-aaral ay mahalaga para sa kinabukasan ng bawat kabataan. Sa pamamagitan ng edukasyon, makakamit ang mga pangarap."', o: ['Mahirap ang pag-aaral.', 'Mahalaga ang edukasyon para sa hinaharap.', 'Maraming kabataan ang nag-aaral.', 'Ang pangarap ay mahalaga.'], a: 1 }
    ]
  },
  fil_kahulugan: {
    lesson: 'Kasingkahulugan at Kasalungat ng Salita', subject: 'Filipino', subKey: 'fil', timer: 60,
    q: [
      { q: 'Ano ang kasingkahulugan ng "maganda"?', o: ['Pangit', 'Marikit', 'Malungkot', 'Mabangis'], a: 1 },
      { q: 'Ano ang kasalungat ng "masaya"?', o: ['Maligaya', 'Matalino', 'Malungkot', 'Matapang'], a: 2 }
    ]
  },

  /* ---- ABSTRACT REASONING (30 items / 10 mins) — uses images ---- */
  abs_reasoning: {
    lesson: 'Abstract Reasoning', subject: 'Abstract Reasoning', subKey: 'abs', timer: 60,
    q: [
      { q: 'Look at the pattern in the image. Which figure comes next?', img: 'abs_pattern_1.svg', o: ['Figure A', 'Figure B', 'Figure C', 'Figure D'], a: 0 },
      { q: 'Study the sequence in the image. Which option correctly completes the pattern?', img: 'abs_pattern_2.svg', o: ['Figure A', 'Figure B', 'Figure C', 'Figure D'], a: 0 }
    ]
  }
};

/* ---- MOCK EXAM QUESTIONS (40 total, 10 per subject) ---- */
var MOCK_QUESTIONS = [];
function buildMock() {
  function fromKey(key, subjectLabel, subKey) {
    return (QUESTIONS[key] ? QUESTIONS[key].q : []).map(function (q) {
      return Object.assign({}, q, { subject: subjectLabel, subKey: subKey });
    });
  }
  var mathPool = [].concat(
    fromKey('math_basic', 'Math', 'math'),
    fromKey('math_statistics', 'Math', 'math'),
    fromKey('math_algebra', 'Math', 'math'),
    fromKey('math_geometry', 'Math', 'math'),
    fromKey('math_trig', 'Math', 'math')
  ).slice(0, 10);
  var sciPool = [].concat(
    fromKey('sci_general', 'Science', 'sci'),
    fromKey('sci_cells', 'Science', 'sci'),
    fromKey('sci_physics', 'Science', 'sci'),
    fromKey('sci_newtonian', 'Science', 'sci'),
    fromKey('sci_chemistry', 'Science', 'sci')
  ).slice(0, 10);
  var engPool = [].concat(
    fromKey('eng_grammar', 'English', 'eng'),
    fromKey('eng_vocabulary', 'English', 'eng'),
    fromKey('eng_idioms', 'English', 'eng'),
    fromKey('eng_analogy', 'English', 'eng'),
    fromKey('eng_reading', 'English', 'eng')
  ).slice(0, 10);
var filPool = [].concat(
  fromKey('fil_gamit', 'Filipino', 'fil'),
  fromKey('fil_istruktura', 'Filipino', 'fil'),
  fromKey('fil_ugat', 'Filipino', 'fil'),
  fromKey('fil_idyoma', 'Filipino', 'fil'),
  fromKey('fil_kahulugan', 'Filipino', 'fil')
).slice(0, 10);

var absPool = [].concat(
  fromKey('abs_reasoning', 'Abstract Reasoning', 'abs')
).slice(0, 10);

MOCK_QUESTIONS = [].concat(mathPool, sciPool, engPool, filPool, absPool);
}

// Build the initial offline pool
buildMock();

/* ---- LEADERBOARD DATA ---- */
/* FIREBASE: Replace this hardcoded array with a real-time Firestore listener:
     onSnapshot(collection(window.db, "leaderboard"), (snap) => {
       LEADERS = snap.docs.map(d => d.data());
       LEADERS.sort((a, b) => b.streak - a.streak);
       if (state.page === 'leaderboard') render(); // refresh UI
     });
   Each document should have: { name, streak, subject, icon, best }
   Call this listener inside the DOMContentLoaded init block below. */
var LEADERS = [];

/* ---- BADGES ---- */
/* FIREBASE: Load and save badge state per user in Firestore:
     Read:  const userDoc = await getDoc(doc(window.db, "users", userId));
            BADGES = userDoc.data().badges || BADGES;
     Write: await setDoc(doc(window.db, "users", userId), { badges: BADGES }, { merge: true });
   Replace "userId" with window.auth.currentUser.uid after auth is set up. */
var BADGES = [
  { name: 'First Quiz', icon: 'fa-star', subKey: 'math', earned: false },
  { name: '7-Day Streak', icon: 'fa-fire', subKey: 'sci', earned: false },
  { name: 'Math Master', icon: 'fa-calculator', subKey: 'math', earned: false },
  { name: 'Science Whiz', icon: 'fa-atom', subKey: 'sci', earned: false },
  { name: 'Word Wizard', icon: 'fa-spell-check', subKey: 'eng', earned: false },
  { name: 'Abstract Ace', icon: 'fa-shapes', subKey: 'abs', earned: false },
  { name: 'Mock Master', icon: 'fa-graduation-cap', subKey: 'math', earned: false },
  { name: 'Top 10', icon: 'fa-trophy', subKey: 'sci', earned: false },
  { name: 'Filipino Star', icon: 'fa-book', subKey: 'fil', earned: false }
];

/* ---- PROGRESS DATA ---- */
/* FIREBASE: Load progress from Firestore on app start:
     const userDoc = await getDoc(doc(window.db, "users", userId));
     if (userDoc.exists()) PROGRESS = userDoc.data().progress || PROGRESS;
   Save progress after each quiz result (see pageQuizResults section below). */
var PROGRESS = {
  math: { pct: 0, quizzes: 0, correct: 0, total: 0 },
  sci: { pct: 0, quizzes: 0, correct: 0, total: 0 },
  eng: { pct: 0, quizzes: 0, correct: 0, total: 0 },
  log: { pct: 0, quizzes: 0, correct: 0, total: 0 },
  fil: { pct: 0, quizzes: 0, correct: 0, total: 0 },
  abs: { pct: 0, quizzes: 0, correct: 0, total: 0 }
};

/* ---- STATE ---- */
var state = {
  page: 'home',
  user: { uid: null, username: null, email: null, loggedIn: false },
  quiz: { key: null, current: 0, answers: {}, timer: null, timeLeft: 0, mode: null, complete: false, showReview: false, savedResultId: null },
  mock: { current: 0, answers: {}, timer: null, timeLeft: 5400, complete: false, started: false, showReview: false, savedResultId: null },
  confirmCallback: null
};

var leaderboardUnsubscribe = null;
var authActionInProgress = false;
var AUTH_PROGRESS_DEFAULT = {
  math: { pct: 0, quizzes: 0, correct: 0, total: 0 },
  sci: { pct: 0, quizzes: 0, correct: 0, total: 0 },
  eng: { pct: 0, quizzes: 0, correct: 0, total: 0 },
  log: { pct: 0, quizzes: 0, correct: 0, total: 0 },
  fil: { pct: 0, quizzes: 0, correct: 0, total: 0 },
  abs: { pct: 0, quizzes: 0, correct: 0, total: 0 }
};
var DEMO_PROGRESS_SIGNATURE = {
  math: { pct: 72, quizzes: 45, correct: 324, total: 450 },
  sci: { pct: 65, quizzes: 38, correct: 247, total: 380 },
  eng: { pct: 80, quizzes: 52, correct: 416, total: 520 },
  fil: { pct: 58, quizzes: 30, correct: 174, total: 300 },
  abs: { pct: 0, quizzes: 0, correct: 0, total: 0 }
};
var UI_AUDIO = {
  hoverSrc: '',
  clickSrc: '',
  resultExcellentSrc: '',
  resultGoodSrc: '',
  resultNeedsPracticeSrc: '',
  enabled: true,
  volume: 1
};
var uiAudioContext = null;
var uiAudioUnlocked = false;
var uiAudioLastPlayed = { hover: 0, click: 0 };
var uiAudioHoverTarget = null;

/* ---- HELPERS ---- */
function $(id) { return document.getElementById(id); }
function subColor(k) {
  var m = { math: ['var(--math-a)', 'var(--math-b)'], sci: ['var(--sci-a)', 'var(--sci-b)'], eng: ['var(--eng-a)', 'var(--eng-b)'], log: ['var(--log-a)', 'var(--log-b)'], fil: ['var(--log-a)', 'var(--log-b)'], abs: ['var(--math-a)', 'var(--math-b)'] };
  return m[k] || m.math;
}
function subGrad(k) { var c = subColor(k); return 'linear-gradient(135deg,' + c[0] + ',' + c[1] + ')'; }
function subClass(k) { return { math: 'grad-math glow-math', sci: 'grad-sci glow-sci', eng: 'grad-eng glow-eng', log: 'grad-log glow-log', fil: 'grad-log glow-log', abs: 'grad-math glow-math' }[k] || 'grad-math'; }
function subTextColor(k) { return { math: '#e8d5f5', sci: '#d5f5e3', eng: '#fff5d5', log: '#f5e8d5', fil: '#f5e8d5', abs: '#e8d5f5' }[k] || '#eee'; }
function fmtTime(s) {
  var m = Math.floor(s / 60); var sec = s % 60;
  return String(m).padStart(2, '0') + ':' + String(sec).padStart(2, '0');
}
function stars(n) { var s = ''; for (var i = 0; i < n; i++)s += '<i class="fas fa-star"></i>'; return s; }
function tipForSubject(k) {
  var t = {
    math: '<i class="fas fa-lightbulb"></i> Pro Tip: Write down your work — even in timed mode. It helps you spot calculation errors faster.',
    sci: '<i class="fas fa-lightbulb"></i> Pro Tip: Visualize the concept. Connecting abstract ideas to real-world examples makes answers click.',
    eng: '<i class="fas fa-lightbulb"></i> Pro Tip: Read the question stem carefully — often the answer hides in the phrasing itself.',
    fil: '<i class="fas fa-lightbulb"></i> Pro Tip: Basahin nang mabuti ang tanong. Ang kahulugan ng salita ay maaaring matuklasan sa konteksto ng pangungusap.',
    abs: '<i class="fas fa-lightbulb"></i> Pro Tip: Look for what changes between each figure — size, rotation, shading, or count. The pattern usually follows one consistent rule.'
  };
  return t[k] || t.math;
}
function motivational() {
  return '"Every expert was once a beginner. Keep going, Isko!"';
}

/* ---- ROUTING ---- */
var _homeScrollY = 0;

function goTo(page, data) {
  clearQuizTimer();
  clearMockTimer();
  if (state.page === 'home') {
    _homeScrollY = window.scrollY;
  }
  state.page = page;
  if (data) state.goData = data;
  render();
  if (page === 'home') {
    var restoreY = _homeScrollY;
    requestAnimationFrame(function () {
      window.scrollTo({ top: restoreY, behavior: 'smooth' });
    });
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

/* ---- SIDEBAR ---- */
function openSidebar() {
  $('sidebar').classList.add('open');
  $('sidebar-overlay').classList.add('open');
}
function closeSidebar() {
  $('sidebar').classList.remove('open');
  $('sidebar-overlay').classList.remove('open');
}

/* ---- CONFIRM MODAL ---- */
function showConfirm(cb) {
  state.confirmCallback = cb;
  $('confirm-modal').style.display = 'flex';
  $('confirm-yes').onclick = function () { closeConfirm(); cb(); };
}
function closeConfirm() {
  $('confirm-modal').style.display = 'none';
  state.confirmCallback = null;
}

/* ---- RENDER ---- */
var NO_FOOTER_PAGES = ['review', 'choose-mode', 'quiz', 'quiz-results', 'mock-instructions', 'mock-exam', 'mock-results'];

function render() {
  var main = $('main');
  var p = state.page;
  if (p === 'home') main.innerHTML = pageHome();
  else if (p === 'review') main.innerHTML = pageReview();
  else if (p === 'choose-mode') main.innerHTML = pageChooseMode();
  else if (p === 'quiz') { main.innerHTML = pageQuiz(); startQuizTimer(); }
  else if (p === 'quiz-results') main.innerHTML = pageQuizResults();
  else if (p === 'mock-instructions') main.innerHTML = pageMockInstructions();
  else if (p === 'mock-exam') { main.innerHTML = pageMockExam(); if (!state.mock.complete) startMockTimer(); }
  else if (p === 'mock-results') main.innerHTML = pageMockResults();
  else if (p === 'leaderboard') main.innerHTML = pageLeaderboard();
  else if (p === 'progress') main.innerHTML = pageProgress();
  else if (p === 'profile') main.innerHTML = pageProfile();
  else if (p === 'about') main.innerHTML = pageAbout();
  else main.innerHTML = pageHome();

  var footerEl = document.getElementById('footer');
  if (footerEl) footerEl.style.display = NO_FOOTER_PAGES.indexOf(p) !== -1 ? 'none' : '';
}

/* ============================================================
   LOGIN / AUTH FUNCTIONS
   FIREBASE: Replace the localStorage logic in each function
             with the corresponding Firebase Auth calls shown
             in the comments.
   ============================================================ */

/* --- Storage helpers (swap for Firebase Firestore calls later) --- */
function getLocalUsers() {
  try { return JSON.parse(localStorage.getItem('iskoprep_users') || '{}'); }
  catch (e) { return {}; }
}
function saveLocalUser(username, email, password, uid) {
  var users = getLocalUsers();
  users[username.toLowerCase()] = { username: username, email: email, password: password, uid: uid };
  localStorage.setItem('iskoprep_users', JSON.stringify(users));
}
function checkLocalUser(username, password) {
  var users = getLocalUsers();
  var u = users[username.toLowerCase()];
  if (u && u.password === password) return u;
  return null;
}

/* --- UI helpers --- */
function showLogin() {
  var ls = $('login-screen');
  if (ls) ls.style.display = 'flex';
  document.body.classList.add('login-open');
  updateScrollBtns();
}
function hideLogin() {
  var ls = $('login-screen');
  if (ls) ls.style.display = 'none';
  document.body.classList.remove('login-open');
  updateScrollBtns();
}
function switchLoginTab(tab) {
  var signin = $('tab-signin'); var signup = $('tab-signup');
  var fSignin = $('form-signin'); var fSignup = $('form-signup');
  if (!signin) return;
  if (tab === 'signin') {
    signin.classList.add('active'); signup.classList.remove('active');
    fSignin.style.display = 'flex'; fSignup.style.display = 'none';
    $('login-error').style.display = 'none';
  } else {
    signup.classList.add('active'); signin.classList.remove('active');
    fSignup.style.display = 'flex'; fSignin.style.display = 'none';
    $('register-error').style.display = 'none';
  }
}
function showLoginError(id, msg) {
  var el = $(id);
  if (!el) return;
  el.textContent = msg;
  el.style.display = 'block';
}
function togglePasswordVisibility(inputId, button) {
  var input = $(inputId);
  if (!input) return;
  var visible = input.type === 'text';
  input.type = visible ? 'password' : 'text';
  if (button) {
    button.classList.toggle('active', !visible);
    button.setAttribute('aria-label', visible ? 'Show password' : 'Hide password');
    var icon = button.querySelector('i');
    if (icon) {
      icon.classList.toggle('fa-eye-slash', visible);
      icon.classList.toggle('fa-eye', !visible);
    }
  }
}
function firebaseReady() {
  return !!(window.fbAuth && window.fbDb && window.fbFunctions);
}
function firebaseErrorMessage(err) {
  var code = err && err.code ? err.code : '';
  var messages = {
    'auth/email-already-in-use': 'That email is already registered. Please sign in instead, or use a different email.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/missing-password': 'Please enter your password.',
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/user-not-found': 'No account was found for that email.',
    'auth/wrong-password': 'Invalid email or password.',
    'auth/network-request-failed': 'Firebase could not be reached. Please check your connection and try again.',
    'auth/unauthorized-domain': 'This website domain is not authorized in Firebase Authentication settings.'
  };
  return messages[code] || 'Firebase error: ' + (err && err.message ? err.message : 'Something went wrong.');
}
function copyProgress(src) {
  return JSON.parse(JSON.stringify(src || AUTH_PROGRESS_DEFAULT));
}
function normalizeProgress(src) {
  var clean = copyProgress(AUTH_PROGRESS_DEFAULT);
  ['math', 'sci', 'eng', 'fil', 'abs'].forEach(function (sk) {
    var item = src && src[sk] ? src[sk] : {};
    clean[sk] = {
      pct: Number(item.pct) || 0,
      quizzes: Number(item.quizzes) || 0,
      correct: Number(item.correct) || 0,
      total: Number(item.total) || 0
    };
    clean[sk].pct = clean[sk].total ? Math.round((clean[sk].correct / clean[sk].total) * 100) : 0;
  });
  return clean;
}
function isDemoProgress(src) {
  if (!src) return false;
  return ['math', 'sci', 'eng', 'fil', 'abs'].every(function (sk) {
    var a = src[sk] || {};
    var b = DEMO_PROGRESS_SIGNATURE[sk];
    return Number(a.pct) === b.pct && Number(a.quizzes) === b.quizzes && Number(a.correct) === b.correct && Number(a.total) === b.total;
  });
}
function progressSummary() {
  var totalQuizzes = 0;
  var totalCorrect = 0;
  var totalQuestions = 0;
  var bestSubject = null;
  var bestPct = -1;
  ['math', 'sci', 'eng', 'fil', 'abs'].forEach(function (sk) {
    var p = PROGRESS[sk] || { pct: 0, quizzes: 0, correct: 0, total: 0 };
    totalQuizzes += Number(p.quizzes) || 0;
    totalCorrect += Number(p.correct) || 0;
    totalQuestions += Number(p.total) || 0;
    if ((Number(p.quizzes) || 0) > 0 && p.pct > bestPct) {
      bestPct = p.pct;
      bestSubject = sk;
    }
  });
  return {
    totalQuizzes: totalQuizzes,
    totalCorrect: totalCorrect,
    totalQuestions: totalQuestions,
    avgScore: totalQuestions ? Math.round((totalCorrect / totalQuestions) * 100) : 0,
    bestSubject: bestSubject,
    mockExams: Number(state.user.mockExams) || 0,
    mockCorrect: Number(state.user.mockCorrect) || 0,
    mockTotal: Number(state.user.mockTotal) || 0,
    totalPoints: totalCorrect + (Number(state.user.mockCorrect) || 0),
    totalPossiblePoints: totalQuestions + (Number(state.user.mockTotal) || 0),
    streak: Number(state.user.streak) || 0
  };
}
function todayKey() {
  return new Date().toISOString().slice(0, 10);
}
function yesterdayKey() {
  var d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}
function updateUserActivityStats(isMockExam, score, total) {
  if (!state.user.uid || !firebaseReady()) return;
  var lastStudyDate = state.user.lastStudyDate || '';
  var today = todayKey();
  var newStreak = Number(state.user.streak) || 0;
  if (lastStudyDate !== today) {
    newStreak = lastStudyDate === yesterdayKey() ? newStreak + 1 : 1;
  }
  state.user.streak = newStreak;
  state.user.lastStudyDate = today;
  if (isMockExam) {
    state.user.mockExams = (Number(state.user.mockExams) || 0) + 1;
    state.user.mockCorrect = (Number(state.user.mockCorrect) || 0) + (Number(score) || 0);
    state.user.mockTotal = (Number(state.user.mockTotal) || 0) + (Number(total) || 0);
  }
  var update = {
    streak: state.user.streak,
    lastStudyDate: state.user.lastStudyDate
  };
  if (isMockExam) {
    update.mockExams = state.user.mockExams;
    update.mockCorrect = state.user.mockCorrect;
    update.mockTotal = state.user.mockTotal;
  }
  window.fbFunctions.updateDoc(window.fbFunctions.doc(window.fbDb, 'users', state.user.uid), update)
    .catch(function (err) { console.warn('Could not update user activity stats', err); });
}
function setBadgeState(savedBadges) {
  BADGES.forEach(function (badge, i) {
    badge.earned = Array.isArray(savedBadges) ? !!savedBadges[i] : false;
  });
}
function isInteractiveAudioTarget(el) {
  if (!el || !el.closest) return null;
  return el.closest('button, a, input, select, textarea, [onclick], [role="button"], .card, .quiz-option, .q-nav, .settings-item, .path-card, .subject-card, .lesson-card, .answer-option, .login-tab');
}
function unlockUiAudio() {
  uiAudioUnlocked = true;
  if (!uiAudioContext && (window.AudioContext || window.webkitAudioContext)) {
    uiAudioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (uiAudioContext && uiAudioContext.state === 'suspended') {
    uiAudioContext.resume().catch(function () { });
  }
}
function playAudioFile(src) {
  var audio = new Audio(src);
  audio.volume = UI_AUDIO.volume;
  audio.currentTime = 0;
  audio.play().catch(function () { });
}
function playGeneratedUiTone(type) {
  if (!uiAudioContext) return;
  var now = uiAudioContext.currentTime;
  var oscillator = uiAudioContext.createOscillator();
  var gain = uiAudioContext.createGain();
  oscillator.type = type === 'hover' ? 'sine' : 'triangle';
  oscillator.frequency.setValueAtTime(type === 'hover' ? 520 : 780, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(UI_AUDIO.volume * 0.08, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + (type === 'hover' ? 0.055 : 0.09));
  oscillator.connect(gain);
  gain.connect(uiAudioContext.destination);
  oscillator.start(now);
  oscillator.stop(now + (type === 'hover' ? 0.06 : 0.1));
}
function playGeneratedResultTone(level) {
  if (!uiAudioContext) return;
  var now = uiAudioContext.currentTime;
  var patterns = {
    excellent: [784, 988, 1175],
    good: [587, 740],
    needsPractice: [392, 330]
  };
  (patterns[level] || patterns.good).forEach(function (freq, i) {
    var start = now + i * 0.11;
    var oscillator = uiAudioContext.createOscillator();
    var gain = uiAudioContext.createGain();
    oscillator.type = level === 'needsPractice' ? 'sine' : 'triangle';
    oscillator.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(UI_AUDIO.volume * 0.12, start + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.1);
    oscillator.connect(gain);
    gain.connect(uiAudioContext.destination);
    oscillator.start(start);
    oscillator.stop(start + 0.11);
  });
}
function playUiAudio(type) {
  if (!UI_AUDIO.enabled || !uiAudioUnlocked) return;
  var now = Date.now();
  var cooldown = type === 'hover' ? 80 : 45;
  if (now - uiAudioLastPlayed[type] < cooldown) return;
  uiAudioLastPlayed[type] = now;
  var src = type === 'hover' ? UI_AUDIO.hoverSrc : UI_AUDIO.clickSrc;
  if (src) playAudioFile(src);
  else playGeneratedUiTone(type);
}
function playScoreResultAudio(isHighScore) {
    const audio = new Audio(isHighScore ? 'high_score.mp3' : 'low score.mp3');
    audio.play();
}
function playMockScoreAudio(correct) {
    var src;
    if (correct >= 31) src = '31-40.mp3';
    else if (correct >= 21) src = '21-30mp3';
    else if (correct >= 11) src = '11-20.wav';
    else src = '1-10.wav';
    var audio = new Audio(src);
    audio.volume = 1.0;
    var p = audio.play();
    if (p && typeof p.catch === 'function') p.catch(function(err) { console.warn('Mock score audio blocked:', err); });
}
function playNavAudio() {
    var audio = new Audio('leader-progress.mp3');
    audio.volume = 1.0;
    var p = audio.play();
    if (p && typeof p.catch === 'function') p.catch(function(err) { console.warn('Nav audio blocked:', err); });
}
/* ---- SEARCH ---- */
var SEARCH_ITEMS = [
  { label: 'Start Review', desc: 'Practice quizzes by subject and difficulty', icon: 'fa-book-open', action: function() { goTo('review'); } },
  { label: 'Mock PLMAT Exam', desc: 'Full 40-question timed simulation', icon: 'fa-graduation-cap', action: function() { goTo('mock-instructions'); } },
  { label: 'Leaderboard', desc: 'See top performers and your rank', icon: 'fa-trophy', action: function() { playNavAudio(); goTo('leaderboard'); } },
  { label: 'Progress Tracker', desc: 'Monitor growth and earn badges', icon: 'fa-chart-line', action: function() { playNavAudio(); goTo('progress'); } },
  { label: 'Mathematics', desc: 'Arithmetic, Geometry, Algebra, Statistics', icon: 'fa-square-root-variable', action: function() { goTo('review'); } },
  { label: 'Mathematics – Easy', desc: 'Arithmetic & Fractions', icon: 'fa-calculator', action: function() { state.quiz = { mode: 'math_easy', subject: 'Mathematics', lesson: 'Arithmetic & Fractions', subKey: 'math', current: 0, answers: {}, resultAudioPlayed: false }; goTo('quiz'); } },
  { label: 'Mathematics – Moderate', desc: 'Geometry', icon: 'fa-calculator', action: function() { state.quiz = { mode: 'math_moderate', subject: 'Mathematics', lesson: 'Geometry', subKey: 'math', current: 0, answers: {}, resultAudioPlayed: false }; goTo('quiz'); } },
  { label: 'Mathematics – Hard', desc: 'Algebra', icon: 'fa-calculator', action: function() { state.quiz = { mode: 'math_hard', subject: 'Mathematics', lesson: 'Algebra', subKey: 'math', current: 0, answers: {}, resultAudioPlayed: false }; goTo('quiz'); } },
  { label: 'Mathematics – Advanced', desc: 'Statistics & Probability', icon: 'fa-calculator', action: function() { state.quiz = { mode: 'math_advanced', subject: 'Mathematics', lesson: 'Statistics & Probability', subKey: 'math', current: 0, answers: {}, resultAudioPlayed: false }; goTo('quiz'); } },
  { label: 'Science', desc: 'Biology, Chemistry, Physics, Earth Science', icon: 'fa-atom', action: function() { goTo('review'); } },
  { label: 'Science – Easy', desc: 'Basic Biology', icon: 'fa-atom', action: function() { state.quiz = { mode: 'sci_easy', subject: 'Science', lesson: 'Basic Biology', subKey: 'sci', current: 0, answers: {}, resultAudioPlayed: false }; goTo('quiz'); } },
  { label: 'Science – Moderate', desc: 'Chemistry', icon: 'fa-atom', action: function() { state.quiz = { mode: 'sci_moderate', subject: 'Science', lesson: 'Chemistry', subKey: 'sci', current: 0, answers: {}, resultAudioPlayed: false }; goTo('quiz'); } },
  { label: 'Science – Hard', desc: 'Physics', icon: 'fa-atom', action: function() { state.quiz = { mode: 'sci_hard', subject: 'Science', lesson: 'Physics', subKey: 'sci', current: 0, answers: {}, resultAudioPlayed: false }; goTo('quiz'); } },
  { label: 'Science – Advanced', desc: 'Earth & Environmental Science', icon: 'fa-atom', action: function() { state.quiz = { mode: 'sci_advanced', subject: 'Science', lesson: 'Earth & Environmental Science', subKey: 'sci', current: 0, answers: {}, resultAudioPlayed: false }; goTo('quiz'); } },
  { label: 'English', desc: 'Vocabulary, Grammar, Reading, Literature', icon: 'fa-language', action: function() { goTo('review'); } },
  { label: 'English – Easy', desc: 'Vocabulary & Word Meanings', icon: 'fa-language', action: function() { state.quiz = { mode: 'eng_easy', subject: 'English', lesson: 'Vocabulary & Word Meanings', subKey: 'eng', current: 0, answers: {}, resultAudioPlayed: false }; goTo('quiz'); } },
  { label: 'English – Moderate', desc: 'Grammar & Sentence Completion', icon: 'fa-language', action: function() { state.quiz = { mode: 'eng_moderate', subject: 'English', lesson: 'Grammar & Sentence Completion', subKey: 'eng', current: 0, answers: {}, resultAudioPlayed: false }; goTo('quiz'); } },
  { label: 'English – Hard', desc: 'Reading Comprehension', icon: 'fa-language', action: function() { state.quiz = { mode: 'eng_hard', subject: 'English', lesson: 'Reading Comprehension', subKey: 'eng', current: 0, answers: {}, resultAudioPlayed: false }; goTo('quiz'); } },
  { label: 'English – Advanced', desc: 'Literature & Critical Analysis', icon: 'fa-language', action: function() { state.quiz = { mode: 'eng_advanced', subject: 'English', lesson: 'Literature & Critical Analysis', subKey: 'eng', current: 0, answers: {}, resultAudioPlayed: false }; goTo('quiz'); } },
  { label: 'Logical Reasoning', desc: 'Analogies, Patterns, Classification, Series', icon: 'fa-brain', action: function() { goTo('review'); } },
  { label: 'Logical Reasoning – Easy', desc: 'Analogies', icon: 'fa-brain', action: function() { state.quiz = { mode: 'log_easy', subject: 'Logical Reasoning', lesson: 'Analogies', subKey: 'log', current: 0, answers: {}, resultAudioPlayed: false }; goTo('quiz'); } },
  { label: 'Logical Reasoning – Moderate', desc: 'Pattern Recognition', icon: 'fa-brain', action: function() { state.quiz = { mode: 'log_moderate', subject: 'Logical Reasoning', lesson: 'Pattern Recognition', subKey: 'log', current: 0, answers: {}, resultAudioPlayed: false }; goTo('quiz'); } },
  { label: 'Logical Reasoning – Hard', desc: 'Classification', icon: 'fa-brain', action: function() { state.quiz = { mode: 'log_hard', subject: 'Logical Reasoning', lesson: 'Classification', subKey: 'log', current: 0, answers: {}, resultAudioPlayed: false }; goTo('quiz'); } },
  { label: 'Logical Reasoning – Advanced', desc: 'Number Series & Critical Thinking', icon: 'fa-brain', action: function() { state.quiz = { mode: 'log_advanced', subject: 'Logical Reasoning', lesson: 'Number Series & Critical Thinking', subKey: 'log', current: 0, answers: {}, resultAudioPlayed: false }; goTo('quiz'); } }
];
var _searchMatches = [];
function handleSearch(val) {
  var box = document.getElementById('search-results-box');
  if (!box) return;
  var q = val.trim().toLowerCase();
  if (!q) { box.style.display = 'none'; _searchMatches = []; return; }
  _searchMatches = SEARCH_ITEMS.filter(function(item) {
    return item.label.toLowerCase().indexOf(q) !== -1 || item.desc.toLowerCase().indexOf(q) !== -1;
  });
  if (_searchMatches.length === 0) {
    box.innerHTML = '<div class="search-no-results"><i class="fas fa-search"></i> No results found for "' + val + '"</div>';
  } else {
    box.innerHTML = _searchMatches.map(function(item, i) {
      return '<div class="search-result-item" onclick="doSearch(' + i + ')">' +
        '<span class="search-result-icon"><i class="fas ' + item.icon + '"></i></span>' +
        '<div><div class="search-result-label">' + item.label + '</div>' +
        '<div class="search-result-desc">' + item.desc + '</div></div>' +
        '</div>';
    }).join('');
  }
  box.style.display = 'block';
}
function handleSearchKey(e) {
  if (e.key === 'Enter' && _searchMatches.length > 0) { doSearch(0); }
  if (e.key === 'Escape') { closeSearch(); }
}
function doSearch(idx) {
  var item = _searchMatches[idx];
  if (!item) return;
  closeSearch();
  item.action();
}
function closeSearch() {
  var box = document.getElementById('search-results-box');
  if (box) box.style.display = 'none';
  var inp = document.getElementById('site-search');
  if (inp) inp.value = '';
  _searchMatches = [];
}
function leaderboardScore(entry) {
  return Number(entry.totalPoints) || Number(entry.totalCorrect) || 0;
}
function normalizeLeaderboardEntries(entries) {
  var map = {};
  entries.forEach(function (entry) {
    if (!entry) return;
    var key = entry.uid || entry.name || Math.random().toString(36);
    var current = map[key];
    if (!current || leaderboardScore(entry) > leaderboardScore(current)) {
      map[key] = entry;
    }
  });
  return Object.keys(map).map(function (key) { return map[key]; }).sort(function (a, b) {
    var pointDiff = leaderboardScore(b) - leaderboardScore(a);
    if (pointDiff) return pointDiff;
    return (Number(b.avgScore) || 0) - (Number(a.avgScore) || 0);
  });
}
function setupInteractiveAudio() {
  document.addEventListener('pointerdown', function () {
    unlockUiAudio();
  }, true);
  document.addEventListener('keydown', function () {
    unlockUiAudio();
  }, true);
  document.addEventListener('mouseover', function (event) {
    var target = isInteractiveAudioTarget(event.target);
    if (!target || target === uiAudioHoverTarget) return;
    uiAudioHoverTarget = target;
    playUiAudio('hover');
  }, true);
  document.addEventListener('mouseout', function (event) {
    if (uiAudioHoverTarget && (!event.relatedTarget || !uiAudioHoverTarget.contains(event.relatedTarget))) {
      uiAudioHoverTarget = null;
    }
  }, true);
  document.addEventListener('click', function (event) {
    if (isInteractiveAudioTarget(event.target)) playUiAudio('click');
    var box = document.getElementById('search-results-box');
    var inp = document.getElementById('site-search');
    if (box && inp && !box.contains(event.target) && event.target !== inp) {
      box.style.display = 'none';
    }
  }, true);
}
function stopLeaderboardListener() {
  if (leaderboardUnsubscribe) {
    leaderboardUnsubscribe();
    leaderboardUnsubscribe = null;
  }
}

/* --- Sign In ---
   FIREBASE: Replace body with:
     signInWithEmailAndPassword(auth, email, password)
       .then(cred => { setUserState(cred.user); hideLogin(); render(); })
       .catch(err => showLoginError('login-error', err.message));
*/
function doLogin() {
  var username = $('signin-username').value.trim(); // treated as email
  var password = $('signin-password').value;
  $('login-error').style.display = 'none';

  if (!username || !password) {
    showLoginError('login-error', 'Please fill in all fields.'); return;
  }

  if (!firebaseReady()) {
    showLoginError('login-error', 'Firebase is still loading. Please try again in a moment.'); return;
  }

  authActionInProgress = true;
  var F = window.fbFunctions;
  F.signInWithEmailAndPassword(window.fbAuth, username, password)
    .then(function () {
      // onAuthStateChanged fires and handles state + UI update
    })
    .catch(function (err) {
      authActionInProgress = false;
      showLoginError('login-error', firebaseErrorMessage(err));
    });
}

/* --- Register ---
   FIREBASE: Replace body with:
     createUserWithEmailAndPassword(auth, email, password)
       .then(cred => updateProfile(cred.user, { displayName: username })
         .then(() => { setUserState(cred.user); hideLogin(); render(); }))
       .catch(err => showLoginError('register-error', err.message));
*/
function doRegister() {
  var username = $('signup-username').value.trim();
  var email = $('signup-email').value.trim().toLowerCase();
  var password = $('signup-password').value;
  var confirm = $('signup-confirm').value;
  $('register-error').style.display = 'none';

  if (!username || !email || !password || !confirm) {
    showLoginError('register-error', 'Please fill in all fields.'); return;
  }
  if (password !== confirm) {
    showLoginError('register-error', 'Passwords do not match.'); return;
  }
  if (password.length < 6) {
    showLoginError('register-error', 'Password must be at least 6 characters.'); return;
  }

  if (!firebaseReady()) {
    showLoginError('register-error', 'Firebase is still loading. Please try again in a moment.'); return;
  }

  authActionInProgress = true;
  var F = window.fbFunctions;
  F.createUserWithEmailAndPassword(window.fbAuth, email, password)
    .then(function (cred) {
      return F.updateProfile(cred.user, { displayName: username }).then(function () {
        // Create the user document in Firestore
        return F.setDoc(F.doc(window.fbDb, 'users', cred.user.uid), {
          username: username,
          email: email,
          uid: cred.user.uid,
          joinedAt: F.serverTimestamp(),
          streak: 0,
          mockExams: 0,
          mockCorrect: 0,
          mockTotal: 0,
          lastStudyDate: '',
          subject: 'math',
          icon: 'fa-star',
          progress: {
            math: { pct: 0, quizzes: 0, correct: 0, total: 0 },
            sci: { pct: 0, quizzes: 0, correct: 0, total: 0 },
            eng: { pct: 0, quizzes: 0, correct: 0, total: 0 },
            log: { pct: 0, quizzes: 0, correct: 0, total: 0 }
          },
          badges: []
        });
      });
    })
    .then(function () {
      // onAuthStateChanged will fire automatically and handle the rest
    })
    .catch(function (err) {
      authActionInProgress = false;
      showLoginError('register-error', firebaseErrorMessage(err));
    });
}

/* --- Log Out ---
   FIREBASE: Replace body with: signOut(auth)
*/
function showLogoutConfirm() {
  var modal = document.getElementById('logout-modal');
  if (modal) modal.style.display = 'flex';
}

function closeLogoutConfirm() {
  var modal = document.getElementById('logout-modal');
  if (modal) modal.style.display = 'none';
}

function confirmLogout() {
  closeLogoutConfirm();
  doLogout();
}

function doLogout() {
  authActionInProgress = false;
  window.fbFunctions.signOut(window.fbAuth).then(function () {
    state.user = { uid: null, username: null, email: null, loggedIn: false };
    stopLeaderboardListener();
    showLogin();
  });
}

/* --- Guest Mode --- */
function guestMode() {
  authActionInProgress = false;
  // Guest mode: no Firebase auth. Progress is not saved.
  state.user = { uid: null, username: 'Guest', email: '', loggedIn: true, streak: 0, mockExams: 0, mockCorrect: 0, mockTotal: 0 };
  hideLogin();
  
  // FETCH QUESTIONS FOR GUESTS TOO
  if (firebaseReady()) {
    var F = window.fbFunctions;
    F.getDocs(F.collection(window.fbDb, 'questions'))
      .then(function (qSnap) {
        qSnap.forEach(function (docSnap) {
          QUESTIONS[docSnap.id] = docSnap.data();
        });
        buildMock(); // Rebuild mock exam pool with Firebase data
      })
      .catch(function (err) {
        console.warn('Guest mode: Could not load questions from Firestore', err);
      });
  }

  render();
}

/* ============================================================
   SCROLL BUTTON FUNCTIONS
   ============================================================ */
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function scrollToBottom() {
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}
function updateScrollBtns() {
  var up = $('scroll-up-btn'); var down = $('scroll-down-btn');
  if (!up || !down) return;
  var loginVisible = $('login-screen') && $('login-screen').style.display !== 'none';
  var max = document.documentElement.scrollHeight - window.innerHeight;
  if (loginVisible || max <= 0) {
    up.style.display = 'none';
    down.style.display = 'none';
    return;
  }
  up.style.display = 'flex';
  down.style.display = 'flex';
  var pos = window.scrollY;
  up.style.opacity = pos > 80 ? '0.85' : '0.3';
  down.style.opacity = (max - pos) > 80 ? '0.85' : '0.3';
}

/* ============================================================
   PAGE: HOME
   ============================================================ */
function pageHome() {
  return '<div class="page">' +

    /* WELCOME */
    '<section class="sec" style="text-align:center;">' +
    '<div class="welcome-banner">' +
    '<h1 class="bng"><i class="fas fa-star" style="color:var(--gold);margin-right:10px;"></i>WELCOME, ISKO!<i class="fas fa-star" style="color:var(--gold);margin-left:10px;"></i></h1>' +
    '<p style="margin-top:14px;">Your journey to becoming a proud PLMAYER here. Master the PLMAT with confidence, one question at a time. We believe in you !! now let\'s get to work!</p>' +
    '</div>' +
    '</section>' +

    /* WHY CHOOSE */
    '<section class="sec">' +
    '<div class="wrap">' +
    '<h2 class="bng sec-title"><i class="fas fa-question-circle" style="color:var(--gold);margin-right:10px;"></i>WHY CHOOSE ISKOPREP?</h2>' +
    '<p class="sec-sub">The complete PLMAT preparation platform built by PLMAYERS. Thousands of students have already taken the first step — join them today!</p>' +
    '<div class="why-grid">' +
    '<div class="why-card ' + subClass('math') + ' card">' +
    '<div class="why-icon"><i class="fas fa-calculator"></i></div>' +
    '<h3 class="bng" style="font-size:26px;color:#fff;margin-bottom:12px;">PRACTICE PROBLEMS</h3>' +
    '<p style="color:' + subTextColor('math') + ';font-size:16px;line-height:1.8;">Practice with a focused question bank across the core PLMAT subjects. Your scores and quiz counts start at zero and grow only from the quizzes you actually complete.</p>' +
    '<div class="why-tags"><span class="why-tag"><i class="fas fa-database"></i> Firebase Saved</span><span class="why-tag"><i class="fas fa-calculator"></i> Math Focus</span></div>' +
    '</div>' +
    '<div class="why-card ' + subClass('sci') + ' card">' +
    '<div class="why-icon"><i class="fas fa-flask"></i></div>' +
    '<h3 class="bng" style="font-size:26px;color:#fff;margin-bottom:12px;">INTERACTIVE QUIZZES</h3>' +
    '<p style="color:' + subTextColor('sci') + ';font-size:16px;line-height:1.8;">Timed quizzes simulate exam pressure while keeping your results tied to your signed-in account. No demo scores are added to your tracker.</p>' +
    '<div class="why-tags"><span class="why-tag"><i class="fas fa-stopwatch"></i> Timed Practice</span><span class="why-tag"><i class="fas fa-flask"></i> Science Focus</span></div>' +
    '</div>' +
    '<div class="why-card ' + subClass('eng') + ' card">' +
    '<div class="why-icon"><i class="fas fa-spell-check"></i></div>' +
    '<h3 class="bng" style="font-size:26px;color:#fff;margin-bottom:12px;">VOCABULARY BUILDER</h3>' +
    '<p style="color:' + subTextColor('eng') + ';font-size:16px;line-height:1.8;">Join 12,000+ students who dramatically expanded their vocabulary and aced the English section of the PLMAT! Our word-building exercises are designed to improve comprehension, grammar fluency, and reading speed — all the skills you need to dominate on exam day. Words are power. Build yours here.</p>' +
    '<div class="why-tags"><span class="why-tag"><i class="fas fa-book"></i> English Focus</span><span class="why-tag"><i class="fas fa-chart-line"></i> Real Progress</span></div>' +
    '</div>' +
    '<div class="why-card ' + subClass('log') + ' card">' +
    '<div class="why-icon"><i class="fas fa-puzzle-piece"></i></div>' +
    '<h3 class="bng" style="font-size:26px;color:#fff;margin-bottom:12px;">PATTERN RECOGNITION</h3>' +
    '<p style="color:' + subTextColor('log') + ';font-size:16px;line-height:1.8;">Trusted by top PLMAT scorers nationwide with a 98% satisfaction rating! Our logical reasoning exercises train your brain to spot patterns faster, classify accurately, and solve analogies under pressure. These exact techniques are used by top performers. Learn them. Master them. Dominate the exam.</p>' +
    '<div class="why-tags"><span class="why-tag"><i class="fas fa-fire"></i> 98% Rating</span><span class="why-tag"><i class="fas fa-brain"></i> Logic Focus</span></div>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</section>' +

    /* CHOOSE YOUR PATH */
    '<section class="sec">' +
    '<div class="wrap">' +
    '<h2 class="bng sec-title"><i class="fas fa-compass" style="color:var(--gold);margin-right:10px;"></i>CHOOSE YOUR PATH</h2>' +
    '<p class="sec-sub">Every journey starts with a single step. Pick where you want to go today and let IskoPrep guide you the rest of the way.</p>' +

    '<div class="path-grid">' +

    '<div class="path-card" onclick="goTo(\'review\')" style="border-left:5px solid var(--math-a);--pc:var(--math-a);">' +
    '<div class="path-icon grad-math"><i class="fas fa-book-open"></i></div>' +
    '<div class="path-body">' +
    '<div class="path-title-row">' +
    '<h3 class="bng path-title">START REVIEW</h3>' +
    '<span class="path-label" style="background:var(--math-a);">STUDY</span>' +
    '</div>' +
    '<p class="path-desc"><i class="fas fa-layer-group" style="color:var(--math-a);margin-right:8px;"></i>Practice by subject and difficulty level</p>' +
    '<div class="path-stars">' + stars(5) + '</div>' +
    '</div>' +
    '<button class="btn-gold bng path-btn"><i class="fas fa-play"></i> <span class="path-btn-text">START NOW</span></button>' +
    '</div>' +

    '<div class="path-card" onclick="goTo(\'mock-instructions\')" style="border-left:5px solid var(--sci-a);--pc:var(--sci-a);">' +
    '<div class="path-icon grad-sci"><i class="fas fa-graduation-cap"></i></div>' +
    '<div class="path-body">' +
    '<div class="path-title-row">' +
    '<h3 class="bng path-title">MOCK PLMAT EXAM</h3>' +
    '<span class="path-label" style="background:var(--sci-b);">TEST</span>' +
    '</div>' +
    '<p class="path-desc"><i class="fas fa-clock" style="color:var(--sci-a);margin-right:8px;"></i>Full simulation — 40 questions, 1 hour 30 minutes</p>' +
    '<div class="path-stars">' + stars(5) + '</div>' +
    '</div>' +
    '<button class="btn-gold bng path-btn"><i class="fas fa-play"></i> <span class="path-btn-text">SIMULATE</span></button>' +
    '</div>' +

    '<div class="path-card" onclick="playNavAudio();goTo(\'leaderboard\')" style="border-left:5px solid var(--log-a);--pc:var(--log-a);">' +
    '<div class="path-icon grad-log"><i class="fas fa-trophy"></i></div>' +
    '<div class="path-body">' +
    '<div class="path-title-row">' +
    '<h3 class="bng path-title">LEADERBOARD</h3>' +
    '<span class="path-label" style="background:var(--log-a);color:#1a0a0a;">COMPETE</span>' +
    '</div>' +
    '<p class="path-desc"><i class="fas fa-ranking-star" style="color:var(--log-a);margin-right:8px;"></i>See the top performers and where you rank</p>' +
    '<div class="path-stars">' + stars(5) + '</div>' +
    '</div>' +
    '<button class="btn-gold bng path-btn"><i class="fas fa-eye"></i> <span class="path-btn-text">VIEW</span></button>' +
    '</div>' +

    '<div class="path-card" onclick="playNavAudio();goTo(\'progress\')" style="border-left:5px solid var(--eng-a);--pc:var(--eng-a);">' +
    '<div class="path-icon grad-eng"><i class="fas fa-chart-line"></i></div>' +
    '<div class="path-body">' +
    '<div class="path-title-row">' +
    '<h3 class="bng path-title">PROGRESS TRACKER</h3>' +
    '<span class="path-label" style="background:var(--eng-b);">TRACK</span>' +
    '</div>' +
    '<p class="path-desc"><i class="fas fa-chart-bar" style="color:var(--eng-a);margin-right:8px;"></i>Monitor your growth and earn achievement badges</p>' +
    '<div class="path-stars">' + stars(5) + '</div>' +
    '</div>' +
    '<button class="btn-gold bng path-btn"><i class="fas fa-arrow-right"></i> <span class="path-btn-text">CHECK</span></button>' +
    '</div>' +

    '</div>' +

    '</div>' +
    '</section>' +

    /* BENEFIT BOXES */
    /* BENEFIT BOXES */
    '<section class="sec">' +
    '<div class="wrap">' +
    '<h2 class="bng sec-title">THE ISKOPREP DIFFERENCE</h2>' +
    '<p class="sec-sub">We didn\'t just build a quiz app. We built a system that transforms how you prepare — and how you perform on exam day.</p>' +
    '<div class="benefit-grid">' +

    // Card 1
    '<div class="benefit-card ' + subClass('math') + ' card">' +
    '<div class="why-icon"><i class="fas fa-rocket"></i></div>' +
    '<h3 class="bng" style="font-size:26px;color:#fff;margin-bottom:12px;">ACCELERATE YOUR LEARNING</h3>' +
    '<p style="color:' + subTextColor('math') + ';font-size:16px;line-height:1.8;">Master complex concepts faster with our proven study techniques. Thousands of students have cut their preparation time in half while achieving better scores. Smart practice beats long hours — every time.</p>' +
    '<div class="benefit-img" id="img-accelerate">' +
    '<img src="Accelerate_your_learning.png" alt="Accelerate Learning">' +
    '</div>' +
    '</div>' +

    // Card 2
    '<div class="benefit-card ' + subClass('sci') + ' card">' +
    '<div class="why-icon"><i class="fas fa-shield-halved"></i></div>' +
    '<h3 class="bng" style="font-size:26px;color:#fff;margin-bottom:12px;">BUILD LASTING CONFIDENCE</h3>' +
    '<p style="color:' + subTextColor('sci') + ';font-size:16px;line-height:1.8;">Transform test anxiety into unstoppable confidence. Our systematic approach ensures you walk into the PLMAT exam feeling prepared, focused, and ready to excel. Confidence is a skill — and we teach it.</p>' +
    '<div class="benefit-img" id="img-confidence">' +
    '<img src="Build_lasting_confidence.png" alt="Build Confidence">' +
    '</div>' +
    '</div>' +

    // Card 3
    '<div class="benefit-card ' + subClass('eng') + ' card">' +
    '<div class="why-icon"><i class="fas fa-medal"></i></div>' +
    '<h3 class="bng" style="font-size:26px;color:#fff;margin-bottom:12px;">TRACK EVERY VICTORY</h3>' +
    '<p style="color:' + subTextColor('eng') + ';font-size:16px;line-height:1.8;">Watch your progress soar with detailed analytics and personalized insights. Celebrate every milestone as you climb toward your goal. Your improvement is visible, measurable, and motivating — every single day.</p>' +
    '<div class="benefit-img" id="img-victory">' +
    '<img src="Track_every_victories.png" alt="Track Victory">' +
    '</div>' +
    '</div>' +

    // Card 4
    '<div class="benefit-card ' + subClass('log') + ' card">' +
    '<div class="why-icon"><i class="fas fa-lightbulb"></i></div>' +
    '<h3 class="bng" style="font-size:26px;color:#fff;margin-bottom:12px;">STUDY SMARTER, NOT HARDER</h3>' +
    '<p style="color:' + subTextColor('log') + ';font-size:16px;line-height:1.8;">Work efficiently with targeted practice that focuses on what matters most. Our intelligent system adapts to your strengths and weaknesses, maximizing every minute of study time. Study smarter. Score higher. Live the dream.</p>' +
    '<div class="benefit-img" id="img-smarter">' +
    '<img src="Study_smarter.png" alt="Study Smarter">' +
    '</div>' +
    '</div>' +

    '</div>' +
    '</div>' +
    '</section>' +

    /* HERO SECTION */
    '<div class="hero-section">' +
    '<div class="hero-section-inner">' +
    '<div class="hero-grid">' +
    '<div>' +
    '<div class="contact-section-label"><i class="fas fa-envelope"></i> CONTACT US</div>' +
    '<h2 class="bng" style="font-size:38px;color:#fff;margin-bottom:6px;"><i class="fas fa-headset" style="color:var(--gold);"></i> GET IN TOUCH</h2>' +
    '<p style="color:#bbb;font-size:16px;margin-bottom:28px;line-height:1.6;">Have questions about IskoPrep? We\'re here to help you on your PLMAT journey.</p>' +
    '<div class="contact-row"><i class="fas fa-envelope"></i> support@iskoprep.com</div>' +
    '<div class="contact-row"><i class="fas fa-phone"></i> +63 912 345 6789</div>' +
    '<div class="contact-row"><i class="fas fa-map-marker-alt"></i> Intramuros, Manila City, Philippines</div>' +
    '<div class="contact-row"><i class="fas fa-paper-plane"></i> Send us your feedback anytime!</div>' +
    '<h3 class="bng" style="color:var(--gold);font-size:22px;margin:24px 0 14px;"><i class="fas fa-share-nodes"></i> FOLLOW US</h3>' +
    '<div class="social-row">' +
    '<div class="social-btn" style="background:#3b5998;" title="Facebook"><i class="fab fa-facebook-f"></i></div>' +
    '<div class="social-btn" style="background:linear-gradient(135deg,#f58529,#dd2a7b);" title="Instagram"><i class="fab fa-instagram"></i></div>' +
    '<div class="social-btn" style="background:#000;" title="TikTok"><i class="fab fa-tiktok"></i></div>' +
    '<div class="social-btn" style="background:#1da1f2;" title="Twitter/X"><i class="fab fa-x-twitter"></i></div>' +
    '</div>' +
    '<div class="search-wrap" style="position:relative;">' +
    '<i class="fas fa-search"></i>' +
    '<input id="site-search" type="text" placeholder="Search topics, lessons, or features..." autocomplete="off" oninput="handleSearch(this.value)" onkeydown="handleSearchKey(event)" onfocus="if(this.value)handleSearch(this.value)">' +
    '<div id="search-results-box" class="search-results-box" style="display:none;"></div>' +
    '</div>' +
    '</div>' +
    '<div>' +
    '<div class="stat-grid">' +
    '<div class="stat-card card grad-math glow-math">' +
    '<div class="stat-label" style="color:#e8d5f5;"><i class="fas fa-clipboard-list"></i> Your Quizzes</div>' +
    '<div class="stat-num bng" style="color:#fff;">' + progressSummary().totalQuizzes + '</div>' +
    '</div>' +
    '<div class="stat-card card grad-sci glow-sci">' +
    '<div class="stat-label" style="color:#d5f5e3;"><i class="fas fa-bullseye"></i> Avg Score</div>' +
    '<div class="stat-num bng" style="color:#fff;">' + progressSummary().avgScore + '%</div>' +
    '</div>' +
    '<div class="stat-card card grad-eng glow-eng">' +
    '<div class="stat-label" style="color:#fff5d5;"><i class="fas fa-file-alt"></i> Mock Exams</div>' +
    '<div class="stat-num bng" style="color:#fff;">' + progressSummary().mockExams + '</div>' +
    '</div>' +
    '<div class="stat-card card grad-log glow-log">' +
    '<div class="stat-label" style="color:#f5e8d5;"><i class="fas fa-check"></i> Correct Answers</div>' +
    '<div class="stat-num bng" style="color:#fff;">' + progressSummary().totalCorrect + '</div>' +
    '</div>' +
    '</div>' +
    '<div style="margin-top:24px;padding:28px;background:rgba(212,160,23,0.08);border:1px solid rgba(212,160,23,0.25);border-radius:16px;">' +
    '<h4 class="bng" style="color:var(--gold);font-size:20px;margin-bottom:12px;"><i class="fas fa-quote-left"></i> DAILY INSPIRATION</h4>' +
    '<p style="color:#ccc;font-size:15px;line-height:1.7;font-style:italic;">' + motivational() + '</p>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</div>' +

    '</div>';
}

/* ============================================================
   PAGE: START REVIEW
   ============================================================ */
function pageReview() {
  var subjects = [
    {
      key: 'eng', label: 'ENGLISH', icon: 'fa-language',
      meta: '50 items &bull; 20 mins',
      topics: [
        { k: 'eng_grammar', n: 'Correct Grammar Usage' },
        { k: 'eng_vocabulary', n: 'Vocabulary' },
        { k: 'eng_idioms', n: 'Idiomatic Expressions' },
        { k: 'eng_analogy', n: 'Word Analogy' },
        { k: 'eng_reading', n: 'Reading Comprehension' }
      ]
    },
    {
      key: 'sci', label: 'INTEGRATED SCIENCE', icon: 'fa-atom',
      meta: '40 items &bull; 25 mins',
      topics: [
        { k: 'sci_general', n: 'General Science' },
        { k: 'sci_cells', n: 'Cells' },
        { k: 'sci_gravitation', n: 'Law of Universal Gravitation' },
        { k: 'sci_physics', n: 'Physics' },
        { k: 'sci_newtonian', n: 'Newtonian Mechanics' },
        { k: 'sci_optics', n: 'Optics' },
        { k: 'sci_wave', n: 'Wave, Motion, and Acoustic' },
        { k: 'sci_thermo', n: 'Thermodynamics and Heat' },
        { k: 'sci_electro', n: 'Electromagnetism and Electronics' },
        { k: 'sci_chemistry', n: 'Chemistry' },
        { k: 'sci_analysis', n: 'Analysis and Application' },
        { k: 'sci_knowledge', n: 'Comprehension and Knowledge' }
      ]
    },
    {
      key: 'math', label: 'INTEGRATED MATHEMATICS', icon: 'fa-square-root-variable',
      meta: '40 items &bull; 40 mins',
      topics: [
        { k: 'math_basic', n: 'Basic Operations' },
        { k: 'math_statistics', n: 'Statistics' },
        { k: 'math_algebra', n: 'Algebra' },
        { k: 'math_geometry', n: 'Geometry' },
        { k: 'math_trig', n: 'Trigonometry' },
        { k: 'math_verbal', n: 'Verbal Problem Analysis' },
        { k: 'math_unitcircle', n: 'Unit Circle' }
      ]
    },
    {
      key: 'fil', label: 'FILIPINO', icon: 'fa-book',
      meta: '30 items &bull; 15 mins',
      topics: [
        { k: 'fil_gamit', n: 'Wastong Gamit ng Salita' },
        { k: 'fil_istruktura', n: 'Istruktura ng Pangungusap' },
        { k: 'fil_ugat', n: 'Pagtukoy sa Salitang Ugat' },
        { k: 'fil_idyoma', n: 'Idyoma at Talasalitaan' },
        { k: 'fil_pagsunod', n: 'Pagsusunod-sunod ng Talata at Pangungusap' },
        { k: 'fil_unawa', n: 'Pag-unawa sa Binasa' },
        { k: 'fil_kahulugan', n: 'Kasingkahulugan at Kasalungat ng Salita' }
      ]
    },
    {
      key: 'abs', label: 'ABSTRACT REASONING', icon: 'fa-shapes',
      meta: '30 items &bull; 10 mins',
      note: '<i class="fas fa-image" style="margin-right:6px;color:rgba(255,255,255,0.7);"></i>This section uses images — replace placeholder images with real patterns.',
      topics: [
        { k: 'abs_reasoning', n: 'Abstract Reasoning (Image-based)' }
      ]
    }
  ];

  var html = '<div class="page review-page"><div class="wrap">';
  html += backBtn(false, 'home', true);
  html += '<h2 class="bng sec-title"><i class="fas fa-book-open" style="color:var(--gold);margin-right:10px;"></i>START REVIEW</h2>';
  html += '<p class="sec-sub">Select a topic under any subject to begin a focused quiz. Each question has a 1-minute timer. Study well and trust the process!</p>';

  html += '<div class="subjects-grid">';
  subjects.forEach(function (s) {
    var cls = subClass(s.key);
    html += '<div class="subject-block">';

    html += '<div style="display:flex;align-items:center;justify-content:space-between;width:100%;margin-bottom:18px;flex-wrap:wrap;gap:10px;">';
    html += '<div class="bng ' + cls + '" style="display:inline-flex;align-items:center;padding:14px 24px 14px 16px;border-radius:14px;font-size:20px;">';
    html += '<span style="width:48px;height:48px;background:rgba(255,255,255,0.2);border-radius:10px;display:inline-flex;align-items:center;justify-content:center;margin-right:12px;font-size:22px;"><i class="fas ' + s.icon + '"></i></span>';
    html += s.label + '</div>';
    html += '<span style="background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.18);padding:6px 16px;border-radius:20px;font-size:13px;color:#ddd;white-space:nowrap;">' + s.meta + '</span>';
    html += '</div>';

    if (s.note) {
      html += '<div style="width:100%;margin-bottom:14px;padding:10px 16px;background:rgba(255,255,255,0.06);border-radius:10px;font-size:13px;color:rgba(255,255,255,0.65);">' + s.note + '</div>';
    }

    html += '<div class="diff-row">';
    s.topics.forEach(function (t) {
      html += '<button class="diff-btn ' + cls + '" style="background:' + subGrad(s.key) + ';" onclick="selectDifficulty(\'' + t.k + '\')">';
      html += '<span class="diff-name">' + t.n + '</span>';
      html += '<span class="diff-tag diff-mod"><i class="fas fa-stopwatch" style="margin-right:4px;"></i>1 min per question</span>';
      html += '</button>';
    });
    html += '</div>';

    html += '</div>';
  });
  html += '</div>';
  html += '<div class="moto-bar"><i class="fas fa-star" style="color:var(--gold);margin-right:8px;"></i>Every topic you practice brings you one step closer to acing the PLMAT. Keep going, Isko!</div>';
  html += '</div></div>';
  return html;
}

function selectDifficulty(key) {
  state.quiz.key = key;
  goTo('choose-mode');
}

/* ============================================================
   PAGE: CHOOSE MODE
   ============================================================ */
function pageChooseMode() {
  var k = state.quiz.key;
  var q = QUESTIONS[k];
  if (!q) return pageReview();
  var gc = subClass(q.subKey);
  return '<div class="page mode-page"><div class="wrap">' +
    backBtn(false, 'review', true) +
    '<h2 class="bng sec-title" style="color:var(--gold);"><i class="fas fa-gamepad"></i> CHOOSE YOUR GAME</h2>' +
    '<p class="sec-sub"><strong style="color:#fff;">' + q.subject + '</strong> — ' + q.lesson + '<br>Pick your mode below. Timed mode mirrors the real PLMAT pressure!</p>' +
    '<div class="mode-grid">' +
    '<div class="mode-card ' + gc + ' card" onclick="startQuiz(\'timed\')">' +
    '<div class="mode-icon"><i class="fas fa-stopwatch"></i></div>' +
    '<h3 class="bng" style="font-size:28px;color:#fff;margin-bottom:12px;">TIMED CHALLENGE</h3>' +
    '<p style="color:rgba(255,255,255,0.85);font-size:16px;line-height:1.7;">Beat the clock! Each question has a timer. Answering quickly earns you that exam-day confidence. Simulates real PLMAT conditions.</p>' +
    '<div style="margin-top:20px;padding:12px;background:rgba(0,0,0,0.2);border-radius:10px;font-size:14px;"><i class="fas fa-clock" style="margin-right:6px;"></i>' + fmtTime(q.timer) + ' per question</div>' +
    '</div>' +
    '<div class="mode-card ' + gc + ' card" style="opacity:0.9;" onclick="startQuiz(\'practice\')">' +
    '<div class="mode-icon"><i class="fas fa-brain"></i></div>' +
    '<h3 class="bng" style="font-size:28px;color:#fff;margin-bottom:12px;">PRACTICE MODE</h3>' +
    '<p style="color:rgba(255,255,255,0.85);font-size:16px;line-height:1.7;">Take your time. No timer pressure. Focus on understanding each concept deeply before moving on. Perfect for first-time review.</p>' +
    '<div style="margin-top:20px;padding:12px;background:rgba(0,0,0,0.2);border-radius:10px;font-size:14px;"><i class="fas fa-infinity" style="margin-right:6px;"></i>No time limit</div>' +
    '</div>' +
    '</div>' +
    '<div style="margin-top:32px;padding:20px 28px;background:rgba(212,160,23,0.08);border:1px solid rgba(212,160,23,0.2);border-radius:14px;max-width:800px;margin-left:auto;margin-right:auto;">' +
    '<h4 class="bng" style="color:var(--gold);margin-bottom:10px;"><i class="fas fa-shield-halved"></i> STRATEGY TIPS</h4>' +
    '<ul style="color:#ccc;font-size:15px;line-height:1.8;padding-left:20px;">' +
    '<li>Read every choice before selecting your answer.</li>' +
    '<li>Eliminate obviously wrong choices first.</li>' +
    '<li>In timed mode, trust your gut on the first read.</li>' +
    '<li>Review your errors after each quiz to learn from them.</li>' +
    '</ul>' +
    '</div>' +
    '<div class="moto-bar"><i class="fas fa-fire" style="color:#e85d04;margin-right:8px;"></i>Pressure makes diamonds. Embrace the challenge and show the PLMAT what you\'re made of!</div>' +
    '</div></div>';
}

function startQuiz(mode) {
  var k = state.quiz.key;
  var q = QUESTIONS[k];
  if (!q) return;
  state.quiz = { key: k, current: 0, answers: {}, timer: null, timeLeft: q.timer, mode: mode, complete: false, showReview: false, savedResultId: null, resultAudioPlayed: false, checked: false, lastCorrect: false };
  goTo('quiz');
}

/* ============================================================
   PAGE: QUIZ
   ============================================================ */
function pageQuiz() {
  var k = state.quiz.key;
  var q = QUESTIONS[k];
  if (!q) return '';
  var cur = state.quiz.current;
  var total = q.q.length;
  var item = q.q[cur];
  var letters = ['A', 'B', 'C', 'D'];
  var pct = Math.round((cur / total) * 100);
  var gc = subClass(q.subKey);
  var checked = state.quiz.checked;
  var answered = state.quiz.answers[cur] !== undefined;

  var timerHtml = '';
  if (state.quiz.mode === 'timed') {
    timerHtml = '<div class="quiz-timer" id="quiz-timer"><i class="fas fa-stopwatch"></i> <span id="timer-disp">' + fmtTime(state.quiz.timeLeft) + '</span></div>';
  } else {
    timerHtml = '<div class="quiz-timer" style="color:#888;border-color:rgba(255,255,255,0.08);background:rgba(255,255,255,0.03);"><i class="fas fa-infinity"></i> Practice Mode — No Time Limit</div>';
  }

  var choicesHtml = '';
  item.o.forEach(function (opt, i) {
    var cls = 'choice-btn';
    if (checked) {
      if (i === item.a) cls += ' correct';
      else if (state.quiz.answers[cur] === i) cls += ' wrong';
    } else {
      if (state.quiz.answers[cur] === i) cls += ' selected';
    }
    var onclick = checked ? '' : ' onclick="selectAnswer(' + i + ')"';
    choicesHtml += '<button class="' + cls + '"' + onclick + '>' +
      '<span class="choice-letter">' + letters[i] + '</span>' + opt + '</button>';
  });

  var feedbackHtml = '';
  if (checked) {
    var isCorrect = state.quiz.lastCorrect;
    feedbackHtml = '<div class="quiz-feedback ' + (isCorrect ? 'feedback-correct' : 'feedback-wrong') + '">' +
      '<i class="fas ' + (isCorrect ? 'fa-check-circle' : 'fa-times-circle') + '" style="margin-right:8px;"></i>' +
      (isCorrect ? 'YIS GALING!' : 'GOODNESS GRACIOUS! PUSH MO PA') +
      '</div>';
  }

  var navHtml = '<div class="quiz-nav">';
  if (cur > 0) navHtml += '<button class="btn-outline bng" onclick="quizPrev()"><i class="fas fa-chevron-left"></i> PREVIOUS</button>';
  if (!checked) {
    var checkDisabled = answered ? '' : ' disabled style="opacity:0.45;cursor:not-allowed;"';
    navHtml += '<button class="btn-gold bng"' + checkDisabled + ' onclick="quizCheck()"><i class="fas fa-check"></i> CHECK</button>';
  } else {
    if (cur < total - 1) navHtml += '<button class="btn-gold bng" onclick="quizNext()">NEXT <i class="fas fa-chevron-right"></i></button>';
    else navHtml += '<button class="btn-gold bng" onclick="preFinishQuiz()"><i class="fas fa-flag-checkered"></i> FINISH EXAM</button>';
  }
  navHtml += '</div>';

  return '<div class="page quiz-page"><div class="wrap">' +
    backBtn(true, 'review') +
    '<div class="quiz-header">' +
    '<div>' +
    '<span class="bng" style="font-size:22px;color:#fff;margin-right:8px;">' + q.subject + '</span>' +
    '<span style="color:#bbb;font-size:14px;">— ' + q.lesson + '</span>' +
    '</div>' +
    '<div class="quiz-counter">Question <strong style="color:#fff;">' + (cur + 1) + '</strong> of ' + total + '</div>' +
    '</div>' +
    timerHtml +
    '<div class="quiz-progress-bar"><div class="quiz-progress-fill ' + gc + '" style="width:' + pct + '%;"></div></div>' +
    '<div class="quiz-question"><strong>' + (cur + 1) + '.</strong> ' + item.q + '</div>' +
    (item.img ? '<div class="abs-img-wrap"><img src="' + item.img + '" alt="Abstract Reasoning Pattern" class="abs-pattern-img" onerror="this.style.display=\'none\';this.nextSibling.style.display=\'flex\'"/><div class="abs-placeholder-box" style="display:none;"><i class="fas fa-image"></i><span>Image: <strong>' + item.img + '</strong></span><span style=\'font-size:12px;color:#aaa;\'>Place this image file in the project root folder</span></div></div>' : '') +
    '<div class="quiz-choices">' + choicesHtml + '</div>' +
    feedbackHtml +
    navHtml +
    '<div class="tip-box">' + tipForSubject(q.subKey) + '</div>' +
    '</div></div>';
}

function selectAnswer(idx) {
  if (state.quiz.checked) return;
  var cur = state.quiz.current;
  state.quiz.answers[cur] = idx;
  render();
}

function quizCheck() {
  if (state.quiz.checked) return;
  var k = state.quiz.key;
  var q = QUESTIONS[k];
  var cur = state.quiz.current;
  var item = q.q[cur];
  var answered = state.quiz.answers[cur] !== undefined;
  if (!answered) return;
  var isCorrect = state.quiz.answers[cur] === item.a;
  state.quiz.checked = true;
  state.quiz.lastCorrect = isCorrect;
  if (state.quiz.mode === 'timed') clearQuizTimer();
  playAnswerAudio(isCorrect);
  render();
}

function quizNext() {
  var k = state.quiz.key; var q = QUESTIONS[k];
  if (state.quiz.current < q.q.length - 1) {
    state.quiz.current++;
    state.quiz.timeLeft = q.timer;
    state.quiz.checked = false;
    state.quiz.lastCorrect = false;
    clearQuizTimer();
    render();
    if (state.quiz.mode === 'timed') startQuizTimer();
  }
}

function quizPrev() {
  var k = state.quiz.key; var q = QUESTIONS[k];
  if (state.quiz.current > 0) {
    state.quiz.current--;
    state.quiz.timeLeft = q.timer;
    state.quiz.checked = false;
    state.quiz.lastCorrect = false;
    clearQuizTimer();
    render();
    if (state.quiz.mode === 'timed') startQuizTimer();
  }
}

function preFinishQuiz() {
  clearQuizTimer();
  state.quiz.complete = true;

  var k = state.quiz.key;
  var q = QUESTIONS[k];
  var total = q.q.length;
  var correct = 0;
  q.q.forEach(function (item, i) {
    if (state.quiz.answers[i] === item.a) correct++;
  });
  var subKey = k.split('_')[0];

  var futureCorrect = (PROGRESS[subKey].correct || 0) + correct;
  var futureTotal = (PROGRESS[subKey].total || 0) + total;
  var futurePct = futureTotal ? Math.round((futureCorrect / futureTotal) * 100) : 0;

  var badgesToShow = [];
  if (state.user.loggedIn && correct > 0 && !BADGES[0].earned) {
    badgesToShow.push(BADGES[0]);
  }
  var badgeIndexMap = { math: 2, sci: 3, eng: 4, abs: 5, fil: 8 };
  var badgeIndex = badgeIndexMap[subKey];
  if (badgeIndex !== undefined && futurePct >= 85 && !BADGES[badgeIndex].earned) {
    badgesToShow.push(BADGES[badgeIndex]);
  }

  if (badgesToShow.length > 0) {
    showBadgePopup(badgesToShow[0], function () {
      goTo('quiz-results');
    });
  } else {
    goTo('quiz-results');
  }
}

function finishQuiz() {
  preFinishQuiz();
}

/* ---- QUIZ TIMER ---- */
function clearQuizTimer() {
  if (state.quiz.timer) { clearInterval(state.quiz.timer); state.quiz.timer = null; }
}
function startQuizTimer() {
  if (state.quiz.mode !== 'timed') return;
  clearQuizTimer();
  state.quiz.timer = setInterval(function () {
    state.quiz.timeLeft--;
    var el = $('timer-disp');
    if (el) {
      el.textContent = fmtTime(state.quiz.timeLeft);
      var wrap = el.parentElement;
      if (state.quiz.timeLeft <= 10) wrap.classList.add('warn');
    }
    if (state.quiz.timeLeft <= 0) {
      clearQuizTimer();
      quizNext();
    }
  }, 1000);
}
/* ============================================================
   STEP 9B: GLOBAL LEADERBOARD & HELPER FUNCTIONS
   ============================================================ */
function updateLeaderboardEntry() {
  if (!state.user.uid) return;
  var summary = progressSummary();
  if (summary.totalPoints === 0 && summary.totalQuizzes === 0 && summary.mockExams === 0) return;
  var F = window.fbFunctions;
  F.setDoc(F.doc(window.fbDb, 'leaderboard', state.user.uid), {
    name: state.user.username,
    uid: state.user.uid,
    totalPoints: summary.totalPoints,
    totalPossiblePoints: summary.totalPossiblePoints,
    totalQuizzes: summary.totalQuizzes,
    mockExams: summary.mockExams,
    quizPoints: summary.totalCorrect,
    mockPoints: summary.mockCorrect,
    avgScore: summary.avgScore,
    totalCorrect: summary.totalCorrect,
    totalQuestions: summary.totalQuestions,
    subject: getBestSubject(),
    icon: getBestSubjectIcon(),
    best: getBestSubjectName(),
    streak: summary.streak,
    updatedAt: F.serverTimestamp()
  }, { merge: true }).catch(function (err) { console.warn('Could not update leaderboard', err); });
}

function calculateStreak() {
  return Number(state.user.streak) || 0;
}

function getBestSubject() {
  var best = null;
  var bestPct = -1;
  Object.keys(PROGRESS).forEach(function (k) {
    if ((PROGRESS[k].quizzes || 0) > 0 && PROGRESS[k].pct > bestPct) {
      bestPct = PROGRESS[k].pct;
      best = k;
    }
  });
  return best || 'math';
}

function getBestSubjectIcon() {
  return {
    math: 'fa-calculator',
    sci: 'fa-atom',
    eng: 'fa-language',
    log: 'fa-brain',
    fil: 'fa-book',
    abs: 'fa-shapes'
  }[getBestSubject()] || 'fa-star';
}

function getBestSubjectName() {
  return {
    math: 'Math',
    sci: 'Science',
    eng: 'English',
    fil: 'Filipino',
    abs: 'Abstract Reasoning'
  }[getBestSubject()] || 'Math';
}

/* ============================================================
   PAGE: QUIZ RESULTS
   ============================================================ */
function pageQuizResults() {
  var k = state.quiz.key;
  var q = QUESTIONS[k];
  if (!q) return '';
  var total = q.q.length;
  var correct = 0;
  q.q.forEach(function (item, i) {
    if (state.quiz.answers[i] === item.a) correct++;
  });
  var pct = Math.round((correct / total) * 100);

  // ========== STEP 7A: FIREBASE - Save quiz result and update progress ==========
  if (state.user.uid && !state.quiz.savedResultId) {
    state.quiz.savedResultId = state.user.uid + ':' + state.quiz.key + ':' + Date.now();
    var subKey = state.quiz.key.split('_')[0]; // e.g. "math" from "math_easy"
    var uid = state.user.uid;
    var F = window.fbFunctions;

    // Add to quiz history collection
    F.addDoc(F.collection(window.fbDb, 'users', uid, 'quizHistory'), {
      subject: subKey,
      quizKey: state.quiz.key,
      score: correct,
      total: total,
      pct: pct,
      mode: state.quiz.mode,
      timestamp: F.serverTimestamp()
    }).catch(function (err) { console.warn('Could not save quiz history', err); });

    // ===== UPDATE LOCAL PROGRESS OBJECT =====
    PROGRESS[subKey].quizzes = (PROGRESS[subKey].quizzes || 0) + 1;
    PROGRESS[subKey].correct = (PROGRESS[subKey].correct || 0) + correct;
    PROGRESS[subKey].total = (PROGRESS[subKey].total || 0) + total;
    PROGRESS[subKey].pct = PROGRESS[subKey].total ? Math.round((PROGRESS[subKey].correct / PROGRESS[subKey].total) * 100) : 0;

    // Update aggregate progress in the user document
    var updated = {};
    updated['progress.' + subKey + '.quizzes'] = PROGRESS[subKey].quizzes;
    updated['progress.' + subKey + '.correct'] = PROGRESS[subKey].correct;
    updated['progress.' + subKey + '.total'] = PROGRESS[subKey].total;
    updated['progress.' + subKey + '.pct'] = PROGRESS[subKey].pct;
    F.updateDoc(F.doc(window.fbDb, 'users', uid), updated).catch(function (err) { console.warn('Could not update progress', err); });
    updateUserActivityStats(false, correct, total);

    // ========== STEP 8A: FIREBASE - Award badges ==========
    // Award First Quiz badge (only once)
    if (state.user.loggedIn && correct > 0) {
      awardBadge(0);  // First Quiz
    }

    // Award subject master badges if progress >= 85%
    var badgeIndexMap = { math: 2, sci: 3, eng: 4, abs: 5, fil: 8 };
    var badgeIndex = badgeIndexMap[subKey];
    if (badgeIndex !== undefined && PROGRESS[subKey].pct >= 85) {
      awardBadge(badgeIndex);
    }

    // ========== STEP 9B: FIREBASE - Update leaderboard entry ==========
    updateLeaderboardEntry();
  }
  // ========== END FIREBASE SECTION ==========
  if (!state.quiz.resultAudioPlayed) {
    state.quiz.resultAudioPlayed = true;
    setTimeout(function () { playScoreResultAudio(pct); }, 250);
  }

  var gc = subClass(q.subKey);
  var msg = pct >= 80 ? 'Excellent work! You\'re PLMAT-ready in this topic!' : pct >= 60 ? 'Good job! A bit more practice and you\'ll master this!' : 'Keep going! Review the answers below and try again — you\'ve got this!';
  var emoji = pct >= 80 ? 'fa-trophy' : pct >= 60 ? 'fa-thumbs-up' : 'fa-redo';

  var reviewHtml = '';
  q.q.forEach(function (item, i) {
    var ans = state.quiz.answers[i];
    var isCorrect = (ans === item.a);
    reviewHtml += '<div class="result-item ' + (isCorrect ? 'correct-ans' : 'wrong-ans') + '">' +
      '<div style="display:flex;align-items:flex-start;gap:12px;">' +
      '<i class="fas ' + (isCorrect ? 'fa-circle-check" style="color:#2ecc71' : 'fa-circle-xmark" style="color:#e74c3c') + ';font-size:20px;margin-top:3px;"></i>' +
      '<div style="flex:1;">' +
      '<p style="color:#ddd;font-size:15px;margin-bottom:8px;"><strong>' + (i + 1) + '.</strong> ' + item.q + '</p>' +
      (ans !== undefined ? '<p style="font-size:14px;color:' + (isCorrect ? '#2ecc71' : '#e74c3c') + ';">Your answer: ' + item.o[ans] + '</p>' : '<p style="font-size:14px;color:#888;">Not answered</p>') +
      (!isCorrect ? '<p style="font-size:14px;color:#2ecc71;margin-top:4px;"><i class="fas fa-check"></i> Correct: ' + item.o[item.a] + '</p>' : '') +
      '</div>' +
      '</div>' +
      '</div>';
  });

  return '<div class="page results-page"><div class="wrap">' +
    '<div class="result-banner ' + gc + ' card">' +
    '<i class="fas ' + emoji + '" style="font-size:52px;margin-bottom:12px;display:block;"></i>' +
    '<h2 class="bng" style="font-size:32px;color:#fff;margin-bottom:8px;">EXAM COMPLETE</h2>' +
    '<p style="color:rgba(255,255,255,0.85);font-size:18px;">' + q.subject + ' — ' + q.lesson + '</p>' +
    '<div class="result-score bng" style="color:#fff;">' + correct + '/' + total + '</div>' +
    '<div style="font-size:22px;margin-bottom:16px;color:rgba(255,255,255,0.8);">' + pct + '% Score</div>' +
    '<p style="font-size:17px;color:rgba(255,255,255,0.9);">' + msg + '</p>' +
    '</div>' +
    '<h3 class="bng" style="font-size:26px;color:var(--gold);margin-bottom:24px;"><i class="fas fa-list-check"></i> REVIEW ANSWERS</h3>' +
    reviewHtml +
    '<div style="display:flex;gap:16px;justify-content:center;margin-top:40px;flex-wrap:wrap;">' +
    '<button class="btn-outline" onclick="startQuiz(state.quiz.mode)"><i class="fas fa-redo"></i> Try Again</button>' +
    '<button class="btn-gold bng" onclick="goTo(\'review\')"><i class="fas fa-book-open"></i> BACK TO REVIEW</button>' +
    '<button class="btn-gold bng" onclick="goTo(\'mock-instructions\')"><i class="fas fa-graduation-cap"></i> TAKE MOCK EXAM</button>' +
    '</div>' +
    '<div class="moto-bar"><i class="fas fa-heart" style="color:#e74c3c;margin-right:8px;"></i>Mistakes are proof you are trying. Review what you got wrong and come back stronger!</div>' +
    '</div></div>';
}


/* ============================================================
   PAGE: MOCK EXAM INSTRUCTIONS / MOCK RESULTS SAVE POINT
   FIREBASE: In pageMockResults(), after computing correct/pct, save the result:
     const userId = window.auth.currentUser.uid;
     await setDoc(doc(window.db, "users", userId, "mockResults", Date.now().toString()), {
       score: correct,
       total: total,
       pct: pct,
       subjectBreakdown: subCounts,  // { math:{c,t}, sci:{c,t}, eng:{c,t}, log:{c,t} }
       timestamp: new Date()
     });
     Then update the leaderboard document for this user with their latest streak.
   ============================================================ */
/* ============================================================
   PAGE: MOCK EXAM INSTRUCTIONS
   ============================================================ */
function pageMockInstructions() {
  return '<div class="page" style="padding-top:80px;"><div class="wrap">' +
    backBtn(false, 'home', true) +
    '<div class="mock-instructions" style="padding-top:0;">' +
    '<h2 class="bng sec-title" style="color:var(--gold);"><i class="fas fa-graduation-cap"></i> PLMAT SIMULATION TEST</h2>' +
    '<p class="sec-sub">Read the instructions carefully before starting. You can do this — thousands of Iskos before you have sat in this same seat and passed!</p>' +

    '<div class="instr-card grad-sci card">' +
    '<h3 class="bng" style="font-size:26px;color:#fff;margin-bottom:20px;"><i class="fas fa-clipboard-list"></i> EXAM DETAILS</h3>' +
    '<ul class="instr-list">' +
    '<li><i class="fas fa-file-circle-check"></i><div><strong style="color:#fff;">Total Questions:</strong> 40 questions (mixed subjects)</div></li>' +
    '<li><i class="fas fa-clock"></i><div><strong style="color:#fff;">Time Limit:</strong> 1 hour and 30 minutes (continuous timer)</div></li>' +
    '<li><i class="fas fa-star"></i><div><strong style="color:#fff;">Points:</strong> 1 point each (40 points total)</div></li>' +
    '<li><i class="fas fa-layer-group"></i><div><strong style="color:#fff;">Subjects:</strong> Mathematics, Science, English, Abstract Reasoning</div></li>' +
    '<li><i class="fas fa-arrow-right-arrow-left"></i><div><strong style="color:#fff;">Navigation:</strong> You can move between questions freely</div></li>' +
    '</ul>' +
    '</div>' +

    '<div class="instr-card grad-math card">' +
    '<h3 class="bng" style="font-size:26px;color:#fff;margin-bottom:20px;"><i class="fas fa-info-circle"></i> INSTRUCTIONS</h3>' +
    '<ul class="instr-list">' +
    '<li><i class="fas fa-check-circle"></i><div>Choose the best answer for each question.</div></li>' +
    '<li><i class="fas fa-pen"></i><div>You can change your answers before submitting.</div></li>' +
    '<li><i class="fas fa-hourglass-half"></i><div>The exam will auto-submit when the time runs out.</div></li>' +
    '<li><i class="fas fa-crosshairs"></i><div>Stay focused and manage your time wisely.</div></li>' +
    '<li><i class="fas fa-heart"></i><div>Take a deep breath. You\'ve prepared for this moment. Trust yourself!</div></li>' +
    '</ul>' +
    '</div>' +

    '<div style="text-align:center;margin-top:32px;">' +
    '<button class="btn-gold bng" style="font-size:20px;padding:18px 52px;" onclick="startMockExam()">' +
    '<i class="fas fa-play-circle"></i> START EXAM' +
    '</button>' +
    '</div>' +

    '<div class="moto-bar"><i class="fas fa-graduation-cap" style="color:var(--gold);margin-right:8px;"></i>You\'ve studied hard. Now it\'s time to show what you know. The UP gates are waiting for you — open them with your score!</div>' +
    '</div>' +
    '</div></div>';
}

// BADGES 
function awardBadge(badgeIndex) {
  if (BADGES[badgeIndex] && !BADGES[badgeIndex].earned) {
    BADGES[badgeIndex].earned = true;
    if (state.user.uid) {
      var F = window.fbFunctions;
      var badgeState = BADGES.map(function (b) { return b.earned; });
      F.updateDoc(F.doc(window.fbDb, 'users', state.user.uid), {
        badges: badgeState
      }).catch(function (err) { console.warn('Could not update badges', err); });
    }
  }
}

function showBadgePopup(badge, onContinue) {
  var existing = document.getElementById('badge-popup-overlay');
  if (existing) existing.remove();

  playBadgeAudio();

  var overlay = document.createElement('div');
  overlay.id = 'badge-popup-overlay';
  overlay.innerHTML =
    '<div class="badge-popup-box">' +
    '<div class="badge-popup-unlocked"><i class="fas fa-lock-open"></i> BADGE UNLOCKED</div>' +
    '<div class="badge-popup-icon ' + subClass(badge.subKey) + '">' +
    '<i class="fas ' + badge.icon + '"></i>' +
    '</div>' +
    '<h2 class="bng badge-popup-title">CONGRATULATIONS!</h2>' +
    '<h3 class="bng badge-popup-name">' + badge.name + '</h3>' +
    '<p class="badge-popup-desc">You earned a new badge! Your hard work and dedication is paying off. Keep pushing, Isko!</p>' +
    '<button class="btn-gold bng badge-popup-btn" onclick="closeBadgePopup()"><i class="fas fa-star"></i> AWESOME!</button>' +
    '</div>';

  document.body.appendChild(overlay);
  window._badgePopupCallback = onContinue;
}

function closeBadgePopup() {
  var overlay = document.getElementById('badge-popup-overlay');
  if (overlay) {
    overlay.style.animation = 'badgeFadeIn 0.25s ease reverse';
    setTimeout(function () {
      if (overlay.parentNode) overlay.remove();
      if (window._badgePopupCallback) {
        var cb = window._badgePopupCallback;
        window._badgePopupCallback = null;
        cb();
      }
    }, 220);
  }
}

function playBadgeAudio() {
    const audio = new Audio('badge.mp3');
    audio.play();
}

function playAnswerAudio(isCorrect) {
    const audio = new Audio(isCorrect ? 'correct_ans.mp3' : 'wrong_ans.mp3');
    audio.play();
}

// CONNECT LEADERBOARD 9A
function startLeaderboardListener() {
  if (leaderboardUnsubscribe || !firebaseReady()) return;
  var F = window.fbFunctions;
  var q = F.query(
    F.collection(window.fbDb, 'leaderboard'),
    F.orderBy('totalPoints', 'desc'),
    F.limit(20)
  );
  leaderboardUnsubscribe = F.onSnapshot(q, function (snap) {
    LEADERS = normalizeLeaderboardEntries(snap.docs.map(function (d) { return d.data(); }).filter(function (item) {
      return item && (leaderboardScore(item) > 0 || Number(item.totalQuizzes) > 0 || Number(item.mockExams) > 0);
    }));
    if (state.page === 'leaderboard') render(); // Refresh leaderboard page live
  }, function (err) {
    console.warn('Could not load leaderboard', err);
  });
}

function startMockExam() {
  state.mock = { current: 0, answers: {}, timer: null, timeLeft: 5400, complete: false, started: true, showReview: false, savedResultId: null, resultAudioPlayed: false };
  goTo('mock-exam');
}

/* ============================================================
   PAGE: MOCK EXAM
   ============================================================ */
function pageMockExam() {
  if (state.mock.complete) return pageMockResults();
  var qs = MOCK_QUESTIONS;
  var cur = state.mock.current;
  var total = qs.length;
  var item = qs[cur];
  var letters = ['A', 'B', 'C', 'D'];
  var subColors = { math: '#9d4edd', sci: '#2ecc71', eng: '#f7c948', log: '#f4a261', abs: '#e74c3c' };
  var subLabel = { math: 'Math', sci: 'Science', eng: 'English', log: 'Logic', abs: 'Abstract' };

  var choicesHtml = '';
  item.o.forEach(function (opt, i) {
    var sel = state.mock.answers[cur] === i ? ' selected' : '';
    choicesHtml += '<button class="choice-btn' + sel + '" onclick="mockSelectAnswer(' + i + ')">' +
      '<span class="choice-letter">' + letters[i] + '</span>' + opt + '</button>';
  });

  var numGridHtml = '';
  for (var i = 0; i < total; i++) {
    var cls = 'num-box';
    if (state.mock.answers[i] !== undefined) cls += ' answered';
    if (i === cur) cls += ' current';
    numGridHtml += '<div class="' + cls + '" onclick="mockGoTo(' + i + ')">' + (i + 1) + '</div>';
  }

  return '<div class="page" style="padding-top:80px;"><div class="wrap">' +
    backBtn(true, 'mock-instructions', true) +
    '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">' +
    '<h2 class="bng" style="font-size:28px;color:var(--gold);"><i class="fas fa-graduation-cap"></i> MOCK PLMAT EXAM</h2>' +
    '<div style="font-size:15px;color:#bbb;">Question <strong style="color:#fff;">' + (cur + 1) + '</strong> of ' + total + '</div>' +
    '</div>' +
    '<div class="mock-layout">' +
    '<div class="mock-left">' +
    '<div style="padding:6px 12px;border-radius:8px;font-size:13px;display:inline-block;margin-bottom:20px;background:' + subColors[item.subKey] + ';color:#fff;">' +
    '<i class="fas fa-tag"></i> ' + item.subject +
    '</div>' +
    '<div style="font-size:20px;color:#fff;line-height:1.75;margin-bottom:20px;"><strong>' + (cur + 1) + '.</strong> ' + item.q + '</div>' +
    
    /* ADDED THIS LINE FOR THE IMAGE WITH INLINE CSS */
    (item.img ? '<div style="margin-bottom:24px; text-align:center;"><img src="' + item.img + '" alt="Abstract Pattern" style="max-width:100%; height:auto; border-radius:8px; border:2px solid rgba(255,255,255,0.1); display:block; margin:0 auto;"></div>' : '') +
    
    '<div class="quiz-choices">' + choicesHtml + '</div>' +
    '<div class="mock-nav">' +
    (cur > 0 ? '<button class="btn-outline bng" onclick="mockPrev()"><i class="fas fa-chevron-left"></i> PREVIOUS</button>' : '') +
    (cur < total - 1 ? '<button class="btn-gold bng" onclick="mockNext()">NEXT <i class="fas fa-chevron-right"></i></button>' : '') +
    '<button class="btn-gold bng" style="background:linear-gradient(135deg,#e74c3c,#c0392b);" onclick="confirmFinishMock()"><i class="fas fa-flag-checkered"></i> FINISH EXAM</button>' +
    '</div>' +
    '<div class="tip-box" style="margin-top:24px;">' +
    '<i class="fas fa-lightbulb"></i> Eliminate wrong options first — narrowing to 2 choices doubles your chances of guessing correctly!' +
    '</div>' +
    '</div>' +
    '<div class="mock-right">' +
    '<div class="mock-timer-big bng" id="mock-timer-disp">' + fmtTime(state.mock.timeLeft) + '</div>' +
    '<div class="mock-right-title"><i class="fas fa-grid-2"></i> Question Navigator</div>' +
    '<div class="mock-grid-nums">' + numGridHtml + '</div>' +
    '<div class="mock-legend">' +
    '<div class="leg"><div class="leg-dot" style="background:rgba(46,204,113,0.4);border:1px solid #2ecc71;"></div> Answered</div>' +
    '<div class="leg"><div class="leg-dot" style="border:2px solid var(--gold);"></div> Current</div>' +
    '<div class="leg"><div class="leg-dot" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);"></div> Skipped</div>' +
    '</div>' +
    '<div style="margin-top:20px;padding:14px;background:rgba(255,255,255,0.04);border-radius:10px;font-size:13px;color:#bbb;">' +
    '<div><i class="fas fa-check-circle" style="color:#2ecc71;margin-right:6px;"></i>Answered: <strong style="color:#fff;">' + Object.keys(state.mock.answers).length + '</strong></div>' +
    '<div style="margin-top:8px;"><i class="fas fa-circle-minus" style="color:#888;margin-right:6px;"></i>Remaining: <strong style="color:#fff;">' + (total - Object.keys(state.mock.answers).length) + '</strong></div>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</div></div>';
}

function mockSelectAnswer(idx) {
  state.mock.answers[state.mock.current] = idx;
  var qs = MOCK_QUESTIONS; var total = qs.length;
  var numBoxes = document.querySelectorAll('.num-box');
  numBoxes.forEach(function (el, i) {
    el.classList.toggle('answered', state.mock.answers[i] !== undefined);
    el.classList.toggle('current', i === state.mock.current);
  });
  var choices = document.querySelectorAll('.choice-btn');
  choices.forEach(function (el, i) { el.classList.toggle('selected', i === idx); });
  var ansCount = document.querySelector('.mock-right strong');
  var remEl = document.querySelectorAll('.mock-right strong');
  if (remEl.length >= 2) {
    remEl[0].textContent = Object.keys(state.mock.answers).length;
    remEl[1].textContent = (total - Object.keys(state.mock.answers).length);
  }
}

function mockGoTo(i) {
  state.mock.current = i;
  render();
}

function mockNext() {
  if (state.mock.current < MOCK_QUESTIONS.length - 1) { state.mock.current++; render(); }
}

function mockPrev() {
  if (state.mock.current > 0) { state.mock.current--; render(); }
}

function confirmFinishMock() {
  var answered = Object.keys(state.mock.answers).length;
  var total = MOCK_QUESTIONS.length;
  var left = total - answered;
  if (left === 0) {
    finishMockExam();
    return;
  }
  showConfirm(function () { finishMockExam(); });
  document.querySelector('.modal-box p').textContent = 'You have ' + left + ' unanswered question(s). Are you sure you want to finish?';
}

function finishMockExam() {
  clearMockTimer();
  state.mock.complete = true;

  if (state.user.loggedIn && !BADGES[6].earned) {
    showBadgePopup(BADGES[6], function () {
      goTo('mock-results');
    });
  } else {
    goTo('mock-results');
  }
}

/* ---- MOCK TIMER ---- */
function clearMockTimer() {
  if (state.mock.timer) { clearInterval(state.mock.timer); state.mock.timer = null; }
}
function startMockTimer() {
  clearMockTimer();
  state.mock.timer = setInterval(function () {
    state.mock.timeLeft--;
    var el = $('mock-timer-disp');
    if (el) {
      el.textContent = fmtTime(state.mock.timeLeft);
      if (state.mock.timeLeft <= 300) el.style.color = '#e74c3c';
    }
    if (state.mock.timeLeft <= 0) { clearMockTimer(); finishMockExam(); }
  }, 1000);
}

/* ============================================================
   PAGE: MOCK RESULTS
   ============================================================ */
function pageMockResults() {
  var qs = MOCK_QUESTIONS;
  var total = qs.length;
  var correct = 0;
  qs.forEach(function (item, i) {
    if (state.mock.answers[i] === item.a) correct++;
  });
  var pct = Math.round((correct / total) * 100);

  // ========== STEP 10A: FIREBASE - Calculate breakdown FIRST ==========
  var subCounts = { math: { c: 0, t: 0 }, sci: { c: 0, t: 0 }, eng: { c: 0, t: 0 }, abs: { c: 0, t: 0 } };
  qs.forEach(function (item, i) {
    var sk = item.subKey === 'log' ? 'abs' : item.subKey;
    if (subCounts[sk]) { subCounts[sk].t++; if (state.mock.answers[i] === item.a) subCounts[sk].c++; }
  });

  // ========== STEP 10A: FIREBASE - Save mock exam result ==========
  if (state.user.uid && !state.mock.savedResultId) {
    state.mock.savedResultId = state.user.uid + ':mock:' + Date.now();
    var F = window.fbFunctions;
    F.addDoc(F.collection(window.fbDb, 'users', state.user.uid, 'mockHistory'), {
      score: correct,
      total: total,
      pct: pct,
      breakdown: subCounts,
      timestamp: F.serverTimestamp()
    }).catch(function (err) { console.warn('Could not save mock history', err); });
    updateUserActivityStats(true, correct, total);

    // ========== STEP 8A: Award Mock Master badge ==========
    awardBadge(6);  // Mock Master badge

    // ========== STEP 9B: Update leaderboard with latest stats ==========
    updateLeaderboardEntry();
  }
  // ========== END FIREBASE SECTION ==========
  if (!state.mock.resultAudioPlayed) {
    state.mock.resultAudioPlayed = true;
    setTimeout(function () { playMockScoreAudio(correct); }, 250);
  }

  var msg = pct >= 80 ? 'Outstanding! You are PLMAT-ready. UP awaits you!' :
    pct >= 60 ? 'Great effort! Keep practicing and you\'ll ace it.' :
      'Don\'t give up! Review your weak areas and try again.';

  var breakdownHtml = '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin-bottom:40px;">';
  var subNames = { math: 'Math', sci: 'Science', eng: 'English', abs: 'Abstract' };
  var subIcons = { math: 'fa-calculator', sci: 'fa-atom', eng: 'fa-language', abs: 'fa-shapes' };
  ['math', 'sci', 'eng', 'abs'].forEach(function (sk) {
    var c = subCounts[sk];
    var p = c.t ? Math.round((c.c / c.t) * 100) : 0;
    breakdownHtml += '<div class="stat-card card ' + subClass(sk) + '">' +
      '<div style="font-size:24px;margin-bottom:10px;"><i class="fas ' + subIcons[sk] + '"></i></div>' +
      '<div class="bng" style="color:#fff;font-size:18px;">' + subNames[sk] + '</div>' +
      '<div class="bng" style="color:#fff;font-size:32px;margin:8px 0;">' + c.c + '/' + c.t + '</div>' +
      '<div style="font-size:14px;color:rgba(255,255,255,0.8);">' + p + '%</div>' +
      '</div>';
  });
  breakdownHtml += '</div>';

  var reviewHtml = '';
  qs.forEach(function (item, i) {
    var ans = state.mock.answers[i];
    var isCorrect = (ans === item.a);
    reviewHtml += '<div class="result-item ' + (isCorrect ? 'correct-ans' : 'wrong-ans') + '">' +
      '<div style="display:flex;align-items:flex-start;gap:12px;">' +
      '<i class="fas ' + (isCorrect ? 'fa-circle-check" style="color:#2ecc71' : 'fa-circle-xmark" style="color:#e74c3c') + ';font-size:20px;margin-top:3px;flex-shrink:0;"></i>' +
      '<div style="flex:1;">' +
      '<div style="font-size:12px;color:#888;margin-bottom:4px;">' + item.subject + '</div>' +
      '<p style="color:#ddd;font-size:15px;margin-bottom:8px;"><strong>' + (i + 1) + '.</strong> ' + item.q + '</p>' +
      
      /* FIXED INLINE CSS FOR RESULTS PAGE IMAGE */
      (item.img ? '<div style="margin-bottom:16px; width:100%;"><img src="' + item.img + '" alt="Question Image" style="display:block; max-width:100%; width:250px; height:auto; border-radius:6px; border:1px solid rgba(255,255,255,0.2);" onerror="this.style.display=\'none\';this.nextSibling.style.display=\'block\'"><div style="display:none;color:#e74c3c;font-size:12px;margin-top:4px;"><i class="fas fa-image"></i> Image failed to load</div></div>' : '') +
      
      (ans !== undefined ? '<p style="font-size:14px;color:' + 
      (isCorrect ? '#2ecc71' : '#e74c3c') + ';">Your answer: ' + item.o[ans] + '</p>' : '<p style="font-size:14px;color:#888;">Not answered</p>') +      (!isCorrect ? '<p style="font-size:14px;color:#2ecc71;margin-top:4px;"><i class="fas fa-check"></i> Correct: ' + item.o[item.a] + '</p>' : '') +
      '</div>' +
      '</div>' +
      '</div>';
  });

  return '<div class="page results-page"><div class="wrap">' +
    backBtn(false, 'home', true) +
    '<div class="result-banner grad-sci card">' +
    '<i class="fas fa-graduation-cap" style="font-size:56px;margin-bottom:16px;display:block;"></i>' +
    '<h2 class="bng" style="font-size:36px;color:#fff;margin-bottom:8px;">EXAM COMPLETE</h2>' +
    '<div class="result-score bng" style="color:#fff;">' + correct + '/' + total + '</div>' +
    '<div style="font-size:26px;margin-bottom:16px;color:rgba(255,255,255,0.9);">' + pct + '% Score</div>' +
    '<p style="font-size:18px;color:rgba(255,255,255,0.9);">' + msg + '</p>' +
    '</div>' +
    '<h3 class="bng" style="font-size:26px;color:var(--gold);margin-bottom:24px;"><i class="fas fa-chart-pie"></i> SUBJECT BREAKDOWN</h3>' +
    breakdownHtml +
    '<h3 class="bng" style="font-size:26px;color:var(--gold);margin-bottom:24px;"><i class="fas fa-list-check"></i> REVIEW ANSWERS</h3>' +
    reviewHtml +
    '<div style="display:flex;gap:16px;justify-content:center;margin-top:40px;flex-wrap:wrap;">' +
    '<button class="btn-gold bng" onclick="goTo(\'review\')"><i class="fas fa-book-open"></i> CONTINUE PRACTICING</button>' +
    '<button class="btn-outline" onclick="startMockExam()"><i class="fas fa-redo"></i> Retake Exam</button>' +
    '</div>' +
    '<div class="moto-bar"><i class="fas fa-star" style="color:var(--gold);margin-right:8px;"></i>Every mock exam is a step closer to the real thing. Review, improve, repeat — that\'s the Isko way!</div>' +
    '</div></div>';
}


/* ============================================================
   PAGE: LEADERBOARD
   ============================================================ */
function pageLeaderboard() {
  var subGrads = { math: subGrad('math'), sci: subGrad('sci'), eng: subGrad('eng'), fil: subGrad('fil'), abs: subGrad('abs'), log: subGrad('abs') };
  var subBadge = { math: 'MATH', sci: 'SCIENCE', eng: 'ENGLISH', fil: 'FILIPINO', abs: 'ABSTRACT', log: 'ABSTRACT' };
  var leaders = normalizeLeaderboardEntries(LEADERS);
  var podHTML = '';
  if (leaders.length) {
    podHTML = '<div class="lb-podium">';
    var top3 = leaders.slice(0, 3);
    var podOrder = top3.length === 1 ? [0] : top3.length === 2 ? [1, 0] : [1, 0, 2];
    podOrder.forEach(function (idx) {
      var leader = top3[idx];
      var rank = idx + 1;
      var subject = leader.subject || 'math';
      var cls = rank === 1 ? 'first' : rank === 2 ? 'second' : 'third';
      var rankStyle = rank === 1 ? 'background:linear-gradient(135deg,var(--gold),#b8860b);color:#1a0a0a;' : rank === 2 ? 'background:linear-gradient(135deg,#aaa,#888);color:#fff;' : 'background:linear-gradient(135deg,#cd7f32,#8b5a2b);color:#fff;';
      podHTML += '<div class="lb-pod ' + cls + '" style="background:' + subGrads[subject] + ';margin-top:' + (rank === 1 ? '0' : rank === 2 ? '40px' : '60px') + ';">' +
        '<div class="pod-rank" style="' + rankStyle + '">' + (rank === 1 ? '<i class="fas fa-crown"></i>' : rank) + '</div>' +
        '<div class="pod-avatar"><i class="fas fa-user-graduate"></i></div>' +
        '<div class="pod-name">' + leader.name + '</div>' +
        '<div class="pod-streak"><i class="fas fa-clipboard-list"></i> ' + ((Number(leader.totalQuizzes) || 0) + (Number(leader.mockExams) || 0)) + ' total attempts</div>' +
        '<div class="pod-score bng" style="color:#fff;">' + leaderboardScore(leader) + ' pts</div>' +
        '</div>';
    });
    podHTML += '</div>';
  } else {
    podHTML = '<div class="empty-state" style="text-align:center;padding:56px 24px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:18px;margin-bottom:32px;">' +
      '<i class="fas fa-trophy" style="font-size:42px;color:var(--gold);margin-bottom:14px;"></i>' +
      '<h3 class="bng" style="font-size:24px;color:#fff;margin-bottom:8px;">NO LEADERBOARD DATA YET</h3>' +
      '<p style="color:#bbb;">Complete a quiz while signed in to create the first real leaderboard entry.</p>' +
      '</div>';
  }

  var tableHTML = '<table class="lb-table" style="width:100%;">';
  leaders.forEach(function (l, i) {
    var subject = l.subject || 'math';
    var isMe = state.user.uid && l.uid === state.user.uid;
    var lightBg = 'background:rgba(' + (subject === 'math' ? '157,78,221' : subject === 'sci' ? '46,204,113' : subject === 'eng' ? '247,201,72' : subject === 'fil' ? '244,162,97' : '157,78,221') + ',0.12);';
    var totalQuizzes = Number(l.totalQuizzes) || 0;
    var mockExams = Number(l.mockExams) || 0;
    var avgScore = Number(l.avgScore) || 0;
    var totalPoints = leaderboardScore(l);
    var possiblePoints = Number(l.totalPossiblePoints) || Number(l.totalQuestions) || 0;
    tableHTML += '<tr class="lb-row' + (isMe ? ' current-user' : '') + '" style="' + lightBg + '">' +
      '<td><div class="lb-rank-badge" style="background:' + subGrads[subject] + '">' + (i + 1) + '</div></td>' +
      '<td><div style="display:flex;align-items:center;gap:14px;">' +
      '<div class="lb-avatar-sm" style="background:' + subGrads[subject] + '"><i class="fas fa-user"></i></div>' +
      '<div><div style="color:#fff;font-weight:bold;font-size:15px;">' + l.name + (isMe ? '<span class="you-badge">YOU</span>' : '') + '</div>' +
      '<span class="lb-subject-chip" style="background:' + subGrads[subject] + ';margin-top:4px;">' +
      '<i class="fas ' + (l.icon || 'fa-star') + '" style="margin-right:4px;"></i>BEST: ' + subBadge[subject] +
      '</span></div></div></td>' +
      '<td><span style="color:#fff;font-size:16px;font-weight:bold;">' + totalPoints + ' pts</span><br><span style="color:#bbb;font-size:12px;">out of ' + possiblePoints + '</span></td>' +
      '<td><span style="color:#fff;font-size:14px;">' + totalQuizzes + ' quiz' + (totalQuizzes === 1 ? '' : 'zes') + ' + ' + mockExams + ' mock</span></td>' +
      '<td style="min-width:120px;"><div class="lb-bar"><div class="lb-bar-fill" style="width:' + avgScore + '%;background:' + subGrads[subject] + ';"></div></div><span style="color:#ddd;font-size:12px;">' + avgScore + '% quiz avg</span></td>' +
      '</tr>';
  });
  tableHTML += leaders.length ? '</table>' : '</table><p style="color:#888;text-align:center;margin-top:18px;">No ranked users yet.</p>';

  return '<div class="page lb-page"><div class="wrap">' +
    backBtn(false, 'home', true) +
    '<h2 class="bng sec-title" style="color:var(--gold);"><i class="fas fa-trophy"></i> LEADERBOARD</h2>' +
    '<p class="sec-sub"><i class="fas fa-ranking-star" style="color:var(--gold);"></i> One row per user, ranked by total points earned from quizzes and mock exams saved in Firebase.</p>' +
    podHTML +
    '<div class="lb-table-wrap" style="overflow-x:auto;">' + tableHTML + '</div>' +
    '<div class="moto-bar"><i class="fas fa-trophy" style="color:var(--gold);margin-right:8px;"></i>Today\'s hard work is tomorrow\'s top ranking. Your name belongs on this board!</div>' +
    '</div></div>';
}

/* ============================================================
   PAGE: PROGRESS TRACKER
   ============================================================ */
function pageProgress() {
  var subNames = { math: 'Mathematics', sci: 'Science', eng: 'English', fil: 'Filipino', abs: 'Abstract Reasoning' };
  var subIcons = { math: 'fa-calculator', sci: 'fa-atom', eng: 'fa-language', fil: 'fa-book', abs: 'fa-shapes' };
  var subFill = { math: 'linear-gradient(90deg,var(--math-a),#c77dff)', sci: 'linear-gradient(90deg,var(--sci-a),#58d68d)', eng: 'linear-gradient(90deg,var(--eng-a),#f9dc5c)', fil: 'linear-gradient(90deg,var(--log-a),#f4c089)', abs: 'linear-gradient(90deg,var(--math-a),#a29bfe)' };

  var summary = progressSummary();
  var correctText = summary.totalQuestions ? summary.totalCorrect + '/' + summary.totalQuestions + ' correct' : 'No saved answers yet';

  /* SUMMARY ROW */
  var summaryHTML = '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin-bottom:48px;">';
  summaryHTML += '<div class="stat-card card grad-math"><div class="stat-label" style="color:#e8d5f5;"><i class="fas fa-calendar-check"></i> Total Quizzes</div><div class="stat-num bng" style="color:#fff;">' + summary.totalQuizzes + '</div><div style="color:rgba(255,255,255,0.7);font-size:12px;margin-top:6px;">Firebase progress total</div></div>';
  summaryHTML += '<div class="stat-card card grad-sci"><div class="stat-label" style="color:#d5f5e3;"><i class="fas fa-bullseye"></i> Avg Score</div><div class="stat-num bng" style="color:#fff;">' + summary.avgScore + '%</div><div style="color:rgba(255,255,255,0.7);font-size:12px;margin-top:6px;">' + correctText + '</div></div>';
  summaryHTML += '<div class="stat-card card grad-eng"><div class="stat-label" style="color:#fff5d5;"><i class="fas fa-fire"></i> Day Streak</div><div class="stat-num bng" style="color:#fff;">' + summary.streak + '</div><div style="color:rgba(255,255,255,0.7);font-size:12px;margin-top:6px;">Updated from completed activity</div></div>';
  summaryHTML += '<div class="stat-card card grad-log"><div class="stat-label" style="color:#f5e8d5;"><i class="fas fa-graduation-cap"></i> Mock Exams</div><div class="stat-num bng" style="color:#fff;">' + summary.mockExams + '</div><div style="color:rgba(255,255,255,0.7);font-size:12px;margin-top:6px;">Saved mock attempts</div></div>';
  summaryHTML += '</div>';

  /* SUBJECT PROGRESS */
  var progHTML = '';
  ['math', 'sci', 'eng', 'fil', 'abs'].forEach(function (sk) {
    var p = PROGRESS[sk];
    progHTML += '<div class="prog-card ' + subClass(sk) + ' card">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">' +
      '<div style="display:flex;align-items:center;gap:14px;">' +
      '<div style="width:52px;height:52px;background:rgba(255,255,255,0.15);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:24px;"><i class="fas ' + subIcons[sk] + '"></i></div>' +
      '<div>' +
      '<h3 class="bng" style="font-size:22px;color:#fff;">' + subNames[sk].toUpperCase() + '</h3>' +
      '<p style="color:rgba(255,255,255,0.7);font-size:13px;"><i class="fas fa-check-circle"></i> ' + p.correct + '/' + p.total + ' correct &bull; ' + p.quizzes + ' quizzes</p>' +
      '</div>' +
      '</div>' +
      '<span class="bng" style="font-size:38px;color:#fff;">' + p.pct + '%</span>' +
      '</div>' +
      '<div class="prog-bar-track"><div class="prog-bar-fill" style="width:' + p.pct + '%;background:' + subFill[sk] + ';"></div></div>' +
      '</div>';
  });

  /* BADGES */
  var badgeHTML = '<div class="badges-grid">';
  BADGES.forEach(function (b) {
    var locked = !b.earned;
    badgeHTML += '<div class="badge-card ' + (locked ? 'badge-locked' : subClass(b.subKey) + ' card') + '" style="' + (locked ? 'background:rgba(255,255,255,0.04);border-color:rgba(255,255,255,0.08);' : '') + '">';
    badgeHTML += '<div class="badge-icon" style="color:#fff;"><i class="fas ' + b.icon + '"></i></div>';
    badgeHTML += '<div class="badge-name" style="color:' + (locked ? '#555' : '#fff') + ';">' + b.name + '</div>';
    badgeHTML += '<div style="font-size:11px;margin-top:6px;color:' + (locked ? '#444' : 'rgba(255,255,255,0.7)') + ';">' + (locked ? '<i class="fas fa-lock"></i> Locked' : '<i class="fas fa-check"></i> Earned') + '</div>';
    badgeHTML += '</div>';
  });
  badgeHTML += '</div>';

  /* AREAS FOR IMPROVEMENT */
  var improvHTML = '';
  var activeSubjects = ['math', 'sci', 'eng', 'fil', 'abs'];
  var sorted = activeSubjects.slice().sort(function (a, b) { return (PROGRESS[a] ? PROGRESS[a].pct : 0) - (PROGRESS[b] ? PROGRESS[b].pct : 0); });
  sorted.forEach(function (sk) {
    var p = PROGRESS[sk];
    var isGood = p.pct >= 75;
    var tips = {
      math: 'Focus on Algebra and Statistics. Try working through problems step-by-step and check each calculation twice.',
      sci: 'Review Physics fundamentals. Draw diagrams for force and motion problems to visualize the concepts better.',
      eng: 'Practice grammar rules daily. Reading short passages will also sharpen your Reading Comprehension score.',
      fil: 'Pag-aralan ang mga salitang ugat at idyoma. Subukang magbasa ng mga Filipino na teksto upang mapalakas ang talasalitaan.',
      abs: 'Practice identifying patterns in shapes — focus on rotation, reflection, and size changes. Speed comes with repeated exposure.'
    };
    improvHTML += '<div class="improvement-card" style="background:linear-gradient(135deg,' + (isGood ? 'rgba(46,204,113,0.1)' : 'rgba(231,76,60,0.07)') + ',' + (isGood ? 'rgba(0,119,182,0.1)' : 'rgba(192,57,43,0.07)') + ');border-color:' + (isGood ? 'rgba(46,204,113,0.25)' : 'rgba(231,76,60,0.25)') + ';">' +
      '<div class="improvement-icon" style="background:' + (isGood ? subGrad('sci') : subGrad('log')) + '"><i class="fas fa-' + (isGood ? 'circle-check' : 'triangle-exclamation') + '"></i></div>' +
      '<div style="flex:1;">' +
      '<h4 class="bng" style="font-size:18px;color:#fff;margin-bottom:6px;">' + subNames[sk] + ' — ' + p.pct + '%</h4>' +
      (isGood ?
        '<p style="color:#a8f0c8;font-size:14px;line-height:1.7;">Excellent work! You\'re performing above average in ' + subNames[sk] + '. Keep up the great momentum and aim for 90%+!</p>' :
        '<p style="color:#f5ccc8;font-size:14px;line-height:1.7;">' + tips[sk] + '</p>'
      ) +
      '</div>' +
      '</div>';
  });

  return '<div class="page progress-page"><div class="wrap">' +
    backBtn(false, 'home', true) +
    '<h2 class="bng sec-title" style="color:var(--gold);"><i class="fas fa-chart-line"></i> PROGRESS TRACKER</h2>' +
    '<p class="sec-sub">YOUR GROWTH IS MEASURABLE! Every session brings you closer to that PLM acceptance letter. Keep going, PLMAYER!</p>' +
    summaryHTML +
    '<h3 class="bng" style="font-size:26px;color:var(--gold);margin-bottom:24px;"><i class="fas fa-chart-bar"></i> SUBJECT PERFORMANCE</h3>' +
    progHTML +
    '<h3 class="bng" style="font-size:26px;color:var(--gold);margin:48px 0 24px;"><i class="fas fa-award"></i> BADGES EARNED</h3>' +
    badgeHTML +
    '<h3 class="bng" style="font-size:26px;color:var(--gold);margin:48px 0 24px;"><i class="fas fa-triangle-exclamation"></i> AREAS FOR IMPROVEMENT</h3>' +
    improvHTML +
    '<div style="display:flex;gap:16px;margin-top:40px;flex-wrap:wrap;">' +
    '<button class="btn-gold bng" onclick="goTo(\'review\')"><i class="fas fa-book-open"></i> CONTINUE PRACTICING</button>' +
    '<button class="btn-gold bng" onclick="goTo(\'mock-instructions\')"><i class="fas fa-graduation-cap"></i> TAKE MOCK EXAM</button>' +
    '</div>' +
    '<div class="moto-bar"><i class="fas fa-chart-line" style="color:var(--sci-a);margin-right:8px;"></i>Progress isn\'t always visible day to day — but look back a month and see how far you\'ve come. You\'re growing, Isko!</div>' +
    '</div></div>';
}

/* ============================================================
   PAGE: PROFILE
   ============================================================ */
function pageProfile() {
  var username = state.user.username || 'Guest';
  var email = state.user.email || 'Not signed in';
  var isGuest = !state.user.uid;
  var summary = progressSummary();

  return '<div class="page"><div class="wrap">' +
    '<div class="inner-page">' +
    backBtn(false, 'home', true) +
    '<div class="ip-header-card grad-math card">' +
    '<div class="avatar-lg"><i class="fas fa-user-graduate"></i></div>' +
    '<h2 class="bng" style="font-size:32px;color:var(--gold);margin-bottom:6px;">' + username.toUpperCase() + '</h2>' +
    '<p style="color:#bbb;font-size:16px;"><i class="fas fa-envelope" style="color:var(--gold);margin-right:6px;"></i>' + email + '</p>' +
    (isGuest ? '<p style="color:#f0a040;font-size:13px;margin-top:10px;"><i class="fas fa-circle-info"></i> Browsing as Guest — progress is not saved</p>' : '') +
    '<div style="display:flex;justify-content:center;gap:16px;margin-top:20px;flex-wrap:wrap;">' +
    '<span style="background:rgba(255,255,255,0.15);padding:8px 18px;border-radius:10px;font-size:14px;"><i class="fas fa-calendar-check"></i> ' + summary.totalQuizzes + ' Saved Quizzes</span>' +
    '<span style="background:rgba(255,255,255,0.15);padding:8px 18px;border-radius:10px;font-size:14px;"><i class="fas fa-fire"></i> ' + summary.streak + '-Day Streak</span>' +
    '<span style="background:rgba(255,255,255,0.15);padding:8px 18px;border-radius:10px;font-size:14px;"><i class="fas fa-bullseye"></i> ' + summary.avgScore + '% Avg Score</span>' +
    '</div>' +
    '</div>' +
    '<h3 class="bng" style="font-size:24px;color:var(--gold);margin-bottom:20px;"><i class="fas fa-chart-pie"></i> SUBJECT SCORES</h3>' +
    '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:40px;">' +
    '<div class="stat-card card grad-math"><div style="font-size:26px;margin-bottom:8px;"><i class="fas fa-calculator"></i></div><div class="bng" style="color:#fff;font-size:16px;">MATH</div><div class="bng" style="color:var(--gold);font-size:28px;margin-top:4px;">' + PROGRESS.math.pct + '%</div></div>' +
    '<div class="stat-card card grad-sci"><div style="font-size:26px;margin-bottom:8px;"><i class="fas fa-atom"></i></div><div class="bng" style="color:#fff;font-size:16px;">SCIENCE</div><div class="bng" style="color:var(--gold);font-size:28px;margin-top:4px;">' + PROGRESS.sci.pct + '%</div></div>' +
    '<div class="stat-card card grad-eng"><div style="font-size:26px;margin-bottom:8px;"><i class="fas fa-language"></i></div><div class="bng" style="color:#fff;font-size:16px;">ENGLISH</div><div class="bng" style="color:var(--gold);font-size:28px;margin-top:4px;">' + PROGRESS.eng.pct + '%</div></div>' +
    '<div class="stat-card card grad-log"><div style="font-size:26px;margin-bottom:8px;"><i class="fas fa-brain"></i></div><div class="bng" style="color:#fff;font-size:16px;">LOGIC</div><div class="bng" style="color:var(--gold);font-size:28px;margin-top:4px;">' + PROGRESS.log.pct + '%</div></div>' +
    '</div>' +
    '<div style="margin-top:24px;text-align:center;">' +
    '<button class="logout-btn" onclick="showLogoutConfirm()"><i class="fas fa-sign-out-alt"></i> Log Out</button>' +
    '</div>' +
    '</div>' +
    '</div></div>';
}

/* ============================================================
   PAGE: ABOUT
   ============================================================ */
function pageAbout() {
  return '<div class="page"><div class="wrap"><div class="inner-page">' +
    backBtn(false, 'home', true) +
    '<h2 class="bng sec-title" style="color:var(--gold);"><i class="fas fa-circle-info"></i> ABOUT ISKOPREP</h2>' +
    '<p class="sec-sub">Learn about the platform built to help students achieve their PLMAYER dream!</p>' +
    '<div class="instr-card" style="background:linear-gradient(135deg,#5c1a1a,#8b2222);border:2px solid var(--gold);margin-bottom:28px;">' +
    '<h3 class="bng" style="font-size:24px;color:var(--gold);margin-bottom:14px;"><i class="fas fa-bullseye"></i> OUR MISSION</h3>' +
    '<p style="color:#eee;font-size:16px;line-height:1.8;">IskoPrep was created to make PLMAT preparation more accessible, effective, and engaging. It’s designed to help students stay on track and keep improving as they review.</p>' +
    '</div>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:32px;">' +
    '<div class="instr-card ' + subClass('math') + ' card"><i class="fas fa-calculator" style="font-size:28px;margin-bottom:10px;display:block;"></i><h4 class="bng" style="color:#fff;margin-bottom:8px;font-size:18px;">EXPERT QUESTIONS</h4><p style="color:#e8d5f5;font-size:14px;line-height:1.7;">Curated by educators with years of PLMAT experience. Every question is crafted to mirror the real exam.</p></div>' +
    '<div class="instr-card ' + subClass('sci') + ' card"><i class="fas fa-chart-bar" style="font-size:28px;margin-bottom:10px;display:block;"></i><h4 class="bng" style="color:#fff;margin-bottom:8px;font-size:18px;">SMART ANALYTICS</h4><p style="color:#d5f5e3;font-size:14px;line-height:1.7;">Track your growth with detailed performance insights and personalized study recommendations.</p></div>' +
    '<div class="instr-card ' + subClass('eng') + ' card"><i class="fas fa-users" style="font-size:28px;margin-bottom:10px;display:block;"></i><h4 class="bng" style="color:#fff;margin-bottom:8px;font-size:18px;">COMMUNITY</h4><p style="color:#fff5d5;font-size:14px;line-height:1.7;">Join thousands of students preparing together. Study alongside fellow future Iskos and inspire each other.</p></div>' +
    '<div class="instr-card ' + subClass('log') + ' card"><i class="fas fa-mobile-screen" style="font-size:28px;margin-bottom:10px;display:block;"></i><h4 class="bng" style="color:#fff;margin-bottom:8px;font-size:18px;">STUDY ANYWHERE</h4><p style="color:#f5e8d5;font-size:14px;line-height:1.7;">Access your review materials on any device, anytime. Your PLMAT prep never stops, wherever you are.</p></div>' +
    '</div>' +
    '<h3 class="bng" style="font-size:22px;color:var(--gold);margin-bottom:16px;"><i class="fas fa-address-card"></i> CONTACT INFORMATION</h3>' +
    '<div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:28px;">' +
    '<div class="contact-row"><i class="fas fa-envelope"></i> support@iskoprep.com</div>' +
    '<div class="contact-row"><i class="fas fa-phone"></i> +63 912 345 6789</div>' +
    '<div class="contact-row"><i class="fab fa-facebook-f"></i> facebook.com/iskoprep</div>' +
    '<div class="contact-row"><i class="fab fa-instagram"></i> @iskoprep</div>' +
    '<div class="contact-row"><i class="fab fa-tiktok"></i> @iskoprep.ph</div>' +
    '</div>' +
    '<div class="moto-bar"><i class="fas fa-heart" style="color:#e74c3c;margin-right:8px;"></i>IskoPrep is built by PLMAYERS to help you survive and thrive. You are not alone in this journey! </div>' +
    '</div></div></div>';
}

/* ---- BACK BUTTON HELPER ---- */
function backBtn(requireConfirm, fallback, top) {
  var dest = fallback || 'home';
  var onclick = requireConfirm ?
    'showConfirm(function(){clearQuizTimer();clearMockTimer();goTo(\'' + dest + '\')})' :
    'goTo(\'' + dest + '\')';
  var cls = top ? 'back-area-top' : 'back-area';
  return '<div class="' + cls + '">' +
    '<button class="back-btn" onclick="' + onclick + '">' +
    '<i class="fas fa-arrow-left"></i>' +
    '</button>' +
    '</div>';
}

/* ---- INIT ---- */
/* FIREBASE: Add Firebase Auth and data loading here inside DOMContentLoaded:

     // 1. Sign in the user (anonymous or with Google/Email)
     onAuthStateChanged(window.auth, async (user) => {
       if (user) {
         const userId = user.uid;

         // 2. Load user data (progress, badges) from Firestore
         const userDoc = await getDoc(doc(window.db, "users", userId));
         if (userDoc.exists()) {
           const data = userDoc.data();
           if (data.progress) PROGRESS = data.progress;
           if (data.badges) BADGES = data.badges;
         }

         // 3. Start leaderboard real-time listener
         onSnapshot(collection(window.db, "leaderboard"), (snap) => {
           LEADERS = snap.docs.map(d => d.data()).sort((a, b) => b.streak - a.streak);
           if (state.page === 'leaderboard') render();
         });

         render(); // Re-render now that data is loaded
       } else {
         signInAnonymously(window.auth); // Or redirect to a login page
       }
     });
*/
function hideAuthLoader() {
  var loader = document.getElementById('auth-loader');
  if (loader) loader.classList.add('hidden');
}

window.addEventListener('DOMContentLoaded', function () {
  setupInteractiveAudio();

  if (firebaseReady()) {
    var F = window.fbFunctions;

    F.onAuthStateChanged(window.fbAuth, function (firebaseUser) {
      if (firebaseUser) {
        F.getDoc(F.doc(window.fbDb, 'users', firebaseUser.uid))
          .then(function (snap) {
            var data = snap.exists() ? snap.data() : {};
            state.user = {
              uid: firebaseUser.uid,
              username: data.username || firebaseUser.displayName || 'Isko',
              email: firebaseUser.email,
              loggedIn: true,
              streak: data.streak || 0,
              mockExams: data.mockExams || 0,
              mockCorrect: data.mockCorrect || 0,
              mockTotal: data.mockTotal || 0,
              lastStudyDate: data.lastStudyDate || ''
            };
            PROGRESS = normalizeProgress(data.progress || AUTH_PROGRESS_DEFAULT);
            setBadgeState(data.badges);
            if (!snap.exists()) {
              F.setDoc(F.doc(window.fbDb, 'users', firebaseUser.uid), {
                username: state.user.username,
                email: state.user.email,
                uid: firebaseUser.uid,
                joinedAt: F.serverTimestamp(),
                streak: 0,
                mockExams: 0,
                mockCorrect: 0,
                mockTotal: 0,
                lastStudyDate: '',
                subject: 'math',
                icon: 'fa-star',
                progress: copyProgress(AUTH_PROGRESS_DEFAULT),
                badges: []
              }).catch(function (err) { console.warn('Could not create user profile', err); });
            }
            // Load questions from Firestore now that the user is authenticated
            return F.getDocs(F.collection(window.fbDb, 'questions'))
              .then(function (qSnap) {
                qSnap.forEach(function (docSnap) {
                  QUESTIONS[docSnap.id] = docSnap.data();
                });
                
                // UPDATE THE POOLS WITH FIREBASE QUESTIONS!
                buildMock();
              })
              .catch(function (err) {
                console.warn('Could not load questions from Firestore (using built-in questions):', err);
              });
          })
          .then(function () {
            hideLogin();
            hideAuthLoader();
            startLeaderboardListener();
            updateLeaderboardEntry();
            render();
            authActionInProgress = false;
          })
          .catch(function (err) {
            authActionInProgress = false;
            console.warn('Could not load user profile', err);
            hideAuthLoader();
            showLoginError('login-error', 'Signed in, but profile data could not be loaded.');
          });
      } else {
        state.user = { uid: null, username: null, email: null, loggedIn: false };
        PROGRESS = copyProgress(AUTH_PROGRESS_DEFAULT);
        setBadgeState([]);
        stopLeaderboardListener();
        hideAuthLoader();
        showLogin();
        render();
      }
    });
  } else {
    hideAuthLoader();
    showLoginError('login-error', 'Firebase did not load. Please refresh the page.');
  }

  render();
  window.addEventListener('scroll', updateScrollBtns);
  updateScrollBtns();

  window.addEventListener('hashchange', function () {
    var h = window.location.hash.replace('#/', '').replace('#', '');
    if (h) goTo(h || 'home');
  });
});
