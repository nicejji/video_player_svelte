<script lang="ts">
	export let paused: boolean;

	const onKeydown = (e: KeyboardEvent) => {
		if (e.key === ' ') paused = !paused;
	};
</script>

<button class="btn btn-icon variant-glass-surface" on:click={() => (paused = !paused)}>
	<iconify-icon
		class="text-xl"
		icon={paused ? 'material-symbols:play-arrow-rounded' : 'material-symbols:pause-rounded'}
	/>
</button>

<svelte:window on:keydown={onKeydown} />
