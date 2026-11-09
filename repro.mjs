// Automated reproduction: `npm run build && npm run repro`.
// Clicks "Leave to /other" on the editor twice per run: once while nothing is pending, once
// while the "Apply filter" goto is still loading. Prints whether beforeNavigate saw the click
// and which page the run ended on.
import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

const PORT = 4321;
const ORIGIN = `http://127.0.0.1:${PORT}`;
const RUNS = 5;

const kit = JSON.parse(readFileSync('node_modules/@sveltejs/kit/package.json', 'utf8')).version;
const server = spawn(
	process.execPath,
	[
		'node_modules/vite/bin/vite.js',
		'preview',
		'--host',
		'127.0.0.1',
		'--port',
		String(PORT),
		'--strictPort'
	],
	{ stdio: 'ignore' }
);
const sleep = (ms) => new Promise((done) => setTimeout(done, ms));

const results = [];
let browser;
let chromiumVersion;
try {
	for (let i = 0; ; i++) {
		if (i === 100) throw new Error('vite preview did not start');
		try {
			if ((await fetch(ORIGIN + '/')).ok) break;
		} catch {}
		await sleep(100);
	}

	browser = await chromium.launch();
	chromiumVersion = browser.version();

	for (const pending of [false, true]) {
		for (let run = 0; run < RUNS; run++) {
			const page = await browser.newPage();
			await page.goto(ORIGIN + '/');

			if (pending) {
				await page.getByRole('button', { name: 'Apply filter' }).click();
				await page.locator('.pending').waitFor();
			}
			await page.getByRole('link', { name: 'Leave to /other' }).click();
			// the filter load takes 1.5 s, so everything has settled after 2.5 s
			await sleep(2500);

			const rows = await page.locator('tbody tr').allTextContents();
			results.push({
				case: pending ? 'Leave while the filter loads' : 'Leave',
				'beforeNavigate saw the link': rows.some((row) => row.includes('/other')),
				'ended on': new URL(page.url()).pathname
			});
			await page.close();
		}
	}
} finally {
	await browser?.close();
	server.kill();
}

writeFileSync('results.json', JSON.stringify({ kit, results }, null, 2));
console.log(`@sveltejs/kit ${kit}, Chromium ${chromiumVersion}, ${RUNS} runs per case`);
console.table(results);
