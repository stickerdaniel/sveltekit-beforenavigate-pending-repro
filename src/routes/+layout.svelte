<script>
	import { page } from '$app/state';
	import { log } from '../lib/log.svelte.js';

	let { children } = $props();
</script>

<header>
	<span>{page.url.pathname}{page.url.search}</span>
	<button onclick={() => location.assign('/')}>Restart</button>
</header>

{@render children()}

<section>
	<h2>beforeNavigate log</h2>
	<table data-rows={log.length}>
		<thead>
			<tr>
				<th>type</th>
				<th>to</th>
				<th>result</th>
			</tr>
		</thead>
		<tbody>
			{#each log as row, i (i)}
				<tr>
					<td>{row.type}</td>
					<td>{row.to}</td>
					<td class={row.result}>{row.result}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</section>

<style>
	:global(body) {
		margin: 0;
		font-family: system-ui, sans-serif;
		color: #0f172a;
	}
	:global(main) {
		padding: 28px 24px;
	}
	:global(h1) {
		margin: 0 0 6px;
		font-size: 44px;
	}
	:global(main p) {
		margin: 6px 0 0;
		color: #475569;
		font-size: 17px;
	}
	:global(button) {
		padding: 8px 14px;
		font:
			600 15px system-ui,
			sans-serif;
		border: 0;
		border-radius: 6px;
		background: #e2e8f0;
		color: #0f172a;
		cursor: pointer;
	}
	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 14px 24px;
		background: #0f172a;
		color: #e2e8f0;
		font:
			600 18px ui-monospace,
			monospace;
	}
	section {
		padding: 0 24px 24px;
	}
	h2 {
		margin: 0 0 12px;
		font-size: 20px;
	}
	table {
		border-collapse: collapse;
		font:
			16px ui-monospace,
			monospace;
	}
	th {
		padding: 8px 32px 8px 0;
		text-align: left;
		font:
			600 14px system-ui,
			sans-serif;
		color: #475569;
		border-bottom: 2px solid #cbd5e1;
	}
	td {
		padding: 10px 32px 10px 0;
		border-bottom: 1px solid #e2e8f0;
	}
	.cancelled {
		font-weight: 700;
		color: #16a34a;
	}
	.allowed {
		color: #475569;
	}
</style>
