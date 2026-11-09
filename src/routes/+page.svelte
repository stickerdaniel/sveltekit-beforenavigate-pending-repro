<script>
	import { beforeNavigate, goto } from '$app/navigation';
	import { navigating } from '$app/state';
	import { log } from '../lib/log.svelte.js';

	let { data } = $props();
	let count = 0;

	// The editor holds an unsaved draft, so every navigation that leaves it is cancelled.
	beforeNavigate(({ type, to, cancel }) => {
		const leaves = to?.url.pathname !== '/';
		if (leaves) cancel();
		log.push({
			type,
			to: to ? to.url.pathname + to.url.search : 'null',
			result: leaves ? 'cancelled' : 'allowed'
		});
	});

	function apply_filter() {
		count += 1;
		goto(`?filter=${count}`, { replace: true, reset: false });
	}
</script>

<main>
	<h1>Editor</h1>
	<p>Unsaved draft. <code>beforeNavigate</code> cancels every navigation that leaves this page.</p>
	<p>
		Filter: <strong>{data.filter ?? 'none'}</strong>
		{#if navigating.to}<span class="pending">loading {navigating.to.url.search}</span>{/if}
	</p>
	<div class="actions">
		<button onclick={apply_filter}>Apply filter</button>
		<a href="/other">Leave to /other</a>
	</div>
</main>

<style>
	.pending {
		margin-left: 12px;
		color: #b45309;
		font-weight: 600;
	}
	.actions {
		display: flex;
		gap: 20px;
		align-items: center;
		margin-top: 20px;
	}
	.actions a {
		font-size: 18px;
		font-weight: 600;
	}
</style>
