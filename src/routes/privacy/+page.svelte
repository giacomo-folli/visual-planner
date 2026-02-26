<svelte:head>
	<title>visual-planner | Privacy Policy</title>
</svelte:head>

<div class="home-container">
	<div class="hero">
		<h1>Privacy Policy</h1>
	</div>

	<div class="content">
		<section class="feature">
			<p>Visual-Planner requires access to your Google account for the following purposes:</p>
			<ul class="list-disc">
				<li>
					View your calendars to display your events in a year-view format for better planning.
				</li>
			</ul>
		</section>

		<section class="feature">
			<p>
				<strong>
					Visual-Planner does not transfer, store, or share your personal data or any other
					information.
				</strong>
			</p>
		</section>

		<div class="cta">
			<a href="/planner" class="btn">Open Planner</a>
			<a href="/home" class="btn btn-secondary">Home</a>
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

	h1 {
		font-size: 2.5rem;
		margin: 0 0 0.5rem 0;
		letter-spacing: 0.15em;
		font-weight: 400;
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

	.list-disc {
		list-style-type: disc;
	}
</style>
