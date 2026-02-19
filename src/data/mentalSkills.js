// Mental Skills data — grounded in PMC sport psychology research (PMC3834981)
// and Professional Baseball Strength mental toughness guidelines

export const MINDSET_FLIPS = [
  { negative: '"I struck out again. I\'m terrible at hitting."', positive: '"I haven\'t figured out this pitch yet. What can I change next time?"', tag: 'Hitting' },
  { negative: '"I dropped that fly ball in front of everyone."', positive: '"That was a tough catch. I\'ll practice tracking fly balls this week."', tag: 'Fielding' },
  { negative: '"He throws so fast, I can\'t hit him."', positive: '"I need to start my load earlier. I can adjust."', tag: 'Hitting' },
  { negative: '"I can\'t throw as far as the other kids."', positive: '"My arm is getting stronger. The long toss program will help."', tag: 'Throwing' },
  { negative: '"I\'m nervous and my hands are shaking."', positive: '"I\'m excited. That energy means I\'m ready to compete."', tag: 'Mindset' },
  { negative: '"The other team is way better than us."', positive: '"We play one pitch at a time. Anything can happen."', tag: 'Mindset' },
  { negative: '"I messed up and we lost because of me."', positive: '"One play doesn\'t decide a game. My team needs me ready for the next one."', tag: 'Mindset' },
  { negative: '"Baseball is too hard. I want to quit."', positive: '"Hard things are worth it. What\'s ONE thing I can get better at today?"', tag: 'Mindset' },
];

export const BREATHING_STEPS = [
  { count: 4, label: 'Breathe IN', color: '#005A9C', instruction: 'Slow breath in through your nose. Fill your belly first, then your chest.' },
  { count: 7, label: 'HOLD', color: '#C4A44A', instruction: 'Hold it. Feel your body calm down. Count quietly in your head.' },
  { count: 8, label: 'Breathe OUT', color: '#002D72', instruction: 'Slow breath out through your mouth. Let all the tension go with it.' },
];

export const SELF_TALK = [
  { phrase: '"See it, hit it."', use: 'In the batter\'s box before every pitch', icon: '🏏' },
  { phrase: '"I\'m ready."', use: 'On the mound or in the field before a play', icon: '💪' },
  { phrase: '"Next pitch."', use: 'After a bad result — reset immediately', icon: '🔄' },
  { phrase: '"I\'ve done this a thousand times."', use: 'Before a familiar skill that feels scary in a game', icon: '🧠' },
  { phrase: '"One thing at a time."', use: 'When feeling overwhelmed or thinking about the score', icon: '🎯' },
  { phrase: '"My team needs me ready."', use: 'After an error — shift focus from yourself to your team', icon: '🤝' },
];

export const PRE_PRACTICE_ROUTINE = [
  { id: 'hydrate', step: 'Drink water before leaving the house', icon: '💧', time: '15 min before' },
  { id: 'gear', step: 'Check your gear bag — glove, bat, helmet, cleats', icon: '🎒', time: '10 min before' },
  { id: 'arrive', step: 'Arrive early — rushed = tense. Early = calm.', icon: '🕐', time: '10 min early' },
  { id: 'warmup', step: 'Jog 2 laps or 3 minutes of light movement', icon: '🏃', time: 'On arrival' },
  { id: 'selfTalk', step: 'Say your pre-practice phrase out loud', icon: '💬', time: 'Before first drill' },
  { id: 'focus', step: 'Pick ONE thing to focus on improving today', icon: '🎯', time: 'With your coach/parent' },
];
