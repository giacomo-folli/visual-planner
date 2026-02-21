<script lang="ts">
	import favicon from '$lib/assets/icon.png';
	import syncIcon from '$lib/assets/sync.png';
</script>

<svelte:head>
	<title>visual-planner 2.0 | Home</title>
</svelte:head>

<div class="home-container">
	<div class="hero">
		<img src={favicon} alt="visual-planner icon" class="icon" />
		<h1>visual-planner 2.0</h1>
		<p class="subtitle">Year-view planner for your Google Calendar</p>
	</div>

	<div class="content">
		<section class="feature">
			<h2>What is visual-planner?</h2>
			<p>
				Visual-planner is a free, open-source web application that transforms how you view your
				Google Calendar events. Instead of navigating month-by-month, see your entire year at a
				glance with an intuitive year-view layout.
			</p>
		</section>

		<section class="feature">
			<h2>Key Features</h2>
			<ul class="list-disc">
				<li><strong>Year View</strong> - See all 12 months on one screen</li>
				<li class="line-through">
					<strong>Month View</strong> - Detailed view for focused planning
				</li>
				<li><strong>Google Calendar Integration</strong> - Sync your events instantly</li>
				<li>
					<strong>Privacy First</strong> - Your data stays with you, never stored or shared
				</li>
			</ul>
		</section>

		<section class="feature">
			<h2>Getting Started</h2>
			<div>
				Click the <span
					><img class="mx-1 inline" src={syncIcon} width="18px" alt="sync icon" /></span
				>
				button to connect your Google Calendar and start visualizing your year.

				<span class="line-through">
					Toggle between year and month views to find the planning perspective that works best for
					you.
				</span>
			</div>
		</section>

		<div class="cta">
			<a href="/" class="btn">Open Planner</a>
			<a href="/privacy" class="btn btn-secondary">Privacy Policy</a>
		</div>
	</div>
</div>

<style>
	.home-container {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	.hero {
		text-align: center;
		margin-bottom: 3rem;
		border-bottom: 2px solid #111;
		padding-bottom: 2rem;
	}

	.icon {
		width: 80px;
		height: 80px;
		margin-bottom: 1rem;
	}

	h1 {
		font-size: 2.5rem;
		margin: 0 0 0.5rem 0;
		letter-spacing: 0.15em;
		font-weight: 400;
	}

	.subtitle {
		font-size: 1.125rem;
		color: #666;
		margin: 0;
	}

	.content {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.feature {
		line-height: 1.6;
		color: #333;
	}

	.feature h2 {
		font-size: 1.5rem;
		margin: 0 0 0.75rem 0;
		font-weight: 500;
	}

	.feature p {
		margin: 0;
	}

	.feature ul {
		margin: 0;
		padding-left: 1.5rem;
	}

	.feature li {
		margin-bottom: 0.75rem;
	}

	.cta {
		display: flex;
		gap: 1rem;
		margin-top: 2rem;
		justify-content: center;
		flex-wrap: wrap;
	}

	.btn {
		padding: 0.75rem 1.5rem;
		border: 2px solid #111;
		text-decoration: none;
		font-weight: 500;
		transition: all 0.2s;
		display: inline-block;
		background: #111;
		color: white;
	}

	.btn:hover {
		background: #333;
		border-color: #333;
	}

	.btn-secondary {
		background: white;
		color: #111;
	}

	.btn-secondary:hover {
		background: #f5f5f5;
	}
</style>
