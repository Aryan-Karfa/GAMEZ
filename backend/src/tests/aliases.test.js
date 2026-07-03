import assert from 'assert';
import { expandAlias } from '../utils/searchAliases.js';

console.log('Running Alias Tests...');

// 1. Direct match aliases
assert.strictEqual(expandAlias('gta'), 'grand theft auto');
assert.strictEqual(expandAlias('rdr2'), 'red dead redemption 2');
assert.strictEqual(expandAlias('cp2077'), 'cyberpunk 2077');
assert.strictEqual(expandAlias('csgo'), 'counter strike global offensive');

// 2. Word-by-word aliases in compound query
assert.strictEqual(expandAlias('gta 5'), 'grand theft auto 5');
assert.strictEqual(expandAlias('rdr online'), 'red dead redemption online');
assert.strictEqual(expandAlias('gow ragnarok'), 'god of war ragnarok');

// 3. No match cases
assert.strictEqual(expandAlias('witcher 3'), 'witcher 3');
assert.strictEqual(expandAlias('elden ring'), 'elden ring');

console.log('Alias Tests: All asserts passed!');
