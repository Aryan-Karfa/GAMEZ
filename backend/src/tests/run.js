import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runAllTests() {
  console.log('=== STARTING UNIT TESTS ===\n');
  const files = fs.readdirSync(__dirname);
  const testFiles = files.filter(f => f.endsWith('.test.js'));

  let passed = 0;
  let failed = 0;

  for (const file of testFiles) {
    console.log(`[SUITE] Running ${file}...`);
    try {
      // Dynamic import runs the test script immediately
      await import(path.join('file://', __dirname, file));
      console.log(`[PASS] ${file} passed.\n`);
      passed++;
    } catch (err) {
      console.error(`[FAIL] ${file} failed:`, err.message);
      if (err.stack) console.error(err.stack);
      console.log();
      failed++;
    }
  }

  console.log('=== TEST RESULT SUMMARY ===');
  console.log(`TOTAL SUITES: ${testFiles.length}`);
  console.log(`PASSED: ${passed}`);
  console.log(`FAILED: ${failed}`);

  if (failed > 0) {
    process.exit(1);
  }
}

runAllTests().catch(err => {
  console.error('Test runner error:', err);
  process.exit(1);
});
