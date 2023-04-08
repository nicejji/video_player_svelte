<script lang="ts">
	import { exitFS, enterFS } from '$lib/utils/utils';
	export let container: HTMLElement;
	export let inFullScreen: Boolean;

	const switchFS = () => {
		inFullScreen ? exitFS() : enterFS(container);
		inFullScreen = !inFullScreen;
	};
	const onKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'f') switchFS();
	};
</script>

<button class="btn btn-icon variant-glass-surface" on:click={switchFS}>
	<iconify-icon
		icon={inFullScreen
			? 'material-symbols:fullscreen-exit-rounded'
			: 'material-symbols:fullscreen-rounded'}
	/>
</button>

<svelte:window on:keydown={onKeyDown} />
