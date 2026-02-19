// Arm health, rest rules, and strength-building program
// Sources:
// - Little League Pitch Smart (official pitch count rules)
// - PMC injury prevention in youth baseball (PMC5825337)
// - ASMI (American Sports Medicine Institute) throwing guidelines

// ── Official Little League pitch count limits ──────────────────────────────
export const PITCH_LIMITS = {
  // age: { dailyMax, rest: { minPitches: requiredRestDays } }
  7:  { dailyMax: 50, rest: { 1: 0, 26: 1, 38: 2, 50: 3 } },
  8:  { dailyMax: 50, rest: { 1: 0, 26: 1, 38: 2, 50: 3 } },
  9:  { dailyMax: 75, rest: { 1: 0, 26: 1, 38: 2, 50: 3 } },
  10: { dailyMax: 75, rest: { 1: 0, 26: 1, 38: 2, 50: 3 } },
};

// ── Rest day thresholds for age 7-8 ───────────────────────────────────────
export const REST_RULES_7_8 = [
  { min: 1,  max: 25, days: 0, label: 'No rest required', color: '#27ae60' },
  { min: 26, max: 37, days: 1, label: '1 calendar day of rest', color: '#f39c12' },
  { min: 38, max: 49, days: 2, label: '2 calendar days of rest', color: '#e67e22' },
  { min: 50, max: 50, days: 3, label: '3 calendar days of rest', color: '#e74c3c' },
];

// ── Arm strengthening program (age-appropriate, NO weights) ───────────────
// Research-backed exercises safe for youth athletes (pre-pubescent)
// Focuses on: shoulder stability, rotator cuff activation, scapular strength
// NO resistance bands or weighted balls until age 14+

