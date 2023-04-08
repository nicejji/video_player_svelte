<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';
	import FloatingBox from '$lib/components/UI/FloatingBox.svelte';

	const dispatch = createEventDispatcher();

	export let sources: { url: string; label: string }[];
	export let currentSource: { url: string; label: string };

	const onChange = () => dispatch('change');
</script>

<FloatingBox>
	<button class="btn btn-icon variant-glass-surface" slot="content" on:click={() => {}}>
		<iconify-icon icon={'material-symbols:grid-view-rounded'} />
	</button>
	<div
		class="card p-4 variant-glass-surface flex flex-col items-center gap-3"
		slot="box"
		transition:fade
	>
		{#each sources as source}
			<button
				class="btn btn-sm"
				class:variant-filled-secondary={currentSource === source}
				class:variant-glass-surface={currentSource !== source}
				on:click={() => {
					currentSource = source;
					onChange();
				}}>{source.label}</button
			>
		{/each}
	</div>
</FloatingBox>
