const fs = require('node:fs');
const path = require('node:path');

const wasmSource = path.join(__dirname, '..', 'node_modules', 'sql.js', 'dist', 'sql-wasm.wasm');
const assetsDir = path.join(__dirname, '..', 'src', 'assets');
const wasmDest = path.join(assetsDir, 'sql-wasm.wasm');

if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, {recursive: true});
}

fs.copyFileSync(wasmSource, wasmDest);
console.log('WASM Files copied to src/assets.');
