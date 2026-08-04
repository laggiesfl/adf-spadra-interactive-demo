import { readdir, stat } from 'node:fs/promises';
import { join, relative } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const budget = 512000;
const included = [];

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const full = join(directory, entry.name);
    if (entry.isDirectory() && ['assets', 'src'].includes(relative(root, full).split('/')[0])) await walk(full);
    if (entry.isFile() && (/\.(css|js)$/.test(entry.name) || relative(root, full) === 'index.html')) included.push(full);
  }
}

await walk(root);
const bytes = (await Promise.all(included.map(file => stat(file)))).reduce((sum, item) => sum + item.size, 0);
console.log(`Core demo assets: ${bytes} bytes (${Math.round(bytes / budget * 100)}% of 500 KiB budget)`);
if (bytes > budget) {
  console.error(`Performance budget exceeded by ${bytes - budget} bytes.`);
  process.exitCode = 1;
}
