import assert from 'assert';
import { normalize, stripSuffixes } from '../utils/queryNormalizer.js';

console.log('Running Normalizer Tests...');

// 1. Basic Normalization Tests
assert.strictEqual(normalize('GTA-V!!!'), 'gta v');
assert.strictEqual(normalize('WITCHER     3'), 'witcher 3');
assert.strictEqual(normalize('Dark Souls™ III'), 'dark souls iii');
assert.strictEqual(normalize('Red Dead Redemption® 2'), 'red dead redemption 2');
assert.strictEqual(normalize('Warcraft III: Reforged'), 'warcraft iii reforged');

// 2. Suffix Stripping Tests
assert.strictEqual(stripSuffixes(normalize('The Witcher 3: Game of the Year Edition')), 'the witcher 3');
assert.strictEqual(stripSuffixes(normalize('Grand Theft Auto V: Premium Edition')), 'grand theft auto v premium');
assert.strictEqual(stripSuffixes(normalize('Spider-Man Remastered')), 'spider man');
assert.strictEqual(stripSuffixes(normalize('Resident Evil 4 Remake')), 'resident evil 4');
assert.strictEqual(stripSuffixes(normalize('Skyrim Special Edition')), 'skyrim special');
assert.strictEqual(stripSuffixes(normalize('Portal 2 HD')), 'portal 2');
assert.strictEqual(stripSuffixes(normalize('Halo: The Master Chief Collection')), 'halo the master chief');

// 3. Prevent emptying base names
assert.strictEqual(stripSuffixes(normalize('Remake')), 'remake');
assert.strictEqual(stripSuffixes(normalize('Edition')), 'edition');
assert.strictEqual(stripSuffixes(normalize('Collection')), 'collection');

console.log('Normalizer Tests: All asserts passed!');
