const fs = require('fs');
const path = require('path');

const wasmSource = path.join(__dirname, 'node_modules', 'sql.js', 'dist', 'sql-wasm.wasm');
const wasmDest = path.join(__dirname, 'src', 'assets', 'sql-wasm.wasm');

const assetsDir = path.join(__dirname, 'src', 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, {recursive: true});
}

fs.copyFileSync(wasmSource, wasmDest);
console.log('WASM Files copied to src/assets.');
