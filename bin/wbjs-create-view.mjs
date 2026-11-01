#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, relative, resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';

const toPascalCase = (value) => String(value)
  .replace(/(^|[-_\s]+)(\w)/g, (_, __, char) => char.toUpperCase())
  .replace(/[^A-Za-z0-9]/g, '');

const templates = (viewName) => ({
  '_view.js': `import { createView } from '@wbc-ui/js';

const modules = import.meta.glob(['./**/_*.js', '!./**/_view.js'], { eager: true });

export default createView({ name: '${viewName}View', modules });
`,
  '_data.js': `export default () => ({
  loading: false,
  message: '${viewName} is ready',
});
`,
  '_methods.js': `export default {
  setMessage: (_this, message) => {
    _this._s.message = message;
    _this._update();
  },
};
`,
  '_viewComps.js': `export default {
  jsDive: true,
  comp: 'VCard',
  options: {
    class: 'pa-6',
    html: (_this) => (_item) => _this._s.message,
  },
};
`,
  '_init0.js': `export default (_this) => {
  // Seed state before first-arrow resolution.
};
`,
  '_init.js': `export default (_this) => {
  // Start requests, timers, or DOM-dependent work here.
};
`,
  '_tracker.js': `export default (_this) => {
  // Runs after updates. Avoid unguarded reactive mutations here.
};
`,
  '_finalAction.js': `export default (_this) => {
  // Clear timers, subscriptions, and event listeners here.
};
`,
  '_watchers.js': `export default [
  // [(_this) => _this._s.message, (_this, value, oldValue) => {}],
];
`,
  '_viewOptions.js': `export default {};
`,
});

function routePathFor(targetDirectory) {
  const slug = basename(targetDirectory)
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .toLowerCase();
  return `/${slug}`;
}

export function registerGeneratedRoute({ targetDirectory, routerFile }) {
  if (!existsSync(routerFile)) {
    throw new Error(`Router file not found: ${routerFile}`);
  }
  const source = readFileSync(routerFile, 'utf8');
  const marker = '// wb-views:routes';
  if (!source.includes(marker)) {
    throw new Error(`Route marker not found in ${routerFile}. Add ${marker} inside the routes array.`);
  }

  let importPath = relative(dirname(routerFile), resolve(targetDirectory, '_view.js'))
    .split(sep).join('/');
  if (!importPath.startsWith('.')) importPath = `./${importPath}`;
  const name = `${toPascalCase(basename(targetDirectory))}View`;
  const route = `{ path: '${routePathFor(targetDirectory)}', name: '${name}', component: () => import('${importPath}') },`;
  if (!source.includes(`name: '${name}'`) && !source.includes(`name: "${name}"`)) {
    writeFileSync(routerFile, source.replace(marker, `${marker}\n  ${route}`));
  }
  return route;
}

export function scaffoldView(target, options = {}) {
  if (!target) throw new Error('A target view directory is required.');
  const targetDirectory = resolve(options.cwd || process.cwd(), target);
  const name = toPascalCase(basename(targetDirectory));
  if (!name) throw new Error(`Cannot derive a view name from: ${target}`);

  mkdirSync(targetDirectory, { recursive: true });
  const created = [];
  const skipped = [];
  for (const [file, content] of Object.entries(templates(name))) {
    const output = resolve(targetDirectory, file);
    if (existsSync(output) && !options.force) {
      skipped.push(output);
      continue;
    }
    writeFileSync(output, content);
    created.push(output);
  }

  let route = null;
  if (options.register) {
    const routerFile = resolve(options.cwd || process.cwd(), options.router || 'src/router/index.js');
    route = registerGeneratedRoute({ targetDirectory, routerFile });
  }
  return { targetDirectory, name: `${name}View`, created, skipped, route };
}

function printHelp() {
  console.log(`wbjs-create-view <target> [options]

Create a WBGC _*.js view folder.

Options:
  --force              overwrite existing generated files
  --register           insert a lazy route after // wb-views:routes
  --router <file>      router file (default: src/router/index.js)
  -h, --help           show this help`);
}

export function run(argv = process.argv.slice(2)) {
  if (argv.includes('-h') || argv.includes('--help')) {
    printHelp();
    return 0;
  }
  const routerIndex = argv.indexOf('--router');
  const router = routerIndex >= 0 ? argv[routerIndex + 1] : undefined;
  const target = argv.find((arg, index) => !arg.startsWith('-') && index !== routerIndex + 1);
  if (!target) {
    printHelp();
    throw new Error('Missing target view directory.');
  }
  const result = scaffoldView(target, {
    force: argv.includes('--force'),
    register: argv.includes('--register'),
    router,
  });
  console.log(`Created ${result.created.length} file(s) in ${result.targetDirectory}.`);
  if (result.skipped.length) console.log(`Skipped ${result.skipped.length} existing file(s); use --force to overwrite.`);
  if (result.route) console.log(`Registered route: ${result.route}`);
  return 0;
}

const isMain = process.argv[1]
  && pathToFileURL(resolve(process.argv[1])).href === import.meta.url;
if (isMain) {
  try {
    run();
  } catch (error) {
    console.error(`[wbjs-create-view] ${error.message}`);
    process.exitCode = 1;
  }
}