export const ARM_STRENGTH_PHASES = [
  {
    id: 'phase1',
    phase: 'Phase 1',
    title: 'Shoulder Stability',
    subtitle: 'Weeks 1–3 · Build the foundation',
    description: 'Before throwing harder, build the muscles that protect the shoulder. Safe for any age — no equipment needed.',
    goal: 'Activate the rotator cuff and stabilize the shoulder joint',
    restBetweenSets: '30–60 seconds',
    exercises: [
      {
        name: 'Arm Circles',
        sets: 2,
        reps: '15 forward, 15 backward',
        cue: 'Small circles first, gradually get bigger. Arms straight out to the side.',
        purpose: 'Warm up the shoulder joint and surrounding muscles',
        icon: '🔄',
      },
      {
        name: 'Wall Slides',
        sets: 2,
        reps: '10',
        cue: 'Stand with back flat against a wall, arms at 90°. Slowly slide arms UP overhead while keeping contact with the wall. Slide back down.',
        purpose: 'Trains the rotator cuff and improves shoulder blade movement',
        icon: '🧱',
      },
      {
        name: 'Prone Y-T-W',
        sets: 2,
        reps: '8 each letter',
        cue: 'Lie face down on the floor. Lift arms to form a Y (overhead), then a T (out to sides), then a W (bent elbows, squeeze shoulder blades). Hold each 2 seconds.',
        purpose: 'Builds lower trapezius and rotator cuff — the most important muscles for arm health',
        icon: '✈️',
      },
      {
        name: 'External Rotation Hold',
        sets: 2,
        reps: '10-second holds, 5 reps',
        cue: 'Tuck elbow at your side at 90°. Rotate hand OUTWARD as far as comfortable. Hold 10 seconds. Bodyweight only — no resistance.',
        purpose: 'Directly targets the infraspinatus — the most commonly injured rotator cuff muscle in throwers',
        icon: '💪',
      },
    ],
  },
  {
    id: 'phase2',
    phase: 'Phase 2',
    title: 'Long Toss Progression',
    subtitle: 'Weeks 4–8 · Build distance gradually',
    description: 'Long toss is the gold standard for building arm strength and throwing distance. The key is gradual, structured progression.',
    goal: 'Increase maximum throwing distance and arm endurance safely',
    restBetweenSets: '2 minutes between distances',
    exercises: [
      {
        name: 'Warm-Up: 30ft Flat Catch',
        sets: 1,
        reps: '20 throws',
        cue: 'Start every session here — no skipping. Flat, easy throws. Arm should feel fully loose before increasing distance.',
        purpose: 'Lubricates the shoulder joint, activates arm muscles before stress',
        icon: '🧤',
      },
      {
        name: 'Week 4–5: 45ft',
        sets: 2,
        reps: '10 throws each direction',
        cue: 'Still flat throws — not a rainbow arc. If you can\'t reach flat, don\'t go further yet.',
        purpose: 'Progressive overload — gradually increasing arm load',
        icon: '📏',
      },
      {
        name: 'Week 6–7: 60ft',
        sets: 2,
        reps: '10 throws each direction',
        cue: 'A slight arc is OK at this distance. Still aim for chest-to-chest target.',
        purpose: 'Building shoulder endurance and arm strength at game-realistic distances',
        icon: '📏',
      },
      {
        name: 'Week 8: 75–90ft (if ready)',
        sets: 1,
        reps: '8 throws each direction',
        cue: 'Only progress here if Week 6–7 distances feel comfortable with good mechanics. Never throw through pain.',
        purpose: 'Max distance for age 7–8 in a healthy program',
        icon: '📏',
      },
      {
        name: 'Cool-Down: Pull-backs to 30ft',
        sets: 1,
        reps: '10 throws',
        cue: 'Always end by pulling back to short distance with easy, loose throws. Signals the arm to begin recovery.',
        purpose: 'Active recovery — prevents stiffness and flushes the arm',
        icon: '❄️',
      },
    ],
  },
  {
    id: 'phase3',
    phase: 'Phase 3',
    title: 'Velocity Drills',
    subtitle: 'Ongoing · Once Phase 1 & 2 are mastered',
    description: 'Now that the arm is stronger and the distance is there, focus on mechanics-based velocity — not muscling the ball harder.',
    goal: 'Increase throwing velocity through better mechanics, not arm effort',
    restBetweenSets: '60–90 seconds',
    exercises: [
      {
        name: 'Crow Hop Throws',
        sets: 3,
        reps: '8 throws',
        cue: 'Take a hop-skip ("crow hop") before throwing to build momentum. This is how outfielders generate power. Hop → plant foot → throw.',
        purpose: 'Teaches the body to use lower half momentum to add velocity — reduces arm stress',
        icon: '🦅',
      },
      {
        name: 'Hip-to-Shoulder Separation Drill',
        sets: 2,
        reps: '10 slow reps (dry, no ball)',
        cue: 'Stand in throwing stance. Slowly rotate HIPS to face the target first, then pause, THEN fire the shoulders and arm. Exaggerate the sequence.',
        purpose: 'The #1 source of velocity. Hips lead, arm follows — building this pattern adds MPH without arm strain',
        icon: '🔁',
      },
      {
        name: 'Towel Snap Drill',
        sets: 2,
        reps: '10',
        cue: 'Hold a small hand towel, go through full throwing motion, snap the towel forward at release point. Target a cone 6 inches away — the towel should snap it.',
        purpose: 'Trains wrist snap and arm acceleration at release — critical for velocity and late movement',
        icon: '🏳️',
      },
      {
        name: 'One-Knee Throws',
        sets: 2,
        reps: '10 throws per side',
        cue: 'Kneel on throwing-arm side knee. Throw from this position to a partner. Isolates upper body and arm mechanics — forces proper hip rotation.',
        purpose: 'Isolates the arm path and eliminates compensations from the legs',
        icon: '🦵',
      },
    ],
  },
];

// ── Recovery checklist ─────────────────────────────────────────────────────
export const RECOVERY_CHECKLIST = [
  { id: 'ice', label: 'Ice shoulder/elbow 15–20 min after heavy throwing', icon: '🧊' },
  { id: 'sleep', label: '9–11 hours of sleep (this IS arm recovery)', icon: '😴' },
  { id: 'hydrate', label: 'Drink water before, during, and after practice', icon: '💧' },
  { id: 'nooverhead', label: 'No overhead throwing on rest days — rest means REST', icon: '🚫' },
  { id: 'nopain', label: 'If the arm hurts during throwing — stop immediately', icon: '⚠️' },
  { id: 'stretch', label: 'Sleeper stretch after every throwing session', icon: '🙆' },
];

// ── Warning signs (talk to a doctor) ─────────────────────────────────────
export const WARNING_SIGNS = [
  'Pain or soreness in the elbow or shoulder during or after throwing',
  'Numbness or tingling down the arm',
  'Reduced throwing velocity that doesn\'t improve with rest',
  'Loss of control that isn\'t a mechanics issue',
  'Visible swelling around the elbow or shoulder',
];
