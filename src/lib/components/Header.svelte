<script lang="ts">
	interface Props {
		title: number | string;
		next: () => void;
		prev: () => void;
	}

	let { title, next, prev }: Props = $props();
</script>

<div class="header">
	<button onclick={prev} class="nav-btn">&lsaquo;</button>
	<h1 class="year-title">{title}</h1>
	<button onclick={next} class="nav-btn">&rsaquo;</button>
</div>

<style>
	.header {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1.5rem;
		border-bottom: 2px solid #111;
	}

	.year-title {
		min-width: fit-content;
		font-weight: 400;
		letter-spacing: 0.15em;
		margin: 0;
		color: #111;
	}

	.nav-btn {
		background: none;
		border: none;
		font-size: 1.5rem;
		cursor: pointer;
		color: #555;
		padding: 0.1rem 0.4rem;
		line-height: 1;
	}

	.nav-btn:hover {
		color: #000;
	}
</style>
