import assert from 'assert';
import { calculateScore, rankResults } from '../utils/searchRanking.js';

console.log('Running Ranking Tests...');

const games = [
  { id: 1, title: 'The Witcher 3: Wild Hunt - Game of the Year Edition', rating: 4.8, added: 12000, releaseDate: '2015-05-18' },
  { id: 2, title: 'The Witcher: Enhanced Edition Director\'s Cut', rating: 4.1, added: 3000, releaseDate: '2007-10-30' },
  { id: 3, title: 'The Witcher 2: Assassins of Kings Enhanced Edition', rating: 4.4, added: 5000, releaseDate: '2011-05-17' },
  { id: 4, title: 'Super Mario Bros.', rating: 4.5, added: 1000, releaseDate: '1985-09-13' },
];

// Test 1: Exact matches score highest
const witcher3Score = calculateScore('witcher 3', games[0]);
const witcher1Score = calculateScore('witcher 3', games[1]);
const witcher2Score = calculateScore('witcher 3', games[2]);

console.log(`Witcher 3 score: ${witcher3Score}`);
console.log(`Witcher 1 score: ${witcher1Score}`);
console.log(`Witcher 2 score: ${witcher2Score}`);

// Witcher 3 should score significantly higher than Witcher 1 or 2
assert.ok(witcher3Score > witcher1Score);
assert.ok(witcher3Score > witcher2Score);

// Test 2: Threshold filters out unrelated games
const results = rankResults('witcher', games);
console.log(`Ranked list count: ${results.length}`);
// Mario should be filtered out because it has score < 25 (it matches nothing in "witcher")
assert.strictEqual(results.some(g => g.id === 4), false);
assert.strictEqual(results.length, 3); // Witcher 1, 2, 3 should remain

// Test 3: Witcher 3 should be ranked first
assert.strictEqual(results[0].id, 1);

// Test 4: Developer Match bonus
const valveGame = { title: 'Portal 2', developers: ['Valve'], rating: 4.7, added: 10000, releaseDate: '2011-04-18' };
const regularGame = { title: 'Portal 2 Clone', rating: 4.7, added: 10000, releaseDate: '2011-04-18' };
const valveScore = calculateScore('valve', valveGame);
const regularScore = calculateScore('valve', regularGame);
assert.ok(valveScore > regularScore);

console.log('Ranking Tests: All asserts passed!');
