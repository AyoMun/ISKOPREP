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
  math_easy: {
    lesson: 'Arithmetic & Fractions', subject: 'Mathematics', subKey: 'math',
    timer: 80,
    q: [
      { q: 'What is 3/4 + 1/4?', o: ['1', '1/2', '3/8', '7/8'], a: 0 },
      { q: 'What is 25% of 80?', o: ['15', '20', '25', '40'], a: 1 },
      { q: 'Which fraction is equivalent to 2/4?', o: ['2/3', '3/4', '1/2', '1/4'], a: 2 },
      { q: 'What is 7 × 8?', o: ['54', '56', '48', '64'], a: 1 },
      { q: 'What is 100 − 37?', o: ['73', '67', '63', '53'], a: 2 },
      { q: 'What is 3/5 of 25?', o: ['10', '12', '15', '20'], a: 2 },
      { q: 'Round 4.67 to the nearest whole number.', o: ['4', '5', '6', '7'], a: 1 },
      { q: 'What is 144 ÷ 12?', o: ['10', '11', '12', '13'], a: 2 },
      { q: 'What is 5/8 − 1/8?', o: ['3/8', '4/8', '6/8', '1/2'], a: 1 },
      { q: 'What is 1/3 of 90?', o: ['15', '20', '30', '45'], a: 2 }
    ]
  },
  math_moderate: {
    lesson: 'Geometry', subject: 'Mathematics', subKey: 'math',
    timer: 60,
    q: [
      { q: 'What is the area of a rectangle with length 8 and width 5?', o: ['13', '26', '40', '80'], a: 2 },
      { q: 'The angles of a triangle sum to:', o: ['90°', '180°', '270°', '360°'], a: 1 },
      { q: 'A square has a perimeter of 36. What is its side length?', o: ['6', '9', '12', '18'], a: 1 },
      { q: 'What type of angle measures exactly 90°?', o: ['Acute', 'Right', 'Obtuse', 'Straight'], a: 1 },
      { q: 'The area of a triangle with base 10 and height 6 is:', o: ['60', '30', '16', '32'], a: 1 },
      { q: 'A circle has a diameter of 10. What is its radius?', o: ['20', '10', '5', '100'], a: 2 },
      { q: 'How many sides does a hexagon have?', o: ['5', '6', '7', '8'], a: 1 },
      { q: 'What is the volume of a cube with side 4?', o: ['16', '48', '64', '96'], a: 2 },
      { q: 'Two lines that never meet are called:', o: ['Perpendicular', 'Intersecting', 'Parallel', 'Diagonal'], a: 2 },
      { q: 'What is the perimeter of a rectangle with length 9 and width 4?', o: ['36', '26', '13', '18'], a: 1 }
    ]
  },
  math_hard: {
    lesson: 'Algebra', subject: 'Mathematics', subKey: 'math',
    timer: 45,
    q: [
      { q: 'If 2x + 5 = 13, what is x?', o: ['4', '6', '9', '3'], a: 0 },
      { q: 'What is the value of x in 3x − 7 = 14?', o: ['5', '7', '9', '21'], a: 1 },
      { q: 'Simplify: (x²)(x³)', o: ['x⁵', 'x⁶', '2x⁵', 'x'], a: 0 },
      { q: 'If f(x) = 2x + 3, what is f(5)?', o: ['10', '13', '11', '15'], a: 1 },
      { q: 'Solve: x² − 9 = 0. What is x?', o: ['±3', '±9', '3', '9'], a: 0 },
      { q: 'What is the slope of y = 3x + 2?', o: ['2', '3', '5', '6'], a: 1 },
      { q: 'Factor: x² + 5x + 6', o: ['(x+1)(x+6)', '(x+2)(x+3)', '(x+3)(x+4)', '(x+4)(x+2)'], a: 1 },
      { q: 'What is the y-intercept of y = 4x − 7?', o: ['4', '−7', '7', '−4'], a: 1 },
      { q: 'Solve: 2(x + 3) = 14. What is x?', o: ['4', '5', '6', '7'], a: 0 },
      { q: 'If 5x = 25, then x = ?', o: ['3', '4', '5', '6'], a: 2 }
    ]
  },
  math_advanced: {
    lesson: 'Statistics & Probability', subject: 'Mathematics', subKey: 'math',
    timer: 30,
    q: [
      { q: 'The mean of 4, 8, 6, 10, 2 is:', o: ['5', '6', '7', '8'], a: 1 },
      { q: 'What is the median of 3, 7, 5, 9, 1?', o: ['5', '7', '3', '9'], a: 0 },
      { q: 'What is the mode of 2, 4, 4, 6, 8, 4?', o: ['2', '4', '6', '8'], a: 1 },
      { q: 'P(rolling a 3 on a fair die) = ?', o: ['1/3', '1/6', '1/2', '1/4'], a: 1 },
      { q: 'A bag has 3 red and 2 blue balls. P(red) = ?', o: ['3/5', '2/5', '3/2', '1/2'], a: 0 },
      { q: 'The range of 5, 12, 3, 8, 17 is:', o: ['12', '14', '17', '9'], a: 1 },
      { q: 'P(getting heads twice in 2 coin flips) = ?', o: ['1/2', '1/4', '1/3', '3/4'], a: 1 },
      { q: 'A class of 30 has 18 girls. What % are boys?', o: ['40%', '60%', '18%', '30%'], a: 0 },
      { q: 'Standard deviation measures:', o: ['Central tendency', 'Spread of data', 'Sum of data', 'Most frequent value'], a: 1 },
      { q: 'P(A or B): P(A)=0.3, P(B)=0.4, mutually exclusive = ?', o: ['0.7', '0.12', '0.1', '1.0'], a: 0 }
    ]
  },
  sci_easy: {
    lesson: 'Earth Science', subject: 'Science', subKey: 'sci',
    timer: 80,
    q: [
      { q: 'What layer of Earth do we live on?', o: ['Mantle', 'Core', 'Crust', 'Lithosphere'], a: 2 },
      { q: 'What gas makes up most of Earth\'s atmosphere?', o: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Hydrogen'], a: 2 },
      { q: 'What causes day and night?', o: ['Earth\'s revolution', 'Earth\'s rotation', 'The Moon', 'The Sun\'s movement'], a: 1 },
      { q: 'Which type of rock is formed from cooled magma?', o: ['Sedimentary', 'Metamorphic', 'Igneous', 'Fossil'], a: 2 },
      { q: 'The process by which water vapor becomes liquid is:', o: ['Evaporation', 'Condensation', 'Precipitation', 'Transpiration'], a: 1 },
      { q: 'What is the largest ocean?', o: ['Atlantic', 'Indian', 'Arctic', 'Pacific'], a: 3 },
      { q: 'Earthquakes are measured using a:', o: ['Thermometer', 'Seismograph', 'Barometer', 'Telescope'], a: 1 },
      { q: 'Which planet is closest to the Sun?', o: ['Venus', 'Mars', 'Mercury', 'Earth'], a: 2 },
      { q: 'What type of eclipse occurs when the Moon blocks the Sun?', o: ['Lunar', 'Solar', 'Partial Lunar', 'Total Lunar'], a: 1 },
      { q: 'Which is the hottest planet in the solar system?', o: ['Mercury', 'Mars', 'Venus', 'Jupiter'], a: 2 }
    ]
  },
  sci_moderate: {
    lesson: 'Biology', subject: 'Science', subKey: 'sci',
    timer: 60,
    q: [
      { q: 'What is the powerhouse of the cell?', o: ['Nucleus', 'Ribosome', 'Mitochondria', 'Golgi body'], a: 2 },
      { q: 'What process do plants use to make food?', o: ['Respiration', 'Photosynthesis', 'Digestion', 'Fermentation'], a: 1 },
      { q: 'What is the basic unit of life?', o: ['Organ', 'Tissue', 'Cell', 'Atom'], a: 2 },
      { q: 'Which organ pumps blood through the body?', o: ['Lungs', 'Kidneys', 'Heart', 'Brain'], a: 2 },
      { q: 'What gas do plants absorb for photosynthesis?', o: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'], a: 2 },
      { q: 'How many chambers does the human heart have?', o: ['2', '3', '4', '5'], a: 2 },
      { q: 'The study of heredity is called:', o: ['Ecology', 'Genetics', 'Anatomy', 'Physiology'], a: 1 },
      { q: 'Which blood type is the universal donor?', o: ['A', 'B', 'O', 'AB'], a: 2 },
      { q: 'DNA carries the instructions for:', o: ['Breathing', 'Making proteins', 'Pumping blood', 'Digesting food'], a: 1 },
      { q: 'Which organelle is responsible for protein synthesis?', o: ['Mitochondria', 'Ribosome', 'Vacuole', 'Lysosome'], a: 1 }
    ]
  },
  sci_hard: {
    lesson: 'Physics', subject: 'Science', subKey: 'sci',
    timer: 45,
    q: [
      { q: 'Newton\'s 2nd Law states F = ?', o: ['mv', 'ma', 'm/a', 'm+a'], a: 1 },
      { q: 'What is the unit of force?', o: ['Joule', 'Newton', 'Watt', 'Pascal'], a: 1 },
      { q: 'Speed = ?', o: ['Distance × Time', 'Time / Distance', 'Distance / Time', 'Distance + Time'], a: 2 },
      { q: 'What is the speed of light (approximate)?', o: ['3×10⁶ m/s', '3×10⁸ m/s', '3×10¹⁰ m/s', '3×10⁴ m/s'], a: 1 },
      { q: 'Ohm\'s Law states V = ?', o: ['I+R', 'IR', 'I/R', 'I×P'], a: 1 },
      { q: 'What happens to pressure as depth in water increases?', o: ['Decreases', 'Stays same', 'Increases', 'Becomes zero'], a: 2 },
      { q: 'Which electromagnetic wave has the highest frequency?', o: ['Radio', 'X-ray', 'Infrared', 'Gamma ray'], a: 3 },
      { q: 'A car at 60 km/h for 2 hours travels:', o: ['100 km', '120 km', '90 km', '60 km'], a: 1 },
      { q: 'Energy is measured in:', o: ['Watts', 'Newtons', 'Joules', 'Pascals'], a: 2 },
      { q: 'The law of conservation of energy states that energy is:', o: ['Created', 'Destroyed', 'Neither created nor destroyed', 'Always kinetic'], a: 2 }
    ]
  },
  eng_easy: {
    lesson: 'Parts of Speech', subject: 'English', subKey: 'eng',
    timer: 80,
    q: [
      { q: 'Identify the noun in: "The dog runs fast."', o: ['runs', 'fast', 'dog', 'The'], a: 2 },
      { q: 'What part of speech is "quickly"?', o: ['Adjective', 'Noun', 'Adverb', 'Verb'], a: 2 },
      { q: '"Beautiful" is a:', o: ['Noun', 'Verb', 'Adjective', 'Adverb'], a: 2 },
      { q: 'In "She sings well," "sings" is a:', o: ['Noun', 'Verb', 'Adjective', 'Pronoun'], a: 1 },
      { q: 'What is the pronoun in "He loves reading"?', o: ['loves', 'reading', 'He', 'the'], a: 2 },
      { q: '"Under the table" — "under" is a:', o: ['Conjunction', 'Preposition', 'Adverb', 'Verb'], a: 1 },
      { q: 'Which is a proper noun?', o: ['city', 'happiness', 'Manila', 'tree'], a: 2 },
      { q: '"But" in "I tried but failed" is a:', o: ['Preposition', 'Adverb', 'Conjunction', 'Noun'], a: 2 },
      { q: 'Identify the verb: "Maria writes stories."', o: ['Maria', 'writes', 'stories', 'her'], a: 1 },
      { q: '"Wow!" is an example of:', o: ['Preposition', 'Conjunction', 'Adjective', 'Interjection'], a: 3 }
    ]
  },
  eng_moderate: {
    lesson: 'Grammar Fundamentals', subject: 'English', subKey: 'eng',
    timer: 60,
    q: [
      { q: 'Choose the correct: "The team ___ playing well."', o: ['are', 'is', 'were', 'have'], a: 1 },
      { q: '"Neither the boys nor the girl ___ here."', o: ['are', 'am', 'is', 'were'], a: 2 },
      { q: 'The past tense of "run" is:', o: ['runned', 'ran', 'run', 'ranned'], a: 1 },
      { q: 'Which sentence is correct?', o: ['She don\'t know', 'She doesn\'t know', 'She didn\'t knew', 'She not know'], a: 1 },
      { q: 'Choose the correct: "He is ___ intelligent than his brother."', o: ['more', 'most', 'much', 'very'], a: 0 },
      { q: '"I have ___ my homework." (correct past participle)', o: ['did', 'done', 'do', 'doing'], a: 1 },
      { q: 'Which sentence uses the passive voice?', o: ['She baked a cake.', 'A cake was baked.', 'She bakes.', 'She will bake.'], a: 1 },
      { q: '"If I were rich, I ___ buy a house."', o: ['will', 'would', 'shall', 'can'], a: 1 },
      { q: 'The plural of "criterion" is:', o: ['criterions', 'criteria', 'criterias', 'criterionz'], a: 1 },
      { q: 'Identify the error: "Between you and I, this is wrong."', o: ['Between', 'you and I', 'this', 'wrong'], a: 1 }
    ]
  },
  eng_hard: {
    lesson: 'Sentence Structure', subject: 'English', subKey: 'eng',
    timer: 45,
    q: [
      { q: 'A sentence with two independent clauses joined by a conjunction is:', o: ['Simple', 'Compound', 'Complex', 'Fragment'], a: 1 },
      { q: 'Identify the dependent clause: "Although she studied, she failed."', o: ['she failed', 'Although she studied', 'she studied', 'Both clauses'], a: 1 },
      { q: 'What is a sentence fragment?', o: ['A run-on sentence', 'An incomplete thought', 'A complex sentence', 'A declarative sentence'], a: 1 },
      { q: 'Which is a run-on sentence?', o: ['She studied hard, and she passed.', 'She studied hard she passed.', 'Although she studied hard.', 'She studied.'], a: 1 },
      { q: '"The man who called yesterday left." The relative clause is:', o: ['The man', 'who called yesterday', 'left', 'The man left'], a: 1 },
      { q: 'What is the subject in "Running fast, John won the race"?', o: ['Running fast', 'John', 'won', 'race'], a: 1 },
      { q: 'Identify the appositive: "My teacher, Dr. Cruz, teaches math."', o: ['My teacher', 'Dr. Cruz', 'teaches math', 'math'], a: 1 },
      { q: 'A subordinating conjunction introduces:', o: ['An independent clause', 'A dependent clause', 'A phrase', 'A noun'], a: 1 },
      { q: 'What type of phrase is "with great courage"?', o: ['Noun phrase', 'Prepositional phrase', 'Verb phrase', 'Adjective phrase'], a: 1 },
      { q: 'Which has correct parallel structure?', o: ['She likes running, to swim, and biking.', 'She likes running, swimming, and biking.', 'She likes run, swim, bike.', 'She runs, swims, biking.'], a: 1 }
    ]
  },
  eng_advanced: {
    lesson: 'Basic Reading Comprehension', subject: 'English', subKey: 'eng',
    timer: 30,
    q: [
      { q: '"The benevolent teacher helped struggling students." "Benevolent" means:', o: ['strict', 'kind', 'indifferent', 'harsh'], a: 1 },
      { q: 'What is the main idea of: "Regular exercise improves health, boosts energy, and reduces stress"?', o: ['Exercise is hard', 'Exercise has many benefits', 'People should rest', 'Stress is bad'], a: 1 },
      { q: '"Consequently" signals:', o: ['Contrast', 'Cause and effect', 'Time', 'Addition'], a: 1 },
      { q: '"Unlike her outgoing sister, Maria was reserved." What does "reserved" mean?', o: ['Shy/quiet', 'Bold', 'Friendly', 'Loud'], a: 0 },
      { q: 'A biography is written about:', o: ['Fictional characters', 'Real people', 'Animals', 'Places'], a: 1 },
      { q: 'What is inference?', o: ['A direct statement', 'A conclusion drawn from clues', 'A summary', 'A title'], a: 1 },
      { q: 'The tone of "This is absolutely unacceptable behavior!" is:', o: ['Happy', 'Sad', 'Angry/Emphatic', 'Neutral'], a: 2 },
      { q: '"Despite being tired, she finished the report." "Despite" shows:', o: ['Cause', 'Contrast', 'Addition', 'Time'], a: 1 },
      { q: 'What is the purpose of a thesis statement?', o: ['To conclude', 'To state the main argument', 'To provide examples', 'To ask a question'], a: 1 },
      { q: 'Context clues help readers determine:', o: ['Plot', 'Word meaning', 'Author\'s name', 'Publication date'], a: 1 }
    ]
  },
  log_easy: {
    lesson: 'Shape Patterns', subject: 'Logical Reasoning', subKey: 'log',
    timer: 80,
    q: [
      { q: 'What comes next? Circle, Square, Triangle, Circle, Square, ___', o: ['Circle', 'Triangle', 'Square', 'Pentagon'], a: 1 },
      { q: 'What is next in the sequence: 2, 4, 6, 8, ___?', o: ['9', '10', '12', '14'], a: 1 },
      { q: 'What comes next: 100, 90, 80, 70, ___?', o: ['65', '60', '55', '50'], a: 1 },
      { q: 'What is the missing number: 2, 4, ___, 16, 32?', o: ['6', '8', '10', '12'], a: 1 },
      { q: 'Next in: 1, 3, 5, 7, ___?', o: ['8', '9', '10', '11'], a: 1 },
      { q: 'Pattern: Red, Blue, Green, Red, Blue, ___?', o: ['Red', 'Blue', 'Green', 'Yellow'], a: 2 },
      { q: 'What comes next: 50, 45, 40, 35, ___?', o: ['32', '30', '28', '25'], a: 1 },
      { q: 'Next: A, C, E, G, ___?', o: ['H', 'I', 'J', 'K'], a: 1 },
      { q: 'Pattern: 1, 2, 4, 8, ___?', o: ['12', '14', '16', '18'], a: 2 },
      { q: 'What comes next: 3, 6, 9, 12, ___?', o: ['13', '14', '15', '16'], a: 2 }
    ]
  },
  log_moderate: {
    lesson: 'Classification', subject: 'Logical Reasoning', subKey: 'log',
    timer: 60,
    q: [
      { q: 'Which does NOT belong: Apple, Orange, Banana, Carrot?', o: ['Apple', 'Banana', 'Carrot', 'Orange'], a: 2 },
      { q: 'Dog, Cat, Horse, Eagle — which is different?', o: ['Dog', 'Cat', 'Horse', 'Eagle'], a: 3 },
      { q: 'Which does NOT belong: Monday, Tuesday, June, Friday?', o: ['Monday', 'June', 'Friday', 'Tuesday'], a: 1 },
      { q: 'Which number does NOT belong: 2, 4, 6, 9, 12?', o: ['2', '6', '9', '12'], a: 2 },
      { q: 'Rose, Tulip, Sunflower, Fern — which is different?', o: ['Rose', 'Tulip', 'Sunflower', 'Fern'], a: 3 },
      { q: 'Tokyo, Paris, Manila, Asia — which is different?', o: ['Tokyo', 'Manila', 'Asia', 'Paris'], a: 2 },
      { q: 'Hammer, Saw, Screwdriver, Eraser — which does NOT belong?', o: ['Hammer', 'Saw', 'Eraser', 'Screwdriver'], a: 2 },
      { q: 'Red, Blue, Triangle, Green — which is different?', o: ['Red', 'Blue', 'Green', 'Triangle'], a: 3 },
      { q: 'Mercury, Venus, Earth, Moon — which is different?', o: ['Mercury', 'Earth', 'Moon', 'Venus'], a: 2 },
      { q: 'Piano, Guitar, Violin, Drums — Drums is different because:', o: ['It is louder', 'It has no strings', 'It is bigger', 'It is older'], a: 1 }
    ]
  },
  log_hard: {
    lesson: 'Analogies', subject: 'Logical Reasoning', subKey: 'log',
    timer: 45,
    q: [
      { q: 'Fish : Water :: Bird : ___', o: ['Sky', 'Air', 'Tree', 'Nest'], a: 1 },
      { q: 'Doctor : Hospital :: Teacher : ___', o: ['School', 'Office', 'Library', 'University'], a: 0 },
      { q: 'Hot : Cold :: Light : ___', o: ['Dark', 'Day', 'Sun', 'Heavy'], a: 0 },
      { q: 'Book : Read :: Music : ___', o: ['Watch', 'Listen', 'See', 'Smell'], a: 1 },
      { q: '5 : 25 :: 6 : ___', o: ['30', '36', '12', '18'], a: 1 },
      { q: 'Glove : Hand :: Hat : ___', o: ['Hair', 'Face', 'Head', 'Ear'], a: 2 },
      { q: 'Cat : Meow :: Dog : ___', o: ['Purr', 'Bark', 'Moo', 'Quack'], a: 1 },
      { q: 'Scene : Play :: Chapter : ___', o: ['Book', 'Song', 'Poem', 'Movie'], a: 0 },
      { q: 'Physician : Medicine :: Lawyer : ___', o: ['Court', 'Law', 'Business', 'Science'], a: 1 },
      { q: 'Up : Down :: North : ___', o: ['East', 'West', 'South', 'Right'], a: 2 }
    ]
  }
};

/* ---- MOCK EXAM QUESTIONS (40 total, 10 per subject) ---- */
var MOCK_QUESTIONS = [];
(function buildMock() {
  function pick(pool, n) {
    return pool.slice(0, n);
  }
  var mathPool = [].concat(
    QUESTIONS.math_easy.q.slice(0, 3).map(function (q) { return Object.assign({}, q, { subject: 'Math', subKey: 'math' }) }),
    QUESTIONS.math_moderate.q.slice(0, 3).map(function (q) { return Object.assign({}, q, { subject: 'Math', subKey: 'math' }) }),
    QUESTIONS.math_hard.q.slice(0, 2).map(function (q) { return Object.assign({}, q, { subject: 'Math', subKey: 'math' }) }),
    QUESTIONS.math_advanced.q.slice(0, 2).map(function (q) { return Object.assign({}, q, { subject: 'Math', subKey: 'math' }) })
  );
  var sciPool = [].concat(
    QUESTIONS.sci_easy.q.slice(0, 4).map(function (q) { return Object.assign({}, q, { subject: 'Science', subKey: 'sci' }) }),
    QUESTIONS.sci_moderate.q.slice(0, 3).map(function (q) { return Object.assign({}, q, { subject: 'Science', subKey: 'sci' }) }),
    QUESTIONS.sci_hard.q.slice(0, 3).map(function (q) { return Object.assign({}, q, { subject: 'Science', subKey: 'sci' }) })
  );
  var engPool = [].concat(
    QUESTIONS.eng_easy.q.slice(0, 3).map(function (q) { return Object.assign({}, q, { subject: 'English', subKey: 'eng' }) }),
    QUESTIONS.eng_moderate.q.slice(0, 3).map(function (q) { return Object.assign({}, q, { subject: 'English', subKey: 'eng' }) }),
    QUESTIONS.eng_hard.q.slice(2, 4).map(function (q) { return Object.assign({}, q, { subject: 'English', subKey: 'eng' }) }),
    QUESTIONS.eng_advanced.q.slice(0, 2).map(function (q) { return Object.assign({}, q, { subject: 'English', subKey: 'eng' }) })
  );
  var logPool = [].concat(
    QUESTIONS.log_easy.q.slice(0, 4).map(function (q) { return Object.assign({}, q, { subject: 'Logical Reasoning', subKey: 'log' }) }),
    QUESTIONS.log_moderate.q.slice(0, 3).map(function (q) { return Object.assign({}, q, { subject: 'Logical Reasoning', subKey: 'log' }) }),
    QUESTIONS.log_hard.q.slice(0, 3).map(function (q) { return Object.assign({}, q, { subject: 'Logical Reasoning', subKey: 'log' }) })
  );
  MOCK_QUESTIONS = [].concat(mathPool, sciPool, engPool, logPool);
})();

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
  { name: 'Logic Legend', icon: 'fa-brain', subKey: 'log', earned: false },
  { name: 'Mock Master', icon: 'fa-graduation-cap', subKey: 'math', earned: false },
  { name: 'Top 10', icon: 'fa-trophy', subKey: 'sci', earned: false }
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
  log: { pct: 0, quizzes: 0, correct: 0, total: 0 }
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
  log: { pct: 0, quizzes: 0, correct: 0, total: 0 }
};
var DEMO_PROGRESS_SIGNATURE = {
  math: { pct: 72, quizzes: 45, correct: 324, total: 450 },
  sci: { pct: 65, quizzes: 38, correct: 247, total: 380 },
  eng: { pct: 80, quizzes: 52, correct: 416, total: 520 },
  log: { pct: 58, quizzes: 30, correct: 174, total: 300 }
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
  var m = { math: ['var(--math-a)', 'var(--math-b)'], sci: ['var(--sci-a)', 'var(--sci-b)'], eng: ['var(--eng-a)', 'var(--eng-b)'], log: ['var(--log-a)', 'var(--log-b)'] };
  return m[k] || m.math;
}
function subGrad(k) { var c = subColor(k); return 'linear-gradient(135deg,' + c[0] + ',' + c[1] + ')'; }
function subClass(k) { return { math: 'grad-math glow-math', sci: 'grad-sci glow-sci', eng: 'grad-eng glow-eng', log: 'grad-log glow-log' }[k] || 'grad-math'; }
function subTextColor(k) { return { math: '#e8d5f5', sci: '#d5f5e3', eng: '#fff5d5', log: '#f5e8d5' }[k] || '#eee'; }
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
    log: '<i class="fas fa-lightbulb"></i> Pro Tip: Look for what\'s different, not what\'s the same. The odd one out is usually obvious once you spot the pattern.'
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
  ['math', 'sci', 'eng', 'log'].forEach(function (sk) {
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
  return ['math', 'sci', 'eng', 'log'].every(function (sk) {
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
  ['math', 'sci', 'eng', 'log'].forEach(function (sk) {
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
    const audio = new Audio(isHighScore ? 'high_score.mp3' : 'low_score.mp3');
    audio.play();
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

    '<div class="path-card" onclick="goTo(\'leaderboard\')" style="border-left:5px solid var(--log-a);--pc:var(--log-a);">' +
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

    '<div class="path-card" onclick="goTo(\'progress\')" style="border-left:5px solid var(--eng-a);--pc:var(--eng-a);">' +
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
    '<div class="contact-row"><i class="fas fa-map-marker-alt"></i> Diliman, Quezon City, Philippines</div>' +
    '<div class="contact-row"><i class="fas fa-paper-plane"></i> Send us your feedback anytime!</div>' +
    '<h3 class="bng" style="color:var(--gold);font-size:22px;margin:24px 0 14px;"><i class="fas fa-share-nodes"></i> FOLLOW US</h3>' +
    '<div class="social-row">' +
    '<div class="social-btn" style="background:#3b5998;" title="Facebook"><i class="fab fa-facebook-f"></i></div>' +
    '<div class="social-btn" style="background:linear-gradient(135deg,#f58529,#dd2a7b);" title="Instagram"><i class="fab fa-instagram"></i></div>' +
    '<div class="social-btn" style="background:#000;" title="TikTok"><i class="fab fa-tiktok"></i></div>' +
    '<div class="social-btn" style="background:#1da1f2;" title="Twitter/X"><i class="fab fa-x-twitter"></i></div>' +
    '</div>' +
    '<div class="search-wrap">' +
    '<i class="fas fa-search"></i>' +
    '<input type="text" placeholder="Search topics, lessons, or features...">' +
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
      key: 'math', label: 'MATHEMATICS', icon: 'fa-square-root-variable',
      diff: [
        { k: 'math_easy', n: 'Arithmetic & Fractions', d: 'Easy' },
        { k: 'math_moderate', n: 'Geometry', d: 'Moderate' },
        { k: 'math_hard', n: 'Algebra', d: 'Hard' },
        { k: 'math_advanced', n: 'Statistics & Probability', d: 'Advanced' }
      ]
    },
    {
      key: 'sci', label: 'SCIENCE', icon: 'fa-atom',
      diff: [
        { k: 'sci_easy', n: 'Earth Science', d: 'Easy' },
        { k: 'sci_moderate', n: 'Biology', d: 'Moderate' },
        { k: 'sci_hard', n: 'Physics', d: 'Hard' }
      ]
    },
    {
      key: 'eng', label: 'ENGLISH', icon: 'fa-language',
      diff: [
        { k: 'eng_easy', n: 'Parts of Speech', d: 'Easy' },
        { k: 'eng_moderate', n: 'Grammar Fundamentals', d: 'Moderate' },
        { k: 'eng_hard', n: 'Sentence Structure', d: 'Hard' },
        { k: 'eng_advanced', n: 'Basic Reading Comprehension', d: 'Advanced' }
      ]
    },
    {
      key: 'log', label: 'LOGICAL REASONING', icon: 'fa-brain',
      diff: [
        { k: 'log_easy', n: 'Shape Patterns', d: 'Easy' },
        { k: 'log_moderate', n: 'Classification', d: 'Moderate' },
        { k: 'log_hard', n: 'Analogies', d: 'Hard' }
      ]
    }
  ];
  var html = '<div class="page review-page"><div class="wrap">';
  html += backBtn(false, 'home', true);
  html += '<h2 class="bng sec-title"><i class="fas fa-book-open" style="color:var(--gold);margin-right:10px;"></i>START REVIEW</h2>';
  html += '<p class="sec-sub">Choose a subject, then select a difficulty to begin. Each quiz has 10 questions. Study well and trust the process!</p>';

  html += '<div class="subjects-grid">';
  subjects.forEach(function (s) {
    var cls = subClass(s.key);
    html += '<div class="subject-block">';
    html += '<div class="bng ' + cls + '" style="display:inline-flex;align-items:center;padding:14px 26px 14px 18px;border-radius:14px;margin-bottom:22px;font-size:20px;">';
    html += '<span style="width:52px;height:52px;background:rgba(255,255,255,0.2);border-radius:10px;display:inline-flex;align-items:center;justify-content:center;margin-right:14px;font-size:24px;"><i class="fas ' + s.icon + '"></i></span>';
    html += s.label + '</div>';
    html += '<div class="diff-row">';
    s.diff.forEach(function (d) {
      var tagCls = d.d === 'Easy' ? 'diff-easy' : d.d === 'Moderate' ? 'diff-mod' : d.d === 'Hard' ? 'diff-hard' : 'diff-adv';
      var timer = QUESTIONS[d.k] ? QUESTIONS[d.k].timer : 60;
      html += '<button class="diff-btn ' + cls + '" style="background:' + subGrad(s.key) + ';" onclick="selectDifficulty(\'' + d.k + '\')">';
      html += '<span class="diff-name">' + d.n + '</span>';
      html += '<span class="diff-tag ' + tagCls + '">' + d.d + ' &bull; ' + Math.floor(timer / 60) + 'm ' + (timer % 60 ? timer % 60 + 's' : '') + '</span>';
      html += '</button>';
    });
    html += '</div></div>';
  });
  html += '</div>';
  html += '<div class="moto-bar"><i class="fas fa-star" style="color:var(--gold);margin-right:8px;"></i>Start with Easy if you\'re reviewing, or challenge yourself with Hard to push your limits. Either way, every question makes you sharper!</div>';
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
  var badgeIndexMap = { math: 2, sci: 3, eng: 4, log: 5 };
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
    log: 'fa-brain'
  }[getBestSubject()];
}

function getBestSubjectName() {
  return {
    math: 'Math',
    sci: 'Science',
    eng: 'English',
    log: 'Logic'
  }[getBestSubject()];
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
    var badgeIndexMap = { math: 2, sci: 3, eng: 4, log: 5 };
    var badgeIndex = badgeIndexMap[subKey];
    if (PROGRESS[subKey].pct >= 85) {
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
    '<li><i class="fas fa-layer-group"></i><div><strong style="color:#fff;">Subjects:</strong> Mathematics, Science, English, Logical Reasoning</div></li>' +
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
  var subColors = { math: '#9d4edd', sci: '#2ecc71', eng: '#f7c948', log: '#f4a261' };
  var subLabel = { math: 'Math', sci: 'Science', eng: 'English', log: 'Logic' };

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
    backBtn(true, 'mock-instructions') +
    '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">' +
    '<h2 class="bng" style="font-size:28px;color:var(--gold);"><i class="fas fa-graduation-cap"></i> MOCK PLMAT EXAM</h2>' +
    '<div style="font-size:15px;color:#bbb;">Question <strong style="color:#fff;">' + (cur + 1) + '</strong> of ' + total + '</div>' +
    '</div>' +
    '<div class="mock-layout">' +
    '<div class="mock-left">' +
    '<div style="padding:6px 12px;border-radius:8px;font-size:13px;display:inline-block;margin-bottom:20px;background:' + subColors[item.subKey] + ';color:#fff;">' +
    '<i class="fas fa-tag"></i> ' + item.subject +
    '</div>' +
    '<div style="font-size:20px;color:#fff;line-height:1.75;margin-bottom:28px;"><strong>' + (cur + 1) + '.</strong> ' + item.q + '</div>' +
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
  var msg = left > 0 ? 'You have ' + left + ' unanswered question(s). Are you sure you want to finish?' : 'You\'ve answered all questions. Ready to finish?';
  // Use confirm dialog
  showConfirm(function () { finishMockExam(); });
  document.querySelector('.modal-box p').textContent = msg;
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
  var subCounts = { math: { c: 0, t: 0 }, sci: { c: 0, t: 0 }, eng: { c: 0, t: 0 }, log: { c: 0, t: 0 } };
  qs.forEach(function (item, i) {
    subCounts[item.subKey].t++;
    if (state.mock.answers[i] === item.a) subCounts[item.subKey].c++;
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
    setTimeout(function () { playScoreResultAudio(pct); }, 250);
  }

  var msg = pct >= 80 ? 'Outstanding! You are PLMAT-ready. UP awaits you!' :
    pct >= 60 ? 'Great effort! Keep practicing and you\'ll ace it.' :
      'Don\'t give up! Review your weak areas and try again.';

  var breakdownHtml = '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin-bottom:40px;">';
  var subNames = { math: 'Math', sci: 'Science', eng: 'English', log: 'Logic' };
  var subIcons = { math: 'fa-calculator', sci: 'fa-atom', eng: 'fa-language', log: 'fa-brain' };
  ['math', 'sci', 'eng', 'log'].forEach(function (sk) {
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
      (ans !== undefined ? '<p style="font-size:14px;color:' + (isCorrect ? '#2ecc71' : '#e74c3c') + ';">Your answer: ' + item.o[ans] + '</p>' : '<p style="font-size:14px;color:#888;">Not answered</p>') +
      (!isCorrect ? '<p style="font-size:14px;color:#2ecc71;margin-top:4px;"><i class="fas fa-check"></i> Correct: ' + item.o[item.a] + '</p>' : '') +
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
  var subGrads = { math: subGrad('math'), sci: subGrad('sci'), eng: subGrad('eng'), log: subGrad('log') };
  var subBadge = { math: 'MATH', sci: 'SCIENCE', eng: 'ENGLISH', log: 'LOGIC' };
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
    var lightBg = 'background:rgba(' + (subject === 'math' ? '157,78,221' : subject === 'sci' ? '46,204,113' : subject === 'eng' ? '247,201,72' : '244,162,97') + ',0.12);';
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
  var subNames = { math: 'Mathematics', sci: 'Science', eng: 'English', log: 'Logical Reasoning' };
  var subIcons = { math: 'fa-calculator', sci: 'fa-atom', eng: 'fa-language', log: 'fa-brain' };
  var subFill = { math: 'linear-gradient(90deg,var(--math-a),#c77dff)', sci: 'linear-gradient(90deg,var(--sci-a),#58d68d)', eng: 'linear-gradient(90deg,var(--eng-a),#f9dc5c)', log: 'linear-gradient(90deg,var(--log-a),#f4c089)' };

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
  ['math', 'sci', 'eng', 'log'].forEach(function (sk) {
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
  var sorted = Object.keys(PROGRESS).sort(function (a, b) { return PROGRESS[a].pct - PROGRESS[b].pct; });
  sorted.forEach(function (sk) {
    var p = PROGRESS[sk];
    var isGood = p.pct >= 75;
    var tips = {
      math: 'Focus on Algebra and Statistics. Try working through problems step-by-step and check each calculation twice.',
      sci: 'Review Physics fundamentals. Draw diagrams for force and motion problems to visualize the concepts better.',
      eng: 'Practice grammar rules daily. Reading short passages will also sharpen your Reading Comprehension score.',
      log: 'Work on Analogies — look for the relationship type first (category, function, degree, etc.) before picking an answer.'
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
    '<p class="sec-sub">Your growth is measurable. Every session brings you closer to that UP acceptance letter. Keep going, Isko!</p>' +
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
   PAGE: SETTINGS
   ============================================================ */
function pageSettings() {
  var items = [
    { icon: 'fa-user', k: 'math', title: 'Account', desc: 'Manage your profile, email, and password' },
    { icon: 'fa-bell', k: 'sci', title: 'Notifications', desc: 'Set up daily study reminders and alerts' },
    { icon: 'fa-palette', k: 'eng', title: 'Appearance', desc: 'Customize theme, font size, and display preferences' },
    { icon: 'fa-database', k: 'log', title: 'Data & Privacy', desc: 'Manage your data, export progress, and privacy settings' },
    { icon: 'fa-shield-halved', k: 'math', title: 'Security', desc: 'Two-factor authentication and login history' },
    { icon: 'fa-circle-question', k: 'sci', title: 'Help & Support', desc: 'FAQs, contact support, and feedback form' }
  ];
  var html = '<div class="page"><div class="wrap"><div class="inner-page">';
  html += backBtn(false, 'home', true);
  html += '<h2 class="bng sec-title" style="color:var(--gold);"><i class="fas fa-gear"></i> SETTINGS</h2>';
  html += '<p class="sec-sub">Customize your IskoPrep experience to fit your study style.</p>';
  items.forEach(function (it) {
    html += '<div class="settings-item">' +
      '<div class="settings-item-icon ' + subClass(it.k) + '"><i class="fas ' + it.icon + '"></i></div>' +
      '<div><h4 style="color:#fff;font-size:17px;margin-bottom:4px;">' + it.title + '</h4><p style="color:#888;font-size:14px;">' + it.desc + '</p></div>' +
      '<i class="fas fa-chevron-right" style="margin-left:auto;color:#555;"></i>' +
      '</div>';
  });
  html += '</div></div></div>';
  return html;
}

/* ============================================================
   PAGE: ABOUT
   ============================================================ */
function pageAbout() {
  return '<div class="page"><div class="wrap"><div class="inner-page">' +
    backBtn(false, 'home', true) +
    '<h2 class="bng sec-title" style="color:var(--gold);"><i class="fas fa-circle-info"></i> ABOUT ISKOPREP</h2>' +
    '<p class="sec-sub">Learn about the platform built to help every Filipino student realize their UP dream.</p>' +
    '<div class="instr-card" style="background:linear-gradient(135deg,#5c1a1a,#8b2222);border:2px solid var(--gold);margin-bottom:28px;">' +
    '<h3 class="bng" style="font-size:24px;color:var(--gold);margin-bottom:14px;"><i class="fas fa-bullseye"></i> OUR MISSION</h3>' +
    '<p style="color:#eee;font-size:16px;line-height:1.8;">IskoPrep was created with one goal: to make PLMAT preparation accessible, effective, and enjoyable for every aspiring Isko and Iska across the Philippines. We believe that with the right tools and guidance, every student can achieve their dream of studying at the University of the Philippines.</p>' +
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
    '<div class="moto-bar"><i class="fas fa-heart" style="color:#e74c3c;margin-right:8px;"></i>IskoPrep is built with love for every Filipino student chasing the UP dream. You are never alone in this journey!</div>' +
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
